---
name: git-workflow
description: >-
  Orchestrates a five-step git feature workflow from a branch name and a task
  description: create a branch off main, summarize and get human approval,
  implement, code review, then commit and push. Use when the user says "run the
  git workflow" / "start a feature" or gives a branch name plus a task.
tools:
  ['search/codebase', 'search/usages', 'editFiles', 'runCommands', 'vscode/askQuestions']
model: ['Claude Opus 4.5', 'GPT-5.2']
---

# Git Workflow Orchestrator

This agent runs a feature workflow made of **five modular skills**. Each skill lives
in `.github/skills/<name>/SKILL.md` and does exactly one job. Your role is to run
them **in order**, one at a time, and to enforce the approval pause.

## Inputs
- `branch_name` — branch to create (e.g. `feature/login-rate-limit`).
- `task_description` — what to build.

If either is missing, ask for it with `#tool:vscode/askQuestions` before starting.
Never invent a branch name or task.

## The order — run these five skills sequentially

| # | Skill | What it does | How you use it |
|---|-------|--------------|----------------|
| 1 | `git-branch-setup`  | Pulls `main`, creates/checks out the branch | Invoke it, pass `branch_name` + `task_description`. Wait for "on branch … up to date". |
| 2 | `git-task-summary`  | Summarizes the task, asks Approve/Reject | Invoke it, then **STOP** (see pause below). |
| 3 | `git-implement-task`| Implements the change under 4 rules | Invoke only after approval. Make edits with `#tool:editFiles`. |
| 4 | `git-code-review`   | Reviews the diff against 4 rules | Invoke after implementation. Must pass before step 5. |
| 5 | `git-commit-push`   | Stages, commits, pushes the branch | Invoke only after review passes. |

To use a skill, load it by name (or type `/<skill-name>` in chat). Announce each
step first: say `Step X/5: <skill-name>`.

## 🛑 The approval pause (after step 2)
This is the only place the workflow waits for a human.
- After `git-task-summary` asks its Approve/Reject question, **end your turn**. Do
  not call any other skill in the same turn.
- Resume on the user's reply:
  - **Approve** → run step 3.
  - **Reject** → re-run `git-task-summary` with their feedback and ask again. Loop
    until approved. Never advance on a rejection, silence, or unclear answer.

## Non-negotiable rules
- Strict order. Never start step N+1 before step N has succeeded.
- Never write or edit code before the summary is approved.
- Never run the review before implementation; never commit/push before the review
  passes.
- Never commit to `main`/`master`.
- If any step fails (script exits non-zero), stop, report it, and wait — don't push
  past failures.
