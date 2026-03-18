# OpenClaw prompt: aggressive token economy for a Codex-heavy setup

You are auditing and redesigning an OpenClaw setup for **aggressive token economy** with minimal quality loss.

## Goal

Produce a practical plan to reduce token/cost consumption **hard**, especially in a setup where the main daily agent runs on a **Codex/OpenAI model or similar** and long work sessions across chat channels are consuming too much weekly quota.

This is **not** a generic guide. It must be tailored to the actual constraints below.

## Scenario

- Main conversational agent is heavily used in **direct chat and work chat surfaces** (for example WhatsApp, Slack, Discord, or similar) for planning, orchestration, and technical work.
- Current pain point: the system now burns through a large part of the **weekly Codex quota in a single day**.
- The user wants **aggressive savings**, but without making the assistant dumb, forgetful, or unreliable.
- The user prefers **real context reduction**, not fake savings from just shorter final replies.
- The user is open to changing:
  - bootstrap file size/content (`SOUL.md`, `AGENTS.md`, `USER.md`, `MEMORY.md`, `TOOLS.md`)
  - memory loading strategy
  - session hygiene rules
  - model routing for subagents/compaction
  - OpenClaw config knobs
  - operating rules inside prompts/files
- This prompt is for **analysis and proposal only**. Do **not** assume changes are already approved/applied.

## Important technical constraint

Focus this prompt on **OpenAI Codex or similar OpenAI-like premium models** as the primary environment.

Do not drift into Anthropic-first guidance. Only mention Anthropic-specific behavior if you are explicitly contrasting it with Codex/OpenAI-like behavior or marking it as irrelevant for this setup.

If a recommendation depends on provider-specific behavior, label it clearly as:
- **verified for Codex/OpenAI-like setups**
- **possibly applicable but not verified here**
- **not applicable to this setup**

## What to analyze

### 1) Bootstrap diet

Audit the role and likely token weight of these files:
- `SOUL.md`
- `AGENTS.md`
- `USER.md`
- `MEMORY.md`
- `TOOLS.md`

For each one:
- explain what should stay in bootstrap
- explain what should move to on-demand memory files
- identify probable redundancy / repetition / over-specification
- propose an aggressive target size
- explain risk of over-shrinking it

Be strict: if a line does not materially change behavior, recommend removing or relocating it.

### 2) Memory loading strategy

Design a lower-cost memory strategy for an assistant that currently loads too much context too often across one or more work chat channels.

Cover:
- what should always load
- what should load only in main DM
- what should load only on demand
- when daily files should be read
- whether long-term memory should become more index-like and less narrative
- how to avoid repeated reads of the same files in the same session
- how to use **categorized memory retrieval** so only the relevant category/topic is loaded instead of dragging unrelated memory into context

Prefer a model where the bootstrap files are lightweight routers and durable detail lives elsewhere.

If memory is categorized, the strategy should strongly prefer sending only the minimum relevant category, topic, or snippet needed for the current task instead of broad memory dumps.

### 3) Session/context control

Propose an aggressive but safe approach for:
- context growth in long work chats
- when to use `/compact`
- when to use `/new`
- when to use `/reset`
- when to split work into isolated sessions/subagents
- how to avoid unnecessary tool output accumulation

Include a **context pressure policy** based on estimated context usage percentage:
- when context exceeds **50%**, recommend compaction soon
- when context exceeds **75%**, warn the user clearly and with stronger urgency
- when context exceeds **90%**, compact automatically

Important behavior requirements:
- these alerts must **not** repeat every message
- each threshold alert should be emitted **once per threshold crossing / cycle**, then remembered so the user is not spammed
- after compaction or sufficient context recovery, the alert state may reset for the next cycle

Also include a **context health / mini-recycler** concept:
- define a lightweight mechanism to keep the active context focused on the current main thread of work
- explicitly allow unrelated side questions, one-off tangents, and resolved micro-topics to fall out of active context sooner
- distinguish between the **main working thread** and **interruptions / temporary side-questions** so the latter do not keep inflating context forever
- if a side-topic contains a **relevant decision, preference, constraint, or durable working rule**, it may leave the active context but should be written to the appropriate daily memory or durable memory location first
- if a side-topic is trivial, ephemeral, or non-durable (for example small talk, weather chatter, or a one-off curiosity with no operational value), it should be allowed to disappear without being memorialized
- preserve important decisions, identifiers, commitments, and current-stage work state
- explain how to do this without losing critical continuity

