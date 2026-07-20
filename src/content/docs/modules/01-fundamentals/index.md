---
title: "Module 1 · How It Actually Works"
description: Computers, operating systems, and networks — from silicon to socket, verified with your own packet captures.
sidebar:
  label: Overview
---

You cannot debug what you cannot picture. This module builds an accurate mental model of
what a computer does when it runs your code and what the network does when you load a page —
then **verifies every claim with a packet capture you take yourself**. Nothing here is
taken on faith.

This is the most theory-heavy module in the curriculum, deliberately placed *before* you
build anything. When your Module 2 server won't boot, your Module 3 VLAN won't route, or
your Module 5 WireGuard tunnel won't handshake, the diagnosis will come from the mental
models you build here. Everyone who skips this module pays for it later with hours of
confused config-shuffling.

## The lessons

| Lesson | Topic | Time |
|---|---|---|
| [1.1 · The Machine](/modules/01-fundamentals/machine/) | Boot process, the OS, kernel vs. user space, resource triage | 4–5 hrs |
| [1.2 · TCP/IP, Layer by Layer](/modules/01-fundamentals/tcpip/) | Ethernet, ARP, IP, subnets, routing, TCP/UDP, NAT | 6–8 hrs |
| [1.3 · DNS](/modules/01-fundamentals/dns/) | Recursion vs. authority, record types, caching, `dig` | 3–4 hrs |
| [1.4 · HTTP & TLS](/modules/01-fundamentals/http-tls/) | Requests by hand, status codes, the TLS handshake, certificates | 4–5 hrs |
| [1.5 · Packet Capture](/modules/01-fundamentals/capture/) | tcpdump and Wireshark — seeing everything above, live | 4–6 hrs |
| [Labs](/modules/01-fundamentals/labs/) | The five graded exercises | 6–10 hrs |

Total: roughly **30–40 hours**, or 3–4 weeks part-time.

## What you need

- Your machine from Module 0 with a working shell — plus **Wireshark** installed
  (free, all platforms) and `tcpdump`, `dig`, `curl`, `nc`, `traceroute`/`mtr` available.
  The [labs page](/modules/01-fundamentals/labs/) has install commands.
- No lab hardware needed yet — everything here runs against your existing home network and
  the public internet. (Your micro PC should be arriving around now for Module 2.)

## How the lessons fit together

The module tells one story: **what happens when you load a webpage.** Lesson 1.1 explains
the machine that runs the browser. Lesson 1.2 explains how packets find the server.
Lesson 1.3 explains how the name became an address. Lesson 1.4 explains the conversation
itself and its encryption. Lesson 1.5 hands you the instrument — packet capture — that lets
you *watch all of it happen*, and the capstone lab has you annotate a real capture of a
real page load, protocol by protocol.

## Checkpoint

- [ ] I can explain the boot process from power button to login prompt
- [ ] I can name the layer at which a given networking problem lives
- [ ] I can subnet in my head for common prefixes (/24, /25, /26, /16)
- [ ] I can resolve a domain manually with `dig` and explain each step
- [ ] I can capture and read a TCP handshake and a DNS query in Wireshark
- [ ] I can explain what a TLS certificate does and doesn't prove

## Deliverable

**An annotated packet-capture walkthrough** — a blog post in your repo that walks a reader
through your capture of a single page load, screenshot by screenshot, explaining every
protocol involved. Full spec in [Lab 4](/modules/01-fundamentals/labs/#lab-4--the-capture).

## Resources

- *Computer Networking: A Top-Down Approach* (Kurose & Ross) — the standard text, skim-friendly
- [How DNS Works](https://howdns.works/) — comic-format, genuinely good
- Julia Evans: *Networking! ACK!* zine
- [Beej's Guide to Network Programming](https://beej.us/guide/bgnet/) — when you want to go one level deeper
