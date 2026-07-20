---
title: "Lesson 2.4 · Knowing Your System"
description: Reading logs, resource triage on a real server, and a repeatable troubleshooting method.
sidebar:
  label: "2.4 · Operating"
---

A server you can't diagnose is a server you don't really run. This lesson turns the resource
model from [Lesson 1.1](/modules/01-fundamentals/machine/) into daily operating skill on your
actual machine, and gives you a **repeatable method** for figuring out what's wrong — the
thing that separates methodical engineers from people who restart services and pray. These are
the skills you'll lean on every time something misbehaves, in every remaining module.

## Reading logs: the server tells you what's wrong

Most of the time, the server is already telling you the problem — in its logs. The skill is
knowing where to look and how to read efficiently. You have two sources: the **systemd journal**
(Lesson 2.2) and traditional log files under **`/var/log`**.

### The journal

```sh
journalctl -u <service> -f       # follow one service's logs live (your main tool)
journalctl -u <service> --since "1 hour ago"
journalctl -xe                   # recent logs with explanations — run this right after a failure
journalctl -p err -b             # error-level and worse, since last boot
journalctl -k                    # kernel messages (hardware, drivers)
```

### /var/log

Some software logs to files instead of (or in addition to) the journal:

```sh
sudo less /var/log/syslog        # general system log
sudo less /var/log/auth.log      # authentication — see those SSH attempts fail2ban is catching
sudo tail -f /var/log/nginx/access.log   # a service's own logs (once you install it)
```

`auth.log` is worth opening now: you'll see the stream of failed login attempts from the
internet that motivated everything in [Lesson 2.3](/modules/02-server/hardening/). It makes the
threat concrete.

### How to read logs efficiently

You rarely read logs top to bottom. You **search** them, using your Lesson 0.1 pipe skills:

```sh
journalctl -u nginx | grep -i error       # find errors in a service's logs
sudo grep "Failed password" /var/log/auth.log | wc -l   # how many failed logins?
journalctl --since "09:00" --until "09:15"              # narrow to when the problem happened
```

The most important habit: **when something breaks, note *when* it broke, then look at the logs
from exactly that window.** A timestamp turns "somewhere in thousands of log lines" into "these
twenty lines."

## Resource triage on a real server

[Lesson 1.1](/modules/01-fundamentals/machine/) gave you the four-resource method — CPU, memory,
disk, network. Here it is on your actual server. Install `htop` first (`sudo apt install htop`),
then keep these at your fingertips:

```sh
# CPU & overall load
htop                 # live, interactive view of processes, CPU, memory — your dashboard
uptime               # load average (1, 5, 15 min); compare to your CPU core count

# Memory
free -h              # trust "available"; watch whether swap is filling

# Disk
df -h                # is any filesystem near 100%? a full disk breaks things weirdly
du -sh /var/log/*    # what's using space? (great when df says a partition is full)

# Network
ss -tunlp            # what's listening and connected (recall Lesson 1.2)
ip addr              # this server's addresses
ping 1.1.1.1         # basic reachability
```

Two server-specific realities to internalize:

- **A full disk is one of the most common real outages**, and it presents as unrelated
  failures — services can't write, databases corrupt, logs stop. Whenever something is
  mysteriously broken, `df -h` early. Often the fix is finding and clearing whatever filled
  `/var/log` or `/tmp`.
- **Memory pressure shows as slowness, not an error.** When "available" memory hits zero and
  swap fills, everything crawls (recall the speed table from Lesson 1.1). `free -h` and `htop`
  reveal it.

## A repeatable troubleshooting method

Here is the actual payoff of the module — a method you apply to *any* problem, on any system,
for the rest of your career. Most people, when something breaks, start randomly changing things.
That's how a small problem becomes a big one. Instead, work the method:

### 1. Describe the problem precisely

"It's broken" is not a problem statement. "The website returns 502 since 14:03" is. Get
specific: *what* exactly fails, *when* did it start, *what changed* around then? Precision here
does half the work.

### 2. Ask: what changed?

The overwhelming majority of failures follow a change — a config edit, an update, a new deploy,
a full disk crossing a threshold. "It was working yesterday" means *something* changed. Your git
history (from [Module 0](/modules/00-toolkit/git/)!) and your command history are your record of
what. This is a concrete reason your configs live in git: you can *see* what changed.

### 3. Check the four resources

Before theorizing, rule out the boring causes: `df -h` (disk full?), `free -h` (out of memory?),
`htop` (CPU pegged?), `ss`/`ping` (network?). Half of "mysterious" problems are one of these
four, quietly maxed.

### 4. Read the logs from the right window

Now look at the logs — specifically from *when the problem started* (step 1 gave you the time).
`journalctl -u <service> --since ...` or the service's log file. The error is very often stated
plainly there.

### 5. Form one hypothesis and test it

Based on the logs, form a *single* specific guess ("the config change broke the syntax") and
test *that one thing* — don't change five things at once, or you won't know which fixed (or
worsened) it. Change one variable, observe, repeat.

### 6. Verify the fix, then write it down

Confirm the problem is actually gone (not just quiet). Then record what happened — which, for a
real incident, becomes a **post-mortem** ([Lesson 0.5](/modules/00-toolkit/writing/)). Even for
small things, a note in your build log ("nginx wouldn't start — missing semicolon in the config
— fixed") saves future-you an hour.

:::tip[Change one thing at a time]
If you take one idea from this lesson, take this: **when debugging, change one variable at a
time and observe the result before the next change.** Shotgun-debugging (changing many things
at once, restarting everything, hoping) is how you turn a five-minute fix into a two-hour
mystery and can't even tell what worked. Discipline here is a genuine professional
differentiator.
:::

## Practice: deliberately break and fix

You learn this method by using it, ideally on problems where you know the answer. That's exactly
[Lab 4](/modules/02-server/labs/#lab-4--service-autopsy): you'll break a service on purpose,
then use logs and the method to diagnose it — the safe, controlled version of what you'll do for
real (and adversarially) in [Module 8](/modules/08-security/)'s incident-response exercise.

## Quick self-check

1. Which command follows a single service's logs live, and where else might that service log?
2. Why is noting *when* a problem started one of the most valuable first steps?
3. A service is mysteriously failing and the errors seem unrelated to disk. Why check `df -h`
   anyway?
4. Walk through the six-step troubleshooting method in your own words.
5. Why is "change one thing at a time" so important when debugging?
6. How does keeping your configs in git (Module 0) help you answer "what changed?"

**Next:** [The Labs →](/modules/02-server/labs/) — where you build, harden, break, and document
your server.
