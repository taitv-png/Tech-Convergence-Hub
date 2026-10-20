"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { floorRooms, type Room } from "./floor-rooms";
import * as THREE from "three";
import { ROOM_CATALOGUE, commonSpaceName } from "./room-catalogue";
import { createRoom104, createStudent, ROOM_ITEMS, ROOM104 } from "./room104-scene";
import { createTeachingRoom, createHallway, type TourItem, type Portal } from "./campus-tour-scene";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import {
  ArrowLeft,
  Building2,
  ChevronRight,
  Footprints,
  LocateFixed,
  Map,
  Navigation,
  RotateCcw,
  Route,
  Rotate3D,
} from "./icons";

type P = [number, number];
type Place = {
  id: string;
  label: string;
  floor: number;
  point: P;
  type: "entry" | "stair" | "lift" | "lobby";
};
type RouteData = {
  mode: "WALK" | "CT1" | "CT2" | "LIFT";
  floors: number[];
  paths: Record<number, P[]>;
  steps: string[];
};

const FLOOR_LABELS = ["GF", "F1", "F2", "F3", "F4", "F5", "F6", "F7"];
const ROOMS = FLOOR_LABELS.flatMap((_, i) => floorRooms(i));
const PLACES: Place[] = [
  {
    id: "ENTRY",
    label: "Cổng Nguyễn Văn Thủ · Tầng trệt",
    floor: 0,
    point: [14.1, 7.2],
    type: "entry",
  },
];
const roomGroups = FLOOR_LABELS.map((_, floor) => ({
  floor,
  label: floor === 0 ? "Tầng trệt" : `Tầng ${floor}`,
  rooms: ROOMS.filter((room) => room.floor === floor).sort((a, b) => a.id.localeCompare(b.id)),
}));
const STARTS: Place[] = [
  ...PLACES,
  ...ROOMS.map((r) => ({
    id: `ROOM-${r.id}`,
    label: `${r.id} · ${r.name}`,
    floor: r.floor,
    point: r.door,
    type: "lobby" as const,
  })),
];

const CORES = { CT1: [6.55, 3.6] as P, CT2: [1.5, 1.4] as P, LIFT: [6.5, 5.25] as P };
const TOP_Z = 2.38,
  LEFT_X = 5.72,
  RIGHT_X = 7.82,
  CT1_FRONT_Z = 4.55;
// Circulation follows the PDF: S4 stops at the west side of CT1. There is no
// corridor behind/above CT1; S4 connects to S5 by going around its south side.
const CORE_ACCESS = {
  CT1: [6.55, CT1_FRONT_Z] as P,
  CT2: [1.5, TOP_Z] as P,
  LIFT: [LEFT_X, 5.25] as P,
};
const baseNodes: P[] = [
  [0.6, TOP_Z],
  [1.3, TOP_Z],
  [4.2, TOP_Z],
  [LEFT_X, TOP_Z],
  [LEFT_X, 1.42],
  [LEFT_X, CT1_FRONT_Z],
  [6.55, CT1_FRONT_Z],
  [RIGHT_X, CT1_FRONT_Z],
  [RIGHT_X, 4.6],
  [RIGHT_X, 4.9],
  [LEFT_X, 5.25],
  [RIGHT_X, 5.25],
  [LEFT_X, 6.15],
  [RIGHT_X, 6.15],
];
const same = (a: number, b: number) => Math.abs(a - b) < 0.03;
const inRange = (v: number, a: number, b: number) =>
  v >= Math.min(a, b) - 0.03 && v <= Math.max(a, b) + 0.03;
const connected = (a: P, b: P) => {
  if (
    same(a[1], TOP_Z) &&
    same(b[1], TOP_Z) &&
    inRange(a[0], 0.6, LEFT_X) &&
    inRange(b[0], 0.6, LEFT_X)
  )
    return true;
  if (
    same(a[0], LEFT_X) &&
    same(b[0], LEFT_X) &&
    inRange(a[1], 1.42, 6.15) &&
    inRange(b[1], 1.42, 6.15)
  )
    return true;
  if (
    same(a[1], CT1_FRONT_Z) &&
    same(b[1], CT1_FRONT_Z) &&
    inRange(a[0], LEFT_X, RIGHT_X) &&
    inRange(b[0], LEFT_X, RIGHT_X)
  )
    return true;
  return (
    same(a[0], RIGHT_X) &&
    same(b[0], RIGHT_X) &&
    inRange(a[1], CT1_FRONT_Z, 6.15) &&
    inRange(b[1], CT1_FRONT_Z, 6.15)
  );
};
const approach = (p: P): P => {
  if (same(p[0], 6.45) && p[1] < 2.2) return [LEFT_X, p[1]]; // E104/E204/... open to S4 on their west side
  if (p[1] <= 2.65 && p[0] < LEFT_X) return [p[0], TOP_Z];
  if (p[0] >= 8) return [RIGHT_X, p[1]];
  return [LEFT_X, p[1]];
};
const dist = (a: P, b: P) => Math.hypot(a[0] - b[0], a[1] - b[1]);
function corridorPath(from: P, to: P): P[] {
  const a = approach(from),
    b = approach(to),
    nodes = [...baseNodes, a, b];
  const n = nodes.length;
  const d = Array(n).fill(Infinity),
    prev = Array(n).fill(-1),
    seen = Array(n).fill(false);
  d[n - 2] = 0;
  for (let k = 0; k < n; k++) {
    let u = -1;
    for (let i = 0; i < n; i++) if (!seen[i] && (u < 0 || d[i] < d[u])) u = i;
    if (u < 0 || !isFinite(d[u])) break;
    seen[u] = true;
    for (let v = 0; v < n; v++) {
      if (u === v || !connected(nodes[u], nodes[v])) continue;
      const nd = d[u] + dist(nodes[u], nodes[v]);
      if (nd < d[v]) {
        d[v] = nd;
        prev[v] = u;
      }
    }
  }
  const idx: number[] = [];
  for (let at = n - 1; at >= 0; at = prev[at]) {
    idx.push(at);
    if (at === n - 2) break;
    if (prev[at] < 0) break;
  }
  idx.reverse();
  const path = [from, a, ...idx.slice(1, -1).map((i) => nodes[i]), b, to];
  return path.filter((p, i) => i === 0 || dist(p, path[i - 1]) > 0.02);
}
const pathLength = (p: P[]) => p.slice(1).reduce((s, v, i) => s + dist(p[i], v), 0);
// The ground floor is an open lobby, not the upper-floor corridor template.
function groundApproach(p: P): P[] {
  if (p[0] > 10) return [p, [9.1, 7.2], [9.1, 4.55], [5.72, 4.55]];
  if (same(p[0], 2.62)) return [p, [3.0, 4.0], [3.0, 4.55], [5.72, 4.55]];
  if (same(p[1], 5.1)) return [p, [p[0], 4.55], [5.72, 4.55]];
  return [p, [5.72, p[1]], [5.72, 4.55]];
}
function floorPath(from: P, to: P, floor: number): P[] {
  if (floor !== 0) return corridorPath(from, to);
  const path = [...groundApproach(from), ...groundApproach(to).reverse()];
  return path.filter((p, i) => !i || dist(p, path[i - 1]) > 0.02);
}
const toCore = (from: P, mode: "CT1" | "CT2" | "LIFT", floor = 1) =>
  [...floorPath(from, CORE_ACCESS[mode], floor), CORES[mode]].filter(
    (p, i, a) => i === 0 || dist(p, a[i - 1]) > 0.02,
  );
const fromCore = (mode: "CT1" | "CT2" | "LIFT", to: P, floor = 1) =>
  [CORES[mode], ...floorPath(CORE_ACCESS[mode], to, floor)].filter(
    (p, i, a) => i === 0 || dist(p, a[i - 1]) > 0.02,
  );
function routeSingle(start: Place, dest: Room): RouteData {
  if (start.floor === dest.floor)
    return {
      mode: "WALK",
      floors: [dest.floor],
      paths: { [dest.floor]: floorPath(start.point, dest.door, start.floor) },
      steps: [
        `Rời ${start.label}`,
        `Đi theo hành lang ${FLOOR_LABELS[dest.floor]} và theo hướng mũi tên`,
        `Dừng ngay trước cửa ${dest.id}`,
      ],
    };
  const liftStops = [0, 4, 5, 6],
    choices: { mode: "CT1" | "CT2" | "LIFT"; point: P; score: number }[] = [
      { mode: "CT1", point: CORES.CT1, score: 0 },
    ];
  if (start.floor < 7 && dest.floor < 7) choices.push({ mode: "CT2", point: CORES.CT2, score: 0 });
  if (liftStops.includes(start.floor) && liftStops.includes(dest.floor))
    choices.push({ mode: "LIFT", point: CORES.LIFT, score: 0 });
  choices.forEach(
    (c) =>
      (c.score =
        pathLength(toCore(start.point, c.mode, start.floor)) +
        pathLength(fromCore(c.mode, dest.door, dest.floor)) +
        Math.abs(dest.floor - start.floor) * (c.mode === "LIFT" ? 0.7 : 1.25)),
  );
  const best = choices.sort((a, b) => a.score - b.score)[0],
    mode = best.mode;
  return {
    mode,
    floors: [start.floor, dest.floor],
    paths: {
      [start.floor]: toCore(start.point, mode, start.floor),
      [dest.floor]: fromCore(mode, dest.door, dest.floor),
    },
    steps: [
      `Từ ${start.label}, theo mũi tên trên hành lang đến ${mode === "LIFT" ? "thang máy" : `cầu thang ${mode}`}`,
      mode === "LIFT"
        ? `Đi thang máy đến ${FLOOR_LABELS[dest.floor]}`
        : `Theo hai vế thang và chiếu nghỉ đến ${FLOOR_LABELS[dest.floor]}`,
      `Ra sảnh tầng ${FLOOR_LABELS[dest.floor]} và tiếp tục theo mũi tên`,
      `Dừng ngay trước cửa ${dest.id}`,
    ],
  };
}

function routeFor(start: Place, dest: Room): RouteData {
  const origin = ROOMS.find((r) => `ROOM-${r.id}` === start.id);
  const candidates = (origin?.doors ?? [start.point]).flatMap((point) =>
    (dest.doors ?? [dest.door]).map((door) => routeSingle({ ...start, point }, { ...dest, door })),
  );
  return candidates.sort(
    (a, b) =>
      Object.values(a.paths).reduce((s, p) => s + pathLength(p), 0) -
      Object.values(b.paths).reduce((s, p) => s + pathLength(p), 0),
  )[0];
}

