---
title: "Lesson 3.2 · The Services Your ISP Box Hid"
description: DHCP, DNS, local names, and NAT & port forwarding — the network services you now run yourself.
sidebar:
  label: "3.2 · Core Services"
---

Your old router quietly ran several services that made the network "just work": it handed out
addresses (DHCP), resolved names (DNS), and translated between your private network and the
internet (NAT). Now *you* run them, on OpenWrt, with full visibility. This lesson turns the
DHCP, DNS, and NAT theory from [Module 1](/modules/01-fundamentals/) into services you operate
and debug — and sets up the local DNS names that make the rest of your homelab pleasant to use.

## DHCP: handing out addresses

Recall from [Lesson 1.2](/modules/01-fundamentals/tcpip/) that every device needs an IP address
to talk on the network. **DHCP** (Dynamic Host Configuration Protocol) is the service that
automatically hands one out when a device joins — along with the subnet mask, default gateway,
and DNS server to use. On OpenWrt this is handled by **dnsmasq** (which does both DHCP and DNS).

Key concepts you now control:

- **The DHCP range** — the pool of addresses handed to devices automatically (e.g.
  `192.168.10.100`–`192.168.10.250`).
- **Lease time** — how long a device keeps its assigned address before renewing.
- **Reservations (static leases)** — telling DHCP "always give *this* device (by its MAC
  address, from Lesson 1.2) *this* IP." This is how you give your servers stable addresses
  without configuring anything on the server itself.

### Give your Module 2 server a reservation

Your [Module 2 server](/modules/02-server/) wanted a stable address ([Lesson 2.1](/modules/02-server/bare-metal/)
left this for here). Do it now with a DHCP reservation — the clean way, because the server needs
no special config; the router just always offers it the same address:

- In LuCI: **Network → DHCP and DNS → Static Leases**, add the server's MAC and desired IP.
- Or with UCI on the router:
  ```sh
  uci add dhcp host
  uci set dhcp.@host[-1].name='homelab'
  uci set dhcp.@host[-1].mac='AA:BB:CC:DD:EE:FF'   # your server's MAC (ip link on the server)
  uci set dhcp.@host[-1].ip='192.168.10.10'
  uci commit dhcp
  /etc/init.d/dnsmasq restart
  ```

Now update your laptop's `~/.ssh/config` `homelab` entry to this fixed address, and it'll never
drift again.

## DNS: resolving names, on your terms

Also from [Lesson 1.3](/modules/01-fundamentals/dns/): DNS turns names into addresses. Your
router runs a DNS **forwarder** (dnsmasq again) — devices ask the router, and the router either
answers from its own knowledge (local names, cache) or forwards to an upstream **recursive
resolver** (your ISP's, or one you choose like `1.1.1.1` / `9.9.9.9`).

Two things you gain by controlling DNS:

### 1. Local names instead of memorizing IPs

You can define names that only exist on your network. Once your server has a reservation, give
it a name so you type `homelab.home.lan` instead of an IP everywhere:

- dnsmasq automatically resolves the DHCP reservation's hostname within your local domain.
- You can add more names in **Network → DHCP and DNS → Hostnames**, or in UCI.

Verify with the `dig` skills from [Lesson 1.3](/modules/01-fundamentals/dns/), pointed at your
router:

```sh
dig @192.168.10.1 homelab.home.lan +short     # should return your server's local IP
```

This is a genuinely satisfying moment — you're running the DNS you watched in a packet capture
two modules ago.

### 2. A dedicated resolver: Pi-hole / AdGuard Home / Unbound

For more power, run a dedicated resolver on a Raspberry Pi (or as a service on your server):

- **Pi-hole** or **AdGuard Home** — resolvers that also *block ads and trackers* network-wide by
  refusing to resolve known bad domains. Popular, visual, and a great way to *see* how much
  tracking traffic your devices generate (a real privacy lesson).
- **Unbound** — a full *recursive* resolver that does the root→TLD→authoritative walk itself
  (exactly the [Lesson 1.3](/modules/01-fundamentals/dns/) hierarchy) instead of forwarding to a
  third party, so no external resolver sees all your queries.

You point your network at it by setting the router's DHCP to hand out the resolver's IP as the
DNS server. Watching your own query resolve locally — and watching Pi-hole's dashboard count
blocked tracker requests — makes the abstract DNS lesson concrete.

:::note[This connects straight back to Module 1]
Running your own resolver is the payoff of [Lesson 1.3](/modules/01-fundamentals/dns/). Recursive
vs. forwarding, caching and TTLs, the query hierarchy — you're now operating all of it. When
something "can't resolve," you have the tools (`dig @your-resolver`, the router's logs) to find
out exactly why.
:::

## NAT and port forwarding — and why you'll soon abandon the latter

[Lesson 1.2](/modules/01-fundamentals/tcpip/) explained **NAT**: your router rewrites private
addresses to its single public IP so many devices share one internet connection, and — crucially
— machines on the internet **cannot initiate connections inward**. OpenWrt performs NAT by
default; you don't have to configure it for normal browsing.

**Port forwarding** is the traditional way to poke a hole inward: "connections arriving at my
public IP on port 443, send to `192.168.10.10:443`." It's how people historically exposed a home
server. OpenWrt does it in **Network → Firewall → Port Forwards**.

But here's the important guidance, and a deliberate through-line of this curriculum:

:::caution[You'll learn port forwarding, then stop using it]
Port forwarding exposes a service *directly to the entire internet*, including every automated
attacker constantly scanning for exactly that. It's worth understanding — set one up once in the
lab so you know how it works and what it risks. But in [Module 5](/modules/05-overlay/) you'll
replace it entirely with **overlay networks** (WireGuard, Tailscale, Cloudflare Tunnel) that let
you reach your homelab from anywhere while keeping **zero inbound ports open**. The modern answer
to "how do I reach my server from outside" is *not* port forwarding. Learn it here as background;
you won't rely on it.
:::

## Reading the logs when something's off

When a device can't get an address or resolve a name, the router tells you. Use your
Module 2 log skills:

```sh
logread | grep dnsmasq          # DHCP leases handed out, DNS queries/errors
logread -f                       # follow live while a device joins — watch the DHCP handshake
cat /tmp/dhcp.leases             # current active DHCP leases (who has what)
```

Watching `logread -f` while a phone joins the WiFi shows you the DHCP exchange in real time — the
same DISCOVER/OFFER/REQUEST/ACK handshake you'll capture in [Lesson 3.4](/modules/03-network/watching/).

## Quick self-check

1. What four things does DHCP typically hand a device besides its IP address?
2. What's a DHCP reservation, and why is it the clean way to give your server a stable address?
3. How do you verify your router is resolving a local name correctly?
4. What's the difference between a *forwarding* resolver and a *recursive* one like Unbound?
5. Why does NAT mean the internet can't directly connect to your home server?
6. Why does this curriculum teach port forwarding but then tell you to stop using it?

**Next:** [Lesson 3.3 · Segmentation →](/modules/03-network/segmentation/)
