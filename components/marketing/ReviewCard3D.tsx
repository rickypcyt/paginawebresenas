"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

type ModelId = "a" | "b";

const FONT = () => getComputedStyle(document.body).fontFamily;

function roundedRectShape(w: number, h: number, r: number) {
  const s = new THREE.Shape();
  const x = -w / 2,
    y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h);
  s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);
  return s;
}

function plateMesh(w: number, h: number, depth: number, r: number, color: number, edgeColor?: number) {
  const geo = new THREE.ExtrudeGeometry(roundedRectShape(w, h, r), {
    depth,
    bevelEnabled: true,
    bevelThickness: 0.02,
    bevelSize: 0.02,
    bevelSegments: 2,
    steps: 1,
  });
  geo.translate(0, 0, -depth / 2);
  const face = new THREE.MeshStandardMaterial({ color, roughness: 0.5, metalness: 0.04 });
  if (edgeColor === undefined) return new THREE.Mesh(geo, face);
  // ExtrudeGeometry: grupo 0 = caras, grupo 1 = laterales
  const edge = new THREE.MeshStandardMaterial({ color: edgeColor, roughness: 0.45, metalness: 0.06 });
  return new THREE.Mesh(geo, [face, edge]);
}

function cvTexture(wpx: number, hpx: number, draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void) {
  const cv = document.createElement("canvas");
  cv.width = wpx;
  cv.height = hpx;
  draw(cv.getContext("2d")!, wpx, hpx);
  const t = new THREE.CanvasTexture(cv);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  t.needsUpdate = true;
  return t;
}

function rr(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function star(ctx: CanvasRenderingContext2D, cx: number, cy: number, R: number, fill: string) {
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    let a = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
    ctx.lineTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R);
    a += Math.PI / 5;
    ctx.lineTo(cx + Math.cos(a) * R * 0.44, cy + Math.sin(a) * R * 0.44);
  }
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
}

// "G" oficial de Google (viewBox 48x48) — Path2D evita las juntas/grietas de los arcos
const GOOGLE_G_PATHS: [string, string][] = [
  [
    "#EA4335",
    "M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z",
  ],
  [
    "#4285F4",
    "M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z",
  ],
  [
    "#FBBC05",
    "M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z",
  ],
  [
    "#34A853",
    "M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z",
  ],
];

function googleG(ctx: CanvasRenderingContext2D, cx: number, cy: number, R: number) {
  const s = (R * 2.4) / 48;
  ctx.save();
  ctx.translate(cx - 24 * s, cy - 24 * s);
  ctx.scale(s, s);
  for (const [color, d] of GOOGLE_G_PATHS) {
    ctx.fillStyle = color;
    ctx.fill(new Path2D(d));
  }
  ctx.restore();
}

function nfcWaves(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  s: number,
  color: string,
  dot = false
) {
  if (dot) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(cx, cy, s * 0.11, 0, 7);
    ctx.fill();
  }
  ctx.strokeStyle = color;
  ctx.lineWidth = s * 0.13;
  ctx.lineCap = "round";
  for (let i = 1; i <= 3; i++) {
    ctx.beginPath();
    ctx.arc(cx, cy, s * 0.3 * i, -0.85, 0.85);
    ctx.stroke();
  }
}