function labelSprite(
  text: string,
  style: "room" | "selected" | "amenity" | "floor" | "pin" = "room",
) {
  const selected = style === "selected";
  const c = document.createElement("canvas");
  c.width = selected ? 560 : 440;
  c.height = selected ? 170 : 128;
  const x = c.getContext("2d")!;
  const w = c.width,
    h = c.height;
  x.shadowColor = selected ? "rgba(243,107,33,.5)" : "rgba(0,0,0,.38)";
  x.shadowBlur = 18;
  x.shadowOffsetY = 7;
  x.fillStyle = selected ? "#ff6b2c" : style === "floor" ? "#ff6b2c" : "rgba(17,24,28,.96)";
  x.beginPath();
  x.roundRect(12, 10, w - 24, h - 24, selected ? 22 : 17);
  x.fill();
  x.shadowColor = "transparent";
  x.strokeStyle = selected ? "#ffd1b5" : style === "amenity" ? "#738086" : "#52758a";
  x.lineWidth = 3;
  x.stroke();
  if (style === "room") {
    x.fillStyle = "#5e8fb8";
    x.beginPath();
    x.roundRect(12, 10, 13, h - 24, [17, 0, 0, 17]);
    x.fill();
  }
  if (selected) {
    x.fillStyle = "rgba(255,255,255,.78)";
    x.font = '700 19px "Be Vietnam Pro", Arial';
    x.textAlign = "left";
    x.textBaseline = "middle";
    x.fillText("PHÒNG ĐÃ CHỌN", 42, 48);
    x.font = '700 54px "Be Vietnam Pro", Arial';
    x.fillStyle = "#fff";
    x.fillText(text, 42, 108);
  } else {
    x.fillStyle = "#fff";
    x.font =
      style === "floor"
        ? '700 42px "Be Vietnam Pro", Arial'
        : style === "amenity"
          ? '600 29px "Be Vietnam Pro", Arial'
          : '650 36px "Be Vietnam Pro", Arial';
    x.textAlign = "center";
    x.textBaseline = "middle";
    if (x.measureText(text).width > w - 48)
      x.font = `600 ${Math.floor((29 * (w - 48)) / x.measureText(text).width)}px "Be Vietnam Pro", Arial`;
    x.fillText(text, w / 2, h / 2);
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.minFilter = THREE.LinearMipmapLinearFilter;
  const s = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: t, transparent: true, depthTest: false, depthWrite: false }),
  );
  s.scale.set(
    selected
      ? 2.7
      : style === "floor"
        ? 1.55
        : style === "amenity"
          ? 1.25
          : style === "pin"
            ? 2.2
            : 1.4,
    selected ? 0.82 : style === "pin" ? 0.62 : 0.41,
    1,
  );
  s.renderOrder = 20;
  return s;
}

function restroomSprite(female: boolean) {
  const canvas = document.createElement("canvas");
  canvas.width = 96;
  canvas.height = 112;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#f4f8fa";
  ctx.strokeStyle = "#52758a";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.roundRect(5, 5, 86, 94, 14);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#275571";
  ctx.beginPath();
  ctx.arc(48, 26, 9, 0, Math.PI * 2);
  ctx.fill();
  ctx.lineWidth = 7;
  ctx.lineCap = "round";
  ctx.strokeStyle = "#275571";
  ctx.beginPath();
  ctx.moveTo(37, 43);
  ctx.lineTo(30, 63);
  ctx.moveTo(59, 43);
  ctx.lineTo(66, 63);
  ctx.moveTo(41, 65);
  ctx.lineTo(41, 84);
  ctx.moveTo(55, 65);
  ctx.lineTo(55, 84);
  ctx.stroke();
  ctx.beginPath();
  if (female) {
    ctx.moveTo(40, 40);
    ctx.lineTo(56, 40);
    ctx.lineTo(64, 70);
    ctx.lineTo(32, 70);
    ctx.closePath();
  } else {
    ctx.roundRect(37, 39, 22, 31, 5);
  }
  ctx.fill();
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const sprite = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: texture,
      depthTest: false,
      depthWrite: false,
      transparent: true,
    }),
  );
  sprite.scale.set(0.42, 0.49, 1);
  sprite.renderOrder = 19;
  return sprite;
}

