---
title: "Module 4 · Storage, Backups & Virtualization"
description: Disks, filesystems, RAID, backups you actually test — then your first hypervisor.
sidebar:
  label: "4 · Storage & Virtualization"
---

Storage is the most under-taught topic in all of infrastructure — until the day data is
lost, when it becomes the only topic. This module covers disks and filesystems properly,
instills the backup discipline that separates professionals from hobbyists, and then
introduces virtualization: the abstraction that everything in modern infrastructure sits on.

## What you'll learn

### Lesson 4.1 — Disks and filesystems, for real
- Block devices, partitions, partition tables (GPT), `lsblk`/`fdisk`/`blkid`
- Filesystems: ext4 as the workhorse; what journaling buys you; mounting and `/etc/fstab`
- LVM: volumes you can resize — why raw partitions are a trap
- SMART data: hearing a disk announce its death in advance

### Lesson 4.2 — Redundancy is not backup
- RAID concepts: mirroring vs. striping vs. parity; `mdadm` or ZFS mirror on your server
- ZFS (optional but recommended): checksums, snapshots, scrubs — why it's beloved
- The mantra: **RAID keeps you *running* through a disk failure. Backups save you from
  deletion, ransomware, and yourself.** They are different problems.

### Lesson 4.3 — Backups: the 3-2-1 discipline
- 3 copies, 2 media, 1 offsite — applied honestly to a homelab
- `restic` or `borg`: encrypted, deduplicated, automated backups
- Backup *testing*: an untested backup is a hope, not a backup
- What to back up: configs and data, not OS images — because Module 7 makes the OS reproducible

### Lesson 4.4 — Virtualization: the big abstraction
- What a hypervisor does; KVM/QEMU; why the cloud is "just" this at scale
- **Proxmox VE** on your micro PC: web UI, VMs, LXC containers, snapshots
- VM lifecycle: create, snapshot, break, roll back — your new fearless-experimentation workflow
- Containers vs. VMs: shared kernel vs. full isolation, and when each fits (Docker arrives in Module 6)

## Labs

1. **Disk surgery.** Add a second disk (or USB disk) to your server. Partition, create an
   LVM volume, format, mount via fstab, then *grow* the volume live.
2. **Kill a mirror.** Build a two-disk mirror (mdadm or ZFS). Pull one disk while the
   system runs. Watch it degrade, then rebuild it. Write up the timeline.
3. **The restore drill.** Set up automated nightly `restic` backups of your configs and
   data. Then — this is the graded part — **delete something important and restore it.**
   Time yourself. Document the runbook.
4. **Hypervisor install.** Rebuild your micro PC with Proxmox (your Module 2 skills make
   this fast now). Recreate your Module 2 server as a VM inside it.
5. **Snapshot safety net.** Snapshot a VM, deliberately destroy its bootloader, roll back.
   Internalize the workflow: snapshot before every risky change, forever.

## Checkpoint

- [ ] I can partition, format, mount, and resize storage without a tutorial open
- [ ] I can explain why RAID is not backup in one sentence to a non-engineer
- [ ] My homelab has automated, encrypted, *tested* backups
- [ ] I have performed a timed restore and have the runbook to prove it
- [ ] My physical server runs a hypervisor; my services now live in VMs/containers
- [ ] I snapshot before risky changes, reflexively

## Deliverable

**A verified restore demo**: a blog post with your backup architecture (diagrammed), your
restore runbook, and the receipts — timestamps and terminal output of a real restore drill.
Interviewers notice this one.

## Resources

- [Proxmox VE documentation](https://pve.proxmox.com/pve-docs/)
- [restic docs](https://restic.readthedocs.io/) — the backup tool you'll actually stick with
- Jim Salter's ZFS articles (Ars Technica) — the best plain-language ZFS explanations
