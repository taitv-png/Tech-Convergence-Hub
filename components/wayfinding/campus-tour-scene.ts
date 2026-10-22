import * as THREE from "three";
import { tr } from "./locale";
import { commonSpaceName } from "./room-catalogue";
import { createStudent, type RoomObstacle, type StudentVariant } from "./room104-scene";

export type TourRoom = {
  id: string;
  name: string;
  floor: number;
  box: [number, number, number, number];
  door: [number, number];
  doors?: [number, number][];
};
export type TourItem = {
  name: string;
  x: number;
  z: number;
  title: string;
  description: string;
  action: string;
};
export type Portal = {
  id: string;
  label: string;
  x: number;
  z: number;
  kind: "room" | "exit" | "CT1" | "CT2" | "LIFT";
};
const SCALE = 2.57;
const world = (x: number, z: number) => new THREE.Vector3((x - 5.1) * SCALE, 0, (z - 3.6) * SCALE);
export function roomSize(room: TourRoom) {
  return { width: (room.box[2] - room.box[0]) * SCALE, depth: (room.box[3] - room.box[1]) * SCALE };
}
export function roomEntry(room: TourRoom) {
  const { width: w, depth: d } = roomSize(room),
    [x0, z0, x1, z1] = room.box;
  const x = (room.door[0] - (x0 + x1) / 2) * SCALE,
    z = (room.door[1] - (z0 + z1) / 2) * SCALE;
  const start = new THREE.Vector3(x, 0, z);
  if (Math.abs(x + w / 2) < 0.1) start.x += 0.65;
  else if (Math.abs(x - w / 2) < 0.1) start.x -= 0.65;
  else if (Math.abs(z + d / 2) < 0.1) start.z += 0.65;
  else start.z -= 0.65;
  return { start, x, z };
}
function kit(scene: THREE.Scene) {
  const mat = (color: number, opacity = 1) =>
    new THREE.MeshStandardMaterial({
      color,
      roughness: 0.78,
      transparent: opacity < 1,
      opacity,
      depthWrite: opacity === 1,
    });
  const white = mat(0xedece7),
    wood = mat(0xc69a6b),
    metal = mat(0x424d50),
    steel = mat(0x9da6a5),
    teal = mat(0x167e82);
  const box = (
    w: number,
    h: number,
    d: number,
    x: number,
    y: number,
    z: number,
    m: THREE.Material = white,
    parent: THREE.Object3D = scene,
  ) => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m);
    mesh.position.set(x, y, z);
    parent.add(mesh);
    mesh.receiveShadow = true;
    return mesh;
  };
  const bar = (
    a: THREE.Vector3,
    b: THREE.Vector3,
    r: number,
    m: THREE.Material,
    parent: THREE.Object3D,
  ) => {
    const delta = b.clone().sub(a),
      mesh = new THREE.Mesh(new THREE.CylinderGeometry(r, r, delta.length(), 8), m);
    mesh.position.copy(a).add(b).multiplyScalar(0.5);
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), delta.normalize());
    parent.add(mesh);
    return mesh;
  };
  const sign = (text: string, x: number, y: number, z: number) => {
    const c = document.createElement("canvas");
    c.width = 512;
    c.height = 128;
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = "#173c46";
    ctx.roundRect(0, 0, 512, 128, 16);
    ctx.fill();
    ctx.fillStyle = "white";
    ctx.font = "600 38px Arial";
    ctx.textAlign = "center";
    ctx.fillText(text, 256, 78);
    const texture = new THREE.CanvasTexture(c);
    texture.colorSpace = THREE.SRGBColorSpace;
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, depthTest: true }));
    sprite.position.set(x, y, z);
    sprite.scale.set(2.4, 0.6, 1);
    scene.add(sprite);
    return sprite;
  };
  return { mat, white, wood, metal, steel, teal, box, bar, sign };
}

