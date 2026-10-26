import { tr } from './locale';
import * as THREE from 'three';
import { roomEntry, roomSize, type Portal, type TourItem, type TourRoom } from './campus-tour-scene';
import { createRoomArchitecture, doorOpenings, type RoomOpening, type WallSide } from './room-architecture';
import type { RoomObstacle } from './room104-scene';

// IMG_5015-5024: the existing plan fixes the envelope and east-side entrance.
// Furniture sizes and positions are visual estimates, not a measured inventory.
export function createHologramLab(scene: THREE.Scene, room: TourRoom, furnished: boolean) {
  const { width: w, depth: d } = roomSize(room), h = 3.05;
  const obstacles: RoomObstacle[] = [], interactables: THREE.Object3D[] = [], items: TourItem[] = [], groups: THREE.Group[] = [];
  const mat = (color: number, roughness = .72, opacity = 1) => new THREE.MeshStandardMaterial({
    color, roughness, opacity, transparent: opacity < 1, depthWrite: opacity === 1,
  });
  const cream = mat(0xe7e4d0), lime = mat(0xa5c981), orange = mat(0xe6834c), black = mat(0x182124);
  const white = mat(0xf0eee5), steel = mat(0xadb4b4, .35), graphite = mat(0x343b3f), walnut = mat(0x9b6546);
  const geometry = new THREE.BoxGeometry(1, 1, 1), cylinderGeometry = new THREE.CylinderGeometry(1, 1, 1, 12);
  const box = (a: number, b: number, c: number, x: number, y: number, z: number, material: THREE.Material, parent: THREE.Object3D = scene) => {
    const mesh = new THREE.Mesh(geometry, material); mesh.scale.set(a, b, c); mesh.position.set(x, y, z);
    mesh.castShadow = mesh.receiveShadow = true; parent.add(mesh); return mesh;
  };
  const cylinder = (radius: number, height: number, x: number, y: number, z: number, material: THREE.Material, parent: THREE.Object3D) => {
    const mesh = new THREE.Mesh(cylinderGeometry, material); mesh.scale.set(radius, height, radius); mesh.position.set(x, y, z); parent.add(mesh); return mesh;
  };
  const rod = (from: THREE.Vector3, to: THREE.Vector3, radius: number, material: THREE.Material, parent: THREE.Object3D) => {
    const delta = to.clone().sub(from), mesh = cylinder(radius, delta.length(), 0, 0, 0, material, parent);
    mesh.position.copy(from).add(to).multiplyScalar(.5); mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), delta.normalize()); return mesh;
  };
  const texture = (size: number, draw: (ctx: CanvasRenderingContext2D) => void) => {
    const canvas = document.createElement('canvas'); canvas.width = canvas.height = size; draw(canvas.getContext('2d')!);
    const map = new THREE.CanvasTexture(canvas); map.colorSpace = THREE.SRGBColorSpace; return map;
  };
  const tileMap = texture(256, ctx => {
    ctx.fillStyle = '#dfdfd5'; ctx.fillRect(0, 0, 256, 256);
    ctx.strokeStyle = '#aeb4ab'; ctx.lineWidth = 2; ctx.strokeRect(1, 1, 254, 254);
    for (let i = 0; i < 16; i++) {
      ctx.strokeStyle = i % 2 ? '#c7c9bf' : '#eae9df'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(0, i * 19); ctx.lineTo(256, i * 19 - 100); ctx.stroke();
    }
    ctx.save(); ctx.translate(128, 128); ctx.rotate(Math.PI / 4); ctx.fillStyle = '#216c5d'; ctx.fillRect(-20, -20, 40, 40); ctx.restore();
    ctx.fillStyle = '#a8b4ad';
    for (const [x, y] of [[30, 30], [226, 30], [30, 226], [226, 226]]) { ctx.save(); ctx.translate(x, y); ctx.rotate(Math.PI / 4); ctx.fillRect(-13, -5, 26, 10); ctx.restore(); }
  });
  tileMap.wrapS = tileMap.wrapT = THREE.RepeatWrapping; tileMap.repeat.set(w / .36, d / .36); tileMap.anisotropy = 4;
  const tile = mat(0xffffff); tile.map = tileMap;
  const floor = box(w, .12, d, 0, -.06, 0, tile); floor.userData.walkable = true;
  const oak = mat(0xffffff); oak.map = texture(256, ctx => {
    ctx.fillStyle = '#bd9771'; ctx.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 90; i++) { ctx.strokeStyle = `rgba(89,54,30,${.04 + i % 4 * .018})`; ctx.beginPath(); ctx.moveTo(0, i * 3); ctx.bezierCurveTo(70, i * 3 - 2, 160, i * 3 + 3, 256, i * 3); ctx.stroke(); }
  });
  const entries = (room.doors ?? [room.door]).map(door => roomEntry({ ...room, door }));
  const openings: RoomOpening[] = doorOpenings(entries, w, d);
  const entry = entries[0];
  // The corridor glazing and the far-end windows are visible in 5017/5023/5024.
  openings.push(
    { side: 'east', from: -d / 2 + .30, to: entry.z - .87, bottom: .78, top: 2.57, kind: 'window' },
    { side: 'east', from: entry.z + .87, to: .35, bottom: .78, top: 2.57, kind: 'window' },
    { side: 'north', from: -w / 2 + .36, to: -.10, bottom: .84, top: 2.36, kind: 'window' },
    { side: 'north', from: .10, to: w / 2 - .36, bottom: .84, top: 2.36, kind: 'window' },
  );
  const architecture = createRoomArchitecture(scene, { width: w, depth: d, height: h, openings, namePrefix: 'hologram-wall' });
  const obstacle = (x: number, z: number, width: number, depth: number) => obstacles.push({ x, z, w: width, d: depth });
  const add = (name: string, x: number, z: number, description: string, action = tr('Tìm hiểu', 'Learn more')) => {
    const index = items.length; items.push({ name, x, z, title: name, description, action });
    const group = new THREE.Group(); group.name = `E002-station-${index}`; group.userData.station = index; group.visible = furnished;
    scene.add(group); groups.push(group); if (furnished) interactables.push(group); return group;
  };
  const tables = add(tr('Bàn trao đổi và mẫu hologram', 'Discussion tables and hologram samples'), -.48, -1.36,
    tr('Hai hàng bàn gỗ ghép, tám ghế kem xen xanh lá và cam, các tấm mẫu đen và hộp lưu trữ theo ảnh hiện trạng.', 'Two joined rows of wood desks, eight cream, green and orange chairs, dark sample plates and storage boxes follow the site photos.'));
  const displays = add(tr('Vách lưới trưng bày hologram', 'Hologram display partitions'), -.48, -3.64,
    tr('Vách lưới khung đen trên chân chữ T, phủ vải tối, gắn các khung mẫu và đèn cổ ngỗng. Ánh sáng bật lên chỉ là hiệu ứng minh họa.', 'Black wire partitions on T-feet carry dark fabric, framed samples and gooseneck lights. The lighting toggle is an illustration.'), tr('Bật / tắt chiếu sáng mẫu', 'Sample lighting on / off'));
  const television = add(tr('Màn hình lớn di động', 'Large mobile screen'), 2.16, -.56,
    tr('Màn hình mặt quay về cụm bàn, lưng hướng về phía cửa kính, đặt trên chân thép hai trụ có bánh xe.', 'The screen faces the tables, with its back towards the glazed entrance, on a twin-post wheeled steel stand.'), tr('Bật / tắt màn hình', 'Screen on / off'));
  const chamber = add(tr('Buồng thiết bị hologram', 'Enclosed hologram equipment'), .55, 2.45,
    tr('Buồng vỏ đen, khung nhôm định hình, ô kính tối, cánh mở và bánh xe đỏ dựng theo ảnh. Không gán nhãn hiệu hoặc cấu hình bên trong chưa quan sát được.', 'The black enclosure, aluminium profiles, dark viewing panels, open leaf and red castors follow the photos. No unobserved brand or internal specification is assigned.'), tr('Xem minh họa hologram', 'Show hologram illustration'));
  const control = add(tr('Bàn điều khiển và tủ gỗ', 'Control desk and wood cabinet'), -w / 2 + .48, 1.5,
    tr('Tủ gỗ thấp, bàn trắng, máy tính trên tay đỡ và ghế văn phòng ở lối đi cạnh buồng thiết bị.', 'A low wood cabinet, white desk, arm-mounted computer and office chair sit in the aisle beside the enclosure.'), tr('Bật / tắt máy tính', 'Computer on / off'));
  const board = add(tr('Bảng trắng và máy chiếu', 'Whiteboard and projector'), 0, d / 2 - .25,
    tr('Bảng trắng ở cuối phòng và máy chiếu trên trần theo ảnh 5019-5021.', 'The whiteboard is at the far end, with a ceiling projector as shown in photos 5019-5021.'));
  const fittings = add(tr('Thiết bị và chiếu sáng phòng', 'Room fittings and lighting'), 0, -4.5,
    tr('Hai máy điều hòa phía cửa sổ cuối phòng, quạt tường, loa và đèn LED vuông.', 'Two air conditioners above the far-end windows, wall fans, speakers and square LED lights.'));
  const chair = (x: number, z: number, angle: number, parent: THREE.Object3D, color: THREE.Material, office = false) => {
    const group = new THREE.Group(); group.position.set(x, 0, z); group.rotation.y = angle; parent.add(group);
    box(.44, .065, .43, 0, .46, 0, color, group);
    box(.46, office ? .48 : .30, .045, 0, office ? .76 : .68, .20, color, group);
    if (!office) box(.15, .035, .012, 0, .76, .228, steel, group);
    for (const dx of [-.18, .18]) {
      box(.03, .67, .03, dx, .35, .19, black, group); box(.03, .40, .03, dx, .23, -.15, black, group);
      box(.03, .035, .48, dx, .04, .015, black, group);
      if (office) box(.035, .04, .35, dx * 1.3, .67, .015, graphite, group);
    }
    obstacle(x, z, .49, .50);
  };
  const screenMat = mat(0x142127, .28); screenMat.emissive.set(0x176c82); screenMat.emissiveIntensity = .03;
  const tvMat = mat(0x15252b, .3); tvMat.emissive.set(0x247f8b); tvMat.emissiveIntensity = .03;
  const samples: THREE.MeshStandardMaterial[] = [];
  const overhead = new THREE.Group(); overhead.visible = furnished; scene.add(overhead);
  const mounted: { group: THREE.Object3D; side: WallSide; materials: { material: THREE.MeshStandardMaterial; base: number }[] }[] = [];
  const mount = (group: THREE.Object3D, side: WallSide) => {
    const copies = new Map<THREE.MeshStandardMaterial, THREE.MeshStandardMaterial>();
    group.traverse(object => {
      if (!(object instanceof THREE.Mesh)) return;
      const original = object.material as THREE.MeshStandardMaterial;
      if (!copies.has(original)) { const copy = original.clone(); copy.transparent = true; copy.depthWrite = false; copy.forceSinglePass = true; copies.set(original, copy); }
      object.material = copies.get(original)!; object.renderOrder = 8; object.castShadow = false;
    });
    mounted.push({ group, side, materials: [...copies.values()].map(material => ({ material, base: material.opacity })) });
  };
  const hologram = new THREE.Group(); hologram.visible = false; chamber.add(hologram);
  if (furnished) {
    for (let column = 0; column < 4; column++) {
      const x = -.48 + (column - 1.5) * .84;
      for (const z of [-1.68, -1.06]) {
        box(.83, .055, .58, x, .755, z, oak, tables);
        for (const dx of [-.34, .34]) { box(.035, .72, .035, x + dx, .37, z, black, tables); box(.045, .035, .53, x + dx, .04, z, black, tables); }
        obstacle(x, z, .84, .60);
      }
      chair(x, -2.48, Math.PI, tables, [orange, cream, lime, cream][column]);
      chair(x, -.25, 0, tables, cream);
      if (column < 3) { box(.34, .025, .24, x, .80, -1.72, graphite, tables); box(.30, .008, .20, x, .817, -1.72, mat(0x28343a), tables); }
    }
    const storage = mat(0xf1f3ed, .35, .40);
    for (let i = 0; i < 2; i++) { box(.43, .13, .29, .20, .84 + i * .14, -1.06, storage, tables); box(.45, .02, .31, .20, .91 + i * .14, -1.06, white, tables); }
    const cloth = mat(0x101719, .96, .87); cloth.side = THREE.DoubleSide;
    for (let panel = 0; panel < 3; panel++) {
      const x = -1.95 + panel * 1.43, z = -3.64, a = 1.38;
      const group = new THREE.Group(); group.name = `hologram-partition-${panel}`; group.position.set(x, 0, z); displays.add(group);
      box(a - .05, 1.72, .012, 0, 1.12, -.025, cloth, group);
      for (const dx of [-a / 2, a / 2]) { box(.032, 2.08, .032, dx, 1.08, 0, black, group); box(.055, .045, .54, dx, .035, 0, black, group); }
      for (const y of [.18, 2.10]) box(a, .032, .032, 0, y, 0, black, group);
      const points: number[] = [];
      for (let xx = -a / 2 + .12; xx < a / 2; xx += .12) points.push(xx, .18, .008, xx, 2.10, .008);
      for (let y = .28; y < 2.1; y += .12) points.push(-a / 2, y, .008, a / 2, y, .008);
      const grid = new THREE.BufferGeometry(); grid.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
      group.add(new THREE.LineSegments(grid, new THREE.LineBasicMaterial({ color: 0x444e51 })));
      const sample = mat(panel ? 0x322752 : 0x431a2d, .36); sample.emissive.set(panel ? 0x52359a : 0x6f2145); sample.emissiveIntensity = .12;
      sample.map = texture(256, ctx => {
        ctx.fillStyle = panel ? '#171226' : '#2b111d'; ctx.fillRect(0, 0, 256, 256);
        for (let ring = 0; ring < 10; ring++) { ctx.strokeStyle = `hsla(${235 + ring * 12},55%,${35 + ring * 3}%,.6)`; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(128, 128, 18 + ring * 10, 22 + ring * 9, ring * .14, 0, Math.PI * 2); ctx.stroke(); }
      }); samples.push(sample);
      box(.51, .64, .055, 0, 1.38, .05, black, group); box(.465, .592, .009, 0, 1.38, .084, sample, group);
      rod(new THREE.Vector3(.15, 2.08, 0), new THREE.Vector3(.15, 2.31, .25), .012, steel, group);
      const lamp = cylinder(.045, .12, .15, 2.28, .28, steel, group); lamp.rotation.x = .7;
      obstacle(x, z, a + .06, .55);
    }
    // The mobile display's viewing face points west, towards the joined tables.
    box(.075, 1.02, 1.72, 2.16, 1.46, -.56, graphite, television);
    box(.012, .94, 1.63, 2.112, 1.46, -.56, tvMat, television);
    for (const z of [-1.12, 0]) {
      box(.065, .92, .065, 2.19, .54, z, black, television); box(.64, .055, .07, 2.18, .09, z, black, television);
      for (const x of [1.92, 2.43]) { const wheel = cylinder(.045, .04, x, .045, z, graphite, television); wheel.rotation.x = Math.PI / 2; }
    }
    box(.17, .18, .83, 2.23, 1.30, -.56, black, television); obstacle(2.16, -.56, .70, 1.82);
    // Black enclosure with aluminium extrusion rails, viewing panels and castors.
    const cx = .55, cz = 2.45, a = 2.32, c = 2.80, y0 = .18, top = 2.44;
    const smoked = mat(0x172124, .25, .76);
    box(a - .12, .10, c - .12, cx, y0, cz, graphite, chamber);
    for (const x of [cx - a / 2, cx + a / 2]) for (const z of [cz - c / 2, cz + c / 2]) {
      box(.065, top - y0, .065, x, (top + y0) / 2, z, steel, chamber);
      const wheel = cylinder(.070, .045, x, .085, z, mat(0x9c3735), chamber); wheel.rotation.z = Math.PI / 2;
      box(.085, .09, .07, x, .14, z, graphite, chamber);
    }
    for (const y of [y0 + .08, .65, top]) {
      for (const z of [cz - c / 2, cz + c / 2]) box(a, .06, .06, cx, y, z, steel, chamber);
      for (const x of [cx - a / 2, cx + a / 2]) box(.06, .06, c, x, y, cz, steel, chamber);
    }
    for (const x of [cx - a / 2, cx + a / 2]) {
      box(.025, .39, c - .14, x, .43, cz, black, chamber);
      box(.020, 1.65, c - .14, x, 1.49, cz, smoked, chamber);
      box(.025, 1.70, .045, x, 1.49, cz, steel, chamber);
    }
    box(a - .14, top - .82, .035, cx, 1.52, cz - c / 2, black, chamber);
    box(a - .14, .39, .035, cx, .43, cz + c / 2, black, chamber);
    box(a - .16, 1.67, .03, cx, 1.50, cz + c / 2, black, chamber);
    for (const x of [cx - .36, cx + .36]) box(.025, 1.48, .035, x, 1.48, cz + c / 2 + .027, steel, chamber);
    const leaf = new THREE.Group(); leaf.position.set(cx + a / 2, 0, cz + c / 2); leaf.rotation.y = -Math.PI / 2; chamber.add(leaf);
    box(.67, 1.96, .04, .35, 1.25, 0, black, leaf);
    for (const x of [.02, .68]) box(.035, 2.01, .045, x, 1.25, 0, steel, leaf);
    for (const y of [.25, 2.25]) box(.69, .035, .045, .35, y, 0, steel, leaf);
    obstacle(cx, cz, a + .08, c + .08); obstacle(cx + a / 2, cz + c / 2 + .35, .10, .74);
    const glow = mat(0x36b9ca, .26, .45); glow.emissive.set(0x248baf); glow.emissiveIntensity = .55;
    const illustration = new THREE.Mesh(new THREE.TorusKnotGeometry(.31, .055, 64, 8), glow); illustration.position.set(cx, 1.40, cz); hologram.add(illustration);
    const base = cylinder(.48, .05, cx, .82, cz, black, hologram); base.userData.illustrative = true;
    // West-side control desk, monitor face +X and chair forward -X.
    const tx = -w / 2 + .43, tz = 1.52;
    box(.65, .055, 2.46, tx, .755, tz, white, control); box(.60, .69, 2.40, tx, .37, tz, walnut, control); obstacle(tx, tz, .67, 2.48);
    for (const z of [tz - .80, tz, tz + .80]) { box(.025, .53, .025, tx + .315, .38, z, black, control); box(.03, .12, .025, tx + .345, .43, z - .12, steel, control); }
    const monitor = new THREE.Group(); monitor.position.set(tx + .02, 0, tz); monitor.rotation.y = Math.PI / 2; control.add(monitor);
    box(.59, .36, .045, 0, 1.10, 0, graphite, monitor); box(.54, .31, .009, 0, 1.10, .029, screenMat, monitor);
    box(.045, .22, .055, 0, .87, 0, steel, monitor); box(.24, .018, .17, 0, .79, .01, steel, monitor);
    box(.38, .016, .13, 0, .792, .24, black, monitor); box(.05, .025, .08, .28, .80, .24, black, monitor);
    rod(new THREE.Vector3(0, .80, -.20), new THREE.Vector3(0, 1.07, -.02), .018, steel, monitor);
    chair(tx + .97, tz, Math.PI / 2, control, graphite, true);
    box(.24, .38, .42, tx + .10, .26, tz + .84, black, control);
    box(2.65, 1.20, .075, -.20, 1.65, d / 2 - .08, graphite, board);
    box(2.57, 1.12, .018, -.20, 1.65, d / 2 - .13, white, board);
    box(2.65, .035, .14, -.20, 1.04, d / 2 - .16, steel, board); mount(board, 'south');
    const northFittings = new THREE.Group(); fittings.add(northFittings);
    for (const x of [-.98, .98]) { box(1.05, .31, .24, x, 2.65, -d / 2 + .18, white, northFittings); box(.94, .035, .02, x, 2.56, -d / 2 + .31, steel, northFittings); }
    for (const x of [-w / 2 + .29, w / 2 - .29]) box(.22, .46, .20, x, 2.55, -d / 2 + .15, graphite, northFittings);
    mount(northFittings, 'north');
    for (const [x, z] of [[-w / 2 + .16, -1.6], [-w / 2 + .16, 2.2], [w / 2 - .16, 2.7]]) {
      const fan = new THREE.Group(); fan.position.set(x, 2.43, z); fan.rotation.y = x < 0 ? Math.PI / 2 : -Math.PI / 2; fittings.add(fan);
      const ring = new THREE.Mesh(new THREE.TorusGeometry(.22, .012, 6, 28), steel); fan.add(ring);
      for (let blade = 0; blade < 3; blade++) { const angle = blade * Math.PI * 2 / 3; const b = box(.07, .20, .018, Math.sin(angle) * .08, Math.cos(angle) * .08, -.01, white, fan); b.rotation.z = -angle; }
      cylinder(.035, .06, 0, 0, .02, graphite, fan); mount(fan, x < 0 ? 'west' : 'east');
    }
    const led = mat(0xfff8e4); led.emissive.set(0xffedbd); led.emissiveIntensity = .4;
    for (const x of [-1.35, 1.20]) for (const z of [-4.1, -1.5, 1.1, 3.7]) { box(.62, .025, .62, x, 2.98, z, steel, overhead); box(.57, .012, .57, x, 2.96, z, led, overhead); }
    box(w, .24, .25, 0, 2.86, .50, white, overhead);
    box(.035, .26, .035, .15, 2.79, 1.10, steel, overhead); box(.34, .14, .26, .15, 2.60, 1.10, white, overhead);
    box(.075, .06, .018, .15, 2.60, 1.24, graphite, overhead);
  }
  const selection = new THREE.BoxHelper(new THREE.Object3D(), 0xec792f); selection.visible = false; scene.add(selection);
  const active = new Set<number>(); let selected = -1;
  const portals: Portal[] = entries.map((at, index) => ({ id: `exit-${index}`, label: tr('Ra hành lang', 'To the corridor'), x: at.x, z: at.z, kind: 'exit' }));
  scene.userData.hologramSurvey = { room: 'E002', source: 'IMG_5015-5024', estimated: true, openings: architecture.openings };
  return {
    floor, width: w, depth: d, start: roomEntry(room).start, obstacles, interactables, items, portals,
    highlight: (index: number) => { selected = index; selection.visible = furnished && index >= 0 && index < groups.length; if (selection.visible) selection.setFromObject(groups[index]); },
    activate: (index: number) => {
      active.has(index) ? active.delete(index) : active.add(index);
      samples.forEach(material => { material.emissiveIntensity = active.has(1) ? .65 : .12; });
      tvMat.emissiveIntensity = active.has(2) ? .7 : .03; tvMat.color.set(active.has(2) ? 0x285c70 : 0x15252b);
      screenMat.emissiveIntensity = active.has(4) ? .7 : .03; screenMat.color.set(active.has(4) ? 0x247e91 : 0x142127);
      hologram.visible = furnished && active.has(3);
    },
    update: (time: number, dt: number, camera: THREE.Camera, top: boolean) => {
      overhead.visible = furnished && !top;
      const settling = architecture.update(camera, top, dt);
      for (const item of mounted) {
        item.group.visible = furnished && !top;
        const fade = architecture.walls.find(wall => wall.side === item.side)?.fade ?? 0;
        item.materials.forEach(({ material, base }) => { material.opacity = THREE.MathUtils.lerp(base, Math.min(base, .10), fade); });
      }
      if (hologram.visible) hologram.children[0].rotation.y = time * .00035;
      if (selected >= 0 && selection.visible) selection.update();
      return settling || hologram.visible;
    },
  };
}
