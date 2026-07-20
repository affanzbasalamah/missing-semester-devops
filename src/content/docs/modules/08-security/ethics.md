---
title: "Lesson 8.0 · Rules of Engagement"
description: The legal and ethical boundary that defines a security career — authorization, scope, disclosure, and building a safe practice lab.
sidebar:
  label: "8.0 · Rules of Engagement"
---

This lesson is numbered 8.0, not 8.1, because it comes before everything and underpins all of it.
The single most important thing that separates a security *professional* from a criminal is not
skill — it's **authorization**. The exact same port scan is legitimate work on a system you're
authorized to test and a crime on one you're not. Before you run a single scanning tool in this
module, you need to understand this boundary cold. It is the foundation of the entire field, and
employers screen for it hard.

## The line: authorization

The governing principle of all offensive security is simple to state and absolute:

> **You may only scan, probe, test, or access systems that you own, or that you have explicit,
> written permission to test. There are no exceptions, and intent does not matter.**

"I was just curious," "I didn't change anything," "I was only looking," "I wanted to help" — none
of these are legal defenses. Unauthorized access is defined by *lack of authorization*, not by
harm caused or intent held. Scanning a company's servers "to see if they're secure" without their
permission is a crime, even if you'd have reported what you found.

### The laws are real and enforced

Unauthorized access and scanning are criminal offenses under laws worldwide:

- **United States** — the Computer Fraud and Abuse Act (CFAA).
- **United Kingdom** — the Computer Misuse Act.
- **European Union** and most countries — equivalent computer-misuse statutes.

People have been prosecuted, fined, and imprisoned for unauthorized scanning and access — 
sometimes for actions they believed were harmless or helpful. This is not hypothetical caution;
it is career-and-freedom-defining reality. Treat every system that isn't yours as legally
untouchable without written permission.

:::danger[In this curriculum: your lab, your rules — and nothing else]
Everything in this module is done against **your own homelab**, which you own outright and may
test freely. That is precisely why the curriculum is built on hardware you own: it gives you a
legitimate, unlimited practice target. **Never** point any tool from this module at a system you
don't own — not your ISP, not your employer, not a website "just to try `nmap`," not a
neighbor's WiFi. Want more targets? Use the *legal, intentionally-vulnerable* practice
environments below. There is a lifetime of learning available entirely within the bounds of the
law; stay inside them.
:::

## The vocabulary of authorized work

When security testing *is* authorized (as a job, an engagement, or on your own lab), it's governed
by documents that define the permission precisely. Knowing these terms marks you as someone who
understands professional practice:

- **Scope** — exactly which systems, networks, and IP ranges you're permitted to test, and which
  are off-limits. You test *only* what's in scope. Straying outside scope, even by accident, is a
  serious breach.
- **Rules of engagement (RoE)** — what techniques are and aren't allowed (e.g. "no denial-of-service,"
  "testing only during these hours"), so testing doesn't disrupt operations.
- **Authorization / "get-out-of-jail" letter** — written, signed permission from someone with the
  authority to grant it, stating what you may do. This document is your legal cover; without it,
  you're not a pentester, you're an intruder.
- **Responsible disclosure** — when you find a vulnerability (in authorized testing, or a bug
  bounty), the ethical process of reporting it *privately* to the owner and giving them time to
  fix it before any public discussion. The opposite — dumping it publicly or exploiting it — is
  harmful and often illegal.

For your homelab, *you* are the authority granting yourself permission on systems you own — so
you're fully covered. But learn this vocabulary now, because on your first security job it's the
framework you'll work within every day.

## Bug bounties and CTFs: legal ways to go further

You will want to practice on things other than your own lab. There are legitimate, legal avenues
built for exactly that — use these instead of ever touching an unauthorized target:

- **Capture The Flag (CTF)** competitions — gamified security challenges on systems explicitly set
  up to be attacked. Great for skills, completely legal.
- **Intentionally vulnerable practice labs** — [TryHackMe](https://tryhackme.com/) and
  [Hack The Box](https://www.hackthebox.com/) provide sandboxed, legal targets designed to be
  hacked; locally, **DVWA** (Damn Vulnerable Web Application) and **Metasploitable** are
  deliberately-vulnerable VMs you run in your own lab.
- **Bug bounty programs** — companies that *invite* testing of their systems within a published
  scope, often paying for valid findings. Here the company's program *is* your authorization —
  but you must stay strictly within its stated scope and rules.

Every one of these gives you authorized targets. Combined with your own homelab, you have more
than enough to build real skills without ever crossing the line.

## Build your safe practice lab

Applying [Module 3](/modules/03-network/segmentation/)'s segmentation, set up an **isolated
practice environment** so your offensive experiments can't touch anything that matters:

- A dedicated **lab VLAN** ([Lesson 3.3](/modules/03-network/segmentation/)), firewalled off from
  your real devices and your daily-use network.
- Intentionally-vulnerable VMs (DVWA, Metasploitable) and a sacrificial "victim" server as
  targets, on that isolated segment.
- An "attacker" box (a Kali Linux VM, or just your tools) — also on the lab segment.
- Snapshots ([Lesson 4.4](/modules/04-storage/virtualization/)) so you can reset targets to a
  clean state between exercises.

This isolated lab is where the offensive labs in this module happen. It keeps your experiments
away from your production homelab (and your household) while giving you a realistic playground —
the same containment principle real security teams use.

## The mindset

Security work carries real power — the ability to find and exploit weaknesses, to see traffic and
systems others can't. Ethics is what makes that power constructive rather than destructive. The
professional mindset:

- **Default to "not authorized."** If you don't have explicit permission, you don't touch it.
  When unsure, the answer is no.
- **Minimize impact.** Even when authorized, don't disrupt, don't exfiltrate real data, don't go
  beyond what's needed to demonstrate the issue.
- **Disclose responsibly.** Findings go privately to the owner, to be fixed — never weaponized or
  published to harm.
- **Respect privacy.** The access security work grants (like the network visibility from
  [Lesson 3.4](/modules/03-network/watching/)) is a responsibility, not a license to snoop.

Carry this from your first scan to your last. It's what the whole field runs on, and it's the
first thing a good employer looks for.

## Quick self-check

1. What single factor separates legitimate security testing from a crime?
2. Why are "I didn't cause harm" and "I only looked" not legal defenses?
3. Define scope, rules of engagement, and an authorization letter.
4. What is responsible disclosure, and what's the unethical alternative?
5. Name three *legal* ways to practice offensive skills beyond your own lab.
6. How should your practice lab be set up so experiments can't harm anything real?

**Next:** [Lesson 8.1 · Assess →](/modules/08-security/assess/)
