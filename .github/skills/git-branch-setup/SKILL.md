---
name: git-branch-setup
description: >-
  Step 1 of the git workflow. Pulls the latest main and creates (or checks out) a
  new feature branch from it. Use when starting a new task and a branch name is
  available.
argument-hint: '<branch-name>'
---

# Step 1 — Branch setup

Goal: leave the repo on a fresh feature branch that is up to date with `main`.

## Procedure
1. Confirm a `branch_name` exists. If not, stop and ask for one.
2. Make sure the working tree is clean — abort if there are uncommitted changes so
   no work is lost.
3. Run these commands with `#tool:runCommands` (replace `<branch_name>`; base
   branch is `main`):

```bash
# abort if there are uncommitted changes
test -z "$(git status --porcelain)" || { echo "ERROR: commit or stash changes first"; git status --short; exit 1; }

git fetch origin main
git checkout main
git pull --ff-only origin main

# create the branch, or check it out if it already exists
git checkout -b "<branch_name>" 2>/dev/null || git checkout "<branch_name>"

git rev-parse --abbrev-ref HEAD   # confirm we're on the new branch
```

## Done when
- `git rev-parse --abbrev-ref HEAD` prints `<branch_name>`.

Hand back to the orchestrator to begin **Step 2 (git-task-summary)**.
