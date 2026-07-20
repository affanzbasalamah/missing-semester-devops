---
title: "Lesson 1.5 · Packet Capture"
description: tcpdump and Wireshark — seeing ARP, DNS, the TCP handshake, and TLS with your own eyes.
sidebar:
  label: "1.5 · Packet Capture"
---

Everything in the last three lessons was theory until now. This lesson hands you the instrument
that makes it real: **packet capture**. You'll watch the actual bytes crossing your network —
the ARP request, the DNS query, the TCP handshake, the TLS negotiation — and see the layered
model from Lesson 1.2 laid out in front of you, envelope inside envelope. This is the "seeing is
believing" lesson, and it's the one that turns networking from something you memorized into
something you *understand*.

## Why capture packets

Two reasons, one for learning and one for your career:

- **Learning:** reading about the TCP handshake is fine; *watching* SYN → SYN-ACK → ACK appear on
  your screen for a connection you just made is what cements it forever.
- **Career:** packet capture is a genuine diagnostic superpower. When logs and status codes aren't
  enough — when you need ground truth about what's *actually* on the wire — this is how senior
  engineers and security analysts find it. "Is the server even receiving the request?" is a
  question only a capture can answer definitively.

## The two tools

- **tcpdump** — a command-line capture tool. It's everywhere (every Linux server, no GUI needed),
  so it's what you'll use *on* a remote server or router. You'll run it on your OpenWrt router in
  Module 3.
- **Wireshark** — a graphical analyzer. It can capture too, but its superpower is *reading*
  captures: it decodes every layer, colorizes, and lets you filter and follow conversations. It's
  how you'll *analyze* what tcpdump captured.

The professional workflow, which you'll use in Module 3: **capture with tcpdump on the remote box,
analyze in Wireshark on your laptop.** For this lesson, you can do both on your own machine.

### Install

```sh
# Debian/Ubuntu/WSL
sudo apt install tcpdump wireshark

# macOS (tcpdump is built in; Wireshark via Homebrew)
brew install --cask wireshark
```

## tcpdump basics

tcpdump needs root (it reads raw network traffic) and a network **interface** to listen on.

```sh
ip link                                 # find your interface name (eth0, en0, wlan0...)
sudo tcpdump -i eth0                    # capture on that interface (Ctrl-C to stop)
sudo tcpdump -i eth0 -n                 # -n: don't resolve names (faster, clearer)
sudo tcpdump -i eth0 -w capture.pcap    # write raw packets to a file for Wireshark
sudo tcpdump -i eth0 -c 20              # capture just 20 packets and stop
```

### Capture filters: catching only what you want

A busy interface floods you with packets. **Filters** narrow it to what you care about:

```sh
sudo tcpdump -i eth0 port 53            # only DNS traffic
sudo tcpdump -i eth0 port 80 or port 443  # only web traffic
sudo tcpdump -i eth0 host 1.1.1.1       # only traffic to/from that host
sudo tcpdump -i eth0 arp                # only ARP
sudo tcpdump -i eth0 'tcp port 443'     # only HTTPS
```

Writing to a `.pcap` file and opening it in Wireshark is usually the move — capture narrowly on
the command line, then use Wireshark's richer tools to read it.

## Wireshark: reading a capture

Open Wireshark, and either capture live (double-click your interface) or open a `.pcap` file. You
see three panes:

1. **Packet list** (top) — one line per packet: time, source, destination, protocol, summary.
   Wireshark color-codes by protocol.
2. **Packet details** (middle) — the selected packet, **decoded layer by layer**. This is the
   magic: expand it and you literally see the Link layer (Ethernet/MAC), then the Network layer
   (IP), then the Transport layer (TCP/UDP), then the Application layer (HTTP/DNS) — the exact
   nesting from Lesson 1.2, made visible.
3. **Packet bytes** (bottom) — the raw hex, if you ever need it.

### Display filters: Wireshark's real power

Wireshark's **display filters** (different syntax from tcpdump's capture filters) let you slice a
capture after the fact:

```
dns                    show only DNS packets
tcp.port == 443        only HTTPS
ip.addr == 1.1.1.1     any traffic to or from that address
tcp.flags.syn == 1     only packets with the SYN flag (find handshakes!)
http                   only HTTP
tls.handshake          only TLS handshake messages
```

