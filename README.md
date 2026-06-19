# CookLog

CookLog is a personal recipe log app concept.

The repository is organized as a project root that can grow into multiple app targets, shared packages, and supporting tools.

## Repository Structure

```text
.
├── apps/
│   ├── ios/
│   └── android/
├── docs/
│   └── product/
├── packages/
│   └── shared/
└── tools/
```

## Directories

### `apps/`

Application projects live here.

- `apps/ios/`: iOS app project
- `apps/android/`: Android app project

Additional app targets can be added later, for example:

- `apps/web/`
- `apps/admin/`
- `apps/backend/`

### `docs/`

Project documents live here.

- `docs/product/`: idea docs, user flows, wireframes, MVP specs, product decisions

### `packages/`

Shared code or reusable modules live here.

- `packages/shared/`: shared models, validation, prompts, or cross-platform business logic

### `tools/`

Development scripts and local automation live here.

## Current Documents

- [CookLog idea v0.1](docs/product/CookLog_Idea_v0.1.md)
- [CookLog MVP spec v0.1](docs/product/CookLog_MVP_Spec_v0.1.md)