function buildScene(
  host: HTMLDivElement,
  opts: {
    exploded: boolean;
    floor: number | null;
    showAll: boolean;
    dest: string;
    start: Place;
    route: RouteData;
  },
) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#0a0f12");
  scene.fog = new THREE.Fog("#0a0f12", 45, 90);
  const shownFloors =
    opts.floor !== null
      ? [opts.floor]
      : opts.showAll
        ? FLOOR_LABELS.map((_, i) => i)
        : [...new Set(opts.route.floors)].sort((a, b) => a - b);
  const spacing = opts.exploded ? 1.42 : 0.48;
  const floorY = (f: number) =>
    opts.floor !== null ? 0 : Math.max(0, shownFloors.indexOf(f)) * spacing;
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  camera.position.set(opts.showAll ? 15 : 13, opts.showAll ? 11 : 7.5, opts.showAll ? 21 : 16);
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  host.appendChild(renderer.domElement);
  scene.add(new THREE.HemisphereLight(0xdde8ea, 0x1a1410, 2.1));
  const sun = new THREE.DirectionalLight(0xffe5d2, 3.4);
  sun.position.set(8, 15, 10);
  sun.castShadow = true;
  scene.add(sun);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.1;
  controls.rotateSpeed = 0.34;
  controls.zoomSpeed = 0.48;
  controls.enablePan = true;
  controls.panSpeed = 0.65;
  controls.screenSpacePanning = true;
  controls.mouseButtons = {
    LEFT: THREE.MOUSE.PAN,
    MIDDLE: THREE.MOUSE.DOLLY,
    RIGHT: THREE.MOUSE.ROTATE,
  };
  controls.touches = { ONE: THREE.TOUCH.PAN, TWO: THREE.TOUCH.DOLLY_ROTATE };
  controls.target.set(
    shownFloors.includes(0) ? 2.7 : 0.5,
    opts.floor === null ? ((shownFloors.length - 1) * spacing) / 2 : 0.3,
    3.6,
  );
  controls.minDistance = 7;
  controls.maxDistance = 48;
  const root = new THREE.Group();
  root.position.x = -4.6;
  scene.add(root);
  const idleCampus = opts.floor === null && opts.showAll && opts.route.floors.length === 0;
  if (idleCampus) {
    const focus = new THREE.PointLight(0xffb078, 5.2, 24, 2);
    focus.position.set(0.5, 7.5, 4);
    scene.add(focus);
  }
  const mat = (color: number, opacity = 1) =>
    new THREE.MeshStandardMaterial({
      color,
      roughness: 0.72,
      metalness: 0.04,
      transparent: opacity < 0.999,
      opacity,
      depthWrite: opacity > 0.8,
    });
  const addBox = (
    parent: THREE.Object3D,
    size: [number, number, number],
    pos: [number, number, number],
    material: THREE.Material,
  ) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(...size), material);
    m.position.set(...pos);
    m.castShadow = true;
    m.receiveShadow = true;
    parent.add(m);
    return m;
  };
  FLOOR_LABELS.forEach((fl, f) => {
    if (!shownFloors.includes(f)) return;
    const y = floorY(f);
    const g = new THREE.Group();
    g.position.y = y;
    root.add(g);
    const involved = opts.route.floors.includes(f),
      stackIndex = shownFloors.indexOf(f),
      isUpper = stackIndex > 0;
    const layerOpacity =
      opts.floor !== null
        ? 0.98
        : opts.showAll
          ? idleCampus
            ? Math.max(0.38, 0.74 - stackIndex * 0.045)
            : involved
              ? isUpper
                ? 0.58
                : 0.88
              : Math.max(0.18, 0.34 - stackIndex * 0.025)
          : isUpper
            ? 0.56
            : 0.94;
    addBox(
      g,
      f === 0 ? [13.1, 0.055, 9] : [10.35, 0.055, 7.4],
      f === 0 ? [6.45, 0, 4.4] : [5.1, 0, 3.6],
      mat(involved || idleCampus ? 0xe5e4df : 0x757b7d, Math.min(layerOpacity + 0.04, 0.96)),
    );
    ROOMS.filter((r) => r.floor === f).forEach((r) => {
      const [x1, z1, x2, z2] = r.box;
      const selected = r.id === opts.dest;
      const roomOpacity = selected ? 0.98 : layerOpacity;
      const m = addBox(
        g,
        [x2 - x1 - 0.08, 0.16, z2 - z1 - 0.08],
        [(x1 + x2) / 2, 0.12, (z1 + z2) / 2],
        mat(selected ? 0xff6b2c : r.kind === "class" ? 0xa8b5c0 : 0x5e8fb8, roomOpacity),
      );
      m.userData.room = r.id;
      if (r.outline) {
        m.visible = false;
        const shape = new THREE.Shape();
        r.outline.forEach(([x, z], i) => (i ? shape.lineTo(x, -z) : shape.moveTo(x, -z)));
        shape.closePath();
        const mesh = new THREE.Mesh(
          new THREE.ExtrudeGeometry(shape, { depth: 0.16, bevelEnabled: false }),
          m.material,
        );
        mesh.rotation.x = -Math.PI / 2;
        mesh.position.y = 0.04;
        mesh.userData.room = r.id;
        g.add(mesh);
      }
      (r.doors ?? [r.door]).forEach((door) =>
        addBox(
          g,
          same(door[1], z1) ? [0.32, 0.018, 0.07] : [0.07, 0.018, 0.32],
          [door[0], 0.225, door[1]],
          mat(0xffd2ad),
        ),
      );
      if (selected) {
        const l = labelSprite(r.id, "selected");
        l.position.set((x1 + x2) / 2, 0.82, (z1 + z2) / 2);
        l.userData.room = r.id;
        g.add(l);
      }
    });
    if (f === 0) {
      for (const z of [6.65, 7.75]) addBox(g, [0.15, 0.6, 0.15], [13.18, 0.3, z], mat(0xff6b2c));
      const gate = labelSprite("CỔNG VÀO", "pin");
      gate.position.set(13.15, 0.8, 7.2);
      g.add(gate);
      const common = labelSprite("SẢNH CÔNG NGHỆ TƯƠNG TÁC", "pin");
      common.position.set(10.8, 0.45, 2);
      common.scale.set(3.8, 0.65, 1);
      g.add(common);
    }
    const stepMat = mat(0xd27b47, Math.max(0.42, layerOpacity));
    const ct1 = new THREE.Group();
    for (let i = 0; i < 7; i++) {
      addBox(ct1, [0.42, 0.025, 0.14], [-0.27, 0.04 + i * 0.025, -0.46 + i * 0.14], stepMat);
      addBox(ct1, [0.42, 0.025, 0.14], [0.27, 0.2 - i * 0.025, 0.46 - i * 0.14], stepMat);
    }
    ct1.position.set(CORES.CT1[0], 0.08, CORES.CT1[1]);
    g.add(ct1);
    if (f < 7) {
      const ct2 = new THREE.Group();
      for (let i = 0; i < 7; i++) {
        addBox(ct2, [0.14, 0.025, 0.42], [-0.46 + i * 0.14, 0.04 + i * 0.025, -0.25], stepMat);
        addBox(ct2, [0.14, 0.025, 0.42], [0.46 - i * 0.14, 0.2 - i * 0.025, 0.25], stepMat);
      }
      ct2.position.set(CORES.CT2[0], 0.08, CORES.CT2[1]);
      g.add(ct2);
    }
    const amenity = (text: string, p: P, color: number) => {
      addBox(g, [0.72, 0.12, 0.62], [p[0], 0.1, p[1]], mat(color, Math.max(0.38, layerOpacity)));
      if (text.startsWith("WC") && (involved || opts.floor !== null)) {
        const s = restroomSprite(text === "WC NỮ");
        s.position.set(p[0], 0.48, p[1]);
        g.add(s);
      }
    };
    amenity("CT1", CORES.CT1, 0xa9855f);
    if (f < 7) {
      amenity("CT2", CORES.CT2, 0xa9855f);
      amenity(
        [0, 4, 5, 6].includes(f) ? "LIFT" : "LIFT · NO STOP",
        CORES.LIFT,
        [0, 4, 5, 6].includes(f) ? 0x8b7cf6 : 0x704048,
      );
    }
    amenity("WC NAM", [6.15, 6.25], 0x687176);
    amenity("WC NỮ", [7.15, 6.25], 0x687176);
  });
  const contextCars: {
      object: THREE.Group;
      speed: number;
      direction: number;
      min: number;
      max: number;
      lane: number;
      distance: number;
    }[] = [],
    contextWalkers: {
      npc: ReturnType<typeof createStudent>;
      speed: number;
      direction: number;
      min: number;
      max: number;
    }[] = [],
    crossingWalkers: {
      npc: ReturnType<typeof createStudent>;
      baseDirection: number;
      offset: number;
      z: number;
    }[] = [];
  let vehicleSignals: {
    red: THREE.MeshStandardMaterial;
    yellow: THREE.MeshStandardMaterial;
    green: THREE.MeshStandardMaterial;
  } | null = null;
  if (opts.floor === null && opts.showAll) {
    const context = new THREE.Group();
    root.add(context);
    addBox(context, [36, 0.08, 28], [8, -0.24, 4.4], mat(0x202825, 0.96));
    addBox(context, [4, 0.07, 28], [16.5, -0.15, 4.4], mat(0x252c30, 0.98));
    for (let z = -8; z < 17; z += 1.7)
      addBox(context, [0.07, 0.018, 0.82], [16.5, -0.1, z], mat(0xc9c2b7, 0.68));
    const crossing = mat(0xf1eee7, 0.9);
    for (let i = 0; i < 11; i++)
      addBox(context, [0.17, 0.02, 1.55], [14.82 + i * 0.335, -0.095, 7.2], crossing);
    addBox(context, [1.55, 0.022, 0.12], [15.5, -0.092, 6.25], crossing);
    addBox(context, [1.55, 0.022, 0.12], [17.5, -0.092, 8.15], crossing);
    const laneMarking = mat(0xe7e0d5, 0.72);
    for (const [x, direction] of [
      [15.5, 1],
      [17.5, -1],
    ] as const)
      for (const z of [-4, 4, 12]) {
        addBox(context, [0.07, 0.018, 0.48], [x, -0.1, z], laneMarking);
        const arrowHead = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.3, 3), laneMarking);
        arrowHead.rotation.x = direction > 0 ? Math.PI / 2 : -Math.PI / 2;
        arrowHead.position.set(x, -0.095, z + direction * 0.33);
        context.add(arrowHead);
      }
    const sidewalk = mat(0x77736c, 0.98);
    addBox(context, [1.2, 0.16, 28], [13.9, -0.08, 4.4], sidewalk);
    addBox(context, [1.2, 0.16, 28], [19.1, -0.08, 4.4], sidewalk);
    addBox(context, [1.5, 0.17, 1.48], [13.65, -0.07, 7.2], sidewalk);
    vehicleSignals = {
      red: new THREE.MeshStandardMaterial({ color: 0x3a2424, emissive: 0x000000, roughness: 0.45 }),
      yellow: new THREE.MeshStandardMaterial({
        color: 0x39321d,
        emissive: 0x000000,
        roughness: 0.45,
      }),
      green: new THREE.MeshStandardMaterial({
        color: 0x1f372b,
        emissive: 0x1f9d62,
        emissiveIntensity: 2.8,
        roughness: 0.45,
      }),
    };
    const addTrafficLight = (x: number, z: number, rotation: number) => {
      const signal = new THREE.Group(),
        pole = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.065, 1.8, 10), mat(0x252c2f));
      pole.position.y = 0.9;
      signal.add(pole);
      addBox(signal, [0.34, 0.88, 0.28], [0, 1.68, 0], mat(0x111719));
      for (const [y, material] of [
        [1.94, vehicleSignals!.red],
        [1.68, vehicleSignals!.yellow],
        [1.42, vehicleSignals!.green],
      ] as const) {
        const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.085, 12, 8), material);
        lamp.position.set(0, y, 0.15);
        signal.add(lamp);
      }
      signal.position.set(x, 0, z);
      signal.rotation.y = rotation;
      context.add(signal);
    };
    addTrafficLight(14.34, 6.25, 0);
    addTrafficLight(18.66, 8.15, Math.PI);
    const trunk = mat(0x5b3d2c),
      leafColors = [mat(0x506b4d), mat(0x627753), mat(0x3f6655)];
    const addTree = (x: number, z: number, scale = 1, color = 0) => {
      const tree = new THREE.Group();
      const stem = new THREE.Mesh(
        new THREE.CylinderGeometry(0.1 * scale, 0.16 * scale, 1.15 * scale, 7),
        trunk,
      );
      stem.position.y = 0.57 * scale;
      const crown = new THREE.Mesh(
        new THREE.IcosahedronGeometry(0.62 * scale, 1),
        leafColors[color % leafColors.length],
      );
      crown.position.y = 1.42 * scale;
      tree.add(stem, crown);
      tree.position.set(x, 0, z);
      context.add(tree);
    };
    for (let z = -6.8, i = 0; z < 16.8; z += 2.35, i++) {
      if (Math.abs(z - 7.2) > 0.8) addTree(13.48, z, 0.68 + (i % 2) * 0.08, i + 1);
      addTree(19.5, z + 0.55, 0.68 + ((i + 1) % 2) * 0.08, i + 2);
    }
    const addContextBuilding = (
      x: number,
      z: number,
      w: number,
      d: number,
      h: number,
      color: number,
    ) => addBox(context, [w, h, d], [x, h / 2 - 0.2, z], mat(color, 0.15));
    addContextBuilding(-4.3, 4.5, 4.8, 7.0, 2.6, 0x56636a);
    addContextBuilding(4.5, -5.2, 8.2, 3.8, 2.8, 0x3f4b52);
    addContextBuilding(4.8, 14.3, 8.8, 4.3, 3.5, 0x47535a);
    addContextBuilding(22.8, -4.0, 5.3, 4.7, 3.2, 0x445159);
    addContextBuilding(23.1, 2.2, 5.8, 5.1, 4.0, 0x4a555d);
    addContextBuilding(22.7, 9.0, 5.1, 5.4, 3.4, 0x3f4c54);
    addContextBuilding(23.0, 15.2, 5.7, 4.4, 2.9, 0x48555c);
    const carColors = [0xff6b2c, 0xd9d7d1, 0x4e7184, 0xb54c45, 0xd1a33b, 0x668563];
    const roadMin = -7.4,
      roadMax = 16.2,
      laneConfigs = [
        { x: 15.5, direction: 1, speed: 0.864 },
        { x: 17.5, direction: -1, speed: 0.768 },
      ];
    laneConfigs.forEach((lane, laneIndex) => {
      for (let slot = 0; slot < 3; slot++) {
        const color = carColors[laneIndex * 3 + slot],
          car = new THREE.Group(),
          distance = (slot / 3) * (roadMax - roadMin);
        addBox(car, [1.55, 0.38, 0.72], [0, 0.25, 0], mat(color));
        addBox(car, [0.88, 0.32, 0.62], [-0.08, 0.57, -0.02], mat(0x26343a, 0.94));
        for (const z of [-0.24, 0.24])
          addBox(car, [0.05, 0.11, 0.13], [0.79, 0.28, z], mat(0xfff0c7));
        for (const x of [-0.55, 0.55])
          for (const z of [-0.38, 0.38]) {
            const wheel = new THREE.Mesh(
              new THREE.CylinderGeometry(0.13, 0.13, 0.1, 10),
              mat(0x111719),
            );
            wheel.rotation.z = Math.PI / 2;
            wheel.position.set(x, 0.15, z);
            car.add(wheel);
          }
        car.position.set(lane.x, 0, lane.direction > 0 ? roadMin + distance : roadMax - distance);
        car.rotation.y = lane.direction > 0 ? -Math.PI / 2 : Math.PI / 2;
        context.add(car);
        contextCars.push({
          object: car,
          speed: lane.speed,
          direction: lane.direction,
          min: roadMin,
          max: roadMax,
          lane: laneIndex,
          distance,
        });
      }
    });
    const variants = [
      "casual-male",
      "casual-female",
      "male",
      "casual-female",
      "casual-male",
      "female",
      "casual-female",
      "casual-male",
      "female",
      "casual-male",
    ] as const;
    variants.forEach((variant, i) => {
      const npc = createStudent(scene, variant, i + 2);
      context.add(npc.root);
      npc.root.scale.setScalar(0.49 + (i % 2) * 0.025);
      const outer = i >= 5,
        laneSlot = i % 5;
      npc.root.position.set(
        outer ? 18.82 + (laneSlot % 2) * 0.18 : 13.86 + (laneSlot % 2) * 0.18,
        0,
        -5.5 + laneSlot * 4.2,
      );
      const direction = (i + laneSlot) % 2 ? 1 : -1;
      npc.root.rotation.y = direction > 0 ? 0 : Math.PI;
      contextWalkers.push({ npc, speed: 0.25 + (i % 3) * 0.035, direction, min: -6.3, max: 15.8 });
    });
    const crossingVariants = ["casual-female", "casual-male", "female", "casual-male"] as const;
    crossingVariants.forEach((variant, i) => {
      const npc = createStudent(scene, variant, i + 12);
      context.add(npc.root);
      npc.root.scale.setScalar(0.58 + (i % 2) * 0.025);
      const baseDirection = i % 2 ? -1 : 1,
        z = 6.78 + i * 0.27;
      npc.root.position.set(baseDirection > 0 ? 14.05 : 18.95, 0, z);
      npc.root.rotation.y = baseDirection > 0 ? Math.PI / 2 : -Math.PI / 2;
      crossingWalkers.push({ npc, baseDirection, offset: i * 0.32, z });
    });
  }
  const movingArrows: { mesh: THREE.Mesh; a: THREE.Vector3; b: THREE.Vector3; phase: number }[] =
    [];
  const visibleFloors = opts.floor === null ? opts.route.floors : [opts.floor];
  for (const f of visibleFloors) {
    const pts = opts.route.paths[f];
    if (!pts) continue;
    const y = floorY(f) + 0.34;
    const lineMat = new THREE.MeshBasicMaterial({ color: 0xff6b2c });
    for (let i = 1; i < pts.length; i++) {
      const a = new THREE.Vector3(pts[i - 1][0], y, pts[i - 1][1]),
        b = new THREE.Vector3(pts[i][0], y, pts[i][1]);
      if (a.distanceTo(b) < 0.03) continue;
      const curve = new THREE.LineCurve3(a, b);
      root.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 8, 0.045, 7, false), lineMat));
      const dir = b.clone().sub(a).normalize();
      for (let q = 0; q < 2; q++) {
        const arrow = new THREE.Mesh(
          new THREE.ConeGeometry(0.105, 0.25, 9),
          new THREE.MeshBasicMaterial({ color: 0xfff0e6 }),
        );
        arrow.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
        root.add(arrow);
        movingArrows.push({ mesh: arrow, a, b, phase: q * 0.5 + i * 0.13 });
      }
    }
  }
  if (opts.floor === null && opts.route.floors.length === 2) {
    const core = CORES[opts.route.mode as keyof typeof CORES];
    const [a, b] = opts.route.floors;
    const ya = floorY(a) + 0.34,
      yb = floorY(b) + 0.34;
    const geo = new THREE.CylinderGeometry(0.045, 0.045, Math.abs(yb - ya), 10);
    const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: 0xff6b2c }));
    m.position.set(core[0], (ya + yb) / 2, core[1]);
    root.add(m);
    const from = new THREE.Vector3(core[0], ya, core[1]),
      to = new THREE.Vector3(core[0], yb, core[1]);
    const dir = to.clone().sub(from).normalize();
    for (let q = 0; q < Math.max(3, Math.ceil(Math.abs(yb - ya) / 0.7)); q++) {
      const arrow = new THREE.Mesh(
        new THREE.ConeGeometry(0.105, 0.25, 9),
        new THREE.MeshBasicMaterial({ color: 0xfff0e6 }),
      );
      arrow.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
      root.add(arrow);
      movingArrows.push({
        mesh: arrow,
        a: from,
        b: to,
        phase: q / Math.max(3, Math.ceil(Math.abs(yb - ya) / 0.7)),
      });
    }
  }
  const addPin = (point: P, floor: number, text: string, color: number) => {
    if (!shownFloors.includes(floor)) return;
    const y = floorY(floor);
    const pin = new THREE.Group();
    const ball = new THREE.Mesh(
      new THREE.SphereGeometry(0.13, 14, 10),
      new THREE.MeshBasicMaterial({ color }),
    );
    ball.position.y = 0.57;
    pin.add(ball);
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(0.19, 0.035, 8, 20),
      new THREE.MeshBasicMaterial({ color }),
    );
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.34;
    pin.add(ring);
    pin.position.set(point[0], y, point[1]);
    root.add(pin);
    if (color === 0x5eead4) {
      const label = labelSprite(text, "pin");
      label.position.set(point[0], y + 0.95, point[1]);
      root.add(label);
    }
  };
  const destination = ROOMS.find((r) => r.id === opts.dest);
  if (destination && opts.route.floors.length) {
    addPin(
      opts.route.paths[opts.start.floor]?.[0] ?? opts.start.point,
      opts.start.floor,
      "BẠN ĐANG Ở ĐÂY",
      0x5eead4,
    );
    const path = opts.route.paths[destination.floor];
    addPin(
      path?.[path.length - 1] ?? destination.door,
      destination.floor,
      `ĐẾN · ${opts.dest}`,
      0xff6b2c,
    );
  }
  const grid = new THREE.GridHelper(36, 36, 0x1d272d, 0x131b20);
  grid.position.y = -0.2;
  scene.add(grid);
  renderer.domElement.style.display = "block";
  renderer.domElement.style.maxWidth = "100%";
  let id = 0,
    lastSignal = "";
  const resize = () => {
    const w = host.clientWidth,
      h = host.clientHeight;
    renderer.setSize(w, h, true);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    if (opts.floor === null && opts.showAll) controls.target.x = 3.5;
    const radius =
      opts.floor === null && opts.showAll
        ? 16.2
        : shownFloors.includes(0)
          ? 9.4
          : Math.hypot(5.3, 4, ((shownFloors.length - 1) * spacing) / 2);
    const fit = (radius / Math.sin(THREE.MathUtils.degToRad(19))) * Math.max(1, 1 / camera.aspect);
    camera.position
      .copy(controls.target)
      .add(new THREE.Vector3(1, 0.8, 1.3).normalize().multiplyScalar(Math.min(52, fit)));
    controls.update();
  };
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(host);
  const setLamp = (material: THREE.MeshStandardMaterial, on: boolean, color: number) => {
    material.color.setHex(on ? color : 0x242928);
    material.emissive.setHex(on ? color : 0x000000);
    material.emissiveIntensity = on ? 2.8 : 0;
  };
  const started = performance.now();
  let previous = started;
  const animate = (now = performance.now()) => {
    id = requestAnimationFrame(animate);
    const t = (now - started) / 1000,
      dt = Math.min((now - previous) / 1000, 0.05);
    previous = now;
    movingArrows.forEach((a) => a.mesh.position.copy(a.a).lerp(a.b, (t * 0.42 + a.phase) % 1));
    const cycle = t % 26,
      signal = cycle < 14 || cycle >= 25 ? "green" : cycle < 16 ? "yellow" : "red",
      vehicleRed = signal === "red";
    if (vehicleSignals && signal !== lastSignal) {
      setLamp(vehicleSignals.red, signal === "red", 0xff3b30);
      setLamp(vehicleSignals.yellow, signal === "yellow", 0xffc338);
      setLamp(vehicleSignals.green, signal === "green", 0x35df85);
      lastSignal = signal;
    }
    contextCars.forEach((car) => {
      const span = car.max - car.min,
        stopDistance = car.direction > 0 ? 5.35 - car.min : car.max - 9.05,
        next = (car.distance + car.speed * dt) % span,
        wrapped = next < car.distance;
      car.distance =
        vehicleRed && car.distance <= stopDistance + 0.001 && !wrapped && next >= stopDistance
          ? stopDistance
          : next;
    });
    if (vehicleRed)
      for (const lane of [0, 1]) {
        const cars = contextCars.filter((car) => car.lane === lane),
          sample = cars[0];
        if (!sample) continue;
        const stopDistance = sample.direction > 0 ? 5.35 - sample.min : sample.max - 9.05;
        let limit = stopDistance;
        cars
          .filter((car) => car.distance <= stopDistance + 0.001)
          .sort((a, b) => b.distance - a.distance)
          .forEach((car) => {
            car.distance = Math.min(car.distance, Math.max(0, limit));
            limit = car.distance - 2.05;
          });
      }
    contextCars.forEach((car) => {
      car.object.position.z = car.direction > 0 ? car.min + car.distance : car.max - car.distance;
    });
    contextWalkers.forEach((walker, i) => {
      walker.npc.root.position.z += walker.speed * dt * walker.direction;
      if (walker.npc.root.position.z > walker.max || walker.npc.root.position.z < walker.min) {
        walker.direction *= -1;
        walker.npc.root.rotation.y = walker.direction > 0 ? 0 : Math.PI;
      }
      walker.npc.update(dt, true, t * 5 + i);
    });
    const cycleIndex = Math.floor(t / 26);
    crossingWalkers.forEach((walker, i) => {
      const direction = cycleIndex % 2 ? -walker.baseDirection : walker.baseDirection,
        from = direction > 0 ? 14.05 : 18.95,
        to = direction > 0 ? 18.95 : 14.05,
        start = 17 + walker.offset,
        end = 23.7,
        raw = THREE.MathUtils.clamp((cycle - start) / (end - start), 0, 1),
        progress = raw * raw * (3 - 2 * raw),
        moving = raw > 0 && raw < 1;
      walker.npc.root.position.set(THREE.MathUtils.lerp(from, to, progress), 0, walker.z);
      walker.npc.root.rotation.y = direction > 0 ? Math.PI / 2 : -Math.PI / 2;
      walker.npc.update(dt, moving, t * 5 + i + 20);
    });
    controls.update();
    renderer.render(scene, camera);
  };
  animate();
  let pointerStart: P = [0, 0];
  const down = (e: PointerEvent) => {
    pointerStart = [e.clientX, e.clientY];
  };
  const click = (e: PointerEvent) => {
    if (e.button !== 0 || Math.hypot(e.clientX - pointerStart[0], e.clientY - pointerStart[1]) > 5)
      return;
    const rect = renderer.domElement.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.clientY - rect.top) / rect.height) * 2 + 1,
    );
    const ray = new THREE.Raycaster();
    ray.setFromCamera(mouse, camera);
    const hit = ray.intersectObjects(root.children, true).find((x) => x.object.userData.room);
    if (hit)
      window.dispatchEvent(new CustomEvent("campus-room", { detail: hit.object.userData.room }));
  };
  renderer.domElement.addEventListener("pointerdown", down);
  renderer.domElement.addEventListener("pointerup", click);
  return () => {
    cancelAnimationFrame(id);
    ro.disconnect();
    renderer.domElement.removeEventListener("pointerdown", down);
    renderer.domElement.removeEventListener("pointerup", click);
    controls.dispose();
    [...contextWalkers, ...crossingWalkers].forEach((walker) => walker.npc.dispose());
    scene.traverse((o) => {
      if (o instanceof THREE.Mesh) o.geometry.dispose();
      const material = (o as THREE.Mesh).material;
      if (material) {
        (Array.isArray(material) ? material : [material]).forEach((x) => x.dispose());
      }
    });
    renderer.dispose();
    renderer.domElement.remove();
  };
}

