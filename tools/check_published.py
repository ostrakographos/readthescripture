#!/usr/bin/env python3
"""
check_published.py — pre-commit integrity gate for published/ HTML.

Mechanically verifies the failure modes that have repeatedly cost time on this
project (truncation, NUL bytes, inconsistent nav cache-bust, missing or
truncated SEO wiring). Run it before any commit that touches published/.

  python tools/check_published.py             # defaults to <repo>/published
  python tools/check_published.py published   # or name the directory

Exit code 0 = clean, 1 = at least one ERROR. WARN lines never block.
An empty or missing target directory is an ERROR, never a silent pass.

Per-file ERRORS:
  * NUL byte present            (bash-mount write artifact / corruption)
  * not valid UTF-8             (wrong-codec write)
  * mojibake signature          (UTF-8 read as cp1252 and re-saved — the
                                 2026-07-18 nav-v24 re-stamp corrupted all 46
                                 pages this way and the gate passed it)
  * </html> missing             (truncation)
  * no nav.js?v= reference       (nav not wired)
  * <link rel="canonical"> missing
  * <meta name="description"> missing or empty
  * <meta name="keywords"> missing or empty
  * og:description present but != description  (apostrophe-truncation / drift)
  * draft hx paragraph tags present  (class="hx" spans are draft-only reference
                                 apparatus for review conversations; they must
                                 be stripped at the gate — leaked 2026-07-17
                                 on the_prophet_who_couldnt_sleep, caught
                                 2026-07-19)

Cross-file ERROR:
  * nav.js?v= values not identical across all pages

This script is the machine half of the publication wiring checklist: it
verifies every page carries its required metadata and that no file was
truncated or corrupted in transit.
"""
import re
import sys
import glob
import os
import io

if sys.stdout.encoding and sys.stdout.encoding.lower() != 'utf-8':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(HERE)
# Optional argv override; the pre-commit hook passes "published" explicitly.
# Relative paths resolve against the repo root, not the caller's cwd, so the
# gate checks the same tree no matter where it is invoked from.
if len(sys.argv) > 1:
    PUB = sys.argv[1] if os.path.isabs(sys.argv[1]) else os.path.join(REPO, sys.argv[1])
else:
    PUB = os.path.join(REPO, 'published')


def attr(text, pattern):
    m = re.search(pattern, text)
    return m.group(1) if m else None


# --- mojibake detection -----------------------------------------------------
# A UTF-8 file read as cp1252 and re-saved as UTF-8 turns every non-ASCII
# character into a run of cp1252 characters whose byte values spell the
# original UTF-8 sequence ("—" -> "â€”"). Detector: a character whose cp1252
# byte is a UTF-8 lead byte (0xC2-0xF4), followed by characters whose cp1252
# bytes are continuation bytes (0x80-0xBF), the whole run reversing to valid
# UTF-8. Legitimate accented text (transliterations like "qādôš") never
# satisfies the full-sequence condition, so this flags only real garbling.
_CP1252_BYTE = {}
for _i in range(256):
    try:
        _CP1252_BYTE[bytes([_i]).decode('cp1252')] = _i
    except UnicodeDecodeError:
        _CP1252_BYTE[chr(_i)] = _i  # undefined slots pass through


def mojibake_runs(text):
    """Return up to 3 sample garbled runs found in text (empty list = clean)."""
    samples = []
    i, n = 0, len(text)
    while i < n and len(samples) < 3:
        b = _CP1252_BYTE.get(text[i])
        if b is not None and 0xC2 <= b <= 0xF4:
            need = 2 if b < 0xE0 else 3 if b < 0xF0 else 4
            chunk = text[i:i + need]
            if len(chunk) == need and all(c in _CP1252_BYTE for c in chunk):
                try:
                    bytes(_CP1252_BYTE[c] for c in chunk).decode('utf-8')
                    samples.append(chunk)
                    i += need
                    continue
                except UnicodeDecodeError:
                    pass
        i += 1
    return samples


def main():
    errors = []
    warns = []
    versions = {}  # version string -> [files]

    files = sorted(glob.glob(os.path.join(PUB, '*.html')))
    if not files:
        print('check_published: no HTML files found in', PUB)
        return 1

    for f in files:
        name = os.path.basename(f)
        raw = open(f, 'rb').read()

        # --- corruption checks (raw bytes) ---
        if b'\x00' in raw:
            errors.append(f'{name}: contains NUL byte(s) ({raw.count(bytes([0]))} found)')
        try:
            raw.decode('utf-8')
        except UnicodeDecodeError as e:
            errors.append(f'{name}: not valid UTF-8 (byte 0x{raw[e.start]:02x} '
                          f'at offset {e.start}) — wrong-codec write')
        text = raw.decode('utf-8', errors='replace')
        garbled = mojibake_runs(text)
        if garbled:
            errors.append(f'{name}: mojibake (UTF-8 read as cp1252 and re-saved) — '
                          f'e.g. {garbled!r}')
        if '</html>' not in text.lower():
            errors.append(f'{name}: missing </html> (truncated?)')

        # --- nav wiring ---
        vs = set(re.findall(r'nav\.js\?v=(\d+)', text))
        if not vs:
            errors.append(f'{name}: no nav.js?v= reference')
        for v in vs:
            versions.setdefault(v, []).append(name)
        if len(vs) > 1:
            errors.append(f'{name}: multiple nav.js?v= values in one file: {sorted(vs)}')

        # --- SEO wiring (rule 25) ---
        if '<link rel="canonical"' not in text:
            errors.append(f'{name}: missing <link rel="canonical">')

        desc = attr(text, r'<meta name="description" content="([^"]*)"')
        if not desc:
            errors.append(f'{name}: missing or empty <meta name="description">')

        # --- draft apparatus leak (rule: hx tags never publish) ---
        hx = len(re.findall(r'class="hx"', text))
        if hx:
            errors.append(f'{name}: {hx} draft hx paragraph tag(s) present — '
                          f'strip class="hx" spans (and the .hx CSS rule) '
                          f'before publishing')

        kw = attr(text, r'<meta name="keywords" content="([^"]*)"')
        if not kw:
            warns.append(f'{name}: missing or empty <meta name="keywords">')

        og = attr(text, r'<meta property="og:description" content="([^"]*)"')
        if og is None:
            warns.append(f'{name}: missing og:description')
        elif desc is not None and og != desc:
            # the apostrophe-truncation bug produced an og that is a short
            # prefix of the description; any mismatch is worth blocking.
            errors.append(f'{name}: og:description != description '
                          f'(og {len(og)} chars vs desc {len(desc)} chars) — '
                          f'truncation or drift')

    # --- cross-file: uniform nav version ---
    if len(versions) > 1:
        detail = ', '.join(f'v={v} ({len(versions[v])} pages)' for v in sorted(versions))
        errors.append(f'nav.js?v= is not uniform across pages: {detail}')

    # --- report ---
    nver = next(iter(versions)) if len(versions) == 1 else '?'
    print(f'check_published: {len(files)} pages scanned, nav.js?v={nver}')
    for w in warns:
        print('  WARN  ' + w)
    for e in errors:
        print('  ERROR ' + e)
    if errors:
        print(f'\nFAILED: {len(errors)} error(s). Fix before committing.')
        return 1
    print('OK: all checks passed.')
    return 0


if __name__ == '__main__':
    sys.exit(main())
