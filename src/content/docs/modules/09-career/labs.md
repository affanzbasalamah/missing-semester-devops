---
title: "Module 9 · Labs"
description: Map your homelab to the cloud, deploy for real, threat-model your lab, build the 'hire me' page, and mock-interview.
sidebar:
  label: Labs
---

These five labs turn everything you've built into a job-ready portfolio and the confidence to
land the interview. They're lighter on new infrastructure and heavier on synthesis, presentation,
and practice — because at this point the technical work is done; the task is making the world see
it. The capstone (Lab 4) is your polished "Hire Me" portfolio, the culmination of the whole
curriculum.

---

## Lab 1 · The mapping

**Goal:** internalize the homelab→cloud translation by writing it in your own words. Exercises
[Lesson 9.1](/modules/09-career/cloud-mapping/).

### Steps

1. For **each row** of the mapping table in [Lesson 9.1](/modules/09-career/cloud-mapping/), write
   one short paragraph tying *your specific homelab implementation* to the cloud service — e.g.
   "My OpenWrt VLAN segmentation (Module 3) is the same idea as a cloud VPC with subnets and
   security groups; in my lab I separated IoT from servers so that..."
2. Explain the **shared responsibility model** in your own words, with an example of something
   that's *your* responsibility in the cloud.
3. Turn this into a **blog post** — it's genuinely useful content and shows employers you think in
   both vocabularies.

### Verify

- [ ] Every mapping row is tied to your concrete homelab implementation.
- [ ] You can explain shared responsibility with a real example.
- [ ] It's published as a post on your site.

### Commit

`blog/09-homelab-to-cloud.md`.

---

## Lab 2 · Cloud, once

**Goal:** deploy and destroy one real cloud resource as code. Exercises
[Lesson 9.2](/modules/09-career/cloud-deploy/).

### Steps

1. Pick a **free tier** (AWS, GCP, Oracle Cloud, Azure). **Set a billing alert** first.
2. Install Terraform. Write a minimal config for one real resource — a VM, or a VPC + subnet +
   firewall rule, or a static site on object storage.
3. `terraform init` → `terraform plan` (read it!) → `terraform apply`.
4. Interact with what you made — SSH into the VM ([Lesson 0.2](/modules/00-toolkit/remote/)) and
   note it's *just a Linux server* on someone else's hardware.
5. **`terraform destroy`** — tear it all down so nothing accrues cost. Confirm it's gone.

### Verify

- [ ] You deployed a real cloud resource via Terraform (not the console).
- [ ] You read the `plan` output before applying.
- [ ] You **destroyed** it and confirmed nothing is left running.
- [ ] A billing alert is set on the account.

### Commit

`cloud/` with your Terraform config (no credentials — those are secrets,
[Lesson 7.3](/modules/07-automation/gitops/)) and a note on what differed from your homelab.

---

## Lab 3 · Threat model

**Goal:** produce a one-page threat model of your homelab and act on it. Exercises
[Lesson 9.3](/modules/09-career/threat-model/).

### Steps

