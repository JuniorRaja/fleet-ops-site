import gsap from "gsap";
import {
  AmbientLight,
  BoxGeometry,
  CanvasTexture,
  DirectionalLight,
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Raycaster,
  Scene,
  SRGBColorSpace,
  Vector2,
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

const SLOTS = [
  { x: -1.45, y: 1.22, z: -1.25, scale: 0.7, rz: -0.06 },
  { x: -1.03, y: 0.8, z: -0.86, scale: 0.76, rz: -0.035 },
  { x: -0.61, y: 0.39, z: -0.47, scale: 0.82, rz: -0.015 },
  { x: -0.17, y: -0.03, z: -0.08, scale: 0.88, rz: 0.008 },
  { x: 0.29, y: -0.45, z: 0.31, scale: 0.94, rz: 0.026 },
  { x: 0.78, y: -0.86, z: 0.7, scale: 1, rz: 0.045 },
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
  g.fillStyle = "rgba(255,255,255,.75)";
  g.font = '500 21px "JetBrains Mono Variable", ui-monospace, monospace';
  g.fillText(d.form, 38, 58);
  g.fillStyle = "#ffffff";
  g.font = '700 56px "Bricolage Grotesque Variable", "Inter Variable", sans-serif';
  g.fillText(d.title[0], 36, 120);
  g.fillText(d.title[1], 36, 176);
  g.fillStyle = "rgba(11,15,13,.1)";
  [0.88, 0.72, 0.94, 0.6, 0.8, 0.46].forEach((w, i) => g.fillRect(38, 246 + i * 27, (W - 76) * w, 9));
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

function drawShadow(): HTMLCanvasElement {
  const S = 128;
  const c = document.createElement("canvas");
  c.width = S;
  c.height = S;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
  grad.addColorStop(0, "rgba(0,0,0,.62)");
  grad.addColorStop(0.58, "rgba(0,0,0,.2)");
  grad.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, S, S);
  return c;
}

export async function mountHeroScene(host: HTMLElement, opts: Opts = {}): Promise<() => void> {
  try {
    await Promise.race([
      document.fonts.load('700 40px "Bricolage Grotesque Variable"'),
      new Promise((resolve) => setTimeout(resolve, 900)),
    ]);
  } catch {
    /* Canvas textures can use fallback fonts. */
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
    cursor: "grab",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = SRGBColorSpace;
  host.appendChild(canvas);

  const scene = new Scene();
  const camera = new PerspectiveCamera(31, 1, 0.1, 60);
  scene.add(new AmbientLight(0xffffff, 1.8));
  const key = new DirectionalLight(0xffffff, 2.2);
  key.position.set(-4, 7, 8);
  scene.add(key);

  const disposables: { dispose: () => void }[] = [];
  const track = <T extends { dispose: () => void }>(item: T): T => {
    disposables.push(item);
    return item;
  };

  const shadowTexture = track(new CanvasTexture(drawShadow()));
  const shadowGeometry = track(new PlaneGeometry(2.75, 3.55));
  const paperGeometry = track(new BoxGeometry(2.42, 3.18, 0.04));
  const edgeMaterial = track(new MeshStandardMaterial({ color: 0xeeeae0, roughness: 0.92 }));
  const backMaterial = track(new MeshStandardMaterial({ color: 0xe6e2d8, roughness: 0.96 }));
  const world = new Group();
  world.position.set(0.15, -0.05, 0);
  scene.add(world);

  const items = DOCS.map((doc, index) => {
    const texture = track(new CanvasTexture(drawPaper(doc)));
    texture.colorSpace = SRGBColorSpace;
    texture.anisotropy = 4;
    const frontMaterial = track(new MeshStandardMaterial({ map: texture as Texture, roughness: 0.86 }));
    const materials: Material[] = [edgeMaterial, edgeMaterial, edgeMaterial, edgeMaterial, frontMaterial, backMaterial];
    const holder = new Group();
    const hover = new Group();
    const wiggle = new Group();
    const float = new Group();
    const mesh = new Mesh(paperGeometry, materials);
    mesh.userData.index = index;
    const shadowMaterial = track(
      new MeshBasicMaterial({ map: shadowTexture, transparent: true, depthWrite: false, opacity: 0.28 })
    );
    const shadow = new Mesh(shadowGeometry, shadowMaterial);
    shadow.position.set(0.14, -0.15, -0.075);
    shadow.renderOrder = 0;
    mesh.renderOrder = index + 1;
    float.add(shadow, mesh);
    wiggle.add(float);
    hover.add(wiggle);
    holder.add(hover);
    world.add(holder);
    return { holder, hover, wiggle, float, mesh };
  });

  const order = items.map((_, index) => index);
  const activeTweens = new Set<gsap.core.Animation>();
  let cycling = false;
  let lastCycle = performance.now();

  const tween = (target: gsap.TweenTarget, vars: gsap.TweenVars) => {
    const complete = vars.onComplete;
    const animation = gsap.to(target, {
      ...vars,
      onComplete: () => {
        activeTweens.delete(animation);
        if (typeof complete === "function") complete();
      },
    });
    activeTweens.add(animation);
    return animation;
  };

  const arrange = (immediate = false) => {
    order.forEach((itemIndex, slotIndex) => {
      const slot = SLOTS[slotIndex];
      const item = items[itemIndex];
      item.mesh.renderOrder = slotIndex + 2;
      if (immediate) {
        item.holder.position.set(slot.x, slot.y, slot.z);
        item.holder.rotation.set(0, 0, slot.rz);
        item.holder.scale.setScalar(slot.scale);
        return;
      }
      const shared = { duration: 0.78, ease: "power3.inOut", overwrite: "auto" as const };
      tween(item.holder.position, { x: slot.x, y: slot.y, z: slot.z, ...shared });
      tween(item.holder.rotation, { z: slot.rz, ...shared });
      tween(item.holder.scale, { x: slot.scale, y: slot.scale, z: slot.scale, ...shared });
    });
  };
  arrange(true);

  const cycle = () => {
    if (cycling) return;
    cycling = true;
    const next = order.shift();
    if (next === undefined) return;
    order.push(next);
    const arriving = items[next];
    arriving.hover.position.z = -0.16;
    arriving.wiggle.rotation.y = -0.11;
    arrange();
    tween(arriving.hover.position, { z: 0, duration: 0.68, ease: "power3.out", delay: 0.12 });
    tween(arriving.wiggle.rotation, {
      y: 0,
      duration: 0.72,
      ease: "power3.out",
      delay: 0.12,
      onComplete: () => {
        cycling = false;
      },
    });
  };

  const pointer = new Vector2(0, 0);
  const raycaster = new Raycaster();
  let hovered: number | null = null;
  let pointerInside = false;

  const pick = (event: PointerEvent) => {
    const rect = canvas.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    const hit = raycaster.intersectObjects(items.map((item) => item.mesh), false)[0];
    hovered = hit ? (hit.object.userData.index as number) : null;
    canvas.style.cursor = hovered === null ? "grab" : "pointer";
  };

  const onPointerMove = (event: PointerEvent) => {
    if (event.pointerType !== "mouse") return;
    pointerInside = true;
    pick(event);
  };
  const onPointerLeave = () => {
    pointerInside = false;
    hovered = null;
    pointer.set(0, 0);
    canvas.style.cursor = "grab";
    lastCycle = performance.now();
  };
  const onClick = (event: MouseEvent) => {
    pick(event as unknown as PointerEvent);
    const index = hovered ?? order[order.length - 1];
    const item = items[index];
    gsap.killTweensOf(item.wiggle.rotation);
    gsap.killTweensOf(item.wiggle.scale);
    const timeline = gsap.timeline({ onComplete: () => {
      activeTweens.delete(timeline);
    } });
    activeTweens.add(timeline);
    timeline
      .to(item.wiggle.scale, { x: 0.975, y: 1.02, duration: 0.07, ease: "power2.in" })
      .to(item.wiggle.rotation, { z: 0.09, duration: 0.07, ease: "power2.out" }, 0)
      .to(item.wiggle.rotation, { z: -0.065, duration: 0.08, ease: "power2.inOut" })
      .to(item.wiggle.rotation, { z: 0.025, duration: 0.07, ease: "power2.inOut" })
      .to(item.wiggle.rotation, { z: 0, duration: 0.15, ease: "power3.out" })
      .to(item.wiggle.scale, { x: 1, y: 1, duration: 0.16, ease: "power3.out" }, "-=0.15");
  };
  canvas.addEventListener("pointermove", onPointerMove, { passive: true });
  canvas.addEventListener("pointerleave", onPointerLeave);
  canvas.addEventListener("click", onClick);

  const resize = () => {
    const width = Math.max(host.clientWidth, 2);
    const height = Math.max(host.clientHeight, 2);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    const fit = Math.max(1, 0.9 / camera.aspect);
    camera.position.set(0, 0, 10.4 * fit);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  };
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(host);
  resize();

  const update = (now: number) => {
    const seconds = now / 1000;
    if (!pointerInside && !cycling && now - lastCycle > 3200) {
      cycle();
      lastCycle = now;
    }
    world.rotation.y += (pointer.x * 0.065 - world.rotation.y) * 0.055;
    world.rotation.x += (-pointer.y * 0.04 - world.rotation.x) * 0.055;
    items.forEach((item, index) => {
      const hot = index === hovered;
      const targetX = hot ? pointer.x * 0.13 : 0;
      const targetY = hot ? pointer.y * 0.08 + 0.08 : 0;
      const targetZ = hot ? 0.22 : 0;
      item.hover.position.x += (targetX - item.hover.position.x) * 0.14;
      item.hover.position.y += (targetY - item.hover.position.y) * 0.14;
      item.hover.position.z += (targetZ - item.hover.position.z) * 0.14;
      item.hover.rotation.x += ((hot ? -pointer.y * 0.055 : 0) - item.hover.rotation.x) * 0.12;
      item.hover.rotation.y += ((hot ? pointer.x * 0.07 : 0) - item.hover.rotation.y) * 0.12;
      item.float.position.y = Math.sin(seconds * 0.8 + index * 0.9) * 0.018;
    });
  };

  let frame = 0;
  let running = false;
  const loop = (now: number) => {
    frame = requestAnimationFrame(loop);
    update(now);
    renderer.render(scene, camera);
  };
  const start = () => {
    if (running) return;
    running = true;
    frame = requestAnimationFrame(loop);
  };
  const stop = () => {
    running = false;
    cancelAnimationFrame(frame);
  };

  const intersectionObserver = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting && !document.hidden) start();
    else stop();
  });
  intersectionObserver.observe(host);
  const onVisibility = () => (document.hidden ? stop() : start());
  document.addEventListener("visibilitychange", onVisibility);
  const onContextLost = (event: Event) => {
    event.preventDefault();
    stop();
    canvas.style.display = "none";
    opts.onFail?.();
  };
  canvas.addEventListener("webglcontextlost", onContextLost);

  update(performance.now());
  renderer.render(scene, camera);
  requestAnimationFrame(() => {
    canvas.style.opacity = "1";
    opts.onReady?.();
  });

  return () => {
    stop();
    intersectionObserver.disconnect();
    resizeObserver.disconnect();
    document.removeEventListener("visibilitychange", onVisibility);
    canvas.removeEventListener("pointermove", onPointerMove);
    canvas.removeEventListener("pointerleave", onPointerLeave);
    canvas.removeEventListener("click", onClick);
    canvas.removeEventListener("webglcontextlost", onContextLost);
    activeTweens.forEach((animation) => animation.kill());
    items.forEach((item) => {
      gsap.killTweensOf(item.holder.position);
      gsap.killTweensOf(item.holder.rotation);
      gsap.killTweensOf(item.holder.scale);
      gsap.killTweensOf(item.hover.position);
      gsap.killTweensOf(item.wiggle.rotation);
      gsap.killTweensOf(item.wiggle.scale);
    });
    disposables.forEach((item) => item.dispose());
    renderer.dispose();
    renderer.forceContextLoss();
    canvas.remove();
  };
}
