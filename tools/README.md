# tools — blog publishing

`publish.py` turns the daily dev-log posts that the **2brn** app generates into
styled HTML pages for this site. The site has no server-side build, so the HTML this
writes is exactly what GitHub Pages serves — the generated files get committed.

## What it does

1. Reads 2brn's local SQLite DB (`~/.2brn/2brn.db`, table `blog_posts`) — Markdown,
   one post per date. (Override the location with the `BRN_HOME` env var.)
2. Renders each non-empty post into `blog/<date>.html` using `templates/post.html`
   (same design/CSS/nav as the rest of the site).
3. Regenerates `blog/index.html` from the manual posts (see `MANUAL_POSTS` in the
   script) plus every post in the DB, newest first.

## Usage

Zero setup with [uv](https://docs.astral.sh/uv/) (auto-installs the one dependency):

```bash
uv run tools/publish.py --dry-run           # show what would be published
uv run tools/publish.py --all               # render every non-empty post
uv run tools/publish.py --date 2026-06-13   # render a single day
uv run tools/publish.py --since 2026-06-10  # render that day onward
uv run tools/publish.py --all --limit 3     # only the 3 most recent
```

Or with plain Python:

```bash
pip install -r tools/requirements.txt
python3 tools/publish.py --all
```

## ⚠️ Review before you push — this repo is public

Posts are auto-generated from your screen activity. 2brn's prompt already strips
company-confidential material, but **the human check is the real safeguard**, and a
branch pushed to this public repo is world-visible *before* you merge. So:

> Run the script → **read the generated `blog/*.html` locally** → only then commit and
> push. Never push posts you haven't eyeballed.

## Publishing loop

```
2brn generates the post → run publish.py → review locally → commit on a branch
→ open PR → you merge → GitHub Pages deploys → share the link on LinkedIn
```
