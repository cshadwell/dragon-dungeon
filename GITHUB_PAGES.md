# GitHub Pages publishing

Live URL: https://cshadwell.github.io/dragon-dungeon/

The existing repository publishes through `.github/workflows/pages.yml`, using GitHub Actions (not a branch root or `/docs`). On a push to `main`, it runs Node and browser checks, creates the lean release from editable `dist/`, validates relative references and CHAZ, and deploys only that artifact. Repository documentation, tests, Git history and local backups are not in the Pages artifact. Standalone opening/ending design previews are excluded. Re-run using Actions → Publish game to GitHub Pages → Run workflow.

Pages settings must use GitHub Actions. The repository was made public with explicit user approval because its previous private-repository plan did not support Pages. Public source includes the puzzle solution; this is intentional under that approval.

Game code, storage keys and save migrations are unchanged by hosting. Localhost and `https://cshadwell.github.io` are different origins: each keeps its own local browser progress. Publishing does not delete or overwrite localhost saves. Hosted saves remain in the same browser profile on subsequent deployments at this URL. Do not clear site data or start New Game to migrate progress. No cloud save/sync is implied.

All runtime URLs are relative to the deployed game directory, including iframe rooms, modules, audio, fonts, artwork and the CHAZ plaque. No domain-root asset prefix or SPA rewrite is required. Existing browser autoplay rules still apply; use the game’s playback retry when necessary.

Local release/path validation:

```
npm test
python3 tools/package-release.py --output build/pages
python3 tools/check-pages.py build/pages
```

Use a fresh output directory per package run. Generated builds are ignored. Do not overwrite editable `dist/` with build output.
