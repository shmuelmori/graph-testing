---
name: git-commit-push
description: >-
  Step 5 of the git workflow. Stages, commits, and pushes the feature branch to
  origin after the code review passes. Use as the final step once review is green.
argument-hint: '"<commit message>"'
---

# Step 5 — Commit & push

Precondition: Step 4 review passed. If not, stop.

## Procedure
1. Write a clear commit message — Conventional Commits style when it fits, e.g.
   `feat(auth): add login rate limiting`.
2. Run these commands with `#tool:runCommands` (replace `<commit message>`):

```bash
# never commit to the base branch
branch="$(git rev-parse --abbrev-ref HEAD)"
case "$branch" in main|master) echo "ERROR: refusing to commit to $branch"; exit 1;; esac

# something must be staged-able
test -n "$(git status --porcelain)" || { echo "ERROR: nothing to commit"; exit 1; }

git add -A
git commit -m "<commit message>"
git push -u origin "$branch"
```

## Done when
- The push succeeds. Report the branch name and suggest opening a pull request into
  `main`. The workflow is complete.
