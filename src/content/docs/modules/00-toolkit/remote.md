---
title: "Lesson 0.2 · Remote Work"
description: SSH keys, the SSH config file, tmux sessions that survive disconnects, and moving files between machines.
sidebar:
  label: "0.2 · Remote Work"
---

Servers don't have keyboards and monitors — you reach them over the network. The tool for
that is **SSH** (Secure Shell), and it is the single most important remote-work skill in this
curriculum. Every server you build from Module 2 onward, you'll administer entirely over SSH.
This lesson makes you fluent, and — critically — teaches you to use **keys instead of
passwords** from the very beginning.

## What SSH does

SSH gives you an encrypted terminal session on a remote machine. You type on your laptop, the
commands run on the server, and the output comes back — all over an encrypted connection that
nobody on the network can read. The basic form:

```sh
ssh username@hostname
ssh alice@192.168.1.50
ssh alice@server.home.lan
```

The first time you connect to a machine, SSH shows you its **host key fingerprint** and asks
if you trust it:

```
The authenticity of host 'server.home.lan' can't be established.
ED25519 key fingerprint is SHA256:abc123...
Are you sure you want to continue connecting (yes/no)?
```

This is SSH protecting you: it's asking "is this really the server you think it is?" You type
`yes`, and SSH remembers the fingerprint in `~/.ssh/known_hosts`. If that fingerprint ever
changes unexpectedly, SSH will loudly refuse to connect — which is exactly what you want, because
a changed key can mean someone is impersonating the server.

## Why keys, not passwords

You *can* SSH with a password, but you shouldn't, and in this curriculum you won't. Here's why:

- Passwords can be guessed or brute-forced. An internet-facing server sees thousands of login
  attempts a day (you'll watch this happen in Module 2's `fail2ban` logs).
- Keys are effectively impossible to brute-force.
- Keys let you log in without typing anything, which makes automation (Module 7) possible.

**Public-key authentication** works with a *pair* of keys:

- A **private key** that stays on your laptop and is never, ever shared. It's the secret.
- A **public key** that you copy to every server you want to log into. It's not secret — it's
  designed to be shared.

The math guarantees that only the holder of the private key can complete a login that the
public key authorizes. You prove who you are without ever sending a secret over the network.

## Generating your key

Do this once. Use the modern **ed25519** key type:

```sh
ssh-keygen -t ed25519 -C "your_email@example.com"
```

It asks where to save (accept the default, `~/.ssh/id_ed25519`) and for a **passphrase**.

:::tip[Use a passphrase]
The passphrase encrypts your private key on disk, so a stolen laptop doesn't hand over your
key. You won't have to type it every time — `ssh-agent` (below) remembers it for your session.
Set one.
:::

You now have two files:

| File | What it is | Secrecy |
|---|---|---|
| `~/.ssh/id_ed25519` | Your **private** key | **Never share. Never commit to git.** |
| `~/.ssh/id_ed25519.pub` | Your **public** key | Safe to share and copy everywhere |

Check the private key's permissions — SSH refuses to use a key others can read:

```sh
chmod 600 ~/.ssh/id_ed25519
```

## Getting your public key onto a server

The easy way, if the server already accepts password login:

```sh
ssh-copy-id alice@server.home.lan
```

This appends your public key to `~/.ssh/authorized_keys` on the server. From then on, SSH
uses your key automatically — no password.

