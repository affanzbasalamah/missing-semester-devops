---
title: "Lesson 0.5 · Writing Is a Superpower"
description: Markdown fluency and the three documents every engineer writes — the README, the runbook, and the post-mortem.
sidebar:
  label: "0.5 · Writing"
---

Here is a thing nobody tells CS graduates: **the highest-paid, most senior engineers are
almost always the best writers on the team.** Not because writing is a "soft skill" bolted onto
the real work, but because infrastructure and security *are* communication problems. A server
nobody can operate is useless. A vulnerability nobody can explain doesn't get fixed. A brilliant
fix nobody documented gets undone next week.

This entire curriculum is built around a documentation habit for exactly this reason: your
public writeups *are* your portfolio, and the ability to explain what you did is what turns a
homelab into a job. This lesson makes you fluent in the format (Markdown) and the three
documents you'll write over and over for the rest of your career.

## Markdown: the format everything is written in

**Markdown** is a plain-text format that turns simple symbols into formatted documents. It's
what READMEs, GitHub issues, this very site, and most technical documentation are written in.
It's readable as plain text *and* renders to clean HTML. You already need it for every lab in
this module.

The entire syntax you need:

```markdown
# Heading 1
## Heading 2
### Heading 3

Normal paragraph text. Blank lines separate paragraphs.

**bold text** and *italic text*

- A bullet point
- Another bullet
  - An indented sub-bullet

1. A numbered list
2. The second item

`inline code` for commands and filenames

​```sh
# A fenced code block, with syntax highlighting
ssh homelab "df -h"
​```

> A blockquote, for notes or quotes

[link text](https://example.com)

![image alt text](path/to/image.png)

| Column A | Column B |
|----------|----------|
| cell     | cell     |

---  (a horizontal rule)
```

That's essentially all of it. Fenced code blocks (the triple-backtick ones) are the most
important for technical writing — they preserve formatting and add syntax highlighting, so
commands and configs are readable. Every command in this lesson, every config in later modules,
goes in a fenced code block.

:::tip[Preview as you write]
VS Code shows a live Markdown preview (`Ctrl-Shift-V` / `Cmd-Shift-V`). GitHub and your git
server render `README.md` automatically. Write, glance at the preview, adjust. You'll be fluent
within a day.
:::

## Write to be skimmed, not read

The single most useful principle in technical writing: **nobody reads top to bottom.** They
scan for the part they need. Structure everything so a hurried reader finds the answer fast:

- **Use headings** so the structure is visible at a glance.
- **Front-load the point.** Put the conclusion or the key command first, the explanation after.
  Don't build up to it — a reader in a hurry (or in an outage) needs the answer immediately.
- **One idea per paragraph.** Short paragraphs. Walls of text don't get read.
- **Use lists and tables** for anything enumerable. A five-row table beats a dense paragraph
  listing five things.
- **Show the command.** In infrastructure writing, the exact command or config, in a code
  block, is worth more than three sentences describing it.

The test: can someone find what they need in your document in ten seconds of scanning? If not,
add headings and cut words until they can.

## The three documents every engineer writes

Across your whole career, most of your technical writing is one of three kinds. Learn the shape
of each now.

### 1. The README — "what is this and how do I use it?"

A README is the front door to any project, repo, or system. It answers, in order, the questions
a newcomer has. Every repo you create in this curriculum gets one. The reliable structure:

```markdown
# Project Name

One or two sentences: what this is and who it's for.

## What it does
The problem it solves, briefly.

## Requirements
What you need before you start (hardware, software, accounts).

## Setup
Numbered, copy-pasteable steps to get it running.

## Usage
How to actually use it, with example commands.

## Notes / Troubleshooting
Gotchas, common errors, links to more.
```

The golden rule of a README: **a stranger should be able to go from zero to working by
following it, without asking you anything.** When you write your Module 2 server build log,
that's the standard — could someone else rebuild your server from your document alone?

### 2. The runbook — "how do I perform this operation?"

