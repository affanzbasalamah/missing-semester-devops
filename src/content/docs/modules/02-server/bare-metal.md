---
title: "Lesson 2.1 · Bare Metal"
description: UEFI/BIOS, creating install media, installing Debian headless, partitioning, and going monitor-free.
sidebar:
  label: "2.1 · Bare Metal"
---

Time to install an operating system on real hardware. This is a rite of passage: the first
time you turn a bare machine into a server you control, the abstractions from Module 1 —
firmware, bootloader, kernel, init — stop being words and become steps you perform. By the
end of this lesson your micro PC will be running Debian, sitting on a shelf with no monitor,
reachable only over SSH.

## Why Debian, and why headless

We use **Debian** (or Ubuntu Server, which is built on it) because it's stable, boring in the
best way, ubiquitous on real servers, and superbly documented. What you learn here transfers
directly to the servers you'll meet at work.

**Headless** means no monitor, keyboard, or mouse attached — you administer the machine
entirely over the network via SSH. Real servers are headless; they live in racks or on
shelves, and nobody plugs a screen into them. You'll attach a monitor and keyboard *only* for
the initial install, then unplug them for good. Going headless on your very first server
builds exactly the right instinct.

## Step 1 · Understand the firmware (UEFI/BIOS)

Recall the boot process from [Lesson 1.1](/modules/01-fundamentals/machine/): when you power
on, the motherboard's **firmware** (UEFI on any modern machine, older systems call it BIOS)
runs first. You need to get into it to tell the machine to boot from your USB stick.

- Power on and immediately, repeatedly press the firmware key. On the common micro PCs it's:
  **F1 or Enter** (Lenovo ThinkCentre), **F2 or F12** (Dell), **F10 or Esc** (HP). If you miss
  it, just reboot and try again.
- Inside, you're looking for two things:
  - **Boot order / boot menu** — so you can boot from USB. Many machines also offer a
    one-time boot menu (often **F12**) so you don't have to change the permanent order.
  - **Secure Boot** — a feature that only lets signed bootloaders run. Modern Debian/Ubuntu
    handle Secure Boot fine, so you can usually leave it on. If the installer won't boot,
    temporarily disabling Secure Boot is the first thing to try.

