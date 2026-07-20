---
title: "Module 4 · Labs"
description: Partition and grow storage, kill and rebuild a mirror, run a real restore drill, and stand up a hypervisor.
sidebar:
  label: Labs
---

These five labs make storage tangible: you'll resize a volume while it's live, pull a disk out
of a running mirror and watch it heal, and — the module's centerpiece — actually delete
something and restore it from backup, timed. Then you'll turn your server into a hypervisor and
build the snapshot-before-risk habit you'll use for the rest of the curriculum.

:::danger[Use spare disks — these labs erase data]
Labs 1 and 2 partition and format disks; a wrong device name destroys whatever is on it (recall
`dd` from [Lesson 2.1](/modules/02-server/bare-metal/)). Use **spare disks with nothing you
care about**, and run `lsblk` to confirm the device *immediately* before every destructive
command. Lab 4 rebuilds your server as a VM — back up its data first.
:::

---

## Lab 1 · Disk surgery

**Goal:** take a fresh disk from raw hardware to a mounted, resizable filesystem — and grow it
live. Exercises [Lesson 4.1](/modules/04-storage/disks/).

### Steps

1. Attach a spare disk (second SSD, HDD, or a USB drive). Identify it: `lsblk` — note its name
   and **confirm it's the spare**, not your system disk.
2. Create a GPT partition table and one partition (`sudo fdisk /dev/sdX`).
3. Make it an LVM stack: `pvcreate` → `vgcreate data-vg` → `lvcreate -L 5G -n data-lv data-vg`.
4. Format and mount: `mkfs.ext4` the logical volume, `mkdir /mnt/data`, `mount` it, and add a
   **UUID-based** entry to `/etc/fstab`. Test with `sudo mount -a` **before** trusting it.
5. Write a test file to `/mnt/data` to confirm it works.
6. **Grow it live:** `sudo lvextend -L +2G /dev/data-vg/data-lv --resizefs`, then `df -h` to
   confirm the mounted filesystem is now larger — while still mounted and holding your test file.

### Verify

- [ ] `lsblk` shows your partition → LVM → mounted filesystem.
- [ ] The mount survives a reboot (fstab entry by UUID, verified with `mount -a`).
- [ ] You grew the volume *and* filesystem live, confirmed with `df -h`, without losing data.

### Commit

`labs/04-01-disk-surgery.md`: the commands, the `lsblk`/`df -h` before-and-after, and what LVM
let you do that raw partitions wouldn't.

---

## Lab 2 · Kill a mirror

**Goal:** build a RAID 1 mirror, fail a disk while it runs, and rebuild it — so redundancy stops
being theoretical. Exercises [Lesson 4.2](/modules/04-storage/redundancy/).

### Steps

Pick **either** tool:

**mdadm route:**
1. With two spare disks: `sudo mdadm --create /dev/md0 --level=1 --raid-devices=2 /dev/sdX /dev/sdY`.
2. Format and mount `/dev/md0`; write test data.
3. Check health: `cat /proc/mdstat` (shows the array status).
4. **Fail a disk:** `sudo mdadm /dev/md0 --fail /dev/sdX --remove /dev/sdX` (or physically pull
   it if hot-swap). Confirm the data is **still readable** — the mirror kept you running.
5. **Rebuild:** re-add the disk (`sudo mdadm /dev/md0 --add /dev/sdX`) and watch it resync in
   `/proc/mdstat`.

**ZFS route:**
1. `sudo zpool create tank mirror /dev/sdX /dev/sdY`; write test data to `/tank`.
2. `zpool status` to see the healthy mirror.
3. Fail/offline a disk (`sudo zpool offline tank /dev/sdX`), confirm data still reads.
4. Bring it back (`sudo zpool online`) and watch the resilver in `zpool status`. Bonus: run a
   `sudo zpool scrub tank`.

### Verify

- [ ] You built a working 2-disk mirror and wrote data to it.
- [ ] With one disk failed/removed, your data was **still accessible** (redundancy proven).
- [ ] You rebuilt/resilvered the array back to healthy and watched the progress.

### Commit

`labs/04-02-mirror.md`: a timeline of degrade → survive → rebuild, and — in your own words — why
this protects you from a *disk failure* but **not** from deleting a file.

---

## Lab 3 · The restore drill

**This is the module's deliverable.** Set up real backups, then prove them by deleting and
restoring — timed. Exercises [Lesson 4.3](/modules/04-storage/backups/).

### Steps

