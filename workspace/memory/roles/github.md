Tags: github, git, workflow, rules, repos

# Git and GitHub rules

## Repository location (mandatory)
- Any repository cloned for local work must be placed under:
  - `~/Repositories`
  - absolute path: `/home/laurovitor/Repositories`
- Do **not** clone repositories inside `.openclaw` workspaces by default.
- Do **not** clone repositories directly in the workspace root.

## Default local git workflow (when Lauro does not specify another flow)
- Clone from the repository default branch.
- Create a working branch named `dev-luna`.
- Do all implementation work on `dev-luna`.
- Avoid changing `main`/default branch directly unless Lauro explicitly asks for it.

## Pull Requests
- Luna must **not** create Pull Requests by default.
- Lauro is the default PR owner/creator.
- Luna may only create a PR when Lauro explicitly asks for it.

## Commits and pushes
- Do not claim work is done without objective evidence.
- When reporting delivery, always prefer concrete proof such as:
  - branch name
  - commit hash
  - push confirmation
  - relevant build/test result when applicable
- Avoid vague progress-only updates when a concrete result can be delivered instead.

## Delivery style
- Prioritize verified outcomes over long intermediate narration.
- If Lauro asks for a single-cycle execution, avoid repeated partial updates and return with the concrete result.
- Never report success based only on assumptions, agent claims, or intended actions; verify materially when possible.

## Specialist / delegated workflow
- When the task depends on specialist agents, platform credentials, deploy credentials, or a defined multi-agent flow, Luna should follow the explicitly requested delegation path instead of freelancing changes in the main agent.
- Do **not** assume permanent specialist mappings unless Lauro explicitly defines them for that context.
- When specialist mappings are still being designed or migrated, wait for Lauro to specify which specialist should own which platform.
- If no specialist mapping was defined yet and the task is sensitive enough to require one, ask before proceeding.

## Sensitive platform operations
- For tasks involving platform tokens, deploy credentials, infra access, or protected operational environments, prefer the approved delegated/specialist workflow.
- Luna should not execute credential-dependent actions in the main agent when Lauro has defined that a specialist must own that surface.

## Project-specific overrides
- If a repository contains `PROJECT_MEMORY.md`, use it as the primary source of project-specific workflow rules.
- If `PROJECT_MEMORY.md` conflicts with this file, follow the project-specific rule for that repository.
- If neither Lauro nor `PROJECT_MEMORY.md` defines the workflow, fall back to the rules in this file.

## Purpose
- Keep the workspace organized.
- Keep git operations predictable and reversible.
- Reduce accidental changes in protected branches.
- Preserve clear ownership between Luna, Lauro, and future specialists.
