import * as THREE from "three";

// PDF page 3: 658.08 drawing points correspond to the dimensioned 21.10 m.
// Furniture dimensions are estimates from Scenes 134–143, not surveyed measurements.
export const ROOM104 = {
  width: 273.12 / (658.08 / 21.1),
  depth: 158.64 / (658.08 / 21.1),
  height: 3,
};
export type RoomObstacle = { x: number; z: number; w: number; d: number };
export const ROOM_ITEMS = [
  {
    name: "Khu bàn học",
    x: -2.15,
    z: 0.9,
    title: "Bàn đôi mặt gỗ · ghế khung thép",
    description:
      "Cụm bàn học hướng về màn hình di động, với lối đi dọc bên dãy kệ. Tái dựng 5 bàn đôi và 10 ghế theo các góc render.",
    action: "Xem khu bàn học",
  },
  {
    name: "Màn hình di động",
    x: 0.05,
    z: 1.03,
    title: "Màn hình trình chiếu trên chân bánh xe",
    description:
      "Màn hình lớn đặt giữa khu bàn học và khu làm việc. Nhấn nút để bật / tắt nội dung trình chiếu mẫu.",
    action: "Bật / tắt màn hình",
  },
  {
    name: "Dãy kệ trưng bày",
    x: -2.15,
    z: -2.27,
    title: "Ba khoang kệ kim loại màu đen",
    description:
      "Kệ mở nhiều tầng chạy dọc tường, dành cho trưng bày vật mẫu và học liệu. Các ngăn được để trống như ảnh thiết kế.",
    action: "Xem dãy kệ",
  },
  {
    name: "Tủ hồ sơ",
    x: 0.05,
    z: -2.25,
    title: "Tủ trắng · ngăn mở và cánh đóng",
    description:
      "Tủ cao kết hợp ngăn sách, hồ sơ và khoang lưu trữ đóng. Nhấn nút để thử mở / đóng hai cánh tủ dưới.",
    action: "Mở / đóng tủ",
  },
  {
    name: "Quầy cà phê",
    x: 1.48,
    z: -2.18,
    title: "Quầy gỗ · máy pha cà phê",
    description:
      "Khu tiện ích có máy pha, cốc và kệ phía trên, cạnh bàn cao. Nhấn nút để chạy hiệu ứng pha cà phê minh họa.",
    action: "Thử pha cà phê",
  },
  {
    name: "Bàn cao",
    x: 3.05,
    z: -2.18,
    title: "Bàn mặt gỗ · khung thép đen",
    description:
      "Bàn cao nối tiếp quầy cà phê, có hai khay đặt trên mặt bàn và giữ khoảng trống trước cửa cuối phòng.",
    action: "Xem bàn cao",
  },
  {
    name: "Khu máy tính",
    x: 2.45,
    z: 0.65,
    title: "Ba máy tính · bàn làm việc đối diện",
    description:
      "Hai máy tính phía ghế trắng, một máy phía ghế tựa cao. Màn hình, bàn phím và đèn bàn dựng theo ảnh; chưa gán cấu hình thiết bị thực tế.",
    action: "Bật / tắt máy tính",
  },
  {
    name: "Tủ thấp & cây xanh",
    x: 0.95,
    z: 0.64,
    title: "Tủ thấp chia ngăn · chậu cây dài",
    description:
      "Tủ thấp đặt ở đầu cụm bàn làm việc, phía trên có chậu cây, ngăn nhẹ khu máy tính với khu trình chiếu.",
    action: "Xem tủ và cây",
  },
] as const;