// QR estilizado (v2, 25x25): finders con separador, alineación, timing, formato y datos sembrados
function qr(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  const n = 25,
    m = size / n;
  let seed = 123456789;
  const rnd = () => (seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;
  const g: boolean[][] = Array.from({ length: n }, () => Array(n).fill(false));
  const fixed: boolean[][] = Array.from({ length: n }, () => Array(n).fill(false));
  const set = (r: number, c: number, v: boolean) => {
    if (r >= 0 && c >= 0 && r < n && c < n) {
      g[r][c] = v;
      fixed[r][c] = true;
    }
  };
  const finder = (r0: number, c0: number) => {
    for (let i = -1; i < 8; i++)
      for (let j = -1; j < 8; j++) {
        const on =
          i >= 0 &&
          i < 7 &&
          j >= 0 &&
          j < 7 &&
          (i === 0 || i === 6 || j === 0 || j === 6 || (i >= 2 && i <= 4 && j >= 2 && j <= 4));
        set(r0 + i, c0 + j, on);
      }
  };
  finder(0, 0);
  finder(0, n - 7);
  finder(n - 7, 0);
  for (let i = -2; i <= 2; i++)
    for (let j = -2; j <= 2; j++)
      set(18 + i, 18 + j, Math.abs(i) === 2 || Math.abs(j) === 2 || (i === 0 && j === 0));
  for (let k = 8; k < n - 8; k++) {
    set(6, k, k % 2 === 0);
    set(k, 6, k % 2 === 0);
  }
  for (let k = 0; k < 9; k++) {
    set(8, k, rnd() < 0.5);
    set(k, 8, rnd() < 0.5);
    if (k < 8) {
      set(8, n - 1 - k, rnd() < 0.5);
      set(n - 1 - k, 8, rnd() < 0.5);
    }
  }
  set(17, 8, true);
  for (let i = 0; i < n; i++)
    for (let j = 0; j < n; j++) if (!fixed[i][j]) g[i][j] = rnd() < 0.48;
  ctx.fillStyle = "#111";
  for (let i = 0; i < n; i++)
    for (let j = 0; j < n; j++) if (g[i][j]) ctx.fillRect(x + j * m, y + i * m, m, m);
}

function toqueLogo(
  ctx: CanvasRenderingContext2D,
  cx: number,
  y: number,
  fs: number,
  ink = "#1d1d1f",
  align: "center" | "right" = "center"
) {
  ctx.save();
  ctx.font = `700 ${fs}px ${FONT()}`;
  const tw = ctx.measureText("toque").width;
  const markH = fs * 1.55;
  const unit = markH / 44;
  const markW = 34 * unit;
  const gap = fs * 0.45;
  const total = markW + gap + tw;
  const x0 = align === "right" ? cx - total : cx - total / 2;
  const dcx = x0 + 11 * unit;
  ctx.fillStyle = "#22c55e";
  ctx.beginPath();
  ctx.arc(dcx, y, 7 * unit, 0, 7);
  ctx.fill();
  ctx.strokeStyle = "#22c55e";
  ctx.lineWidth = 4.2 * unit;
  ctx.lineCap = "round";
  for (const r of [13.5, 20.5]) {
    ctx.beginPath();
    ctx.arc(dcx, y, r * unit, -0.91, 0.91);
    ctx.stroke();
  }
  ctx.fillStyle = ink;
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillText("toque", x0 + markW + gap, y);
  ctx.restore();
}

// ---------- TIPO A: placa de reseñas de Google ----------
function drawA(ctx: CanvasRenderingContext2D, W: number, H: number) {
  ctx.clearRect(0, 0, W, H);
  const bw = W * 0.055;
  rr(ctx, 0, 0, W, H, W * 0.11);
  ctx.save();
  ctx.clip();
  ctx.fillStyle = "#EA4335";
  ctx.fillRect(0, 0, W * 0.5, bw);
  ctx.fillStyle = "#4285F4";
  ctx.fillRect(W * 0.5, 0, W * 0.5, bw);
  ctx.fillRect(W - bw, 0, bw, H * 0.5);
  ctx.fillStyle = "#34A853";
  ctx.fillRect(W - bw, H * 0.5, bw, H * 0.5);
  ctx.fillRect(W * 0.5, H - bw, W * 0.5, bw);
  ctx.fillStyle = "#FBBC05";
  ctx.fillRect(0, H - bw, W * 0.5, bw);
  ctx.fillRect(0, H * 0.5, bw, H * 0.5);
  ctx.fillStyle = "#EA4335";
  ctx.fillRect(0, 0, bw, H * 0.5);
  ctx.restore();
  ctx.fillStyle = "#ffffff";
  rr(ctx, bw, bw, W - 2 * bw, H - 2 * bw, W * 0.07);
  ctx.fill();
  const cx = W / 2;
  googleG(ctx, cx, H * 0.235, W * 0.1);
  nfcWaves(ctx, W * 0.245, H * 0.235, W * 0.1, "#EA4335");
  ctx.save();
  ctx.translate(W * 0.755, H * 0.235);
  ctx.scale(-1, 1);
  nfcWaves(ctx, 0, 0, W * 0.1, "#4285F4");
  ctx.restore();
  const sy = H * 0.435,
    sr = W * 0.042,
    gap = W * 0.105;
  for (let i = 0; i < 5; i++) star(ctx, cx - 2 * gap + i * gap, sy, sr, "#e7b53c");
  ctx.fillStyle = "#1d1d1f";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `500 ${W * 0.047}px ${FONT()}`;
  ctx.fillText("Acerca tu teléfono y", cx, H * 0.545);
  ctx.fillText("déjanos tu reseña", cx, H * 0.595);
  // NFC + QR: dos cuadrados iguales, simétricos, con etiqueta debajo de cada uno
  const s = W * 0.175,
    by = H * 0.66,
    bx = W * 0.235,
    qx = W * 0.59,
    cc = W * 0.035;
  ctx.strokeStyle = "#1d1d1f";
  ctx.lineWidth = W * 0.007;
  ctx.lineCap = "round";
  [
    [bx, by + cc, bx, by, bx + cc, by],
    [bx + s - cc, by, bx + s, by, bx + s, by + cc],
    [bx + s, by + s - cc, bx + s, by + s, bx + s - cc, by + s],
    [bx + cc, by + s, bx, by + s, bx, by + s - cc],
  ].forEach((p) => {
    ctx.beginPath();
    ctx.moveTo(p[0], p[1]);
    ctx.lineTo(p[2], p[3]);
    ctx.lineTo(p[4], p[5]);
    ctx.stroke();
  });
  nfcWaves(ctx, bx + s * 0.5 - W * 0.026, by + s * 0.5, W * 0.065, "#1d1d1f", true);
  qr(ctx, qx, by, s);
  ctx.fillStyle = "#1d1d1f";
  ctx.font = `600 ${W * 0.024}px ${FONT()}`;
  ctx.fillText("NFC", bx + s * 0.5, by + s + H * 0.028);
  ctx.fillText("QR", qx + s * 0.5, by + s + H * 0.028);
  toqueLogo(ctx, cx, H * 0.91, W * 0.042);
}

// ---------- TIPO B: credencial/membrete de personal ----------
function drawB(ctx: CanvasRenderingContext2D, W: number, H: number) {
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = "#141414";
  rr(ctx, 0, 0, W, H, H * 0.17);
  ctx.fill();
  ctx.strokeStyle = "#E4002B";
  ctx.lineWidth = H * 0.022;
  rr(ctx, H * 0.014, H * 0.014, W - H * 0.028, H - H * 0.028, H * 0.156);
  ctx.stroke();
  ctx.save();
  ctx.translate(W * 0.12, H * 0.185);
  ctx.fillStyle = "#E4002B";
  ctx.beginPath();
  ctx.ellipse(0, 0, W * 0.016, H * 0.072, 0.5, 0, 7);
  ctx.fill();
  ctx.strokeStyle = "#39B54A";
  ctx.lineWidth = H * 0.02;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(W * 0.001, -H * 0.045);
  ctx.lineTo(W * 0.012, -H * 0.095);
  ctx.stroke();
  ctx.restore();
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.font = `700 italic ${H * 0.115}px ${FONT()}`;
  ctx.fillText("Chili's", W * 0.15, H * 0.185);
  ctx.fillStyle = "#9a9a9a";
  ctx.font = `600 ${H * 0.042}px ${FONT()}`;
  ctx.fillText("GRILL & BAR", W * 0.15, H * 0.275);
  toqueLogo(ctx, W * 0.95, H * 0.185, H * 0.095, "#ffffff", "right");
  ctx.strokeStyle = "rgba(255,255,255,.16)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(W * 0.06, H * 0.4);
  ctx.lineTo(W * 0.96, H * 0.4);
  ctx.stroke();
  ctx.textAlign = "left";
  ctx.fillStyle = "#ffffff";
  ctx.font = `700 ${H * 0.155}px ${FONT()}`;
  ctx.fillText("Juan Sotomayor", W * 0.06, H * 0.585);
  ctx.fillStyle = "#E4002B";
  ctx.font = `700 ${H * 0.07}px ${FONT()}`;
  ctx.fillText("M A N A G E R", W * 0.06, H * 0.72);
  const sy = H * 0.86,
    sr = H * 0.062,
    gap = H * 0.098,
    x0 = W * 0.06 + sr + W * 0.006;
  for (let i = 0; i < 5; i++) star(ctx, x0 + i * gap, sy, sr, "#e7b53c");
  nfcWaves(ctx, W * 0.87, H * 0.66, H * 0.09, "#ffffff");
}

function buildA() {
  // Placa NFC 9×9×0.5 cm (1 unidad = 2.5 cm)
  const g = new THREE.Group();
  const w = 3.6,
    h = 3.6,
    d = 0.2,
    r = 0.3;
  g.add(plateMesh(w, h, d, r, 0xffffff));
  const front = new THREE.Mesh(
    new THREE.PlaneGeometry(w, h),
    new THREE.MeshBasicMaterial({ map: cvTexture(1024, 1024, drawA), transparent: true })
  );
  front.position.z = d / 2 + 0.06;
  g.add(front);
  const back = new THREE.Mesh(
    new THREE.PlaneGeometry(w, h),
    new THREE.MeshBasicMaterial({
      map: cvTexture(512, 512, (ctx, W, H) => {
        ctx.clearRect(0, 0, W, H);
        ctx.fillStyle = "#fff";
        rr(ctx, 0, 0, W, H, W * 0.1);
        ctx.fill();
        toqueLogo(ctx, W * 0.5, H * 0.5, W * 0.07);
      }),
      transparent: true,
    })
  );
  back.position.z = -(d / 2 + 0.06);
  back.rotation.y = Math.PI;
  g.add(back);
  return g;
}

function buildB() {
  // Credencial NFC 8.5×5×0.5 cm (1 unidad = 2.5 cm)
  const g = new THREE.Group();
  const w = 3.4,
    h = 2.0,
    d = 0.2,
    r = 0.32;
  g.add(plateMesh(w, h, d, r, 0x141414, 0x0a0a0a));
  const front = new THREE.Mesh(
    new THREE.PlaneGeometry(w, h),
    new THREE.MeshBasicMaterial({ map: cvTexture(1024, 603, drawB), transparent: true })
  );
  front.position.z = d / 2 + 0.06;
  g.add(front);
  const back = new THREE.Mesh(
    new THREE.PlaneGeometry(w, h),
    new THREE.MeshBasicMaterial({
      map: cvTexture(512, 301, (ctx, W, H) => {
        ctx.clearRect(0, 0, W, H);
        ctx.fillStyle = "#141414";
        rr(ctx, 0, 0, W, H, H * 0.17);
        ctx.fill();
        toqueLogo(ctx, W * 0.5, H * 0.5, W * 0.08, "#ffffff");
      }),
      transparent: true,
    })
  );
  back.position.z = -(d / 2 + 0.06);
  back.rotation.y = Math.PI;
  g.add(back);

  // Lámina de acrílico sobre la cara frontal
  const acrylicGeo = new THREE.ExtrudeGeometry(roundedRectShape(w, h, r), {
    depth: 0.015,
    bevelEnabled: false,
    steps: 1,
  });
  const acrylic = new THREE.Mesh(
    acrylicGeo,
    new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.14,
      roughness: 0.05,
      metalness: 0,
      clearcoat: 1,
      clearcoatRoughness: 0.08,
      reflectivity: 0.6,
      depthWrite: false,
    })
  );
  acrylic.position.z = d / 2 + 0.065;
  g.add(acrylic);
  return g;
}

