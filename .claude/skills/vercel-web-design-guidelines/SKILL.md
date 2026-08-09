---
name: vercel-web-design-guidelines
description: Review UI code for Vercel's Web Interface Guidelines compliance. Use when asked to "review my UI", "check accessibility", "audit design", "review UX", or "check my site against best practices".
---

# Web Interface Guidelines (Vercel)

Review files for compliance with Vercel's Web Interface Guidelines. These are Vercel's own brand/product interaction conventions (input behavior, accessibility, copy tone, formatting) — not universal law. Treat them as a strong default checklist for interaction correctness and accessibility, not as the final word on visual identity or aesthetic direction.

## How It Works

1. Fetch the latest guidelines from the source URL below (they change over time, always fetch fresh rather than relying on memory)
2. Read the specified files (or ask the user for files/pattern)
3. Check against all rules in the fetched guidelines
4. Output findings in a terse `file:line` format

## Guidelines Source

Fetch fresh guidelines before each review:

```
https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md
```

Use the web-fetch tool to retrieve the latest rules. The fetched content contains all the rules and output format instructions.

## Usage

When asked to review a file or pattern:
1. Fetch guidelines from the source URL above
2. Read the specified files
3. Apply all rules from the fetched guidelines
4. Output findings using the format specified in the fetched guidelines

If no files are specified, ask which files to review.

## Relationship to other design guidance

If a `frontend-design` skill or similar aesthetic-direction skill is also active: use that one to make the visual identity/creative decisions (palette, type, layout, signature element), and use this skill to check the resulting interaction patterns for correctness (accessibility, form behavior, copy conventions). They operate on different layers and are meant to complement, not override, each other.