1. Using **STRIDE** as a prompt, walk through your homelab and list the meaningful threats —
   focusing on **attack surface** (what's exposed) and **blast radius** (impact if compromised).
2. Answer the concrete questions from [Lesson 9.3](/modules/09-career/threat-model/): what's
   internet-reachable, what a leaked tunnel token allows, what a compromised IoT device can reach,
   your worst single point of failure, your most sensitive data.
3. Turn it into a **prioritized backlog**: for each threat, mitigate-now / mitigate-later /
   accept-with-reason.
4. **Knock out the top three** items and note what you changed.

### Verify

- [ ] A one-page threat model covering attack surface and blast radius exists.
- [ ] It produced a prioritized backlog with explicit accept/mitigate decisions.
- [ ] You actioned at least the top three items.

### Commit

`security/09-threat-model.md` — and publish a version as a portfolio post; it signals senior-level
risk thinking.

---

## Lab 4 · Hire Me page

**This is the module's — and the curriculum's — capstone deliverable.** Build the portfolio page
that gets you interviews. Exercises [Lesson 9.4](/modules/09-career/portfolio/) and everything
before it.

### Steps

1. **Curate your artifacts as case studies.** For each major deliverable (Modules 1–8), write a
   short framing: the problem, what you did, and what it demonstrates — linking the full writeup.
2. **Build the "Hire Me" page:** map **at least eight** common job-description requirements to a
   linked artifact that proves each (the table in [Lesson 9.4](/modules/09-career/portfolio/)).
3. **Polish the landing page** so a stranger understands who you are and what you can do in 60
   seconds ([Lesson 0.5](/modules/00-toolkit/writing/)).
4. State the **closed loop** explicitly on the site: this portfolio runs on the infrastructure it
   describes.
5. Make sure everything is live on your self-hosted site
   ([Module 6](/modules/06-selfhosting/)) and the [showcase](/guides/showcase/) entry is current.

### Verify

- [ ] Your artifacts are presented as framed case studies, not raw notes.
- [ ] The Hire Me page maps ≥8 job requirements to verifiable linked proof.
- [ ] A stranger can grasp your capabilities in a minute.
- [ ] It's live on your own infrastructure, and the closed loop is stated.

### Commit & publish

```sh
git add .        # to your self-hosted git server (Module 6)
git commit -m "Add Hire Me page and curated portfolio"
git push         # ...which auto-deploys via your Module 7 pipeline
```

---

## Lab 5 · Mock interview

**Goal:** practice narrating your work out loud, so the interview goes as well as the portfolio.
Exercises [Lesson 9.4](/modules/09-career/portfolio/).

### Steps

1. Find a partner (a friend, a peer, a community member) — or record yourself answering.
2. Have them ask you to **walk through your architecture diagram** ([Module 3](/modules/03-network/))
   and your **purple-team report** ([Module 8](/modules/08-security/)).
3. Answer several "tell me about a time you..." questions using your artifacts as the material —
   debugging (WireGuard), security (purple team), automation (Ansible), architecture (the ADR).
4. For each, practice the **what / why / what-went-wrong** structure.
5. **Record it, watch it back**, note what to improve, and do it again.

### Verify

- [ ] You can narrate any major artifact fluently: what you did, why, and what broke.
- [ ] You walked through your architecture and purple-team report without notes.
- [ ] You reviewed a recording and identified improvements.

### Commit

`career/09-interview-prep.md`: your story bank — a list of likely questions mapped to the artifact
you'd use to answer each. Keep it; it's your interview cheat sheet.

---

## Module 9 checkpoint

- [ ] I can explain every homelab component in cloud-native vocabulary (Lab 1)
- [ ] I've deployed and destroyed real cloud infrastructure as code (Lab 2)
- [ ] I have a written threat model of my own lab and acted on it (Lab 3)
- [ ] My portfolio site maps job requirements to artifacts a stranger can verify (Lab 4)
- [ ] I can confidently narrate any artifact: what, why, and what went wrong (Lab 5)
- [ ] I've done at least one mock technical interview using my own work (Lab 5)

## Deliverable

**Your polished, self-hosted portfolio with a "Hire Me" page** — the culmination of every module,
hosted on the infrastructure you built, reachable through the network you secured, mapping what
employers want to proof that you can do it.

---

## You're not done — you've started

This curriculum ends where a career begins. You built real infrastructure from bare metal,
secured and automated it, and documented all of it in public on hardware you own. That's a
foundation most people never get.

Keep the homelab running — it's now your permanent lab for trying anything new *before* you meet
it at work. Add services, break them, fix them, write it up. The habit that got you here —
**building, securing, and documenting in public** — is the thing that compounds over an entire
career. New technology arrives; you'll learn it the same way you learned all of this: by building
it yourself and understanding it from the ground up.

Go get hired. Then come back and add your entry to the [showcase](/guides/showcase/) — and, if you
can, help the next person through the missing semester you just finished.

**← Back to [the curriculum overview](/).**