function MiniPlan({ floor, dest, route }: { floor: number; dest: string; route: RouteData }) {
  const markerId = useId();
  return (
    <svg
      viewBox={floor === 0 ? "0 0 1350 730" : "0 0 1015 620"}
      className="mini-plan"
      aria-label={`Mặt bằng ${FLOOR_LABELS[floor]}`}
    >
      <defs>
        <marker
          id={markerId}
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="15"
          markerHeight="15"
          markerUnits="userSpaceOnUse"
          orient="auto"
        >
          <path d="M1 1L9 5L1 9Z" fill="#fff4eb" />
        </marker>
      </defs>
      <rect
        x="18"
        y="18"
        width={floor === 0 ? 1110 : 804}
        height={floor === 0 ? 690 : 584}
        rx="12"
        className="plan-shell"
      />
      {floor !== 0 && (
        <path
          d="M70 203H460M460 131V535M460 366H620M620 366V535M460 419H487"
          className="plan-corridor"
        />
      )}
      {ROOMS.filter((r) => r.floor === floor).map((r) => {
        const [x1, z1, x2, z2] = r.box;
        return (
          <g key={r.id}>
            {r.outline ? (
              <polygon
                points={r.outline.map(([x, z]) => `${25 + x * 76},${25 + z * 75}`).join(" ")}
                className={r.id === dest ? "plan-room selected" : "plan-room"}
              />
            ) : (
              <rect
                x={25 + x1 * 76}
                y={25 + z1 * 75}
                width={(x2 - x1) * 76}
                height={(z2 - z1) * 75}
                rx="5"
                className={r.id === dest ? "plan-room selected" : "plan-room"}
              />
            )}
            <text x={25 + (x1 + x2) * 38} y={25 + (z1 + z2) * 37.5}>
              {r.id}
            </text>
            {(r.doors ?? [r.door]).map((door, i) => (
              <circle
                key={i}
                cx={25 + door[0] * 76}
                cy={25 + door[1] * 75}
                r="6"
                className="door"
              />
            ))}
          </g>
        );
      })}
      <rect
        x={25 + 5.95 * 76}
        y={25 + 3.12 * 75}
        width={1.2 * 76}
        height={0.95 * 75}
        className="core"
      />
      <text x={25 + 6.55 * 76} y={25 + 3.65 * 75}>
        CT1
      </text>
      {floor < 7 && (
        <>
          <rect
            x={25 + 0.78 * 76}
            y={25 + 0.98 * 75}
            width={1.45 * 76}
            height={0.84 * 75}
            className="core"
          />
          <text x={25 + 1.5 * 76} y={25 + 1.46 * 75}>
            CT2 ↔
          </text>
        </>
      )}
      {floor < 7 && (
        <>
          <rect
            x={25 + 6.08 * 76}
            y={25 + 4.88 * 75}
            width={0.84 * 76}
            height={0.75 * 75}
            className="lift"
          />
          <text x={25 + 6.5 * 76} y={25 + 5.3 * 75}>
            TM
          </text>
        </>
      )}
      <text x={25 + 6.15 * 76} y={25 + 6.35 * 75} className="facility-label">
        WC NAM
      </text>
      <text x={25 + 7.35 * 76} y={25 + 6.35 * 75} className="facility-label">
        WC NỮ
      </text>
      <g className="plan-context" transform={floor === 0 ? "translate(310 70)" : undefined}>
        <rect x="875" y="25" width="115" height="570" rx="8" />
        <path d="M932 40V580" strokeDasharray="18 14" />
        <text transform="translate(967 310) rotate(-90)">ĐƯỜNG NGUYỄN VĂN THỦ</text>
        <path d={floor === 0 ? "M810 495H875" : "M810 392H875"} className="gate-link" />
        <path
          d={floor === 0 ? "M825 473V517M849 473V517" : "M825 370V414M849 370V414"}
          className="gate-post"
        />
        <text x="840" y={floor === 0 ? 453 : 350} className="gate-caption">
          {floor === 0 ? "CỔNG VÀO" : "CỔNG TẦNG TRỆT"}
        </text>
        <text x="315" y="75" className="common-space">
          {commonSpaceName(floor)}
        </text>
      </g>
      {route.paths[floor] && (
        <polyline
          points={route.paths[floor].map(([x, z]) => `${25 + x * 76},${25 + z * 75}`).join(" ")}
          className="plan-route"
          markerMid={`url(#${markerId})`}
          markerEnd={`url(#${markerId})`}
        />
      )}
    </svg>
  );
}

