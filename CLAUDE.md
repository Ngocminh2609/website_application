# FIS AI Kit Repository Guidance

FIS AI Kit uses an outcome-first workflow. One human DRI owns the requested
result end-to-end. The issue or pull request, acceptance criteria, and tests/CI
are the system of record.

## Required workflow

1. Read `README.md`, the request, and relevant code before planning.
2. Choose capabilities by outcome, not by job title or document sequence.
3. Preserve public behavior unless the accepted scope changes it.
4. Run focused tests first, then broader validation when shared contracts move.
5. Report evidence, risks, and unresolved questions plainly.

Repository rules:

- `claude/rules/primary-workflow.md`
- `claude/rules/development-rules.md`
- `claude/rules/orchestration-protocol.md`
- `claude/rules/documentation-management.md`
- `claude/rules/review-audit-self-decision.md`

Do not edit installed skills under a home directory. Change canonical files in
this repository unless the user explicitly requests another target.

## Commands

Direct skill commands are derived from directory IDs:

```text
/fis-outcome
/fis-requirements
/fis-architecture
/fis-craft
/fis-test
/docx
```

The spec-forge plugin prefixes the same directory identity:

```text
/spec-forge:fis-outcome
/spec-forge:fis-craft
```

Display labels are metadata only. For example, `fis-design` is invoked as
`/fis-design` even though its display label is `fis:design-md`.

## Capability model

- 30 standard skills are active after installation.
- 71 optional skills are available in the kit catalog and are copied into the project when their pack is enabled.
- 101 skills exist in the canonical manifest.
- Optional packs are selected and managed in DAI's **Kit Detail** interface.
- Effective local active skills must remain at or below 40.
- The repository contains 13 agents, 6 rules, and 11 hooks wired by default.

Manage state through DAI's **Kit Detail** interface:
- View available packs and current state
- Enable or disable packs to reach specific capability combinations

## Installation and maintenance

Use DAI (FPT IS Delivery AI). Open **Kit Library**, find **FIS AI Kit**, choose
scope and targets, then select **Install to agents**. The former Node installer
remains only as temporary compatibility and test tooling; do not use it in
end-user guidance.

DAI already installs through a data-driven 15-provider adapter registry. A
separate migration operation for existing provider content is still in
development; preview, registry, verified backup, and rollback are planned
capabilities rather than released behavior.

## Templates

Files under `templates/` are optional, import-only references. Do not treat
them as required workflow stages, default output locations, or approval gates.
Prefer acceptance criteria in the issue/PR and executable tests in the
repository.

## Validation

Use the narrowest relevant check, then broaden:

```bash
npm run validate-skills
npm run validate:spec-forge-sync
npm run validate:manifests
npm run validate:generated-distribution
```

Do not hand-edit generated manifests or `guide/SKILLS.*`.

## Documentation

- `docs/roles/outcome-guide.md`
- `docs/reference/skill-catalog.md`
- `docs/reference/migration-from-role-workflow.md`
- `docs/plugins/spec-forge.md`

Update documentation only when behavior, setup, commands, architecture, or
public contracts change. Keep reports concise and list unresolved questions at
the end.
