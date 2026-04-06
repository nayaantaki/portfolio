# portfolio

## Cloudflare Pages friendly structure

Your current structure works locally on Windows, but Cloudflare Pages runs on Linux and is strict about path casing and file names.
The safest pattern is:

- Keep a single publish root: `root`
- Keep all web pages in `root/src/pages`
- Keep static assets in `root/assets`
- Use lowercase + kebab-case names only
- Avoid spaces and mixed-case in folder/file names

```mermaid
flowchart TD
	A[portfolio/] --> B[root/]
	B --> C[assets/]
	B --> D[src/]

	C --> C1[icons/]
	C --> C2[images/]
	C --> C3[projects/]

	C3 --> P1[evc/]
	C3 --> P2[ez-esports/]
	C3 --> P3[eze-factor/]
	C3 --> P4[marin-3d/]
	C3 --> P5[murder-in-the-bay/]
	C3 --> P6[xr-lab/]

	D --> E[css/]
	D --> F[js/]
	D --> G[data/]
	D --> H[pages/]

	H --> H1[index.html]
	H --> H2[projects/]
	H2 --> H21[evc-cs.html]
	H2 --> H22[ezesports-cs.html]
	H2 --> H23[ezesports-factor-advert-cs.html]
	H2 --> H24[marin-3d-cs.html]
	H2 --> H25[murder-in-the-bay-cs.html]
	H2 --> H26[xr-lab-stickers-cs.html]
```

## Rename map (high impact)

- `assets/project files` -> `assets/projects`
- `assets/project files/ez esports` -> `assets/projects/ez-esports`
- `assets/project files/xr lab` -> `assets/projects/xr-lab`
- `assets/project files/marin3D` -> `assets/projects/marin-3d`
- `src/pages/projects/XR-lab-stickers-cs.html` -> `src/pages/projects/xr-lab-stickers-cs.html`

## Why this prevents 404s

- Linux hosting treats `XR-lab-stickers-cs.html` and `xr-lab-stickers-cs.html` as different files.
- URLs with spaces require exact encoding and are easy to break.
- Cleaner naming reduces fragile relative path bugs across nested pages.

## Cloudflare Pages settings

- Build command: `(none)`
- Build output directory: `root`

If you keep HTML inside `root/src/pages`, either move deployable HTML to `root` or add a build step that copies `src/pages` into the publish root.