export function createTeachingRoom(scene: THREE.Scene, room: TourRoom, furnished: boolean) {
  const k = kit(scene),
    { box, mat, white, wood, metal, steel, teal, bar } = k,
    { width: w, depth: d } = roomSize(room);
  const entry = roomEntry(room),
    obstacles: RoomObstacle[] = [],
    interactables: THREE.Object3D[] = [],
    items: TourItem[] = [],
    groups: THREE.Group[] = [];
  const floor = box(w, 0.12, d, 0, -0.06, 0, mat(0xe5e6e2));
  const walls: THREE.Group[] = [];
  const wallMat = mat(0xecece7, 0.22),
    glass = mat(0x98cad2, 0.15),
    faded = mat(0x737d80, 0.16);
  // Cut an actual opening at the same side and position as the existing floor plan.
  for (let side = 0; side < 4; side++) {
    const g = new THREE.Group();
    scene.add(g);
    walls.push(g);
    const vertical = side < 2,
      length = vertical ? d : w;
    const fixed = ((side % 2 ? -1 : 1) * (vertical ? w : d)) / 2;
    const sideEntry = (room.doors ?? [room.door])
      .map((door) => roomEntry({ ...room, door }))
      .find((e) => (vertical ? Math.abs(e.x - fixed) < 0.1 : Math.abs(e.z - fixed) < 0.1));
    const hasDoor = !!sideEntry;
    const at = vertical ? (sideEntry?.z ?? entry.z) : (sideEntry?.x ?? entry.x);
    const part = (a: number, b: number, y: number, h: number) => {
      if (b <= a) return;
      box(
        vertical ? 0.1 : b - a,
        h,
        vertical ? b - a : 0.1,
        vertical ? fixed : (a + b) / 2,
        y,
        vertical ? (a + b) / 2 : fixed,
        wallMat,
        g,
      );
    };
    if (hasDoor) {
      part(-length / 2, at - 0.6, 1.5, 3);
      part(at + 0.6, length / 2, 1.5, 3);
      part(at - 0.6, at + 0.6, 2.65, 0.7);
      for (const offset of [-0.61, 0.61])
        box(
          vertical ? 0.12 : 0.055,
          2.3,
          vertical ? 0.055 : 0.12,
          vertical ? fixed : at + offset,
          1.15,
          vertical ? at + offset : fixed,
          metal,
          g,
        );
      box(
        vertical ? 0.13 : 1.25,
        0.08,
        vertical ? 1.25 : 0.13,
        vertical ? fixed : at,
        2.3,
        vertical ? at : fixed,
        metal,
        g,
      );
    } else {
      // Low sill + transparent window band keeps the cutaway readable.
      part(-length / 2, length / 2, 0.45, 0.9);
      part(-length / 2, length / 2, 2.8, 0.4);
      box(
        vertical ? 0.06 : length,
        1.65,
        vertical ? length : 0.06,
        vertical ? fixed : 0,
        1.75,
        vertical ? 0 : fixed,
        glass,
        g,
      );
      for (let a = -length / 2 + 0.9; a < length / 2; a += 1.3)
        box(
          vertical ? 0.08 : 0.04,
          1.65,
          vertical ? 0.04 : 0.08,
          vertical ? fixed : a,
          1.75,
          vertical ? a : fixed,
          mat(0x4e6266, 0.35),
          g,
        );
    }
  }
  const add = (name: string, x: number, z: number, description: string, action = tr("Tìm hiểu", "Learn more")) => {
    const i = items.length;
    items.push({ name, x, z, title: name, description, action });
    const g = new THREE.Group();
    g.userData.station = i;
    scene.add(g);
    groups.push(g);
    if (furnished) interactables.push(g);
    return g;
  };
  const obstacle = (x: number, z: number, w: number, d: number) => obstacles.push({ x, z, w, d });
  const desk = (x: number, z: number, width: number, g: THREE.Group) => {
    box(width, 0.055, 0.55, x, 0.75, z, wood, g);
    for (const dx of [-width / 2 + 0.1, width / 2 - 0.1]) {
      box(0.045, 0.72, 0.045, x + dx, 0.36, z, steel, g);
      box(0.06, 0.05, 0.55, x + dx, 0.04, z, steel, g);
    }
    obstacle(x, z, width, 0.55);
  };
  const chair = (x: number, z: number, g: THREE.Group, rotation = 0) => {
    const a = new THREE.Group();
    a.position.set(x, 0, z);
    a.rotation.y = rotation;
    g.add(a);
    box(0.42, 0.055, 0.42, 0, 0.45, 0, wood, a);
    box(0.42, 0.3, 0.045, 0, 0.67, 0.19, wood, a);
    for (const dx of [-0.17, 0.17])
      for (const dz of [-0.17, 0.17]) box(0.025, 0.44, 0.025, dx, 0.22, dz, steel, a);
    obstacle(x, z, 0.44, 0.44);
  };
  const screens: THREE.MeshStandardMaterial[] = [];
  const screen = (x: number, z: number, g: THREE.Group, width = 1.1, y = 1.3) => {
    const m = mat(0x18292d);
    m.emissive.set(0x167c8f);
    m.emissiveIntensity = 0.05;
    screens.push(m);
    box(width, 0.65, 0.06, x, y, z, metal, g);
    box(width - 0.06, 0.59, 0.01, x, y, z + 0.04, m, g);
    box(0.04, 0.6, 0.04, x, y - 0.5, z, steel, g);
    return m;
  };
  const special = room.id === "E102" || room.id === "E401";
  const seats = add(
    tr("Khu bàn học", "Study area"),
    w > 0.6 ? -0.1 : 0,
    0.5,
    tr("Bàn và ghế hướng về khu trình chiếu, chừa lối đi dọc để tham quan.", "Desks and chairs face the presentation area, with an aisle left for visitors."),
  );
  const presentation = add(
    special ? tr("Màn hình trình chiếu", "Presentation screen") : tr("Bảng trắng", "Whiteboard"),
    0,
    -d / 2 + 1.1,
    special
      ? tr("Màn hình phục vụ trình chiếu và trao đổi. Có thể bật hoặc tắt nội dung minh họa.", "A screen for presentations and discussion. The sample content can be turned on or off.")
      : tr("Bảng trắng ở đầu phòng, phía trước các hàng bàn học.", "A whiteboard at the front of the room, ahead of the rows of desks."),
    special ? tr("Bật / tắt màn hình", "Screen on / off") : tr("Viết / xóa bảng", "Write / wipe the board"),
  );
  const teacher = add(
    tr("Bàn làm việc", "Work desk"),
    -w / 2 + 0.8,
    -d / 2 + 1.4,
    tr("Bàn làm việc với máy tính và không gian chuẩn bị nội dung.", "A desk with a computer and space to prepare content."),
    tr("Bật / tắt máy tính", "Computer on / off"),
  );
  const moving: THREE.Object3D[] = [];
  if (furnished) {
    const rows = Math.max(2, Math.floor((d - 3.8) / 1.3)),
      columns = w > 5 ? 2 : 1,
      deskWidth = columns === 2 ? Math.min(1.8, (w - 2.4) / 2) : Math.min(2.4, w - 1.5);
    for (let row = 0; row < rows; row++)
      for (let col = 0; col < columns; col++) {
        const x = columns === 2 ? (col ? 1 : -1) * (deskWidth / 2 + 0.48) : 0.25,
          z = -d / 2 + 3.0 + row * 1.3;
        // Leave the door landing clear even on side-entry rooms such as E401.
        if (
          (room.doors ?? [room.door])
            .map((door) => roomEntry({ ...room, door }))
            .some(
              (e) => Math.abs(z - e.start.z) < 1.0 && Math.abs(x - e.start.x) < deskWidth / 2 + 1.0,
            )
        )
          continue;
        desk(x, z, deskWidth, seats);
        chair(x - 0.38, z + 0.53, seats);
        chair(x + 0.38, z + 0.53, seats);
      }
    if (special) {
      screen(0, -d / 2 + 1.25, presentation, Math.min(2.3, w - 0.8), 1.65);
      obstacle(0, -d / 2 + 1.25, 2.1, 0.42);
    } else {
      box(Math.min(2.5, w - 0.7), 1.05, 0.055, 0, 1.7, -d / 2 + 0.12, white, presentation);
    }
    const teacherX =
      entry.start.x < 0 && entry.start.z < -d / 2 + 1.3 ? w / 2 - 0.85 : -w / 2 + 0.85;
    desk(teacherX, -d / 2 + 1.0, 1.35, teacher);
    screen(teacherX, -d / 2 + 1.0, teacher, 0.55, 1.05);
    chair(teacherX, -d / 2 + 1.6, teacher);
    if (room.id === "E102") {
      const display = add(
        tr("Vách lưới trưng bày", "Display mesh wall"),
        w / 2 - 0.35,
        0,
        tr("Vách lưới đen dọc hai bên phòng, dùng treo và trưng bày học liệu.", "Black mesh walls along both sides of the room for hanging and showing learning materials."),
      );
      for (const side of [-1, 1])
        for (let z = -d / 2 + 2.6; z < d / 2 - 0.5; z += 2.2) {
          if (Math.abs((side * w) / 2 - entry.x) < 0.2 && Math.abs(z - entry.z) < 1.7) continue;
          const x = side * (w / 2 - 0.15);
          for (let a = -0.85; a <= 0.85; a += 0.14)
            box(0.025, 2.05, 0.012, x, 1.05, z + a, metal, display);
          for (let y = 0.1; y < 2.2; y += 0.14) box(0.025, 0.012, 1.75, x, y, z, metal, display);
        }
      const shelf = add(
        tr("Kệ học liệu", "Learning material shelf"),
        w / 2 - 0.75,
        -d / 2 + 0.25,
        tr("Kệ mở ở cuối phòng, cạnh bàn máy tính và khu hậu kỳ.", "Open shelves at the back of the room, next to the computer desk and post-production area."),
      );
      for (let y = 0.15; y < 2.3; y += 0.35)
        box(1.25, 0.035, 0.38, w / 2 - 0.75, y, -d / 2 + 0.24, metal, shelf);
      obstacle(w / 2 - 0.75, -d / 2 + 0.24, 1.25, 0.4);
    }
    if (room.id === "E401") {
      const bike = add(
        tr("Xe đạp tương tác", "Interactive bicycle"),
        -w / 2 + 0.45,
        d / 2 - 1.35,
        tr("Xe đạp dùng cho trải nghiệm tương tác mô phỏng. Nhấn để thử quay bánh xe.", "A bicycle for interactive simulation. Press to spin the wheel."),
        tr("Chạy / dừng xe đạp", "Start / stop the bicycle"),
      );
      const bx = -w / 2 + 0.45,
        bz = d / 2 - 1.35;
      for (const z of [bz - 0.55, bz + 0.55]) {
        const wheel = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.025, 8, 28), metal);
        wheel.rotation.y = Math.PI / 2;
        wheel.position.set(bx, 0.35, z);
        bike.add(wheel);
        moving.push(wheel);
        for (let i = 0; i < 8; i++) {
          const spoke = box(0.005, 0.58, 0.007, 0, 0, 0, steel, wheel);
          spoke.rotation.z = (i * Math.PI) / 4;
        }
      }
      for (const [a, b] of [
        [
          [bx, 0.35, bz - 0.55],
          [bx, 0.85, bz - 0.25],
        ],
        [
          [bx, 0.85, bz - 0.25],
          [bx, 0.35, bz],
        ],
        [
          [bx, 0.35, bz],
          [bx, 0.35, bz - 0.55],
        ],
        [
          [bx, 0.35, bz],
          [bx, 0.85, bz + 0.35],
        ],
        [
          [bx, 0.85, bz + 0.35],
          [bx, 0.85, bz - 0.25],
        ],
        [
          [bx, 0.85, bz + 0.35],
          [bx, 0.35, bz + 0.55],
        ],
      ] as number[][][])
        bar(
          new THREE.Vector3(...(a as [number, number, number])),
          new THREE.Vector3(...(b as [number, number, number])),
          0.025,
          white,
          bike,
        );
      box(0.22, 0.04, 0.23, bx, 0.9, bz - 0.25, metal, bike);
      box(0.5, 0.035, 0.04, bx, 1.05, bz + 0.4, metal, bike);
      obstacle(bx, bz, 0.65, 1.6);
      const model = add(
        tr("Bàn mô hình đô thị", "Urban model table"),
        w / 2 - 0.7,
        -d / 2 + 2.0,
        tr("Mô hình các khối nhà minh họa không gian đô thị. Nhấn để xem hiệu ứng vòng quét.", "Building blocks illustrating urban space. Press to see the scan ring."),
        tr("Bật / tắt vòng quét", "Scan ring on / off"),
      );
      box(1.0, 0.8, 1.0, w / 2 - 0.65, 0.4, -d / 2 + 2.05, white, model);
      for (let i = 0; i < 12; i++)
        box(
          0.12,
          0.1 + (i % 4) * 0.12,
          0.14,
          w / 2 - 1 + (i % 4) * 0.21,
          0.85 + (i % 4) * 0.06,
          -d / 2 + 1.72 + Math.floor(i / 4) * 0.23,
          steel,
          model,
        );
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(0.6, 0.014, 6, 48),
        new THREE.MeshBasicMaterial({ color: 0x40d9d9, transparent: true, opacity: 0.65 }),
      );
      ring.rotation.x = Math.PI / 2;
      ring.position.set(w / 2 - 0.65, 1.5, -d / 2 + 2.05);
      model.add(ring);
      moving.push(ring);
      obstacle(w / 2 - 0.65, -d / 2 + 2.05, 1.05, 1.05);
    }
    for (let z = -d / 2 + 1; z < d / 2; z += 2.6) {
      box(1.8, 0.03, 0.05, 0, 2.88, z, faded);
      for (const x of [-0.6, 0, 0.6]) box(0.09, 0.15, 0.09, x, 2.78, z, faded);
    }
    box(0.2, 0.3, 0.9, w / 2 - 0.15, 2.6, -d / 2 + 2.5, faded);
  }
  const selection = new THREE.BoxHelper(new THREE.Object3D(), 0xec792e);
  selection.visible = false;
  scene.add(selection);
  let selected = -1;
  const active = new Set<number>();
  const notes = new THREE.Group();
  presentation.add(notes);
  notes.visible = false;
  if (!special && furnished) {
    for (let i = 0; i < 4; i++)
      box(
        1.0 - i * 0.12,
        0.018,
        0.01,
        -0.4 + i * 0.08,
        1.95 - i * 0.15,
        -d / 2 + 0.155,
        teal,
        notes,
      );
  }
  return {
    floor,
    obstacles,
    interactables,
    items,
    width: w,
    depth: d,
    start: entry.start,
    portals: (room.doors ?? [room.door]).map((door) => {
      const e = roomEntry({ ...room, door });
      return { id: "exit", label: tr("Ra hành lang", "To the corridor"), x: e.x, z: e.z, kind: "exit" as const };
    }),
    highlight: (i: number) => {
      selected = i;
      selection.visible = i >= 0 && furnished;
      if (selection.visible) selection.setFromObject(groups[i]);
    },
    activate: (i: number) => {
      active.has(i) ? active.delete(i) : active.add(i);
      const on = active.has(i);
      const screenIndex = i === 1 && special ? 0 : i === 2 ? (special ? 1 : 0) : -1;
      const m = screens[screenIndex];
      if (m) {
        m.emissiveIntensity = on ? 0.9 : 0.05;
        m.color.set(on ? 0x287e91 : 0x18292d);
      }
      if (!special && i === 1) notes.visible = on;
    },
    update: (time: number, dt: number, camera: THREE.Camera, top: boolean) => {
      walls.forEach((g) => (g.visible = !top));
      moving.forEach((o, i) => {
        if (i < 2 && active.has(3)) o.rotation.z += dt * 3;
        else if (i >= 2) {
          o.visible = active.has(4);
          o.position.y = 1.5 + Math.sin(time * 0.002) * 0.3;
        }
      });
      if (selected >= 0) selection.update();
    },
  };
}