export function createRoom104(scene: THREE.Scene, furnished: boolean, openings: "render" | "pdf") {
  const { width: w, depth: d, height: h } = ROOM104;
  const obstacles: RoomObstacle[] = [],
    interactables: THREE.Object3D[] = [];
  const materials: THREE.Material[] = [],
    textures: THREE.Texture[] = [];
  const mat = (color: number, opacity = 1) => {
    const m = new THREE.MeshStandardMaterial({
      color,
      roughness: 0.72,
      transparent: opacity < 1,
      opacity,
      depthWrite: opacity === 1,
    });
    materials.push(m);
    return m;
  };
  const white = mat(0xf2f0e9),
    metal = mat(0x272d2e),
    steel = mat(0x9c9d98),
    glass = mat(0xafd6d9, 0.21),
    wood = mat(0xc39868),
    darkWood = mat(0x655242),
    black = mat(0x12191c),
    green = mat(0x447445);
  const box = (
    a: number,
    b: number,
    c: number,
    x: number,
    y: number,
    z: number,
    material: THREE.Material,
    parent: THREE.Object3D = scene,
  ) => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(a, b, c), material);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  };
  const cylinder = (
    r: number,
    length: number,
    x: number,
    y: number,
    z: number,
    material: THREE.Material,
    parent: THREE.Object3D,
  ) => {
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(r, r, length, 10), material);
    mesh.position.set(x, y, z);
    parent.add(mesh);
    return mesh;
  };
  // Subtle procedural wood grain and ceramic joints; these are material textures.
  const timber = document.createElement("canvas");
  timber.width = 512;
  timber.height = 256;
  const ctx = timber.getContext("2d")!;
  ctx.fillStyle = "#c59b6f";
  ctx.fillRect(0, 0, 512, 256);
  for (let i = 0; i < 140; i++) {
    ctx.strokeStyle = `rgba(91,59,32,${0.04 + (i % 7) * 0.014})`;
    ctx.lineWidth = 0.4 + (i % 3) * 0.35;
    ctx.beginPath();
    for (let x = 0; x <= 512; x += 8) {
      const y = i * 2 + Math.sin(x * 0.016 + i) * 1.6;
      x ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    }
    ctx.stroke();
  }
  const grain = new THREE.CanvasTexture(timber);
  grain.colorSpace = THREE.SRGBColorSpace;
  grain.wrapS = grain.wrapT = THREE.RepeatWrapping;
  textures.push(grain);
  wood.map = grain;
  const floor = box(w, 0.12, d, 0, -0.06, 0, mat(0xe8e5df));
  floor.userData.walkable = true;
  const joint = mat(0xc9c9c2);
  for (let x = -w / 2 + 0.6; x < w / 2; x += 0.6) box(0.006, 0.002, d, x, 0.002, 0, joint);
  for (let z = -d / 2 + 0.6; z < d / 2; z += 0.6) box(w, 0.002, 0.006, 0, 0.002, z, joint);
  const walls: { group: THREE.Group; normal: THREE.Vector3 }[] = [];
  const overhead = new THREE.Group();
  scene.add(overhead);
  const makeWall = (normal: THREE.Vector3) => {
    const group = new THREE.Group();
    scene.add(group);
    walls.push({ group, normal });
    return group;
  };
  const back = makeWall(new THREE.Vector3(0, 0, -1)),
    front = makeWall(new THREE.Vector3(0, 0, 1));
  box(w, h, 0.12, 0, h / 2, -d / 2, white.clone(), back);
  box(w, h, 0.12, 0, h / 2, d / 2, white.clone(), front);
  box(w, 0.075, 0.04, 0, 0.04, -d / 2 + 0.07, steel, back);
  box(w, 0.075, 0.04, 0, 0.04, d / 2 - 0.07, steel, front);
  const s = 658.08 / 21.1;
  const pdfDoors = [
    { from: (160.76 - 122.12) / s, to: (192.68 - 122.12) / s },
    { from: (127.04 - 122.12) / s, to: (162.2 - 122.12) / s },
  ];
  const doorRanges =
    openings === "pdf"
      ? pdfDoors
      : [
          { from: 0.64, to: 1.92 },
          { from: 0.52, to: 1.8 },
        ];
  for (let side = 0; side < 2; side++) {
    const x = side === 0 ? -w / 2 : w / 2,
      group = makeWall(new THREE.Vector3(side === 0 ? -1 : 1, 0, 0));
    const windows =
      openings === "pdf"
        ? side === 1
          ? [
              { from: (170.96 - 122.12) / s, to: (221.48 - 122.12) / s },
              { from: (224.6 - 122.12) / s, to: (271.4 - 122.12) / s },
            ]
          : []
        : side === 0
          ? [{ from: 2.17, to: 3.65 }]
          : [];
    const apertures = [
      { ...doorRanges[side], bottom: 0, top: 2.25, door: true },
      ...windows.map((o) => ({ ...o, bottom: 1.02, top: 2.25, door: false })),
    ].sort((a, b) => a.from - b.from);
    const wallMat = white.clone();
    let cursor = 0;
    const segment = (
      from: number,
      to: number,
      bottom: number,
      top: number,
      material: THREE.Material,
    ) => {
      if (to > from && top > bottom)
        box(
          0.12,
          top - bottom,
          to - from,
          x,
          (bottom + top) / 2,
          -d / 2 + (from + to) / 2,
          material,
          group,
        );
    };
    for (const o of apertures) {
      segment(cursor, o.from, 0, h, wallMat);
      segment(o.from, o.to, 0, o.bottom, wallMat);
      segment(o.from, o.to, o.top, h, wallMat);
      segment(o.from, o.to, o.bottom + 0.05, o.top - 0.05, glass);
      segment(o.from - 0.035, o.from + 0.035, o.bottom, o.top, metal);
      segment(o.to - 0.035, o.to + 0.035, o.bottom, o.top, metal);
      segment(o.from, o.to, o.top - 0.045, o.top, metal);
      segment(o.from, o.to, o.bottom, o.bottom + 0.045, metal);
      const mid = (o.from + o.to) / 2;
      segment(mid - 0.028, mid + 0.028, o.bottom, o.top, metal);
      if (o.door) {
        segment(o.from, o.to, 0.42, 0.47, metal);
        for (const offset of [-0.09, 0.09])
          box(
            0.08,
            0.25,
            0.025,
            x + (side === 0 ? 0.06 : -0.06),
            1,
            -d / 2 + mid + offset,
            steel,
            group,
          );
      }
      cursor = o.to;
    }
    segment(cursor, d, 0, h, wallMat);
  }
  const addObstacle = (x: number, z: number, a: number, c: number) =>
    obstacles.push({ x, z, w: a, d: c });
  const groups = ROOM_ITEMS.map((_, i) => {
    const group = new THREE.Group();
    group.userData.station = i;
    scene.add(group);
    if (furnished) interactables.push(group);
    return group;
  });
  const screens: THREE.MeshStandardMaterial[] = [];
  const cabinetDoors: THREE.Group[] = [];
  const steam: THREE.Mesh[] = [];
  const screenMat = () => {
    const m = mat(0x142127);
    m.emissive.set(0x247f8b);
    m.emissiveIntensity = 0.08;
    screens.push(m);
    return m;
  };
  function chair(
    x: number,
    z: number,
    angle: number,
    office = false,
    executive = false,
    parent: THREE.Object3D = scene,
  ) {
    const g = new THREE.Group();
    g.position.set(x, 0, z);
    g.rotation.y = angle;
    parent.add(g);
    const seat = office ? (executive ? mat(0x92969a) : white) : wood;
    box(0.43, 0.065, 0.43, 0, 0.46, 0, seat, g);
    box(0.44, executive ? 0.78 : 0.36, 0.055, 0, executive ? 0.85 : 0.69, 0.2, seat, g);
    if (office) {
      cylinder(0.035, 0.38, 0, 0.23, 0, steel, g);
      for (let i = 0; i < 5; i++) {
        const leg = box(0.035, 0.035, 0.29, 0, 0.07, 0.14, metal, g);
        leg.rotation.y = i * Math.PI * 0.4;
        leg.position.set(
          Math.sin(i * Math.PI * 0.4) * 0.13,
          0.07,
          Math.cos(i * Math.PI * 0.4) * 0.13,
        );
        cylinder(
          0.035,
          0.05,
          Math.sin(i * Math.PI * 0.4) * 0.26,
          0.04,
          Math.cos(i * Math.PI * 0.4) * 0.26,
          metal,
          g,
        );
      }
    } else {
      for (const a of [-0.17, 0.17]) {
        box(0.035, 0.42, 0.035, a, 0.23, -0.15, steel, g);
        box(0.035, 0.7, 0.035, a, 0.37, 0.17, steel, g);
        box(0.035, 0.035, 0.48, a, 0.04, 0, steel, g);
      }
    }
    addObstacle(x, z, 0.46, 0.48);
  }
  if (furnished) {
    // Three rows, 2+2+1 double desks, all facing the presentation screen (+X).
    for (const [row, x] of [-3.45, -2.3, -1.15].entries())
      for (const [col, z] of [0.07, 1.44].entries()) {
        if (row === 2 && col === 0) continue;
        const g = groups[0];
        box(0.48, 0.055, 1.2, x, 0.74, z, wood, g);
        box(0.36, 0.13, 1.1, x, 0.65, z, white, g);
        addObstacle(x, z, 0.5, 1.22);
        for (const dz of [-0.5, 0.5]) {
          box(0.065, 0.7, 0.065, x, 0.35, z + dz, steel, g);
          box(0.55, 0.055, 0.065, x, 0.04, z + dz, steel, g);
        }
        for (const dz of [-0.31, 0.31]) chair(x - 0.43, z + dz, -Math.PI / 2, false, false, g);
      }
    // Open black display shelves, three bays, eleven fine shelves each.
    for (const x of [-3.45, -2.3, -1.15]) {
      const g = groups[2];
      for (const dx of [-0.53, 0.53])
        for (const dz of [-0.2, 0.2]) box(0.035, 2.48, 0.035, x + dx, 1.24, -2.25 + dz, metal, g);
      for (let y = 0.16; y < 2.5; y += 0.225) box(1.1, 0.028, 0.44, x, y, -2.25, metal, g);
      addObstacle(x, -2.25, 1.1, 0.44);
    }
    const cabinet = groups[3];
    box(1.13, 2.52, 0.05, 0.08, 1.26, -2.46, white, cabinet);
    for (const dx of [-0.55, 0.55]) box(0.04, 2.52, 0.48, 0.08 + dx, 1.26, -2.23, white, cabinet);
    for (const y of [0.12, 0.88, 1.3, 1.72, 2.13, 2.5])
      box(1.14, 0.035, 0.49, 0.08, y, -2.23, white, cabinet);
    for (const [i, x] of [-0.22, 0.35].entries()) {
      const sign = i ? -1 : 1,
        pivot = new THREE.Group();
      pivot.position.set(x - sign * 0.275, 0.47, -1.97);
      cabinet.add(pivot);
      box(0.54, 0.72, 0.04, sign * 0.27, 0, 0, white, pivot);
      box(0.025, 0.14, 0.035, sign * 0.48, 0.02, 0.035, metal, pivot);
      cabinetDoors.push(pivot);
    }
    const bookColors = [0x557678, 0xd2c0a0, 0x747b84, 0x8d583d];
    for (let i = 0; i < 17; i++) {
      const level = i < 8 ? 1.34 : 1.77;
      box(
        0.035 + (i % 3) * 0.012,
        0.19 + (i % 4) * 0.02,
        0.22,
        -0.4 + (i % 8) * 0.095,
        level + 0.12,
        -2.13,
        mat(bookColors[i % 4]),
        cabinet,
      );
    }
    addObstacle(0.08, -2.23, 1.14, 0.5);
    const pantry = groups[4];
    box(1.55, 0.88, 0.59, 1.46, 0.44, -2.2, darkWood, pantry);
    box(1.6, 0.045, 0.66, 1.46, 0.91, -2.17, white, pantry);
    box(1.55, 1.52, 0.05, 1.46, 1.73, -2.47, darkWood, pantry);
    for (const x of [0.68, 2.24]) box(0.04, 1.55, 0.4, x, 1.72, -2.27, darkWood, pantry);
    for (const y of [1.63, 2.1, 2.49]) box(1.6, 0.035, 0.42, 1.46, y, -2.28, white, pantry);
    for (let i = 0; i < 12; i++)
      box(0.014, 0.79, 0.014, 0.74 + i * 0.125, 0.46, -1.894, wood, pantry);
    box(0.48, 0.64, 0.44, 1.75, 1.25, -2.11, metal, pantry);
    box(0.24, 0.18, 0.025, 1.75, 1.43, -1.88, screenMat(), pantry);
    box(0.34, 0.025, 0.3, 1.75, 0.96, -1.86, steel, pantry);
    cylinder(0.105, 0.16, 1.75, 1.65, -2.14, glass, pantry);
    for (const x of [0.97, 1.25, 1.57, 1.9]) cylinder(0.045, 0.12, x, 1.72, -2.2, white, pantry);
    cylinder(0.045, 0.075, 1.75, 1.015, -1.85, white, pantry);
    for (let i = 0; i < 5; i++) {
      const puff = new THREE.Mesh(new THREE.SphereGeometry(0.025, 8, 6), mat(0xffffff, 0.3));
      puff.position.set(1.75, 1.08 + i * 0.08, -1.85);
      puff.visible = false;
      pantry.add(puff);
      steam.push(puff);
    }
    addObstacle(1.46, -2.17, 1.6, 0.66);
    const bar = groups[5];
    box(1.7, 0.045, 0.45, 3.15, 1.0, -2.2, wood, bar);
    for (const x of [2.35, 3.95])
      for (const z of [-2.37, -2.03]) box(0.035, 0.98, 0.035, x, 0.49, z, metal, bar);
    for (const x of [2.73, 3.56]) {
      box(0.48, 0.025, 0.3, x, 1.04, -2.2, metal, bar);
      box(0.42, 0.008, 0.24, x, 1.056, -2.2, white, bar);
    }
    addObstacle(3.15, -2.2, 1.7, 0.45);
    const tv = groups[1];
    box(0.075, 1.12, 1.95, 0.05, 1.57, 1.03, metal, tv);
    box(0.012, 1.04, 1.86, -0.0, 1.57, 1.03, screenMat(), tv);
    for (const z of [0.47, 1.59]) {
      box(0.055, 0.91, 0.055, 0.05, 0.5, z, metal, tv);
      box(0.64, 0.065, 0.06, 0.05, 0.09, z, metal, tv);
      for (const x of [-0.22, 0.32]) cylinder(0.045, 0.045, x, 0.045, z, steel, tv);
    }
    addObstacle(0.05, 1.03, 0.66, 1.95);
    const work = groups[6];
    for (const z of [0.2, 1.18]) {
      box(2.7, 0.055, 0.73, 2.64, 0.75, z, wood, work);
      for (const x of [1.35, 3.93])
        for (const dz of [-0.28, 0.28]) box(0.04, 0.72, 0.04, x, 0.36, z + dz, metal, work);
      addObstacle(2.64, z, 2.7, 0.73);
    }
    for (const [x, z, rotation] of [
      [2.0, 0.2, 0],
      [3.25, 0.2, 0],
      [2.7, 1.18, Math.PI],
    ]) {
      const g = new THREE.Group();
      g.position.set(x, 0, z);
      g.rotation.y = rotation;
      work.add(g);
      box(0.6, 0.4, 0.045, 0, 1.08, 0, white, g);
      box(0.55, 0.32, 0.012, 0, 1.1, -0.03, screenMat(), g);
      box(0.06, 0.18, 0.07, 0, 0.84, 0.04, steel, g);
      box(0.24, 0.02, 0.16, 0, 0.785, 0.04, white, g);
      box(0.34, 0.015, 0.12, 0, 0.79, -0.25, white, g);
      for (let i = 0; i < 8; i++)
        box(0.003, 0.002, 0.09, -0.145 + i * 0.04, 0.799, -0.25, steel, g);
    }
    chair(2.0, -0.46, Math.PI, true, false, work);
    chair(3.25, -0.46, Math.PI, true, false, work);
    chair(2.7, 1.92, 0, true, true, work);
    box(0.45, 0.54, 0.48, 2.6, 0.27, -0.1, white, work);
    box(2.5, 0.53, 0.28, 2.64, 0.265, 2.3, darkWood, work);
    addObstacle(2.64, 2.3, 2.5, 0.28);
    const divider = groups[7];
    for (const y of [0.22, 0.9]) box(0.38, 0.04, 1.13, 0.92, y, 0.64, white, divider);
    for (const z of [0.09, 0.45, 0.84, 1.19]) box(0.38, 0.65, 0.025, 0.92, 0.56, z, white, divider);
    box(0.03, 0.7, 1.14, 0.73, 0.56, 0.64, white, divider);
    for (const z of [0.12, 1.16]) box(0.035, 0.23, 0.035, 0.92, 0.115, z, metal, divider);
    box(0.35, 0.19, 0.87, 0.92, 1.015, 0.64, white, divider);
    addObstacle(0.92, 0.64, 0.4, 1.15);
    for (let i = 0; i < 42; i++) {
      const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.11, 7, 5), green);
      leaf.scale.set(0.65, 0.3, 1);
      leaf.position.set(
        0.92 + Math.sin(i * 2.4) * (0.08 + (i % 3) * 0.06),
        1.14 + Math.sin(i * 1.7) * 0.1,
        0.64 + Math.cos(i * 2.4) * (0.12 + (i % 4) * 0.1),
      );
      leaf.rotation.set(i * 0.23, i * 0.81, 0.2);
      divider.add(leaf);
    }
    // Wall-mounted split ACs and ceiling tracks are visible in the supplied renders.
    for (const x of [-1.9, 2.4]) {
      box(1.0, 0.29, 0.21, x, 2.56, d / 2 - 0.15, white, front);
      box(0.85, 0.045, 0.025, x, 2.46, d / 2 - 0.27, steel, front);
    }
    for (const x of [-2.8, 0, 2.8])
      for (const z of [-1.25, 1.25]) {
        box(1.1, 0.035, 0.045, x, 2.89, z, metal, overhead);
        for (const offset of [-0.42, 0, 0.42]) {
          const light = cylinder(0.045, 0.12, x + offset, 2.8, z, metal, overhead);
          light.rotation.z = 0.36;
        }
      }
  }
  const selection = new THREE.BoxHelper(new THREE.Object3D(), 0xed742d);
  selection.visible = false;
  scene.add(selection);
  // Keep overhead equipment legible without obscuring the room or avatar.
  overhead.traverse((o) => {
    if (o instanceof THREE.Mesh) {
      const m = (o.material as THREE.Material).clone();
      m.transparent = true;
      m.opacity = 0.18;
      m.depthWrite = false;
      o.material = m;
      o.castShadow = false;
    }
  });
  front.children.forEach((o) => {
    if (o instanceof THREE.Mesh && o.position.y > 2.4) {
      const m = (o.material as THREE.Material).clone();
      m.transparent = true;
      m.opacity = 0.18;
      m.depthWrite = false;
      o.material = m;
      o.castShadow = false;
      o.userData.faded = true;
    }
  });
  let selected = -1,
    cabinetOpen = false,
    coffeeUntil = 0;
  const displayState = { tv: false, computers: false };
  const highlight = (i: number) => {
    selected = i;
    selection.visible = i >= 0 && furnished;
    if (selection.visible) selection.setFromObject(groups[i]);
  };
  const activate = (i: number) => {
    if (i === 1 || i === 6) {
      const key = i === 1 ? "tv" : "computers";
      displayState[key] = !displayState[key];
      const enabled = displayState[key];
      (i === 1 ? screens.slice(1, 2) : screens.slice(2)).forEach((m) => {
        m.color.set(enabled ? 0x176d80 : 0x142127);
        m.emissiveIntensity = enabled ? 0.8 : 0.08;
      });
    }
    if (i === 3) cabinetOpen = !cabinetOpen;
    if (i === 4) coffeeUntil = performance.now() + 4500;
  };
  const update = (time: number, dt: number, camera: THREE.Camera, top: boolean) => {
    overhead.visible = !top;
    walls.forEach(({ group, normal }) => {
      const facing = camera.position.clone().normalize().dot(normal) > 0.1;
      group.visible = !top;
      group.traverse((o) => {
        if (o instanceof THREE.Mesh && o.material !== glass && !o.userData.faded) {
          const m = o.material as THREE.MeshStandardMaterial;
          if (m === white || m === steel || m === metal) return;
          m.transparent = facing;
          m.opacity = facing ? 0.12 : 1;
          m.depthWrite = !facing;
        }
      });
    });
    cabinetDoors.forEach((g, i) => {
      g.rotation.y = THREE.MathUtils.damp(
        g.rotation.y,
        cabinetOpen ? (i ? 1 : -1) * 1.2 : 0,
        9,
        dt,
      );
    });
    steam.forEach((p, i) => {
      p.visible = time < coffeeUntil;
      p.position.y = 1.1 + ((time * 0.00017 + i * 0.06) % 0.4);
      p.scale.setScalar(1 + (p.position.y - 1.1) * 2);
    });
    if (selected >= 0 && selection.visible) selection.update();
  };
  return {
    floor,
    obstacles,
    interactables,
    highlight,
    activate,
    update,
    start: new THREE.Vector3(
      -w / 2 + 0.55,
      0,
      -d / 2 + (doorRanges[0].from + doorRanges[0].to) / 2,
    ),
    textures,
  };
}

