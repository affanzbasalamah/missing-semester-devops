---
title: "Module 1 · Labs"
description: Five exercises that turn the theory of computers and networks into things you've seen with your own eyes.
sidebar:
  label: Labs
---

These five labs make the module's theory concrete. The capstone (Lab 4) produces your
first real *teaching* document — an annotated packet-capture walkthrough — which becomes a
standout piece in your portfolio. As in Module 0, each lab tells you **what to do**, **how to
verify** it, and **what to commit**. Keep committing to your public repo as you go.

:::note[Tools you'll need]
Install these first:
```sh
# Debian/Ubuntu/WSL
sudo apt install tcpdump wireshark dnsutils curl netcat-openbsd traceroute mtr

# macOS (most are built in; add the rest via Homebrew)
brew install --cask wireshark    # tcpdump, dig, curl, nc, traceroute are already present
```
Confirm you have `dig`, `curl`, `nc`, `traceroute`/`mtr`, `tcpdump`, and Wireshark.
:::

---

## Lab 1 · Boot narration

**Goal:** cement the boot process and the machine model from
[Lesson 1.1](/modules/01-fundamentals/machine/) by explaining it in your own words — the test
of real understanding.

### Tasks

1. Write a **step-by-step narrative** of everything that happens between pressing the power
   button and reaching a login prompt. Cover all five stages: firmware/POST, bootloader, kernel,
   init/systemd, login. Explain each in one or two plain-English sentences — imagine explaining
   it to a smart friend who isn't technical.
2. For each stage, add a line: **"if this stage fails, the symptom is..."** (e.g. "no POST →
   the machine shows nothing, likely RAM or power"). This turns your narrative into a diagnostic
   map you'll actually use in Module 2.
3. Run the four resource-triage commands on your own machine and record what each shows:
   ```sh
   uptime      # load average
   free -h     # memory (note the "available" figure)
   df -h       # disk usage per filesystem
   ss -tunlp   # what's listening
   ```
   Write one sentence per command explaining what its output means for *your* machine right now.

### Verify

- [ ] All five boot stages are explained in your own words, in order.
- [ ] Each stage has a plausible failure symptom.
- [ ] You ran all four triage commands and interpreted your own output.

### Commit

`labs/01-boot-narration.md`. This is a Lesson 0.5 writing exercise too — structure it with
headings and make it skimmable.

---

## Lab 2 · Manual HTTP

**Goal:** demystify HTTP by speaking it yourself, then reading `curl`'s full output. Exercises
[Lesson 1.4](/modules/01-fundamentals/http-tls/).

### Tasks

1. **HTTP by hand.** Open a raw connection and type a request yourself:
   ```sh
   nc example.com 80
   ```
   Then type (and press Enter **twice** after the last line):
   ```http
   GET / HTTP/1.1
   Host: example.com

   ```
   Capture the response. Identify in it: the status line, at least three headers, and where the
   body begins.
2. **The same with curl -v.** Run:
   ```sh
   curl -v https://example.com > /dev/null
   ```
   Annotate the verbose output. Label every section: the DNS resolution, the TCP connection, the
   TLS handshake lines, the request headers your machine sent (`>`), and the response headers the
   server sent (`<`).
3. **Status-code exploration.** Use curl to trigger and observe different status codes:
   ```sh
   curl -I https://example.com                          # a 200
   curl -I https://example.com/nonexistent-page-xyz     # likely a 404
   curl -IL http://example.com                          # watch a 301/302 redirect to https
   ```
   Record which code each returned and what it means.

### Verify

- [ ] You completed a raw HTTP exchange with `nc` and can label the parts of the response.
- [ ] Your annotated `curl -v` output identifies DNS, TCP, TLS, request, and response sections.
- [ ] You observed and correctly explained at least three different status codes.

### Commit

`labs/02-manual-http.md` with your annotated request/response and the `curl -v` breakdown.

---

## Lab 3 · DNS treasure hunt

**Goal:** trace a name from the root servers down, proving you understand recursion vs. authority.
Exercises [Lesson 1.3](/modules/01-fundamentals/dns/).

### Tasks

1. **The full walk.** Pick any domain and trace its resolution from the root:
   ```sh
   dig +trace github.com
   ```
   Document **every hop**: the root servers → the `.com` TLD servers → the domain's authoritative
   servers → the final answer. For each stage, note *what question was asked* and *what kind of
   server answered*.
2. **Record types.** For your chosen domain, retrieve and explain each of these:
   ```sh
   dig example.com A
   dig example.com AAAA
   dig example.com MX
   dig example.com NS
   dig example.com TXT
   ```
   Write one line per record type saying what it's for and what you got back.
3. **Caching in action.** Query the same name twice and compare the TTL:
   ```sh
   dig github.com          # note the TTL number in the ANSWER SECTION
   dig github.com          # run again — is the TTL lower now? why?
   ```
4. **Compare resolvers.** Ask two different resolvers and compare:
   ```sh
   dig @1.1.1.1 github.com +short
   dig @8.8.8.8 github.com +short
   ```
   Note whether they agree, and explain *why* two resolvers might return different answers or TTLs.

### Verify

- [ ] Your `+trace` writeup names each tier (root, TLD, authoritative) and what it delegated to.
- [ ] You retrieved and explained at least five record types.
- [ ] You can explain why the TTL dropped on the second identical query.
- [ ] You can explain why two resolvers might differ.

### Commit

`labs/03-dns.md`. Include the interesting bits of your `dig +trace` output with your annotations.

---

## Lab 4 · The capture

**This is the module's capstone and its portfolio deliverable.** You'll capture a real web page
load and write it up as an annotated walkthrough that *teaches* the reader every protocol
involved. Exercises [Lessons 1.2–1.5](/modules/01-fundamentals/tcpip/).

### Tasks

1. **Set up.** Start Wireshark (or `tcpdump -w capture.pcap`) on your active interface. Clear your
   DNS cache first so the lookup appears on the wire:
   ```sh
   # Linux:
   sudo systemd-resolve --flush-caches
   # macOS:
   sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder
   ```
2. **Capture a page load.** Load one **plain-HTTP** site (so you can read the HTTP) and one
   **HTTPS** site (so you can see TLS). Then stop the capture.
3. **Find and annotate each stage.** Using display filters (`dns`, `tcp.flags.syn == 1`, `tls`,
   `http`), locate and screenshot:
   - the **DNS query and response** for the site name
   - the **TCP three-way handshake** (SYN, SYN-ACK, ACK) — point out each
   - the **TLS handshake** for the HTTPS site (ClientHello, ServerHello, Certificate)
   - the **HTTP GET and 200 response** (readable for the http site)
   - a **Follow TCP Stream** view of the plain-HTTP exchange
4. **Write the walkthrough.** Assemble it into a blog post that walks a reader through your
   capture **in order**, screenshot by screenshot, explaining what each protocol is doing and how
   the layers nest. Explicitly connect what you see back to the theory: "here's the three-way
   handshake from Lesson 1.2, and you can see the SYN flag set in this packet."
5. **Reflect on encryption.** Point out that you can see the HTTPS *packets* but not their
   contents, and explain why — tying back to Lesson 1.4.

### Verify

- [ ] Your capture clearly contains DNS, a TCP handshake, a TLS handshake, and HTTP.
- [ ] Each is screenshotted and annotated in the writeup, in the order it occurred.
- [ ] The writeup *teaches* — a reader who skipped this module could follow along.
- [ ] You explain why the HTTPS content is unreadable and why that's correct behavior.

### Commit

`blog/2026-XX-XX-anatomy-of-a-page-load.md` plus the screenshots (and optionally the `.pcap`, if
it contains only your own test traffic). **This is the Module 1 deliverable** — polish it. It's
one of the more impressive things a junior candidate can show, because it proves you understand
networking from the wire up, not just from a diagram.

---

## Lab 5 · Subnet drills

**Goal:** make CIDR subnetting reflexive — you'll need it designing your network in Module 3 and
sizing cloud subnets in Module 9. Exercises [Lesson 1.2](/modules/01-fundamentals/tcpip/).

Work these **by hand** first (that's the point), then check with a tool.

### Tasks

For each network, determine the network address, the broadcast address, the usable host range,
and the number of usable hosts:

1. `192.168.1.0/24`
2. `10.20.30.0/26`
3. `172.16.0.0/16`
4. `192.168.10.128/25`

Then answer:

5. Are `192.168.1.50/24` and `192.168.1.200/24` on the same subnet? How do you know?
6. Are `10.0.5.10/16` and `10.0.200.5/16` on the same subnet?
7. Are `192.168.1.10/26` and `192.168.1.100/26` on the same subnet? (Careful — this one's the
   interesting case.)
8. You need to split `192.168.50.0/24` into **four** equal subnets. What prefix length do you use,
   and what are the four network addresses?

Check your work:

```sh
ipcalc 10.20.30.0/26      # if installed — shows network, broadcast, host range
# or: sipcalc, or an online CIDR calculator
```

### Verify

- [ ] You worked each problem by hand before checking.
- [ ] Your network/broadcast/range/count answers match the calculator.
- [ ] You can explain *why* two addresses are or aren't on the same subnet, in terms of the
      network bits.
- [ ] Your four-way split of the /24 is correct (hint: /26, and the blocks step by 64).

### Commit

`labs/05-subnetting.md` with your worked answers and short explanations. Redo it a week later
without notes — subnetting should become something you do in your head.

---

## Module 1 checkpoint

- [ ] I can explain the boot process from power button to login prompt (Lab 1)
- [ ] I can name the layer at which a given networking problem lives (Lessons 1.2, 1.4)
- [ ] I can subnet in my head for common prefixes (Lab 5)
- [ ] I can resolve a domain manually with `dig` and explain each step (Lab 3)
- [ ] I can capture and read a TCP handshake and a DNS query in Wireshark (Lab 4)
- [ ] I can explain what a TLS certificate does and doesn't prove (Lesson 1.4)

## Deliverable

**Your annotated packet-capture walkthrough** (Lab 4), published in your repo — a teaching
document that walks a reader through a real page load, protocol by protocol, proving you
understand the network from the wire up. Alongside it, your lab writeups form a small body of
evidence that you don't just *use* the internet, you understand how it works.

**Next module:** [Module 2 · Build the Server →](/modules/02-server/) — where the theory becomes
a real machine you own.