Type these into the filter bar at the top. `tcp.flags.syn == 1` is a fun one — it isolates exactly
the connection-opening packets.

### Follow a TCP stream

Right-click any packet in a TCP conversation → **Follow → TCP Stream**. Wireshark reassembles the
entire back-and-forth into one readable view. For plain HTTP, you'll see your actual request and
the server's response as text — the same exchange you typed by hand in Lesson 1.4, now captured
from a real browser. (For HTTPS, the stream is encrypted — which is itself the point: you can *see*
that TLS is doing its job.)

## The set-piece: watch a page load, layer by layer

This is the exercise the whole module builds toward, and the core of
[Lab 4](/modules/01-fundamentals/labs/#lab-4--the-capture). Here's what to do and what you'll see.

1. Start a capture, filtered to your own traffic. Clear your DNS cache first so the lookup actually
   happens on the wire.
2. In a browser, load a simple `http://` **and** an `https://` site (a plain-HTTP site lets you see
   the unencrypted HTTP; the HTTPS site lets you see TLS).
3. Stop the capture and read the story it tells, in order:

**What you'll see, and how it maps to the lessons:**

| In the capture | The lesson it proves |
|---|---|
| An **ARP** request/reply (if talking to a new local device) | 1.2 — IP-to-MAC resolution |
| A **DNS** query and response for the site's name | 1.3 — the name became an address |
| **TCP SYN → SYN-ACK → ACK** to the server's IP on port 80/443 | 1.2 — the three-way handshake, real |
| A **TLS handshake** (ClientHello, ServerHello, Certificate) for the HTTPS site | 1.4 — encryption being set up |
| **HTTP GET → 200 OK** (readable for the http site; encrypted for https) | 1.4 — the actual conversation |

When you watch these appear *in this exact order*, the entire module clicks into place. The
"assembled page load" from the end of Lesson 1.4 isn't a diagram anymore — it's a thing you
recorded and can point at. That's the moment this curriculum is built around.

:::tip[Clear your DNS cache so you can see the lookup]
If the name is already cached, no DNS query hits the wire and you'll miss it. Clear it first:
`sudo systemd-resolve --flush-caches` (Linux) or `sudo dscacheutil -flushcache;
sudo killall -HUP mDNSResponder` (macOS). Then the DNS query shows up in your capture where you
expect it.
:::

## A word on ethics and privacy

Packet capture shows you *everything* unencrypted on a network you can listen to — which is
exactly why it's powerful, and why it comes with responsibility.

:::caution[Only capture traffic you're authorized to]
Capture on **your own machine and your own network**. Capturing other people's traffic without
authorization is a privacy violation and, in many places, illegal — the same legal line you'll
study formally in Module 8. Notice, too, what you *can't* read: HTTPS traffic is encrypted, which
is the entire point of Lesson 1.4. Seeing that you can capture the packets but not read their
contents is a great practical lesson in why TLS matters. Capture responsibly; it's a professional
tool, not a snooping toy.
:::

## From here to the rest of the curriculum

Packet capture isn't a one-time exercise — it's a tool you'll return to:

- **Module 3:** run tcpdump *on your router* to watch every device's DNS queries and DHCP
  handshakes, and understand your whole network's traffic.
- **Module 5:** capture to debug why a WireGuard tunnel won't establish (is the UDP packet even
  arriving?).
- **Module 8:** capture is a core skill for detection and incident response — reconstructing what
  an attacker did from what crossed the wire.

You've now been handed the instrument. The rest of the module is the lab where you use it for real.

## Quick self-check

1. When would you reach for tcpdump rather than Wireshark, and vice versa?
2. What's the difference between a capture filter and a display filter?
3. In Wireshark's details pane, what are you seeing when you expand a single packet's layers?
4. Why must you clear your DNS cache before capturing, if you want to see the DNS query?
5. You capture an HTTPS page load. Why can you see the packets but not read the HTTP inside them —
   and why is that a *good* thing?
6. Name one ethical rule about packet capture.

**Next:** [The Labs →](/modules/01-fundamentals/labs/) — where you capture a real page load and
write it up as your first teaching document.
