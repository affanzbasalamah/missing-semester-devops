---
title: "Lesson 1.1 · The Machine"
description: What a computer actually does when it runs your code — boot, the OS, kernel vs. user space, and resource triage.
sidebar:
  label: "1.1 · The Machine"
---

Before you can run servers, you need an accurate picture of what a computer *is* underneath
the applications. Not a deep hardware course — you don't need to design a CPU — but a working
model of what happens between pressing the power button and a program producing output. This
model is what lets you answer the question every operator asks daily: *"why is it slow / broken
/ using all the memory?"*

## The parts, and what they're for

A computer is four kinds of thing working together:

- **CPU** (processor) — executes instructions, billions per second. It does arithmetic, moves
  data around, and makes decisions. It's fast but has almost no memory of its own.
- **RAM** (memory) — fast, temporary working space. Everything the CPU is actively working on
  lives here: running programs, open files, the OS itself. **RAM is wiped when power is lost.**
- **Storage** (SSD/HDD) — slow, permanent. This is where files and programs live when they're
  not running. Persists across reboots.
- **Buses & I/O** — the wiring connecting it all, plus network cards, USB, etc.

The single most important relationship: **the CPU can only work on data that's in RAM.** To run
a program, the computer copies it from slow storage into fast RAM, and the CPU works on it
there. This is why "how much RAM" is the spec that most determines how many things a server can
run at once — and why the [hardware guide](/guides/hardware/) told you to prioritize 16 GB.

### A speed intuition worth having

The speed gaps between these are enormous, and they explain most performance problems:

| Operation | Relative time (if a CPU cycle were 1 second) |
|---|---|
| CPU does one instruction | 1 second |
| Read from RAM | ~minutes |
| Read from SSD | ~days |
| Read from spinning HDD | ~months |
| Round-trip over the network | ~years |

You don't need the exact numbers. You need the *shape*: RAM is far slower than the CPU, storage
is far slower than RAM, and the network is slower still. When something is slow, it's almost
always because it's waiting on one of the slower layers — usually disk or network, not CPU.

## The boot process: power button to login prompt

When you press power, a precise sequence unfolds. Knowing it means that when a machine won't
boot, you know *where in the chain* to look.

1. **Firmware (UEFI/BIOS) runs.** A tiny program baked into the motherboard wakes up. It does
   **POST** (Power-On Self-Test — checks RAM, CPU, devices), then looks at its configured
   **boot order** to find a bootable device.
2. **The bootloader loads.** From that device (your SSD), the firmware runs a small program
   called a **bootloader** (on Linux, usually **GRUB**). Its job is to find and start the
   operating system kernel. This is where you'd pick between OSes or kernel versions.
3. **The kernel starts.** The bootloader loads the **kernel** — the core of the operating
   system — into RAM and hands control to it. The kernel initializes hardware, mounts the root
   filesystem, and starts detecting devices.
