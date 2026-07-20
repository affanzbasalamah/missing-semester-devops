---
title: "Lesson 0.1 · The Shell"
description: What a shell actually is, and how to navigate, inspect, and manipulate a Unix system from it.
sidebar:
  label: "0.1 · The Shell"
---

The graphical desktop is a convenience layer painted on top of something older and more
powerful. Underneath every server, container, and cloud instance you will ever manage is a
**shell** — a text program that reads commands and runs them. DevOps and security work
happens here, because servers usually have no screen at all. This lesson makes the shell
feel like home.

## What a shell actually is

When you open a terminal, a program starts running inside it called a **shell**. The most
common is **bash**; macOS ships **zsh** (which is bash-compatible for everything here). The
shell's job is a loop:

1. Print a **prompt** (often ending in `$`).
2. Wait for you to type a **command** and press Enter.
3. Find the program you named, run it with the arguments you gave, show its output.
4. Go back to step 1.

That's it. Everything else is detail. A command line like this:

```sh
ls -l /etc
```

means: run the program `ls`, pass it the **option** `-l` (long format) and the **argument**
`/etc` (which directory to list). The shell finds the `ls` program, starts it, and shows you
what it prints.

:::note[Shell vs. terminal]
The **terminal** is the window. The **shell** is the program running inside it. People use
the words loosely, but knowing the difference helps when things break: a frozen window is a
terminal problem; a command that misbehaves is a shell or program problem.
:::

## Where am I? Navigating the filesystem

A Unix filesystem is a single tree starting at `/` (the **root**). Everything — every disk,
every file — hangs off that one root. There are no `C:` or `D:` drives.

```sh
pwd           # "print working directory" — where am I right now?
ls            # list files in the current directory
ls -l         # long format: permissions, owner, size, date
ls -la        # also show hidden files (names starting with .)
cd /etc       # change directory to /etc (absolute path — starts at /)
cd nginx      # change into ./nginx (relative path — starts from here)
cd ..         # go up one level to the parent directory
cd ~          # go to your home directory (~ is shorthand for it)
cd -          # go back to the previous directory you were in
cd            # with no argument, also goes home
```

**Absolute vs. relative paths** is the single most common beginner confusion:

- An **absolute path** starts with `/` and is understood from the root: `/etc/nginx/nginx.conf`.
  It means the same thing no matter where you are.
- A **relative path** is understood from your current directory: `nginx/nginx.conf` means
  "starting from where I am now."
- `.` means "here", `..` means "the parent directory", `~` means "my home directory".

Special locations worth memorizing:

| Path | What it is |
|---|---|
| `/` | The root of everything |
| `~` or `/home/you` | Your home directory |
| `/etc` | System configuration files |
| `/var/log` | Log files |
| `/tmp` | Temporary files (wiped on reboot) |
| `/usr/bin`, `/bin` | Installed programs |

## Looking at files

```sh
cat file.txt          # dump the whole file to the screen
less file.txt         # page through a file (q to quit, / to search)
head file.txt         # first 10 lines
head -n 20 file.txt   # first 20 lines
tail file.txt         # last 10 lines
tail -f app.log       # follow a log file live as it grows — you'll use this constantly
wc -l file.txt        # count lines
file mystery          # guess what kind of file something is
stat file.txt         # detailed metadata: size, timestamps, permissions
```

`tail -f` is worth calling out: it keeps running and prints new lines as they're appended.
When you're watching a server do something, this is how you see it happen in real time.
Press `Ctrl-C` to stop it.

## Creating, copying, moving, deleting

```sh
mkdir project              # make a directory
mkdir -p a/b/c             # make nested directories, creating parents as needed
touch notes.txt            # create an empty file (or update its timestamp)
cp source.txt dest.txt     # copy a file
cp -r dir1 dir2            # copy a directory and everything in it (-r = recursive)
mv old.txt new.txt         # rename (move) a file
mv file.txt ~/archive/     # move a file into another directory
rm file.txt                # delete a file
rm -r directory            # delete a directory and its contents
rmdir empty-dir            # delete an empty directory
```

:::danger[`rm` does not have a trash can]
`rm` deletes immediately and permanently. There is no undo, no recycle bin. `rm -rf /` or a
mistyped `rm -rf $VAR/` where `$VAR` is empty can erase a system. Habits that save you:

- Pause before every `rm -r`. Read the path out loud.
- Prefer `rm -i` (interactive — asks before each delete) while you're learning.
- Never run `rm` with a variable in the path without checking the variable isn't empty.
:::

## Globbing: matching many files at once

The shell expands **wildcards** into lists of matching filenames *before* the command runs:

```sh
ls *.txt          # everything ending in .txt
ls log-2026-*.txt # everything matching that pattern
ls report-?.pdf   # ? matches exactly one character: report-1.pdf, report-a.pdf
ls {jpg,png}      # brace expansion: expands to jpg png
cp *.conf backup/ # copy every .conf file into backup/
```

`*` matches any number of characters, `?` matches exactly one. This is *globbing*, done by
the shell — the program you're running never sees the `*`, only the final list of names.

## Permissions: who can do what

Every file has an **owner**, a **group**, and a set of **permissions** for three classes of
user: the owner, the group, and everyone else ("others"). Run `ls -l` and you'll see them:

```
-rwxr-xr--  1  alice  devs  4096  Jul 20 09:00  deploy.sh
```

Read the permission block `-rwxr-xr--` in four parts:

- First character: `-` a regular file, `d` a directory, `l` a symbolic link.
- Next three (`rwx`): what the **owner** (alice) can do — **r**ead, **w**rite, e**x**ecute.
- Next three (`r-x`): what the **group** (devs) can do — read and execute, not write.
- Last three (`r--`): what **others** can do — read only.

Changing them:

```sh
chmod +x script.sh        # add execute permission (make a script runnable)
chmod -x script.sh        # remove execute permission
chmod 644 file.txt        # owner read/write, group + others read (common for files)
chmod 600 secret.key      # owner read/write only — nobody else (use for keys!)
chmod 755 script.sh       # owner all, group + others read/execute (common for scripts)
chown alice file.txt      # change the owner (usually needs sudo)
chown alice:devs file.txt # change owner and group
```

The numbers are **octal**: read=4, write=2, execute=1, added together. So `7` = rwx,
`6` = rw-, `5` = r-x, `4` = r--. `chmod 640` means owner rw-, group r--, others nothing.
You'll internalize `600` (private key), `644` (normal file), and `755` (script/directory)
fast because you'll type them constantly.

### sudo and root

`root` is the all-powerful administrator account (user ID 0). You rarely log in as root
directly. Instead you run individual commands as root with `sudo`:

```sh
sudo apt update           # run this one command as root
sudo systemctl restart nginx
```

The golden rule you'll hear again in Module 2: **use the least privilege that gets the job
done.** Don't run everything as root "to avoid permission errors" — those errors are often
the system correctly stopping you from a mistake.

## Pipes and redirection: composing small tools

This is the idea that makes the Unix shell powerful. Each tool does one thing. You connect
them. The **pipe** `|` takes the output of one command and feeds it as the input of the next:

```sh
cat access.log | grep "404" | wc -l    # count lines containing "404"
```

Read left to right: dump the log, keep only lines with "404", count them. Three simple tools
became a "count of 404 errors" tool, and you invented it on the spot.

**Redirection** sends output to (or reads input from) files instead of the screen:

```sh
echo "hello" > file.txt      # write output to a file (OVERWRITES it)
echo "world" >> file.txt     # append output to a file (adds to the end)
command < input.txt          # feed a file in as the command's input
command 2> errors.txt        # redirect error messages (stderr) to a file
command > out.txt 2>&1        # send both normal output and errors to one file
command 2>/dev/null           # throw errors away (/dev/null is the void)
```

There are three **streams** every program has: **stdin** (input, 0), **stdout** (normal
output, 1), and **stderr** (error output, 2). Pipes and `>` handle stdout by default; `2>`
handles stderr. Understanding these three is what lets you control exactly where output goes.

## The essential text-processing tools

You will use these five constantly. Learn them now:

```sh
grep "pattern" file        # print lines matching a pattern
grep -r "TODO" .           # search recursively through a directory
grep -i "error" log        # case-insensitive
grep -v "debug" log        # invert: lines that DON'T match
grep -c "404" access.log   # count matching lines

find . -name "*.conf"      # find files by name under the current directory
find /var -type f -size +100M   # files over 100MB under /var
find . -name "*.tmp" -delete    # find and delete (careful!)

sort file.txt              # sort lines alphabetically
sort -n numbers.txt        # sort numerically
sort -rn numbers.txt       # reverse numeric (biggest first)

uniq                       # collapse adjacent duplicate lines (sort first!)
sort file | uniq -c        # count occurrences of each unique line

cut -d: -f1 /etc/passwd    # cut column 1, using : as the delimiter
awk '{print $1}' access.log # print the first whitespace-separated field
```

Combined, these solve a huge range of real problems. The classic "top 10 IP addresses in a
log" one-liner (which is Lab 2) is nothing but these tools piped together:

