---
title: "Module 2 · Labs"
description: Build, harden, break, and document a real Linux server — five exercises that produce your first runbook.
sidebar:
  label: Labs
---

These five labs take you from a bare micro PC to a hardened, headless server you've *tested* —
including deliberately locking yourself out and recovering, which is the single most valuable
exercise in the module. The capstone (Lab 5) is your build log: a runbook complete enough for a
stranger to reproduce your server. As always, commit as you go.

:::caution[Real hardware, real stakes]
Unlike Modules 0–1, this module touches physical hardware and can lock you out of a headless
machine. Two rules keep it safe: **keep a second SSH session open** whenever you change SSH or
firewall settings, and know you can always reattach a monitor and keyboard to recover at the
console. Getting locked out and recovering is part of the learning (Lab 2) — just do it
deliberately, not by accident.
:::

---

## Lab 1 · The install

**Goal:** install Debian headless on your micro PC and reach it over SSH. Exercises
[Lesson 2.1](/modules/02-server/bare-metal/).

### Steps

1. Create Debian install media on a USB stick (balenaEtcher, or `dd` with extreme care).
2. Boot the micro PC from USB via the firmware boot menu.
3. Install Debian: set a hostname, create your admin user, **lock root** (blank root password →
   sudo setup), and — critically — **deselect the desktop environment**, keeping the SSH server.
4. Choose guided whole-disk partitioning (take LVM if offered).
5. First boot: log in at the console, find the IP with `ip addr`.
6. From your laptop: `ssh <user>@<ip>`, then add a `homelab` entry to `~/.ssh/config` and copy
   your key up with `ssh-copy-id`.
7. Confirm `ssh homelab` works with your key, then **unplug the monitor and keyboard.**
8. `sudo apt update && sudo apt upgrade` to bring it current.

### Verify

