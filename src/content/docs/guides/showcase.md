---
title: Showcase
description: Student homelabs and portfolios built through this curriculum.
sidebar:
  label: Showcase
---

The final proof that this curriculum works is a wall of student projects — each one a
self-hosted site, reachable through an overlay network the student configured, running on
hardware they built and hardened themselves. **If your portfolio site loads, your
infrastructure works.** That's the point.

## Submit your project

Finished Module 6 (or beyond)? Add yourself:

1. Make sure your site is publicly reachable and documents your journey.
2. Open a pull request against this site's repository adding an entry to the list below.
3. A maintainer reviews and merges — which, fittingly, tests your git and writing skills one
   more time.

Because *this site itself* is built from a public git repo (see [How to use this
site](/guides/how-to-use/)), submitting to the showcase is your final exercise in the exact
workflow you've been learning: fork, branch, commit, open a PR, respond to review.

## Entry format

Add a block like this (keep the list alphabetical by name):

```markdown
### Your Name — [your-site-url](https://your-site-url)
- **Track:** DevOps / Security / Both
- **Homelab:** one line on your hardware (e.g. "ThinkCentre M720q + OpenWrt on a WRT3200ACM")
- **Highlight:** the artifact you're proudest of, linked
- **Hosted via:** WireGuard / Tailscale / Cloudflare Tunnel
```

## Featured projects

> _This section fills up as students finish. Yours could be the first entry — submit a PR._

<!-- Student entries go below this line -->

---

## What makes a strong showcase entry

- **It loads reliably.** Your overlay network and TLS actually work, from any network.
- **It tells a story.** Not just "here are my configs" — the *why*, the mistakes, the fixes.
- **It's honest.** The best entries include what broke and what the student would do differently.
- **It links artifacts.** The packet capture, the restore demo, the purple-team report — the
  concrete deliverables from each module.

A strong showcase entry is, functionally, a portfolio an employer can evaluate in five
minutes. That's not a coincidence — it's the deliverable this whole curriculum was building toward.
