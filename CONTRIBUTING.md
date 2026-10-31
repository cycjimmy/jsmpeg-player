# Contributing

The repository is released under the MIT license, and follows a standard Github development process, using Github tracker for issues and merging pull requests into main.

## Development

```shell
$ npm install          # Node ^22.22.2 || >=24.15.0
$ npm run dev          # Vite dev server with the root index.html
$ npm run lint         # ESLint (flat config, @antfu/eslint-config)
$ npm run lint:style   # Stylelint for src/**/*.{css,scss}
$ npm test             # node --test
$ npm run package      # build dist/ and assemble .release/
```

`index.html` in the repository root is the Vite dev entry and imports `src/` directly. `static/index.html` is the GitHub Pages demo: it loads the bundled `jsmpeg-player.umd.js` through a `<script>` tag and is deployed by `npm run build:deployment`.

## Repository settings required by the bots

`.github/workflows/dependabotAutoMerge.yml` merges non-major Dependabot pull requests automatically. Three settings cannot be expressed in code and must be enabled by a maintainer:

1. **Settings → Actions → General → Workflow permissions**: choose *Read and write permissions*. Dependabot opens its pull requests from branches inside this repository, which is why the `pull_request` event can hand `GITHUB_TOKEN` a write token there. Pull requests from forks stay read-only, and the workflow skips them through the `head.repo.full_name` guard.
2. **Settings → General**: enable *Allow auto-merge*.
3. **Branch protection on `main`**: require the `Test CI` status check to pass. Auto-merge only completes once the required checks are green.

`Test CI` keeps the write token away from the steps that execute repository code: the `test` job is read-only, and the semantic-release dry-run lives in its own `release-dry-run` job gated to same-repository pull requests.

If write permissions cannot be granted to `pull_request` runs at all, switch the trigger of `dependabotAutoMerge.yml` to `pull_request_target`. `dependabot/fetch-metadata` never checks out the pull request code, so the elevated token stays out of the fork's reach.

## Commits

[Conventional Commits](https://www.conventionalcommits.org/) are required: `semantic-release` derives the version and the changelog from them. A breaking change must be marked with `!` and a `BREAKING CHANGE:` footer.