- [ ] The server has no desktop environment (it's a text-only, minimal install).
- [ ] It's headless — monitor unplugged, and you administer it entirely via `ssh homelab`.
- [ ] `ssh homelab` logs you in using your key.
- [ ] The system is fully updated.

### Commit

Start your build log now (`build-log.md`) and record every choice you made and why, as you go.
This file becomes Lab 5.

---

## Lab 2 · Break glass

**Goal:** deliberately lock yourself out, then recover — so that the day it happens by accident
(and it will), you're calm and know the path. Exercises [Lessons 2.1](/modules/02-server/bare-metal/)
and [2.3](/modules/02-server/hardening/).

This lab feels scary and is completely safe as long as you have physical access to the machine.
That's the lesson: a headless server is never truly unreachable if you can walk to it.

### Steps

1. **Cause a lockout on purpose.** Pick one:
   - Enable ufw with `default deny incoming` but *without* `ufw allow ssh` first (the classic
     mistake from Lesson 2.3), then disconnect. Your SSH is now blocked.
   - Or: misconfigure `sshd_config` (e.g. set a wrong `AllowUsers`) and restart ssh.
2. **Confirm you're locked out** — `ssh homelab` now fails.
3. **Recover via the physical console.** Reattach the monitor and keyboard, log in locally, and
   fix it: `sudo ufw allow ssh` (or revert the sshd change and `sudo systemctl restart ssh`).
4. **Confirm recovery** — `ssh homelab` works again from your laptop.
5. Unplug the monitor again.

### Verify

- [ ] You locked yourself out over the network (confirmed `ssh` failed).
- [ ] You recovered from the physical console and restored SSH access.
- [ ] You can articulate your recovery path for a headless box.

### Commit

Add `labs/02-break-glass.md`: what you broke, how you recovered, and — importantly — the
**general recovery procedure** for a locked-out headless server. This is a runbook you may
genuinely need. Note the lesson: always keep a second session open, and physical access is the
ultimate backstop.

---

## Lab 3 · Hardening checklist

**Goal:** apply the full day-one hardening and *prove* it with a scan. Exercises
[Lesson 2.3](/modules/02-server/hardening/).

### Steps

Work the checklist, keeping a second SSH session open throughout:

1. Confirm key login works (safety session), then set in `/etc/ssh/sshd_config`:
   `PasswordAuthentication no`, `PermitRootLogin no`. Restart ssh and **test in a new terminal.**
2. Firewall: `ufw default deny incoming`, `ufw default allow outgoing`, `ufw allow ssh`,
   `ufw enable`. Verify with `ufw status verbose`.
3. Install and enable `fail2ban`. Check `sudo fail2ban-client status sshd`.
4. Enable `unattended-upgrades`.
5. Confirm root is locked and review `getent group sudo`.
6. **Prove it.** From your laptop: `nmap -Pn homelab`. Confirm only SSH (22) is open.
7. Bonus: open `/var/log/auth.log` and see the real failed-login attempts from the internet.

### Verify

- [ ] Password SSH is refused; key SSH works; root SSH is denied.
- [ ] `ufw status` shows default-deny inbound with only SSH allowed.
- [ ] fail2ban and unattended-upgrades are both active.
- [ ] `nmap` from another machine shows **only** port 22.

### Commit

Add the completed hardening checklist to your build log, **including the `nmap` output** as
proof. This before/after evidence is exactly what makes the deliverable impressive.

---

## Lab 4 · Service autopsy

**Goal:** understand a systemd service inside-out and practice the troubleshooting method by
breaking and fixing one. Exercises [Lessons 2.2](/modules/02-server/anatomy/) and
[2.4](/modules/02-server/operating/).

### Steps

1. **Install a service.** `sudo apt install nginx`. It starts automatically.
2. **Interrogate it** using only `systemctl` and `journalctl`. Answer, in writing:
   - Is it active? Is it enabled (will it start at boot)? (`systemctl status nginx`)
   - What's its main PID?
   - What does `sudo systemctl stop nginx` then `start` then `restart` do — and how does the
     status change at each step?
   - Where are its logs? (`journalctl -u nginx`)
3. **Break it on purpose.** Introduce a syntax error into an nginx config file under
   `/etc/nginx/`, then `sudo systemctl restart nginx`. It fails to start.
4. **Diagnose it with the method** ([Lesson 2.4](/modules/02-server/operating/)): note the
   symptom, run `systemctl status nginx` and `journalctl -xe`, read the error, form one
   hypothesis, fix the *one* thing, restart, verify. (nginx even has `sudo nginx -t` to test
   config — discover this via the logs.)
5. **Confirm** the service is healthy again and reachable: from your laptop, after
   `sudo ufw allow 80`, browse to `http://homelab` and watch the request land in
   `journalctl -u nginx -f`.

### Verify

- [ ] You can explain what starts nginx, whether it's enabled, and where it logs.
- [ ] You broke it, diagnosed it *from the logs* (not by guessing), and fixed it.
- [ ] You saw a real request arrive in the live logs.

### Commit

Add `labs/04-service-autopsy.md` documenting the service's anatomy and your break/diagnose/fix
walkthrough — narrated as the six-step method, so it doubles as troubleshooting practice.

---

## Lab 5 · The build log

**This is the module's deliverable.** Turn everything you did into a build log good enough that
a stranger could reproduce your server. Exercises [Lesson 0.5](/modules/00-toolkit/writing/) as
much as anything technical.

### The assignment

Produce `build-log.md` — a combined **README + runbook** ([Lesson 0.5](/modules/00-toolkit/writing/))
for your server that covers, in order someone could follow:

1. **Hardware** — what machine, specs, why.
2. **Install** — the choices you made in the Debian installer and why (headless, no desktop,
   partitioning).
3. **Network** — how it gets its address, its hostname, your `~/.ssh/config` entry (redact real
   IPs if you'll make this public — or use the `home.lan` name).
4. **The hardening checklist** — completed, with your `nmap` output as proof.
5. **Services** — what's running (nginx from Lab 4) and how it's configured.
6. **Recovery** — your break-glass procedure from Lab 2.
7. **Gotchas** — every mistake you made and what you learned. (These are the most valuable
   part; don't sanitize them out.)

### Verify

- [ ] A competent stranger could rebuild your server from this document alone.
- [ ] It includes the hardening checklist and the `nmap` proof.
- [ ] It's structured with headings and skimmable ([Lesson 0.5](/modules/00-toolkit/writing/)).
- [ ] No real secrets or private keys are in it (recall [Lesson 0.4](/modules/00-toolkit/git/));
      redact IPs if publishing.

### Commit

```sh
git add build-log.md labs/
git commit -m "Add server build log and hardening checklist"
git push
```

Publish it (or a redacted version) as a post on your site later — "How I built and hardened my
first Linux server" is a genuinely strong portfolio piece, because it shows you don't just run
commands, you understand and document a system.

---

## Module 2 checkpoint

- [ ] My server runs headless; I administer it exclusively over SSH with keys (Lab 1)
- [ ] I can create, enable, and debug a systemd service and read its logs (Lab 4)
- [ ] My firewall default-denies inbound; I can list exactly which ports are open and why (Lab 3)
- [ ] I've been locked out and recovered — and I know my recovery path (Lab 2)
- [ ] An `nmap` scan of my server shows only the ports I intend (Lab 3)
- [ ] My build log is committed and complete enough for a stranger to reproduce (Lab 5)

## Deliverable

**Your server build log + hardening checklist** (Lab 5), committed to your repo, with the
`nmap` proof included — your first real runbook, and evidence that you can stand up and secure a
Linux server from bare metal.

**Next module:** [Module 3 · Build the Network →](/modules/03-network/) — where you take control
of the network your server lives on.
