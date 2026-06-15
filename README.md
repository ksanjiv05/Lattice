# Lattice

**A visual, node-based calculation canvas.** Build models on an infinite
whiteboard: drop nodes, give each one a formula, wire them together, and watch
values flow and recompute live. Think spreadsheet meets node editor — a network
(a _lattice_) of interlinked calculations.

> React 19 · TypeScript · Vite · React Flow · Zustand · Tailwind CSS v4

---

## Highlights

- 🧩 **Node canvas** — an infinite, pannable/zoomable board (powered by React
  Flow) with draggable node cards, a minimap, and zoom controls.
- ➗ **Formula engine, no `eval`** — a hand-written tokenize → shunting-yard →
  RPN evaluator with built-in math functions, dependency ordering, and **cycle
  detection**. Errors surface per-cell and never crash the app.
- 🔌 **Wire nodes together** — drag from a node's output handle to another node;
  each incoming wire is exposed to the target's formula as `in1`, `in2`, … so a
  node can consume upstream values generically (e.g. `in1 + in2`). The first
  wire into an empty node auto-fills its formula so the value flows through.
- 🎚️ **Dynamic variables** — a side panel of named formulas with click
  **stepper** controls and a configurable **step factor** for quick tuning.
- 📟 **Monitor nodes** — display-only cards that mirror the live value of any
  node you link them to, with an editable label.
- 🏷️ **Labels + references** — every node has a free-form **label** for humans
  and a short **name** used as its formula reference.
- 🧮 **Formula bar** — an Excel-style bar to edit the selected node's formula,
  with a searchable **Functions** reference you can click to insert.
- 🌗 **Light / dark theme**, **collapsible** side panel, and **local
  persistence** — your board survives a reload.

---

## Tech stack

| Area            | Choice                                             |
| --------------- | -------------------------------------------------- |
| Framework       | React 19 + TypeScript                              |
| Build tool      | Vite 6                                             |
| Canvas / graph  | [@xyflow/react](https://reactflow.dev) (React Flow)|
| State           | Zustand (with a swappable localStorage persistence)|
| Styling         | Tailwind CSS v4                                     |
| Icons           | lucide-react                                       |
| Formula engine  | Custom, in `src/lib/formula` (no `eval`)           |

---

## Getting started

**Prerequisites:** Node.js ≥ 20 and [pnpm](https://pnpm.io).

```bash
pnpm install      # install dependencies
pnpm dev          # start the dev server (http://localhost:5173)
pnpm build        # typecheck (tsc -b) + production build
pnpm preview      # preview the production build
pnpm lint         # ESLint (includes size/complexity rules)
```

---

## Using Lattice

1. **Add a node** — click **+ Node**. Each node has a **Label** (free text), a
   **`#name`** reference (used in formulas), and a **formula**.
2. **Write a formula** — type into the node's formula field or use the formula
   bar at the top after selecting a node. Reference other nodes/variables by
   their name: `n1 * 2 + max(n2, 10)`.
3. **Connect nodes** — drag from a node's right handle onto another node. The
   wire feeds the source's value into the target as `in1`, `in2`, … (in the
   order connected). Hover a wire and click the **✕** to delete it.
4. **Add variables** — open the **Variables** panel and add named formulas.
   Numeric ones get **▲/▼ steppers**; set the **Δ step factor** per variable.
5. **Monitor a value** — click **+ Monitor**, then pick a node from its dropdown
   to show that node's live value (it updates as the model changes).
6. **Tune & watch** — change any formula, step a variable, or rewire inputs and
   every dependent value recomputes instantly.

Names are the linking mechanism: a node/variable named `x` is referenced as `x`
anywhere else. Cycles, unknown references, and parse errors are reported on the
offending cell.

---

## Formula functions

Use these in any node or variable formula (also browsable via the **Functions**
button in the formula bar):

| Category   | Functions                                                        |
| ---------- | ---------------------------------------------------------------- |
| Rounding   | `abs(x)` `round(x)` `floor(x)` `ceil(x)` `sign(x)`               |
| Powers     | `sqrt(x)` `cbrt(x)` `pow(x, y)` `root(x, n)` `exp(x)`            |
| Logarithms | `ln(x)` `log(x)` (base 10) `log2(x)`                            |
| Percentage | `pct(x)` (x / 100) · `percent(part, whole)`                     |
| Comparison | `min(a, b)` `max(a, b)` `mod(a, b)` `clamp(x, lo, hi)`           |
| Trig       | `sin(x)` `cos(x)` `tan(x)` (radians)                             |

Operators: `+ - * / ^`, unary minus, and parentheses.

---

## Project structure

```
src/
  components/        Reusable presentational UI (ui/, layout/)
  features/          Self-contained feature modules
    board/           React Flow surface, formula bar, toolbar
    nodes/           FormulaNode + nodes store
    connections/     Edges (wires) + the inN input wiring
    variables/       Variables side panel + store
    monitors/        Monitor nodes + store
    engine/          useModel — merges nodes/variables/wires into one model
    theme/           Theme toggle + apply hook
  lib/
    formula/         Pure tokenize → parse → evaluate engine (no eval)
    storage/         Swappable localStorage adapter
  store/             Global stores + persistence helpers
  hooks/ utils/ types/ constants/ config/
```

See [`CLAUDE.md`](./CLAUDE.md) for the full architecture and conventions.

---

## How the engine works

`src/lib/formula` is framework-agnostic and pure:

1. **tokenize** the expression,
2. **parse** to RPN via the shunting-yard algorithm (collecting dependencies),
3. **evaluate** the RPN against a scope.

`evaluateModel(symbols)` resolves the whole symbol table at once — ordering by
dependencies and detecting cycles. The `useModel` hook merges every named node
and variable into one table and threads each node's wired connections in as
`inN` inputs, so formulas can reference nodes, variables, and wired inputs
interchangeably.
