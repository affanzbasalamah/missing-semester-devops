---
title: "Lesson 8.2 · Identity & Secrets"
description: Access hygiene, MFA, SSH at scale, and the reality of secrets that leak — with rotation as the reflex.
sidebar:
  label: "8.2 · Identity & Secrets"
---

Assessment ([Lesson 8.1](/modules/08-security/assess/)) surfaces technical vulnerabilities, but a
huge share of real breaches don't involve exploiting a clever bug at all — they involve
**credentials**: a leaked password, a token committed to git, an over-privileged account, a
missing second factor. This lesson is about identity and secrets hygiene: the unglamorous
controls that prevent the most common way attackers actually get in. Much of it reinforces habits
you've built since [Module 0](/modules/00-toolkit/git/) — now framed as the security discipline
they are.

## Identity: who can do what, verified how

Every access decision rests on two questions: *who are you* (authentication) and *what may you do*
(authorization). Getting these right is foundational security.

### Strong authentication

- **Password managers, everywhere.** Unique, strong, random passwords per service — impossible to
  remember, trivial with a manager (Vaultwarden from
  [Lesson 6.4](/modules/06-selfhosting/services/) puts this into daily practice). Password reuse
  is how a breach of one service becomes a breach of all of them.
- **Multi-factor authentication (MFA), everywhere it's offered.** A second factor (an
  authenticator app, a hardware key) means a stolen password alone isn't enough. Turn it on for
  your git server, your Cloudflare account, your email — everything that matters. This single
  control stops the majority of account-takeover attacks.
- **SSH keys, not passwords** — already your default since
  [Lesson 0.2](/modules/00-toolkit/remote/) and enforced in
  [Lesson 2.3](/modules/02-server/hardening/). At scale, **SSH certificates** (short-lived,
  signed) beat managing individual keys across many hosts — worth knowing exists as you grow.

### Least privilege, as an ongoing audit

You applied least privilege in [Lesson 2.2](/modules/02-server/anatomy/) (sudo, not root) and
[Lesson 3.3](/modules/03-network/segmentation/) (network segmentation). As a *security* practice,
least privilege isn't a one-time setting — it's a recurring audit:

- Who can `sudo` on each host? Is that still the right list?
- Does each service run as a limited user, not root
  ([Lesson 2.2](/modules/02-server/anatomy/))? A compromised service should be able to do as
  little as possible.
- Are there accounts, keys, or access grants left over from something you no longer run? Stale
  access is a classic foothold.

Periodically reviewing "who and what can do what" — and removing anything unnecessary — shrinks
your attack surface continuously. It's boring, and it's one of the highest-value things a security
person does.

## Secrets that leak: the most common own-goal

Now the reality that causes an enormous number of breaches, and that this curriculum has warned
about since [Lesson 0.4](/modules/00-toolkit/git/): **secrets leak, most often into git.** An API
token, a private key, a database password — committed by accident, pushed, and now permanently
exposed. Automated bots scrape public git hosts for exactly this within *minutes* of a push.

You've built the defenses already ([Lesson 7.3](/modules/07-automation/gitops/)): `.gitignore`
from the start, encrypted secrets (sops/age) or externalized ones, never plaintext in the repo.
This lesson adds the *detective* and *responsive* side.

### Detecting leaked secrets

Tools scan git history (not just current files — history is where leaks hide) for things that look
like secrets:

```sh
gitleaks detect --source .          # scan a repo's history for secrets
trufflehog git file://.             # another scanner, verifies some finds against live services
```

Run these against your own repos ([Lab 2](/modules/08-security/labs/#lab-2--leak-drill)). Better,
wire `gitleaks` as a **pre-commit hook** and a **CI gate**
([Lesson 7.4](/modules/07-automation/cicd/)) so a secret is blocked *before* it's ever pushed —
prevention beats cleanup.

### The reflex: rotate, don't just delete

Here's the crucial mental model, stated plainly because people get it wrong under pressure:

:::danger[A leaked secret is compromised — deleting the commit does not fix it]
Git history is permanent and distributed ([Lesson 0.4](/modules/00-toolkit/git/)). Once a secret
is committed and pushed, it exists in the history, in every clone, and quite possibly in a bot's
database already. **Removing it in a later commit does not make it safe** — the old commit still
contains it. The only real remedy is **rotation**: invalidate the exposed secret (revoke the
token, change the password, regenerate the key) so the leaked value is useless, then issue a new
one and update your systems.

The reflex to build: *secret exposed → rotate it immediately,* treating it as compromised because
it is. Scrubbing history (with tools like `git filter-repo`) is worth doing too, but **rotation
comes first and is non-negotiable.** Practicing this on a throwaway secret — in
[Lab 2](/modules/08-security/labs/#lab-2--leak-drill) — builds the reflex in calm conditions so
you have it during a real incident.
:::

## Tie-back and forward

Notice how much of this lesson is *reinforcement*: password managers and MFA are hygiene, SSH keys
and least privilege you've done since Modules 0–3, and the secrets rules come straight from
[Lesson 7.3](/modules/07-automation/gitops/). That's deliberate — security isn't a separate
activity bolted on at the end; it's the same practices you've been building, now recognized as the
controls that stop the most common attacks. What's *new* here is the detective and responsive
posture: scanning for leaks, and the rotation reflex. Next, you build the systems that let you
*notice* when something goes wrong at all — monitoring and detection.

## Quick self-check

1. Why is credential compromise, not clever exploitation, behind so many real breaches?
2. What does MFA protect against that a strong password alone doesn't?
3. Why is least privilege an ongoing audit rather than a one-time setting?
4. Why does deleting a committed secret in a new commit *not* make it safe?
5. What is the correct first response to any exposed secret, and why?
6. How would you prevent a secret from ever being pushed in the first place?

**Next:** [Lesson 8.3 · Monitor & Detect →](/modules/08-security/monitoring/)
