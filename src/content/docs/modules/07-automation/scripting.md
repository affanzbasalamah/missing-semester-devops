---
title: "Lesson 7.1 · Scripting Glue"
description: Robust shell scripting, when to reach for Python, the crucial idea of idempotency, and scheduling work.
sidebar:
  label: "7.1 · Scripting"
---

Automation starts with scripts — the glue that ties commands together so a human doesn't have to
run them one by one. You've written shell one-liners since [Lesson 0.1](/modules/00-toolkit/shell/);
this lesson makes your scripting *robust* (so it fails safely instead of silently), introduces
**idempotency** (the single most important idea in all of automation), and shows when to graduate
from shell to Python. These habits underpin everything else in the module — Ansible and CI/CD are
just structured, powerful ways of doing what a good script does.

## From one-liners to real scripts

A pipeline you type once is fine. A pipeline you'll run repeatedly, or that others depend on,
needs to be a proper script — saved, committed ([Module 0](/modules/00-toolkit/git/)), and
*defensive*. The single most valuable habit for bash scripts is starting them with strict mode:

```sh
#!/usr/bin/env bash
set -euo pipefail

# -e  : exit immediately if any command fails (don't blunder onward)
# -u  : error on use of an unset variable (catches typos in $VAR names)
# -o pipefail : a pipeline fails if ANY stage fails, not just the last
```

Why this matters so much: without `set -e`, a script whose third command failed happily runs
commands four through ten anyway — often making things *worse*. Recall the `rm -rf $VAR/` disaster
from [Lesson 0.1](/modules/00-toolkit/shell/): `set -u` turns an empty `$VAR` into an immediate
error instead of a catastrophe. These three options convert "silently does the wrong thing" into
"stops loudly at the problem," which is exactly what you want from automation running unattended.

A few more robustness habits:

```sh
readonly BACKUP_DIR="/mnt/backup"     # constants that shouldn't change
log() { echo "[$(date +%H:%M:%S)] $*"; }   # a simple timestamped logger

if [[ ! -d "$BACKUP_DIR" ]]; then     # check assumptions before acting
    log "ERROR: backup dir missing"; exit 1
fi

# Quote your variables — "$file" not $file — so spaces don't break things
for file in "$BACKUP_DIR"/*.tar.gz; do
    log "processing $file"
done
```

## Idempotency: the most important idea in automation

Here is the concept that separates automation that's safe to run from automation that's
dangerous. A script (or any operation) is **idempotent** if running it *multiple times* produces
the *same result* as running it once. Running it again changes nothing that's already correct.

Why this is the whole game:

- Automation gets re-run — on a schedule, after a failure, as part of a bigger process. If
  re-running it duplicates data, or errors because "the user already exists," or appends the same
  line to a config a second time, it's fragile and scary.
- **Idempotent** automation is *safe to run anytime*, as many times as you like. That safety is
  what lets you trust it, schedule it, and build on it.

Compare a non-idempotent and an idempotent approach to the same task:

```sh
# NOT idempotent — appends every run, so the line piles up
echo "export PATH=$PATH:/opt/bin" >> ~/.bashrc

# Idempotent — only adds the line if it isn't already there
grep -qF '/opt/bin' ~/.bashrc || echo "export PATH=$PATH:/opt/bin" >> ~/.bashrc
```

```sh
# NOT idempotent — errors on the second run ("directory exists")
mkdir /opt/app

# Idempotent — fine to run repeatedly
mkdir -p /opt/app
```

The pattern is always: **check the desired state, and only act if reality doesn't match it.**
Hold onto this idea — because it's the *entire design principle* of Ansible in the next lesson.
Ansible modules are idempotent by construction: you declare "this user should exist," and Ansible
creates it only if it's missing. Idempotency is why declarative infrastructure works.

:::note[The DevOps mindset in one word]
If someone asked you to compress the whole DevOps philosophy into one word, "idempotency" would
be a strong candidate. Describe the desired end state; make operations that safely converge
reality to it, no matter the starting point or how many times they run. Everything from Ansible
to Kubernetes is built on this. Understanding it here, in a five-line shell example, means you
understand the foundation of all of it.
:::

## When to reach for Python

Shell is perfect for gluing commands and simple file/text work. But it gets painful for anything
with real logic — data structures, JSON/API handling, error handling beyond `set -e`, math,
anything more than a few branches. That's the signal to switch to **Python**:

- **Shell** when the task is "run these commands, move these files, grep this output."
- **Python** when the task is "call this API, parse the JSON, decide based on the data, handle
  errors gracefully." (Python's `requests` for HTTP — recall [Lesson 1.4](/modules/01-fundamentals/http-tls/) —
  and its `json` module make this far cleaner than bash + `curl` + `jq`.)

You don't need to be a Python expert; you need enough to write a readable script with functions,
a `try/except`, and a `main()`. The judgment of *which tool fits* is the real skill — reaching
for Python at the right moment is a mark of experience, as is *not* over-engineering a
three-command job into a Python program.

## Scheduling: automation that runs itself

Automation you have to remember to run isn't really automation. Two ways to schedule recurring
work on Linux:

- **cron** — the classic. `crontab -e` edits your schedule; entries like `0 3 * * * /path/script.sh`
  run the script at 3am daily. Simple and universal.
- **systemd timers** — the modern approach (recall systemd from
  [Lesson 2.2](/modules/02-server/anatomy/)): a `.timer` unit triggers a `.service` unit.
  More setup than cron, but with better logging (into `journalctl`), dependency handling, and the
  ability to catch up on missed runs.

You already used a timer for backups in [Lesson 4.3](/modules/04-storage/backups/) — that's this
idea. Whichever you choose, the essential companion is **notification on failure**: a scheduled
job that fails silently is worse than no job, because you *believe* it's running. Have it alert
you (you'll build real alerting in [Module 8](/modules/08-security/); even a failure email now
matters).

## Where this leads

Robust, idempotent scripts are the atoms of automation. In the next lesson, Ansible gives you a
structured, declarative, idempotent-by-design framework so you're not hand-rolling all this
safety logic yourself — but you'll recognize everything it does, because you just did it by hand.
Then CI/CD schedules and triggers automation off events (a git push) rather than a clock. It's
all the same idea, growing up: *describe the outcome, make it happen safely and repeatably,
without a human in the loop.*

## Quick self-check

1. What do `set -e`, `set -u`, and `set -o pipefail` each protect you from?
2. Define idempotency in your own words. Why is it essential for automation that gets re-run?
3. Rewrite `mkdir /opt/app` and an `echo >>` append to be idempotent.
4. When should you switch from shell to Python? Give a concrete example of each tool's sweet spot.
5. What's the difference between cron and systemd timers, and what must accompany any scheduled
   job?
6. How does idempotency in this lesson foreshadow how Ansible works?

**Next:** [Lesson 7.2 · Infrastructure as Code →](/modules/07-automation/ansible/)
