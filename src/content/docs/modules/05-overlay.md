---
title: "Module 5 · Overlay Networks"
description: WireGuard by hand, then Tailscale, then Cloudflare Tunnel — secure access without open ports.
sidebar:
  label: "5 · Overlay Networks"
---

The old way to reach your homelab from outside was port forwarding — punching holes in
your firewall and hoping. The modern way is overlay networks: encrypted tunnels that make
your devices reachable *without exposing anything to the internet*. This is also exactly
how modern corporate zero-trust access works, so this module is directly résumé-relevant.

We build the hard way first (raw WireGuard), so the easy ways (Tailscale, Cloudflare)
are understood rather than magic.

## What you'll learn

### Lesson 5.1 — WireGuard from first principles
- Public-key cryptography recap: what key pairs actually exchange
- WireGuard's model: interfaces, peers, `AllowedIPs` (the concept everyone gets wrong)
- Hand-writing configs for a laptop ↔ server tunnel
- Routing a subnet through the tunnel; DNS over the tunnel
- Debugging: handshake failures, MTU pain, NAT traversal and why one side must be reachable

### Lesson 5.2 — Tailscale: WireGuard with the sharp edges filed off
- What Tailscale adds: NAT traversal (DERP), key distribution, identity-based auth
- Building your tailnet; MagicDNS; sharing a node
- ACLs: writing policy as code — who can reach what
- Exit nodes and subnet routers: reaching your *whole* LAN via one node
- Headscale (optional): self-hosting the control plane, because this curriculum self-hosts

### Lesson 5.3 — Cloudflare Tunnel: publishing without exposing
- The reverse model: outbound-only connector, no inbound ports at all
- Publishing a web service at a real domain through the tunnel
- Cloudflare Access in front of it: SSO policy before the request ever reaches your server
- The trade-off ledger: you gain protection, you hand a third party your TLS — name the trade honestly

### Lesson 5.4 — Choosing: the architecture decision
- Private access for *you* → Tailscale/WireGuard
- Public service for *everyone* → Cloudflare Tunnel (or a VPS reverse-proxy relay)
- Semi-private for *some people* → Tunnel + Access, or tailnet sharing
- Writing an ADR (Architecture Decision Record) — a professional habit worth starting now

## Labs

1. **Raw tunnel.** Hand-write WireGuard configs connecting your laptop to your homelab
   from a coffee shop / phone hotspot. No GUI tools. Debug until the handshake completes.
2. **Break it on purpose.** Set a wrong `AllowedIPs`, a wrong endpoint, a blocked UDP port.
   For each: what are the symptoms? Build yourself a WireGuard diagnostic flowchart.
3. **Tailnet.** Deploy Tailscale across laptop, phone, and homelab. Configure a subnet
   router so your phone can reach *any* LAN device. Write an ACL that limits it.
4. **Publish.** Put a service on the public internet via Cloudflare Tunnel with an Access
   policy (email OTP) in front. Verify with `nmap` from outside that your home IP still
   answers on **zero** ports.
5. **The design doc.** Write the ADR: which overlay carries what in *your* homelab, and why.

## Checkpoint

- [ ] I can hand-write a working WireGuard config and explain every line
- [ ] I can debug a failed handshake methodically, not by config-shuffling
- [ ] My devices form a tailnet with ACLs I wrote
- [ ] I have a public service reachable through a tunnel with zero inbound ports open
- [ ] An external port scan of my home IP shows nothing
- [ ] I've written an ADR comparing the three approaches for my own use

## Deliverable

**A remote-access design doc** (ADR format) comparing WireGuard, Tailscale, and Cloudflare
Tunnel — with your topology diagram and the external `nmap` scan proving the zero-open-ports
claim. This doc doubles as interview material: "walk me through your homelab access design."

## Resources

- [WireGuard conceptual overview](https://www.wireguard.com/#conceptual-overview) — short and canonical
- Tailscale's blog — their [*How NAT traversal works*](https://tailscale.com/blog/how-nat-traversal-works) post is a networking education by itself
- [Cloudflare Tunnel docs](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/)
