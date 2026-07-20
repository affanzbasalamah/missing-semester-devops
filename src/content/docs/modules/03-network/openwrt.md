---
title: "Lesson 3.1 · OpenWrt from Scratch"
description: Checking hardware support, flashing safely, recovering from a bad flash, and the "your router is just Linux" model.
sidebar:
  label: "3.1 · OpenWrt"
---

Your home router is a small Linux computer that your ISP or its manufacturer locked down and
hid behind a friendly wizard. **OpenWrt** is a full, open Linux firmware you flash onto that
hardware, turning it into a device you completely control — with a shell, config files, a
package manager, and every networking capability exposed. Installing it is the moment the
network stops being magic and becomes something you operate, exactly like the server you built
in [Module 2](/modules/02-server/).

## Why OpenWrt

- **It's real Linux.** Everything you learned in Modules 1–2 applies: SSH in, read configs,
  check logs, manage services. The concepts transfer directly.
- **It exposes everything.** VLANs, custom DNS, granular firewall rules, packet capture — all
  the things consumer firmware hides are first-class here.
- **It teaches the primitives.** The commercial "prosumer" gear people buy later (Ubiquiti,
  MikroTik, pfSense/OPNsense) exposes the *same* concepts. Learn them on OpenWrt and you can
  drive any of them.

## Step 1 · Check hardware support FIRST

This is the step people skip and regret. OpenWrt support is **model-and-revision specific** —
"the same" router with a different hardware revision may not be supported, or may need a
different image.

- Go to the [OpenWrt Table of Hardware](https://openwrt.org/toh/start) and find your **exact**
  model *and hardware revision* (often printed on the label as `v1`, `v2`, etc.).
- Confirm it's supported, note the **install instructions** and the correct **firmware image**
  for your revision, and read that device's wiki page end to end before touching anything.
- Prefer a device with enough flash and RAM to be comfortable (the [hardware guide](/guides/hardware/)
  points at good targets). Very low-flash devices work but constrain what you can install.

:::danger[The wrong image can brick your router]
Flashing firmware built for a different model or revision can render the device unbootable.
Match the image to your exact hardware revision, and read your device's wiki page — some
routers need a specific *factory* image the first time and *sysupgrade* images thereafter.
Five minutes of checking prevents a dead router.
:::

## Step 2 · Have a recovery plan before you flash

Assume the flash might go wrong, and know your way back *before* you start. Most OpenWrt-capable
routers have one or more recovery mechanisms — find yours on the device wiki page now:

- **Failsafe mode** — OpenWrt boots into a minimal recovery state (usually by holding a button
  during boot) where you can reset config or re-flash.
- **TFTP recovery** — many routers, when powered on holding the reset button, will fetch a
  firmware image from a TFTP server at a known IP. This recovers a "bricked" router that won't
  boot normally. Knowing this exists turns a scary brick into a 10-minute fix.
- **Serial console** — the ultimate backstop. A cheap USB-to-serial (TTL) adapter connects to
  pads on the board and gives you a console even when nothing else works. Overkill for most, but
  it's why that $8 adapter is on the parts list.

Write down which recovery method your device supports. That note is the difference between
"oops, let me recover" and "I bought a paperweight."

## Step 3 · Flash OpenWrt

The general process (your device's wiki page has the exact, authoritative steps — follow those):

1. Download the correct image for your exact model/revision from the Table of Hardware.
2. Log into the stock firmware's web interface and use its firmware-update page to flash the
   OpenWrt **factory** image (the "factory" image is the one made to replace stock firmware).
3. Wait — do not unplug. Flashing takes a few minutes and interrupting it is how routers die.
4. The router reboots into OpenWrt. By default OpenWrt comes up at **`192.168.1.1`**.

:::caution[Address collision with your existing network]
OpenWrt defaults to `192.168.1.1` — which may be the *same* address your ISP router already
uses. To avoid a collision while learning, either do this on a router disconnected from your
main network, or plan to change OpenWrt's LAN address. Doing your first OpenWrt setup on a
**separate router** (not your household's only one) is strongly recommended — you can experiment
freely without taking anyone offline.
:::

## Step 4 · First contact — the router is just Linux

Connect a computer to a LAN port of the OpenWrt router and reach it two ways:

**LuCI, the web interface**, at `http://192.168.1.1`. On first login there's no password — 
**set one immediately** (System → Administration). LuCI is a friendly UI over the underlying
config, great for exploring and for seeing what a change actually writes.

**SSH, the real control**, using your Module 0 skills:

```sh
ssh root@192.168.1.1
```

You're now at a shell on your router. Look around with the tools you already know:

```sh
cat /etc/openwrt_release      # what version am I running?
ip addr                        # the router's interfaces and addresses (Lesson 1.2)
logread                        # the system log (OpenWrt's journal equivalent)
logread -f                     # follow it live
```

It's Linux — smaller (it uses BusyBox for many commands, and `opkg` as its package manager
instead of `apt`), but the same fundamentals from Modules 1–2 all apply.

## Step 5 · Understand UCI — OpenWrt's config system

OpenWrt centralizes configuration in **UCI** (Unified Configuration Interface): a set of plain
text files under `/etc/config/`, one per subsystem. This is the OpenWrt equivalent of the
`/etc` configs you met in [Lesson 2.2](/modules/02-server/anatomy/):

```sh
ls /etc/config/               # network, firewall, dhcp, wireless, system, ...
cat /etc/config/network       # your network configuration, as readable text
```

You edit these three ways, and they all change the same underlying files:

- **LuCI** (the web UI) — friendliest for learning; you can watch what each toggle writes.
- The **`uci` command** — scriptable, precise:
  ```sh
  uci show network              # dump the whole network config
  uci set network.lan.ipaddr='192.168.10.1'
  uci commit network            # save
  /etc/init.d/network restart   # apply
  ```
- **Editing the files directly** with vi (your [Lesson 0.3](/modules/00-toolkit/editing/) skills).

The huge payoff, and a theme of this whole curriculum: because your entire router configuration
is **plain text under `/etc/config/`**, you can **back it up, diff it, and put it in git**. Your
network becomes version-controlled infrastructure — which is exactly the deliverable this module
builds toward and the mindset [Module 7](/modules/07-automation/) formalizes.

## Step 6 · Back up the config immediately

Before you change anything else, capture a known-good backup — and confirm you can restore it:

```sh
# On the router: create a backup archive
sysupgrade -b /tmp/openwrt-backup-$(date +%F).tar.gz

# From your laptop: pull it down (Lesson 0.2 scp)
scp root@192.168.1.1:/tmp/openwrt-backup-*.tar.gz .
```

Restoring is `sysupgrade -r <file>` (or via LuCI's backup/restore page). You'll *test* a restore
in [Lab 1](/modules/03-network/labs/#lab-1--the-flash) — because, as with the backups in
[Module 4](/modules/04-storage/), a backup you've never restored is only a hope.

## Quick self-check

1. Why must you check your *exact* model and hardware revision before flashing?
2. Name two recovery mechanisms that can save a router that won't boot normally.
3. What's the risk of OpenWrt's default `192.168.1.1`, and how do you avoid it?
4. Where does OpenWrt keep its configuration, and why does that make your network
   version-controllable?
5. Give the three ways to change OpenWrt config, and what each is best for.
6. Why back up (and test-restore) the router config before doing anything else?

**Next:** [Lesson 3.2 · The Services Your ISP Box Hid →](/modules/03-network/services/)
