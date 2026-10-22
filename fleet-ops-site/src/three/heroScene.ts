import {
  AmbientLight,
  BoxGeometry,
  CanvasTexture,
  DirectionalLight,
  Group,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  SRGBColorSpace,
  WebGLRenderer,
  type Material,
  type Texture,
} from "three";

interface Opts {
  onReady?: () => void;
  onFail?: () => void;
}

interface Doc {
  form: string;
  title: [string, string];
  code: string;
  color: string;
  valid: string;
}

const DOCS: Doc[] = [
  { form: "FORM 38", title: ["Fitness", "Certificate"], code: "PAPER-DOC-FIT-01", color: "#087a4d", valid: "03/27" },
  { form: "COMMERCIAL VEHICLE", title: ["Insurance", "Policy"], code: "PAPER-DOC-INS-01", color: "#3a45a8", valid: "11/26" },
  { form: "EMISSION TEST", title: ["Pollution", "Under Control"], code: "PAPER-DOC-PUC-01", color: "#5d7a14", valid: "04/27" },
  { form: "GOODS CARRIAGE", title: ["National", "Permit"], code: "PAPER-DOC-PER-01", color: "#a2501a", valid: "08/27" },
  { form: "FORM 23", title: ["Registration", "Certificate"], code: "PAPER-DOC-RC-01", color: "#37465a", valid: "01/31" },
  { form: "STATE TRANSPORT", title: ["Road Tax", "Receipt"], code: "PAPER-DOC-TAX-01", color: "#7b2f66", valid: "12/26" },
];

/** Where each paper hovers: x/z on the desk, height, yaw and slight tilt. */
const SLOTS = [
  { x: -2.7, z: -0.8, h: 0.55, ry: 0.38, rx: 0.05, rz: -0.04 },
  { x: -0.7, z: -1.7, h: 1.15, ry: -0.28, rx: -0.04, rz: 0.05 },
  { x: 1.55, z: -0.95, h: 0.85, ry: 0.5, rx: 0.06, rz: 0.03 },
  { x: -1.85, z: 1.55, h: 1.7, ry: -0.5, rx: -0.06, rz: -0.06 },
  { x: 0.45, z: 1.2, h: 1.25, ry: 0.22, rx: 0.04, rz: 0.04 },
  { x: 2.65, z: 1.4, h: 2.2, ry: -0.36, rx: -0.05, rz: 0.07 },
];

function drawPaper(d: Doc): HTMLCanvasElement {
  const W = 480;
  const H = 636;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const g = c.getContext("2d")!;
  g.fillStyle = "#fbfaf6";
  g.fillRect(0, 0, W, H);
  g.fillStyle = d.color;
  g.fillRect(0, 0, W, 204);
  g.textBaseline = "alphabetic";
  g.fillStyle = "rgba(255,255,255,.75)";
  g.font = '500 21px "JetBrains Mono Variable", ui-monospace, monospace';
  g.fillText(d.form, 38, 58);
  g.fillStyle = "#ffffff";
  g.font = '700 56px "Bricolage Grotesque Variable", "Inter Variable", sans-serif';
  g.fillText(d.title[0], 36, 120);
  g.fillText(d.title[1], 36, 176);
  g.fillStyle = "rgba(11,15,13,.1)";
  [0.88, 0.72, 0.94, 0.6, 0.8, 0.46].forEach((w, i) => {
    g.fillRect(38, 246 + i * 27, (W - 76) * w, 9);
  });
  g.save();
  g.translate(W - 112, H - 152);
  g.rotate(-0.2);
  g.globalAlpha = 0.85;
  g.strokeStyle = d.color;
  g.fillStyle = d.color;
  g.lineWidth = 5;
  g.beginPath();
  g.arc(0, 0, 60, 0, Math.PI * 2);
  g.stroke();
  g.textAlign = "center";
  g.font = '700 17px "JetBrains Mono Variable", ui-monospace, monospace';
  g.fillText("VALID", 0, -12);
  g.fillText("TILL", 0, 8);
  g.fillText(d.valid, 0, 28);
  g.restore();
  g.textAlign = "left";
  g.fillStyle = "rgba(11,15,13,.5)";
  g.font = '500 17px "JetBrains Mono Variable", ui-monospace, monospace';
  g.fillText(d.code, 38, H - 26);
  g.strokeStyle = "rgba(11,15,13,.1)";
  g.lineWidth = 2;
  g.strokeRect(1, 1, W - 2, H - 2);
  return c;
}

