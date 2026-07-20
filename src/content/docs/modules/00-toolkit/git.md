---
title: "Lesson 0.4 · Git for Infrastructure People"
description: Version control from first principles — commits, branches, remotes, and what must never go in git.
sidebar:
  label: "0.4 · Git"
---

Git is the backbone of everything you'll do in this curriculum. Every config you write, every
note you take, every lab you finish gets committed. By the end, your commit history is a
timestamped, verifiable record of six months of real work — the thing no certificate can fake.
This lesson teaches git the way infrastructure people actually use it: not as an academic
tool, but as the source of truth for your systems.

Most graduates have "used git" — meaning they memorized `git add`, `git commit`, `git push`
for a class and never understood what any of it meant. We're going to fix the understanding,
because in Module 7 the entire configuration of your homelab will live in git, and "it's in
git" will become "it's real."

## What git actually is

Git is a **version control system**: it records snapshots of your files over time, so you can
see what changed, when, and why — and go back to any previous state. Think of it as an
infinite, structured undo history for an entire project, shared across machines and people.

Three ideas unlock everything:

1. A **repository** ("repo") is a project folder that git is tracking. It contains your files
   plus a hidden `.git` directory holding the entire history.
2. A **commit** is a saved snapshot of your files at a moment in time, with a message
   explaining what changed and why. History is a chain of commits.
3. A **remote** is a copy of the repo hosted elsewhere (GitHub now, your own git server in
   Module 6) that you sync with, so your work is backed up and shareable.

## One-time setup

Tell git who you are — this stamps every commit you make:

```sh
git config --global user.name "Your Name"
git config --global user.email "your_email@example.com"
git config --global init.defaultBranch main    # name the first branch "main"
git config --global core.editor vim            # or "code --wait" for VS Code
```

The `--global` flag sets these for every repo on your machine. You do this once.

## The mental model: three areas

This is the concept that makes git click. Your files move through three areas:

```
Working directory  →  Staging area  →  Repository
   (your edits)        (git add)        (git commit)
```

- **Working directory**: your actual files, where you edit. Changes here are not yet tracked
  by a commit.
- **Staging area** (also called the "index"): a holding area where you assemble exactly what
  the next commit will contain. `git add` moves changes here.
- **Repository**: the permanent history. `git commit` takes everything staged and records it
  as a new snapshot.

Why the middle step? Because it lets you commit *selectively* — you might make five changes but
commit only three of them together as one logical unit, then commit the other two separately.
This is how you keep history clean and meaningful.

## The core loop

This is the cycle you'll repeat thousands of times:

```sh
git status              # what's changed? what's staged? — run this constantly
git add file.txt        # stage a specific file
git add .               # stage everything changed in the current directory
git commit -m "Add nginx config for reverse proxy"   # snapshot the staged changes
git log                 # view the history of commits
git log --oneline       # compact one-line-per-commit view
```

`git status` is your compass — run it before and after everything until git feels natural. It
always tells you what state you're in and usually suggests the command you want next.

### Starting a repo

Two ways to get a repository:

```sh
# Option A: turn an existing folder into a repo
cd my-project
git init

# Option B: copy an existing remote repo to your machine
git clone git@github.com:username/repo.git
```

## Seeing what changed

Before you commit, look at exactly what you're about to record:

```sh
git diff                # changes in your working directory not yet staged
git diff --staged       # changes you've staged, ready to commit
git show                # the full contents of the most recent commit
```

Reviewing your own diff before committing is a professional habit. It catches the secret you
accidentally left in a file (more on that below), the debug line you meant to remove, the typo.

## Writing commit messages a stranger can follow

Your commit history is documentation. Future-you, and anyone reviewing your work (including
employers looking at your public repo), reads these messages. The widely-used convention:

- A short **summary line** (≤ 50 characters), in the imperative mood: "Add", "Fix", "Update",
  not "Added" or "Fixes".
- If more explanation is needed, a blank line, then a **body** explaining *why*, not just what.

```
Add fail2ban config to block SSH brute-force

The server was seeing thousands of login attempts per day in the
auth log. This bans an IP for 1 hour after 5 failed attempts.
```

Compare that to the commit messages you'll be tempted to write — "stuff", "fix", "asdf", "更新".
Those are invisible to your future self. Good messages are a small discipline that compounds
into a genuinely useful history.

:::tip[Commit small, commit often]
A commit should be one logical change. "Configure the firewall" is a good commit. "A week of
random edits" is not. Small commits give you a precise history and precise undo. When a lab
says "commit your work," it means commit at each meaningful step, not one giant blob at the end.
:::

## Working with remotes: GitHub for now

