#!/usr/bin/env python3
# /// script
# requires-python = ">=3.9"
# dependencies = ["markdown>=3.5"]
# ///
"""Publish 2brn dev-log posts to the static site.

Reads the daily blog posts that the 2brn daemon generates into its local SQLite
database (``~/.2brn/2brn.db``, table ``blog_posts``), renders each one's Markdown
into a styled HTML page that matches this site, and regenerates ``blog/index.html``.

The site has no server-side build — the generated HTML is what GitHub Pages serves,
so the files this writes are meant to be committed.

Run it (zero setup, picks up the ``markdown`` dependency automatically):

    uv run tools/publish.py --dry-run          # show what would be published
    uv run tools/publish.py --all              # render every non-empty post
    uv run tools/publish.py --date 2026-06-13  # render one day
    uv run tools/publish.py --since 2026-06-10 # render that day onward

Or with plain Python after ``pip install -r tools/requirements.txt``:

    python3 tools/publish.py --all

NOTE: this repo is public, so a pushed branch is world-visible. Review the generated
posts locally (nothing client/employer-confidential) BEFORE committing and pushing.
"""
from __future__ import annotations

import argparse
import html
import os
import re
import sqlite3
import sys
from datetime import date, datetime
from pathlib import Path
from string import Template

try:
    import markdown
except ImportError:
    sys.exit(
        "Missing dependency 'markdown'.\n"
        "  Run with uv:   uv run tools/publish.py ...\n"
        "  Or with pip:   pip install -r tools/requirements.txt"
    )

# --- paths ------------------------------------------------------------------
TOOLS_DIR = Path(__file__).resolve().parent
REPO_ROOT = TOOLS_DIR.parent
BLOG_DIR = REPO_ROOT / "blog"
TEMPLATES_DIR = TOOLS_DIR / "templates"

# Existing hand-written posts that aren't in the 2brn DB but should stay listed
# in the index. Newest publish runs rebuild the index from these + the DB posts.
MANUAL_POSTS = [
    {
        "date": "2026-05-23",
        "title": "hello world",
        "href": "hello-world.html",
        "excerpt": "this is the first post. software is ideas. ideas should be free, for the good of the world.",
    },
]


def db_path() -> Path:
    """Location of the 2brn SQLite DB (honours the BRN_HOME override)."""
    home = os.environ.get("BRN_HOME")
    base = Path(home) if home else Path.home() / ".2brn"
    return base / "2brn.db"


def open_db(path: Path):
    """Open the DB read-only, tolerating WAL/locking quirks. Returns a connection
    or None if the file is missing/unreadable."""
    if not path.exists():
        return None
    attempts = [
        (f"file:{path}?immutable=1", {"uri": True}),
        (f"file:{path}?mode=ro&nolock=1", {"uri": True}),
        (str(path), {"timeout": 5.0}),
    ]
    for dsn, kw in attempts:
        try:
            con = sqlite3.connect(dsn, **kw)
            con.execute("SELECT 1 FROM blog_posts LIMIT 1")
            return con
        except sqlite3.Error:
            continue
    return None


def fetch_posts(con) -> list:
    """All non-empty posts as (date_str, content), oldest first."""
    rows = con.execute(
        "SELECT date, content FROM blog_posts "
        "WHERE content IS NOT NULL AND TRIM(content) != '' "
        "ORDER BY date ASC"
    ).fetchall()
    return [(r[0], r[1]) for r in rows]


def select_posts(posts: list, args) -> list:
    """Filter posts by the CLI selectors."""
    if args.date:
        return [p for p in posts if p[0] == args.date]
    if args.since:
        posts = [p for p in posts if p[0] >= args.since]
    if args.limit:
        posts = posts[-args.limit:]
    return posts


# --- rendering --------------------------------------------------------------
_LIST_RE = re.compile(r"\s*([-*+]|\d+\.)\s+")


def _normalize_md(md_text: str) -> str:
    """2brn often writes a list directly under a bold header with no blank line in
    between; python-markdown needs that blank line to start a list. Insert one."""
    out: list = []
    for line in md_text.split("\n"):
        if _LIST_RE.match(line) and out and out[-1].strip() and not _LIST_RE.match(out[-1]):
            out.append("")
        out.append(line)
    return "\n".join(out)


def render_body(md_text: str) -> str:
    return markdown.markdown(
        _normalize_md(md_text.strip()),
        extensions=["extra"],
        output_format="html5",
    )


_MD_NOISE = re.compile(r"(\*\*|__|[*_`#>]|^\s*[-+]\s+)")


def make_excerpt(md_text: str, limit: int = 160) -> str:
    """A one-line plain-text teaser from the first real line of the post."""
    for raw in md_text.strip().splitlines():
        line = raw.strip()
        if not line:
            continue
        line = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", line)  # [text](url) -> text
        line = _MD_NOISE.sub("", line).strip()
        if not line:
            continue
        if len(line) > limit:
            line = line[: limit - 1].rstrip() + "…"
        return line
    return ""


def fmt_title(date_str: str) -> str:
    d = date.fromisoformat(date_str)
    return d.strftime("%d %B %Y").lstrip("0").lower()  # "13 june 2026"


