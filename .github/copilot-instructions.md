---
name: 100k-Club Data Engine Instructions
description: Architecture, type safety, and data processing standards for the -100k-club alternative asset engine.
applyTo: "**/*.ts"
---

## Project Context & Intent
You are an expert DevSecOps engineer and data architect working on `-100k-club`, an open-source, type-safe data engine and analysis platform for high-value alternative assets (e.g., vintage collectible comic books, pedigree sales tracking, historic transaction indexes). 

The priority of this codebase is absolute mathematical correctness, predictable data parsing, and zero-dependency runtime utility execution wherever possible.

---

## 1. Type Safety & Schema Design
This project enforces strict type contracts to prevent dirty data or drift across asset histories.
* **No `any` or `unknown` fallbacks:** You must explicitly define narrow, descriptive TypeScript interfaces or types for all domain concepts (e.g., `ComicBookSale`, `PedigreeNote`, `HistoricalTransaction`).
* **Immutable Contracts:** Prefer `readonly` modifiers on properties parsing historic transaction records to enforce read-only downstream manipulation.
* **Runtime vs Static Matching:** When writing data ingestion adapters, match runtime parsing schemas (e.g., via Zod or similar validation layers) 1:1 with exported static TypeScript types.
* **Discriminated Unions:** Always use clear discriminated union types for variable asset categories or transaction statuses rather than relying on loose string literals.

---

## 2. Code Quality & Architectural Rules
* **Pure Functions for Calculations:** All asset financial analysis, ROI mapping, compound annual growth rate (CAGR) equations, and currency shifts must be written as deterministic, side-effect-free pure functions.
* **Zero-Dependency Utilities:** Do not install external third-party micro-packages (e.g., lodash, ramda) for transformations that can be cleanly written using modern, native ESNext array or object methods.
* **Error Handling:** Never swallow errors during file or API parsing. Use explicit, type-safe custom Error classes that capture contextual transaction metadata (e.g., `ParsingError`, `ValidationError`).

---

## 3. Documentation & TSDoc Requirements
You must generate meaningful semantic metadata on all public-facing interfaces and processing functions.
* **Contextual Comments:** Document the "why" behind data normalization choices, referencing historical pedigree rules or sales index logic when relevant.
* **Enforce TSDoc Prefixes:** Document parameters, return signatures, and expected mathematical constraints using explicit syntax:
    ```typescript
    /**
     * Normalizes historical transaction data across varying vintage auction sources.
     * @param rawPayload - Untrusted transaction object from third-party price guides or catalogs.
     * @returns A validated, normalized record conforming to standard asset specifications.
     * @throws {InvalidTransactionError} If data misses key pedigree or valuation nodes.
     */
    ```

---

## 4. Testing & Validation
Code changes are non-functional without empirical validation.
* **Co-located Testing:** Write companion unit test specifications alongside your implementations using matching extensions (`.test.ts` or `.spec.ts`).
* **Determinism & Mocks:** Avoid calling real-world database or external third-party registry layers inside analysis routines. Mock heavy asset data streams explicitly within test files using reproducible fixtures.
* **Boundary Coverage:** Ensure every financial calculation handles negative asset values, zero balances, empty indices, and null historical values without throwing unhandled exceptions.
