---
name: git-implement-task
description: >-
  Step 3 of the git workflow. Implements the approved task by editing code, guided
  by four implementation rules. Use only after the task summary has been approved.
---

# Step 3 — Implement the task

Precondition: the Step 2 summary was **approved**. If not, stop and return to
`git-task-summary`.

Make the change with `#tool:editFiles`, following these **4 implementation rules**:

1. **Stay in scope.** Implement exactly what the approved summary described — no
   unrelated edits or refactors. New scope means going back to Step 2 for
   re-approval.
2. **Match the codebase.** Follow existing conventions, naming, structure, and
   libraries. Check neighbouring files first; don't add a new style or dependency
   without a clear reason.
3. **Keep changes small and readable.** Prefer the simplest correct solution.
   Handle obvious errors and edge cases. No dead code, debug logs, or
   commented-out blocks.
4. **Cover it with tests and docs.** Add/update tests for the new behaviour and
   update affected docs/comments. Leave the build and existing tests green.

When done, list what changed (files + one-line rationale each) and hand back for
**Step 4 (git-code-review)**.
