---
title: "Module 7 · Labs"
description: Write idempotent automation, encode your server as Ansible, rebuild the whole lab from code, secure your secrets, and build a self-deploying site.
sidebar:
  label: Labs
---

These five labs turn your hand-built homelab into infrastructure as code. The two capstones are
the payoff of the entire curriculum so far: **rebuild your whole homelab from bare VMs with one
command** (Lab 3), and **a documentation site that redeploys itself on every push** (Lab 5).
Commit everything (secrets excluded) to your self-hosted git server from
[Module 6](/modules/06-selfhosting/).

:::note[Test against throwaway VMs]
Do the automation labs against **fresh, disposable VMs** on your Proxmox host
([Module 4](/modules/04-storage/)) — the whole point is proving you can build from nothing, and
snapshots ([Lesson 4.4](/modules/04-storage/virtualization/)) let you reset to a clean slate
between runs. Don't develop playbooks against your only working server.
:::

---

## Lab 1 · Idempotent script

**Goal:** write automation that's safe to run any number of times. Exercises
[Lesson 7.1](/modules/07-automation/scripting/).

### Steps

1. Write a bash script (with `set -euo pipefail`) that sets up a new user, installs a few
   packages, and drops a config file into place.
2. Make **every** operation idempotent: `mkdir -p`, "add line only if absent," "create user only
   if missing," etc.
3. Add a timestamped `log()` function and a check of its assumptions before acting.
4. **Prove idempotency:** run it once (it does the work), then run it again and confirm the second
   run changes **nothing** and errors nowhere.
5. Bonus: rewrite one piece that involves logic/JSON in Python, and note *why* it's cleaner there.

### Verify

- [ ] The script uses strict mode and quotes its variables.
- [ ] Running it twice produces the same result; the second run is a no-op.
- [ ] You can point to each construct that makes an operation idempotent.

### Commit

`automation/01-idempotent.sh` plus a short note explaining what makes each step idempotent.

---

## Lab 2 · Server as code

**This is the signature exercise.** Reproduce your entire Module 2 server from an Ansible
playbook. Exercises [Lesson 7.2](/modules/07-automation/ansible/).

### Steps

1. Install Ansible on your workstation. Create an inventory with a fresh test VM.
2. Write a playbook that encodes your **entire [Module 2](/modules/02-server/) build**: admin
   user, packages, and the **full [hardening checklist](/modules/02-server/hardening/)** (SSH
   keys-only + no root, ufw default-deny + allow SSH, fail2ban, unattended-upgrades). Organize the
   hardening into a **role**.
3. Run it against a **wiped VM**: `ansible-playbook -i inventory playbook.yml`. In minutes you
   have a server identical to your hand-built one.
4. **Prove idempotency:** run it again; confirm every task reports `ok` and `changed=0`.
5. **Prove equivalence:** `nmap` the Ansible-built server ([Lesson 2.3](/modules/02-server/hardening/))
   and confirm it's hardened exactly like your hand-built one — only SSH open.
6. **Time it** vs. doing it by hand, and note the difference.

### Verify

- [ ] A fresh VM becomes a fully hardened server from one `ansible-playbook` command.
- [ ] A second run changes nothing (`changed=0`) — verified idempotency.
- [ ] `nmap` confirms the automated build matches your Module 2 hardening.

### Commit

`ansible/` — your inventory, playbook, and hardening role (no secrets). This is the core of the
deliverable.

---

## Lab 3 · Whole-lab rebuild

**A capstone.** Extend Ansible to reconstruct your whole homelab, not just one server. Exercises
[Lessons 7.2](/modules/07-automation/ansible/) and [7.3](/modules/07-automation/gitops/).

### Steps

1. Extend your Ansible project to also deploy your [Module 6](/modules/06-selfhosting/) service
   stack — Docker, your Compose files, the reverse proxy config, the services.
2. Aim for a single entry point: `ansible-playbook site.yml` provisions bare VMs into your running
   homelab (hardened servers + services behind the proxy).
3. **The proof:** wipe your test VM(s) to a clean OS, run `site.yml`, and watch your homelab
   reconstruct itself. Confirm services come up behind the proxy with TLS.
4. Record it (screen capture) — a bare VM becoming your homelab from one command.

### Verify

