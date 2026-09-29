# BLACKTOP Benchmark

ForgeFrame: BLACKTOP is the first end-to-end software/game benchmark.

## Goal
Accept a high-level game-development request and return the most complete installable Unreal Engine update possible.

## Workflow
Load project state; decompose the feature; generate implementation; review Unreal correctness; run available automated checks; repair failures; package source/config/scripts/assets; report only actions requiring Unreal Editor, unavailable binary assets, credentials, or human decisions.

## Constraint
Text generation cannot safely fabricate arbitrary Unreal binary .uasset files. Fusion should prefer source, config, data, procedural/editor automation and real Unreal workers for those operations.
