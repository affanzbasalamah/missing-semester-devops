---
title: "Module 0 · The Toolkit"
description: Terminal fluency, git, and technical writing — before you touch any hardware.
sidebar:
  label: Overview
---

Most fresh graduates have never lived in a terminal, never used git for anything but a
class assignment, and have never written a document another engineer had to rely on.
These three skills are used *every day* in DevOps and security. We fix that first,
because every later module assumes them.

## Why git comes first, not last

Your public git repo is the backbone of this entire curriculum. Every config file you
write, every note you take, every lab you finish gets committed. By the end, your commit
history is a timestamped proof of six months of real work — something no certificate can fake.

## The lessons

Work through them in order — each builds on the last:

| Lesson | Topic | Time |
|---|---|---|
| [0.1 · The Shell](/modules/00-toolkit/shell/) | Navigation, permissions, pipes, processes, dotfiles | 4–6 hrs |
| [0.2 · Remote Work](/modules/00-toolkit/remote/) | SSH keys, `~/.ssh/config`, tmux, moving files | 3–4 hrs |
| [0.3 · Editing Anywhere](/modules/00-toolkit/editing/) | Survival vim + a proper local workflow | 2–3 hrs |
| [0.4 · Git for Infrastructure People](/modules/00-toolkit/git/) | Commits, branches, remotes, what never goes in git | 4–6 hrs |
| [0.5 · Writing Is a Superpower](/modules/00-toolkit/writing/) | Markdown, READMEs, runbooks, post-mortems | 2–3 hrs |
| [Labs](/modules/00-toolkit/labs/) | The five graded exercises | 4–8 hrs |

Total: roughly **20–30 hours**, or 2–3 weeks at a relaxed part-time pace.

## What you need

- Any computer running **Linux or macOS**, or Windows with **WSL2** (Ubuntu). Every command
  in this module assumes a Unix-like shell.
- A free [GitHub](https://github.com) account (you'll move to your own git server in Module 6).
- No lab hardware yet — but this is a good time to start shopping the
  [hardware guide](/guides/hardware/) so your micro PC arrives by Module 2.

## Checkpoint

You're done with Module 0 when you can check every box:

- [ ] I can navigate, search, and manipulate files entirely from the terminal
- [ ] I can explain what a pipe does and chain 3+ commands to solve a real problem
- [ ] I connect to remote machines with SSH keys only
- [ ] I can edit a file in vim on a machine with no other editor installed
- [ ] My dotfiles live in a public git repo with a readable commit history
- [ ] I've written and committed my first blog post in markdown

## Deliverable

**A public git repo** containing your dotfiles, lab solutions, and first blog post —
with a commit history that shows the work. The [labs page](/modules/00-toolkit/labs/)
specifies exactly what it must contain.

## Resources

- [MIT Missing Semester](https://missing.csail.mit.edu/) — lectures 1–6 overlap heavily; watch them
- [Julia Evans' zines](https://wizardzines.com/) — the best explanations of shell, networking, and Linux internals anywhere
- `man` pages — learn to read them now; they're always there when Stack Overflow isn't
