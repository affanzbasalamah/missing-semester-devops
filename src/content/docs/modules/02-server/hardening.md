---
title: "Lesson 2.3 · Hardening as a Habit"
description: SSH keys only, a default-deny firewall, fail2ban, unattended upgrades, and a locked-down admin account — applied on day one.
sidebar:
  label: "2.3 · Hardening"
---

This is the most important lesson in the module, and it introduces a habit you'll keep for the
rest of the curriculum and your career: **every server gets hardened on day one.** Not "later,
once it's working" — hardening *is* part of setting it up. A fresh internet-connected server is
probed by automated attackers within *minutes*; the controls in this lesson are what stand
between "a box I built" and "a box I'd trust with something real."

We'll apply five layers. None is complicated. The discipline is doing all of them, every time,
by reflex.

:::note[Security is woven through, not bolted on]
This is where the curriculum's security spine begins. You'll harden every machine from here on,
and in [Module 8](/modules/08-security/) you'll come back and *attack* your own lab to verify
these controls actually work. Hardening you never test is hardening you don't really have —
which is why this lesson ends with verification.
:::

## Layer 1 · SSH: keys only, no passwords, no root

SSH is your server's front door and the service most relentlessly attacked. You already log in
with a key ([Lesson 0.2](/modules/00-toolkit/remote/)); now you'll *disable password login
entirely*, so brute-forcing a password becomes impossible — there's nothing to brute-force.

:::caution[Confirm key login works before you disable passwords]
This is the one step that can lock you out. **Before** changing anything, open a second terminal
and confirm `ssh homelab` logs you in *without* asking for a password. Keep that session open
while you edit, as a safety line. If key login isn't working yet, fix that first
([Lesson 0.2](/modules/00-toolkit/remote/)) — do not disable passwords until it does.
:::

Edit the SSH server config:

```sh
sudo vim /etc/ssh/sshd_config    # your Lesson 0.3 vim skills, on a real config
```

Set these directives (they may exist commented-out; uncomment and set them):

```
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
```

- **`PasswordAuthentication no`** — the big one. Only key holders can log in.
- **`PermitRootLogin no`** — nobody logs in directly as root; they log in as a user and use
  `sudo` (Lesson 2.2). Attackers always try `root` first; this closes it.

Apply the change by restarting SSH, and **test in a new terminal before closing your safety
session**:

```sh
sudo systemctl restart ssh
# In a NEW terminal, confirm you can still get in:
ssh homelab
# And confirm passwords are refused (this should FAIL for a password-only attempt):
ssh -o PubkeyAuthentication=no homelab   # expect: Permission denied
```

Changing the SSH port (e.g. off 22) is sometimes suggested. It's mild "security through
obscurity" — it cuts log noise from dumb bots but stops no real attacker. Key-only auth is the
control that matters. Move the port if you like the quieter logs; don't mistake it for security.

## Layer 2 · A firewall that default-denies

A **firewall** controls which network connections the server accepts. The right posture for a
server is **default deny inbound**: block everything, then explicitly allow only the ports for
services you actually run. This is the same segmentation logic you'll apply to your whole
network in [Module 3](/modules/03-network/), here at the single-host level.

Debian's friendly firewall front-end is **ufw** (Uncomplicated Firewall):

```sh
sudo apt install ufw
sudo ufw default deny incoming     # block all inbound by default
sudo ufw default allow outgoing    # let the server reach out (updates, etc.)
sudo ufw allow ssh                 # allow SSH — or you'll lock yourself out!
sudo ufw enable                    # turn it on
sudo ufw status verbose            # see the rules
```

