#!/usr/bin/env python3
"""Boundary check for the public repository.

The actual forbidden tokens live outside this repo, in a sidecar file on the
private side (../private/tools/forbidden_tokens.json, a sibling of this repo
under the shared parent directory). That file is never committed here — only
its two categories are described below:

1. FORBIDDEN_EVERYWHERE — personal identifiers, private paths, and the names
   of quarantined personal files. These may never appear anywhere in the
   public tree, exhibits included.
2. FORBIDDEN_OUTSIDE_EXHIBITS — names of internal workbench files and
   directories. Barred from the authored public record (which must stand
   alone), but permitted inside exhibits/: an exhibit is a workbench document
   shown as-is, and the editor's ruling (2026-07-14) is that internal file
   NAMES are harmless — what stays private is their content, not their
   existence.

Run from the repo root:  python tools/check_public.py
Wired as a pre-commit hook; a hit is a hard stop, not a warning.
This check requires the private sidecar to be present alongside this repo;
it fails closed (blocks the commit) if the sidecar cannot be read, rather
than silently skipping the scan.
"""

import json
import sys
from pathlib import Path

TEXT_EXT = {".html", ".md", ".js", ".json", ".txt", ".xml", ".py", ".css", ".jsonl"}
SKIP_DIRS = {".git"}


def load_tokens(repo_root: Path):
    sidecar = repo_root.parent / "private" / "tools" / "forbidden_tokens.json"
    try:
        data = json.loads(sidecar.read_text(encoding="utf-8"))
        return data["FORBIDDEN_EVERYWHERE"], data["FORBIDDEN_OUTSIDE_EXHIBITS"]
    except (OSError, KeyError, json.JSONDecodeError) as exc:
        print(f"check_public: cannot load token sidecar at {sidecar}: {exc}")
        print("check_public: BLOCKED - boundary check requires the private sidecar file.")
        sys.exit(1)


def main() -> int:
    root = Path(__file__).resolve().parent.parent
    forbidden_everywhere, forbidden_outside_exhibits = load_tokens(root)
    hits = []
    for path in sorted(root.rglob("*")):
        if not path.is_file() or path.suffix.lower() not in TEXT_EXT:
            continue
        rel = path.relative_to(root).as_posix()
        if any(part in SKIP_DIRS for part in path.parts):
            continue
        in_exhibits = rel.startswith("exhibits/")
        tokens = forbidden_everywhere if in_exhibits else forbidden_everywhere + forbidden_outside_exhibits
        try:
            text = path.read_text(encoding="utf-8", errors="replace")
        except OSError as exc:
            hits.append((rel, 0, f"<unreadable: {exc}>"))
            continue
        for lineno, line in enumerate(text.splitlines(), 1):
            for token in tokens:
                if token in line:
                    hits.append((rel, lineno, token))

    if hits:
        print("check_public: BOUNDARY VIOLATIONS FOUND")
        for rel, lineno, token in hits:
            print(f"  {rel}:{lineno}: forbidden token {token!r}")
        return 1
    print("check_public: clean - no private tokens in the public tree.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