// Radio de la esfera envolvente de cada modelo (para encuadre responsive)
const BOUNDS: Record<ModelId, number> = {
  a: Math.hypot(3.6 / 2, 3.6 / 2, 0.2 / 2),
  b: Math.hypot(3.4 / 2, 2.0 / 2, 0.2 / 2),
};

export function ReviewCard3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sim = useRef({
    objA: null as THREE.Group | null,
    objB: null as THREE.Group | null,
    camera: null as THREE.PerspectiveCamera | null,
    maxZ: 12,
    fit: null as (() => void) | null,
    rotY: 0.4,
    rotX: -0.12,
    idle: 0,
    dragging: false,
  });
  const [model, setModel] = useState<ModelId>("a");
  const modelRef = useRef<ModelId>("a");

  useEffect(() => {
    modelRef.current = model;
    const a = model === "a";
    const { objA, objB } = sim.current;
    if (objA && objB) {
      objA.visible = a;
      objB.visible = !a;
      const current = a ? objA : objB;
      sim.current.rotY = 0.35;
      sim.current.rotX = -0.1;
      current.scale.set(0.9, 0.9, 0.9);
      sim.current.fit?.();
    }
  }, [model]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 0, 8.4);

    scene.add(new THREE.AmbientLight(0xffffff, 2.3));
    const key = new THREE.DirectionalLight(0xffffff, 2.5);
    key.position.set(4, 6, 7);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xffffff, 1.0);
    fill.position.set(-5, -2, 4);
    scene.add(fill);
    const rim = new THREE.DirectionalLight(0xffffff, 1.25);
    rim.position.set(0, 3, -6);
    scene.add(rim);

    const objA = buildA();
    const objB = buildB();
    scene.add(objA);
    scene.add(objB);
    objB.visible = modelRef.current === "b";
    objA.visible = modelRef.current === "a";
    sim.current.objA = objA;
    sim.current.objB = objB;

    const shadowTex = cvTexture(256, 256, (ctx, W, H) => {
      const g = ctx.createRadialGradient(W / 2, H / 2, 10, W / 2, H / 2, W / 2);
      g.addColorStop(0, "rgba(0,0,0,0.26)");
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
    });
    const shadow = new THREE.Mesh(
      new THREE.PlaneGeometry(6, 6),
      new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false })
    );
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = -2.2;
    scene.add(shadow);

    const st = sim.current;
    st.camera = camera;

    // Distancia para que el modelo quepa completo (esfera envolvente) en el viewport
    const fit = () => {
      const padding = modelRef.current === "b" ? 0.82 : 1.08;
      const radius = BOUNDS[modelRef.current] * padding;
      const t = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
      const limiting = t * Math.min(1, camera.aspect);
      const fitZ = radius / limiting;
      st.maxZ = Math.max(12, fitZ * 1.4);
      camera.position.z = Math.max(fitZ, Math.min(camera.position.z, st.maxZ));
    };
    st.fit = fit;

    const clampZ = (z: number) => Math.max(5.5, Math.min(st.maxZ, z));

    const pointers = new Map<number, { x: number; y: number }>();
    let lastX = 0,
      lastY = 0,
      pinchDist = 0;

    const onPointerDown = (e: PointerEvent) => {
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pointers.size === 2) {
        const [p1, p2] = [...pointers.values()];
        pinchDist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
      } else {
        st.dragging = true;
        lastX = e.clientX;
        lastY = e.clientY;
      }
      st.idle = 0;
    };
    const onPointerUp = (e: PointerEvent) => {
      pointers.delete(e.pointerId);
      if (pointers.size < 2) pinchDist = 0;
      if (pointers.size === 0) st.dragging = false;
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!pointers.has(e.pointerId)) return;
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      st.idle = 0;
      if (pointers.size === 2) {
        const [p1, p2] = [...pointers.values()];
        const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
        if (pinchDist > 0) camera.position.z = clampZ(camera.position.z * (pinchDist / dist));
        pinchDist = dist;
        return;
      }
      if (!st.dragging) return;
      st.rotY += (e.clientX - lastX) * 0.01;
      st.rotX += (e.clientY - lastY) * 0.01;
      st.rotX = Math.max(-0.9, Math.min(0.9, st.rotX));
      lastX = e.clientX;
      lastY = e.clientY;
    };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      camera.position.z = clampZ(camera.position.z + e.deltaY * 0.01);
    };

    canvas.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);
    window.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("wheel", onWheel, { passive: false });

    const resize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      fit();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(container);
    resize();

    const autoV = 0.004;
    let frame = 0;
    const loop = () => {
      frame = requestAnimationFrame(loop);
      if (!st.dragging) {
        st.idle++;
        if (st.idle > 60 && !reduceMotion) st.rotY += autoV;
      }
      const current = modelRef.current === "a" ? objA : objB;
      current.rotation.y = st.rotY;
      current.rotation.x = st.rotX;
      current.scale.x += (1 - current.scale.x) * 0.12;
      current.scale.y = current.scale.x;
      current.scale.z = current.scale.x;
      renderer.render(scene, camera);
    };
    loop();

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      canvas.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
      window.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("wheel", onWheel);
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
          mats.forEach((m) => {
            const mat = m as THREE.MeshBasicMaterial;
            mat.map?.dispose();
            mat.dispose();
          });
        }
      });
      renderer.dispose();
      st.objA = null;
      st.objB = null;
      st.camera = null;
      st.fit = null;
    };
  }, []);

  return (
    <div className="relative flex h-[400px] w-full flex-col overflow-hidden rounded-3xl bg-[var(--secondary)] select-none sm:h-[480px] md:h-[560px]">
      <div className="absolute top-3 left-1/2 z-10 -translate-x-1/2 sm:top-4">
        <div className="inline-flex rounded-full border border-[var(--border)] bg-white p-1">
          {(["a", "b"] as const).map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => setModel(id)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium whitespace-nowrap transition sm:px-4 sm:py-2 sm:text-sm ${
                model === id
                  ? "bg-[var(--primary)] text-white"
                  : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              }`}
            >
              {id === "a" ? "Tipo A · Google" : "Tipo B · Personal"}
            </button>
          ))}
        </div>
      </div>

      <div ref={containerRef} className="min-h-0 flex-1">
        <canvas
          ref={canvasRef}
          className="block h-full w-full cursor-grab touch-pan-y active:cursor-grabbing"
          aria-label="Modelo 3D interactivo de placa NFC"
        />
      </div>

      <div className="pointer-events-none absolute bottom-4 left-1/2 z-10 -translate-x-1/2 rounded-full border border-[var(--border)] bg-white/80 px-3.5 py-1.5 text-xs whitespace-nowrap text-[var(--muted-foreground)] backdrop-blur">
        Arrastra para girar<span className="hidden sm:inline"> · rueda o pellizca para acercar</span>
      </div>
    </div>
  );
}