:::note[This is Lesson 1.1, live]
POST → firmware → boot device → bootloader is exactly the sequence you narrated in
[Lab 1.1](/modules/01-fundamentals/labs/#lab-1--boot-narration). You're now standing inside
step 1 of it, choosing which device the firmware hands control to.
:::

## Step 2 · Create the install media

On your laptop, download the installer and write it to the USB stick.

1. Download the **Debian netinst ISO** (a small "network install" image) from
   [debian.org](https://www.debian.org/distrib/) — get the 64-bit (amd64) version for an x86
   micro PC.
2. Write it to the USB stick. Writing an ISO is *not* copying a file — it must be written
   byte-for-byte to the raw device. The safe, friendly tool is **[balenaEtcher](https://etcher.balena.io/)**
   (works on macOS, Windows, Linux): select the ISO, select the USB device, flash.

   The command-line way (Linux/macOS), for when you're comfortable — **triple-check the device
   name**, because writing to the wrong disk destroys it:
   ```sh
   lsblk                 # (Linux) identify your USB device, e.g. /dev/sdb
   diskutil list         # (macOS) identify your USB device, e.g. /dev/disk4
   # Then, VERY carefully, write to the whole device (not a partition):
   sudo dd if=debian-*.iso of=/dev/sdX bs=4M status=progress conv=fsync
   ```
   :::danger[`dd` is called "disk destroyer" for a reason]
   `dd` writes to whatever device you name, with no confirmation. Naming your laptop's own
   disk instead of the USB stick will erase your computer. Confirm the device with `lsblk` /
   `diskutil list` *immediately* before running it, and read the `of=` path out loud. When in
   doubt, use balenaEtcher, which won't let you pick your system disk.
   :::

## Step 3 · Boot the installer and install Debian

Plug the USB stick, monitor, keyboard, and **Ethernet cable** into the micro PC (use wired
Ethernet for the install — it's simpler and more reliable than WiFi). Power on, enter the boot
menu, and boot from the USB device.

Walk through the Debian installer. The choices that matter:

- **Language / location / keyboard** — set as you like.
- **Hostname** — name your server something memorable, e.g. `homelab` or `server01`. This name
  matters later (you'll give it a DNS name in Module 3).
- **Domain name** — you can leave blank or use something like `home.lan`.
- **Root password** — you may set one, but a cleaner approach is to **leave the root password
  blank**, which tells Debian to lock the root account and set up `sudo` for your user instead
  (the recommended, least-privilege setup you'll formalize in Lesson 2.2). If offered, choose
  this.
- **Create a user** — this is your everyday admin account. Pick a username (e.g. `alice`) and
  a strong password. This is the account you'll SSH in as.
- **Partitioning** — see the next section.
- **Software selection** — this is the crucial one for a server. **Deselect the desktop
  environment.** You want no GUI. Keep "SSH server" and "standard system utilities" checked.
  A server with a graphical desktop is wasted resources and extra attack surface.

### Partitioning: keep it simple, with one good choice

The installer offers guided partitioning. For your first server:

- Choose **"Guided – use entire disk"** (you're dedicating this machine to being a server).
- When asked about the partition scheme, **"All files in one partition"** is fine and simple
  for learning. If offered **LVM** (Logical Volume Management), taking it is a good idea —
  LVM lets you resize things later without repartitioning, which you'll appreciate in
  [Module 4](/modules/04-storage/). Don't stress the details here; you'll go deep on disks and
  filesystems in that module. For now: whole disk, LVM if offered, done.

Let the install finish, remove the USB stick when prompted, and reboot. The machine boots into
Debian and shows a text login prompt. You have a server.

## Step 4 · First login and finding the machine on the network

Log in at the console with the user you created. First, find the server's IP address so you
can reach it from your laptop:

```sh
ip addr            # look for your Ethernet interface (e.g. enp1s0) and its "inet" address
```

You'll see something like `inet 192.168.1.73/24` — that's the address your router's DHCP
handed out. Note it down.

### Give it a static address

DHCP addresses can change, which is annoying for a server you connect to constantly. You want
it to always have the same address. There are two ways, and you'll ultimately prefer the
second:

- **A DHCP reservation on the router** (the cleaner way) — you tell the router "always give
  *this* machine *this* address." You'll do exactly this in [Module 3](/modules/03-network/)
  when you control the router. For now, note the current IP.
- **A static IP configured on the server itself** — set it directly in the OS. On Debian this
  means editing the network config (e.g. `/etc/network/interfaces` or a systemd-networkd/netplan
  file, depending on setup). This works but is easy to get wrong and lock yourself out over,
  so if your router supports reservations, prefer that route in Module 3.

For this lesson, it's enough to know the current IP and that you'll make it permanent via a
router reservation in the next module. Just don't reboot your router repeatedly in the
meantime, or the address may change.

## Step 5 · Connect over SSH and go headless

From your laptop, using the key setup from [Lesson 0.2](/modules/00-toolkit/remote/):

```sh
ssh alice@192.168.1.73         # use your username and the server's IP
```

The first connection asks you to trust the host key fingerprint (say yes — recall Lesson 0.2).
You're now in. Add a shortcut to your `~/.ssh/config` so you never type the IP again:

```
Host homelab
    HostName 192.168.1.73
    User alice
    IdentityFile ~/.ssh/id_ed25519
```

Now `ssh homelab` connects. Copy your public key up so you can stop using the password (you'll
*enforce* key-only login in [Lesson 2.3](/modules/02-server/hardening/)):

```sh
ssh-copy-id homelab            # pushes your public key to the server
ssh homelab                    # this time, no password prompt
```

Once `ssh homelab` works from your laptop with your key, **unplug the monitor and keyboard.**
Your server is now headless — a box on a shelf that you fully control from your laptop. This is
what every server you'll ever run looks like.

:::tip[Do the rest of this module inside tmux]
From here on, when you run anything long on the server (system upgrades, installs), do it
inside **tmux** (from [Lesson 0.2](/modules/00-toolkit/remote/)): `ssh homelab`, then
`tmux new -s work`. If your WiFi blips, the job survives. This is the exact scenario tmux
exists for, and this module is where you start relying on it.
:::

## First thing: update the system

Before anything else, bring the system fully up to date:

```sh
sudo apt update                # refresh the list of available packages
sudo apt upgrade               # install available updates
```

You'll understand `apt` properly in the next lesson; for now, this is basic hygiene — a
freshly installed system is often already behind on security updates.

## Quick self-check

1. What does "headless" mean, and why is it the right way to run a server?
2. Why must you write the ISO to the USB with a tool like Etcher or `dd`, rather than just
   copying the file onto it?
3. During the Debian install, why do you deselect the desktop environment?
4. What's the risk that makes `dd` dangerous, and how do you guard against it?
5. Why does a server want a static IP (or DHCP reservation) rather than a normal DHCP lease?
6. What's the first thing you do after logging into a freshly installed system, and why?

**Next:** [Lesson 2.2 · Anatomy of a Running System →](/modules/02-server/anatomy/)
