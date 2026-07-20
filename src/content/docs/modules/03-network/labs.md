---
title: "Module 3 · Labs"
description: Flash a router, run your own DNS, segment the network, hunt a device, and diagram it all.
sidebar:
  label: Labs
---

These five labs take you from a stock router to a segmented, self-run network you've *tested* —
and produce your deliverable: a network diagram and config repo. The centerpiece (Lab 3) is
building and verifying real network segmentation, the highest-impact security work in the whole
curriculum so far. Commit your router configs (secrets stripped) as you go.

:::caution[This module can disrupt everyone's internet]
Changing routing, DHCP, and firewall rules can take the household offline. Mitigations: work when
nobody needs the network, keep a way back (a second router, or the recovery methods from
[Lesson 3.1](/modules/03-network/openwrt/)), and — best of all — do the risky labs on a **spare
router** double-NAT'd behind your main one until you're confident. Back up before every change.
:::

---

## Lab 1 · The flash

**Goal:** put OpenWrt on a real router, reach it two ways, and prove you can back up and restore
its config. Exercises [Lesson 3.1](/modules/03-network/openwrt/).

### Steps

1. Find your **exact** model + hardware revision in the
   [OpenWrt Table of Hardware](https://openwrt.org/toh/start). Read its wiki page fully.
2. **Write down your recovery method** (failsafe / TFTP / serial) *before* flashing.
3. Flash the correct OpenWrt factory image. Don't interrupt it.
4. Reach the router both ways: LuCI at its web address (set an admin password immediately) and
   `ssh root@...`.
5. Explore with Linux eyes: `cat /etc/openwrt_release`, `ip addr`, `logread -f`, `ls /etc/config/`.
6. **Back up and test-restore:** create a backup with `sysupgrade -b`, copy it to your laptop
   with `scp`, then actually restore it and confirm the router comes back identical.

### Verify

- [ ] OpenWrt is running; you reach it via both LuCI and SSH.
- [ ] You set an admin password on first login.
- [ ] You can name your device's recovery method from memory.
- [ ] You performed a real backup **and** a real restore (not just a backup).

### Commit

Start `network/` in your repo. Save your (secret-stripped) config backup and a `flash-log.md`
documenting the model, the image, the process, and your recovery plan.

---

## Lab 2 · DNS takeover

**Goal:** run DNS for your network, give your server a stable address and a name, and verify it
with `dig`. Exercises [Lesson 3.2](/modules/03-network/services/).

### Steps

1. **Reserve an address** for your Module 2 server via a DHCP static lease (by its MAC). Update
   your `~/.ssh/config` `homelab` entry to the fixed IP.
2. **Give it a local name** (e.g. `homelab.home.lan`) and confirm resolution from your laptop:
   ```sh
   dig @<router-ip> homelab.home.lan +short     # returns the server's IP
   ```
3. **(Recommended) Stand up a resolver** — Pi-hole or AdGuard Home on a Pi (or as a container on
   your server), and point the network's DHCP-advertised DNS at it.
4. **See the privacy reality:** let it run an hour, then look at the resolver's query log /
   dashboard. Note how much tracker/telemetry traffic your devices generate.
5. **Capture the proof:** on the router, `tcpdump -n port 53` and watch a lookup happen locally.

### Verify

- [ ] Your server has a stable, reserved address and a working local DNS name.
- [ ] `dig` against your router/resolver returns the right answer for the local name.
- [ ] (If you did the resolver) you can point to real evidence of blocked/observed tracker queries.

### Commit

Add `network/dns.md`: your reservation, the local names you defined, resolver choice and why, and
a note on what the query logs revealed.

---

## Lab 3 · The great segmentation

**This is the module's core lab.** Build the multi-VLAN topology and *prove* the firewall policy
holds. Exercises [Lesson 3.3](/modules/03-network/segmentation/).

### Steps

1. **Design first.** Decide your VLANs, subnets, and policy. Start from the four-zone model
   (Trusted / Servers / IoT / Guest) or a subset — even **three** segments satisfies the
   checkpoint. Write the policy table before you configure anything.
2. **Build it on OpenWrt:** define the VLANs and tagged/untagged ports, create an interface +
   subnet + DHCP pool per VLAN, put each in a firewall zone, and write the inter-zone rules
   (default deny, allow only what your table permits). Mirror the VLAN IDs on your managed switch.
3. **Move devices onto their VLANs** — server(s) onto the Servers VLAN, a smart/IoT device onto
   IoT, etc.
4. **Prove the isolation** from a device on each VLAN (use Modules 1–2 tools):
   ```sh
   # From IoT VLAN — these must FAIL:
   ping <server-ip>
   nmap <servers-subnet>
   # From Trusted VLAN — this must SUCCEED:
   ping <server-ip>
   ```
5. **Fix any gap** where reality doesn't match your policy table, and re-test until it does.

### Verify

- [ ] At least **three** segments exist, each with its own subnet and DHCP.
- [ ] Inter-zone firewall rules default-deny and allow only intended paths.
- [ ] You *proved*, from devices on different VLANs, that isolation holds (blocked where it should
      be, allowed where it should be).
- [ ] Your live config matches your written policy table.

### Commit

Add your `/etc/config/network` and `/etc/config/firewall` (secrets stripped) and
`network/segmentation.md` with your policy table and the before/after test results.

---

## Lab 4 · Rogue device hunt

**Goal:** using only the router, find and identify a device on your network — the operational
skill of knowing what's actually connected. Exercises [Lessons 3.2](/modules/03-network/services/)
and [3.4](/modules/03-network/watching/).

### Steps

1. Have a device join the network (a phone, or ask a housemate — with their knowledge). Or just
   pick an existing device you'll pretend you don't recognize.
2. **From the router alone**, identify it:
   - Current DHCP leases: `cat /tmp/dhcp.leases` — MAC, IP, hostname.
   - The ARP/neighbor table: `ip neigh` (Lesson 1.2).
   - Watch it live: `logread -f` while it joins; `tcpdump -n -e host <its-ip>` to see its traffic
     and which VLAN it's on.
3. **Characterize it:** what IP/VLAN is it on? What's its MAC vendor prefix suggest? What domains
   is it contacting (`tcpdump -n port 53 and host <its-ip>`)?
4. Write up how you'd tell an *unexpected* device from an expected one, and what you'd do about it.

### Verify

- [ ] You identified a device's IP, MAC, VLAN, and something about its behavior — from the router
      only.
- [ ] You can explain which tool gave you each piece of information.

### Commit

Add `network/device-hunt.md` — your method and findings. This is a mini incident-response drill,
foreshadowing [Module 8](/modules/08-security/).

---

## Lab 5 · The network diagram + writeup

**This is the module's deliverable.** Turn your built network into a clear diagram and an
explanation of your security choices. Exercises [Lesson 0.5](/modules/00-toolkit/writing/) and
[Diagrams as Text](/guides/diagrams/).

### The assignment

Produce `network/README.md` (plus the config files) containing:

1. **A topology diagram** drawn in **Mermaid** (like the ones in
   [Lesson 3.3](/modules/03-network/segmentation/)) — your VLANs, subnets, the router, the switch,
   and key devices. Because it's text, it lives in git and updates with your network.
2. **An IP plan** — the subnet for each VLAN and what lives on it.
3. **The firewall policy table** — from → to, allow/deny, as in Lesson 3.3.
4. **A written rationale** — a short blog-style post explaining your segmentation: what each VLAN
   is, and specifically *what threat each boundary defends against* ("IoT can't reach Servers so a
   compromised camera can't touch my backups").
5. **The config** — your exported OpenWrt `/etc/config/` files, **secrets stripped** (recall
   [Lesson 0.4](/modules/00-toolkit/git/): no WiFi passwords, no keys in git).

### Verify

- [ ] The Mermaid diagram accurately reflects your real, running network.
- [ ] The firewall policy table matches both the diagram and the live config.
- [ ] The writeup explains the *why* — the threat model behind each boundary.
- [ ] No secrets are committed.

### Commit

```sh
git add network/
git commit -m "Add network topology, segmentation policy, and OpenWrt config"
git push
```

Publish the rationale as a post on your site later. "How I segmented my home network and why" —
with a clean diagram and a real threat model — is a portfolio piece that signals security
thinking most junior candidates completely lack.

---

## Module 3 checkpoint

- [ ] My network runs on a router I flashed and configured myself (Lab 1)
- [ ] DHCP and DNS for my LAN are services I run and can debug (Lab 2)
- [ ] My network has at least three segments with enforced firewall policy between them (Lab 3)
- [ ] I can capture traffic on the router and explain what I see (Labs 2, 4)
- [ ] I have a current, accurate network diagram (Lab 5)
- [ ] I can restore my router config from a backup — tested (Lab 1)

## Deliverable

**Your network diagram + config repo** (Lab 5): a Mermaid topology, IP plan, firewall policy
table, threat-model writeup, and secret-stripped OpenWrt config — proving you can design,
build, secure, and *document* a real segmented network.

**Next module:** [Module 4 · Storage, Backups & Virtualization →](/modules/04-storage/) — where
your server learns to keep data safe and run many machines at once.