1. **Set up restic** to an external/second disk: `restic init`, then back up real things
   (`/etc`, your git repos, a service's data): `restic backup ...`.
2. **Automate it** with a systemd timer (or cron) so it runs nightly, and (bonus) make it
   **notify you on failure**.
3. Confirm snapshots exist: `restic snapshots`.
4. **The drill — do this for real:**
   - Pick something important that's in the backup.
   - **Delete it** (or, safer while learning, restore to a separate path and diff against the
     original).
   - **Start a timer.**
   - Restore it from the backup: `restic restore ...`.
   - **Stop the timer.** Verify the restored data is complete and correct (diff it).
5. **Write the runbook** as you go — the exact steps to restore, so 3am-you can follow it.

### Verify

- [ ] Automated, encrypted backups run on a schedule to a separate disk.
- [ ] You restored real data from a backup and **verified it matches** the original.
- [ ] You have a recovery time (RTO) — an actual number — and a written restore runbook.

### Commit

`blog/04-verified-restore.md` — **the deliverable.** Include: a Mermaid diagram of your backup
architecture (which copies live where, mapped to 3-2-1), your restore runbook, and the
*evidence* — timestamps and terminal output of the real restore. Publish it later; "here's my
tested restore procedure, with receipts" is a standout portfolio piece because almost no junior
candidate has one.

---

## Lab 4 · Hypervisor install

**Goal:** turn your micro PC into a Proxmox hypervisor and recreate your Module 2 server as a VM.
Exercises [Lesson 4.4](/modules/04-storage/virtualization/).

### Steps

1. **Back up first** — this reinstalls the machine. Ensure your data and configs are safely
   backed up (Lab 3) and your build log (Module 2) is current, so you can rebuild.
2. Install **Proxmox VE** on the micro PC (from its ISO, like the Debian install in
   [Lesson 2.1](/modules/02-server/bare-metal/)). Confirm CPU virtualization is enabled in BIOS.
3. Reach the Proxmox web UI over the network; set it up, and harden host SSH as in
   [Lesson 2.3](/modules/02-server/hardening/) (Proxmox is Debian underneath).
4. **Recreate your server as a VM:** create a Debian VM inside Proxmox and install + harden it
   using your Module 2 skills and build log. Give it a DHCP reservation
   ([Module 3](/modules/03-network/)).
5. Confirm the VM behaves like the real server did — `ssh` in, services run.

### Verify

- [ ] The micro PC runs Proxmox; you manage it from the web UI.
- [ ] Your Module 2 Debian server now exists as a VM, hardened, reachable over SSH.
- [ ] You understand this VM is the same abstraction the cloud rents you.

### Commit

`labs/04-04-hypervisor.md`: the install, and a note on how recreating the server as a VM went —
what your Module 2 build log let you reproduce quickly.

---

## Lab 5 · Snapshot safety net

**Goal:** internalize the snapshot-before-risk reflex by breaking a VM on purpose and rolling it
back. Exercises [Lesson 4.4](/modules/04-storage/virtualization/).

### Steps

1. Pick a VM (the one from Lab 4, or a throwaway test VM).
2. **Take a snapshot**, named meaningfully (e.g. `before-experiment`).
3. **Break it deliberately** — something you'd normally never risk: mangle its bootloader,
   delete a critical package, botch a config so it won't boot.
4. Confirm it's broken (won't boot / service dead).
5. **Roll back** to the snapshot. Confirm the VM returns to its exact pre-break state, as if
   nothing happened.
6. Reflect: note how this changes what you're willing to try.

### Verify

- [ ] You snapshotted, broke the VM, and rolled back to a working state.
- [ ] You can articulate the habit: snapshot before any risky change, every time.

### Commit

`labs/04-05-snapshot.md`: what you broke, the rollback, and why this habit accelerates learning
for the rest of the curriculum.

---

## Module 4 checkpoint

- [ ] I can partition, format, mount, and resize storage without a tutorial open (Lab 1)
- [ ] I can explain why RAID is not backup in one sentence to a non-engineer (Lab 2)
- [ ] My homelab has automated, encrypted, tested backups (Lab 3)
- [ ] I have performed a timed restore and have the runbook to prove it (Lab 3)
- [ ] My physical server runs a hypervisor; my services now live in VMs/containers (Lab 4)
- [ ] I snapshot before risky changes, reflexively (Lab 5)

## Deliverable

**Your verified restore demo** (Lab 3): the backup architecture diagram, the restore runbook,
and the timestamped evidence of a real restore — the artifact that most cleanly proves
operational maturity to an employer.

**Next module:** [Module 5 · Overlay Networks →](/modules/05-overlay/) — where you reach your
homelab securely from anywhere, without opening a single port.
