---
title: "Lesson 3.4 · Watching the Network"
description: Packet captures on the router, seeing DHCP/DNS/ARP from real devices, and the privacy lessons therein.
sidebar:
  label: "3.4 · Watching"
---

In [Lesson 1.5](/modules/01-fundamentals/capture/) you captured packets on your own laptop.
Now you have something more powerful: a capture point at the **center of your network**. Because
all your traffic flows through the router, capturing there lets you see *every device's* traffic
— the DHCP handshakes, the DNS queries, the ARP chatter. This is a genuine operational
superpower, a great way to finally *see* the Module 1 protocols in the wild, and — importantly —
a lesson in privacy and responsibility.

## Why capture on the router

Your laptop's capture only sees its own traffic (and broadcasts). The router sees **everything**,
because it's the gateway every packet crosses (recall the default gateway from
[Lesson 1.2](/modules/01-fundamentals/tcpip/)). That vantage point is what makes the router the
right place to answer questions like "is that device even sending DNS queries?" or "what's this
IoT gadget talking to?"

## tcpdump on OpenWrt

`tcpdump` (from [Lesson 1.5](/modules/01-fundamentals/capture/)) runs on OpenWrt too. Install it
with OpenWrt's package manager (the `opkg` you met in Lesson 3.1):

```sh
opkg update
opkg install tcpdump
```

Then capture, using the same filters you already know:

```sh
tcpdump -i br-lan -n                    # watch LAN traffic (interface names vary; check `ip link`)
tcpdump -i br-lan -n port 53            # only DNS — see every device's lookups
tcpdump -i br-lan -n port 67 or port 68 # only DHCP — watch devices get addresses
tcpdump -i br-lan -n arp                # only ARP — the IP↔MAC chatter from Lesson 1.2
tcpdump -i br-lan -n -w /tmp/cap.pcap   # write to a file for Wireshark
```

:::tip[The pro workflow: capture on the router, analyze on your laptop]
Routers are small; Wireshark's rich analysis lives on your laptop. The standard move (foreshadowed
in [Lesson 1.5](/modules/01-fundamentals/capture/)) is to capture to a file on the router, copy
it down with `scp` (Lesson 0.2), and open it in Wireshark. You can even stream live:
```sh
ssh root@192.168.10.1 "tcpdump -i br-lan -n -w -" | wireshark -k -i -
```
This pipes a live capture from the router straight into Wireshark on your laptop — capture point
in the network's center, analysis tools on your desk.
:::

## What you'll see, and where it maps to Module 1

Watching a device join the network is the whole of Module 1 replaying in front of you:

| On the wire | The lesson it makes real |
|---|---|
| **DHCP** DISCOVER → OFFER → REQUEST → ACK as a device joins | [1.2](/modules/01-fundamentals/tcpip/) / [3.2](/modules/03-network/services/) — getting an address |
| **ARP** "who has 192.168.10.1?" broadcasts and replies | [1.2](/modules/01-fundamentals/tcpip/) — IP↔MAC resolution |
| **DNS** queries streaming out as apps phone home | [1.3](/modules/01-fundamentals/dns/) — name resolution |
| **TCP** handshakes opening connections to servers | [1.2](/modules/01-fundamentals/tcpip/) — SYN/SYN-ACK/ACK |
| **TLS** ClientHello/ServerHello for encrypted connections | [1.4](/modules/01-fundamentals/http-tls/) — the handshake |

The DHCP handshake is especially satisfying: filter for ports 67/68, plug in a device, and watch
the four-step DISCOVER/OFFER/REQUEST/ACK exchange that gives it an address — the thing dnsmasq
does thousands of times, seen once, clearly.

## The privacy lesson (this is the point, not a footnote)

Capturing at the router shows you something uncomfortable and important: **how much your devices
chatter, and to whom.** Filter for DNS and watch an idle smart TV or phone — you'll see a steady
stream of lookups to analytics, telemetry, and ad domains, even when you're "not using" the
device. This is a visceral, hands-on privacy education you can't get from reading.

Two lessons land here:

- **What you *can* see:** DNS queries reveal which domains a device contacts even when the
  content is encrypted — the *names* leak even when the *data* doesn't. This is exactly why
  running your own resolver ([Lesson 3.2](/modules/03-network/services/)) and blocking trackers
  (Pi-hole/AdGuard) matters, and why encrypted DNS exists.
- **What you *can't* see:** the *contents* of HTTPS connections remain encrypted — you see that a
  device talked to a server, not what was said. This is [Lesson 1.4](/modules/01-fundamentals/http-tls/)'s
  TLS doing its job, observed from the most privileged vantage point on the network. Seeing the
  limit of your own visibility is the best possible argument for why TLS matters.

:::caution[With the center of the network comes responsibility]
Capturing at the router means you can observe the traffic of everyone on your network — family,
housemates, guests. That's a real responsibility and, in shared living situations, an ethical and
sometimes legal line (the same line formalized in [Module 8](/modules/08-security/)). Capture to
*learn how the network works and to secure it* — not to snoop on the people using it. Tell people
if you're capturing on a shared network. This is a preview of the professional ethics that govern
all security monitoring: having the access does not make using it acceptable.
:::

## This vantage point returns later

The router-as-capture-point isn't a one-off. It underpins work in later modules:

- **[Module 5](/modules/05-overlay/):** capture on ports to debug why a WireGuard handshake isn't
  completing — is the UDP packet even arriving at the router?
- **[Module 8](/modules/08-security/):** network visibility is the foundation of detection; a
  capture point plus centralized logs is how you'll spot the attacker in the purple-team exercise.

You've now built the network *and* the ability to see inside it. That combination — operate it,
and observe it — is what an employer means by "understands networking."

## Quick self-check

1. Why does capturing on the router show you more than capturing on your laptop?
2. What's the standard workflow for using tcpdump on a small router with Wireshark on your laptop?
3. Which four-step exchange do you see when a device joins, and on which ports do you filter for it?
4. Why can you see a device's DNS queries but not the contents of its HTTPS connections?
5. What does watching an idle device's DNS traffic teach you about privacy?
6. What's the ethical rule about capturing on a network other people use?

**Next:** [The Labs →](/modules/03-network/labs/) — where you flash, segment, and document your
own network.