// E104: traced from PDF page 3; calibration 658.08 pt = 21.10 m.
// Inner wall faces: (602.88,122.12) to (876,280.76). Elevations remain assumptions.
const E104_PLAN = {
  width: 273.12 / (658.08 / 21.1),
  depth: 158.64 / (658.08 / 21.1),
  area: 45,
  height: 3,
  doors: [
    {
      side: "left",
      from: (160.76 - 122.12) / (658.08 / 21.1),
      to: (192.68 - 122.12) / (658.08 / 21.1),
    },
    {
      side: "right",
      from: (127.04 - 122.12) / (658.08 / 21.1),
      to: (162.2 - 122.12) / (658.08 / 21.1),
    },
  ],
  windows: [
    { from: (170.96 - 122.12) / (658.08 / 21.1), to: (221.48 - 122.12) / (658.08 / 21.1) },
    { from: (224.6 - 122.12) / (658.08 / 21.1), to: (271.4 - 122.12) / (658.08 / 21.1) },
  ],
};
type Obstacle = { x: number; z: number; w: number; d: number };
const ROOM_STATIONS = [
  { x: -1.8, z: -0.35 },
  { x: 1.5, z: -0.35 },
  { x: -1.8, z: 1.35 },
  { x: 1.5, z: 1.35 },
];
function roomFree(
  x: number,
  z: number,
  obstacles: Obstacle[],
  width = E104_PLAN.width,
  depth = E104_PLAN.depth,
) {
  const radius = 0.24;
  return (
    Math.abs(x) < width / 2 - radius &&
    Math.abs(z) < depth / 2 - radius &&
    !obstacles.some(
      (o) => Math.abs(x - o.x) < o.w / 2 + radius && Math.abs(z - o.z) < o.d / 2 + radius,
    )
  );
}
function roomSegmentFree(from: P, to: P, obstacles: Obstacle[], width: number, depth: number) {
  const length = dist(from, to),
    steps = Math.max(1, Math.ceil(length / 0.09));
  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    if (
      !roomFree(
        from[0] + (to[0] - from[0]) * t,
        from[1] + (to[1] - from[1]) * t,
        obstacles,
        width,
        depth,
      )
    )
      return false;
  }
  return true;
}
function smoothRoomPath(from: P, path: P[], obstacles: Obstacle[], width: number, depth: number) {
  const points = [from, ...path],
    result: P[] = [];
  let anchor = 0;
  while (anchor < points.length - 1) {
    let next = points.length - 1;
    while (
      next > anchor + 1 &&
      !roomSegmentFree(points[anchor], points[next], obstacles, width, depth)
    )
      next--;
    result.push(points[next]);
    anchor = next;
  }
  return result;
}
function roomWalkPath(
  from: P,
  to: P,
  obstacles: Obstacle[],
  width = E104_PLAN.width,
  depth = E104_PLAN.depth,
): P[] {
  const step = 0.18,
    w = width,
    d = depth,
    nx = Math.ceil(w / step),
    nz = Math.ceil(d / step);
  const point = (id: number): P => [
    -w / 2 + ((id % nx) + 0.5) * step,
    -d / 2 + (Math.floor(id / nx) + 0.5) * step,
  ];
  const cell = (p: P) =>
    Math.max(0, Math.min(nz - 1, Math.floor((p[1] + d / 2) / step))) * nx +
    Math.max(0, Math.min(nx - 1, Math.floor((p[0] + w / 2) / step)));
  if (!roomFree(...to, obstacles, width, depth)) return [];
  const begin = cell(from),
    end = cell(to),
    open = new Set([begin]),
    scores = new globalThis.Map([[begin, 0]]),
    parents = new globalThis.Map<number, number>();
  while (open.size) {
    let cur = -1,
      best = Infinity;
    for (const id of open) {
      const p = point(id),
        v = (scores.get(id) ?? Infinity) + dist(p, point(end));
      if (v < best) {
        best = v;
        cur = id;
      }
    }
    if (cur === end) {
      const path: P[] = [to];
      let at = end;
      while (at !== begin) {
        path.push(point(at));
        at = parents.get(at)!;
      }
      return smoothRoomPath(from, path.reverse(), obstacles, width, depth);
    }
    open.delete(cur);
    const x = cur % nx,
      z = Math.floor(cur / nx);
    for (const [dx, dz] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ]) {
      if (x + dx < 0 || x + dx >= nx || z + dz < 0 || z + dz >= nz) continue;
      const next = (z + dz) * nx + x + dx,
        p = point(next);
      if (!roomFree(...p, obstacles, width, depth)) continue;
      const score = (scores.get(cur) ?? Infinity) + step;
      if (score < (scores.get(next) ?? Infinity)) {
        scores.set(next, score);
        parents.set(next, cur);
        open.add(next);
      }
    }
  }
  return [];
}

