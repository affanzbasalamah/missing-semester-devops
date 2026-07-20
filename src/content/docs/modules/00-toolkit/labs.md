---
title: "Module 0 · Labs"
description: The five hands-on exercises that turn the Toolkit lessons into muscle memory and produce your first portfolio artifacts.
sidebar:
  label: Labs
---

These five labs turn the lessons into skill. Do them in order — each uses what the last one
built. By the end you'll have a public git repository containing your dotfiles, your lab
solutions, and your first blog post: the foundation your entire portfolio grows from.

Every lab lists **what to do**, **how to verify you did it right**, and **what to commit**.
Commit as you go — small commits with clear messages, exactly as [Lesson 0.4](/modules/00-toolkit/git/)
taught. The commit history itself is part of what's being graded (by future employers, if not
by anyone else).

:::note[Prerequisite]
You need a Unix-like shell (Linux, macOS, or WSL2 on Windows) and a free GitHub account with
your SSH public key added (from [Lesson 0.2](/modules/00-toolkit/remote/)). If `ssh -T git@github.com`
greets you by username, you're ready.
:::

---

## Lab 1 · Your dotfiles repo

**Goal:** create the public git repository that will grow for the entire curriculum, and put
your shell and editor configuration in it.

This lab exercises [Lesson 0.1](/modules/00-toolkit/shell/) (dotfiles),
[Lesson 0.4](/modules/00-toolkit/git/) (git), and [Lesson 0.3](/modules/00-toolkit/editing/)
(your `.vimrc`).

### Steps

1. On GitHub, create a new **public** repository named `dotfiles`. Don't initialize it with
   anything — you'll push your own.
2. On your machine, set it up:
   ```sh
   mkdir ~/dotfiles && cd ~/dotfiles
   git init
   ```
3. Create a `.gitignore` **first**, before anything else, so you never accidentally commit a
   secret. At minimum:
   ```
   *.key
   *.pem
   id_ed25519
   .env
   *.log
   .DS_Store
   ```
4. Copy your shell config and vim config into the repo:
   ```sh
   cp ~/.bashrc .    # or ~/.zshrc, whichever you use
   cp ~/.vimrc .     # from Lesson 0.3
   ```
5. Add at least **three useful aliases** to your copied shell config (e.g. `ll`, `gs` for
   `git status`, `..` for `cd ..`). Make them yours.