def fmt_weekday(date_str: str) -> str:
    return date.fromisoformat(date_str).strftime("%A").lower()  # "saturday"


def load_template(name: str) -> Template:
    return Template((TEMPLATES_DIR / name).read_text(encoding="utf-8"))


def post_filename(date_str: str) -> str:
    return f"{date_str}.html"


def build_post_html(date_str: str, content: str, tmpl: Template) -> str:
    return tmpl.substitute(
        title=html.escape(fmt_title(date_str)),
        date_display=html.escape(fmt_weekday(date_str)),
        body=render_body(content),
    )


ENTRY_TMPL = Template(
    '        <a class="blog-entry" href="$href">\n'
    '          <span class="blog-entry__title">$title</span>\n'
    '          <span class="blog-entry__date">$date</span>\n'
    "$excerpt"
    "        </a>"
)


def build_entry(date_display: str, title: str, href: str, excerpt: str) -> str:
    excerpt_html = ""
    if excerpt:
        excerpt_html = (
            '          <span class="blog-entry__excerpt">'
            + html.escape(excerpt)
            + "</span>\n"
        )
    return ENTRY_TMPL.substitute(
        href=html.escape(href),
        title=html.escape(title),
        date=html.escape(date_display),
        excerpt=excerpt_html,
    )


def build_index_html(entries: list, tmpl: Template) -> str:
    # entries: list of dicts {date, title, href, excerpt}; newest first.
    # Headline is the formatted date; the right column shows the weekday.
    ordered = sorted(entries, key=lambda e: e["date"], reverse=True)
    blocks = [
        build_entry(fmt_weekday(e["date"]), e["title"], e["href"], e.get("excerpt", ""))
        for e in ordered
    ]
    return tmpl.substitute(entries="\n".join(blocks))


# --- main -------------------------------------------------------------------
def main() -> int:
    ap = argparse.ArgumentParser(description="Publish 2brn dev-log posts to the site.")
    sel = ap.add_mutually_exclusive_group()
    sel.add_argument("--date", help="publish a single day (YYYY-MM-DD)")
    sel.add_argument("--since", help="publish posts on/after this date (YYYY-MM-DD)")
    sel.add_argument("--all", action="store_true", help="publish every non-empty post")
    ap.add_argument("--limit", type=int, help="cap to the most recent N selected posts")
    ap.add_argument("--dry-run", action="store_true", help="show actions, write nothing")
    args = ap.parse_args()

    for val, name in ((args.date, "--date"), (args.since, "--since")):
        if val:
            try:
                date.fromisoformat(val)
            except ValueError:
                ap.error(f"{name} must be YYYY-MM-DD, got {val!r}")

    if not (args.date or args.since or args.all):
        ap.error("choose what to publish: --all, --date YYYY-MM-DD, or --since YYYY-MM-DD")

    con = open_db(db_path())
    if con is None:
        print(f"No readable 2brn DB at {db_path()} — rebuilding the index from manual posts only.")
        all_posts = []
    else:
        try:
            all_posts = fetch_posts(con)
        finally:
            con.close()
        # Manual posts win their date — drop any DB post that would collide.
        manual_dates = {p["date"] for p in MANUAL_POSTS}
        shadowed = [d for d, _ in all_posts if d in manual_dates]
        if shadowed:
            print("skipping DB post(s) shadowed by a manual post: " + ", ".join(shadowed))
        all_posts = [(d, c) for d, c in all_posts if d not in manual_dates]

    selected = select_posts(all_posts, args)
    if not selected:
        print("No posts selected to (re)generate — refreshing the index only.")

    post_tmpl = load_template("post.html")
    index_tmpl = load_template("index.html")

    if not args.dry_run:
        BLOG_DIR.mkdir(parents=True, exist_ok=True)

    generated = []
    for date_str, content in selected:
        fname = post_filename(date_str)
        generated.append(
            {
                "date": date_str,
                "title": fmt_title(date_str),
                "href": fname,
                "excerpt": make_excerpt(content),
            }
        )
        if args.dry_run:
            print(f"would write blog/{fname}  ({len(content)} chars)")
            continue
        (BLOG_DIR / fname).write_text(
            build_post_html(date_str, content, post_tmpl), encoding="utf-8"
        )
        print(f"wrote blog/{fname}")

    # Rebuild the index from the manual posts + everything in the DB (not just the
    # selection) so the list is always complete and correctly ordered.
    index_entries = list(MANUAL_POSTS)
    for date_str, content in all_posts:
        index_entries.append(
            {
                "date": date_str,
                "title": fmt_title(date_str),
                "href": post_filename(date_str),
                "excerpt": make_excerpt(content),
            }
        )
    index_html = build_index_html(index_entries, index_tmpl)
    if args.dry_run:
        print(f"would regenerate blog/index.html  ({len(index_entries)} entries)")
    else:
        (BLOG_DIR / "index.html").write_text(index_html, encoding="utf-8")
        print(f"regenerated blog/index.html  ({len(index_entries)} entries)")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
