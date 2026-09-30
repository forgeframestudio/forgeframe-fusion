# ForgeFrame Fusion

**Tell it what you want. Fusion figures out how to make it.**

ForgeFrame Fusion is an outcome-first AI creation workspace from ForgeFrame Studio. Instead of making users choose models, prompts, and tools, Fusion interprets the result they want, routes the job to appropriate capabilities, produces a usable artifact, and keeps project context for conversational revisions.

## Current product flow

The public prototype now supports a focused small-business creation loop:

1. **Launch a business** — generates a structured starter kit with positioning, tagline, services, offer, social bio, outreach copy, and an action checklist.
2. **Build a website** — generates a complete responsive single-file website, renders a live sandboxed preview, and provides the finished HTML file.
3. **Keep editing** — website project state is stored locally so natural-language revisions can continue from the latest artifact.
4. **Get customers** — creates an ethical customer-acquisition kit with target customer, lead-source ideas, outreach, follow-up, social copy, estimate reply, and a seven-day action plan.
5. **Start a new project** — resets project context without requiring the user to understand the underlying providers.

The prototype also retains research, GitHub discovery, chat, local photo effects, voice input/read-aloud, and the underlying orchestration engine.

## Product principle

**Sell outcomes, not model access.**

A customer should be able to ask for an outcome such as “launch my detailing business” or “build me a premium website” without knowing which model, provider, API, or prompt format is required.

## Architecture

```
USER OUTCOME
  ↓
INTENT ROUTING
  ↓
PROJECT CONTEXT
  ↓
CAPABILITY / PROVIDER SELECTION
  ↓
GENERATION
  ↓
VALIDATION
  ↓
USABLE ARTIFACT
  ↓
CONVERSATIONAL REVISION
```

The TypeScript orchestration core also includes planning, routing, provider adapters, execution, verification/repair, traces, and fallback logic.

## Commercial V1 target

The first sellable wedge is intentionally narrow: help a small service business go from an idea to a usable launch package, website, and first-customer outreach assets in one workspace.

Before charging customers, production readiness still requires end-to-end deployment verification, durable account/project storage, usage controls, authentication, billing/entitlements, and a production AI gateway/provider budget strategy.

## Provider policy

Fusion does not merge proprietary model weights, bypass provider authorization, or evade quotas. It coordinates authorized APIs, plugins, tools, and open-source/local capabilities through a common orchestration layer.

## Status

**Active V1 build.** The project has moved beyond architecture-only prototyping into outcome workflows and artifact generation.

© 2026 ForgeFrame Studio. All rights reserved.
