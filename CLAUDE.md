## Developer Ecosystem workflow (read first)

This repo belongs to a Developer Ecosystem pod (DevEx: MCP, CLI, SDK, Starters including the SAP connector; Marketplace; Mkt Apps; Developer Hub).
New features and changes go through the deveco workflow before any code is written here:

1. Find the work's DSCDX idea and where it is in the flow. No idea yet: write one with the `brief` skill in `contentstack/product-wiki`.
2. The PRD, TRD, test cases, tickets and code come from your own routines (PM, Architect, QA agent, Dev), gate by gate. Do not plan, draft or build them in this session. No routine for a step yet: set it up with the `deveco-aisdlc-onboarding` skill in `contentstack/agent-skills`.
3. The order, gates and intake: https://github.com/contentstack/agent-skills/blob/main/skills/deveco-aisdlc-onboarding/references/run-protocol.md

Bug fixes and support cases keep this repo's usual path. Not sure which applies? Ask before building.

## This repo

DAM boilerplate: a template for new Marketplace DAM apps (UI-only; no server in this repo), not a deployed app. Copy it, edit `ui/src/root_config` and `ui/rte/src/rte_config`. Epic: MKT-20016. Wiki: `marketplace-apps/dam-boilerplate/` in `contentstack/product-wiki` if present. Public docs: `TEMPLATE.md` and the Marketplace DAM App Boilerplate page.

| Path | What it is |
| --- | --- |
| `ui/` | React (CRA) app, `HashRouter`. Routes in `ui/src/containers/App/index.tsx`: `/config`, `/custom-field`, `/selector-page` |
| `ui/rte/` | JSON RTE plugin (webpack dev server on port 1268), served as `/dam.js` locally |
| `ui/example/` | Reference `root_config` / `rte_config` for `bynder`, `cloudinary`, `sample_dam_app` |
| `ui/src/__tests__/` | 6 jest specs (ConfigScreen, CustomField, SelectorPage) |
| `scripts/` | Dev-only Node CLI: login, create/update app, deploy to Launch, create content model; writes `scripts/settings/*` and local credentials |

- External services: Contentstack Developer Hub and Launch (through `scripts/`), the third-party DAM you wire in.
- Env var names (never values; see `.env.sample`): `REACT_APP_CUSTOM_FIELD_URL`, `REACT_APP_REGION_MAPPING`, `REACT_APP_API_URL`, `REACT_APP_API_KEY`, `REACT_APP_MULTI_CONFIG_LIMIT`; `scripts/` reads `COLLECT_LINKS`.
- CI: `policy-scan.yml` and `sca-scan.yml` only. Node: README says 20.10.0 / npm 10.2.4; no `.nvmrc`.

### Commands (from package.json; not yet run in CI — verified in the [Tests]/[Routine] PR)

| Where | Script |
| --- | --- |
| root | `audit`, `audit:fix`; `test` is a stub that exits 1 |
| `ui/` | `start` (port 4000), `winStart`, `test` (`jest`), `build` (`react-scripts build`), `prettify`, `lint:fix`, `precommit` |
| `ui/rte/` | `start`, `dev`, `build` (webpack) |
| `scripts/` | `login`, `dev-app-initial-setup`, `prod-app-initial-setup`, `create-dev-app`, `update-dev-app`, `create-prod-app`, `update-prod-app`, `create-dev-content-model`, `create-prod-content-model`, `deploy-prod-app`, `open-collected-links` |
| root `build.sh` | no arguments; builds `ui` and `ui/rte`, zips to `to-deploy/ui.zip` |
