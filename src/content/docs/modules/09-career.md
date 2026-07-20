---
title: "Module 9 · The Bridge to a Career"
description: Map your homelab to the cloud, polish the portfolio, and turn six months of work into a job.
sidebar:
  label: "9 · The Bridge"
---

You've built, secured, automated, and documented real infrastructure. This final module
translates that homelab fluency into the vocabulary of industry and cloud, and packages
everything into a portfolio that gets you interviews — and gets you through them.

## What you'll learn

### Lesson 9.1 — Your homelab *is* the cloud, at a smaller scale
Every concept you built by hand has a cloud equivalent. Learn the mapping and the cloud stops being mystical:

| You built | The cloud calls it |
|---|---|
| OpenWrt VLANs + firewall | VPC, subnets, security groups |
| WireGuard / Tailscale | VPN gateway, private networking, zero-trust access |
| Your reverse proxy | Load balancer / ingress |
| Ansible playbooks | Terraform / CloudFormation (declarative infra) |
| Proxmox VMs | EC2 / Compute Engine instances |
| Docker Compose stack | ECS / Cloud Run / Kubernetes |
| restic backups | Object storage snapshots, lifecycle policies |
| Prometheus + Grafana | CloudWatch / managed observability |
| Your git server + CI | GitHub Actions / GitLab CI / managed pipelines |

### Lesson 9.2 — One real cloud deployment
- Stand up *one* thing on a free tier (AWS/GCP/Azure/Oracle/Hetzner): a VM, a VPC, a firewall rule
- Do it with Terraform so it's IaC, not click-ops — reuse the Module 7 mindset
- Feel the difference: someone else's hardware, metered billing, shared responsibility

### Lesson 9.3 — Threat-model your own lab
- STRIDE-lite: what's exposed, what's the blast radius, what happens if your tunnel token leaks?
- Turn the model into a prioritized hardening backlog — thinking like this is a senior signal

### Lesson 9.4 — The portfolio that gets interviews
- Your self-hosted site, curated: the writeups from every module, framed as case studies
- A **"Hire me" page** that maps each common job-description requirement to a concrete artifact
  you can link: "Configure and secure Linux servers → [my hardening runbook]"
- A clean git history and a README that orients a stranger in 60 seconds
- Talking about it: for every artifact, be ready to explain *what you did, why, and what broke*

### Lesson 9.5 — The job hunt
- Reading DevOps / SRE / security job descriptions and decoding what they really want
- Mapping the certification landscape (Linux+, Network+, Security+, CKA, cloud associates) to
  what you've *already* proven — certs validate, your homelab demonstrates
- Interview prep: the homelab is your story bank; every "tell me about a time" has an answer now

## Labs

1. **The mapping.** For each row in the 9.1 table, write one paragraph tying *your specific
   homelab implementation* to the cloud service. This becomes a portfolio blog post.
2. **Cloud, once.** Deploy one free-tier resource via Terraform. Tear it down. Commit the code.
3. **Threat model.** Produce a one-page threat model of your homelab with a prioritized
   remediation backlog. Then knock out the top three items.
4. **Hire-me page.** Build it. Map at least eight common job requirements to linked artifacts.
5. **Mock interview.** Have someone ask you to walk through your architecture diagram and
   your purple-team report. Record yourself. Watch it. Improve.

## Checkpoint

- [ ] I can explain every homelab component in cloud-native vocabulary
- [ ] I've deployed and destroyed real cloud infrastructure as code
- [ ] I have a written threat model of my own lab and acted on it
- [ ] My portfolio site maps job requirements to artifacts a stranger can verify
- [ ] I can confidently narrate any artifact: what, why, and what went wrong
- [ ] I've done at least one mock technical interview using my own work as the material

## Deliverable

**A polished, self-hosted portfolio** with a "Hire me" page — the culmination of every prior
module, hosted on the infrastructure you built, reachable through the network you secured.
The medium is the message: the site works because *you* made it work.

## You're not done — you've started

This curriculum ends where a career begins. Keep the homelab running; it's now your permanent
lab for trying anything new before you meet it at work. Add services, break them, fix them,
write it up. The habit of *building, securing, and documenting in public* is the thing that
compounds. Go get hired — then send us your showcase entry.

## Resources

- [Terraform documentation](https://developer.hashicorp.com/terraform/docs)
- [The Cloud Resume Challenge](https://cloudresumechallenge.dev/) — a great complementary capstone
- [levels.fyi](https://www.levels.fyi/) and real job boards — study the actual market you're entering
- Every module's deliverable in this curriculum — they *are* your portfolio
