---
title: "Lesson 0.3 · Editing Anywhere"
description: Enough vim to edit any config file on any server, plus a comfortable local editor workflow.
sidebar:
  label: "0.3 · Editing Anywhere"
---

Sooner or later you will SSH into a server to fix one line in a config file, and the only
editor installed will be **vim**. This happens constantly — a fresh Linux box, a minimal
container, a colleague's server. If you can't drive vim at a survival level, you're stuck.
This lesson gives you exactly that survival level (it's less than you fear), then sets up a
comfortable editor for the longer work you do on your own machine.

No editor wars here. The position of this curriculum is simple: **learn enough vim to never
be helpless on a remote box, and use whatever you like for everything else.**

## Why vim specifically

vim (or its ancestor vi) is installed on essentially every Unix system by default. It needs
no graphics and works over the slowest SSH connection. That universality is the whole reason
to learn it: it's the editor that is *always there*. You don't need to love it. You need to
not be afraid of it.

## The one concept that makes vim make sense: modes

Every confusing thing about vim comes from one idea beginners aren't told: vim has **modes**.
Unlike normal editors where typing inserts text, vim starts in a mode where the keys are
*commands*, not text.

- **Normal mode** (the default): keys move the cursor and run commands. This is where you
  navigate, delete, copy, and give orders. You return here by pressing `Esc`.
- **Insert mode**: keys type text, like a normal editor. You enter it with `i` and leave it
  with `Esc`.
- **Command-line mode**: for saving, quitting, and search-and-replace. You enter it by typing
  `:` from normal mode.

The mental model: **`Esc` gets you to safety (normal mode). `i` lets you type. `:` gives
orders.** When in doubt, press `Esc` and you're back on solid ground.

## The absolute survival kit

If you learn nothing else, learn this. It's enough to edit any file:

```
Opening:
  vim file.txt        open a file

Entering insert mode (to type text):
  i                   insert before the cursor
  a                   insert after the cursor
  o                   open a new line below and insert

Getting back to safety:
  Esc                 return to normal mode — press this whenever unsure

Saving and quitting (from normal mode, these start with :):
  :w                  write (save)
  :q                  quit
  :wq                 write and quit
  :q!                 quit WITHOUT saving (discard changes) — the escape hatch
```

That's the survival kit. `vim file`, press `i`, type your change, press `Esc`, type `:wq`,
press Enter. You can now edit any config file on any server. Everything below makes you
faster, but this is enough to never be stuck.

:::tip[The famous "how do I exit vim" answer]
`Esc` then `:q!` then Enter quits and throws away changes. `Esc` then `:wq` then Enter saves
and quits. Memorize both — one gets you out safely, the other gets you out no matter what
mess you've made.
:::

## Moving around (normal mode)

Once you're comfortable saving and quitting, learn to navigate without arrow keys — it's
faster and works everywhere:

```
h j k l       left, down, up, right (the vim arrow keys)
w             jump forward one word
b             jump back one word
0             start of the line
$             end of the line
gg            top of the file
G             bottom of the file
:42           jump to line 42
Ctrl-d        scroll down half a page
Ctrl-u        scroll up half a page
```

## Editing (normal mode)

```
x             delete the character under the cursor
dd            delete (cut) the whole line
dw            delete to the end of the word
yy            yank (copy) the whole line
p             paste after the cursor
u             undo — your most important key after Esc
Ctrl-r        redo
r<char>       replace a single character
cc            change the whole line (deletes it and enters insert mode)
```

`u` for undo is the one to burn into your memory alongside `Esc`. Made a mess? `Esc`, then
`u` until it's fixed.

## Searching and replacing

```
/pattern      search forward for "pattern" (press n for next match, N for previous)
?pattern      search backward
:%s/old/new/g       replace every "old" with "new" in the whole file
:%s/old/new/gc      same, but ask for confirmation on each one
```

Search-and-replace (`:%s/.../.../g`) is genuinely useful for config edits — changing a port
number everywhere, updating a path. The `c` flag (confirm) is a good safety habit while you're
learning.

## A minimal .vimrc

vim reads `~/.vimrc` at startup, just like the shell reads `.bashrc`. A few lines make it much
friendlier. Put this in your dotfiles repo:

```vim
" ~/.vimrc
syntax on               " syntax highlighting
set number              " show line numbers
set expandtab           " use spaces, not tab characters
set tabstop=4           " a tab is 4 spaces wide
set shiftwidth=4        " indent by 4 spaces
set incsearch           " show search matches as you type
set ignorecase          " case-insensitive search...
set smartcase           " ...unless you type a capital letter
set hlsearch            " highlight all search matches
```

You don't need to understand every line. It makes vim show line numbers, highlight syntax, and
behave more like a modern editor. This file belongs in Lab 1's dotfiles repo.

## Practice, the fun way

The single best way to get comfortable is a game the vim community built for exactly this:

```sh
vimtutor       # a built-in, interactive 30-minute vim tutorial — just run it
```

`vimtutor` ships with vim. Run it once, follow along, and you'll have the survival kit in
muscle memory. Do this before Lab 5 (writing your first blog post), so you can write it in vim
if you like.

## Your local editor: use something comfortable

For the real work you do on your *own* machine — writing docs, editing many files, coding —
you want a full editor with a mouse, tabs, and extensions. The pragmatic, popular choice is
**VS Code**, and it has one feature that matters enormously for this curriculum:

### VS Code + Remote-SSH

The **Remote-SSH** extension lets VS Code open a folder *on a remote server* and edit it with
the full graphical editor — while the files stay on the server. You get vim's "edit files on
the box" reach with a comfortable GUI. Setup:

1. Install VS Code and the **Remote - SSH** extension.
2. It reads the same `~/.ssh/config` you built in Lesson 0.2 — your `homelab` shortcut just
   works.
3. Command palette → "Remote-SSH: Connect to Host" → pick `homelab`. VS Code opens as if the
   server's filesystem were local.

This is how a lot of real infrastructure work gets done: comfortable local editor, files and
execution on the remote server. But — and this is why vim still matters — when you're deep in a
broken server, or in a container, or on a box where you can't install anything, vim is what's
there. Learn both; reach for the right one.

## When to use which

| Situation | Reach for |
|---|---|
| Quick one-line fix on any server | **vim** — it's already there |
| A broken box, a container, a minimal system | **vim** — nothing else is installed |
| Writing your docs, editing many files, coding | **VS Code** (or your favorite) locally |
| Editing a project that lives on your server | **VS Code Remote-SSH** |

## Quick self-check

1. You opened a file in vim by accident and can't type normally. What's happening, and how do
   you start typing text?
2. You've made changes you want to throw away. How do you quit without saving?
3. How do you save and quit?
4. What does `u` do, and why is it your friend?
5. What's the one command that launches an interactive vim tutorial?

**Next:** [Lesson 0.4 · Git for Infrastructure People →](/modules/00-toolkit/git/)
