---
title: "Module 8 · Security Operations"
description: Scan, harden, monitor, detect. Attack your own lab and find yourself in the logs.
sidebar:
  label: "8 · Security Operations"
---

Security wasn't a bolt-on in this curriculum — you've been hardening since Module 2. This
module makes it a discipline: you'll assess your own lab like an attacker, build the
monitoring an operator needs, and then run a **purple-team exercise** — attack your own
homelab and hunt yourself in the logs. That single exercise teaches operations and security
better than anything else here.

:::caution[Ethics and law first — this is mandatory]
Every offensive technique in this module is to be used **only against systems you own or
have explicit written permission to test.** Unauthorized scanning or access is a crime under
laws like the US Computer Fraud and Abuse Act, the UK Computer Misuse Act, and equivalents
worldwide. The skill that makes you employable is knowing — and respecting — that line.
Lesson 8.0 is not optional.
:::

## What you'll learn

### Lesson 8.0 — Rules of engagement
- The legal and ethical boundary: authorization, scope, and why they're everything
- Responsible disclosure; what a scope document and a get-out-of-jail letter are
- Building a *safe* practice environment: an isolated lab VLAN, intentionally vulnerable VMs
  (DVWA, Metasploitable, TryHackMe/HTB), your own targets only

### Lesson 8.1 — See yourself as an attacker sees you
- Reconnaissance and scanning with `nmap` against *your own* lab: hosts, ports, services, versions
- Vulnerability scanning: OpenVAS/Greenbone or Nessus Essentials against your own server
- Reading a findings report; prioritizing by real risk, not CVSS theater
- The fix loop: scan → understand → remediate → re-scan to verify

### Lesson 8.2 — Identity, secrets, and access hygiene
- Password managers, MFA everywhere, SSH certificate auth at scale
- Secrets that leak: how tokens end up in git history and what to do (rotate, then scrub)
- Least privilege as an ongoing audit, not a one-time setting

### Lesson 8.3 — Monitoring and observability
- Metrics: Prometheus + Grafana for CPU, memory, disk, service health across the homelab
- Alerting: get told *before* the disk fills or the certificate expires
- The difference between monitoring (is it healthy?) and detection (is someone attacking?)

### Lesson 8.4 — Logging and detection: your mini-SOC
- Centralized logs: forward everything to Loki, or run Wazuh/Security Onion for a real SIEM feel
- Writing one good detection rule: e.g., alert on SSH brute-force, or a new listening port appearing
- Log integrity: why an attacker's first move is your logs, and how central logging defeats it

### Lesson 8.5 — The purple-team exercise
- **Red:** from your isolated lab VLAN, attack your own homelab — scan, brute-force a weak
  service you planted, get a foothold on a sacrificial VM.
- **Blue:** switch hats. Find the entire operation in your logs and dashboards. Reconstruct
  the timeline. What did you see? What did you *miss*?
- Close the gaps and run it again. This is how real detection engineering works.

### Lesson 8.6 — Incident response, lite
- The IR lifecycle: prepare, detect, contain, eradicate, recover, learn
- Working from a prepared "compromised" VM image: investigate what happened
- Writing the **post-mortem**: blameless, factual, with concrete follow-up actions

## Labs

1. **Self-assessment.** Full `nmap` + vulnerability scan of your own lab. Produce a findings
   report. Remediate the top items. Re-scan to prove the fixes. Commit before/after.
2. **Leak drill.** Plant a fake secret in a test repo's history, then practice detecting it
   (`gitleaks`/`trufflehog`), rotating it, and scrubbing history. Internalize: rotation beats scrubbing.
3. **Dashboards.** Stand up Prometheus + Grafana across your homelab. Build a dashboard and
   one alert that actually pages you (email/push) on a real condition.
4. **Central logging.** Forward all hosts' logs to a central store. Write a detection rule
   for SSH brute-force and trigger it deliberately from another VM.
5. **Purple team.** Run the full Lesson 8.5 exercise. Deliverable is the write-up: what you
   did as red, what you caught as blue, what you missed, and what you changed.
6. **Post-mortem.** Investigate the provided (or self-inflicted) compromise and write a
   blameless post-mortem with a timeline and remediation actions.

## Checkpoint

- [ ] I can state, precisely, what I am and am not legally allowed to test
- [ ] I regularly scan my own lab and remediate findings, with before/after proof
- [ ] No secret lives in plaintext or in git history; I know how to rotate one
- [ ] My homelab has metrics dashboards and alerts that reach me
- [ ] My hosts ship logs centrally and I have at least one working detection rule
- [ ] I've run a purple-team exercise and found (most of) my own attack in the logs
- [ ] I can write a clear, blameless post-mortem

## Deliverable

**A purple-team report + post-mortem**: your attack narrative, the detection evidence
(dashboard and log screenshots), an honest account of what you missed, the gaps you closed,
and a blameless incident write-up. This is the single most impressive artifact for a
security-track interview.

## Resources

- [TryHackMe](https://tryhackme.com/) / [Hack The Box](https://www.hackthebox.com/) — legal, sandboxed practice targets
- [OWASP Top 10](https://owasp.org/www-project-top-ten/) — the vulnerabilities you'll actually meet
- [Wazuh](https://wazuh.com/) / [Security Onion](https://securityonionsolutions.com/) — free SIEM platforms for the home lab
- [The MITRE ATT&CK framework](https://attack.mitre.org/) — the shared language of detection
- Julia Evans: *How to be a wizard programmer* — on the debugging mindset security work demands
