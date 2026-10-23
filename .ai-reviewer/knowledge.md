# fresh-mint reviewer notes

## Architecture

This is a Vite-powered React 18 application written in strict TypeScript. `src/App.tsx` discovers widgets dynamically from category directories (`components`, `editors`, `dialogs`, `charts`, etc.), lazy-loads them, and presents them in a searchable, paginated gallery. Widgets are standalone files, while reusable primitives live under `src/ui`.

## Conventions

- Widget files are organized by category directory and must provide a **default React component export**; `src/App.tsx` throws if a discovered module lacks one.
- Components use named exports for public types, helpers, and components, plus a default export for gallery loading. See `src/charts/AccountChart.tsx` (`AccountPoint`, `generateAccountSeries`, `AccountChart`, and `export default AccountChart`).
- TypeScript is strict with `noUnusedLocals`, `noUnusedParameters`, `isolatedModules`, and `noEmit` (`tsconfig.json`). New code must type-check through `npm run build`.
- Reusable UI components are imported from `src/ui` using relative paths and should not introduce extra packages or stylesheets (`src/ui/README.md`).
- Controlled UI state belongs to the consuming widget. This applies to search fields, selection controls, pagination, and toggles (`src/ui/README.md`).
- Native buttons default to non-submit behavior; form submission must explicitly use `type="submit"` (`src/ui/README.md`). Existing buttons follow this rule in `src/App.tsx` and the chart files.
- Chart components follow a repeated interface: `{ title?, data?, width?, height? }`, domain-specific `*Point` types, deterministic `generate*Series` helpers, and bar/line mode switching (`src/charts/*.tsx`).
- Accessibility patterns are expected: labels linked with `htmlFor`, live status text, semantic navigation, and alert regions appear in `src/App.tsx`; shared components document similar requirements (`src/ui/README.md`).

## Intentional non-standard choices

- Chart files are deliberately standalone and repetitive rather than sharing one generic chart implementation. Each has its own point type, generator seed, default point count, CSS class, and initial mode (`src/charts/AccountChart.tsx`, `AlbumChart.tsx`, and the other sampled charts).
- Demo chart data is deterministic pseudo-random data generated locally; it is not intended to represent a production data source (`src/charts/*.tsx`).
- Styling is primarily inline or class-hook based, with no imported stylesheet in the sampled application (`src/App.tsx`, `src/charts/AccountChart.tsx`).

## Watch out for

- Adding a widget without a default export will break rendering at runtime; verify modules discovered by `import.meta.glob` (`src/App.tsx`).
- Do not use unstable or non-unique list keys. Chart points currently key by `p.label`, so generated or supplied labels must be unique (`src/charts/*.tsx`).
- Preserve page reset behavior when changing widget filters; `src/App.tsx` resets to page 1 on `query` changes and clamps the current page to the available page count.
- Avoid introducing unused imports, props, or locals because the compiler treats them as errors (`tsconfig.json`).
- Interactive chart elements currently rely on mouse hover for detail display; changes should not regress the surrounding accessible labeling and should consider keyboard or non-hover access for new interactions (`src/charts/*.tsx`).