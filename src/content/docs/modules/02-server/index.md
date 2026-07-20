---
title: "Module 2 · Build the Server"
description: Turn a used micro PC into a hardened, headless Linux server — from BIOS to systemd.
sidebar:
  label: Overview
---

This is the module where the curriculum stops being theory. You have a real computer in
front of you — a used micro PC — and by the end of this module it will be a headless,
hardened Linux server that you administer entirely over SSH, running your first hosted
service. Every VM and cloud instance you ever touch afterward is a variation on what you
build here by hand.

Cloud consoles hide all of this. By installing an operating system on physical hardware you
own, you'll see what a "server" actually is: a computer, a kernel, an init system, and
services — the exact stack you modelled in [Module 1](/modules/01-fundamentals/).

## What you need

- **One used micro PC** — a Lenovo ThinkCentre Tiny, Dell OptiPlex Micro, or HP EliteDesk
  Mini. See the [hardware guide](/guides/hardware/). A Raspberry Pi works too, but x86 keeps
  later virtualization modules simpler. Aim for 16 GB RAM.
- A **USB flash drive** (8 GB+) for install media.
- A monitor, keyboard, and Ethernet cable **for the install only** — you'll go headless
  immediately after.
- Your laptop from Modules 0–1, with your SSH key ready.

## The lessons

| Lesson | Topic | Time |
|---|---|---|
| [2.1 · Bare Metal](/modules/02-server/bare-metal/) | UEFI, install media, installing Debian headless, static IP | 4–6 hrs |
| [2.2 · Anatomy of a Running System](/modules/02-server/anatomy/) | systemd, the filesystem hierarchy, packages, users & sudo | 4–5 hrs |
| [2.3 · Hardening as a Habit](/modules/02-server/hardening/) | SSH keys only, firewall, fail2ban, unattended upgrades | 4–6 hrs |
| [2.4 · Knowing Your System](/modules/02-server/operating/) | Reading logs, resource triage, the troubleshooting method | 3–4 hrs |
| [Labs](/modules/02-server/labs/) | The five graded exercises | 6–10 hrs |

Total: roughly **25–35 hours**, or 3–4 weeks part-time.

## The habit this module starts

From this module on, **every machine you build gets hardened on day one** — not as a
bolt-on later, but as the default way you stand up a server. SSH keys only, a firewall that
default-denies, automatic security updates. This habit is woven through every remaining
module and is exactly what separates someone who "installed Linux once" from someone an
employer trusts with a production system.

## Checkpoint

- [ ] My server runs headless; I administer it exclusively over SSH with keys
- [ ] I can create, enable, and debug a systemd service and read its logs
- [ ] My firewall default-denies inbound; I can list exactly which ports are open and why
- [ ] I've been locked out and recovered — and I know my recovery path
- [ ] An `nmap` scan of my server shows only the ports I intend
- [ ] My build log is committed and complete enough for a stranger to reproduce

## Deliverable

**A server build log + hardening checklist** in your repo — the exact steps, the choices,
the mistakes, and verified `nmap` output. This is your first *runbook*, and the standard is
the one from [Lesson 0.5](/modules/00-toolkit/writing/): could a stranger rebuild your server
from your document alone? Full spec in [Lab 5](/modules/02-server/labs/#lab-5--the-build-log).

## Resources

- [Debian Administrator's Handbook](https://debian-handbook.info/) — free, canonical
- [systemd.io](https://systemd.io/) — the init system you'll live in
- [Linux Journey](https://linuxjourney.com/) — a gentle parallel track if the pace is fast
- [Arch Wiki](https://wiki.archlinux.org/) — despite the name, the best Linux reference anywhere; the concepts apply to Debian too
