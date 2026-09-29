# Architecture

ForgeFrame Fusion v0.1 separates **capabilities** from **providers**.

## Components

1. **Request** — goal, inputs, constraints, preservation requirements.
2. **Planner** — decomposes a goal into capability-bearing steps.
3. **Capability Registry** — records what connected providers can do.
4. **Router** — selects an eligible provider using quality, cost, latency, availability and constraints.
5. **Executor** — runs dependency-ready steps concurrently.
6. **Verifier** — evaluates output against the original request and constraints.
7. **Repair Loop** — planned next: convert verification failures into minimal replacement steps.
8. **Provider Adapters** — planned next: normalize APIs/plugins/local models behind one runner contract.

## Non-goals

Fusion does not copy proprietary model internals, combine inaccessible model weights, evade authentication, or bypass provider quotas. Its purpose is intelligent coordination of capabilities the user is authorized to use.
