---
title: "Lesson 1.3 · DNS"
description: The internet's phone book — recursion vs. authority, record types, caching, and driving dig.
sidebar:
  label: "1.3 · DNS"
---

Computers route packets to IP addresses, but humans use names like `github.com`. **DNS** (the
Domain Name System) is the global directory that translates names into addresses. It runs
quietly behind every single thing you do online, and it is — only half-jokingly — the cause of
an outsized share of real-world outages. There's a saying in operations: *"It's not DNS. There's
no way it's DNS. It was DNS."* Understanding it deeply is a genuine professional advantage, and
you'll run your *own* DNS server in Module 3.

## The problem DNS solves

You type `github.com`. Your computer needs `140.82.121.4` (or similar) to actually send packets.
DNS is the lookup that gets you from the name to the address. But there's no single giant list of
every domain — that wouldn't scale to hundreds of millions of names changing constantly. Instead,
DNS is a **distributed, hierarchical** system: the work is split across a tree of servers, and no
single machine holds everything.

## The hierarchy: reading a name backwards

A domain name is a hierarchy, read **right to left**:

```
www.github.com.
 │    │    │  └── the root (the invisible "." at the very end)
 │    │    └───── the TLD (Top-Level Domain): com
 │    └────────── the domain: github
 └─────────────── a subdomain / host: www
```

Each level is responsible for the level below it. This delegation is the whole trick that lets
DNS scale: the root servers only need to know where the TLD servers are; the `.com` servers only
need to know where each domain's servers are; and each domain runs its own servers that know its
own records.

## Recursion vs. authority: who answers what

This distinction is the heart of understanding DNS, and it's what most people never learn.

- An **authoritative** server holds the *real* records for a zone and gives definitive answers.
  GitHub's authoritative servers *are* the source of truth for `github.com`.
- A **recursive resolver** doesn't own any records. Its job is to *do the legwork* on your
  behalf — chasing the answer down the hierarchy and handing you the result. This is the server
  your laptop actually talks to (run by your ISP, or `1.1.1.1`, or — after Module 3 — by you).

### A full lookup, step by step

When your laptop needs `www.github.com` and nobody has it cached, here's the journey your
**recursive resolver** makes on your behalf:

1. Your laptop asks its configured **resolver**: "What's the IP of `www.github.com`?"
2. The resolver asks a **root server**: "Where do I find `.com`?" The root replies: "I don't know
   the address, but here are the **`.com` TLD servers**."
3. The resolver asks a **`.com` TLD server**: "Where do I find `github.com`?" It replies: "Here
   are **GitHub's authoritative name servers**."
4. The resolver asks **GitHub's authoritative server**: "What's `www.github.com`?" It gives the
   definitive answer: "`140.82.121.4`."
5. The resolver caches the answer and hands it back to your laptop.

