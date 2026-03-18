Tags: settings, openclaw, config, system

# System settings / OpenClaw notes

## Memory system
- Do not rely on semantic `memory_search` (embeddings).
- Default recall path is **files + text search**:
  - `scripts/memfind` (fast local search across `MEMORY.md` + `memory/`)
  - `rg` (ripgrep) / `grep` directly when needed
- All memory files must start with: `Tags: ...` (tags always in English).
- Folder layout (source of truth):
  - daily/, topics/, roles/, profiles/, projects/, works/

## Browser / Relay (Win11)
- Runbook: if/when recreated, keep under `memory/topics/`.

## WhatsApp audio / voice notes (PTT)
- After a successful local transcription is validated as usable, prefer deleting the original audio file to avoid junk accumulation.
- Keep the transcription instead, using a human-readable filename pattern such as `whatsapp-YYYY-MM-DD-speaker-name.txt`.
- Symptom observed: WhatsApp **voice note (PTT)** playback may clip/garble the first ~1s of speech even when the generated file is correct.
- Mitigation options:
  - Prefer **normal audio** (not PTT) when clarity matters.
  - For any WhatsApp audio, prepend a short **discardable intro** (e.g., "É… ok.") so clipped/garbled first word doesn't matter.
  - For PTT: optionally repeat the first important word.

## Status / runtime reporting
- When sharing OpenClaw/session status summaries with Lauro, include **usage** by default (not only model/tokens/context/runtime).
- Treat this as a fixed preference so he does not need to ask again.

## Backup
- Daily git backup of `/home/laurovitor/.openclaw/workspace` at **03:30** local time to GitHub repo `laurovitor/openclaw-luna` via `scripts/backup-openclaw-workspace.sh`.
- If there is a significant change to Luna's essence/config/memory, do an **early backup** before the daily schedule.

## Other
- If something is declared “standard / default / rule”, it must be written into `memory/roles/` or `MEMORY.md`.