---
title: "Module 8 · Labs"
description: Assess your lab, drill secret rotation, build monitoring and detection, run a purple-team exercise, and write a post-mortem.
sidebar:
  label: Labs
---

These six labs turn security from a topic into a practice. The centerpiece (Lab 5) is the
purple-team exercise — attack your own lab, hunt yourself in the logs, close the gaps — which
produces the module deliverable. Everything happens against **your own infrastructure and your
isolated practice lab**, never anything else.

:::danger[Authorization, restated — because it matters most]
Every offensive technique here is for **your own systems and your isolated practice lab only**
([Lesson 8.0](/modules/08-security/ethics/)). Scanning or attacking systems you don't own is a
crime regardless of intent. Build the isolated lab VLAN and use intentionally-vulnerable VMs
(DVWA, Metasploitable) as targets; snapshot them so you can reset
([Lesson 4.4](/modules/04-storage/virtualization/)). If you want more targets, use legal ranges
(TryHackMe, HTB) — never an unauthorized system.
:::

---

## Lab 1 · Self-assessment

**Goal:** scan your own lab, produce a findings report, remediate, and re-scan to prove the fixes.
Exercises [Lesson 8.1](/modules/08-security/assess/).

### Steps

1. **Enumerate** your lab with `nmap` (`-sn` for discovery, `-sV -p-` for full service/version on
   key hosts). Compare against your [Module 3](/modules/03-network/) diagram — is anything running
   you didn't expect?
2. **Vulnerability scan** with OpenVAS/Greenbone (or Nessus Essentials, or Lynis on-host) against
   your own servers. Produce a **findings report**.
3. **Triage** by *real risk in context* (exposure, blast radius), not CVSS alone. Pick the top
   items.
4. **Remediate** each: patch ([Lesson 2.2](/modules/02-server/anatomy/)), tighten firewall/segment
   ([Lessons 2.3](/modules/02-server/hardening/) / [3.3](/modules/03-network/segmentation/)), fix
   config, or remove the service.
5. **Re-scan** and confirm each finding is gone. Capture before/after.

### Verify

- [ ] You produced a real findings report for your own lab.
- [ ] You remediated the top findings and **re-scanned to verify** they're closed.
- [ ] You prioritized by contextual risk and can justify the order.

### Commit

`security/01-assessment.md`: the (sanitized) findings, your remediations, and the before/after
scan evidence. A genuinely strong portfolio artifact.

---

## Lab 2 · Leak drill

**Goal:** build the secret-rotation reflex by detecting, rotating, and scrubbing a leaked secret.
Exercises [Lesson 8.2](/modules/08-security/identity/).

### Steps

1. In a **throwaway test repo**, deliberately commit a fake secret (a dummy API token) and make a
   few commits on top so it's buried in history.
2. **Detect** it: `gitleaks detect` / `trufflehog` — confirm the tool finds it in history, not
   just the latest commit.
3. **Rotate first** (the reflex): in a real scenario you'd revoke the token and issue a new one —
   practice the steps and write down why rotation, not deletion, is the real fix.
4. **Scrub** history (`git filter-repo` or BFG) and confirm the scanner no longer finds it.
5. **Prevent recurrence:** add a `gitleaks` **pre-commit hook** and/or a CI gate
   ([Lesson 7.4](/modules/07-automation/cicd/)); prove it blocks a new secret before commit/push.

### Verify

- [ ] A secret scanner found the planted secret in history.
- [ ] You can explain why rotation must come before (or instead of) scrubbing.
- [ ] A pre-commit/CI guard now blocks secrets before they're pushed.

### Commit

`security/02-leak-drill.md` (in a *clean* repo — not the one with the planted secret): your method
and the rotation-first reasoning.

---

## Lab 3 · Dashboards

**Goal:** stand up monitoring and alerting for your homelab. Exercises
[Lesson 8.3](/modules/08-security/monitoring/).

### Steps

1. Deploy **Prometheus + Grafana** as containers ([Module 6](/modules/06-selfhosting/docker/)),
   with `node_exporter` on each host.
2. Build a **dashboard** showing your homelab's vital signs: CPU, memory, disk, service health
   across hosts (the four resources from [Lesson 1.1](/modules/01-fundamentals/machine/)).
3. Configure at least one **alert that actually reaches you** (email/push/webhook) on a real
   condition — e.g. disk >85%, a service down, or a **TLS cert expiring within 14 days**
   ([Lesson 6.3](/modules/06-selfhosting/tls/)).
4. **Trigger it** deliberately (fill a disk on a test VM, stop a service) and confirm the alert
   fires and reaches you.

### Verify

- [ ] A Grafana dashboard shows your homelab's health at a glance.
- [ ] At least one alert is wired to actually notify you.
- [ ] You triggered a real condition and received the alert.

### Commit