Separate clearly:
- improvements that come from **agent behavior/prompting discipline**
- improvements that come from **OpenClaw config**
- improvements that come from **workflow changes by the user/assistant**

### 4) OpenClaw config knobs

Review and recommend concrete settings to investigate for:
- `agents.defaults.compaction`
- `agents.defaults.contextPruning`
- `agents.defaults.contextTokens`
- model override for compaction
- subagent/default agent model routing
- session maintenance / transcript hygiene if relevant

For each recommendation:
- state whether it is **applicable now**, **conditionally applicable**, or **not applicable**
- explain expected savings
- explain tradeoffs / risk
- include example config snippets only when reasonably confident they match current OpenClaw docs

### 5) Model routing strategy

Design a routing strategy for a Codex-heavy environment.

Answer questions like:
- what should stay on the main premium model
- what should move to cheaper/faster models
- whether compaction should use a cheaper model
- whether subagents should default to cheaper models
- whether cron/heartbeat/background tasks should avoid the expensive main model

Focus first on Codex/OpenAI-like routing logic, then optionally mention provider-agnostic equivalents if helpful.

### 6) Agent behavior rules that save tokens

Write a compact set of operational rules that could live in `AGENTS.md` (or a dedicated prompt file) to reduce token usage.

These rules should fit this scenario and be concrete, for example:
- avoid repeating the user
- summarize tool outputs instead of echoing them
- batch parallel reads when possible
- avoid fetching the same resource twice in one session
- prefer minimal reads over defensive reads
- do not narrate routine tool calls
- keep daily notes concise and structured
- treat context as a scarce resource

But do not stop at generic advice: make them specific to an assistant that does technical orchestration over chat.

Also design a **usage-aware operating mode**.

The plan should include how the assistant can check or infer **daily and weekly usage percentage** before or during work sessions when that information is available through OpenClaw status, provider usage endpoints, or another reliable native mechanism.

Explicitly evaluate whether a native check such as `session_status`, `openclaw status --usage`, `openclaw models status --json`, or another documented OpenClaw path can provide reliable usage monitoring for this purpose.

Requirements for this usage-aware mode:
- define a normal mode and an economy mode
- if **daily remaining budget drops below 25%**, economy mode should activate
- if **weekly remaining budget drops below 15%**, economy mode should activate
- economy mode must reduce cost aggressively, but **must not** make the assistant robotic, useless, or obviously "dumber"
- when economy mode activates, the assistant should tell the user clearly that it is operating in economy mode and give a short reason
- if usage/status data includes a reset time, renewal date, or next quota window, the assistant should mention that timing briefly
- propose how this should be implemented in prompt/rules form without relying on fake numbers or hallucinated quota data
- usage alerts should not repeat on every message; they should trigger once per state transition and be remembered until the budget state improves/reset occurs

If OpenClaw does not expose a fully reliable built-in command for daily/weekly percentage, the answer must say so clearly and propose the safest fallback behavior.

### 7) Compare against these prior ideas

Use this baseline set of ideas as input, but do not copy it blindly:
- keep bootstrap under ~15KB total
- use smaller/cheaper models for auxiliaries, compaction, crons
- enable context pruning
- use safeguard compaction
- keep enough reserve tokens for memory flush / housekeeping
- store durable memory before compaction
- keep operational anti-bloat rules in AGENTS.md

For each of those, classify as:
- **strong fit**
- **partial fit**
- **weak fit**
- **not applicable**

And explain why.

## Output format

Return exactly these sections:

1. **Diagnosis**
2. **What from the baseline is worth keeping**
3. **What does not fit this Codex-heavy setup**
4. **Recommended aggressive strategy**
5. **Suggested prompt/rules text**
6. **Suggested OpenClaw config changes to evaluate**
7. **Risks of going too aggressive**
8. **Phased rollout plan**

## Style

- Be direct.
- Prefer concrete recommendations over theory.
- Distinguish verified OpenClaw behavior from inference.
- If a recommendation depends on undocumented or version-sensitive behavior, say so.
- Optimize for a real operator who wants lower cost **now**, not a blog post.
