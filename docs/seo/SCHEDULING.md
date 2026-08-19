# Scheduling

What runs on its own, what cannot, and why the split is where it is.

## The daily run (automated)

A launchd agent runs `scripts/seo/run-daily.sh` at **09:12 local**, every day.

```
Install:   cp scripts/seo/ca.vibeops.seo-daily.plist ~/Library/LaunchAgents/
           launchctl load ~/Library/LaunchAgents/ca.vibeops.seo-daily.plist
Confirm:   launchctl list | grep vibeops
Remove:    launchctl unload ~/Library/LaunchAgents/ca.vibeops.seo-daily.plist
Log:       docs/seo/data/.cron.log   (gitignored)
```

It runs `verify → collect → aggregate → analyse → chart`, writes only inside
`docs/seo/`, and **cannot** edit the site, commit, or deploy. Committing stays a
human decision so the dataset is reviewed before it becomes history.

Verification runs **first** and a failure stops the run. Collecting on top of a
known-broken dataset is how a small inconsistency becomes an unrecoverable one.

### Why a wrapper script instead of `npm run seo:daily`

Both reasons were found the hard way on the roadway.tools install, where the
scheduled job was discovered to have **never once succeeded** while every manual
run worked:

1. **PATH.** A login shell under launchd resolves `node` to the Homebrew build,
   which is broken on this machine — dyld cannot load `libsimdjson.27.dylib` and
   the process aborts with SIGABRT. The interactive shell resolves nvm's node
   instead, which is precisely why the failure was invisible.
2. **Working directory.** launchd starts the shell somewhere it cannot `stat`,
   so `zsh -lc` fails before running anything.

`run-daily.sh` resolves a node that actually executes, sets the directory
explicitly, and avoids a login shell entirely. Do not "simplify" it back.

### Why the repository is not in ~/Desktop

It used to be, and the scheduled job **never once ran** because of it. `launchctl
list` reported exit 126 every morning and the log only ever contained:

    shell-init: error retrieving current directory: getcwd: cannot access parent directories: Operation not permitted
    /bin/bash: .../run-daily.sh: Operation not permitted

macOS shields `~/Desktop`, `~/Documents` and `~/Downloads` from background jobs
under TCC. A launchd agent has no UI to grant consent through, so it is denied
silently.

This was measured rather than assumed, on 2026-08-19, with a throwaway launchd
agent whose only job was to report what it could reach:

| Operation against the repo in ~/Desktop | Result |
|---|---|
| write to /tmp (control) | OK |
| `ls` the repo directory | **FAIL** |
| read a file in the repo | **FAIL** |
| exec a script in the repo | **126** |
| write a new file into the repo | OK (!) |

That last row is a genuine oddity — writes pass while reads are denied — and it
is exactly why the failure looked confusing from the outside. It also rules out
the tempting half-fix: **moving only the wrapper script out of ~/Desktop does
not work**, because the job still cannot read `config.json`, the scripts, or any
snapshot.

So the repository lives at `~/Work/VibeOps/Website/v16`. A symlink remains at the
old `~/Desktop/Work/VibeOps/Website/v16` path so existing terminals and shell
history keep working; the launchd plist deliberately points at the **real** path,
not the symlink.

The alternative was granting Full Disk Access to `/bin/bash` in System Settings.
That was rejected: it is a broad grant to a shared binary that every scheduled
job on the machine inherits, to solve a problem that a `mv` solves completely.

**If you ever move this repo again**, update `scripts/seo/run-daily.sh` (the
`REPO` variable), `scripts/seo/ca.vibeops.seo-daily.plist` (three paths), and
reinstall the agent. Do not put it back under a protected folder.

## The weekly review (interactive, and it has to be)

Three of the inputs need an interactively authenticated browser. No amount of
engineering removes this:

| Input | Needs | Can a cron or cloud agent do it? |
|---|---|---|
| Search Console | Google session as `team@vibeops.ca` | **No.** No Search Console MCP connector exists, and the Chrome MCP is interactively authenticated so it is absent from headless runs. |
| Fixed SERP probe | The same Chrome, for methodology parity | **No.** A different search backend would break comparability with every prior week. |
| Vercel Web Analytics | Vercel dashboard session | **No.** Vercel publishes no REST endpoint for it; five shapes were probed on 2026-08-17 and all returned 404. |

So the review is run **interactively**: open a session with the browser attached
and say **"run the weekly SEO review"**. `docs/seo/PROCEDURE.md` is followed end
to end.

A scheduled cloud routine was considered and deliberately rejected. It would run
without the browser, so it could not read Search Console or probe comparably, and
would produce an empty report that looked like a working one. That is worse than
no report.

## What `pending` means, and why it is not zero

A source that could not be collected is written into the snapshot as a `pending`
block carrying `how_to_collect`, never omitted. A missing key would later be read
as a zero by every consumer downstream, and "we did not look" and "we looked and
there was nothing" are completely different findings.

The daily run ends by printing exactly which sources are pending and what would
complete them.

## Cadence summary

| Cadence | What | Who |
|---|---|---|
| Daily 09:12 | verify, collect, aggregate, analyse, chart | launchd |
| Weekly | Search Console, SERP probe, Vercel analytics, written review | a person, with the browser |
| Once, before the first weekly review | `npm run seo:freeze` | a person |
| On demand | `npm run seo:verify` before any commit touching `docs/seo/` | a person |
