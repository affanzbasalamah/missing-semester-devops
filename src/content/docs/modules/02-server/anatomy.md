---
title: "Lesson 2.2 · Anatomy of a Running System"
description: systemd services, the filesystem hierarchy, package management, and users, groups & sudo.
sidebar:
  label: "2.2 · Anatomy"
---

You have a running server. Now you need to understand what's running on it and how to control
it. This lesson covers the four things you'll interact with constantly on every Linux system:
**systemd** (which starts and manages services), the **filesystem hierarchy** (where things
live), **package management** (installing and updating software), and **users, groups, and
sudo** (who's allowed to do what). These are the day-to-day fabric of operating a server.

## systemd: the thing that runs everything

Recall from [Lesson 1.1](/modules/01-fundamentals/machine/) that after the kernel boots, it
starts one first process — PID 1 — which starts everything else. On modern Linux that's
**systemd**. It's the init system and service manager: it starts your services at boot, keeps
them running, restarts them if they crash, and collects their logs.

The core concept is a **unit** — systemd's word for something it manages. The kind you'll deal
with most is a **service** (a long-running program like a web server or SSH). You control units
with `systemctl`:

```sh
systemctl status ssh           # is the SSH service running? show recent status and logs
systemctl start nginx          # start a service now
systemctl stop nginx           # stop it now
systemctl restart nginx        # restart it (e.g. after a config change)
systemctl reload nginx         # reload config without a full restart (if the service supports it)
systemctl enable nginx         # start it automatically at every boot
systemctl disable nginx        # don't start it at boot
systemctl enable --now nginx   # enable AND start in one step
```

The distinction that trips up beginners: **`start` vs `enable`.** `start` runs a service *right
now* but doesn't survive a reboot. `enable` makes it start *at boot* but doesn't run it now.
You usually want both, which is why `enable --now` exists. "I restarted the service and it
worked, but after a reboot it's gone" almost always means you started it but never enabled it.

### Reading a service's status

`systemctl status ssh` is one of the most useful commands you'll run. It tells you:

- whether the service is **active (running)**, **inactive**, or **failed**
- whether it's **enabled** (starts at boot)
- the **PID** of the main process
- the last several **log lines** — often enough to see why something failed

When a service won't start, `systemctl status <name>` is your first stop, and it usually points
you straight at the problem or tells you how to see more.

### journalctl: the logs

systemd collects logs from all services into the **journal**. `journalctl` reads it:

```sh
journalctl -u ssh              # all logs for the ssh unit
journalctl -u nginx -f         # follow nginx's logs live (like tail -f)
journalctl -xe                 # recent logs with extra detail — great after a failure
journalctl --since "10 min ago"
journalctl -b                  # logs since the last boot
journalctl -p err              # only error-priority messages and worse
```

You met `tail -f` on log files in [Lesson 0.1](/modules/00-toolkit/shell/); `journalctl -u
<service> -f` is the systemd equivalent, and it's how you'll watch a service behave in real
time. This connects directly to [Lesson 2.4](/modules/02-server/operating/) on reading logs.

## The filesystem hierarchy: a map of where things live

Linux organizes everything under `/` (from [Lesson 0.1](/modules/00-toolkit/shell/)) into a
standard set of directories. Knowing this map means you know *where to look* for anything:

| Path | What lives here |
|---|---|
| `/etc` | **Configuration files** — system and service configs. You'll edit here constantly. |
| `/var/log` | **Log files** (for services that don't use the journal). |
| `/var` | Variable data — logs, caches, spool files, databases. |
| `/home/<user>` | Users' home directories (your files). |
| `/root` | The root user's home directory. |
| `/usr/bin`, `/bin` | Installed **programs** (executables). |
| `/usr/local` | Software you install manually (outside the package manager). |
| `/opt` | Optional/third-party software packages. |
| `/tmp` | Temporary files, wiped on reboot. |
| `/boot` | The kernel and bootloader files. |
| `/dev` | Device files (disks, etc. — you'll meet these in Module 4). |
| `/proc`, `/sys` | Virtual filesystems exposing kernel and process info. |

The two you'll touch most: **`/etc`** for configuration (every service you set up has its
config here) and **`/var/log`** plus the journal for logs. When someone says "check the
config," they mean somewhere under `/etc`; "check the logs," `/var/log` or `journalctl`.

## Package management: installing software the right way

You don't download software from random websites on a server. You use the **package manager**,
which installs vetted software from Debian's **repositories**, handles dependencies, and — 
crucially — lets you keep everything updated with one command. On Debian/Ubuntu the tool is
**apt**:

```sh
sudo apt update                # refresh the list of what's available and its versions
sudo apt upgrade               # install updates for everything installed
sudo apt install htop          # install a package (and its dependencies)
sudo apt remove htop           # remove a package
sudo apt search wireguard      # find packages
apt list --installed           # what's installed
sudo apt autoremove            # remove packages that were only there as dependencies and are no longer needed
```

The distinction to internalize: **`apt update` refreshes the *catalog*; `apt upgrade` installs
the *updates*.** You run `update` first (to learn what's available), then `upgrade` (to apply
it). Running `upgrade` without a recent `update` upgrades against a stale catalog.

:::note[Why the package manager matters for security]
Every piece of software is a potential vulnerability. The package manager is how you *patch*
them — one command updates everything the distribution ships. This is why "keep the system
updated" is the most basic security control there is, and why [Lesson 2.3](/modules/02-server/hardening/)
sets up *automatic* security updates. Software installed by hand from a website is software the
package manager can't patch for you — a maintenance and security liability. Prefer packages.
:::

## Users, groups, and sudo: who can do what

Linux is multi-user at its core, and its permission model (which you met in
[Lesson 0.1](/modules/00-toolkit/shell/)) rests on **users** and **groups**. On a server this
matters for both operation and security.

- Every user has a name and a numeric **UID**. **root** is UID 0 — the all-powerful
  administrator.
- **Groups** collect users so permissions can be granted to several people at once. A file or
  service can be owned by a group.
- Some users are **system users** that run services (e.g. a `www-data` user runs the web
  server) — not people, just identities with limited permissions, so a compromised service
  can't do everything.

### The least-privilege principle, in practice

You set this up during the install: root is locked, and *your* user runs privileged commands
via **sudo**. This is the **principle of least privilege** — you operate as an ordinary user
and only borrow root's power for the specific commands that need it:

```sh
sudo apt install htop          # run this one command as root
sudo systemctl restart nginx
sudo -i                        # (occasionally) open a root shell — use sparingly
```

Why not just log in as root and skip the `sudo`? Because:

- Every `sudo` is a deliberate pause — a moment to notice you're about to do something
  privileged. Running as root all the time removes that guardrail, and a typo (`rm -rf` in the
  wrong place) has no safety net.
- `sudo` use is **logged**, giving you an audit trail of every privileged action.
- If your everyday account is compromised, the attacker doesn't automatically have root.

Managing users, for when you need to:

```sh
sudo adduser bob               # create a new user (interactive, sets up home dir + password)
sudo usermod -aG sudo bob      # add bob to the "sudo" group (grant admin rights) — note -aG
sudo deluser bob               # remove a user
groups                         # what groups am I in?
id bob                         # bob's UID, GID, and groups
```

The `-aG` in `usermod -aG` matters: `-a` means *append* to the user's groups. Forgetting `-a`
(just `-G`) *replaces* all their groups, which can accidentally remove someone from groups they
needed — a classic, painful mistake.

:::caution[The sudo group is the keys to the kingdom]
Anyone in the `sudo` (or `wheel`) group can become root. Grant it sparingly, and in
[Lesson 2.3](/modules/02-server/hardening/) you'll make sure only key-authenticated users can
log in at all. On a server, the list of who can `sudo` is one of the most security-sensitive
things about the whole system.
:::

## Putting it together

You now have the operating vocabulary for any Linux server: **systemd/systemctl** to start,
stop, enable, and inspect services; **journalctl** to read their logs; the **filesystem
hierarchy** to know where configs (`/etc`) and logs (`/var/log`) live; **apt** to install and
patch software safely; and **users, groups, and sudo** to control who can do what under the
principle of least privilege. Everything you build in later modules — the reverse proxy, the
DNS resolver, the monitoring stack — is installed, configured, run, and debugged with exactly
these tools.

## Quick self-check

1. What's the difference between `systemctl start` and `systemctl enable`? Which do you usually
   want?
2. A service worked after you started it, but it's gone after a reboot. What did you forget?
3. Where do configuration files live? Where do you look for logs?
4. What's the difference between `apt update` and `apt upgrade`, and in which order do you run
   them?
5. Explain the principle of least privilege and give two concrete reasons to use `sudo` instead
   of logging in as root.
6. Why does the `-a` matter in `usermod -aG sudo bob`?

**Next:** [Lesson 2.3 · Hardening as a Habit →](/modules/02-server/hardening/)