:::danger[Allow SSH *before* you enable the firewall]
`ufw default deny incoming` blocks SSH too. If you enable the firewall without first running
`ufw allow ssh`, your next disconnect locks you out of a headless box, and you'll be plugging
the monitor back in. Always `allow ssh` first. (This is a great thing to do wrong *on purpose*
in a safe way — which is exactly [Lab 2](/modules/02-server/labs/#lab-2--break-glass).)
:::

As you add services in later modules, you allow their ports the same way — `ufw allow 80`,
`ufw allow 443` for a web server — and *only* those. Everything else stays denied. When you run
`nmap` against the server later, the only open ports should be ones you can name and justify.

## Layer 3 · fail2ban: mute the noise

Even with password auth disabled, your logs will fill with attempted logins from bots. **fail2ban**
watches the logs and temporarily bans IP addresses that misbehave (e.g. many failed SSH
attempts):

```sh
sudo apt install fail2ban
sudo systemctl enable --now fail2ban
sudo fail2ban-client status         # see active jails
sudo fail2ban-client status sshd    # see banned IPs for SSH
```

With key-only auth, fail2ban is less about *stopping* a breach (there's no password to guess)
and more about cutting log noise and slowing broad scans. It's cheap insurance and a good habit.
You'll get real value from watching its logs — seeing thousands of blocked attempts is a
visceral lesson in why internet-facing hardening matters.

## Layer 4 · Automatic security updates

The single most effective security control is *staying patched* — most breaches exploit known
vulnerabilities that already had fixes available. You update manually with `apt` (Lesson 2.2),
but you shouldn't rely on remembering. Set security updates to install themselves:

```sh
sudo apt install unattended-upgrades
sudo dpkg-reconfigure --priority=low unattended-upgrades   # answer "Yes" to enable
```

This installs security patches automatically. You'll still run `apt upgrade` yourself for
everything else, but the critical security fixes land without you thinking about it. Combined
with the package manager's coverage (Lesson 2.2), this closes the most common door attackers
walk through.

## Layer 5 · A locked-down admin account

You already did most of this at install time; confirm it's right:

- **root's password login is locked** — you use a named user + `sudo`, not direct root (Lesson
  2.2). Verify no one can `ssh root@...` (Layer 1 handles this).
- **Your admin user has a strong password** for `sudo` (the key logs you in; the password
  authorizes `sudo`).
- **Only intended users are in the `sudo` group** (`getent group sudo` lists them).

That's least privilege at the account level, reinforcing the SSH and firewall layers above.

## Verify your work — hardening you don't test isn't real

Hardening is only real if you confirm it. From your **laptop** (not the server), scan the server
the way an outsider would, using `nmap` (install it with your package manager if needed):

```sh
nmap -Pn homelab               # what ports are open to me?
```

You should see **only** the ports you deliberately allowed — for now, just SSH (22). If you see
anything else, you have a service listening you didn't intend, or a firewall rule missing. Track
it down. This scan is the proof, and it's part of your [Lab 3](/modules/02-server/labs/#lab-3--hardening-checklist)
deliverable. In [Module 8](/modules/08-security/) you'll scan far more aggressively and against
your whole network — this is the gentle first version of a habit that becomes central to the
security track.

## The hardening checklist (your day-one reflex)

Copy this into your build log and run it against **every** server you build from now on:

- [ ] System fully updated (`apt update && apt upgrade`)
- [ ] SSH: `PasswordAuthentication no`, `PermitRootLogin no`, key login confirmed working
- [ ] Firewall: default deny inbound, SSH explicitly allowed, enabled
- [ ] fail2ban installed and running
- [ ] Automatic security updates enabled
- [ ] root login locked; admin via named user + `sudo`; sudo group membership reviewed
- [ ] `nmap` from another machine shows only intended ports

## Quick self-check

1. What's the single most important reason to disable password authentication for SSH?
2. What must you verify *before* setting `PasswordAuthentication no`, and why?
3. In what order do you configure ufw's rules to avoid locking yourself out?
4. With key-only auth already in place, what does fail2ban actually buy you?
5. Why are automatic *security* updates worth enabling even though you also update by hand?
6. How do you *prove* your hardening worked, and from where do you run that check?

**Next:** [Lesson 2.4 · Knowing Your System →](/modules/02-server/operating/)