6. Write a `README.md` explaining what the repo is and how someone would use it to set up a new
   machine (apply [Lesson 0.5](/modules/00-toolkit/writing/)'s README structure).
7. Commit and push:
   ```sh
   git add .
   git commit -m "Add initial shell and vim dotfiles"
   git remote add origin git@github.com:YOUR_USERNAME/dotfiles.git
   git push -u origin main
   ```

### Verify

- [ ] The repo is visible publicly on GitHub with your README rendered.
- [ ] `.gitignore` exists and was committed, and no key or secret is anywhere in the repo.
- [ ] Your config files are present, with your custom aliases.
- [ ] `git log --oneline` shows clear, imperative commit messages.

### Commit

Everything above. This repo is now permanent — you'll add to it throughout the curriculum.

---

## Lab 2 · The pipeline puzzle

**Goal:** solve a real log-analysis problem using only shell pipes — no Python, no scripts.
This drills [Lesson 0.1](/modules/00-toolkit/shell/)'s pipes-and-filters skills until they're
reflex.

### Setup

Generate a sample log file to work with (this simulates a web server access log):

```sh
# Creates access.log with 10,000 lines of fake requests from random IPs
for i in $(seq 10000); do
  printf '10.0.%d.%d - - [20/Jul/2026] "GET /page%d HTTP/1.1" %d\n' \
    $((RANDOM % 5)) $((RANDOM % 255)) $((RANDOM % 100)) \
    $([ $((RANDOM % 10)) -eq 0 ] && echo 404 || echo 200)
done > access.log
```

### Tasks

Solve each using **only** pipes and the tools from Lesson 0.1 (`grep`, `awk`, `sort`, `uniq`,
`head`, `wc`, `cut`). Write your answer as a one-line command for each.

1. **Count the total number of requests** in the log.
2. **Count how many requests returned a 404** status.
3. **Find the top 10 IP addresses** by number of requests, with their counts.
4. **List every unique HTTP status code** that appears.
5. **Find the single busiest IP address** (just the address, no count).

<details>
<summary>Hints (try first, peek only if stuck)</summary>

- Task 1: `wc -l` counts lines.
- Task 2: `grep` for `" 404"` then count.
- Task 3: the classic pattern — `awk '{print $1}' | sort | uniq -c | sort -rn | head`.
- Task 4: the status is the last field; `awk '{print $NF}'`, then `sort -u`.
- Task 5: task 3's pipeline, but `head -n 1` and `awk` out just the address.

</details>

### Verify

- [ ] Every answer is a **single** command using only pipes and filters.
- [ ] No Python, Perl, or multi-line scripts.
- [ ] You can *explain* what each stage of your top-10 pipeline does.

### Commit

Create a file `labs/02-pipeline.md` in a new `missing-semester` repo (or a `labs/` folder in
your dotfiles repo). Record each task, your command, and a one-line explanation of how it works.
Explaining it is the point — a command you can't explain, you haven't learned.

---

## Lab 3 · The key ceremony

**Goal:** generate an SSH key, use it to authenticate to GitHub, and push over SSH. This makes
[Lesson 0.2](/modules/00-toolkit/remote/)'s key authentication real.

Most of you did the key generation in Lesson 0.2; this lab confirms the whole chain works and
documents it.

### Steps

1. If you haven't already, generate an ed25519 key:
   ```sh
   ssh-keygen -t ed25519 -C "your_email@example.com"
   ```
2. Confirm the private key is locked down:
   ```sh
   ls -l ~/.ssh/id_ed25519      # should show -rw------- (600)
   chmod 600 ~/.ssh/id_ed25519  # fix it if not
   ```
3. Load it into the agent:
   ```sh
   ssh-add ~/.ssh/id_ed25519
   ssh-add -l                    # confirm it's listed
   ```
4. Add the **public** key (`~/.ssh/id_ed25519.pub`) to GitHub → Settings → SSH and GPG keys.
5. Test the connection:
   ```sh
   ssh -T git@github.com
   # Expected: "Hi USERNAME! You've successfully authenticated..."
   ```
6. Make sure your `dotfiles` repo from Lab 1 uses the SSH remote (not HTTPS), then push a small
   change to prove passwordless push works:
   ```sh
   git remote -v      # origin should be git@github.com:..., not https://
   echo "" >> README.md && git commit -am "Test passwordless SSH push" && git push
   ```

### Verify

- [ ] `ssh -T git@github.com` authenticates you by username.
- [ ] Your private key is mode `600`; only you can read it.
- [ ] You pushed to GitHub without typing a password.
- [ ] Your private key is **not** in any git repo (check your `.gitignore`).

### Commit

Add a short `labs/03-ssh.md` documenting the steps you took and, importantly, **why key auth is
preferable to passwords** (from Lesson 0.2). Do not commit any key material.

---

## Lab 4 · tmux drill

**Goal:** prove to yourself that a tmux session survives a disconnect — the skill that will save
your Module 2 server install. Exercises [Lesson 0.2](/modules/00-toolkit/remote/)'s tmux section.

You can do this entirely on your local machine; you don't need a remote server yet. (If you have
access to any remote box, doing it there is even more convincing.)

### Steps

1. Start a named tmux session:
   ```sh
   tmux new -s drill
   ```
2. Inside it, start a long-running command that produces visible progress:
   ```sh
   for i in $(seq 1 300); do echo "tick $i"; sleep 1; done
   ```
3. **Detach** without stopping it: press `Ctrl-b`, release, then press `d`. You're back at your
   normal shell, but the loop is still running inside tmux.
4. Prove it's still there:
   ```sh
   tmux ls      # should list the "drill" session
   ```
5. (If remote: this is where you'd close your laptop / drop WiFi. Locally, just wait a few
   seconds and imagine it.)
6. **Re-attach** and confirm the counter kept going while you were detached:
   ```sh
   tmux attach -t drill
   # the tick counter is higher than when you left — it never stopped
   ```