A **remote** is a hosted copy of your repo. You'll use GitHub through Module 5, then migrate to
your own self-hosted Forgejo/Gitea server in Module 6 (a satisfying moment — your code leaves
someone else's servers for hardware you built).

```sh
git remote -v                                   # show configured remotes
git remote add origin git@github.com:you/repo.git   # link a remote named "origin"
git push -u origin main                         # push your commits (first time: -u sets tracking)
git push                                        # subsequent pushes
git pull                                         # fetch and merge changes from the remote
git clone git@github.com:you/repo.git           # copy a remote repo to a new machine
```

Note we use the **SSH** URL (`git@github.com:...`), which uses the key you made in Lesson 0.2 —
no passwords. That's why Lesson 0.2 had you add your public key to GitHub.

## Branches: parallel lines of work

A **branch** is an independent line of development. You make changes on a branch without
affecting `main`, then **merge** them back when they're ready. Even as a solo learner, branches
are worth understanding because they're how all real collaboration works — and how you'll
propose changes to *this* site's repo for the showcase.

```sh
git branch                      # list branches (* marks the current one)
git switch -c new-feature       # create and switch to a new branch
git switch main                 # switch back to main
git merge new-feature           # merge new-feature's changes into the current branch
git branch -d new-feature       # delete a branch once it's merged
```

The workflow: branch off `main`, do your work in commits, switch back to `main`, merge. If two
branches changed the same lines, git can't decide automatically and reports a **merge
conflict**.

## Merge conflicts: not scary, just annoying

A conflict happens when two branches changed the same lines and git needs you to choose. Git
marks the conflict in the file like this:

```
<<<<<<< HEAD
the version currently on your branch
=======
the version from the branch you're merging in
>>>>>>> new-feature
```

To resolve: open the file, edit it so it reads the way you want (delete the `<<<`, `===`, `>>>`
marker lines and keep the correct content), then:

```sh
git add the-conflicted-file
git commit          # completes the merge
```

That's the whole process. Conflicts feel alarming the first time and routine by the fifth.
`git status` walks you through it.

## What must NEVER go in git

This is the most important rule in the lesson, and it gets its own dedicated treatment in
Module 8. **Secrets do not belong in git.** Not passwords, not private keys, not API tokens,
not certificates' private halves.

Why it's serious: git history is *permanent and distributed*. If you commit a secret and push
it, deleting it in a later commit does **not** remove it — it's still in the history, on
GitHub, and in every clone. Anyone who has ever cloned the repo has it. The only real fix is to
**rotate the secret** (invalidate it and issue a new one), which is why Module 8 drills that.

The defense is a **`.gitignore`** file — a list of paths git should never track:

```
# .gitignore

# Secrets and keys — never commit these
*.key
*.pem
id_ed25519
secrets.yml
.env

# Noise
*.log
node_modules/
.DS_Store
```

Create `.gitignore` in the root of every repo *before* your first commit, and add anything
sensitive to it immediately. When you build configs in later modules, the pattern will be:
commit a `config.example.yml` with placeholders, gitignore the real `config.yml` with the
secrets. You'll see this exact pattern throughout the curriculum.

:::danger[Assume any pushed secret is compromised]
If you ever push a real secret by accident, don't just delete it in a new commit and hope.
**Rotate it** — change the password, revoke the token, regenerate the key. Treat it as leaked,
because it is. This reflex is worth building now, on a throwaway secret, rather than during a
real incident.
:::

## Undoing things

Everyone needs these eventually:

```sh
git restore file.txt              # discard uncommitted changes to a file (revert to last commit)
git restore --staged file.txt     # unstage a file (keep the changes, just un-add them)
git commit --amend                # fix the most recent commit (message or forgotten file)
git revert <commit>               # make a NEW commit that undoes an old one (safe, keeps history)
git reset --hard <commit>         # DANGER: move the branch back, discarding commits after it
```

`git revert` is the safe way to undo a public commit — it adds a new "undo" commit rather than
rewriting history. `git reset --hard` throws work away and rewrites history; only use it on
commits you haven't shared, and only when you're sure.

## Why this is the backbone

Step back and see where this goes. Right now git holds your dotfiles and lab notes. But:

- In **Module 3**, your network configs live in git.
- In **Module 6**, you host your *own* git server and move everything onto it.
- In **Module 7**, your *entire homelab's configuration* lives in git as Ansible code — the repo
  becomes the source of truth, and the servers are made to match it. That's "GitOps," and it's
  how modern infrastructure is run.

Every commit you make in this module is practice for treating infrastructure as version-controlled
code. The habit you build here — commit small, write clear messages, never commit secrets — is
the same habit that runs production systems at real companies.

## Quick self-check

1. Explain the three areas: working directory, staging area, repository. What moves things
   between them?
2. Why does deleting a secret in a new commit *not* fix a leaked secret?
3. What is a `.gitignore` file for, and when should you create it?
4. What's the difference between `git revert` and `git reset --hard`?
5. Write a good commit message (summary line) for adding an SSH hardening config.
6. Why does this curriculum use the SSH remote URL instead of HTTPS?

**Next:** [Lesson 0.5 · Writing Is a Superpower →](/modules/00-toolkit/writing/)
