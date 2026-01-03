# Draft Claims — Cubit (Computational Geometry Mapping & Export)

Below are drafted independent and dependent claims written in plain language for attorney refinement. These are starting points and intentionally concrete (steps, data structures, modules) to preserve patentability.

1. (System) A computer-implemented system for generating executable program representations from an interactive visual geometry, the system comprising:
   - a shape detection module configured to identify a set of geometric primitives drawn by a user on a two-dimensional canvas, each primitive having one or more attributes including type, position, size, and identifier; 
   - a canonicalizer module configured to normalize coordinates of the identified primitives and to arrange the primitives into a deterministic ordering according to a predetermined canonicalization rule; 
   - a relationship parser configured to identify connections between primitives by tracing line and arc primitives and resolving ambiguous connections using a rule-based tie-breaker; and
   - a mapping engine configured to translate the ordered primitives and their relationships into a typed abstract syntax tree (AST) and to output an executable program representation based on the AST.

2. The system of claim 1, wherein the canonicalization rule comprises sorting by block coordinates, shape-type priority, and a stable UUID, such that repeated inputs having the same primitives and attributes produce bit-for-bit identical AST outputs.

3. The system of claim 1, further comprising a provenance generator that computes a cryptographic hash of the AST and associated metadata including timestamp, user identifier, and software version, and stores the hash and metadata in an audit record.

4. The system of claim 1, wherein the mapping engine applies a template-based code generator that maps each primitive type to a corresponding code template (e.g., circle→container template, square→control-block template) and parametrizes the template using primitive attributes.

5. (Method) A method for producing patent-ready drawings from an interactive visual editor, comprising:
   - receiving, at a client UI, user-specified caption text, figure number, inventor metadata, and scale;
   - generating a vector representation of a geometry according to a fixed viewBox and canonical coordinates;
   - exposing the vector representation to an automation interface within the client (e.g., by setting a global variable accessible to external scripts);
   - invoking a headless extraction tool that loads the client UI, triggers the automation interface to retrieve the vector representation, and saves the retrieved vector to persistent storage with a timestamped filename; and
   - composing one or more retrieved vectors into a single paginated document with consistent layout and watermarking.

6. The method of claim 5, wherein the headless extraction tool computes and stores a cryptographic digest of each retrieved vector and includes the digest in an accompanying metadata file.

7. (Computer-readable medium) A non-transitory computer-readable medium storing instructions that, when executed by one or more processors, perform operations comprising receiving a two-dimensional visual geometry and performing the operations of claim 1 to produce an executable program representation.

8. (UI) A user interface for teaching computational concepts comprising: a canvas displaying geometric primitives, a control panel that maps primitives to computational concept labels, and an export control that allows a user to specify caption, figure number, and inventor metadata; wherein the export control triggers a reproducible export as described in claim 5.

9. The system of claim 1, wherein the relationship parser disambiguates multiple candidate connections by applying nearest-neighbor distance calculations constrained by a maximum connection radius and by preferring connections that preserve planarity.

10. The system of claim 1, wherein the mapping engine further performs conflict resolution for overlapping primitives by applying a deterministic z-order rule based on creation time and normalized coordinates.

11. Additional dependent claims may cover: (a) compression or compact serialization formats for the AST; (b) an inference engine that maps observed user interactions to recommended next teaching interventions; (c) specific rendering optimizations for large matrices/grids; and (d) the headless orchestration protocol that retries, validates, and backs up original images prior to annotation.

Notes for attorney:
- These claims are intentionally concrete. During prosecution, the attorney may rewrite to add statutory language and prioritize claim breadth vs. defensibility. Provide implementation examples from `frontend/src/components/games/ComputationalGeometry.tsx`, `tools/extract_svg_headless.js`, `tools/make-pdf-from-images.js`, and `tools/svg_to_pdf.js`.
