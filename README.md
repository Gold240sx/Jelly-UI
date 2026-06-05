# Jelly UI

A glowing **3D-jelly + liquid-glass** icon-button material for BIAB. Each button is
driven by a single accent color (`--c`); everything else — the emissive core, the
deep subsurface shade, the bloom, the gloss, the rim light — is derived from it.

```
jelly-ui/
├── index.html        # the lab / showcase (not shipped)
├── css/
│   ├── jelly.css     # ⭐ the portable system — this is what goes into BIAB
│   └── lab.css       # showcase-only styling
└── js/
    ├── icons.js      # shared lucide-style icon registry
    └── lab.js        # showcase wiring (sidebar, palette, live controls)
```

## Run it

```bash
cd jelly-ui
python3 -m http.server 5180
# → http://localhost:5180
```

## Using a jelly icon (the only thing BIAB needs)

```html
<button class="jelly" style="--c:#15c39a" aria-label="Helpful Links">
  <svg viewBox="0 0 24 24">…lucide path…</svg>
</button>
```

- **Theme:** put `data-theme="light"` or `data-theme="dark"` on a parent. Light =
  soft candy (matches the frosted dashboard); dark = neon, lit-from-within.
- **Selected nav item:** add `aria-current="true"` (or `.is-active`) for the pumped glow + lift.
- **Holographic variant:** add `.jelly--holo` for the iridescent conic sheen.
- **Per-instance overrides:** `--jelly-size`, `--jelly-radius`, `--jelly-bloom`, `--jelly-gloss`, `--jelly-icon-scale`.

Pure CSS, no dependencies. Uses modern `color-mix()` / relative-color / `@property`
(Chrome & Safari current). Respects `prefers-reduced-motion`.