7. Bonus: split the window (`Ctrl-b "` and `Ctrl-b %`) and move between panes (`Ctrl-b` +
   arrow keys) to get a feel for multiplexing.
8. Clean up: stop the loop (`Ctrl-c`), then exit the session (`exit` or `Ctrl-b` then `x`).

### Verify

- [ ] You detached from a session and it kept running (confirmed via `tmux ls`).
- [ ] On re-attach, the counter had advanced — proving the work survived the disconnect.
- [ ] You can create a session, detach, list, and re-attach without looking up the keys.

### Commit

Add `labs/04-tmux.md` with, in your own words, the scenario this protects against (a dropped
SSH connection killing a long job) and the exact commands to detach and re-attach. This is a
runbook you'll thank yourself for in Module 2.

---

## Lab 5 · Your first post

**Goal:** write and commit your first real piece of technical writing — the first entry in the
portfolio that will eventually get you hired. Exercises [Lesson 0.5](/modules/00-toolkit/writing/).

### The assignment

Write a blog post of **400–800 words** titled:

> **"What I Wish CS School Had Taught Me (and How I'm Fixing It)"**

Use it to reflect on the gap this curriculum addresses and what you intend to build. It's
personal and low-stakes — the point is to *practice writing and publishing*, not to produce a
masterpiece. You'll publish it for real on your own self-hosted server in Module 6; for now it
lives in your repo as Markdown.

### Requirements

Apply [Lesson 0.5](/modules/00-toolkit/writing/) deliberately:

- [ ] Written in **Markdown**, in a file like `blog/2026-07-20-missing-semester.md`.
- [ ] Uses **headings** to structure it — a reader should be able to skim it.
- [ ] Has a clear opening that **front-loads the point** (don't bury your thesis in paragraph 6).
- [ ] Uses at least one **list** and one **code block** or inline code where appropriate.
- [ ] Proofread. Read it out loud once — you'll catch the awkward sentences.

### A suggested shape

```markdown
# What I Wish CS School Had Taught Me

Opening: the gap you noticed — you can write code but couldn't
set up a server, read a network, or explain how the internet works.
State plainly what this post is about.

## The gap
What specifically was missing. Be concrete.

## What I'm doing about it
This curriculum. Your homelab plan. What you intend to build.

## What I expect to be hard
Honest predictions. (Great to revisit at the end — Module 9.)

## Why I'm documenting it in public
The closed-loop idea: the work and its proof in one place.
```

### Verify

- [ ] The post meets every requirement above.
- [ ] It renders cleanly (preview it in VS Code or on GitHub).
- [ ] It's committed with a clear message and pushed to your public repo.

### Commit

```sh
git add blog/
git commit -m "Add first blog post: What I wish CS school had taught me"
git push
```

Keep this post. In Module 9 you'll link back to it as the "before" snapshot of a six-month
journey — and it'll be one of the more satisfying things in your portfolio.

---

## Module 0 checkpoint

You've finished Module 0 when every box is ticked:

- [ ] I can navigate, search, and manipulate files entirely from the terminal (Lab 2)
- [ ] I can explain what a pipe does and chain 3+ commands to solve a real problem (Lab 2)
- [ ] I connect to remote machines with SSH keys only (Lab 3)
- [ ] I can edit a file in vim on a machine with no other editor installed (Lesson 0.3 / `vimtutor`)
- [ ] I understand tmux and can keep a job alive across a disconnect (Lab 4)
- [ ] My dotfiles live in a public git repo with a readable commit history (Lab 1)
- [ ] I've written and committed my first blog post in Markdown (Lab 5)

## Deliverable

A **public git repository** (or two — `dotfiles` and a `missing-semester` labs repo) containing:
your dotfiles with custom aliases and `.vimrc`, your five lab writeups, and your first blog post
— all with a clean, well-messaged commit history.

That repository is the seed of your portfolio. Everything from Module 1 onward gets committed to
it (or its self-hosted successor). When you reach the [showcase](/guides/showcase/), this is
where the story starts.

**Next module:** [Module 1 · How It Actually Works →](/modules/01-fundamentals/)
