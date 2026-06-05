import { ICONS, svg, jellyButton, jellyPill, jellyInner, tintFor } from "./icons.js?v=3";

const BRAND = {
  path: `<path d="M12 3c3.5 3 6 5.5 6 9a6 6 0 0 1-12 0c0-3.5 2.5-6 6-9z"/>`,
};

/* every preview in the stage that the controls drive (chicklet + both buttons) */
let labJellies = [];
let labChicklet, labPill, labRect;

/* ---------------------------------------------------------------- sidebar -- */
function renderSidebar() {
  const el = document.getElementById("sidebar");
  let lastSection = null;
  ICONS.filter((i) => i.section === "main" || i.section === "manage").forEach((icon) => {
    if (icon.section === "manage" && lastSection !== "manage") {
      const div = document.createElement("div");
      div.className = "nav-section-label";
      div.textContent = "Manage";
      el.appendChild(div);
    }
    lastSection = icon.section;

    const row = document.createElement("div");
    row.className = "nav-item jelly-host" + (icon.active ? " is-current" : "");
    row.appendChild(jellyButton(icon, { size: "46px" }));
    const label = document.createElement("span");
    label.className = "label";
    label.textContent = icon.label;
    row.appendChild(label);
    row.addEventListener("click", () => {
      el.querySelectorAll(".nav-item").forEach((n) => n.classList.remove("is-current"));
      el.querySelectorAll(".jelly").forEach((j) => {
        j.classList.remove("is-active");
        j.removeAttribute("aria-current");
      });
      row.classList.add("is-current");
      const j = row.querySelector(".jelly");
      j.classList.add("is-active");
      j.setAttribute("aria-current", "true");
    });
    el.appendChild(row);
  });
}

/* ---------------------------------------------------------------- palette -- */
function renderPalette() {
  const el = document.getElementById("palette");
  ICONS.forEach((icon) => {
    const cell = document.createElement("div");
    cell.className = "swatch";
    cell.appendChild(jellyButton(icon, { size: "60px", active: false }));
    const name = document.createElement("span");
    name.className = "name";
    name.textContent = icon.label;
    cell.appendChild(name);
    el.appendChild(cell);
  });
}

/* --------------------------------------------------------------- spectrum -- */
function renderSpectrum() {
  const el = document.getElementById("spectrum");
  if (!el) return;
  for (let i = 0; i < 50; i++) {
    const hue = Math.round((i * 360) / 50);
    const color = `hsl(${hue} 82% 56%)`;
    const icon = ICONS[i % ICONS.length];
    const cell = document.createElement("div");
    cell.className = "spectrum-cell";
    cell.appendChild(jellyButton({ ...icon, color }, { size: "48px", active: false }));
    el.appendChild(cell);
  }
}

/* ------------------------------------------------------------------- lab --- */
const LAB_COLORS = [
  "#d65bff", "#ec4faa", "#f43f6e", "#f5a524",
  "#84cc16", "#15c39a", "#14b8a6", "#22b8d6",
  "#4f86f7", "#6d6af0", "#9b7cf0", "#7c8aa5",
];

const state = {
  c: "#d65bff", size: 128, radius: 30, bloom: 0.85, gloss: 1, icon: 0.4,
  holo: false, shape: "chicklet", grad: false, c2: "#4f86f7", angle: 120,
};

function applyShape() {
  if (!labChicklet) return;
  labChicklet.style.display = state.shape === "chicklet" ? "" : "none";
  document.getElementById("labButtons").style.display =
    state.shape === "chicklet" ? "none" : "flex";
  labPill.style.display = state.shape === "pill" ? "" : "none";
  labRect.style.display = state.shape === "rect" ? "" : "none";
}

