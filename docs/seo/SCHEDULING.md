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

### If the log is empty every morning

macOS may be blocking a scheduled job from reading `~/Desktop`. Grant Full Disk
Access to `/bin/bash` in System Settings → Privacy & Security, or move the repo
out of `~/Desktop`. The wrapper prints a specific message for this case.

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
