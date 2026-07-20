---
title: "Module 2 · Build the Server"
description: Turn a used micro PC into a hardened, headless Linux server — from BIOS to systemd.
sidebar:
  label: "2 · Build the Server"
---

Cloud consoles hide everything this module teaches. By installing Linux on physical
hardware you own — a $50 used micro PC — you'll see what a "server" really is: a computer,
a kernel, an init system, and services. Every VM and container you ever touch afterward
will make more sense.

**Hardware needed:** one used micro PC (Lenovo ThinkCentre Tiny, Dell OptiPlex Micro, or
HP EliteDesk Mini) — see the [hardware guide](/guides/hardware/). A Raspberry Pi works too,
but x86 keeps later modules (virtualization) simpler.

## What you'll learn

### Lesson 2.1 — Bare metal
- BIOS/UEFI: boot order, secure boot, why servers disable what desktops enable
- Creating install media; installing Debian (or Ubuntu Server) *without* a desktop environment
- Partitioning choices and what they mean (you'll go deeper in Module 4)
- First boot: assigning a static IP, and going **headless** — unplug the monitor forever,
  SSH only from here on

### Lesson 2.2 — The anatomy of a running system
- systemd: units, services, targets; `systemctl` and `journalctl` fluency
- Where things live: `/etc`, `/var`, `/opt`, `/usr`, `/home` — the filesystem hierarchy as a map
- Package management: apt, repositories, what "updating" actually changes
- Users, groups, `sudo`, and the principle of least privilege in practice

### Lesson 2.3 — Hardening as a habit, not an afterthought
Every machine you build from now on gets this treatment *on day one*:
- SSH: keys only, no root login, non-default port is optional theater — key-only auth is the real control
- A host firewall (`ufw` or nftables): default deny inbound, allow only what you run
- `fail2ban` for the log noise
- Unattended security upgrades
- A named non-root admin user; root account locked

### Lesson 2.4 — Knowing your system
- Reading logs: journald, `/var/log`, following a service's logs live
- Resource triage: CPU, memory, disk, network — the four horsemen of "why is it slow"
- Basic troubleshooting method: *what changed? what do the logs say? can I reproduce it?*

## Labs

1. **The install.** Install Debian headless on your micro PC. Document every choice you
   made and why in a build log (markdown, committed).
2. **Break glass.** Deliberately misconfigure SSH (lock yourself out), then recover via
   physical console. Write up what you learned about keeping a recovery path.
3. **Hardening checklist.** Apply the full Lesson 2.3 treatment. Then verify from another
   machine: `nmap` your server and confirm only expected ports answer.
4. **Service autopsy.** Pick any running service, and using only `systemctl` and
   `journalctl`, explain: what starts it, what it logs, what happens when you kill it.
5. **First hosted service.** Install nginx serving a static "hello" page on your LAN.
   Watch a request arrive in the access log in real time.

## Checkpoint

- [ ] My server runs headless; I administer it exclusively over SSH with keys
- [ ] I can create/enable/debug a systemd service and read its logs
- [ ] My firewall default-denies inbound; I can list exactly which ports are open and why
- [ ] I've been locked out and recovered — and I know my recovery path
- [ ] An `nmap` scan of my server shows only the ports I intend
- [ ] My build log is committed and complete enough for a stranger to reproduce

## Deliverable

**A server build log + hardening checklist** in your repo: the exact steps, the choices,
the mistakes, and the verified `nmap` output. This is your first runbook.

## Resources

- [Debian Administrator's Handbook](https://debian-handbook.info/) — free, canonical
- `systemd` by example: [systemd.io](https://systemd.io/)
- Linux Journey ([linuxjourney.com](https://linuxjourney.com/)) — gentle parallel track if the pace is fast
