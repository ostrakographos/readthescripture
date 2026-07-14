#!/usr/bin/env python3
"""Boundary check for the public repository.

Scans every text file in the repo for tokens that belong to the private
workbench and must never appear in the public record: private file and
directory names, personal identifiers, and workbench path fragments.

Run from the repo root:  python tools/check_public.py
Wired as a pre-commit hook; a hit is a hard stop, not a warning.
"""

import sys
from pathlib import Path

FORBIDDEN = [
    # personal identifiers
    "REDACTED-IDENTIFIER",
    "REDACTED-DOMAIN",
    # private files and directories (workbench scaffolding)
    "REDACTED-PATH",
    "REDACTED-PATH",
    "STANDING-CORRECTION",  # singular form also catches the plural
    "START-HERE",
    "OPEN-GATES",
    "RECEIPT-TEMPLATE",
    "INVENTORY",  # bare all-caps form also catches INVENTORY.md
    "receipts/",
    "rejected/",
    "drafts/",
    "transcripts/",
    "TOPIC-BACKLOG",
    "REDACTED-PATH",
    # environment remnants
    "Cowork",
    "cowork",
    "AppData",
    "C:\\Users",
    "C:/Users",
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
        try:
            text = path.read_text(encoding="utf-8", errors="replace")
        except OSError as exc:
            hits.append((rel, 0, f"<unreadable: {exc}>"))
            continue
        for lineno, line in enumerate(text.splitlines(), 1):
            for token in FORBIDDEN:
                if token in line:
                    hits.append((rel, lineno, token))

    if hits:
        print("check_public: BOUNDARY VIOLATIONS FOUND")
        for rel, lineno, token in hits:
            print(f"  {rel}:{lineno}: forbidden token {token!r}")
        return 1
    print("check_public: clean — no private tokens in the public tree.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