- [ ] `ansible-playbook site.yml` rebuilds hardened servers **and** the service stack from scratch.
- [ ] You rebuilt onto genuinely fresh VMs, not a pre-configured one.
- [ ] You have a recording/log of the rebuild.

### Commit

Expand `ansible/` with the service roles and `site.yml`. Reference your Module 6 Compose files.

---

## Lab 4 · Secrets, safely

**Goal:** ensure no plaintext secret exists in any repo, and that deploys still work. Exercises
[Lesson 7.3](/modules/07-automation/gitops/).

### Steps

1. **Audit** your repos for any committed secrets (`gitleaks detect` / `trufflehog`). Fix any
   found — and **rotate** anything that was exposed (assume it's compromised).
2. Move every real secret out of plaintext: either **sops/age** (or Ansible Vault) encrypting a
   committed `secrets.enc.yml`, or gitignored `.env` files with committed `.env.example`
   templates.
3. Wire your Ansible/Compose to decrypt/read secrets at deploy time; confirm a deploy still works
   end to end with the secret sourced securely.
4. Add a **`.gitignore`** guard and (bonus) a **pre-commit `gitleaks` hook** so a future mistake
   is blocked before it's pushed.
5. Prove it: a teammate (or future you) can decrypt only with the right key; the repo alone leaks
   nothing.

### Verify

- [ ] A secret scanner reports **no** plaintext secrets in any repo.
- [ ] Secrets are encrypted-in-git or externalized; deploys still work.
- [ ] The decryption key lives outside git; the repo is useless to an attacker without it.

### Commit

Your **encrypted** secrets file and/or `.env.example` templates, plus the `.gitignore`/hook
config. Never the plaintext.

---

## Lab 5 · The self-deploying site

**This is the module's deliverable.** Build a CI/CD pipeline that redeploys your site
automatically on every push. Exercises [Lesson 7.4](/modules/07-automation/cicd/).

### Steps

1. Set up a **self-hosted runner** — Forgejo Actions on your [Module 6](/modules/06-selfhosting/)
   git server, or Woodpecker CI.
2. Add a pipeline (`.forgejo/workflows/deploy.yml` or equivalent) that, on push to `main`:
   checks out the repo, **builds** your site, and **deploys** it to where your reverse proxy
   serves it.
3. Add at least one **gate** that runs on pull requests: a lint, a build check, and/or a
   `gitleaks` secret scan — and confirm a failing check **blocks** the merge.
4. **The demo:** push a small change (fix a typo), and watch the pipeline build and deploy it —
   the site updates live, untouched by hand.
5. Confirm the full loop: code in your self-hosted git → pipeline on your runner → live site on
   your hardware.

### Verify

- [ ] A push to `main` automatically builds and deploys your site — no manual steps.
- [ ] A gate runs on PRs and blocks a failing change from merging.
- [ ] The entire pipeline runs on your own infrastructure.

### Commit & record

Commit the workflow file. Then record two short clips for your portfolio:

- a **push → auto-deploy** of the site, and
- the **whole-lab rebuild** from Lab 3 (bare VM → homelab via one command).

```sh
git add .forgejo/ ansible/ automation/
git commit -m "Add CI/CD pipeline and infrastructure-as-code for the homelab"
git push        # ...which now triggers the deploy automatically
```

---

## Module 7 checkpoint

- [ ] I write idempotent automation and can explain why idempotency matters (Lab 1)
- [ ] My server's entire configuration, including hardening, lives in an Ansible repo (Lab 2)
- [ ] I can rebuild my homelab from code onto fresh VMs (Lab 3)
- [ ] No plaintext secret exists in any of my repositories (Lab 4)
- [ ] A push to my docs repo deploys the site automatically, with no manual steps (Lab 5)
- [ ] I use pull requests and review my own changes before merge (Labs 3–5)

## Deliverable

**An Ansible repo that rebuilds Modules 2–6 from scratch, plus a self-deploying-site pipeline** —
with recordings of a one-command homelab rebuild and a push-to-deploy. This is the most
persuasive artifact in your portfolio: undeniable, demonstrable proof you can define, build, and
operate infrastructure as code.

**Next module:** [Module 8 · Security Operations →](/modules/08-security/) — where you attack your
own lab and learn to find yourself in the logs.