Five questions, four different servers, each one delegating downward — and it all happens in
milliseconds, usually. You will trace this exact path yourself in
[Lab 3](/modules/01-fundamentals/labs/#lab-3--dns-treasure-hunt) using `dig +trace`.

:::note[Recursive does the work; authoritative holds the truth]
The one-line summary to remember: your **recursive resolver** runs around asking questions for
you; the **authoritative servers** are the ones that actually *know*, because they own the records.
:::

## Record types you'll actually use

A DNS zone is a set of **records**. You only need a handful, but you'll use these constantly —
especially in Module 6 when you point your own domain at your homelab:

| Type | Maps a name to... | Example use |
|---|---|---|
| **A** | an IPv4 address | `blog.example.com` → `203.0.113.5` |
| **AAAA** | an IPv6 address | the IPv6 equivalent of an A record |
| **CNAME** | another name (an alias) | `www.example.com` → `example.com` |
| **MX** | a mail server | tells the world where to deliver email for the domain |
| **TXT** | arbitrary text | domain verification, email security (SPF/DKIM) |
| **NS** | the authoritative name servers | delegation — who's in charge of this zone |
| **SRV** | a service's host + port | used by some protocols to locate services |

The two you'll set most often: **A records** (this name lives at this IP) and **CNAME records**
(this name is just an alias for that other name). When you connect your domain to your
self-hosted services in Module 6, you're creating A and CNAME records.

## TTL and caching: the double-edged sword

Every DNS record carries a **TTL** (Time To Live) — how many seconds a resolver may cache the
answer before asking again. Caching is essential; without it, the root servers would melt under
the load of every lookup on earth. But it has a famous consequence:

When you *change* a DNS record, the old value stays cached — everywhere — until its TTL expires.
So a change can appear to work for you and not for someone else, or not take effect for hours.
This "DNS propagation" delay is behind an enormous number of "but I changed it, why isn't it
working?" moments.

:::tip[The operator's DNS reflex]
Before changing an important DNS record, *lower its TTL* a day ahead of time (say, to 300
seconds). Then when you make the real change, the world picks it up in minutes, not hours. This
is a small, professional habit that prevents real pain — and it's exactly the kind of thing this
curriculum exists to teach you before your first job, not during it.
:::

Caching also explains a debugging gotcha: "it works on my machine" can be a *cache* difference.
Your resolver has one answer cached; someone else's has another. When diagnosing DNS, always know
*which resolver* answered.

## Driving dig: your DNS microscope

`dig` (Domain Information Groper) is the tool for looking at DNS directly. Learn it now; it's how
you'll debug every DNS problem for the rest of your career.

```sh
dig github.com                 # the A record(s) for github.com
dig github.com +short          # just the answer, no ceremony
dig github.com MX              # the mail servers
dig github.com TXT             # text records
dig github.com NS              # the authoritative name servers
dig @1.1.1.1 github.com        # ask a SPECIFIC resolver (Cloudflare's) — great for cache issues
dig +trace github.com          # do the whole recursive walk yourself, root → TLD → authoritative
dig -x 140.82.121.4            # reverse lookup: IP → name
```

Two of these deserve emphasis:

- **`dig @<resolver>`** lets you ask a specific server. When "it works for me but not for them,"
  compare `dig @1.1.1.1 name` with `dig @<their-resolver> name` — different answers reveal a
  caching or propagation issue instantly.
- **`dig +trace`** performs the full hierarchical walk described above, printing each delegation.
  Running it once teaches you more about DNS than any diagram. It's the core of Lab 3.

Read a `dig` answer by looking at the **ANSWER SECTION** — that's the actual result. The number
before the record type is the **TTL** counting down.

## Where DNS bites in the real world

Because DNS underlies everything, its failures wear disguises. A short field guide, so you
recognize them later:

- "The website is down" but the server is fine → often a DNS record change or expiry.
- "Email stopped arriving" → often a broken MX or a TXT (SPF/DKIM) record.
- "It works on my laptop but not the server" → the two are using different resolvers/caches.
- "My TLS certificate renewal failed" → increasingly, cert issuance uses DNS records (the
  **DNS-01 challenge** you'll use in Module 6), so a DNS problem becomes a cert problem.

This is why the joke ("it was DNS") endures. When you run your own resolver in Module 3 and point
your own domain at your homelab in Module 6, DNS stops being a mysterious external service and
becomes something you operate and can reason about — which is exactly the confidence an employer
is looking for.

## Quick self-check

1. What's the difference between a recursive resolver and an authoritative server?
2. Walk through the four servers a resolver contacts to look up a fresh name from scratch.
3. What's the difference between an A record and a CNAME record?
4. You changed a DNS record an hour ago and it's still showing the old value for a friend. Why,
   and what should you have done beforehand?
5. Which `dig` command asks a *specific* resolver, and when is that useful?
6. Which `dig` command shows you the full root-to-authoritative delegation walk?

**Next:** [Lesson 1.4 · HTTP & TLS →](/modules/01-fundamentals/http-tls/)
