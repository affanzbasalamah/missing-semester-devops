---
title: Hardware Shopping Guide
description: The full lab costs less than one certification exam. Here's exactly what to buy.
sidebar:
  label: Hardware Guide
---

Cost is the real barrier for fresh graduates, so this curriculum is built around **cheap,
used, real hardware**. You do not need a rack, a NAS, or new anything. The entire lab below
can be assembled for less than the price of a single certification exam — and using physical
gear (not just cloud VMs) is the whole point: it's how the concepts become tangible.

:::tip[Buy used, buy incrementally]
You don't need everything on day one. You need the micro PC by Module 2 and the router by
Module 3. Buy as you go. Ex-corporate hardware on eBay / local marketplaces is the sweet spot:
cheap, reliable, and abundant.
:::

## Tier 1 — The essentials (Modules 2–6)

### The server: a used micro PC
The heart of your lab. Look for ex-office "tiny/mini/micro" desktops — they're quiet,
sip power, and are everywhere on the used market.

| Model family | What to look for | Rough used price |
|---|---|---|
| Lenovo ThinkCentre M-series Tiny | M710q, M720q, M910q | $60–120 |
| Dell OptiPlex Micro | 3060/5060/7060 Micro | $60–120 |
| HP EliteDesk / ProDesk Mini | 800 G3/G4 Mini | $60–120 |

**Target specs:** an Intel i5 (7th gen or newer), **16 GB RAM** (so you can run several VMs
in Module 4), and any SSD. RAM is the spec that matters most for a virtualization lab —
prioritize it. An extra SSD or a cheap 2.5" HDD is handy for the storage/backup labs.

### The router: an OpenWrt-supported device
Your Module 3 network lab. **Check the [OpenWrt hardware table](https://openwrt.org/toh/start)
before buying anything** — support is model-specific.

- **Budget:** a used, well-supported home router (many good models under $30).
- **Recommended:** a device with a proper switch and enough flash/RAM for comfortable use
  (e.g. models with 128MB+ RAM). x86 mini-PCs and dedicated boxes also run OpenWrt if you
  want more headroom.
- **Nice to have:** a cheap **managed switch** (TP-Link/Netgear "smart" switches, ~$25) for
  the VLAN labs — many consumer routers have limited VLAN support.

### The essentials kit
- A **Raspberry Pi** (Pi 4 or Pi 5, or even a Pi 3 / Zero 2 W) — perfect for the Pi-hole /
  Unbound DNS resolver in Module 3 and light services. Not strictly required if your micro
  PC covers it, but very handy.
- microSD cards, a couple of **USB-to-Ethernet adapters**, an **Ethernet cable** or three,
  and a **USB flash drive** for install media.
- A **USB-to-serial (TTL) adapter** (~$8) — a lifesaver for recovering a bricked router.

## Tier 2 — Nice to have (Modules 4, 8)

- A **second/third disk** for the RAID and backup labs (used drives are fine — you're
  learning, not storing anything precious yet).
- An **external USB drive** as a backup target (the "2 media" in 3-2-1).
- A **second small machine or Pi** to act as the "attacker" box in the Module 8 purple-team
  lab, kept on an isolated VLAN.
- A cheap **UPS** if your power is unreliable — teaches graceful shutdown too.

## Tier 3 — Optional stretch (advanced tracks)

- **A second and third micro PC** — build a 3-node cluster for the optional k3s/Proxmox-cluster
  tracks. This is where "homelab" becomes a hobby.
- **More RAM / bigger SSDs** — only when a specific lab demands it.
- **A managed PoE switch** — if you go down the IP-camera / more-serious-networking path.

## What you do NOT need to buy

- ❌ A NAS appliance — you'll *build* one (that's Module 4).
- ❌ Enterprise rack gear — loud, power-hungry, overkill for learning.
- ❌ New hardware — used ex-corporate gear is the correct choice here.
- ❌ A domain is ~$10/yr and the only recurring cost worth paying (needed from Module 6).

## A note on power and noise

Everything recommended here is low-power (typically 6–20W idle for the micro PCs) and silent
enough to live on a desk or shelf. The entire lab running 24/7 costs a few dollars a month in
electricity — budget for that, and put your server on the UPS if you have one.

## Total budget

| Build | Approx. cost |
|---|---|
| Bare minimum (micro PC + used router) | **~$90** |
| Recommended (micro PC 16GB + router + Pi + switch + cables) | **~$180** |
| Comfortable (adds spare disks, backup drive, attacker Pi) | **~$260** |

Compare that to a single voucher for CompTIA Security+ or a cloud associate exam. This lab
teaches more, lasts longer, and comes with you to your first job.
