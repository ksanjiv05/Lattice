# o-simulation — architecture & conventions

React 19 + TypeScript + Vite. State via Zustand with a swappable local-storage
persistence layer. These rules are enforced for every change (by ESLint where
possible, by review otherwise).

## Directory structure

```
src/
  components/        Reusable, presentational UI — NO business logic
    ui/              Generic primitives: Button, Card, Input, Modal, …
    layout/          Structural: Container, Header, Sidebar, …
  features/          Self-contained feature modules (the default home for new work)
    <feature>/
      components/    Components used only by this feature
      hooks/         Feature-specific hooks
      store/         Feature-scoped Zustand store(s)
      index.ts       Public surface — import the feature ONLY from here
  hooks/             Reusable cross-feature hooks
  store/             Global stores + persistence infra (persist.ts)
  services/          API / data-access logic (no React)
  lib/               Framework-agnostic infra (storage adapter, http client, …)
  utils/             Pure, stateless helpers
  types/             Shared TS types
  constants/         App-wide constants (no magic values in components)
  config/            Env + app config (only place that reads import.meta.env)
```

## Core rules

1. **Reusable first.** Before writing UI, check
   `components/ui` and `components/layout`. If a piece of UI is used (or could be
   used) twice, it belongs there as a generic, prop-driven component.
2. **Logic lives outside components.** State transitions, persistence, data
   fetching, and derivations go in a store (`store/`, `features/*/store`),
   a hook (`hooks/`), or a service (`services/`). Components read state and
   render — they don't own logic.
3. **Small components.** Hard limits (ESLint `warn`): file ≤ 200 lines,
   function/component ≤ 80 lines, nesting depth ≤ 3. If you approach these,
   split the component or extract a hook. Aim well under the limits.
4. **One component per file**, named the same as the file. Co-locate its
   `.module.css`. Styles are scoped via CSS Modules — no global class soup.
5. **Feature isolation.** A feature imports shared code (`@/components`,
   `@/store`, `@/utils`). Cross-feature imports go through the other feature's
   `index.ts` only — never reach into its internal files.
6. **Barrel exports.** Each folder exposes a public API via `index.ts`. Import
   from the barrel (`@/components/ui`), not deep paths.
7. **Typed and explicit.** No `any`. Props get an interface. Shared types live
   in `types/`; feature types stay in the feature.
8. **Easy to debug.** Pure functions where possible, descriptive names, early
   returns over deep nesting, one responsibility per unit.

## Local data store

- Persistence adapter: `src/lib/storage` — `appStorage` (localStorage with an
  in-memory fallback). Swap the backend here; nothing else changes.
- Persistence helper: `src/store/persist.ts` — `persistStorage` +
  namespaced `storeKey()`. Every persisted store uses these.
- Global state: `src/store` (e.g. `useSettingsStore`).
- Feature state: `src/features/<feature>/store`.
- One-off persisted values: the `useLocalStorage` hook.

Store pattern:

```ts
export const useThingStore = create<ThingState>()(
  persist(
    (set) => ({ /* state + actions */ }),
    { name: storeKey('thing'), storage: persistStorage },
  ),
)
```

## Domain (the simulation board)

The board is built on **React Flow (`@xyflow/react`)**, which owns the canvas
(pan/zoom/minimap/controls), node dragging, and the connection (handle) UX. Our
zustand stores remain the single source of truth — React Flow is a controlled
view: `Board` maps stores → RF `nodes`/`edges` and writes RF changes
(`onNodesChange`/`onEdgesChange`/`onConnect`) back to the stores.

- **Board** (`features/board`) — the React Flow surface + `nodeTypes`, the
  store↔RF sync, and the add-node control.
- **Nodes** (`features/nodes`) — `FormulaNode` is the custom RF node: a card
  with a target handle (left) and source handle (right), an editable `name` and
  formula `expression`, and its live result. Inputs carry the `nodrag` class so
  editing doesn't drag the node. Position/name/expression live in `nodes.store`.
- **Variables** (`features/variables`) — named formulas in the side panel, not
  placed on the canvas.
- **Connections** (`features/connections`) — edges as data (`sourceId →
  targetId`) in `connections.store`. Drag from a node's right handle to another
  node to connect; select a wire and press Delete to remove it. The Nth incoming
  wire is exposed to the target's formula as `inN` (carrying the source's
  value), so a node can consume upstream outputs generically (e.g. `in1 + in2`).
- **Engine** (`lib/formula` + `features/engine`) — `lib/formula` is a pure
  tokenize → shunting-yard parse → RPN evaluate pipeline with built-in
  functions and **no `eval`**. `evaluateModel(symbols)` resolves the whole
  symbol table at once with dependency ordering + cycle detection. The
  `useModel` hook merges every named node and variable into one table — and
  threads each node's wired connections in as `inN` inputs — so a formula can
  reference nodes, variables, and wired inputs interchangeably (e.g. `n1 * 2`).

Names are the linking mechanism: a node/variable named `x` is referenced as
`x` in any other expression. Errors (cycles, unknown refs, parse errors)
surface per-cell via `ResultBadge` and never crash the app.

## Imports

Use the `@/` alias for everything under `src` (configured in `vite.config.ts`
and `tsconfig.app.json`). No deep `../../..` chains.

## Commands

- `pnpm dev` — dev server
- `pnpm build` — typecheck (`tsc -b`) + production build
- `pnpm lint` — ESLint (includes the size/complexity rules)
- `pnpm preview` — preview the build
