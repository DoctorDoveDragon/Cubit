# Invention Disclosure — Concept A: Deterministic Visual-to-Code Mapping

Field of Invention
This disclosure relates to computer-implemented methods and systems for converting a user-created visual geometry (shapes, grids, nodes, arcs) into a canonical, executable program representation (Cubit code / AST).

Problem
There is no widely-adopted, deterministic mapping from freeform geometric layouts to a reproducible program representation suitable for teaching and program generation. Existing tools either rely on heuristics with non-deterministic ordering or require manual annotations.

Summary of Solution
A deterministic mapping engine that: (1) normalizes shapes by position/size, (2) establishes a canonical ordering rule (e.g., reading order, z-order, hash-based), (3) identifies shape types and relationships (connection lines, arcs), (4) applies mapping rules to produce a typed AST and output code, and (5) emits provenance metadata (timestamps, version, hash) ensuring bit-for-bit reproducibility.

Key Steps / Implementation
- Shape normalization: translate/scale to canonical coordinates, quantize positions to fixed grid cells where appropriate.
- Canonical ordering: sort primitives by (y-block, x-block, shape-type priority, stable UUID) to remove ambiguity.
- Relationship parsing: trace lines/arcs to connect source and target primitives; disambiguate forks using nearest-neighbor and rule-based tie-breakers.
- Mapping rules: each primitive maps to a code pattern (circle→container/variable, square→rule/block, triangle→transformation, matrix→array structure). Complex structures use templates and parameter injection.
- Output: produce a JSON AST and render to Cubit code using deterministic template engine.

Example Input/Output
Input: two circles connected by a line with labels.
Output: deterministic code snippet (example shown in repository examples/basic_example.py).

Advantages & Evidence
- Deterministic outputs reduce user confusion and support automated testing.
- Timestamps and exported SVGs provide reproducible artifacts (see PATENT_DRAWINGS/ComputationalGeometry_Export_*.svg).

Attachments
- Source code located in `frontend/src/components/games/ComputationalGeometry.tsx` and mapping logic in `pedagogical/learning_engine.py` (if present).
