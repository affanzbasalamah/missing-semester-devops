# Images & assets

Where to put images for the site, and how to reference them.

## Two options

### 1. `src/assets/…` — optimized (recommended for screenshots & diagrams)

Images here are **optimized at build time** by Astro (compressed, converted to WebP/AVIF,
given width/height). Organized to mirror the docs:

```
src/assets/
  modules/<module-slug>/   e.g. modules/03-network/topology.png
  guides/
```

Reference them with a **relative path from the Markdown file**. The depth matters:

- From a **module lesson** page (`src/content/docs/modules/03-network/openwrt.md`):
  ```markdown
  ![Network topology](../../../../assets/modules/03-network/topology.png)
  ```
  (four `../` to climb from `modules/03-network/` up to `src/`, then into `assets/`)

- From a **guide** page (`src/content/docs/guides/hardware.md`):
  ```markdown
  ![Parts photo](../../assets/guides/parts.jpg)
  ```
  (two `../` to climb from `guides/` up to `src/`)

### 2. `public/images/…` — served as-is (for files that must stay byte-for-byte)

Files here are **not** processed — copied to the site root unchanged. Use for downloadable
files (PDFs), favicons, or an image whose exact bytes/filename must be preserved. Reference
with an **absolute path** (no `../` counting needed):

```markdown
![Diagram](/images/some-diagram.png)
```

## Which to use

- **Screenshots** (Wireshark, dashboards, terminal output) → `src/assets/…` (option 1). They're
  large PNGs; optimization noticeably shrinks them.
- **Structural diagrams** → prefer **Mermaid** (write them as text in the page — see
  `src/content/docs/guides/diagrams.md`), so they stay version-controlled and theme-aware. Use an
  image only for annotated screenshots.
- **A file to download / exact bytes** → `public/images/…` (option 2).

## Workflow reminders

- **Commit the image *and* the Markdown that references it** in the same push. An untracked image
  = a broken build or a 404.
- **Compress before committing** so the repo stays lean (Cloudflare Pages allows 25 MB/file, but
  keep screenshots reasonable).
- **Scrub sensitive data** from screenshots — real public IPs, tokens, keys — before committing.
  Once pushed and deployed, it's public and permanent (see Lesson 0.4).
- **Preview locally** with `npm run dev` before pushing to catch a wrong path — a bad relative
  path can fail the build (which safely leaves the current live site unchanged).

_The `.gitkeep` files just keep these otherwise-empty folders tracked in git; delete one once its
folder has real images in it, or leave it — it's harmless._
