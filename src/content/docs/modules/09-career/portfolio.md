---
title: "Lesson 9.4 · Portfolio & Job Hunt"
description: Turn your artifacts into a 'hire me' page, decode job descriptions, and walk into interviews with a story bank.
sidebar:
  label: "9.4 · Portfolio & Job Hunt"
---

You have the skills and the artifacts. This final lesson is about *presentation and pursuit* —
turning months of work into a portfolio that gets you interviews, and walking into those
interviews able to talk about real things you built. The good news: because this curriculum made
you document everything in public as you went, most of the raw material already exists. Now you
frame it, and go get the job.

## Your portfolio already exists — now curate it

Your self-hosted site ([Module 6](/modules/06-selfhosting/)) already hosts your writeups. The job
now is **curation and framing** — presenting your artifacts as *case studies*, not a pile of
lab notes. For each major deliverable, frame it around the value it demonstrates:

| Artifact (module) | What it proves to an employer |
|---|---|
| [Packet-capture walkthrough](/modules/01-fundamentals/labs/) (M1) | I understand networking from the wire up |
| [Server build log + hardening](/modules/02-server/labs/) (M2) | I can stand up and secure a Linux server |
| [Network diagram + segmentation](/modules/03-network/labs/) (M3) | I design networks with security in mind |
| [Verified restore demo](/modules/04-storage/labs/) (M4) | I take backups seriously — and test them |
| [Remote-access ADR](/modules/05-overlay/labs/) (M5) | I reason about architecture and trade-offs |
| [Self-hosted portfolio + git](/modules/06-selfhosting/labs/) (M6) | I run real services in production |
| [IaC + self-deploying site](/modules/07-automation/labs/) (M7) | I automate; I think in code, not clicks |
| [Purple-team report + post-mortem](/modules/08-security/labs/) (M8) | I can attack, defend, and respond maturely |
| [Threat model](/modules/09-career/threat-model/) (M9) | I reason about risk like a senior |

Notice this *is* the closed loop paying off: the site demonstrating these skills is itself running
on the infrastructure the skills built. Say that explicitly on the site — it's your single
strongest differentiator.

## The "Hire Me" page

Build one page ([Lab 4](/modules/09-career/labs/#lab-4--hire-me-page)) that does one job: **map
what employers ask for to concrete proof you can do it.** Job descriptions are lists of
requirements; your page answers each with a link to something real:

```
"Configure and secure Linux servers"     → my hardening runbook   [link]
"Experience with Docker / containers"     → my self-hosted stack   [link]
"Infrastructure as Code (Terraform/Ansible)" → my homelab-from-code [link]
"Networking fundamentals (TCP/IP, DNS)"   → my packet-capture writeup [link]
"CI/CD pipelines"                         → my self-deploying site  [link]
"Monitoring and incident response"        → my purple-team report   [link]
```

This is devastatingly effective because it does the hiring manager's work *for* them: instead of
hoping they infer your ability from a bullet-pointed résumé, you hand them verifiable evidence for
each requirement. Most candidates *claim*; you *demonstrate*. Aim to map at least eight common
requirements to linked artifacts.

Round out the site with a clean **README/landing** that orients a stranger in 60 seconds
([Lesson 0.5](/modules/00-toolkit/writing/) writing skills), and a tidy commit history
([Module 0](/modules/00-toolkit/git/)) — because a technical interviewer *will* look at your
repos, and a readable history of real work is itself a positive signal.

## Certifications: validate, don't substitute

You'll wonder about certs. The honest framing: **certifications validate; your homelab
demonstrates.** A cert says you passed an exam; your artifacts show you *did the thing*. They're
complementary, and which matters more depends on the role and region. Map the common ones to what
you've *already* proven:

- **CompTIA Linux+ / Network+ / Security+** — foundational; you've done the hands-on equivalent of
  most of their content across Modules 1–3 and 8.
- **Cloud associate certs** (AWS/Azure/GCP) — often genuinely useful for cloud roles and ATS
  filters; your Module 9 work is a running start.
- **CKA** (Kubernetes) — if you go the orchestration route (the optional track beyond
  [Module 4](/modules/04-storage/virtualization/)).

If a target job or region leans on certs for screening, get the relevant one — but know that your
portfolio is the thing that will actually carry the *interview*, because it gives you real stories
to tell.

## Decoding job descriptions

Job posts are intimidating until you learn to read them. Two skills:

- **Separate must-haves from wish-lists.** Postings list far more than any one hire needs. Nobody
  has all of it. If you match the core and can speak to the rest, apply — under-qualified-feeling
  candidates who apply anyway get hired constantly; the ones who self-reject don't.
- **Translate the jargon back to what you built.** "Experience with observability stacks" → your
  Prometheus/Grafana ([M8](/modules/08-security/monitoring/)). "Familiarity with zero-trust
  networking" → your Module 5 overlay work. Almost every requirement maps to something you've
  done; the mapping table in [Lesson 9.1](/modules/09-career/cloud-mapping/) and your Hire Me page
  are exactly this translation.

## The interview: your homelab is your story bank

Technical interviews lean heavily on "tell me about a time you..." questions — and this is where
your homelab becomes a superpower. Because you *built and broke and fixed* real things, you have a
genuine answer to almost all of them:

- *"Tell me about a time you debugged a difficult problem."* → the WireGuard handshake you
  methodically diagnosed ([Lesson 5.1](/modules/05-overlay/wireguard/)).
- *"Describe a time you dealt with a security issue."* → your purple-team exercise and what your
  detection missed ([Module 8](/modules/08-security/)).
- *"How do you approach automating a manual process?"* → encoding your server as Ansible
  ([Module 7](/modules/07-automation/)).
- *"Walk me through an architecture decision you made."* → your remote-access ADR
  ([Lesson 5.4](/modules/05-overlay/choosing/)).

Prepare by **narrating your own artifacts out loud**: for each, be ready to say *what you did, why,
and what went wrong* — that last part matters most, because honestly discussing what broke and
what you learned reads as maturity and is almost impossible to fake. Do a **mock interview**
([Lab 5](/modules/09-career/labs/#lab-5--mock-interview)): have someone ask you to walk through
your architecture diagram and your purple-team report, record it, and watch it back. It's
uncomfortable and it works.

:::tip[The whole curriculum was interview preparation]
Every deliverable was chosen to be something you could show and discuss. You didn't do labs for
their own sake — you built a *story bank* of real experiences, each with a "what, why, and what
broke." When an interviewer asks about networking, security, automation, or operations, you're not
reaching for a memorized definition; you're describing something you actually did, on infrastructure
you actually run. That is what makes this path work.
:::

## Quick self-check

1. Why frame your artifacts as "case studies" rather than lab notes?
2. What single job does the "Hire Me" page do, and why is it so effective?
3. What's the honest relationship between certifications and your homelab portfolio?
4. Why should you apply to jobs even when you don't match every listed requirement?
5. For a "tell me about a time you debugged something hard" question, which artifact would you
   reach for?
6. Why is "what went wrong" the most important part of narrating an artifact?

**Next:** [The Labs →](/modules/09-career/labs/) — where you map to the cloud, deploy for real,
threat-model, and build the portfolio that gets you hired.
