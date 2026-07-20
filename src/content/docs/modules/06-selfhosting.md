---
title: "Module 6 · Self-Hosting"
description: Reverse proxy, real TLS certificates, and your own public blog + git server.
sidebar:
  label: "6 · Self-Hosting"
---

Now everything converges. You have a server, a network, backups, and remote access. This
module turns that foundation into *running services* — including the two that make this
curriculum's closed loop real: **your own blog and your own git server, hosted on your own
hardware, reachable from the internet.** From here on, your portfolio lives on infrastructure
you built.

## What you'll learn

### Lesson 6.1 — Docker and Compose
- Images, containers, volumes, networks — the mental model
- Why containers changed operations: reproducible, isolated, disposable
- Docker Compose: declaring a multi-service stack in one file you commit to git
- Container data: what's ephemeral, what must be a persisted volume (tie back to Module 4 backups)

### Lesson 6.2 — The reverse proxy: one front door
- Why you don't expose services on random ports
- Caddy (automatic HTTPS) or Traefik (label-driven) or nginx (manual, educational)
- Virtual hosts: many services behind one IP, routed by hostname
- This is the same pattern as a cloud load balancer — you're learning the primitive

### Lesson 6.3 — TLS certificates you own
- Let's Encrypt and ACME: automated free certificates
- HTTP-01 vs. **DNS-01 challenges** — the latter works even with zero open ports (pairs with Module 5)
- Wildcard certificates; automatic renewal; what breaks when renewal fails (and how you'll know — Module 8)

### Lesson 6.4 — The services that close the loop
- **A blog / docs site** (Ghost, or a static site like *this one*, or Hugo) — where your writeups live
- **A git server** (Gitea or Forgejo) — migrate your repos off GitHub onto hardware you own
- Supporting cast: a dashboard (Homepage), a password manager (Vaultwarden), a bookmark/RSS app
- Every service: behind the reverse proxy, with TLS, backed up, reachable via your Module 5 overlay

## Labs

1. **First stack.** Deploy any service with Docker Compose. Commit the compose file. Destroy
   the container, recreate it from the file, prove the data persisted.
2. **Front door.** Put a reverse proxy in front of three services, each on its own hostname,
   each with a valid Let's Encrypt certificate. Verify the padlock and the cert chain.
3. **DNS-01.** Obtain a wildcard certificate via the DNS-01 challenge — no inbound ports.
   Document why this is the elegant option for a homelab.
4. **Self-host your git.** Stand up Gitea/Forgejo. Migrate your curriculum repo to it.
   Push a commit to *your own* git server. (Keep a GitHub mirror if you like.)
5. **Publish the portfolio.** Deploy your blog. Publish everything you've written so far —
   the packet-capture walkthrough, the build log, the restore demo, the access design doc —
   at a real domain, reachable from the internet through your Module 5 tunnel.

## Checkpoint

- [ ] I deploy services declaratively with Compose files kept in git
- [ ] All my services sit behind one reverse proxy with valid TLS
- [ ] I can obtain and auto-renew certificates, including via DNS-01
- [ ] My blog is live at a real domain on my own hardware
- [ ] My code lives on a git server I host myself
- [ ] Every service is backed up and reachable through my overlay network

## Deliverable

**Your live, self-hosted portfolio site and git server** — publicly reachable, TLS-valid,
hosting all your writeups to date. This *is* the closed loop. Submit the URL to the
[showcase](/guides/showcase/).

## Resources

- [Awesome-Selfhosted](https://awesome-selfhosted.net/) — the catalog of what you can run
- [Caddy documentation](https://caddyserver.com/docs/) — automatic HTTPS is genuinely magic
- [Forgejo](https://forgejo.org/) / [Gitea](https://docs.gitea.com/) docs
- r/selfhosted — a large, friendly community for when you're stuck at 2am
