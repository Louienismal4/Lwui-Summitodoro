# Issue tracker: Local Markdown

Issues and specs live as Markdown files in `.scratch/`.

## Conventions

- One feature per directory: `.scratch/<feature-slug>/`.
- Specs: `.scratch/<feature-slug>/spec.md`.
- Tickets: `.scratch/<feature-slug>/issues/<NN>-<slug>.md`,
  numbered from `01`, one file per ticket.
- Record triage state in a `Status:` line near the top.
  Use the role strings in `triage-labels.md`.
- Append conversation history under `## Comments`.

## Skill operations

When a skill says “publish to the issue tracker”, create the
appropriate file above, creating directories as needed.

When a skill says “fetch the relevant ticket”, read the referenced
file. Resolve issue numbers within the relevant feature directory.

## Wayfinding operations

- Map: `.scratch/<effort>/map.md`, containing Notes,
  Decisions-so-far, and Fog.
- Child tickets: `.scratch/<effort>/issues/NN-<slug>.md`.
  Record `Type: research`, `prototype`, `grilling`, or `task`.
- Workflow status: `open`, `claimed`, or `resolved`.
  These are separate from the triage roles used on ordinary issues.
- Blocking: record `Blocked by: NN, NN` near the top.
  A ticket is unblocked when every listed ticket is resolved.
- Frontier: select the first ticket by number that is open
  and unblocked.
- Claim: save `Status: claimed` before starting work.
- Resolve: append the answer under `## Answer`, set
  `Status: resolved`, and append a summary and ticket path
  to Decisions-so-far in the map.
