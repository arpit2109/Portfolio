// Reusable interactive VRM avatar (VRoid / VRM 0.x or 1.0).
// Head, neck and spine follow the cursor, eyes via VRM lookAt, expressions, blink, breathing, wave.
// Usage:
//   import { createAvatar } from './avatar.js';
//   const av = await createAvatar(containerEl, { modelUrl: './assets/AvatarSample_C.vrm', theme: 'dark' });
//   av.setTheme('light'); av.wave(); av.captureImage();
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { VRMLoaderPlugin, VRMUtils } from '@pixiv/three-vrm';

const LIMITS = { yaw: 1.0, pitch: 0.6 };
const SHARE = { head: 0.55, neck: 0.25, chest: 0.12, spine: 0.08 };
const ALIASES = { surprised: ['surprised', 'Surprised'], happy: ['happy', 'joy'], relaxed: ['relaxed', 'fun'], aa: ['aa', 'a'] };
const THEMES = {
  dark:  { key: 0xffffff, keyI: Math.PI * 0.95, rimI: Math.PI * 0.35, ambient: 0.25, shadow: 0.4 },
  light: { key: 0xfff6ea, keyI: Math.PI * 1.05, rimI: Math.PI * 0.25, ambient: 0.5,  shadow: 0.22 },
};
const damp = (a, b, k, dt) => THREE.MathUtils.damp(a, b, k, dt);
const clamp = THREE.MathUtils.clamp;

