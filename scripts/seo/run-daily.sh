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

REPO="/Users/zandipie/Desktop/Work/VibeOps/Website/v16"

cd "$REPO" || {
  echo "[run-daily] FATAL: cannot cd to $REPO"
  echo "[run-daily] If this reads 'Operation not permitted', macOS is blocking the"
  echo "[run-daily] scheduled job from the Desktop folder. Grant Full Disk Access to"
  echo "[run-daily] /bin/bash in System Settings > Privacy & Security, or move the"
  echo "[run-daily] repository out of ~/Desktop."
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

echo "[run-daily] $(date -u +%Y-%m-%dT%H:%M:%SZ) starting"
echo "[run-daily] node $("$NODE" --version) at $NODE"

# Invoke the orchestrator directly rather than through npm, so npm's own node
# resolution cannot reintroduce the problem this wrapper exists to solve.
"$NODE" scripts/seo/daily.mjs
STATUS=$?

echo "[run-daily] $(date -u +%Y-%m-%dT%H:%M:%SZ) finished, exit $STATUS"
exit $STATUS
