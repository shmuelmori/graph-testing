---
name: git-code-review
description: >-
  Step 4 of the git workflow. Reviews the implemented diff against four review
  rules before anything is committed. Use after implementation and before commit
  and push.
---

# Step 4 — Code review

Goal: catch problems before they're committed. Review the diff from Step 3
(`git diff`) against these **4 review rules**. For each, state **Pass** or **Fail**
with specifics.

1. **Correctness & scope.** Does it achieve the approved objective, and only that?
   Check logic, edge cases, and that nothing outside scope was touched.
2. **Quality & conventions.** Readable, well-named, no duplication, consistent with
   the codebase. No leftover debug code, TODOs, or dead code.
3. **Security & robustness.** Inputs validated, errors handled, no hardcoded
   secrets, no unsafe/injection-prone calls, sensible failure behaviour.
4. **Tests & docs.** Adequate test coverage, tests pass, and relevant docs/comments
   updated.

## Outcome
- **All four Pass** → report and hand back for **Step 5 (git-commit-push)**.
- **Any Fail** → list the required fixes, return to the Step 3 rules to address
  them, then re-review. Do not reach commit/push until all four pass.
