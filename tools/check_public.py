#!/usr/bin/env python3
"""Boundary check for the public repository.

Two tiers of forbidden tokens:

1. FORBIDDEN_EVERYWHERE — personal identifiers, private paths, and the names of
   quarantined personal files. These may never appear anywhere in the public
   tree, exhibits included.
2. FORBIDDEN_OUTSIDE_EXHIBITS — names of internal workbench files and
   directories. Barred from the authored public record (which must stand
   alone), but permitted inside exhibits/: an exhibit is a workbench document
   shown as-is, and the editor's ruling (2026-07-14) is that internal file
   NAMES are harmless — what stays private is their content, not their
   existence.

Run from the repo root:  python tools/check_public.py
Wired as a pre-commit hook; a hit is a hard stop, not a warning.
"""

import sys
from pathlib import Path

FORBIDDEN_EVERYWHERE = [
    # personal identifiers
    "REDACTED-IDENTIFIER",
    "REDACTED-DOMAIN",
    # quarantined personal files / private paths
    "REDACTED-PATH",
    "REDACTED-PATH",
    "REDACTED-PATH",
    # environment remnants
    "AppData",
    "C:\\Users",
    "C:/Users",
]

FORBIDDEN_OUTSIDE_EXHIBITS = [
    # internal workbench file and directory names
    "STANDING-CORRECTION",  # singular form also catches the plural
    "START-HERE",
    "OPEN-GATES",
    "RECEIPT-TEMPLATE",
    "INVENTORY",  # bare all-caps form also catches INVENTORY.md
    "TOPIC-BACKLOG",
    "receipts/",
    "rejected/",
    "drafts/",
    "notes/",
    "transcripts/",
    # internal environment vocabulary
    "Cowork",
    "cowork",
]

TEXT_EXT = {".html", ".md", ".js", ".json", ".txt", ".xml", ".py", ".css", ".jsonl"}
SKIP_DIRS = {".git"}
SKIP_FILES = {"tools/check_public.py"}  # this file names the tokens it hunts


def main() -> int:
    root = Path(__file__).resolve().parent.parent
    hits = []
    for path in sorted(root.rglob("*")):
        if not path.is_file() or path.suffix.lower() not in TEXT_EXT:
            continue
        rel = path.relative_to(root).as_posix()
        if any(part in SKIP_DIRS for part in path.parts) or rel in SKIP_FILES:
            continue
        in_exhibits = rel.startswith("exhibits/")
        tokens = FORBIDDEN_EVERYWHERE if in_exhibits else FORBIDDEN_EVERYWHERE + FORBIDDEN_OUTSIDE_EXHIBITS
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
