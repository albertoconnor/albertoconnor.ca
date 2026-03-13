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

## Deployment

The site is configured to deploy to **GitHub Pages** automatically via GitHub Actions whenever changes are pushed to the `2026` (or `main`) branch.
