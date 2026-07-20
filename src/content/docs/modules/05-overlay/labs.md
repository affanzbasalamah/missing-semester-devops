---
title: "Module 5 · Labs"
description: Hand-build a WireGuard tunnel, debug it on purpose, run a tailnet with ACLs, publish with zero open ports, and design it all.
sidebar:
  label: Labs
---

These five labs take you from a hand-written WireGuard config to a fully designed remote-access
architecture — including the satisfying proof at the end: scanning your own home IP from outside
and seeing **zero open ports** while your services remain reachable through overlay tunnels.
Commit configs (secrets stripped!) and writeups as you go.

:::note[What you'll need]
The WireGuard labs need your [Module 2](/modules/02-server/) server and a client (laptop/phone).
The Cloudflare lab needs a **domain managed through Cloudflare** (the ~$10/yr recurring cost from
the [hardware guide](/guides/hardware/)). All labs assume the network and DNS from
[Module 3](/modules/03-network/).
:::

:::danger[Keys and tokens are secrets — never commit them]
WireGuard private keys, Tailscale/Headscale auth keys, and Cloudflare tunnel tokens are secrets
([Lesson 0.4](/modules/00-toolkit/git/)). Keep them out of git via `.gitignore`; commit only
sanitized configs with placeholders. A leaked tunnel token or private key is a real compromise —
treat one as you would a password (rotate if exposed).
:::

---

## Lab 1 · Raw tunnel

**Goal:** hand-build a working WireGuard tunnel from a remote network, with no GUI tools.
Exercises [Lesson 5.1](/modules/05-overlay/wireguard/).

### Steps

1. Generate key pairs on both your server and a client (laptop). Keep private keys secret.
2. Hand-write `/etc/wireguard/wg0.conf` on each peer: overlay addresses (e.g. `10.10.0.1/24` and
   `10.10.0.2/24`), the server's `ListenPort`, correct public keys, the client's `Endpoint`
   pointing at your home, sensible `AllowedIPs`, and `PersistentKeepalive` on the client.
3. Forward **one UDP port** (51820) on your router to the server — the only inbound hole, and
   you'll remove it after later labs replace it.
4. Bring it up: `sudo wg-quick up wg0` on both. Verify with `sudo wg` (look for a recent
   handshake).
5. **Test from a genuinely remote network** — a phone hotspot or a café, *not* your own LAN — and
   `ping 10.10.0.1` across the tunnel. Bonus: add your LAN subnet to `AllowedIPs` and reach
   another home device through the tunnel.

### Verify

- [ ] `sudo wg` shows a completed handshake and transfer in both directions.
- [ ] You reached the server over the tunnel from an external network.
- [ ] You can explain every line of both configs, especially `AllowedIPs`.

### Commit

`labs/05-01-wireguard.md` with **sanitized** configs (placeholder keys) and an explanation of
each directive. No real keys.

---

## Lab 2 · Break it on purpose

**Goal:** build the WireGuard diagnostic instinct by causing and identifying failures. Exercises
[Lessons 5.1](/modules/05-overlay/wireguard/) and [1.5](/modules/01-fundamentals/capture/).

### Steps

Starting from your working Lab 1 tunnel, introduce these faults **one at a time**, and for each:
predict the symptom, observe it, then diagnose it *from evidence* before fixing:

1. **Wrong `AllowedIPs`** (too narrow) — tunnel handshakes but your traffic doesn't route. What
   does `sudo wg` show vs. `ping`?
2. **Wrong endpoint / blocked UDP port** — no handshake at all. Use
   `sudo tcpdump -i any udp port 51820 -n` ([Lesson 1.5](/modules/01-fundamentals/capture/)) to
   see whether packets even arrive.
3. **Swapped/typo'd public key** — handshake never completes though packets arrive.
4. For each: which tool revealed the cause (`wg`, `tcpdump`, `ping`)?

Then assemble your findings into a **WireGuard troubleshooting flowchart** (in Mermaid — see
[Diagrams as Text](/guides/diagrams/), and the example tree in
[Lesson 5.1](/modules/05-overlay/wireguard/)).

### Verify

- [ ] You reproduced at least three distinct failure modes and diagnosed each from evidence.
- [ ] You used `tcpdump` to distinguish "packets not arriving" from "packets arrive but no
      handshake."
- [ ] You produced a diagnostic flowchart you'd actually use.

### Commit

`labs/05-02-wg-debugging.md` with the failure/symptom/diagnosis table and your Mermaid flowchart.

---

## Lab 3 · Tailnet

**Goal:** stand up a Tailscale tailnet across your devices and restrict it with an ACL. Exercises
[Lesson 5.2](/modules/05-overlay/tailscale/).

### Steps

1. Install Tailscale on your laptop, phone, and server; `tailscale up` and authenticate each.
2. Confirm the mesh: `tailscale status`; reach your server by its tailnet IP from your phone on
   cellular (off your home WiFi).
3. Enable **MagicDNS** and reach the server by name (`ssh homelab`) from a remote network.
4. Configure a **subnet router** so a device can reach a whole home subnet/VLAN
   ([Lesson 3.3](/modules/03-network/segmentation/)) through one node.
5. **Write an ACL** that meaningfully restricts access — e.g. the phone may reach only the
   server's web port, not SSH. Apply it and *prove* the restriction holds (the allowed thing
   works, the denied thing is refused).