`security/03-monitoring.md` with your dashboard (screenshot) and alert config; add the
Prometheus/Grafana stack to your `homelab/` Compose repo.

---

## Lab 4 · Central logging & a detection rule

**Goal:** centralize logs and write a detection rule that fires on attack behavior. Exercises
[Lesson 8.3](/modules/08-security/monitoring/).

### Steps

1. Ship logs from all hosts to a central store — **Loki** (with the Grafana stack), or **Wazuh**
   for a full SIEM experience.
2. Confirm you can **search across hosts** from one place (e.g. find `auth.log` failed logins
   from every server at once).
3. Write **one detection rule** — start with SSH brute-force (many failed logins from one IP in a
   short window), or "a new listening port appeared," or off-hours access.
4. **Trigger it deliberately** from another VM (attempt repeated SSH logins to a target) and
   confirm the rule fires an alert.
5. Note *why* central logging beats per-host logs for both correlation and integrity
   ([Lesson 8.3](/modules/08-security/monitoring/)).

### Verify

- [ ] Logs from all hosts are searchable in one central place.
- [ ] You wrote a detection rule and **triggered it** to confirm it fires.
- [ ] You can explain the correlation and integrity benefits of central logging.

### Commit

`security/04-detection.md`: your logging setup, the detection rule, and evidence it fired.

---

## Lab 5 · Purple team

**This is the module's centerpiece and deliverable.** Attack your lab, hunt yourself in the logs,
close the gaps. Exercises [Lesson 8.4](/modules/08-security/purple-team/).

### Steps

1. **Prepare** — in your isolated lab, set up a sacrificial target with a *planted* weakness (weak
   SSH password, DVWA, a known-vulnerable service). Snapshot it.
2. **RED:** run an attack chain — recon (`nmap`), gain a foothold via the planted weakness, then do
   attacker things: create a user, open a new listening port, read a planted "sensitive" file,
   attempt lateral movement to another lab host. Keep timestamped notes.
3. **BLUE:** switch hats. Using *only* your dashboards and logs
   ([Lesson 8.3](/modules/08-security/monitoring/)), reconstruct the attack and build a timeline.
   Which steps did your detection catch? Which did it **miss**?
4. **Close the gaps:** for everything you missed, add a detection rule / ship a missing log / tune
   an alert. **Re-run** the attack and confirm you now catch what you missed.
5. **Write the purple-team report** (below).

### Verify

- [ ] You executed a multi-step attack against your own lab target.
- [ ] You reconstructed it from your defensive evidence and built a timeline.
- [ ] You honestly identified what your detection **missed**, then closed those gaps and verified.

### Deliverable

`blog/08-purple-team-report.md` — the module deliverable. Include: the attack narrative (what red
did), the detection evidence (dashboard/log screenshots), the timeline, an **honest account of
what you missed**, and the gaps you closed. This is the most impressive security-track artifact you
can show.

---

## Lab 6 · Post-mortem

**Goal:** practice incident response and write a blameless post-mortem. Exercises
[Lesson 8.4](/modules/08-security/purple-team/) and [0.5](/modules/00-toolkit/writing/).

### Steps

1. Take the compromise from Lab 5 (or investigate a prepared "already-compromised" VM image) as
   your incident.
2. Work the **IR lifecycle**: detect → contain → eradicate → **recover** (restore from your tested
   backups [Lesson 4.3](/modules/04-storage/backups/), or rebuild from code
   [Module 7](/modules/07-automation/)) → learn.
3. Write a **blameless post-mortem** ([Lesson 0.5](/modules/00-toolkit/writing/)): summary,
   timeline, root cause, what detection caught vs. missed, and concrete action items.

### Verify

- [ ] You worked the full IR lifecycle, including a real recovery from backup or code.
- [ ] Your post-mortem is blameless, factual, and has concrete action items.

### Commit

`blog/08-incident-postmortem.md` — pairs with the purple-team report as the deliverable.

---

## Module 8 checkpoint

- [ ] I can state, precisely, what I am and am not legally allowed to test (Lesson 8.0)
- [ ] I regularly scan my own lab and remediate findings, with before/after proof (Lab 1)
- [ ] No secret lives in plaintext or in git history; I know how to rotate one (Lab 2)
- [ ] My homelab has metrics dashboards and alerts that reach me (Lab 3)
- [ ] My hosts ship logs centrally and I have at least one working detection rule (Lab 4)
- [ ] I've run a purple-team exercise and found (most of) my own attack in the logs (Lab 5)
- [ ] I can write a clear, blameless post-mortem (Lab 6)

## Deliverable

**Your purple-team report + post-mortem** (Labs 5–6): the attack narrative, detection evidence, an
honest account of what you missed, the gaps you closed, and a blameless incident write-up — the
single most impressive artifact for a security-track interview.

**Next module:** [Module 9 · The Bridge to a Career →](/modules/09-career/) — where all of this
becomes a job.