```sh
awk '{print $1}' access.log | sort | uniq -c | sort -rn | head -n 10
```

Read it: extract the first field (the IP) from each line → sort so identical IPs sit
together → count each unique IP → sort those counts biggest-first → take the top 10.

## Processes: what's actually running

A running program is a **process** with a numeric **PID** (process ID). Managing processes
is daily work on a server.

```sh
ps aux                # list all running processes
ps aux | grep nginx   # find a specific process
top                   # live, updating view of processes (q to quit)
htop                  # a nicer top, if installed (you'll install it in Module 2)
```

Every process can receive **signals**. The two you'll use:

```sh
kill 1234             # politely ask process 1234 to stop (sends SIGTERM)
kill -9 1234          # force-kill (SIGKILL) — last resort, no cleanup
pkill nginx           # kill processes by name
```

**Foreground vs. background jobs** in your own shell:

```sh
long-command          # runs in the foreground; your prompt is blocked
long-command &        # run it in the background; prompt returns immediately
Ctrl-Z                # suspend the foreground job
bg                    # resume the suspended job in the background
fg                    # bring a background job back to the foreground
jobs                  # list jobs running in this shell
```

Note this is *shell* job control — it dies when you close the terminal. For work that must
survive a disconnect, you'll use **tmux** in the next lesson.

## The environment: variables and $PATH

The shell keeps a set of **environment variables** — named values that programs can read:

```sh
echo $HOME            # print the value of the HOME variable
echo $USER            # your username
echo $PATH            # the list of directories the shell searches for commands
export EDITOR=vim     # set a variable and make it visible to programs you run
env                   # list all environment variables
```

`$PATH` deserves special attention. When you type `ls`, how does the shell find the `ls`
program? It looks through each directory listed in `$PATH`, in order, until it finds one
named `ls`. That's why `which ls` tells you *which* file will actually run:

```sh
which python3         # show the full path of the program that would run
type cd               # tell you if something is a program, builtin, or alias
```

## Dotfiles: making the shell yours

When your shell starts, it reads a **configuration file** in your home directory — `~/.bashrc`
for bash, `~/.zshrc` for zsh. These are called **dotfiles** because their names start with a
dot (which makes them hidden). They're just shell scripts that run at startup. You put your
customizations there:

```sh
# Inside ~/.bashrc or ~/.zshrc

# Aliases: short names for longer commands
alias ll='ls -la'
alias gs='git status'
alias ..='cd ..'

# Environment variables
export EDITOR=vim

# A cleaner, informative prompt (bash example)
export PS1='\u@\h:\w\$ '
```

After editing, either open a new terminal or reload the file:

```sh
source ~/.bashrc      # re-run the config in your current shell
```

:::tip[Your dotfiles are Lab 1 — and a career-long habit]
Engineers keep their dotfiles in a git repo so they can set up any new machine in minutes.
That's exactly [Lab 1](/modules/00-toolkit/labs/#lab-1--your-dotfiles-repo), and the repo you
create there grows for the rest of this curriculum.
:::

## Getting help without leaving the terminal

```sh
man ls                # the manual page for ls (q to quit, / to search)
ls --help             # most tools print a quick help summary
tldr tar              # community "just show me examples" pages (if installed)
```

Learning to read a `man` page is a real skill. The **SYNOPSIS** section shows the grammar of
the command; the **OPTIONS** section explains each flag. It's dense, but it's authoritative
and always available — even on a server with no internet.

## Common mistakes to avoid

- **Spaces in commands matter.** `rm - rf` is not `rm -rf`. Type carefully.
- **The shell is case-sensitive.** `File.txt` and `file.txt` are different files.
- **`>` overwrites without asking.** Use `>>` when you mean to append.
- **Tab completion is your friend.** Start typing a filename and press Tab — the shell
  finishes it. This prevents typos and is faster. Use it constantly.
- **Up-arrow recalls previous commands.** `Ctrl-R` searches your command history. You rarely
  need to retype anything.

## Quick self-check

Before moving on, make sure you can answer these without looking:

1. What's the difference between an absolute and a relative path?
2. What does `chmod 600 id_ed25519` do, and why would you do it to a key?
3. What does `cat access.log | grep 500 | wc -l` produce?
4. What's the difference between `>` and `>>`?
5. How do you find which directories the shell searches to run a command?
6. Where do your shell customizations live, and how do you reload them?

If any of those are shaky, that's fine — [Lab 2](/modules/00-toolkit/labs/#lab-2--the-pipeline-puzzle)
will drill the pipe-and-filter skills until they're reflex.

**Next:** [Lesson 0.2 · Remote Work →](/modules/00-toolkit/remote/)
