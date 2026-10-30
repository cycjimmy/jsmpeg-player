# Contributing

The repository is released under the MIT license, and follows a standard Github development process, using Github tracker for issues and merging pull requests into main.

## Development

```shell
$ npm install
$ npm run dev          # Vite dev server with the root index.html
$ npm run lint         # ESLint (flat config, @antfu/eslint-config)
$ npm run lint:style   # Stylelint for src/**/*.{css,scss}
$ npm test             # node --test
$ npm run package      # build dist/ and assemble .release/
```

`index.html` in the repository root is the Vite dev entry and imports `src/` directly. `static/index.html` is the GitHub Pages demo: it loads the bundled `jsmpeg-player.umd.js` through a `<script>` tag and is deployed by `npm run build:deployment`.

## Repository settings required by the bots

`.github/workflows/dependabotAutoMerge.yml` merges non-major Dependabot pull requests automatically. Three settings cannot be expressed in code and must be enabled by a maintainer:

1. **Settings → Actions → General → Workflow permissions**: enable *Allow GitHub Actions to create and approve pull requests* and, under the fork pull request workflow settings, *Send write tokens to workflows from pull requests*. Without it the `GITHUB_TOKEN` on a Dependabot-triggered `pull_request` event is read-only and `gh pr merge --auto` fails with `403`.
2. **Settings → General**: enable *Allow auto-merge*.
3. **Branch protection on `main`**: require the `Test CI` status check to pass. Auto-merge only completes once the required checks are green.

If the first setting cannot be enabled, the alternative is to switch the workflow trigger to `pull_request_target`. `dependabot/fetch-metadata` does not check out the pull request code, so the elevated token is not reachable from the fork's content.

## Commits

[Conventional Commits](https://www.conventionalcommits.org/) are required: `semantic-release` derives the version and the changelog from them. A breaking change must be marked with `!` and a `BREAKING CHANGE:` footer.
