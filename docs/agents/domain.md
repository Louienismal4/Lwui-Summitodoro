# Domain docs

## Before exploring

Read root `GLOSSARY.md` and relevant decisions under `docs/adr/`.

If these files do not exist, proceed silently. The domain-modeling
skill creates them when terms or decisions are resolved.

## Layout

Single-context:
- `GLOSSARY.md`: domain vocabulary.
- `docs/adr/`: architecture decision records.

## Use glossary vocabulary

Use defined domain terms in issue titles, proposals, hypotheses,
and test names. If a needed concept is missing, reconsider the
term or note the gap for domain-modeling.

## Flag ADR conflicts

Explicitly identify any proposal that contradicts an existing ADR,
including the ADR number and why the decision should be reopened.