function RoomPreview({ room }: { room: Room }) {
  const host = useRef<HTMLDivElement>(null),
    input = useRef(new Set<string>());
  const sceneApi = useRef<{
    highlight: (i: number) => void;
    activate: (i: number) => void;
    jump: () => void;
    interact: () => void;
  } | null>(null);
  const [view, setView] = useState<"perspective" | "top" | "play">("play");
  const [furnished, setFurnished] = useState(true),
    [selected, setSelected] = useState<number | null>(null);
  const [notice, setNotice] = useState("Bấm đồ vật để tìm hiểu"),
    [reset, setReset] = useState(0);
  const [avatarType, setAvatarType] = useState<"male" | "female">("male");
  const [help, setHelp] = useState(true);
  const [hall, setHall] = useState(false),
    [tourFloor, setTourFloor] = useState(room.floor),
    [arrival, setArrival] = useState(room.id);
  const [items, setItems] = useState<readonly TourItem[]>(ROOM_ITEMS),
    [near, setNear] = useState<Portal | null>(null);
  const [connector, setConnector] = useState<Portal | null>(null),
    [transit, setTransit] = useState("");
  const transitionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    setHall(false);
    setTourFloor(room.floor);
    setArrival(room.id);
    setConnector(null);
  }, [room.id]);
  useEffect(
    () => () => {
      if (transitionTimer.current) clearTimeout(transitionTimer.current);
    },
    [],
  );
  const changeFloor = (floor: number) => {
    if (!connector || transit) return;
    const id = connector.kind;
    setConnector(null);
    setTransit(id === "LIFT" ? "Thang máy đang di chuyển…" : "Đang đi qua chiếu nghỉ…");
    transitionTimer.current = setTimeout(() => {
      setTourFloor(floor);
      setArrival(id);
      setTransit("");
    }, 850);
  };

  useEffect(() => {
    sceneApi.current?.highlight(selected ?? -1);
  }, [selected]);
  useEffect(() => {
    input.current.clear();
    setSelected(null);
    if (!host.current) return;
    const el = host.current;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#dce3e4");
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 80);
    camera.position.set(
      view === "top" ? 0 : -5.8,
      view === "top" ? 10 : 6.9,
      view === "top" ? 0.01 : 7.8,
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    el.appendChild(renderer.domElement);
    scene.add(new THREE.HemisphereLight(0xffffff, 0x8c9598, 2));
    const sun = new THREE.DirectionalLight(0xfff2df, 2.6);
    sun.position.set(-3, 8, 5);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    Object.assign(sun.shadow.camera, {
      left: -7,
      right: 7,
      top: 7,
      bottom: -7,
      near: 0.5,
      far: 22,
    });
    sun.shadow.bias = -0.002;
    scene.add(sun);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0.6, 0);
    controls.minDistance = 2;
    controls.maxDistance = 22;
    controls.maxPolarAngle = Math.PI * 0.48;
    controls.enableDamping = true;
    controls.dampingFactor = 0.075;
    controls.mouseButtons = {
      LEFT: THREE.MOUSE.ROTATE,
      MIDDLE: THREE.MOUSE.DOLLY,
      RIGHT: THREE.MOUSE.PAN,
    };
    controls.touches = { ONE: THREE.TOUCH.ROTATE, TWO: THREE.TOUCH.DOLLY_PAN };
    controls.update();
    const built = hall
      ? createHallway(scene, floorRooms(tourFloor), tourFloor, arrival)
      : room.id === "E104"
        ? {
            ...createRoom104(scene, furnished, "render"),
            items: ROOM_ITEMS,
            width: ROOM104.width,
            depth: ROOM104.depth,
            portals: [
              {
                id: "exit",
                label: "Ra hành lang",
                x: -ROOM104.width / 2,
                z: -ROOM104.depth / 2 + 1.28,
                kind: "exit" as const,
              },
            ],
          }
        : createTeachingRoom(scene, room, furnished);
    const interactionHints = built.interactables
      .filter((object) => Number.isInteger(object.userData.station))
      .map((object, index) => {
        const outline = new THREE.BoxHelper(object, 0xff7627);
        const material = outline.material as THREE.LineBasicMaterial;
        material.transparent = true;
        material.opacity = 0.26;
        material.depthTest = false;
        outline.renderOrder = 24;
        outline.userData.hintIndex = index;
        scene.add(outline);
        return outline;
      });
    const avatar = createStudent(scene, avatarType),
      person = avatar.root;
    setItems(built.items);
    setNear(null);
    setConnector(null);
    const dimension = Math.max(built.width, built.depth);
    if (view !== "play") {
      camera.position.set(
        view === "top" ? 0 : -dimension * 0.7,
        view === "top" ? dimension * 1.1 : dimension * 0.85,
        view === "top" ? 0.01 : dimension * 0.9,
      );
      controls.maxDistance = dimension * 3;
      controls.update();
    }
    let changing = false,
      nearId = "";
    const usePortal = (portal: Portal) => {
      if (changing) return;
      if (portal.kind === "exit") {
        changing = true;
        setArrival(room.id);
        setTourFloor(room.floor);
        setHall(true);
      } else if (portal.kind === "room") {
        changing = true;
        setHall(false);
        window.dispatchEvent(new CustomEvent("campus-room", { detail: portal.id }));
      } else {
        keys.clear();
        el.blur();
        setConnector(portal);
      }
    };

    person.position.copy(built.start);
    person.rotation.y = Math.PI / 2;
    let dirty = true,
      animateUntil = 0;
    const invalidate = () => {
      dirty = true;
    };
    controls.addEventListener("change", invalidate);
    sceneApi.current = {
      highlight: (i) => {
        built.highlight(i);
        dirty = true;
      },
      activate: (i) => {
        built.activate(i);
        animateUntil = performance.now() + 5000;
        dirty = true;
      },
      jump: () => {
        avatar.jump();
        animateUntil = performance.now() + 1000;
        dirty = true;
      },
      interact: () => interact(),
    };
    let path: P[] = [],
      frameId = 0,
      last = 0,
      visible = true,
      walkTime = 0,
      lastRender = 0;
    const target = new THREE.Vector3();
    if (view === "play") {
      camera.position.copy(built.start).add(new THREE.Vector3(-3.6, 4.5, 5.6));
      controls.target.copy(built.start).add(new THREE.Vector3(0, 0.8, 0));
      controls.update();
    }
    const keys = input.current;
    const interact = () => {
      const portal = built.portals.find(
        (p) => Math.hypot(person.position.x - p.x, person.position.z - p.z) < 1.35,
      );
      if (portal) {
        usePortal(portal);
        return;
      }
      let closest = -1,
        best = 2.2;
      built.items.forEach((p, i) => {
        const distance = Math.hypot(person.position.x - p.x, person.position.z - p.z);
        if (distance < best) {
          best = distance;
          closest = i;
        }
      });
      if (closest >= 0 && furnished) setSelected(closest);
      else setNotice("Chạm vào đồ vật để xem thông tin");
    };
    const down = (e: KeyboardEvent) => {
      if (view !== "play") return;
      if (
        ["w", "a", "s", "d", "arrowup", "arrowleft", "arrowdown", "arrowright"].includes(
          e.key.toLowerCase(),
        )
      ) {
        e.preventDefault();
        keys.add(e.key.toLowerCase());
        path = [];
      }
      if (e.code === "Space") {
        e.preventDefault();
        if (!e.repeat) avatar.jump();
      }
      if (e.key === "Escape") {
        keys.clear();
        path = [];
      }
      if (e.key.toLowerCase() === "e") interact();
    };
    const up = (e: KeyboardEvent) => keys.delete(e.key.toLowerCase()),
      blur = () => {
        keys.clear();
        path = [];
      };
    el.addEventListener("keydown", down);
    el.addEventListener("keyup", up);
    window.addEventListener("blur", blur);
    let pointer: [number, number] = [0, 0],
      dragged = false;
    const activePointers = new Set<number>();
    const remember = (e: PointerEvent) => {
      activePointers.add(e.pointerId);
      if (activePointers.size === 1) {
        pointer = [e.clientX, e.clientY];
        dragged = false;
      } else dragged = true;
      el.focus({ preventScroll: true });
    };
    const track = (e: PointerEvent) => {
      if (e.buttons && Math.hypot(e.clientX - pointer[0], e.clientY - pointer[1]) > 6)
        dragged = true;
    };
    const pick = (e: PointerEvent) => {
      activePointers.delete(e.pointerId);
      if (e.button !== 0 || dragged || activePointers.size) return;
      const rect = renderer.domElement.getBoundingClientRect(),
        ray = new THREE.Raycaster();
      ray.setFromCamera(
        new THREE.Vector2(
          ((e.clientX - rect.left) / rect.width) * 2 - 1,
          (-(e.clientY - rect.top) / rect.height) * 2 + 1,
        ),
        camera,
      );
      const hit = ray.intersectObjects(built.interactables, true)[0];
      if (hit && hit.object.userData.portal) {
        const portal = built.portals.find((p) => p.id === hit.object.userData.portal);
        if (portal && Math.hypot(person.position.x - portal.x, person.position.z - portal.z) < 1.5)
          usePortal(portal);
        else setNotice("Chạm sàn để đến gần cửa, sau đó chạm nút vào phòng");
        return;
      }
      if (hit) {
        let object: THREE.Object3D | null = hit.object;
        while (object && object.userData.station === undefined) object = object.parent;
        if (object) {
          setSelected(object.userData.station);
          return;
        }
      }
      if (view === "play") {
        const ground = ray.intersectObject(built.floor)[0];
        if (ground) {
          path = roomWalkPath(
            [person.position.x, person.position.z],
            [ground.point.x, ground.point.z],
            built.obstacles,
            built.width,
            built.depth,
          );
          setNotice(
            path.length ? "Đang đi đến vị trí đã chọn" : "Chọn khoảng sàn trống để di chuyển",
          );
        }
      } else setSelected(null);
    };
    const cancelPointer = (e: PointerEvent) => {
      activePointers.delete(e.pointerId);
      dragged = true;
    };
    renderer.domElement.addEventListener("pointercancel", cancelPointer);
    renderer.domElement.addEventListener("pointerdown", remember);
    renderer.domElement.addEventListener("pointermove", track);
    renderer.domElement.addEventListener("pointerup", pick);
    const resize = new ResizeObserver(() => {
      const r = el.getBoundingClientRect();
      renderer.setSize(r.width, r.height);
      camera.aspect = r.width / r.height;
      camera.updateProjectionMatrix();
      dirty = true;
    });
    resize.observe(el);
    const observer = new IntersectionObserver((entries) => {
      visible = entries[0].isIntersecting;
      if (!visible) blur();
    });
    observer.observe(el);
    const tick = (time: number) => {
      frameId = requestAnimationFrame(tick);
      if (time - lastRender < 16) return;
      lastRender = time;
      const dt = Math.min((time - last) / 1000, 0.034);
      last = time;
      if (!visible || document.hidden) return;
      if (view !== "play" && !hall && !dirty && time > animateUntil) return;
      let mx = 0,
        mz = 0,
        moving = false;
      if (view === "play") {
        const forward = new THREE.Vector3();
        camera.getWorldDirection(forward);
        forward.y = 0;
        forward.normalize();
        const right = new THREE.Vector3(-forward.z, 0, forward.x);
        const f =
            Number(keys.has("w") || keys.has("arrowup")) -
            Number(keys.has("s") || keys.has("arrowdown")),
          r =
            Number(keys.has("d") || keys.has("arrowright")) -
            Number(keys.has("a") || keys.has("arrowleft"));
        if (f || r) {
          path = [];
          mx = forward.x * f + right.x * r;
          mz = forward.z * f + right.z * r;
        } else if (path.length) {
          while (
            path.length &&
            Math.hypot(path[0][0] - person.position.x, path[0][1] - person.position.z) < 0.09
          )
            path.shift();
          if (path.length) {
            mx = path[0][0] - person.position.x;
            mz = path[0][1] - person.position.z;
          } else setNotice("Đã đến · chạm đồ vật để khám phá");
        }
        const length = Math.hypot(mx, mz),
          before = person.position.clone();
        if (length > 0.001) {
          const step = Math.min(dt * 1.6, length);
          mx = (mx / length) * step;
          mz = (mz / length) * step;
          const nextX = person.position.x + mx,
            nextZ = person.position.z + mz;
          if (roomFree(nextX, nextZ, built.obstacles, built.width, built.depth)) {
            person.position.x = nextX;
            person.position.z = nextZ;
          } else {
            if (roomFree(nextX, person.position.z, built.obstacles, built.width, built.depth))
              person.position.x = nextX;
            if (roomFree(person.position.x, nextZ, built.obstacles, built.width, built.depth))
              person.position.z = nextZ;
          }
          const desiredRotation = Math.atan2(mx, mz),
            rotationDelta = Math.atan2(
              Math.sin(desiredRotation - person.rotation.y),
              Math.cos(desiredRotation - person.rotation.y),
            );
          person.rotation.y += rotationDelta * Math.min(1, dt * 11);
        }
        const portal = built.portals.find(
          (p) => Math.hypot(person.position.x - p.x, person.position.z - p.z) < 1.35,
        );
        if ((portal?.id || "") !== nearId) {
          nearId = portal?.id || "";
          setNear(portal || null);
        }
        if (
          portal?.kind === "exit" &&
          Math.hypot(person.position.x - portal.x, person.position.z - portal.z) < 0.37 &&
          (f || r)
        )
          usePortal(portal);
        moving = before.distanceTo(person.position) > 0.001;
        walkTime += moving ? dt * 8 : 0;
        target.copy(person.position).add(new THREE.Vector3(0, 0.8, 0));
        const follow = 1 - Math.exp(-10 * dt),
          delta = target.clone().sub(controls.target).multiplyScalar(follow);
        camera.position.add(delta);
        controls.target.add(delta);
        controls.update();
      }
      interactionHints.forEach((outline, i) => {
        outline.visible = view === "play" && furnished;
        (outline.material as THREE.LineBasicMaterial).opacity =
          0.18 + (Math.sin(time * 0.004 + i * 1.3) + 1) * 0.12;
      });
      avatar.update(dt, moving, walkTime);
      built.update(time, dt, camera, view === "top");
      renderer.render(scene, camera);
      dirty = false;
    };
    frameId = requestAnimationFrame(tick);
    setNotice(
      view === "play"
        ? "Chạm sàn trống để đi · Kéo để nhìn quanh · Chạm đồ vật để tìm hiểu"
        : "Kéo một ngón để xoay · Dùng hai ngón để thu phóng và dịch chuyển",
    );
    return () => {
      cancelAnimationFrame(frameId);
      keys.clear();
      sceneApi.current = null;
      observer.disconnect();
      resize.disconnect();
      el.removeEventListener("keydown", down);
      el.removeEventListener("keyup", up);
      window.removeEventListener("blur", blur);
      renderer.domElement.removeEventListener("pointercancel", cancelPointer);
      renderer.domElement.removeEventListener("pointerdown", remember);
      renderer.domElement.removeEventListener("pointermove", track);
      renderer.domElement.removeEventListener("pointerup", pick);
      controls.dispose();
      const geometries = new Set<THREE.BufferGeometry>(),
        materials = new Set<THREE.Material>(),
        textures = new Set<THREE.Texture>();
      scene.traverse((o) => {
        if (
          o instanceof THREE.Mesh ||
          o instanceof THREE.LineSegments ||
          o instanceof THREE.Sprite
        ) {
          if (!(o instanceof THREE.Sprite)) geometries.add(o.geometry);
          (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => {
            materials.add(m);
            const map = (m as THREE.MeshStandardMaterial).map;
            if (map) textures.add(map);
          });
        }
      });
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
      textures.forEach((t) => t.dispose());
      avatar.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [room.id, view, furnished, reset, hall, tourFloor, arrival, avatarType]);
  return (
    <div className="room-preview">
      <div className="room-preview-tools">
        <span>{hall ? `HÀNH LANG · ${FLOOR_LABELS[tourFloor]}` : "KHÁM PHÁ KHÔNG GIAN"}</span>
        <div>
          {(["perspective", "top", "play"] as const).map((v) => (
            <button
              key={v}
              className={view === v ? "active" : ""}
              aria-pressed={view === v}
              onClick={() => setView(v)}
            >
              {v === "perspective" ? "Góc 3D" : v === "top" ? "Mặt bằng" : "Tham quan"}
            </button>
          ))}
          <button onClick={() => setHelp(true)}>Hướng dẫn chạm</button>
        </div>
      </div>
      <div className="room-options">
        <div className="avatar-picker" aria-label="Chọn nhân vật">
          <span>Nhân vật</span>
          <button
            className={avatarType === "male" ? "active" : ""}
            aria-pressed={avatarType === "male"}
            onClick={() => setAvatarType("male")}
          >
            Nam
          </button>
          <button
            className={avatarType === "female" ? "active" : ""}
            aria-pressed={avatarType === "female"}
            onClick={() => setAvatarType("female")}
          >
            Nữ
          </button>
        </div>
        <button onClick={() => setFurnished((v) => !v)}>
          {furnished ? "Ẩn nội thất" : "Hiện nội thất"}
        </button>
        <button onClick={() => setReset((v) => v + 1)}>Về cửa vào</button>
      </div>
      <div
        ref={host}
        tabIndex={0}
        role="application"
        className="room-canvas"
        aria-label={`Khám phá ${hall ? FLOOR_LABELS[tourFloor] : room.id}: chạm sàn để đi, kéo để nhìn quanh, chạm đồ vật để tìm hiểu`}
      />
      {view === "play" && (
        <div className="walk-controls" aria-label="Điều khiển nhân vật">
          {[
            ["↑", "w"],
            ["←", "a"],
            ["↓", "s"],
            ["→", "d"],
          ].map(([label, key]) => (
            <button
              key={key}
              aria-label={"Đi " + label}
              onPointerDown={(e) => {
                e.currentTarget.setPointerCapture(e.pointerId);
                input.current.add(key);
              }}
              onPointerUp={() => input.current.delete(key)}
              onPointerCancel={() => input.current.delete(key)}
              onLostPointerCapture={() => input.current.delete(key)}
            >
              {label}
            </button>
          ))}
          <button className="jump-button" onClick={() => sceneApi.current?.jump()}>
            Nhảy
          </button>
          <button className="interact-button" onClick={() => sceneApi.current?.interact()}>
            Tương tác
          </button>
        </div>
      )}
      {selected !== null && items[selected] && furnished && (
        <div className="station-detail" role="status">
          <button aria-label="Đóng thông tin đồ vật" onClick={() => setSelected(null)}>
            ×
          </button>
          <small>{items[selected].name}</small>
          <h3>{items[selected].title}</h3>
          <p>{items[selected].description}</p>
          {((room.id === "E104" && [1, 3, 4, 6].includes(selected)) ||
            (room.id !== "E104" && items[selected].action !== "Tìm hiểu")) && (
            <button
              className="object-action"
              onClick={() => {
                sceneApi.current?.activate(selected);
                setNotice(
                  selected === 4
                    ? "Máy đang pha cà phê minh họa"
                    : selected === 3
                      ? "Đã đổi trạng thái cánh tủ"
                      : "Đã đổi trạng thái màn hình",
                );
              }}
            >
              {items[selected].action}
            </button>
          )}
        </div>
      )}
      <div className="room-item-list" aria-label="Đồ vật trong phòng">
        {items.map((item, i) => (
          <button
            disabled={!furnished}
            key={item.name}
            aria-pressed={selected === i}
            className={selected === i ? "active" : ""}
            onClick={() => setSelected(i)}
          >
            {item.name}
          </button>
        ))}
      </div>
      {view === "play" && near && !connector && (
        <button className="portal-hint" onClick={() => sceneApi.current?.interact()}>
          <kbd>Chạm</kbd> {near.label}
        </button>
      )}
      {connector && (
        <div className="floor-picker" role="dialog" aria-label="Chọn tầng">
          <button className="picker-close" onClick={() => setConnector(null)}>
            Đóng
          </button>
          <h3>{connector.label}</h3>
          <p>Đang ở {FLOOR_LABELS[tourFloor]}</p>
          <div>
            {(connector.kind === "LIFT"
              ? [0, 4, 5, 6]
              : [tourFloor - 1, tourFloor + 1].filter(
                  (f) => f >= 0 && f <= (connector.kind === "CT2" ? 6 : 7),
                )
            ).map((f) => (
              <button disabled={f === tourFloor} key={f} onClick={() => changeFloor(f)}>
                {FLOOR_LABELS[f]}
              </button>
            ))}
          </div>
        </div>
      )}
      {transit && (
        <div className="tour-transition" role="status">
          {transit}
        </div>
      )}
      {help && (
        <div className="touch-help">
          <strong>Khám phá tương tác</strong>
          <p>① Chạm vào sàn trống để nhân vật đi đến đó.</p>
          <p>② Kéo một ngón để nhìn quanh; dùng hai ngón để thu phóng.</p>
          <p>
            ③ Chạm đồ vật để tìm hiểu. Đến gần cửa rồi chạm nút hiện trên màn hình để sang phòng.
          </p>
          <button onClick={() => setHelp(false)}>Đã hiểu · Bắt đầu tham quan</button>
        </div>
      )}
      <div className="room-preview-caption">
        {notice}
        <span>{avatarType === "female" ? "Sinh viên nữ UEH" : "Sinh viên nam UEH"}</span>
      </div>
    </div>
  );
}
function RoomRenderGallery({ id }: { id: string }) {
  const photos =
    id === "E102"
      ? [
          { file: "102", label: "Toàn cảnh phòng" },
          { file: "106", label: "Khu trình chiếu" },
          { file: "109", label: "Khu hậu kỳ" },
        ]
      : id === "E401"
        ? [
            { file: "144", label: "Toàn cảnh phòng" },
            { file: "148", label: "Xe đạp tương tác" },
            { file: "153_1", label: "Khu máy tính" },
          ]
        : [
            { file: "134", label: "Toàn cảnh phòng" },
            { file: "137", label: "Khu bàn học" },
            { file: "139", label: "Khu làm việc" },
          ];
  const [active, setActive] = useState(0);
  const photo = photos[active];
  return (
    <div className="room-render-gallery" aria-label={"Ảnh thiết kế phòng " + id}>
      <figure>
        <img
          src={`${(process.env.NEXT_PUBLIC_BASE_PATH ?? "") + "/"}rooms/${id.toLowerCase()}/${photo.file}.jpg`}
          alt={photo.label + " — phòng " + id}
          width={960}
          height={540}
          loading="lazy"
        />
        <figcaption>
          {photo.label}
          <span>
            {active + 1} / {photos.length}
          </span>
        </figcaption>
      </figure>
      <div className="render-thumbnails">
        {photos.map((item, i) => (
          <button
            key={item.file}
            aria-label={"Xem " + item.label.toLowerCase()}
            aria-pressed={active === i}
            onClick={() => setActive(i)}
          >
            <img
              src={`${(process.env.NEXT_PUBLIC_BASE_PATH ?? "") + "/"}rooms/${id.toLowerCase()}/${item.file}.jpg`}
              alt=""
              width={960}
              height={540}
              loading="lazy"
            />
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function RoomPicker({
  value,
  onChange,
  start = false,
}: {
  value: string;
  onChange: (id: string) => void;
  start?: boolean;
}) {
  const [open, setOpen] = useState(false),
    [floor, setFloor] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null),
    trigger = useRef<HTMLButtonElement>(null);
  const chosen = ROOMS.find((r) => r.id === (start ? value.replace("ROOM-", "") : value));
  useEffect(() => {
    if (open) dialog.current?.showModal();
  }, [open]);
  const close = () => {
    setOpen(false);
    trigger.current?.focus();
  };
  const choose = (id: string) => {
    onChange(id);
    close();
  };
  return (
    <div className="room-selector">
      <span>{start ? "Vị trí hiện tại" : "Phòng cần đến"}</span>
      <button
        ref={trigger}
        className="select-room"
        aria-haspopup="dialog"
        onClick={() => {
          setFloor(chosen?.floor ?? 0);
          setOpen(true);
        }}
      >
        {chosen
          ? chosen.id + " · " + roomGroups[chosen.floor].label
          : value === "ENTRY"
            ? "Cổng Nguyễn Văn Thủ · Tầng trệt"
            : start
              ? "Chọn vị trí bắt đầu"
              : "Chọn tầng và phòng"}{" "}
        <ChevronRight />
      </button>
      {open && (
        <dialog ref={dialog} className="room-picker-dialog" onCancel={close}>
          <header>
            <div>
              <small>CHỌN TẦNG → CHỌN PHÒNG</small>
              <h2>{start ? "Bạn đang ở đâu?" : "Bạn muốn đến phòng nào?"}</h2>
            </div>
            <button onClick={close}>Đóng ×</button>
          </header>
          <nav aria-label="Chọn tầng">
            {roomGroups.map((g) => (
              <button
                key={g.floor}
                aria-pressed={floor === g.floor}
                onClick={() => setFloor(g.floor)}
              >
                {g.label}
              </button>
            ))}
          </nav>
          <h3>{roomGroups[floor].label}</h3>
          <div className="picker-rooms">
            {start && floor === 0 && (
              <button onClick={() => choose("ENTRY")}>
                <b>Lối vào</b>
                <span>Cổng Nguyễn Văn Thủ</span>
              </button>
            )}
            {roomGroups[floor].rooms.map((r) => (
              <button key={r.id} onClick={() => choose(start ? "ROOM-" + r.id : r.id)}>
                <b>{r.id}</b>
                <span>{r.name}</span>
              </button>
            ))}
          </div>
        </dialog>
      )}
    </div>
  );
}
function RoomDetail({
  room,
  route,
  onClose,
}: {
  room: Room;
  route: RouteData;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [tab, setTab] = useState<"info" | "photos">("info");
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    dialog.current?.showModal();
    return () => previous?.focus();
  }, []);
  return (
    <dialog
      ref={dialog}
      className="room-detail-dialog"
      onCancel={onClose}
      aria-label="Thông tin phòng"
    >
      <header>
        <button className="journey-back nav-emphasis" onClick={onClose}>
          ← Trở về điều hướng
        </button>
        <strong>
          {room.id} · {roomGroups[room.floor].label}
        </strong>
        <div>
          <button aria-pressed={tab === "info"} onClick={() => setTab("info")}>
            Thông tin
          </button>
          {["E104", "E102", "E401"].includes(room.id) && (
            <button aria-pressed={tab === "photos"} onClick={() => setTab("photos")}>
              Ảnh thiết kế
            </button>
          )}
        </div>
      </header>
      {tab === "info" ? (
        <div className="detail-layout">
          <div className="detail-plan">
            <MiniPlan floor={room.floor} dest={room.id} route={route} />
          </div>
          <section>
            <small>{commonSpaceName(room.floor)}</small>
            <h2>{room.name}</h2>
            <h3>Chức năng & hoạt động nghiên cứu</h3>
            <p>{ROOM_CATALOGUE[room.id]?.description}</p>
            <h3>Tiếp cận</h3>
            <p>
              {room.floor === 7
                ? "Tầng 7 chỉ có cầu thang bộ CT1"
                : "Theo tuyến đường đến cửa phòng tại " + roomGroups[room.floor].label}
            </p>
            <h3>Nội thất & thiết bị minh họa</h3>
            <p>
              {room.id === "E104"
                ? "Bàn học đôi · màn hình di động · máy tính · kệ trưng bày · tủ hồ sơ · quầy cà phê"
                : room.id === "E102"
                  ? "Bàn học · màn hình di động · vách lưới · kệ học liệu"
                  : room.id === "E401"
                    ? "Bàn học · máy tính · xe đạp · bàn mô hình"
                    : "Bàn ghế học tập · bảng trắng · bàn giáo viên"}
            </p>
            <p>Nội thất 3D là bố trí minh họa không gian.</p>
          </section>
        </div>
      ) : (
        <RoomRenderGallery key={room.id} id={room.id} />
      )}
    </dialog>
  );
}

export default function CampusEMap() {
  const [tourId, setTourId] = useState<string | null>(null);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requested = params.get("room");
    const level = params.get("floor");
    if (level !== null && /^[0-7]$/.test(level)) {
      setOneFloor(Number(level));
      setShowAll(false);
    }
    if (requested && ROOMS.some((r) => r.id === requested)) {
      setDestId(requested);
      setShowAll(false);
    }
  }, []);
  const host = useRef<HTMLDivElement>(null);
  const [startId, setStartId] = useState("");
  const [destId, setDestId] = useState("");
  const [detailId, setDetailId] = useState<string | null>(null);
  const [oneFloor, setOneFloor] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(true);
  const start = STARTS.find((p) => p.id === startId) ?? PLACES[0];
  const dest = ROOMS.find((r) => r.id === destId) ?? ROOMS[0];
  const hasRoute = !!startId && !!destId;
  const route = useMemo<RouteData>(
    () => (hasRoute ? routeFor(start, dest) : { mode: "WALK", floors: [], paths: {}, steps: [] }),
    [start, dest, hasRoute],
  );
  const resetJourney = () => {
    setStartId("");
    setDestId("");
    setOneFloor(null);
    setShowAll(true);
    setDetailId(null);
  };
  useEffect(() => {
    const f = (e: Event) => {
      const id = (e as CustomEvent<string>).detail;
      if (!ROOMS.some((r) => r.id === id)) return;
      if (tourId) setTourId(id);
      else {
        setDestId(id);
        setOneFloor(null);
        setShowAll(false);
      }
    };
    window.addEventListener("campus-room", f);
    return () => window.removeEventListener("campus-room", f);
  }, [tourId]);
  useEffect(() => {
    if (tourId || !host.current) return;
    return buildScene(host.current, {
      exploded: true,
      floor: oneFloor,
      showAll: showAll || !hasRoute,
      dest: destId,
      start,
      route,
    });
  }, [oneFloor, showAll, destId, start, route, tourId]);
  return (
    <div className="app-shell">
      <header className="topbar">
        <img
          src={`${(process.env.NEXT_PUBLIC_BASE_PATH ?? "") + "/"}tch-logo-lockup.png`}
          alt="Technology Convergence Hub"
          width={218}
          height={60}
        />
        <div>
          <span>Chỉ đường trong tòa nhà</span>
          <b>Cơ sở E · UEH</b>
        </div>
        <div className="status">
          <i /> Đang hoạt động
        </div>
      </header>
      {!tourId && (
        <>
          {" "}
          <section className="workspace">
            <aside className="panel controls-panel">
              <div className="panel-title">
                <LocateFixed /> Hành trình của bạn
              </div>
              <RoomPicker
                start
                value={startId}
                onChange={(id) => {
                  setStartId(id);
                  setOneFloor(null);
                  setShowAll(false);
                }}
              />
              <RoomPicker
                value={destId}
                onChange={(id) => {
                  setDestId(id);
                  setOneFloor(null);
                  setShowAll(false);
                }}
              />
              <button className="journey-back nav-emphasis reset-journey" onClick={resetJourney}>
                <RotateCcw aria-hidden="true" />
                <span>Đặt lại hành trình</span>
              </button>
              {destId && (
                <div
                  className="room-card"
                  role="button"
                  tabIndex={0}
                  onClick={() => setDetailId(destId)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") setDetailId(destId);
                  }}
                >
                  <span>{FLOOR_LABELS[dest.floor]}</span>
                  <div>
                    <small>PHÒNG ĐÃ CHỌN</small>
                    <strong>{dest.id}</strong>
                    <p className="room-card-name">{dest.name}</p>
                  </div>
                </div>
              )}
              <div className="legend">
                <b>CHÚ THÍCH</b>
                <span>
                  <i className="lab" />
                  Phòng LAB
                </span>
                <span>
                  <i className="class" />
                  Phòng học
                </span>
                <span>
                  <i className="stair" />
                  CT1 / CT2
                </span>
                <span>
                  <i className="lift" />
                  Thang máy
                </span>
                <span>
                  <i className="wc" />
                  WC Nam / Nữ
                </span>
                <span>
                  <i className="selected" />
                  Điểm đến
                </span>
                <span>
                  <i className="route" />
                  Tuyến đường di chuyển
                </span>
              </div>
            </aside>
            <div className="map-stage">
              <div className="stage-tools">
                <button
                  className={showAll && oneFloor === null ? "active" : ""}
                  onClick={() => {
                    setOneFloor(null);
                    setShowAll(true);
                  }}
                >
                  <Building2 />
                  Toàn bộ tòa nhà
                </button>
                <button
                  className={!showAll && oneFloor === null ? "active" : ""}
                  onClick={() => {
                    setOneFloor(null);
                    setShowAll(false);
                  }}
                >
                  <Route />
                  Tầng của tuyến
                </button>
                <span>
                  <Rotate3D /> Một ngón: dịch chuyển · Hai ngón: xoay / thu phóng
                </span>
              </div>
              <div ref={host} className="three-host" />
              <nav className="floor-rail">
                {FLOOR_LABELS.map((f, i) => (
                  <button
                    key={f}
                    className={oneFloor === i ? "active" : ""}
                    onClick={() => {
                      setOneFloor(i);
                      setShowAll(false);
                    }}
                  >
                    {f}
                  </button>
                ))}
              </nav>
            </div>
            <aside className="panel route-panel">
              <div className="panel-title">
                <Route /> Chỉ đường
              </div>
              {hasRoute ? (
                <>
                  <h2>
                    {start.label}
                    <ChevronRight />
                    {dest.id}
                  </h2>
                  <div className="destination-summary">
                    <small>PHÒNG ĐẾN · {dest.id}</small>
                    <h3>{dest.name}</h3>
                  </div>
                  <div className="route-mode">
                    <Navigation />
                    {route.mode === "LIFT"
                      ? "THANG MÁY"
                      : route.mode === "WALK"
                        ? "CÙNG TẦNG"
                        : `CẦU THANG ${route.mode}`}
                  </div>
                  <ol>
                    {route.steps.map((s, i) => (
                      <li key={s}>
                        <b>{String(i + 1).padStart(2, "0")}</b>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ol>
                </>
              ) : (
                <div className="destination-summary">
                  <h3>Khám phá Campus E</h3>
                  <p>
                    Chọn vị trí hiện tại và phòng cần đến để tìm đường. Chạm phòng trên mô hình để
                    chọn; mở thông tin hoặc tham quan bằng các nút bên phải.
                  </p>
                </div>
              )}
            </aside>
            <aside className="panel floor-plan-panel" aria-label="Mặt bằng tầng">
              <button className="tour-launch" disabled={!destId} onClick={() => setTourId(destId)}>
                <Rotate3D />
                <strong>Tham quan 3D</strong>
                <span>
                  {destId ? dest.id + " · Khám phá không gian →" : "Chọn phòng để bắt đầu"}
                </span>
              </button>
              {destId ? (
                <>
                  <div className="mini-head">
                    <Map /> Mặt bằng · {FLOOR_LABELS[dest.floor]}
                  </div>
                  <button className="journey-back" onClick={() => setDetailId(dest.id)}>
                    Mở mặt bằng & thông tin phòng ↗
                  </button>
                  <MiniPlan floor={dest.floor} dest={dest.id} route={route} />
                </>
              ) : (
                <>
                  <div className="panel-title">
                    <Map /> Mặt bằng
                  </div>
                  <p className="plan-placeholder">
                    Chọn nơi cần đến để xem mặt bằng và thông tin phòng.
                  </p>
                </>
              )}
            </aside>
          </section>
        </>
      )}
      {tourId && (
        <section className="tour-screen">
          <header>
            <button className="journey-back nav-emphasis tour-back" onClick={() => setTourId(null)}>
              <ArrowLeft aria-hidden="true" />
              <span>TRỞ VỀ ĐIỀU HƯỚNG</span>
            </button>
            <strong>
              {tourId} · {ROOMS.find((r) => r.id === tourId)!.name}
            </strong>
            <span>THAM QUAN 3D</span>
          </header>
          <RoomPreview room={ROOMS.find((r) => r.id === tourId)!} />
        </section>
      )}
      {detailId && (
        <RoomDetail
          room={ROOMS.find((r) => r.id === detailId)!}
          route={route}
          onClose={() => setDetailId(null)}
        />
      )}
      <footer>
        <Footprints /> Tuyến chỉ mang tính định hướng; không thay thế sơ đồ thoát hiểm hoặc chỉ dẫn
        an toàn tại công trình.
      </footer>
    </div>
  );
}