### Verify

- [ ] Your devices form a working tailnet reachable from off-network.
- [ ] MagicDNS lets you use names, not IPs.
- [ ] A subnet router exposes a LAN/VLAN to the tailnet.
- [ ] You wrote and applied an ACL and demonstrated it actually restricts access.

### Commit

`labs/05-03-tailscale.md` with your ACL (it's policy-as-code, safe to commit) and evidence the
restriction works.

---

## Lab 4 · Publish

**Goal:** publish a service to the public internet through Cloudflare Tunnel with an Access policy
— and prove your home IP has **zero open ports**. Exercises [Lesson 5.3](/modules/05-overlay/cloudflare/).

### Steps

1. With a Cloudflare-managed domain, install `cloudflared` on your server and authenticate it.
2. Create a tunnel and route a public hostname (e.g. `demo.yourdomain.com`) to a local service
   (a simple web page, or the nginx from [Lab 2.4](/modules/02-server/labs/)). Run `cloudflared`
   as a systemd service so it survives reboots.
3. Confirm the service is reachable at `https://demo.yourdomain.com` from anywhere — with **no
   port forwarded** for it.
4. Put **Cloudflare Access** in front: a policy allowing only your email (one-time code). Confirm
   an unauthenticated visitor is challenged and only you get through.
5. **The proof:** from an external network, scan your home's public IP:
   ```sh
   nmap -Pn <your-home-public-ip>
   ```
   Confirm it shows **no open ports** (once you've also torn down the Lab 1 port-forward), even
   though your services are reachable through the tunnels.

### Verify

- [ ] A service is publicly reachable via Cloudflare Tunnel with no inbound port for it.
- [ ] Cloudflare Access gates it to your identity; unauthenticated visitors are blocked.
- [ ] An external `nmap` of your home IP shows zero open ports.
- [ ] You can state the trade-off you accepted (Cloudflare sees plaintext at its edge).

### Commit

`labs/05-04-cloudflare.md` with the setup (sanitized — no tunnel token), the Access policy, and
the `nmap` output proving zero open ports.

---

## Lab 5 · The design doc

**This is the module's deliverable.** Turn your three tools into a documented architecture with a
justified decision. Exercises [Lesson 5.4](/modules/05-overlay/choosing/) and
[0.5](/modules/00-toolkit/writing/).

### The assignment

Write `blog/05-remote-access-adr.md` — an **ADR** ([Lesson 5.4](/modules/05-overlay/choosing/))
for your homelab's remote access, containing:

1. **Context** — what you need (private admin access; public publishing) and your constraints
   (behind NAT, no inbound ports).
2. **Decision** — which tool you use for what (e.g. Tailscale for admin, Cloudflare Tunnel +
   Access for the public site), with reasoning.
3. **Alternatives considered** — including raw WireGuard and port forwarding, and why you
   rejected/kept each.
4. **Consequences & trade-offs** — honestly stated, including who's in the data path and what
   happens if a token leaks.
5. **A topology diagram** in **Mermaid** showing your devices, the tunnels, and the (zero) open
   ports.
6. **The proof** — your external `nmap` output showing no open ports.

### Verify

- [ ] The ADR follows the standard shape and justifies each choice.
- [ ] Trade-offs are stated honestly, not glossed over.
- [ ] The Mermaid diagram matches your real setup.
- [ ] The `nmap` proof is included.

### Commit

```sh
git add blog/05-remote-access-adr.md labs/
git commit -m "Add remote-access ADR: WireGuard, Tailscale, Cloudflare Tunnel"
git push
```

Publish it. "Here's how I give secure, zero-port remote access to my infrastructure, and why I
chose each piece" — with a diagram and an `nmap` proof — is precisely the answer to a very common
interview question, already written and demonstrated.

---

## Module 5 checkpoint

- [ ] I can hand-write a working WireGuard config and explain every line (Lab 1)
- [ ] I can debug a failed handshake methodically, not by config-shuffling (Lab 2)
- [ ] My devices form a tailnet with ACLs I wrote (Lab 3)
- [ ] I have a public service reachable through a tunnel with zero inbound ports open (Lab 4)
- [ ] An external port scan of my home IP shows nothing (Lab 4)
- [ ] I've written an ADR comparing the three approaches for my own use (Lab 5)

## Deliverable

**Your remote-access design doc** (Lab 5): an ADR comparing WireGuard, Tailscale, and Cloudflare
Tunnel, with a Mermaid topology diagram and an external `nmap` scan proving zero open ports —
demonstrating you can not only operate modern zero-trust access but *reason about and justify* an
architecture.

**Next module:** [Module 6 · Self-Hosting →](/modules/06-selfhosting/) — where everything
converges: your own public site and git server, reachable through the tunnels you just built.