function drawMat(): HTMLCanvasElement {
  const S = 1024;
  const c = document.createElement("canvas");
  c.width = S;
  c.height = S;
  const g = c.getContext("2d")!;
  g.fillStyle = "#e3e0d4";
  g.fillRect(0, 0, S, S);
  g.lineWidth = 2;
  for (let i = 0; i <= S; i += 64) {
    g.strokeStyle = i % 256 === 0 ? "rgba(11,15,13,.16)" : "rgba(11,15,13,.07)";
    g.beginPath();
    g.moveTo(i, 0);
    g.lineTo(i, S);
    g.stroke();
    g.beginPath();
    g.moveTo(0, i);
    g.lineTo(S, i);
    g.stroke();
  }
  g.globalCompositeOperation = "destination-in";
  const grad = g.createRadialGradient(S / 2, S / 2, S * 0.16, S / 2, S / 2, S * 0.5);
  grad.addColorStop(0, "rgba(0,0,0,1)");
  grad.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, S, S);
  return c;
}

function drawBlob(): HTMLCanvasElement {
  const S = 128;
  const c = document.createElement("canvas");
  c.width = S;
  c.height = S;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
  grad.addColorStop(0, "rgba(0,0,0,.9)");
  grad.addColorStop(0.5, "rgba(0,0,0,.35)");
  grad.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, S, S);
  return c;
}