function applyLab() {
  const j = document.getElementById("labJelly");
  // chicklet-only: live size + corner radius
  j.style.setProperty("--lab-size", state.size + "px");
  j.style.setProperty("--jelly-radius", state.radius + "%");
  // the buttons' size (→ font + icon) tracks the size slider, scaled down a bit
  const bsize = Math.round(state.size * 0.46) + "px";
  if (labPill) labPill.style.setProperty("--jelly-size", bsize);
  if (labRect) labRect.style.setProperty("--jelly-size", bsize);
  // shared across the chicklet + both buttons
  const tint = tintFor(state.c);
  labJellies.forEach((el) => {
    el.style.setProperty("--c", state.c);
    if (tint) el.style.setProperty("--jelly-tint", tint);
    else el.style.removeProperty("--jelly-tint");
    el.style.setProperty("--jelly-bloom", state.bloom);
    el.style.setProperty("--jelly-gloss", state.gloss);
    el.style.setProperty("--jelly-icon-scale", state.icon);
    el.style.setProperty("--grad", state.grad ? 1 : 0);
    el.style.setProperty("--c2", state.grad ? state.c2 : state.c);
    el.style.setProperty("--grad-angle", state.angle + "deg");
    el.classList.toggle("jelly--holo", state.holo);
  });
  renderCode();
}

function renderCode() {
  const code = document.getElementById("code");
  const P = (s) => `<span class="tok-prop">${s}</span>`;
  const V = (s) => `<span class="tok-val">${s}</span>`;
  const C = (s) => `<span class="tok-comment">${s}</span>`;
  const grad = state.grad
    ? `\n  ${P("--c2")}: ${V(state.c2)};           ${C("/* gradient 2nd color */")}` +
      `\n  ${P("--grad")}: ${V("1")};` +
      `\n  ${P("--grad-angle")}: ${V(state.angle + "deg")};`
    : "";
  code.innerHTML =
`.jelly {
  ${P("--c")}: ${V(state.c)};            ${C(state.grad ? "/* gradient 1st color */" : "/* the only color you pick */")}${grad}
  ${P("--jelly-size")}: ${V(state.size + "px")};
  ${P("--jelly-radius")}: ${V(state.radius + "%")};
  ${P("--jelly-bloom")}: ${V(state.bloom)};       ${C("/* outer glow */")}
  ${P("--jelly-gloss")}: ${V(state.gloss)};${state.holo ? "\n  " + C("/* + .jelly--holo for the iridescent sheen */") : ""}
}`;
}

function makeSlider(id, key, min, max, step, fmt) {
  const input = document.getElementById(id);
  const out = document.getElementById(id + "Val");
  input.min = min; input.max = max; input.step = step; input.value = state[key];
  out.textContent = fmt(state[key]);
  input.addEventListener("input", () => {
    state[key] = parseFloat(input.value);
    out.textContent = fmt(state[key]);
    applyLab();
  });
}

function renderLab() {
  const j = document.getElementById("labJelly");
  j.innerHTML = jellyInner(ICONS[0].path);

  // the labelled buttons in the stage, driven by the same controls
  const bwrap = document.getElementById("labButtons");
  const icon = { color: state.c, path: BRAND.path };
  labChicklet = j;
  labPill = jellyPill(icon, "Jelly UI", { size: "54px", shape: "pill" });
  labRect = jellyPill(icon, "Jelly UI", { size: "54px", shape: "rect" });
  bwrap.append(labPill, labRect);
  labJellies = [j, labPill, labRect];

  // shape toggle (chicklet / pill / rectangle)
  document.querySelectorAll("#shapeToggle button").forEach((b) => {
    b.addEventListener("click", () => {
      state.shape = b.dataset.shape;
      document.querySelectorAll("#shapeToggle button").forEach((x) =>
        x.setAttribute("aria-pressed", x.dataset.shape === state.shape ? "true" : "false"));
      applyShape();
    });
  });
  applyShape();

  // color swatches
  const row = document.getElementById("labColors");
  LAB_COLORS.forEach((c) => {
    const dot = document.createElement("button");
    dot.className = "swatch-dot";
    dot.style.background = c;
    dot.setAttribute("aria-pressed", c === state.c ? "true" : "false");
    dot.addEventListener("click", () => {
      state.c = c;
      row.querySelectorAll(".swatch-dot").forEach((d) => d.setAttribute("aria-pressed", "false"));
      dot.setAttribute("aria-pressed", "true");
      applyLab();
    });
    row.appendChild(dot);
  });

  // 2nd colour swatches (for the gradient)
  const row2 = document.getElementById("labColors2");
  LAB_COLORS.forEach((c) => {
    const dot = document.createElement("button");
    dot.className = "swatch-dot";
    dot.style.background = c;
    dot.setAttribute("aria-pressed", c === state.c2 ? "true" : "false");
    dot.addEventListener("click", () => {
      state.c2 = c;
      row2.querySelectorAll(".swatch-dot").forEach((d) => d.setAttribute("aria-pressed", "false"));
      dot.setAttribute("aria-pressed", "true");
      applyLab();
    });
    row2.appendChild(dot);
  });

  makeSlider("ctlSize", "size", 64, 200, 1, (v) => v + "px");
  makeSlider("ctlIcon", "icon", 0.24, 0.62, 0.01, (v) => Math.round(v * 100) + "%");
  makeSlider("ctlRadius", "radius", 14, 50, 1, (v) => v + "%");
  makeSlider("ctlBloom", "bloom", 0, 1.6, 0.01, (v) => v.toFixed(2));
  makeSlider("ctlGloss", "gloss", 0, 1.2, 0.01, (v) => v.toFixed(2));
  makeSlider("ctlAngle", "angle", 0, 360, 1, (v) => v + "°");

  document.getElementById("ctlGrad").addEventListener("change", (e) => {
    state.grad = e.target.checked;
    document.getElementById("gradBox").hidden = !state.grad;
    applyLab();
  });

  document.getElementById("ctlHolo").addEventListener("change", (e) => {
    state.holo = e.target.checked;
    applyLab();
  });

  document.getElementById("copyBtn").addEventListener("click", async (e) => {
    const txt = document.getElementById("code").textContent;
    try {
      await navigator.clipboard.writeText(txt);
      e.target.textContent = "Copied ✓";
      setTimeout(() => (e.target.textContent = "Copy CSS"), 1400);
    } catch { e.target.textContent = "Select & copy ↑"; }
  });

  applyLab();
}

