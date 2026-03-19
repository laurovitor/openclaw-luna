Tags: agents, playbook, specialization, architecture

# Playbook system

## Status
Parked for later. Treat as a separate project from IsoClaw.

## Core idea
Create an agent-improvement system based on:
- `PLAYBOOK.md` at agent/project root
- `playbook/` directory with focused domain files
- `AGENT.md` should prioritize reading `PLAYBOOK.md` before acting when it exists

## Goals
- Extreme token economy
- Extreme focus by domain
- Modular specialization without depending on OpenClaw official `skills/` structure
- Keep one root guide file plus one folder, instead of many scattered root files

## Proposed shape
```text
AGENT.md
PLAYBOOK.md
playbook/
  laravel.md
  php.md
  livewire.md
  html.md
  css.md
```

## Operational rule
`PLAYBOOK.md` is the router. It should tell the agent:
- when to consult `playbook/`
- which file to read first
- how many domain files to read at most
- how to stay economical in tokens

## Separation rule
Do not mix this with IsoClaw. They are independent serious projects.

## Next time
Resume only when Lauro asks to work on the playbook system again.