4. **init / systemd takes over.** The kernel starts one first process (PID 1). On modern Linux
   that's **systemd**. It starts everything else: system services, networking, and eventually
   the login prompt. (You'll live inside systemd in Module 2.)
5. **Login prompt / services ready.** The machine is now up. On a server, this means the login
   prompt and all your services (SSH, web server) are running.

:::tip[Why this matters for Module 2]
When you install Linux on your micro PC and it won't boot, the fix depends entirely on *which
step failed*. No POST? Hardware/RAM. POST but no bootloader? Boot-order or a broken GRUB. Kernel
panics? A driver or filesystem problem. systemd hangs? A misconfigured service. The five steps
are a diagnostic map, and [Lab 1](/modules/01-fundamentals/labs/#lab-1--boot-narration) has you
draw it.
:::

## What an operating system actually does

The **operating system** (OS) is the software layer between your programs and the hardware. Its
job is to be a *manager* and a *translator* so that programs don't each have to know the intimate
details of your specific hardware. It manages four things:

- **Processes** — running programs, and sharing the CPU between them.
- **Memory** — handing out RAM to programs and keeping them from stepping on each other.
- **Filesystems** — organizing storage into files and directories.
- **Devices** — talking to disks, network cards, and peripherals through **drivers**.

### Processes: running programs

A **process** is a program that is currently running, with its own slice of memory and its own
PID. The OS rapidly switches the CPU between many processes — so fast it looks simultaneous. This
is why one computer can run a web server, a database, and your SSH session "at the same time" on
a handful of CPU cores. You met process tools in Module 0 (`ps`, `top`, `kill`); now you know
what they're showing you — the OS's list of running programs and the resources each holds.

### Memory: the RAM manager

The OS gives each process its own private view of memory (**virtual memory**), so a bug in one
program can't corrupt another. When RAM fills up, the OS can move less-used data temporarily to
disk (**swap**) — which works but is *slow* (remember the speed table), so heavy swapping is a
classic cause of "why is the server crawling."

## Kernel space vs. user space

This is a concept that pays off constantly. The OS divides the world into two privilege levels:

- **Kernel space** — where the kernel runs, with full, direct access to all hardware. Powerful
  and dangerous; a bug here can crash the whole machine (a "kernel panic").
- **User space** — where your applications run, walled off from the hardware and from each other.
  A crashing app here just dies; it doesn't take the system down.

So how does a user-space program — say, a web server — actually read a file or send a network
packet, if it can't touch the hardware directly? It asks the kernel, through a **system call**
(**syscall**). "Please read this file." "Please send these bytes on the network." The kernel
checks permissions, does the privileged operation, and hands back the result.

This boundary is why Unix permissions and `sudo` matter, why containers can isolate applications
(Module 6), and why "the server is up but the app is down" is a coherent state — the kernel is
fine, a user-space process died. Keep this two-level picture in mind; it reappears everywhere.

## Resource triage: the four things to check

Here's the immediately practical payoff. When a server (or your laptop) is slow or unhappy, the
cause is almost always one of **four resources** being exhausted. A professional checks all four,
in order, before guessing. Learn these commands now; you'll run them on every server you own.

### 1. CPU — is it doing too much thinking?

```sh
top            # live view; look at the load average and %CPU per process
htop           # nicer version (install in Module 2)
uptime         # the three "load average" numbers (1, 5, 15 min)
```

**Load average** roughly means "how many processes were waiting to run." A rule of thumb: if the
load average is consistently higher than your number of CPU cores, the CPU is a bottleneck.

### 2. Memory — is it out of RAM?

```sh
free -h        # -h = human-readable; look at "available", not just "free"
```

The number that matters is **available** memory. If it's near zero and swap is filling, the
system is thrashing — that's your problem. (Linux uses "free" RAM for disk cache on purpose, so
low "free" alone is normal and fine; trust "available.")

### 3. Disk — is storage full or overloaded?

```sh
df -h          # disk space per filesystem — is anything at 100%?
du -sh *       # how big is each thing in the current directory?
iostat         # disk I/O activity (is the disk saturated?)
```

A full disk (`df` showing 100%) breaks things in confusing ways — services can't write logs,
databases corrupt, deploys fail. It's one of the most common real-world server problems, and
one of the easiest to diagnose once you know to look.

### 4. Network — is the connection the bottleneck?

```sh
ss -tunlp      # what's listening and what's connected (the modern netstat)
ping host      # is the host reachable, and how fast?
```

You'll go deep on network diagnosis in the next lessons. For triage, the point is just to *rule
it in or out* as the cause.

:::note[The method, not just the commands]
The skill isn't memorizing commands — it's the *habit*: when something's wrong, check CPU,
memory, disk, and network **before** forming a theory. Half of all "mysterious" server problems
are just one of these four resources quietly maxed out. The other half start making sense once
you've ruled these four out. This is the single most useful troubleshooting reflex in operations.
:::

## Putting it together

You now have the mental model the rest of the curriculum stands on: a CPU that only works on
what's in RAM, an OS that manages processes and memory and mediates hardware access through
syscalls across a kernel/user-space boundary, a boot sequence you can use as a diagnostic map,
and a four-resource triage method for when things go wrong. Everything you build from Module 2
onward is *this*, running on hardware you own.

## Quick self-check

1. Why is "how much RAM" often the spec that most limits how much a server can do?
2. Put these in order from fastest to slowest: SSD read, network round-trip, RAM read, CPU
   instruction.
3. Name the five stages of boot, from power button to login prompt.
4. What is a system call, and why can't a normal program just talk to the hardware directly?
5. A server is slow. What four resources do you check, and with what commands?
6. `df -h` shows a filesystem at 100%. Why might that break a service that seems unrelated to
   disk space?

**Next:** [Lesson 1.2 · TCP/IP, Layer by Layer →](/modules/01-fundamentals/tcpip/)
