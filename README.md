# rohan-desai.vercel.app

Personal site. Plain static HTML, CSS and JavaScript, no build step.

- `index.html`, `style.css`, `main.js` — the site. The hero is an 8×8 board; the knight follows the cursor by legal moves and takes the shortest path (BFS) to a clicked square.
- `favicon.svg`, `og.png`, `resume.pdf` — assets.
- `design/previews/` — the three concept previews this design was picked from. Not deployed.

Run locally:

```bash
python3 -m http.server 4173
```

Deploy: any static host. On Vercel, import the repo with framework preset "Other" and no build command; the root is the output directory.