export type StudentVariant = "male" | "female" | "casual-male" | "casual-female";

export function createStudent(
  scene: THREE.Scene,
  variant: StudentVariant = "male",
  paletteIndex = 0,
) {
  const root = new THREE.Group(),
    model = new THREE.Group();
  root.add(model);
  scene.add(root);
  const mat = (color: number) => new THREE.MeshStandardMaterial({ color, roughness: 0.8 });
  const female = variant === "female" || variant === "casual-female",
    casual = variant.startsWith("casual");
  const casualShirts = [0x4f75a1, 0xc56a4a, 0x6c8b63, 0x8a6e9f, 0xd1a13b, 0x3f7f7b],
    casualBottoms = [0x303943, 0x5a4b43, 0x384a5b, 0x4a3d59];
  const teal = mat(casual ? casualShirts[paletteIndex % casualShirts.length] : 0x008c8b),
    orange = mat(casual ? 0xe6ded2 : 0xff813b),
    skin = mat([0xdca77e, 0xc98f68, 0xefc09b][paletteIndex % 3]),
    hair = mat([0x242323, 0x3b2923, 0x17191c][paletteIndex % 3]),
    pants = mat(casual ? casualBottoms[paletteIndex % casualBottoms.length] : 0xb4bac2),
    skirt = mat(casual ? casualBottoms[(paletteIndex + 1) % casualBottoms.length] : 0x253746),
    shoe = mat(paletteIndex % 2 ? 0x30363b : 0xf4f1e9);
  const ellipsoid = (
    x: number,
    y: number,
    z: number,
    a: number,
    b: number,
    c: number,
    m: THREE.Material,
    parent: THREE.Object3D = model,
  ) => {
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(1, 14, 10), m);
    mesh.position.set(x, y, z);
    mesh.scale.set(a, b, c);
    parent.add(mesh);
    mesh.castShadow = true;
    return mesh;
  };
  ellipsoid(0, 1.12, 0, female ? 0.215 : 0.23, 0.32, 0.135, teal);
  ellipsoid(0, 0.9, 0, female ? 0.19 : 0.21, 0.07, 0.13, teal);
  for (const x of [-0.205, 0.205]) ellipsoid(x, 1.08, 0, 0.035, 0.23, 0.126, orange);
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.077, 0.08, 0.1, 12), skin);
  neck.position.y = 1.42;
  model.add(neck);
  const collar = new THREE.Mesh(new THREE.TorusGeometry(0.094, 0.018, 6, 20), orange);
  collar.rotation.x = Math.PI / 2;
  collar.position.y = 1.405;
  model.add(collar);
  ellipsoid(0, 1.61, 0, 0.165, 0.205, 0.15, skin);
  ellipsoid(0, 1.745, -0.015, 0.174, 0.1, 0.151, hair);
  ellipsoid(-0.065, 1.7, 0.1, 0.1, 0.07, 0.065, hair);
  if (female) {
    ellipsoid(0, 1.56, -0.105, 0.18, 0.26, 0.105, hair);
    ellipsoid(-0.145, 1.53, -0.015, 0.052, 0.19, 0.07, hair);
    ellipsoid(0.145, 1.53, -0.015, 0.052, 0.19, 0.07, hair);
    ellipsoid(0.1, 1.36, -0.13, 0.095, 0.25, 0.075, hair);
  }
  for (const x of [-0.163, 0.163]) ellipsoid(x, 1.6, 0, 0.029, 0.044, 0.035, skin);
  const eyeWhite = mat(0xffffff);
  for (const x of [-0.062, 0.062]) {
    ellipsoid(x, 1.635, 0.133, 0.032, 0.021, 0.013, eyeWhite);
    ellipsoid(x, 1.634, 0.145, 0.012, 0.015, 0.006, hair);
    if (variant === "male") {
      const glasses = new THREE.Mesh(new THREE.TorusGeometry(0.046, 0.0035, 6, 16), hair);
      glasses.position.set(x, 1.632, 0.153);
      model.add(glasses);
    }
  }
  ellipsoid(0, 1.596, 0.148, 0.021, 0.029, 0.021, skin);
  ellipsoid(0, 1.548, 0.137, 0.034, 0.005, 0.009, hair);
  if (female) {
    const skirtMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.3, 0.43, 18), skirt);
    skirtMesh.position.y = 0.78;
    skirtMesh.scale.z = 0.78;
    skirtMesh.castShadow = true;
    model.add(skirtMesh);
  }
  const limbs: THREE.Group[] = [];
  for (const [x, y, isArm] of [
    [-0.265, 1.32, 1],
    [0.265, 1.32, 1],
    [-0.105, female ? 0.68 : 0.88, 0],
    [0.105, female ? 0.68 : 0.88, 0],
  ]) {
    const pivot = new THREE.Group();
    pivot.position.set(x, y, 0);
    model.add(pivot);
    limbs.push(pivot);
    if (isArm) {
      ellipsoid(0, -0.11, 0, 0.095, 0.15, 0.093, teal, pivot);
      ellipsoid(0, -0.24, 0, 0.086, 0.024, 0.085, orange, pivot);
      ellipsoid(0, -0.37, 0, 0.062, 0.14, 0.061, skin, pivot);
      ellipsoid(0, -0.5, 0, 0.066, 0.07, 0.06, skin, pivot);
    } else if (female) {
      ellipsoid(0, -0.24, 0, 0.078, 0.27, 0.085, skin, pivot);
      ellipsoid(0, -0.52, 0.035, 0.105, 0.07, 0.16, shoe, pivot);
    } else {
      ellipsoid(0, -0.33, 0, 0.095, 0.37, 0.099, pants, pivot);
      ellipsoid(0, -0.76, 0.035, 0.108, 0.075, 0.16, shoe, pivot);
    }
  }
  let texture: THREE.CanvasTexture | undefined;
  if (!casual) {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 128;
    const c = canvas.getContext("2d")!;
    c.fillStyle = "#008c8b";
    c.fillRect(0, 0, 256, 128);
    c.fillStyle = "white";
    c.font = "bold 72px Arial";
    c.textAlign = "center";
    c.fillText("UEH", 128, 77);
    c.fillStyle = "#ff813b";
    c.font = "bold 20px Arial";
    c.fillText("UNIVERSITY", 128, 106);
    texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    const badge = new THREE.Mesh(
      new THREE.PlaneGeometry(0.14, 0.07),
      new THREE.MeshBasicMaterial({ map: texture }),
    );
    badge.position.set(-0.09, 1.29, 0.139);
    model.add(badge);
  }
  const shadow = new THREE.Mesh(
    new THREE.CircleGeometry(0.27, 24),
    new THREE.MeshBasicMaterial({
      color: 0x284144,
      transparent: true,
      opacity: 0.2,
      depthWrite: false,
    }),
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.012;
  root.add(shadow);
  let velocity = 0,
    height = 0;
  return {
    root,
    jump: () => {
      if (height === 0) velocity = 3.9;
    },
    update: (dt: number, moving: boolean, time: number) => {
      velocity -= 10.5 * dt;
      height = Math.max(0, height + velocity * dt);
      if (height === 0) velocity = 0;
      model.position.y = height;
      limbs.forEach(
        (part, i) =>
          (part.rotation.x =
            height > 0
              ? i < 2
                ? -0.55
                : 0.25
              : moving
                ? Math.sin(time + (i % 2 ? Math.PI : 0)) * 0.5
                : 0),
      );
      shadow.scale.setScalar(1 - height * 0.2);
    },
    dispose: () => texture?.dispose(),
  };
}
