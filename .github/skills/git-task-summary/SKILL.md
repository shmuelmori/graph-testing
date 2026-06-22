---
name: git-task-summary
description: >-
  Step 2 of the git workflow and the only human checkpoint. Restates the task as a
  short plan and asks the user to approve or reject before any code is written. Use
  right after the branch is created and before implementation.
---

# Step 2 — Task summary & approval gate

Goal: prove you understood the task and get explicit human sign-off **before**
writing any code. Nothing is implemented here.

## Procedure
1. Read the task description and skim relevant code with `#tool:search/codebase`
   so the plan is grounded.
2. Present a concise summary with four parts:
   - **Objective** — one sentence on what success looks like.
   - **Scope** — the files/modules you expect to touch.
   - **Approach** — 2–4 bullets on how you'll implement it.
   - **Out of scope / assumptions** — what you're not doing, and any assumptions.
3. Ask for a decision with `#tool:vscode/askQuestions`, options
   **"Approve"** and **"Reject (give feedback)"**.

## 🛑 STOP HERE
After asking, **end the turn**. Do not call any other skill. Wait for the human.

- **Approve** → hand back to the orchestrator to start Step 3 (git-implement-task).
- **Reject** → take the feedback, revise the summary, and ask again. Repeat until
  approved. Never proceed on a rejection, silence, or unclear reply.
