# albertoconnor.ca 2026

Modernized Pelican site using Tailwind CSS, HTMX, and `uv` for dependency management.

## Prerequisites

- [uv](https://github.com/astral-sh/uv) (Python package manager)
- [Node.js & npm](https://nodejs.org/) (for Tailwind CSS compilation)

## Setup

1.  **Clone the repository** (if you haven't already).
2.  **Install Python dependencies**:
    ```bash
    uv sync
    ```
3.  **Install Node dependencies**:
    ```bash
    npm install
    ```

## Development

To run the site locally with auto-reloading:

1.  **Start the CSS watcher** (in one terminal tab):
    ```bash
    npm run watch:css
    ```
2.  **Start the Pelican dev server** (in another terminal tab):
    ```bash
    uv run make devserver
    ```
    The site will be available at `http://localhost:8000`.

## Building for Production

To generate the final static files:

1.  **Compile the CSS**:
    ```bash
    npm run build:css
    ```
2.  **Generate the HTML**:
    ```bash
    uv run make publish
    ```
    The output will be in the `output/` directory.

## Writing & Publishing Articles

### Article Header Metadata
Pelican uses Python-Markdown's `Meta` extension. Headers are simple `Key: Value` lines at the top of the file.
- **Do not use YAML `---` fences** around headers. Pelican expects headers to start at line 1 and end with a blank line before the content.

```markdown
Title: My Great Article
Date: 2026-09-17
Tags: Python, Django
Category: Writing
Slug: my-great-article
Status: draft
```

### Drafts vs. Hidden vs. Published
- **`Status: draft` (Recommended for previews)**:
  - Generates to `output/drafts/<slug>.html`.
  - Excluded from the homepage (`index.html`), categories, tags, and RSS feeds (`/feeds/all.atom.xml`).
  - Online preview URL: `https://albertoconnor.ca/drafts/<slug>.html`.
- **`Status: hidden`**:
  - Generates directly to `output/<slug>.html`.
  - Also excluded from homepage, categories, tags, and RSS feeds, but lives at its final root URL.
- **Published**:
  - Remove `Status:` or set `Status: published`. The post will appear on the homepage and in the RSS feed.

### Formatting & Line Wrapping (80 Columns)
Because Pelican's metadata has no `---` fences, standard Markdown formatters (`mdformat`, `prettier`) run on the whole file will misinterpret the metadata as a normal paragraph and squash it.
- **In Vim (safest)**:
  1. `:set textwidth=80` (or `:set tw=80`)
  2. Move cursor to the first line of content below the header.
  3. Type `v G` to visually select to the end of the file.
  4. Type `gq` to wrap only the body text without touching headers.

## Embedding Slidev Talks

Slide decks (e.g. from `staff_engineer/business/Talks/<talk-name>`) can be built and embedded under `/talks/<talk-name>/`:

1. Build the presentation with Slidev specifying the base path:
   ```bash
   npx @slidev/cli build slides.md --base /talks/<talk-name>/
   ```
2. Copy the compiled `dist/` directory into the Pelican content directory:
   ```bash
   mkdir -p content/talks/<talk-name>
   cp -r dist/* content/talks/<talk-name>/
   ```
3. Pelican's `STATIC_PATHS` includes `talks`, so files in `content/talks/` are passed through directly to `output/talks/<talk-name>/index.html`.
4. Link to it in blog posts with `/talks/<talk-name>/`.

## Deployment

The site is configured to deploy to **GitHub Pages** automatically via GitHub Actions whenever changes are pushed to `master` (or `main`).

Once pushed, the build workflow runs in ~30–45 seconds. Any post with `Status: draft` can be previewed at:
`https://albertoconnor.ca/drafts/<slug>.html`
