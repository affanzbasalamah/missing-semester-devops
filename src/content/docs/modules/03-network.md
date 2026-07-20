---
title: "Module 3 · Build the Network"
description: Flash OpenWrt on a real router, carve VLANs, and run your own DNS and DHCP.
sidebar:
  label: "3 · Build the Network"
---

Consumer routers hide the network behind a wizard. OpenWrt removes the curtain: it's just
Linux, and every concept from Module 1 — DHCP, DNS, NAT, routing, firewalling — becomes a
config file you wrote yourself. By the end, you'll know exactly what happens to every
packet in your home.

**Hardware needed:** one OpenWrt-supported router (see [hardware guide](/guides/hardware/) —
many capable used models cost under $30) and ideally a cheap managed switch for the VLAN labs.

## What you'll learn

### Lesson 3.1 — OpenWrt from scratch
- Checking hardware support, flashing safely, and recovering from a bad flash
- The OpenWrt anatomy: it's Linux — UCI config, LuCI web UI, and SSH into your router
- Replacing your ISP router (or double-NAT'ing deliberately while you learn)

### Lesson 3.2 — The services your ISP box was doing for you
- DHCP: leases, reservations, options — give your server from Module 2 a reservation
- DNS with dnsmasq; then a dedicated resolver (Unbound or Pi-hole/AdGuard Home on a Pi)
- Local DNS names: `server.home.lan` instead of memorizing IPs
- NAT and port forwarding — and why you'll soon stop port-forwarding entirely (Module 5)

### Lesson 3.3 — Segmentation: your first real security architecture
- VLANs: what 802.1Q tagging actually does to a frame
- A sensible home topology: **trusted LAN / servers / IoT / guest**
- Inter-VLAN firewall rules: IoT can reach the internet but not your server; guests reach nothing internal
- Why flat networks are how ransomware spreads — segmentation is the cheapest control there is

### Lesson 3.4 — Watching the network
- Live packet captures *on the router* (`tcpdump` on OpenWrt, streamed to Wireshark)
- Seeing ARP, DHCP handshakes, and DNS queries from other devices — and the privacy lesson therein
- Basic traffic stats and connection tracking

## Labs

1. **The flash.** Flash OpenWrt, get WAN + LAN + WiFi working, document the process
   including your recovery plan.
2. **DNS takeover.** Point your LAN at your own resolver. Add local names for your server.
   Verify with `dig` that resolution happens locally, and capture the query on the router.
3. **The great segmentation.** Build the four-VLAN topology. Prove with `nmap`/`ping` from
   each VLAN that the firewall rules do what your diagram says.
4. **Rogue device hunt.** Have someone (or another of your devices) join the network.
   Find it from the router alone: lease table, ARP, traffic.
5. **Draw it.** Produce a network diagram (draw.io / mermaid) of your final topology with
   IP ranges, VLANs, and firewall policy. Diagrams are a professional deliverable — treat it like one.

## Checkpoint

- [ ] My network runs on a router I flashed and configured myself
- [ ] DHCP and DNS for my LAN are services I run and can debug
- [ ] My network has at least three segments with enforced firewall policy between them
- [ ] I can capture traffic on the router and explain what I see
- [ ] I have a current, accurate network diagram
- [ ] I can restore my router config from a backup (test it!)

## Deliverable

**A network diagram + config repo**: your topology diagram, exported router config
(secrets stripped!), firewall policy table, and a blog post explaining your segmentation
choices and what each VLAN is protected from.

## Resources

- [OpenWrt documentation](https://openwrt.org/docs/start) — the table of hardware is your friend
- Ars Technica's classic *"How routers work"* series
- Practical VLANs: any managed-switch vendor's 802.1Q primer — the concepts are identical everywhere
