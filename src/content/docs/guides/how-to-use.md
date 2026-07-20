---
title: How to Use This Site
description: Self-paced, hardware-first, public by default — how the curriculum works.
sidebar:
  label: How to Use This Site
---

This is a **self-paced, hands-on curriculum**. There are no lectures to attend and nothing to
enroll in. Each module stands alone, the way [MIT's Missing Semester](https://missing.csail.mit.edu/)
does — read the notes, do the labs, tick the checkpoint, ship the deliverable.

## The three principles

### 1. Hardware-first
You learn infrastructure by building infrastructure on real hardware you own. Before Module 2,
read the [hardware guide](/guides/hardware/) and start acquiring gear. The whole lab costs less
than one certification exam.

### 2. Public by default
From Module 0, everything you do lives in a **public git repository**. Your configs, your notes,
your writeups, your mistakes. By Module 6 you'll migrate that repo to a git server you host
yourself. The result is a timestamped, verifiable record of real work — the thing no certificate
can fake.

### 3. The closed loop
Your documentation site is both the deliverable and the proof. You self-host your portfolio on
the infrastructure you built, reachable through the network you secured. When it loads for an
employer, that *is* your résumé.

## How each module is structured

Every module page has the same shape:

- **What you'll learn** — the concepts, organized into lessons.
- **Labs** — hands-on exercises. This is where the learning actually happens; don't skip them.
- **Checkpoint** — a checklist. You're done when every box is ticked. This is your "belt test."
- **Deliverable** — the artifact that goes in your portfolio. Each one is chosen to be something
  an interviewer will find impressive.
- **Resources** — curated links to go deeper.

## Suggested pace

There's no clock, but for planning: most people spend **2–4 weeks per module** at a few hours a
week, putting the full curriculum around **six months** part-time. Go faster or slower as your
life allows — the checkpoints, not the calendar, tell you when you're ready to move on.

## The curriculum map

| Phase | Module | Capstone artifact |
|---|---|---|
| 0 | [The Toolkit](/modules/00-toolkit/) | Public git repo + first blog post |
| 1 | [How It Actually Works](/modules/01-fundamentals/) | Annotated packet-capture walkthrough |
| 2 | [Build the Server](/modules/02-server/) | Server build log + hardening checklist |
| 3 | [Build the Network](/modules/03-network/) | Network diagram + config repo |
| 4 | [Storage & Virtualization](/modules/04-storage/) | Verified restore demo |
| 5 | [Overlay Networks](/modules/05-overlay/) | Remote-access design doc (ADR) |
| 6 | [Self-Hosting](/modules/06-selfhosting/) | Live self-hosted portfolio + git server |
| 7 | [Automation & CI/CD](/modules/07-automation/) | Ansible repo that rebuilds the lab |
| 8 | [Security Operations](/modules/08-security/) | Purple-team report + post-mortem |
| 9 | [The Bridge](/modules/09-career/) | "Hire me" portfolio page |

## This site is itself an example

This site is built with [Astro Starlight](https://starlight.astro.build/) from a public git
repository — exactly the kind of static site and workflow you'll be running yourself by Module 6.
Found a typo or want to add a resource? Open a pull request. Contributing here is good practice
for the [showcase](/guides/showcase/) submission that caps off the curriculum.