export function createHallway(
  scene: THREE.Scene,
  rooms: TourRoom[],
  floorIndex: number,
  arrival: string,
) {
  const { box, mat, white, metal, teal, sign } = kit(scene),
    width = 26.3,
    depth = floorIndex === 0 ? 21 : 18.5;
  const floor = box(width, 0.12, depth, 0, -0.06, 0, mat(0xe2e4df));
  const common = world(3.6, 0.5);
  sign(commonSpaceName(floorIndex), common.x, 1.4, common.z);
  const obstacles: RoomObstacle[] = [],
    portals: Portal[] = [],
    interactables: THREE.Object3D[] = [];
  const addBlock = (a: number, b: number, c: number, d: number, h: number, color: number) => {
    const p = world((a + c) / 2, (b + d) / 2);
    box((c - a) * SCALE, h, (d - b) * SCALE, p.x, h / 2, p.z, mat(color));
    obstacles.push({ x: p.x, z: p.z, w: (c - a) * SCALE, d: (d - b) * SCALE });
  };
  rooms.forEach((r) => {
    addBlock(...r.box, 0.8, 0xb8c9cc);
    (r.doors ?? [r.door]).forEach((doorPoint) => {
      const p = world(...doorPoint),
        [a, b, c, d] = r.box;
      let nx = 0,
        nz = 0;
      if (Math.abs(doorPoint[0] - a) < 0.05) nx = -1;
      else if (Math.abs(doorPoint[0] - c) < 0.05) nx = 1;
      else if (Math.abs(doorPoint[1] - b) < 0.05) nz = -1;
      else nz = 1;
      const door = box(
        nx ? 0.12 : 1.25,
        2.3,
        nx ? 1.25 : 0.12,
        p.x + nx * 0.07,
        1.15,
        p.z + nz * 0.07,
        teal,
      );
      door.userData.portal = r.id;
      interactables.push(door);
      sign(r.id, p.x + nx * 0.14, 2.8, p.z + nz * 0.14);
      portals.push({
        id: r.id,
        label: tr(`Vào phòng ${r.id}`, `Enter room ${r.id}`),
        x: p.x + nx * 0.75,
        z: p.z + nz * 0.75,
        kind: "room",
      });
    });
  });
  addBlock(6.02, 3.12, 7.25, 4.0, 0.5, 0xb48b65);
  if (floorIndex < 7) addBlock(0.8, 0.6, 2.2, 1.45, 0.45, 0xb48b65);
  addBlock(6.02, 4.95, 6.95, 5.65, 2.5, 0xa3afb1);
  const coreSpecs: [Portal["kind"], number, number, string][] = [
    ["CT1", 6.55, 4.55, tr("CT1 · Cầu thang", "CT1 · Stairs")],
  ];
  if (floorIndex < 7) coreSpecs.push(["CT2", 1.5, 2.15, tr("CT2 · Cầu thang", "CT2 · Stairs")]);
  if ([0, 4, 5, 6].includes(floorIndex)) coreSpecs.push(["LIFT", 5.72, 5.25, tr("Thang máy", "Lift")]);
  coreSpecs.forEach(([kind, x, z, label]) => {
    const p = world(x, z);
    portals.push({ id: kind, label, x: p.x, z: p.z, kind });
    sign(label, p.x, 2.5, p.z);
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(0.4, 0.48, 32),
      new THREE.MeshBasicMaterial({ color: 0xe98237, side: THREE.DoubleSide }),
    );
    ring.rotation.x = -Math.PI / 2;
    ring.position.set(p.x, 0.02, p.z);
    scene.add(ring);
  });
  for (let i = 0; i < 9; i++) {
    const p = world(6.55, 3.95 - i * 0.075);
    box(1.2, 0.08 + i * 0.08, 0.19, p.x, 0.04 + i * 0.04, p.z, white);
  }
  for (const [x, name] of [
    [6.25, tr("WC Nam", "Men's toilets")],
    [7.35, tr("WC Nữ", "Women's toilets")],
  ] as const) {
    addBlock(x - 0.35, 6.02, x + 0.35, 6.65, 0.6, 0xacbdbb);
    const p = world(x, 6.35);
    sign(name, p.x, 1.8, p.z);
  }
  // NPCs stay inside the shared west circulation strip and out of the stair core.
  const npcVariants: StudentVariant[] = ["casual-male", "casual-female", "male", "casual-female"];
  const npcs = Array.from({ length: 4 }, (_, i) => {
    const npc = createStudent(scene, npcVariants[i], i + 1);
    const p = world(5.72, i < 2 ? 2.1 + i * 0.7 : 5.5);
    npc.root.position.copy(p);
    npc.root.scale.setScalar(0.9 + (i % 2) * 0.05);
    return npc;
  });
  const chosen = portals.find((p) => p.id === arrival) || portals[0];
  const start = new THREE.Vector3(chosen?.x ?? 0, 0, chosen?.z ?? 0);
  return {
    floor,
    obstacles,
    interactables,
    items: [] as TourItem[],
    width,
    depth,
    start,
    portals,
    highlight: (_i: number) => {},
    activate: (_i: number) => {},
    update: (time: number, dt: number, _camera: THREE.Camera, _top: boolean) => {
      npcs.forEach((npc, i) => {
        if (i < 2) {
          npc.root.position.z = world(5.72, 2.1).z + Math.sin(time * 0.0003 + i * Math.PI) * 2.0;
          npc.root.position.x = world(5.72, 2.1).x + (i ? 0.25 : -0.25);
          npc.root.rotation.y = Math.cos(time * 0.0003 + i * Math.PI) > 0 ? 0 : Math.PI;
        } else {
          npc.root.position.x = world(5.72, 5.5).x + (i === 2 ? -0.4 : 0.4);
          npc.root.rotation.y = i === 2 ? Math.PI / 2 : -Math.PI / 2;
        }
        npc.update(dt, i < 2, time * 0.006 + i);
      });
    },
  };
}