The manual way (good to understand, because sometimes `ssh-copy-id` isn't available): copy the
contents of `~/.ssh/id_ed25519.pub` and add it as a new line in the server's
`~/.ssh/authorized_keys` file.

For **GitHub** (which you'll need for Lab 1), you paste the public key into
**Settings → SSH and GPG keys** in the web interface. Print it to copy:

```sh
cat ~/.ssh/id_ed25519.pub
```

## ssh-agent: type your passphrase once

`ssh-agent` is a small program that holds your decrypted private key in memory so you only
type the passphrase once per session:

```sh
eval "$(ssh-agent)"            # start the agent (often already running)
ssh-add ~/.ssh/id_ed25519     # add your key; enter the passphrase now
ssh-add -l                    # list keys the agent currently holds
```

On macOS the agent starts automatically and can store your passphrase in the Keychain. On
Linux, adding `ssh-add` logic to your dotfiles (or letting your desktop's keyring handle it)
achieves the same. The payoff: you log into a dozen servers without typing anything.

## The SSH config file: stop retyping everything

Typing `ssh alice@192.168.1.50 -p 2222 -i ~/.ssh/id_ed25519` every time is miserable. The
file `~/.ssh/config` lets you define named shortcuts:

```
# ~/.ssh/config

Host homelab
    HostName 192.168.1.50
    User alice
    Port 22
    IdentityFile ~/.ssh/id_ed25519

Host github.com
    User git
    IdentityFile ~/.ssh/id_ed25519
```

Now `ssh homelab` does the whole thing. You'll accumulate an entry per machine as your lab
grows. Set the file's permissions too:

```sh
chmod 600 ~/.ssh/config
```

### Jump hosts

Once your network has segments (Module 3), some servers won't be directly reachable — you'll
reach them *through* another machine. SSH does this natively:

```
Host internal-server
    HostName 10.0.20.5
    User alice
    ProxyJump homelab
```

`ssh internal-server` now transparently hops through `homelab` first. You'll appreciate this
when your servers live on an isolated VLAN.

## Running commands and copying files over SSH

You don't have to open an interactive session. SSH can run a single command and return:

```sh
ssh homelab "df -h"                    # check disk space on the server, one shot
ssh homelab "sudo systemctl restart nginx"
```

And you can move files:

```sh
# scp — simple copy over SSH
scp file.txt homelab:~/                # laptop → server home directory
scp homelab:~/backup.tar.gz .          # server → current directory on laptop
scp -r mydir homelab:~/                # copy a whole directory (-r)

# rsync — smarter copy: only transfers differences, resumable, essential for backups
rsync -av mydir/ homelab:~/mydir/      # sync a directory (archive mode, verbose)
rsync -av --delete src/ homelab:~/dst/ # make dst identical to src (deletes extras)
```

`rsync` is the one to really learn — it only copies what changed, so re-running it is cheap.
It's the backbone of many backup systems, and you'll meet it again in Module 4.

## tmux: sessions that survive disconnects

Here's a scenario that will bite you: you SSH into a server, start a long job (a big download,
a system upgrade), and your laptop's WiFi drops. The SSH connection dies — and takes your job
with it. Everything you were running is gone.

**tmux** (terminal multiplexer) solves this. It runs a shell session *on the server* that
keeps going even when you disconnect. You "attach" to it when you connect and "detach" when you
leave; the session and everything in it persists.

```sh
tmux                    # start a new tmux session
tmux new -s deploy      # start a named session ("deploy")
tmux ls                 # list running sessions
tmux attach -t deploy   # re-attach to the "deploy" session
```

Inside tmux, you control it with a **prefix key** — `Ctrl-b` by default — followed by another
key:

| Keys | Action |
|---|---|
| `Ctrl-b` then `d` | **Detach** — leave the session running, return to your normal shell |
| `Ctrl-b` then `c` | Create a new window |
| `Ctrl-b` then `n` / `p` | Next / previous window |
| `Ctrl-b` then `"` | Split the pane horizontally |
| `Ctrl-b` then `%` | Split the pane vertically |
| `Ctrl-b` then arrow | Move between panes |

The workflow that saves you: `ssh homelab`, then `tmux new -s work`, start your long job,
press `Ctrl-b d` to detach, close your laptop and walk away. Later: `ssh homelab`,
`tmux attach -t work`, and your job is right where you left it — finished or still running.

:::tip[This is not optional in Module 2]
When you're doing a long system install or upgrade on your server, running it inside tmux is
the difference between "my WiFi blipped, no problem" and "my WiFi blipped and now my server is
half-upgraded and broken." Build the habit now.
:::

## Common problems and how to read them

- **`Permission denied (publickey)`** — the server didn't accept your key. Check that your
  public key is in the server's `~/.ssh/authorized_keys`, and that `ssh-add -l` shows your key
  loaded in the agent.
- **`Connection refused`** — nothing is listening on that port. The SSH service isn't running,
  or you have the wrong port, or a firewall is blocking it.
- **`Connection timed out`** — you can't reach the host at all. Wrong IP, machine is off, or a
  network/routing problem. This is a *lower layer* problem (recall Module 1's layers).
- **`Host key verification failed`** — the server's fingerprint changed. If you know why (you
  rebuilt the server), remove the old entry: `ssh-keygen -R hostname`. If you don't know why,
  **stop and investigate** — this is exactly the warning you should never blindly click past.

Learning to tell these four apart — and knowing they map to different layers of the stack —
is a genuine diagnostic skill that will serve you through every later module.

## Quick self-check

1. What are the two files in an SSH key pair, and which one may you share?
2. Why is key authentication better than password authentication for a server?
3. What does `Ctrl-b d` do in tmux, and why does it matter?
4. You get `Connection refused` on port 22. Name two possible causes.
5. What does `~/.ssh/config` let you avoid retyping?

**Next:** [Lesson 0.3 · Editing Anywhere →](/modules/00-toolkit/editing/)
