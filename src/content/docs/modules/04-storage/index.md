---
title: "Module 4 · Storage, Backups & Virtualization"
description: Disks, filesystems, RAID, backups you actually test — then your first hypervisor.
sidebar:
  label: Overview
---

Storage is the most under-taught topic in all of infrastructure — right up until the day data
is lost, when it becomes the *only* topic. This module fixes that. You'll learn how disks and
filesystems really work, build the backup discipline that separates professionals from
hobbyists (including the graded exercise everyone should do at least once: *delete something
important and restore it*), and then meet virtualization — the abstraction that everything in
modern infrastructure sits on top of.

By the end, your Module 2 server won't be a single fragile machine anymore. It'll have
redundant storage, tested backups, and a hypervisor running your services as VMs you can
snapshot, break, and roll back without fear.

## What you need

- Your **Module 2 server** (the micro PC), now with a network address from
  [Module 3](/modules/03-network/).
- **At least one extra disk** — a second SSD, a spare 2.5" HDD, or even a USB drive — for the
  storage and RAID labs. Two extra disks is better (for a mirror). Used drives are fine; you're
  learning, not storing anything precious yet.
- An **external USB drive** to act as a backup target (the "offsite-ish" copy in 3-2-1).
- See the [hardware guide](/guides/hardware/) Tier 2 for cheap options.

:::caution[This module writes to disks — and mistakes erase data]
Partitioning and filesystem commands can destroy data instantly and permanently, like `dd` in
[Lesson 2.1](/modules/02-server/bare-metal/). Do the destructive labs on **spare disks with
nothing you care about**, and confirm every device name before you act. That caution is itself
part of the lesson: respect for storage operations is what this module is trying to instill.
:::

## The lessons

| Lesson | Topic | Time |
|---|---|---|
| [4.1 · Disks & Filesystems](/modules/04-storage/disks/) | Block devices, partitions, ext4, LVM, SMART | 4–6 hrs |
| [4.2 · Redundancy Is Not Backup](/modules/04-storage/redundancy/) | RAID concepts, ZFS, the crucial distinction | 4–5 hrs |
| [4.3 · Backups: The 3-2-1 Discipline](/modules/04-storage/backups/) | restic/borg, 3-2-1, and *testing* restores | 4–6 hrs |
| [4.4 · Virtualization](/modules/04-storage/virtualization/) | Hypervisors, Proxmox, VM lifecycle, VMs vs containers | 5–7 hrs |
| [Labs](/modules/04-storage/labs/) | The five graded exercises | 8–12 hrs |

Total: roughly **30–40 hours**, or 3–4 weeks part-time.

## The mantra of this module

Two sentences to carry for the rest of your career:

> **RAID keeps you running through a disk failure. Backups save you from deletion, ransomware,
> and yourself. They are different problems, and you need both.**

Half of this module exists to make sure you never confuse the two — a confusion that has cost
real companies everything.

## Checkpoint

- [ ] I can partition, format, mount, and resize storage without a tutorial open
- [ ] I can explain why RAID is not backup in one sentence to a non-engineer
- [ ] My homelab has automated, encrypted, *tested* backups
- [ ] I have performed a timed restore and have the runbook to prove it
- [ ] My physical server runs a hypervisor; my services now live in VMs/containers
- [ ] I snapshot before risky changes, reflexively

## Deliverable

**A verified restore demo**: a blog post with your backup architecture (diagrammed in Mermaid),
your restore runbook, and the receipts — timestamps and terminal output of a real restore
drill. Interviewers notice this one, because almost nobody does it. Full spec in
[Lab 3](/modules/04-storage/labs/#lab-3--the-restore-drill).

## Resources

- [Proxmox VE documentation](https://pve.proxmox.com/pve-docs/)
- [restic docs](https://restic.readthedocs.io/) — the backup tool you'll actually stick with
- [Arch Wiki: LVM](https://wiki.archlinux.org/title/LVM) and [ext4](https://wiki.archlinux.org/title/Ext4) — concept references
- Jim Salter's ZFS articles (Ars Technica) — the best plain-language ZFS explanations anywhere