A runbook is step-by-step instructions for a specific operational task: "how to restore from
backup," "how to rotate the TLS certificate," "how to add a new VLAN." It's what you (or a
teammate, or 3am-you during an outage) follow to do a thing correctly under pressure, without
having to remember or re-figure-it-out.

```markdown
# Runbook: Restore a Service from Backup

## When to use this
The service's data is lost or corrupted and needs restoring from backup.

## Prerequisites
- SSH access to the backup host
- The restic repository password (in the password manager, entry "restic-homelab")

## Steps
1. Stop the affected service:
   ​```sh
   ssh homelab "docker compose -f /srv/app/compose.yml down"
   ​```
2. List available snapshots:
   ​```sh
   restic -r /mnt/backup snapshots
   ​```
3. Restore the most recent snapshot: ...

## Verification
How to confirm the restore actually worked.

## Rollback
What to do if the restore itself fails.
```

Runbooks are the deliverable for several modules (the restore drill in Module 4, the hardening
checklist in Module 2). Good ones are precise, copy-pasteable, and include how to *verify
success* and what to do if a step fails — because they're used under stress, when improvisation
is dangerous.

### 3. The post-mortem — "what went wrong and how do we prevent it?"

When something breaks — a service goes down, a config change causes an outage, you get
"compromised" in the Module 8 exercise — you write a **post-mortem**: an honest account of what
happened, why, and what will change. The most important principle: it's **blameless**. The goal
is to fix the *system and process*, not to find someone to blame. This is a genuine cultural
value at every serious engineering organization, and learning to write one is a real
professional signal.

```markdown
# Post-Mortem: Website Outage, 2026-07-20

## Summary
One paragraph: what happened, impact, and duration. Readable by anyone.

## Timeline
- 14:03 — Deployed new reverse-proxy config.
- 14:05 — Site began returning 502 errors.
- 14:11 — Noticed via monitoring alert.
- 14:20 — Identified typo in the config; reverted.
- 14:22 — Service restored.

## Root cause
The actual underlying reason — not "human error," but *why* the error was
possible and wasn't caught.

## What went well
Monitoring caught it; rollback was fast.

## What went wrong
No config validation before deploy; no staging test.

## Action items
- [ ] Add config-syntax check to the deploy pipeline (Module 7).
- [ ] Test config changes in a VM before production.
```

The Module 8 deliverable is exactly this document, written about a real (or simulated) incident
in your own lab. Interviewers love it, because writing a good blameless post-mortem shows
maturity that junior candidates almost never demonstrate.

## Your writing is your portfolio

Return to the curriculum's core idea: the documents you write *are* the deliverables. Look at
what each module asks you to produce —

- Module 1: an annotated packet-capture walkthrough (a *teaching* document).
- Module 2: a server build log + hardening checklist (a *README + runbook*).
- Module 4: a verified restore demo (a *runbook* with evidence).
- Module 5: a remote-access design doc (a *decision record*).
- Module 8: a purple-team report + post-mortem.

Every one is a piece of writing. Six months from now, they sit on your self-hosted site, and an
employer reads them to decide if you can do the job. The technical work earns the result; the
writing is what makes the result *legible* to someone who wasn't there. That's why writing is a
superpower, and why it's in Module 0 — you'll practice it in every module that follows.

Your first piece is [Lab 5](/modules/00-toolkit/labs/#lab-5--your-first-post): a blog post
titled *"What I wish CS school had taught me."* Write it well. It's the first entry in a
portfolio that will eventually get you hired.

## Quick self-check

1. What are the three documents every engineer writes, and what question does each answer?
2. Why should you "front-load the point" instead of building up to it?
3. What makes a post-mortem *blameless*, and why does that matter?
4. What's the golden-rule test for a good README?
5. Why does this curriculum treat your writeups as the actual deliverables?

**Next:** [The Labs →](/modules/00-toolkit/labs/) — where you put all five lessons to work.