export async function mountHeroScene(host: HTMLElement, opts: Opts = {}): Promise<() => void> {
  try {
    await Promise.race([
      document.fonts.load('700 40px "Bricolage Grotesque Variable"'),
      new Promise((r) => setTimeout(r, 900)),
    ]);
  } catch {
    /* fonts are optional for the textures */
  }

  let renderer: WebGLRenderer;
  try {
    renderer = new WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
  } catch {
    opts.onFail?.();
    return () => {};
  }

  const canvas = renderer.domElement;
  canvas.setAttribute("aria-hidden", "true");
  canvas.setAttribute("role", "presentation");
  Object.assign(canvas.style, {
    position: "absolute",
    inset: "0",
    width: "100%",
    height: "100%",
    opacity: "0",
    transition: "opacity 500ms cubic-bezier(.22,.61,.36,1)",
    zIndex: "1",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.setClearColor(0x000000, 0);
  host.appendChild(canvas);

  const scene = new Scene();
  const camera = new PerspectiveCamera(28, 1, 0.1, 60);
  scene.add(new AmbientLight(0xffffff, 1.5));
  const sun = new DirectionalLight(0xffffff, 2.0);
  sun.position.set(-4, 8, 5);
  scene.add(sun);

  const disposables: { dispose: () => void }[] = [];
  const track = <T extends { dispose: () => void }>(o: T): T => {
    disposables.push(o);
    return o;
  };

  // Desk mat
  const matTex = track(new CanvasTexture(drawMat()));
  matTex.colorSpace = SRGBColorSpace;
  const mat = new Mesh(
    track(new PlaneGeometry(13, 13)),
    track(new MeshBasicMaterial({ map: matTex, transparent: true, depthWrite: false }))
  );
  mat.rotation.x = -Math.PI / 2;
  mat.renderOrder = 0;
  scene.add(mat);

  const blobTex = track(new CanvasTexture(drawBlob()));
  const shadowGeo = track(new PlaneGeometry(1, 1));
  const paperGeo = track(new BoxGeometry(1.5, 0.014, 1.98));
  const sideMat = track(new MeshStandardMaterial({ color: 0xf1efe7, roughness: 0.95 }));
  const backMat = track(new MeshStandardMaterial({ color: 0xe9e6dc, roughness: 0.95 }));

  const world = new Group();
  scene.add(world);

  const items = DOCS.map((doc, i) => {
    const s = SLOTS[i];
    const tex = track(new CanvasTexture(drawPaper(doc)));
    tex.colorSpace = SRGBColorSpace;
    tex.anisotropy = 4;
    const top = track(new MeshStandardMaterial({ map: tex as Texture, roughness: 0.9 }));
    const materials: Material[] = [sideMat, sideMat, top, backMat, sideMat, sideMat];
    const holder = new Group();
    holder.position.set(s.x, s.h, s.z);
    holder.rotation.set(s.rx, s.ry, s.rz);
    holder.add(new Mesh(paperGeo, materials));
    world.add(holder);

    const shadowMat = track(
      new MeshBasicMaterial({ map: blobTex, transparent: true, depthWrite: false, color: 0x000000, opacity: 0.35 })
    );
    const shadow = new Mesh(shadowGeo, shadowMat);
    shadow.rotation.set(-Math.PI / 2, 0, s.ry);
    shadow.position.y = 0.01;
    shadow.renderOrder = 1;
    world.add(shadow);
    return { s, holder, shadow, shadowMat };
  });

  const pointer = { x: 0, y: 0 };
  const onPointer = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    pointer.x = (e.clientX / window.innerWidth - 0.5) * 2;
    pointer.y = (e.clientY / window.innerHeight - 0.5) * 2;
  };
  window.addEventListener("pointermove", onPointer, { passive: true });

  const resize = () => {
    const w = Math.max(host.clientWidth, 2);
    const h = Math.max(host.clientHeight, 2);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    const fit = Math.max(1, 1.12 / camera.aspect);
    camera.position.set(0, 6.9 * fit, 8.1 * fit);
    camera.lookAt(0, 0.4, 0);
    camera.updateProjectionMatrix();
  };
  const ro = new ResizeObserver(resize);
  ro.observe(host);
  resize();

  const update = (now: number) => {
    const t = now / 1000;
    const sp = MathUtils.clamp(window.scrollY / Math.max(window.innerHeight, 1), 0, 1);
    world.rotation.y += (pointer.x * 0.2 - world.rotation.y) * 0.05;
    world.rotation.x += (pointer.y * 0.07 - world.rotation.x) * 0.05;
    items.forEach(({ s, holder, shadow, shadowMat }, i) => {
      const bob = Math.sin(t * 0.7 + i * 1.3) * 0.09;
      const h = s.h + bob + sp * (0.5 + i * 0.18);
      holder.position.y = h;
      holder.rotation.x = s.rx + Math.cos(t * 0.45 + i * 0.7) * 0.022;
      holder.rotation.z = s.rz + Math.sin(t * 0.5 + i) * 0.026;
      shadow.position.x = s.x + h * 0.3;
      shadow.position.z = s.z + h * 0.24;
      shadow.scale.set(1.9 + h * 0.6, 2.4 + h * 0.6, 1);
      shadowMat.opacity = 0.46 / (1 + h * 0.8);
    });
  };

  let raf = 0;
  let running = false;
  const loop = (now: number) => {
    raf = requestAnimationFrame(loop);
    update(now);
    renderer.render(scene, camera);
  };
  const start = () => {
    if (running) return;
    running = true;
    raf = requestAnimationFrame(loop);
  };
  const stop = () => {
    running = false;
    cancelAnimationFrame(raf);
  };

  const io = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting && !document.hidden) start();
    else stop();
  });
  io.observe(host);
  const onVisibility = () => {
    if (document.hidden) stop();
  };
  document.addEventListener("visibilitychange", onVisibility);

  const onLost = (e: Event) => {
    e.preventDefault();
    stop();
    canvas.style.display = "none";
    opts.onFail?.();
  };
  canvas.addEventListener("webglcontextlost", onLost);

  update(performance.now());
  renderer.render(scene, camera);
  requestAnimationFrame(() => {
    canvas.style.opacity = "1";
    opts.onReady?.();
  });

  return () => {
    stop();
    io.disconnect();
    ro.disconnect();
    window.removeEventListener("pointermove", onPointer);
    document.removeEventListener("visibilitychange", onVisibility);
    canvas.removeEventListener("webglcontextlost", onLost);
    disposables.forEach((d) => d.dispose());
    renderer.dispose();
    renderer.forceContextLoss();
    canvas.remove();
  };
}
