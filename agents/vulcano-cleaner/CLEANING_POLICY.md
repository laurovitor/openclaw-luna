# CLEANING_POLICY.md

## Default targets
- /tmp
- ~/.cache (selectively)
- ~/.openclaw/logs
- agent/session logs older than threshold

## Default threshold
- logs older than 30 days

## Safety rules
- inspect before deleting when path is not obviously disposable
- prefer deleting only known temp/log artifacts
- never remove git repositories, workspace files, or user documents by default
- if cleanup candidate is unclear, report and ask Luna

## Output
- outcome
- reclaimed space estimate
- deleted paths summary
- skipped paths summary
- risks/pending
