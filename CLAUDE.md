# LeagueWiki — Client-Only React App

## Hard constraints

- **Client-side only.** This app is a static bundle deployed to GitHub Pages. There is no backend, no API server, and no SSR.
- **No Next.js.** Do not introduce Next.js or any framework that assumes a server runtime.
- **Pure React + JS.** No TypeScript. Keep source files as `.jsx`/`.js`.

Any feature that seems to need a server (auth with secrets, a database, server-side rendering) is out of scope for this app as currently architected. If that's genuinely needed, it requires a separate discussion before adding a backend.

## Stack

- **Build tool:** [Vite](https://vite.dev/) (`react` template)
- **UI library:** [react-bootstrap](https://react-bootstrap.github.io/) + `bootstrap` CSS (imported once in `src/main.jsx`)
- **Routing:** [react-router-dom](https://reactrouter.com/) in **declarative mode** (`<Routes>`/`<Route>`, not the data-router `createBrowserRouter` API)

### Why `HashRouter` instead of `BrowserRouter`

GitHub Pages serves static files with no server-side URL rewriting. With `BrowserRouter`, navigating directly to a path like `/about` (via a bookmark, refresh, or shared link) results in a 404 because GitHub Pages has no route at that URL — it can only serve `index.html` for the exact root path.

`HashRouter` puts the route in the URL fragment (`/#/about`), which the browser never sends to the server, so GitHub Pages always serves `index.html` regardless of the current route. This works with zero extra configuration. The tradeoff is less conventional-looking URLs — if that ever becomes a priority, the alternative is `BrowserRouter` plus a `404.html` redirect trick, but that adds moving parts and isn't used here.

## Project structure

```
src/
  components/   shared UI (NavBar, etc.)
  pages/        route-level views, one per route in App.jsx
  App.jsx       HashRouter + Routes wiring
  main.jsx      React root, imports bootstrap CSS
```

## Dev workflow

- `npm run dev` — start the Vite dev server
- `npm run build` — production build to `dist/`
- `npm run preview` — serve the production build locally

## Deploy workflow

GitHub Pages is configured to serve from the `main` branch, `/docs` folder — there is no separate `gh-pages` branch and no CI build step. `vite.config.js` sets `build.outDir` to `docs`, so the built site lands directly where Pages expects it.

To deploy:
1. `npm run build` (outputs to `docs/`)
2. Commit the updated `docs/` folder along with your source changes
3. Push `main`

**One-time prerequisites** (already done, listed for reference):
1. `git init` and commit the project
2. Add a GitHub remote for this repo (target: `https://nickizu.github.io/leaguewiki.io/`) and push `main`
3. In the GitHub repo settings, enable Pages to serve from `main` branch, `/docs` folder

### `vite.config.js` `base` path

`base` is set to `/leaguewiki.io/` to match the GitHub repo name, since the site is served at `https://nickizu.github.io/leaguewiki.io/`. **If the repo is ever renamed, this must be updated to match**, or built asset URLs will 404.