export function createAvatar(container, opts = {}) {
  const {
    modelUrl, theme = 'dark', accent = '#ff6b3d', listen = true, framing = 'half',
    anchorX = 0.5,          // where the model sits across the canvas width (0 = left edge, 1 = right edge)
    onFrame = null, onProgress = null,
  } = opts;

  // ---------- renderer / scene ----------
  // preserveDrawingBuffer so page snapshots (html-to-image, toDataURL) always see the latest frame
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance', preserveDrawingBuffer: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.shadowMap.enabled = true;
  container.appendChild(renderer.domElement);
  Object.assign(renderer.domElement.style, { display: 'block', width: '100%', height: '100%' });

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(26, 1, 0.05, 50);
  const CAMERA_HOME = new THREE.Vector3(0, 1.35, 1.6);
  const CAMERA_TARGET = new THREE.Vector3(0, 1.25, 0);

  const key = new THREE.DirectionalLight(0xffffff, Math.PI * 0.95);
  key.position.set(0.8, 2.4, 2.2);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.bias = -0.0003;
  key.shadow.camera.near = 0.5; key.shadow.camera.far = 8;
  key.shadow.camera.left = key.shadow.camera.bottom = -1.4;
  key.shadow.camera.right = key.shadow.camera.top = 1.4;
  scene.add(key);
  const rim = new THREE.DirectionalLight(new THREE.Color(accent), Math.PI * 0.35); rim.position.set(-2, 1.8, -1.5); scene.add(rim);
  const ambient = new THREE.AmbientLight(0xffffff, 0.25); scene.add(ambient);
  const ground = new THREE.Mesh(new THREE.CircleGeometry(1.4, 64), new THREE.ShadowMaterial({ opacity: 0.4 }));
  ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; scene.add(ground);

  // ---------- state ----------
  let vrm = null, isVRM0 = false, headHeight = 1.5, disposed = false;
  const armSign = { left: 1, right: -1 };
  const bones = {};
  const headWorld = new THREE.Vector3();
  const lookTarget = new THREE.Object3D(); scene.add(lookTarget);
  const look = { yaw: 0, pitch: 0, tYaw: 0, tPitch: 0 };
  const mood = { smile: 0, tSmile: 0, surprise: 0, tSurprise: 0, mouth: 0, tMouth: 0, label: 'idle' };
  const pointer = { x: 0, y: 0, has: false, speed: 0, lastX: 0, lastY: 0, still: 0, nearFace: 0 };
  let wave = -1, blinkT = 2, blink = 0, t = 0;
  // scripted reactions from the page (a theme tear, a click somewhere): temporary look target + expression override
  const override = { glance: null, expr: null };
  const clock = new THREE.Clock();
  const _v = new THREE.Vector3();

  let viewShift = 0;   // world-space x offset that places the model at anchorX of the viewport
  function computeShift() {
    const half = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * CAMERA_HOME.z * camera.aspect;
    viewShift = -(anchorX - 0.5) * 2 * half;
  }
  function resize() {
    const w = container.clientWidth || 1, h = container.clientHeight || 1;
    renderer.setSize(w, h, false);
    camera.aspect = w / h; camera.updateProjectionMatrix();
    computeShift();
  }
  const ro = new ResizeObserver(resize); ro.observe(container); resize();

  function setTheme(name) {
    const th = THEMES[name] || THEMES.dark;
    key.color.setHex(th.key); key.intensity = th.keyI; rim.intensity = th.rimI; ambient.intensity = th.ambient; ground.material.opacity = th.shadow;
  }
  setTheme(theme);

  // ---------- input ----------
  function setPointer(nx, ny, has = true) {
    if (has) {
      pointer.speed = Math.min(1, pointer.speed * 0.7 + Math.hypot(nx - pointer.lastX, ny - pointer.lastY) * 6);
      pointer.lastX = nx; pointer.lastY = ny; pointer.x = nx; pointer.y = ny; pointer.still = 0;
    }
    pointer.has = has;
  }
  const onMove = (e) => setPointer((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1, true);
  const onDown = (e) => {
    onMove(e);
    if (!vrm) return;
    const v = headWorld.clone().project(camera);
    const d = Math.hypot((pointer.x - v.x) * camera.aspect, pointer.y - v.y);
    if (d < 0.6 && wave < 0) { wave = 0; mood.tMouth = 0.7; }
  };
  const onLeave = () => { pointer.has = false; };
  if (listen) {
    addEventListener('pointermove', onMove, { passive: true });
    addEventListener('pointerdown', onDown);
    document.addEventListener('mouseleave', onLeave);
  }

  // ---------- helpers ----------
  function setExpr(name, v) {
    const em = vrm?.expressionManager; if (!em) return;
    for (const n of (ALIASES[name] || [name])) { if (em.getExpression(n)) { em.setValue(n, clamp(v, 0, 1)); return; } }
  }
  const s = () => (isVRM0 ? -1 : 1);
  function setBone(b, pitch, yaw, roll) { if (b) b.rotation.set(s() * pitch, yaw, s() * roll, 'YXZ'); }

  // ---------- per frame ----------
  function update(dt) {
    if (!vrm) return;
    t += dt;
    bones.head.getWorldPosition(headWorld);

    const now = performance.now();
    const g = override.glance && now < override.glance.until ? override.glance : null;
    const PX = g ? g.x : pointer.x, PY = g ? g.y : pointer.y, HAS = g ? true : pointer.has;
    const planeZ = headWorld.z + 0.45;
    _v.set(PX, PY, 0.5).unproject(camera);
    const dir = _v.sub(camera.position).normalize();
    const target = camera.position.clone().addScaledVector(dir, (planeZ - camera.position.z) / dir.z);

    if (HAS) {
      const dx = target.x - headWorld.x, dy = target.y - headWorld.y, dz = target.z - headWorld.z;
      look.tYaw = clamp(Math.atan2(dx, dz), -LIMITS.yaw, LIMITS.yaw);
      look.tPitch = clamp(-Math.atan2(dy, Math.hypot(dx, dz)), -LIMITS.pitch, LIMITS.pitch);
      lookTarget.position.copy(target);
      const fs = headWorld.clone().project(camera);
      const d = Math.hypot((PX - fs.x) * camera.aspect, PY - fs.y);
      pointer.nearFace = g ? 0 : clamp(1 - d / 0.5, 0, 1);
    } else {
      look.tYaw = Math.sin(t * 0.35) * 0.2; look.tPitch = Math.sin(t * 0.5 + 1.3) * 0.06;
      lookTarget.position.set(Math.sin(t * 0.35) * 0.6, headWorld.y + Math.sin(t * 0.5 + 1.3) * 0.1, headWorld.z + 2);
      pointer.nearFace = 0;
    }
    pointer.still += dt;
    pointer.speed = damp(pointer.speed, 0, 4, dt);

    const restSmile = pointer.has ? 0.12 : 0.05;
    mood.tSmile = restSmile + pointer.nearFace * 0.75 * clamp(pointer.still * 1.6, 0, 1);
    mood.tSurprise = Math.max(damp(mood.tSurprise, 0, 1.8, dt), clamp(pointer.speed * 2.2 - 0.25, 0, 1));
    mood.smile = damp(mood.smile, mood.tSmile, 5, dt);
    mood.surprise = damp(mood.surprise, mood.tSurprise, 8, dt);
    mood.mouth = damp(mood.mouth, mood.tMouth, 7, dt); mood.tMouth = damp(mood.tMouth, 0, 3, dt);
    let smileNow = Math.max(mood.smile, wave >= 0 ? 0.55 : 0) * (1 - mood.surprise * 0.8);
    let surpriseNow = mood.surprise, sadNow = 0, angryNow = 0;
    const ex = override.expr && now < override.expr.until ? override.expr : null;
    if (ex) {
      const k = clamp((ex.until - now) / 350, 0, 1) * clamp((now - ex.from) / 120, 0, 1);   // ease in, fade out
      smileNow = Math.max(smileNow, ex.happy * k); surpriseNow = Math.max(surpriseNow, ex.surprise * k);
      sadNow = ex.sad * k; angryNow = ex.angry * k;
    }
    smileNow = Math.min(smileNow, wave >= 0 ? 0.6 : 0.45);
    setExpr('happy', smileNow);
    setExpr('surprised', surpriseNow);
    setExpr('sad', sadNow); setExpr('angry', angryNow);
    setExpr('aa', Math.max(mood.mouth, surpriseNow * 0.35));
    setExpr('relaxed', pointer.has ? 0 : 0.25);

    blinkT -= dt;
    if (blinkT <= 0) { blinkT = 2.4 + Math.random() * 3.2; blink = 1; }
    blink = Math.max(0, blink - dt * 6.5);
    setExpr('blink', Math.sin((1 - blink) * Math.PI) * (1 - surpriseNow));

    look.yaw = damp(look.yaw, look.tYaw, 6.5, dt);
    look.pitch = damp(look.pitch, look.tPitch, 6.5, dt);
    const tilt = (smileNow - 0.1) * 0.22 * Math.sign(look.yaw || 1);
    const breathe = Math.sin(t * 1.5) * 0.015;
    const flinch = ex ? ex.flinch * clamp((ex.until - now) / 350, 0, 1) : 0;   // lean back from a shock
    setBone(bones.spine, look.pitch * SHARE.spine + breathe * 0.5 - flinch * 0.05, look.yaw * SHARE.spine, 0);
    setBone(bones.chest, look.pitch * SHARE.chest + breathe - flinch * 0.06, look.yaw * SHARE.chest, 0);
    setBone(bones.upperChest, breathe * 0.5, 0, 0);
    setBone(bones.neck, look.pitch * SHARE.neck - flinch * 0.05, look.yaw * SHARE.neck, tilt * 0.35);
    setBone(bones.head, look.pitch * SHARE.head - surpriseNow * 0.08 - flinch * 0.08, look.yaw * SHARE.head, tilt);

    const sway = Math.sin(t * 0.55) * 0.025;
    setBone(bones.hips, 0, sway * 0.6, sway * 0.5);
    const down = 1.2, sw = Math.sin(t * 0.55 + 0.4) * 0.03;
    const L = armSign.left, R = armSign.right;
    bones.leftUpperArm.rotation.set(0.05, 0, -L * (down + sw), 'XYZ');
    bones.rightUpperArm.rotation.set(0.05, 0, -R * (down - sw), 'XYZ');
    bones.leftLowerArm.rotation.set(0, L * 0.35, -L * 0.12, 'XYZ');
    bones.rightLowerArm.rotation.set(0, R * 0.35, -R * 0.12, 'XYZ');
    if (bones.leftHand) bones.leftHand.rotation.set(0, 0, -L * 0.1);
    if (bones.rightHand) bones.rightHand.rotation.set(0, 0, -R * 0.1);

    if (wave >= 0) {
      wave += dt;
      const p = wave / 1.7;
      if (p >= 1) wave = -1;
      else {
        const raise = Math.sin(Math.min(1, p * 3) * Math.PI / 2) * Math.sin(Math.min(1, (1 - p) * 3) * Math.PI / 2);
        const wag = Math.sin(wave * 15) * 0.5 * raise;
        // keep the hand inside the half-body frame: upper arm only a little above horizontal,
        // forearm folded up so the palm sits beside the ear, slight forward lean toward the camera
        // elbow stays below the shoulder (upper arm ~45° from vertical), forearm folds up past the ear
        bones.rightUpperArm.rotation.set(-0.7 * raise, 0.3 * R * raise, -R * (down - 0.8 * raise), 'XYZ');
        bones.rightLowerArm.rotation.set(-0.35 * raise, R * 0.1, R * (1.95 * raise) + wag, 'XYZ');
        if (bones.rightHand) bones.rightHand.rotation.set(0, 0, R * 0.15 * raise + wag * 0.9);
      }
    }

    vrm.update(dt);

    camera.position.x = damp(camera.position.x, CAMERA_HOME.x + viewShift + (pointer.has ? pointer.x * 0.1 : 0), 3, dt);
    camera.position.y = damp(camera.position.y, CAMERA_HOME.y + (pointer.has ? pointer.y * 0.04 : 0), 3, dt);
    camera.position.z = CAMERA_HOME.z;
    camera.lookAt(CAMERA_TARGET.x + viewShift, CAMERA_TARGET.y, CAMERA_TARGET.z);

    mood.label = wave >= 0 ? 'waving' : mood.surprise > 0.35 ? 'surprised' : smileNow > 0.45 ? 'smiling' : pointer.has ? 'watching you' : 'idle';
  }

  renderer.setAnimationLoop(() => {
    if (disposed) return;
    update(Math.min(clock.getDelta(), 0.05));
    renderer.render(scene, camera);
    if (onFrame) onFrame(api);
  });

  // ---------- load ----------
  const ready = new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.register((parser) => new VRMLoaderPlugin(parser));
    loader.load(modelUrl, (gltf) => {
      vrm = gltf.userData.vrm;
      VRMUtils.removeUnnecessaryVertices(gltf.scene);
      (VRMUtils.combineSkeletons || VRMUtils.removeUnnecessaryJoints)?.(gltf.scene);
      isVRM0 = vrm.meta?.metaVersion === '0';
      VRMUtils.rotateVRM0(vrm);
      vrm.scene.traverse((o) => { o.frustumCulled = false; if (o.isMesh) { o.castShadow = true; o.receiveShadow = false; } });
      scene.add(vrm.scene);
      vrm.scene.updateMatrixWorld(true);
      for (const n of ['hips','spine','chest','upperChest','neck','head','leftShoulder','rightShoulder','leftUpperArm','rightUpperArm','leftLowerArm','rightLowerArm','leftHand','rightHand']) {
        bones[n] = vrm.humanoid.getNormalizedBoneNode(n);
      }
      const dirSign = (upper, lower) => {
        const a = vrm.scene.worldToLocal(bones[upper].getWorldPosition(new THREE.Vector3()));
        const b = vrm.scene.worldToLocal(bones[lower].getWorldPosition(new THREE.Vector3()));
        return Math.sign(b.x - a.x) || 1;
      };
      armSign.left = dirSign('leftUpperArm', 'leftLowerArm');
      armSign.right = dirSign('rightUpperArm', 'rightLowerArm');
      bones.head.getWorldPosition(headWorld);
      headHeight = headWorld.y;
      if (framing === 'full') { CAMERA_HOME.set(0, headHeight * 0.62, 3.1); CAMERA_TARGET.set(0, headHeight * 0.55, 0); }
      else { CAMERA_HOME.set(0, headHeight - 0.04, 1.6); CAMERA_TARGET.set(0, headHeight - 0.16, 0); }   // hair to stomach
      computeShift();
      camera.position.copy(CAMERA_HOME); camera.position.x += viewShift;
      vrm.lookAt.target = lookTarget;
      if (vrm.lookAt) vrm.lookAt.autoUpdate = true;
      setTimeout(() => { wave = 0; }, 500);
      resolve(api);
    }, (e) => onProgress?.(e.total ? e.loaded / e.total : 0), reject);
  });

  const api = {
    ready, renderer, scene, camera, look, mood, pointer, bones,
    get vrm() { return vrm; },
    setTheme, setPointer,
    wave: () => { wave = 0; },
    // scripted reactions: look at a screen point (NDC -1..1) for ms, and/or hold an expression for ms
    glanceAt(nx, ny, ms = 1000) { override.glance = { x: nx, y: ny, until: performance.now() + ms }; },
    react({ surprise = 0, happy = 0, sad = 0, angry = 0, flinch = 0, ms = 900 } = {}) {
      override.expr = { surprise, happy, sad, angry, flinch, from: performance.now(), until: performance.now() + ms };
    },
    headScreen() { const v = headWorld.clone().project(camera); return { x: v.x, y: v.y }; },
    // synchronous snapshot of the current frame (render first so the buffer is fresh)
    captureImage() { renderer.render(scene, camera); return renderer.domElement.toDataURL('image/webp', 0.92); },
    dispose() {
      disposed = true; renderer.setAnimationLoop(null); ro.disconnect();
      if (listen) { removeEventListener('pointermove', onMove); removeEventListener('pointerdown', onDown); document.removeEventListener('mouseleave', onLeave); }
      if (vrm) VRMUtils.deepDispose(vrm.scene);
      renderer.dispose(); renderer.domElement.remove();
    },
  };
  return api;
}
