---
title: "Module 6 · Labs"
description: Deploy a Compose stack, front it with a proxy and real TLS, self-host your git, and publish your portfolio — closing the loop.
sidebar:
  label: Labs
---

These five labs assemble everything the curriculum has built into a running, public, self-hosted
platform. The capstone (Lab 5) is the moment the loop closes: your portfolio, hosting your
writeups, live on your own hardware, reachable through your own tunnel. Commit your Compose files
and configs (secrets stripped) as you go — that repository is itself part of the deliverable.

:::caution[You're now exposing things to the internet — do it deliberately]
This module publishes services publicly. Apply everything you've learned: services behind the
proxy, valid TLS, secrets out of git ([Lesson 0.4](/modules/00-toolkit/git/)), volumes backed up
([Lesson 4.3](/modules/04-storage/backups/)), and public reach via Cloudflare Tunnel with **no
open inbound ports** ([Module 5](/modules/05-overlay/)). Publishing is a Module 8 threat-model
surface — treat each exposed service as something you're now responsible for securing.
:::

---

## Lab 1 · First stack

**Goal:** deploy a service with Docker Compose and prove your data survives the container.
Exercises [Lesson 6.1](/modules/06-selfhosting/docker/).

### Steps

1. Install Docker on your server (or a VM on your Module 4 Proxmox host).
2. Write a `compose.yaml` for any simple service that stores data (e.g. a small wiki, a
   note app, or even nginx serving a mounted directory). Give it a **named volume** for its data.
3. `docker compose up -d`; confirm it runs (`docker compose ps`, `docker compose logs -f`).
4. Write some data into the service (a note, a page).
5. **The proof:** `docker compose down` (removes the container), then `docker compose up -d`
   (recreates it). Confirm your data is **still there** — because it was in the volume, not the
   container.
6. Bonus: change something in the Compose file, re-up, and observe declarative behavior.

### Verify

- [ ] The service is defined entirely in a committed `compose.yaml`.
- [ ] Its data lives in a volume and **survived** a container destroy/recreate.
- [ ] You can read the logs and status with `docker compose` commands.

### Commit

Start a `homelab/` (or `compose/`) directory in your repo with this stack's `compose.yaml` and a
`.env.example`. Never commit the real `.env`.

---

## Lab 2 · Front door

**Goal:** put a reverse proxy in front of multiple services, each on its own hostname with valid
TLS. Exercises [Lessons 6.2](/modules/06-selfhosting/reverse-proxy/) and
[6.3](/modules/06-selfhosting/tls/).

### Steps

1. Add **Caddy** (recommended) as a container in your Compose stack, on the same Docker network as
   your services.
2. Run **three** services (e.g. your Lab 1 app, a dashboard, and one more), each on its own
   internal port.
3. Write a Caddyfile routing three hostnames to the three services
   (`app.yourdomain.com`, `home.yourdomain.com`, ...). Point those names at your setup via DNS
   ([Lesson 1.3](/modules/01-fundamentals/dns/)).
4. Confirm each hostname reaches the right service and shows a **valid TLS certificate** (the
   padlock; verify with `curl -vI https://...`).

### Verify

- [ ] Three services sit behind one reverse proxy, routed by hostname.
- [ ] Each has a valid, browser-trusted certificate.
- [ ] Only the proxy is exposed; the backends aren't individually reachable from outside.

### Commit

Add the Caddyfile and updated Compose to `homelab/`. Document which hostname maps to what.

---

## Lab 3 · DNS-01

**Goal:** obtain a **wildcard** certificate via the DNS-01 challenge — TLS with no inbound ports.
Exercises [Lesson 6.3](/modules/06-selfhosting/tls/).

### Steps

1. Get a DNS-provider API token (e.g. Cloudflare), scoped as narrowly as possible (DNS edit
   only). It's a secret — keep it out of git.
2. Configure your proxy (Caddy with the DNS provider plugin, or certbot with the DNS plugin) to
   use **DNS-01** and request a **wildcard** certificate (`*.yourdomain.com`).
3. Confirm issuance succeeds *without* any inbound port 80/443 reachable from the internet.
4. Verify the wildcard cert covers multiple subdomains (`a.yourdomain.com`, `b.yourdomain.com`)
   with `openssl s_client` / `curl -vI`.
5. Write up **why** DNS-01 is the elegant choice for a no-open-ports homelab (tie it to
   [Module 5](/modules/05-overlay/) and DNS from [Lesson 1.3](/modules/01-fundamentals/dns/)).

### Verify

- [ ] A wildcard certificate was issued via DNS-01, with no inbound ports open.
- [ ] Multiple subdomains are covered by the one certificate.
- [ ] You can explain the DNS-01 flow and why it suits your architecture.

### Commit

`homelab/tls.md` documenting the DNS-01 setup (sanitized — no API token) and the reasoning.

---

## Lab 4 · Self-host your git

**Goal:** stand up your own git server and migrate your work onto it. Exercises
[Lesson 6.4](/modules/06-selfhosting/services/).

### Steps

1. Add **Forgejo** (or Gitea) to your Compose stack, with a volume for its data, behind the proxy
   at `git.yourdomain.com` with TLS.
2. Create your account; add your SSH key ([Lesson 0.2](/modules/00-toolkit/remote/)) so you push
   over SSH.
3. **Migrate your curriculum repo** to it. Push a commit to *your own* git server and confirm it
   lands.
4. (Recommended) Keep a **GitHub mirror** as an offsite copy ([3-2-1](/modules/04-storage/backups/))
   and for the public [showcase](/guides/showcase/).
5. Ensure the Forgejo **volume is included in your backups** ([Lesson 4.3](/modules/04-storage/backups/)).

### Verify

- [ ] A self-hosted git server runs behind your proxy with valid TLS.
- [ ] You pushed a commit to it over SSH.
- [ ] Its data volume is backed up.

### Commit

Naturally — commit this to the git server you just built. Add its Compose service to `homelab/`.

---

## Lab 5 · Publish the portfolio

**This is the module's deliverable and the curriculum's turning point.** Get your documentation
site live, publicly, on your own hardware — closing the loop. Exercises everything.

### Steps

1. Deploy your **blog/docs site** (a static site — Hugo/Astro — or Ghost) as a service in your
   stack, behind the proxy with TLS.
2. Publish it to the public internet via **Cloudflare Tunnel** ([Lesson 5.3](/modules/05-overlay/cloudflare/))
   at a real domain — **zero open inbound ports** (verify with an external `nmap`, as in
   [Lab 5.4](/modules/05-overlay/labs/)).
3. **Publish your writeups.** Put every artifact you've produced so far on the site:
   - the [packet-capture walkthrough](/modules/01-fundamentals/labs/) (Module 1)
   - the [server build log + hardening checklist](/modules/02-server/labs/) (Module 2)
   - the [network diagram + segmentation rationale](/modules/03-network/labs/) (Module 3)
   - the [verified restore demo](/modules/04-storage/labs/) (Module 4)
   - the [remote-access ADR](/modules/05-overlay/labs/) (Module 5)
   - your original [first blog post](/modules/00-toolkit/labs/) (Module 0)
4. Confirm the whole loop: the site is built from code in your **self-hosted git**, served by your
   **proxy** with **TLS**, through your **tunnel**, on your **hardened server**, and it **documents
   that same infrastructure**.
5. **Submit to the [showcase](/guides/showcase/)** via a pull request.

### Verify

- [ ] Your site is live at a real domain, on your own hardware, with valid TLS and zero open ports.
- [ ] It hosts your writeups from every module so far.
- [ ] The site is built from a repo on your self-hosted git server.
- [ ] You submitted your URL to the showcase.

### Commit & publish

```sh
git add homelab/
git commit -m "Add self-hosted site + git server; publish portfolio"
git push        # to your own git server now
```

Then open the showcase PR. When it merges, your self-hosted site is publicly listed — the final
exercise in the exact git/writing/PR workflow this curriculum taught.

---

## Module 6 checkpoint

- [ ] I deploy services declaratively with Compose files kept in git (Lab 1)
- [ ] All my services sit behind one reverse proxy with valid TLS (Lab 2)
- [ ] I can obtain and auto-renew certificates, including via DNS-01 (Lab 3)
- [ ] My blog is live at a real domain on my own hardware (Lab 5)
- [ ] My code lives on a git server I host myself (Lab 4)
- [ ] Every service is backed up and reachable through my overlay network (all labs)

## Deliverable

**Your live, self-hosted portfolio site and git server** (Lab 5): publicly reachable, TLS-valid,
built from code on your own git server, hosting all your writeups — the closed loop, submitted to
the [showcase](/guides/showcase/). This is the single most important artifact in the curriculum:
it *is* your portfolio, and it works because you made every layer beneath it work.

**Next module:** [Module 7 · Automation & CI/CD →](/modules/07-automation/) — where you automate
all of this so you never build it by hand again.
