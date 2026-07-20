---
title: "Module 7 · Automation & CI/CD"
description: Ansible, pipelines, and the core DevOps mindset — never do it manually twice.
sidebar:
  label: "7 · Automation & CI/CD"
---

You built everything by hand so you'd *understand* it. Now you'll automate it so you never
have to do it by hand again. That sentence is the entire DevOps philosophy, and this module
makes it muscle memory. The payoff: you'll be able to destroy your whole homelab and rebuild
it from code.

## What you'll learn

### Lesson 7.1 — Scripting glue
- Shell scripting beyond one-liners: functions, error handling (`set -euo pipefail`), argument parsing
- When to reach for Python instead, and how to make a script safe to re-run (idempotency)
- Cron and systemd timers for scheduled work

### Lesson 7.2 — Infrastructure as Code with Ansible
- Why declarative beats imperative: describe the *end state*, let the tool converge to it
- Inventory, playbooks, roles, variables, templates, vault (encrypted secrets)
- **The signature exercise: re-provision the server you hand-built in Module 2 — but entirely
  from an Ansible playbook.** Hardening, users, firewall, services: all code now.
- Idempotency in practice: run it twice, second run changes nothing

### Lesson 7.3 — Version control as the source of truth
- GitOps thinking: the repo is the desired state; the system conforms to the repo
- Branching, pull requests, and code review — even as a team of one, on your own git server
- Secrets management done right: `sops`+`age` or Ansible Vault; why plaintext secrets in git are a Module 8 incident

### Lesson 7.4 — CI/CD pipelines
- What a pipeline is: automated build → test → deploy on every push
- Self-hosted runners: **Gitea/Forgejo Actions** or **Woodpecker CI** on your own hardware
- **The dogfooding capstone: a pipeline that rebuilds and redeploys *this documentation site*
  automatically every time you push.** Your infrastructure now deploys your infrastructure's docs.
- Linting, tests, and gates: catching mistakes before they reach production (your homelab *is* production now)

## Labs

1. **Idempotent script.** Write a script that sets up a new user, installs packages, and
   configures a service — safe to run any number of times. Prove the second run is a no-op.
2. **Server as code.** Convert your entire Module 2 build (including hardening) into an
   Ansible playbook. Wipe a VM, run the playbook, get an identical server. Time the difference
   vs. doing it by hand.
3. **Whole-lab rebuild.** Extend Ansible to reproduce your Module 6 service stack. Goal:
   `ansible-playbook site.yml` reconstructs the homelab from bare VMs.
4. **Secrets, safely.** Move every secret out of plaintext into sops/age or Vault. Commit
   the *encrypted* files. Prove a teammate (or future you) can decrypt with the right key only.
5. **The self-deploying site.** Wire a CI pipeline on your own runner that rebuilds and
   redeploys your blog on every push to main. Push a typo fix and watch it go live untouched by hand.

## Checkpoint

- [ ] I write idempotent automation and can explain why idempotency matters
- [ ] My server's entire configuration, including hardening, lives in an Ansible repo
- [ ] I can rebuild my homelab from code onto fresh VMs
- [ ] No plaintext secret exists in any of my repositories
- [ ] A push to my docs repo deploys the site automatically, with no manual steps
- [ ] I use pull requests and review my own changes before merge

## Deliverable

**An Ansible repository that rebuilds Modules 2–6 from scratch**, plus a working CI/CD
pipeline that auto-deploys your site. Record a short screen capture of a bare VM becoming
a configured server via one command — it's the most persuasive thing in your portfolio.

## Resources

- [Ansible documentation](https://docs.ansible.com/) — start with the "getting started" guide, ignore the rest until needed
- [sops](https://github.com/getsops/sops) + [age](https://github.com/FiloSottile/age) — modern secrets, minimal ceremony
- [Woodpecker CI](https://woodpecker-ci.org/) — lightweight, self-hostable pipelines
- Google's *Site Reliability Engineering* book (free online) — read the chapter on toil