/* ------------------------------------------------------------- theme + go -- */
function setTheme(t) {
  document.documentElement.setAttribute("data-theme", t);
  document.querySelectorAll(".theme-toggle button").forEach((x) =>
    x.setAttribute("aria-pressed", x.dataset.theme === t ? "true" : "false"));
}

function initTheme() {
  const root = document.documentElement;
  const q = new URLSearchParams(location.search).get("theme");
  if (q === "light" || q === "dark") setTheme(q);
  document.querySelectorAll(".theme-toggle button").forEach((b) => {
    b.addEventListener("click", () => {
      const t = b.dataset.theme;
      root.setAttribute("data-theme", t);
      document.querySelectorAll(".theme-toggle button").forEach((x) =>
        x.setAttribute("aria-pressed", x.dataset.theme === t ? "true" : "false"));
    });
  });
}

/* ---- the gel catches the light: wet specular highlight tracks the pointer -- */
function initLightTracking() {
  document.addEventListener("pointermove", (e) => {
    const j = e.target.closest(".jelly");
    if (!j) return;
    const r = j.getBoundingClientRect();
    const mx = ((e.clientX - r.left) / r.width) * 100;
    const my = ((e.clientY - r.top) / r.height) * 100;
    j.style.setProperty("--mx", mx.toFixed(1) + "%");
    j.style.setProperty("--my", my.toFixed(1) + "%");
  }, { passive: true });

  document.addEventListener("pointerout", (e) => {
    const j = e.target.closest(".jelly");
    if (j && !j.contains(e.relatedTarget)) {
      j.style.removeProperty("--mx");
      j.style.removeProperty("--my");
    }
  });

  // secondary bounce — fires ONLY on release (pointerup) of a press that began
  // on the same gummy; never on press-down.
  let pressed = null;
  document.addEventListener("pointerdown", (e) => {
    pressed = e.target.closest(".jelly");
  });
  document.addEventListener("pointerup", (e) => {
    const j = e.target.closest(".jelly");
    const target = pressed;
    pressed = null;
    if (!j || j !== target) return;
    j.classList.remove("jelly--bounce");
    void j.offsetWidth;
    j.classList.add("jelly--bounce");
  });
  document.addEventListener("pointercancel", () => { pressed = null; });
  document.addEventListener("animationend", (e) => {
    if (e.animationName === "jelly-bounce") {
      e.target.classList.remove("jelly--bounce");
    }
  });
}

renderSidebar();
renderPalette();
renderSpectrum();
renderLab();
initTheme();
initLightTracking();
