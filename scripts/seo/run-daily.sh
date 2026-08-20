#!/bin/bash
#
# Wrapper for the scheduled daily SEO run.
#
# The launchd job invokes THIS rather than `npm run seo:daily` directly. Both
# reasons were found the hard way on the roadway.tools install, where the
# scheduled job was discovered to have never once succeeded while every manual
# run worked:
#
#   1. PATH. A login shell under launchd resolved `node` to
#      /opt/homebrew/bin/node, which on this machine is broken — dyld cannot
#      load libsimdjson.27.dylib and the process aborts with SIGABRT. The
#      interactive shell resolves nvm's node instead, which is exactly why the
#      failure was invisible. Resolving node explicitly here removes the
#      ambiguity.
#
#   2. Working directory. launchd started the shell somewhere it could not stat,
#      so `zsh -lc` emitted "getcwd: cannot access parent directories" before it
#      ran anything. Setting the directory explicitly, without a login shell,
#      avoids that entirely.
#
# Keep this dependency-free and defensive: it runs unattended, and a failure
# here is silent unless someone reads the log.

set -uo pipefail

REPO="/Users/zandipie/Work/VibeOps/Website/v16"

cd "$REPO" || {
  echo "[run-daily] FATAL: cannot cd to $REPO"
  echo "[run-daily] If this reads 'Operation not permitted', the repository is somewhere"
  echo "[run-daily] macOS shields from scheduled jobs. Measured on 2026-08-19: a launchd"
  echo "[run-daily] agent under ~/Desktop could not ls or read a single file in the repo"
  echo "[run-daily] and exec returned 126, while writes oddly succeeded. Moving the"
  echo "[run-daily] repository out of ~/Desktop fixed it outright. ~/Documents and"
  echo "[run-daily] ~/Downloads carry the same protection; ~/Work does not."
  exit 1
}

# Resolve a working node. Prefer whatever nvm has as its highest v22+, then any
# nvm node, then the system one. The Homebrew node is deliberately last: it is
# the one that is broken here.
find_node() {
  local candidate
  for candidate in \
    "$HOME/.nvm/versions/node/v22.22.1/bin/node" \
    $(ls -1d "$HOME"/.nvm/versions/node/v2[2-9]*/bin/node 2>/dev/null | sort -Vr) \
    $(ls -1d "$HOME"/.nvm/versions/node/*/bin/node 2>/dev/null | sort -Vr) \
    /usr/local/bin/node \
    /opt/homebrew/bin/node
  do
    # Actually execute it — presence on disk is not the same as working, which
    # is exactly the trap the Homebrew install fell into.
    if [ -x "$candidate" ] && "$candidate" --version >/dev/null 2>&1; then
      echo "$candidate"
      return 0
    fi
  done
  return 1
}

NODE="$(find_node)" || {
  echo "[run-daily] FATAL: no working node found."
  exit 1
}

export PATH="$(dirname "$NODE"):$PATH"

# Stamp this run as scheduled. The pipeline records it only on a COMPLETED
# run, so an interactive run can never masquerade as a healthy scheduler.
export VO_RUN_SOURCE=launchd

echo "[run-daily] $(date -u +%Y-%m-%dT%H:%M:%SZ) starting"
echo "[run-daily] node $("$NODE" --version) at $NODE"

# Invoke the orchestrator directly rather than through npm, so npm's own node
# resolution cannot reintroduce the problem this wrapper exists to solve.
"$NODE" scripts/seo/daily.mjs
STATUS=$?

echo "[run-daily] $(date -u +%Y-%m-%dT%H:%M:%SZ) finished, exit $STATUS"

# Notify only when there is something a person actually has to decide.
#
# The whole point of this system is that nobody reads a daily report to find out
# that nothing happened. analyze.mjs decides what is worth interrupting someone
# for and writes it to .status.json; this only delivers it. Keeping the judgement
# in the analysis and out of the shell means the threshold is versioned, tested
# and visible, rather than buried in a bash conditional.
#
# A failed RUN is always worth knowing about: silence from a broken scheduled job
# is indistinguishable from silence from a healthy site, and that is precisely
# how the roadway.tools job went a week without anyone noticing it had never run.
STATUS_FILE="$REPO/docs/seo/data/.status.json"

notify() {
  # osascript reaches the logged-in GUI session. If nobody is logged in it
  # fails harmlessly and the log still has everything.
  /usr/bin/osascript -e "display notification \"$2\" with title \"$1\"" 2>/dev/null || true
}

if [ $STATUS -ne 0 ]; then
  notify "VibeOps SEO: run failed" "Exit $STATUS. See docs/seo/data/.cron.log"
elif [ -f "$STATUS_FILE" ]; then
  SHOULD_NOTIFY="$("$NODE" -e "try{const s=require('$STATUS_FILE');process.stdout.write(s.notify?'1':'0')}catch(e){process.stdout.write('0')}")"
  if [ "$SHOULD_NOTIFY" = "1" ]; then
    HEADLINE="$("$NODE" -e "try{const s=require('$STATUS_FILE');process.stdout.write(String(s.headline||s.verdict||'').replace(/\"/g,''))}catch(e){}")"
    notify "VibeOps SEO: action needed" "$HEADLINE"
    echo "[run-daily] notified: $HEADLINE"
  else
    echo "[run-daily] nothing worth notifying about"
  fi
fi

exit $STATUS
