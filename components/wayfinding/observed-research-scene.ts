import { tr } from './locale';
import * as THREE from 'three';
import { roomEntry, roomSize, type Portal, type TourItem, type TourRoom } from './campus-tour-scene';
import { createRoomArchitecture, doorOpenings, type RoomOpening, type WallSide } from './room-architecture';
import type { RoomObstacle } from './room104-scene';

export const isObservedResearchRoom = (id: string) => ['E302', 'E303', 'E304'].includes(id);

// Reconstructed from the user's October survey. Equipment shapes and dimensions
// are visual approximations; these models are not an equipment inventory.
export const RESEARCH_ROOM_SURVEYS = {
  E302: { source: 'IMG_1391, IMG_1394, IMG_1396, IMG_1397', type: 'flight-arena', doors: 2 },
  E303: { source: 'IMG_5040–IMG_5051', type: 'mobile-robot-road', doors: 1 },
  E304: { source: 'IMG_5053–IMG_5066', type: 'automation-training', doors: 1 },
} as const;

function drawingTexture(width: number, height: number, draw: (context: CanvasRenderingContext2D) => void) {
  const canvas = document.createElement('canvas'); canvas.width = width; canvas.height = height;
  draw(canvas.getContext('2d')!);
  const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

function roomKit(scene: THREE.Object3D) {
  const mat = (color: number, opacity = 1, roughness = .72) => new THREE.MeshStandardMaterial({ color, roughness, transparent: opacity < 1, opacity, depthWrite: opacity === 1 });
  const white = mat(0xf1f0e8), black = mat(0x172027), steel = mat(0x8b989e, 1, .38), blue = mat(0x537d99), warm = mat(0x9b6140);
  const boxGeometry = new THREE.BoxGeometry(1, 1, 1), cylinderGeometry = new THREE.CylinderGeometry(1, 1, 1, 12), sphereGeometry = new THREE.SphereGeometry(1, 12, 8);
  const woodTexture = drawingTexture(512, 256, ctx => {
    ctx.fillStyle = '#b99870'; ctx.fillRect(0, 0, 512, 256);
    for (let i = 0; i < 100; i++) { ctx.strokeStyle = `rgba(74,46,25,${.04 + (i % 5) * .012})`; ctx.beginPath(); for (let x = 0; x <= 512; x += 16) { const y = i * 2.6 + Math.sin(x * .025 + i) * 2; if (x) ctx.lineTo(x, y); else ctx.moveTo(x, y); } ctx.stroke(); }
  });
  const wood = mat(0xffffff); wood.map = woodTexture;
  const mesh = (geometry: THREE.BufferGeometry, material: THREE.Material, x: number, y: number, z: number, a: number, b: number, c: number, parent: THREE.Object3D = scene) => {
    const object = new THREE.Mesh(geometry, material); object.position.set(x, y, z); object.scale.set(a, b, c); object.castShadow = object.receiveShadow = true; parent.add(object); return object;
  };
  const box = (a: number, b: number, c: number, x: number, y: number, z: number, material = white, parent: THREE.Object3D = scene) => mesh(boxGeometry, material, x, y, z, a, b, c, parent);
  const cylinder = (r: number, h: number, x: number, y: number, z: number, material = steel, parent: THREE.Object3D = scene) => mesh(cylinderGeometry, material, x, y, z, r, h, r, parent);
  const ball = (r: number, x: number, y: number, z: number, material = black, parent: THREE.Object3D = scene) => mesh(sphereGeometry, material, x, y, z, r, r, r, parent);
  const bar = (a: THREE.Vector3, b: THREE.Vector3, radius: number, material: THREE.MeshStandardMaterial, parent: THREE.Object3D) => {
    const delta = b.clone().sub(a), object = cylinder(radius, delta.length(), 0, 0, 0, material, parent);
    object.position.copy(a).add(b).multiplyScalar(.5); object.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), delta.normalize()); return object;
  };
  return { mat, white, black, steel, blue, warm, wood, box, cylinder, ball, bar };
}

export function createObservedResearchRoom(scene: THREE.Scene, room: TourRoom, furnished: boolean) {
  const { width, depth } = roomSize(room), height = 3.05;
  // The user reassigned the two surveyed interiors; the physical room envelope
  // and all floor-plan door coordinates stay with their original room IDs.
  const layout = ({ E303: 'road', E304: 'automation' } as Record<string, string>)[room.id] ?? 'arena';
  const turn = layout === 'road' ? -Math.PI / 2 : layout === 'automation' ? Math.PI / 2 : 0;
  const w = turn ? depth : width, d = turn ? width : depth;
  const furniture = new THREE.Group(); furniture.rotation.y = turn; scene.add(furniture);
  const cosine = Math.cos(turn), sine = Math.sin(turn);
  const toWorld = (x: number, z: number) => ({ x: x * cosine + z * sine, z: z * cosine - x * sine });
  const toLocal = (x: number, z: number) => ({ x: x * cosine - z * sine, z: x * sine + z * cosine });
  const physicalSide = (side: WallSide): WallSide => {
    const normals = { north: [0, -1], south: [0, 1], east: [1, 0], west: [-1, 0] } as const;
    const normal = toWorld(normals[side][0], normals[side][1]);
    return Math.abs(normal.x) > .5 ? normal.x < 0 ? 'west' : 'east' : normal.z < 0 ? 'north' : 'south';
  };
  const physicalOpening = (opening: RoomOpening): RoomOpening => {
    const vertical = opening.side === 'east' || opening.side === 'west';
    const fixed = opening.side === 'north' ? -d / 2 : opening.side === 'south' ? d / 2 : opening.side === 'west' ? -w / 2 : w / 2;
    const ends = [opening.from, opening.to].map(at => vertical ? toWorld(fixed, at) : toWorld(at, fixed));
    const side = physicalSide(opening.side), values = ends.map(point => side === 'east' || side === 'west' ? point.z : point.x);
    return { ...opening, side, from: Math.min(...values), to: Math.max(...values) };
  };
  const kit = roomKit(furniture);
  const { mat, white, black, steel, blue, warm, wood, box, cylinder, ball, bar } = kit;
  const obstacles: RoomObstacle[] = [], interactables: THREE.Object3D[] = [], items: TourItem[] = [], groups: THREE.Group[] = [];
  const obstacle = (x: number, z: number, width: number, depth: number) => {
    const point = toWorld(x, z);
    obstacles.push({ ...point, w: Math.abs(cosine) * width + Math.abs(sine) * depth, d: Math.abs(sine) * width + Math.abs(cosine) * depth });
  };
  const floor = box(width, .12, depth, 0, -.06, 0, mat(room.id === 'E302' ? 0x8f9291 : 0xe2e0d6), scene); floor.userData.walkable = true;
  if (room.id !== 'E302') {
    const grout = mat(0xbcbdb4);
    for (let x = -width / 2 + .6; x < width / 2; x += .6) box(.006, .002, depth, x, .002, 0, grout, scene);
    for (let z = -depth / 2 + .6; z < depth / 2; z += .6) box(width, .002, .006, 0, .002, z, grout, scene);
  }
  const worldDoors = (room.doors ?? [room.door]).map(door => roomEntry({ ...room, door }));
  const localDoors = worldDoors.map(entry => toLocal(entry.x, entry.z));
  const openings: RoomOpening[] = doorOpenings(localDoors, w, d);
  const window = (side: RoomOpening['side'], from: number, to: number, bottom = .87) => openings.push({ side, from, to, bottom, top: 2.4, kind: 'window' });
  if (room.id === 'E302') {
    const northDoor = localDoors.find(entry => Math.abs(entry.z + d / 2) < .1);
    const center = northDoor?.x ?? 0;
    if (center - .95 > -w / 2 + .4) window('north', -w / 2 + .38, center - .85);
    if (center + .95 < w / 2 - .4) window('north', center + .85, w / 2 - .38);
  } else if (layout === 'automation') {
    const center = localDoors[0]?.x ?? -.4;
    window('north', Math.max(center + .90, .55), w / 2 - .25);
  } else {
    const center = localDoors[0]?.z ?? .53;
    window('west', -d / 2 + .30, Math.min(center - .9, -.45));
    // A narrow curtained bay sits beside the board, rather than behind it.
    window('east', -d / 2 + .30, -d / 2 + 1.55, .08);
  }
  const architectureOpenings = openings.map(physicalOpening);
  const architecture = createRoomArchitecture(scene, { width, depth, height, openings: architectureOpenings, namePrefix: `observed-${room.id.toLowerCase()}` });
  const wallMounted: { side: WallSide; material: THREE.MeshStandardMaterial; base: number }[] = [];
  const mountedMaterial = (original: THREE.MeshStandardMaterial, side: WallSide) => {
    const material = original.clone(); material.transparent = true; material.depthWrite = false; material.forceSinglePass = true;
    wallMounted.push({ side: physicalSide(side), material, base: original.opacity }); return material;
  };
  const mountedBox = (a: number, b: number, c: number, x: number, y: number, z: number, material: THREE.MeshStandardMaterial, side: WallSide, parent: THREE.Object3D) => {
    const object = box(a, b, c, x, y, z, mountedMaterial(material, side), parent);
    // These thin surfaces sit in front of a large transparent wall segment.
    // Draw them after the wall so centre-based transparent sorting cannot let
    // the plaster cover the board when its corner is closer to the camera.
    object.renderOrder = 8; object.castShadow = object.receiveShadow = false; return object;
  };
  const add = (name: string, x: number, z: number, title: string, description: string, action = tr("Tìm hiểu", "Learn more")) => {
    const index = items.length, group = new THREE.Group(); group.userData.station = index; group.name = `${room.id}-station-${index}`; group.visible = furnished; furniture.add(group);
    const point = toWorld(x, z);
    items.push({ name, ...point, title, description, action }); groups.push(group); if (furnished) interactables.push(group); return group;
  };
  const overhead = new THREE.Group(); overhead.visible = furnished; furniture.add(overhead);
  const screens: THREE.MeshStandardMaterial[] = [], moving: THREE.Object3D[] = [], active = new Set<number>();
  const monitor = (x: number, z: number, parent: THREE.Object3D, rotation = 0, y = 1.08, width = .54) => {
    const group = new THREE.Group(); group.position.set(x, 0, z); group.rotation.y = rotation; parent.add(group);
    const screen = mat(0x111a20, 1, .3); screen.emissive.set(0x176778); screen.emissiveIntensity = .025; screens.push(screen);
    box(width, .34, .04, 0, y, 0, black, group); box(width - .045, .292, .009, 0, y, .027, screen, group);
    box(.04, .18, .05, 0, y - .25, 0, steel, group); box(.24, .018, .18, 0, .785, .025, black, group);
    box(.40, .016, .14, 0, .79, .25, black, group); box(.055, .025, .085, .27, .80, .25, black, group);
    for (const dx of [-.16, -.08, 0, .08, .16]) box(.006, .002, .105, dx, .800, .25, steel, group);
    return group;
  };
  const chair = (x: number, z: number, parent: THREE.Object3D, rotation = 0, office = false, colored = false) => {
    const group = new THREE.Group(); group.position.set(x, 0, z); group.rotation.y = rotation; parent.add(group);
    const color = office ? black : mat(colored ? 0xb9d298 : 0xe3e1cd);
    box(.43, .055, .43, 0, .45, 0, color, group); box(.44, office ? .51 : .29, .04, 0, office ? .75 : .67, -.20, color, group);
    if (office) { cylinder(.032, .39, 0, .23, 0, steel, group); for (let i = 0; i < 5; i++) { const leg = box(.30, .035, .035, Math.cos(i * 1.257) * .12, .065, Math.sin(i * 1.257) * .12, black, group); leg.rotation.y = -i * 1.257; } }
    else for (const dx of [-.17, .17]) { box(.027, .42, .027, dx, .23, .16, steel, group); box(.027, .66, .027, dx, .35, -.16, steel, group); box(.027, .03, .48, dx, .035, 0, steel, group); }
    obstacle(x, z, .46, .48);
  };
  const teacherDesk = (x: number, z: number, parent: THREE.Object3D, rotation = 0) => {
    const group = new THREE.Group(); group.position.set(x, 0, z); group.rotation.y = rotation; parent.add(group);
    box(1.35, .045, .62, 0, .755, 0, white, group); box(1.15, .60, .045, 0, .40, -.25, steel, group);
    for (const dx of [-.61, .61]) box(.04, .72, .56, dx, .37, 0, white, group);
    monitor(-.15, -.02, group); obstacle(x, z, Math.abs(Math.sin(rotation)) > .5 ? .64 : 1.35, Math.abs(Math.sin(rotation)) > .5 ? 1.35 : .64);
  };
  const robot = (x: number, z: number, parent: THREE.Object3D, color: number, angle = 0) => {
    const group = new THREE.Group(); group.position.set(x, 0, z); group.rotation.y = angle; parent.add(group);
    const body = mat(color); box(.34, .11, .43, 0, .13, 0, body, group); box(.38, .035, .46, 0, .205, 0, black, group);
    box(.20, .025, .22, 0, .232, -.02, blue, group); cylinder(.055, .055, .08, .273, .07, black, group);
    for (const dx of [-.18, .18]) for (const dz of [-.13, .13]) { const wheel = cylinder(.065, .045, dx, .09, dz, black, group); wheel.rotation.z = Math.PI / 2; }
    box(.25, .07, .018, 0, .15, .23, white, group); for (const dx of [-.09, .09]) ball(.024, dx, .16, .244, black, group);
    cylinder(.012, .16, -.11, .30, -.12, steel, group); obstacle(x, z, .40, .48); return group;
  };

  if (furnished && layout === 'automation') {
    const benches = add(tr("Bàn máy tính thực hành", "Training computer desks"), .2, -.3, tr("Hai dãy bàn gỗ · máy tính thực hành", "Two banks of wood computer desks"), tr("Hai dãy bàn dài chia khoang, màn hình đen và ghế màu kem xen xanh lá. Số chỗ và khoảng cách được ước lượng từ ảnh hiện trạng.", "Two long divided desk banks with black monitors and cream and green chairs. Seating and spacing are estimated from the site photos."), tr("Bật / tắt màn hình", "Screen on / off"));
    const training = add(tr("Hệ thống tự động hóa", "Automation training system"), -w / 2 + .65, -1.5, tr("Cụm robot và mô-đun thực hành", "Robot and training modules"), tr("Thiết bị thực hành cơ điện tử có vỏ máy trắng, tủ che khung nhôm, mô-đun cơ khí và đường khí nén. Hình học mô tả hình dáng quan sát được, không khẳng định cấu hình máy.", "Mechatronics training equipment with a white base, an aluminum-framed enclosure, mechanical modules and pneumatic lines. The model represents visible shapes; it does not specify the machine configuration."), tr("Chạy / dừng mô phỏng", "Start / stop simulation"));
    const storage = add(tr("Tủ thiết bị", "Equipment cabinet"), -w / 2 + .55, 2.6, tr("Tủ gỗ cao · cánh kính", "Tall wood cabinet with glass doors"), tr("Tủ gỗ màu nâu với bốn cánh kính, các tầng chứa hộp linh kiện và học cụ, đặt cạnh cụm máy ở đầu phòng.", "A brown wood cabinet with four glass doors and shelves of component boxes and teaching materials, beside the training equipment."));
    const teaching = add(tr("Bảng & bàn giảng viên", "Whiteboard and instructor desk"), -.8, d / 2 - .8, tr("Bảng trắng · máy chiếu · bàn trắng", "Whiteboard, projector and white desk"), tr("Khu hướng dẫn ở đầu phòng, gồm bảng trắng, màn cuốn, bàn máy tính trắng và ghế xoay đen.", "The teaching area has a whiteboard, roller screen, white computer desk and black swivel chair."), tr("Bật / tắt trình chiếu", "Projection on / off"));
    const benchX = [-.25, Math.min(1.65, w / 2 - .99)], first = -d / 2 + 2.15, pitch = Math.min(1.12, (d - 4.2) / 6);
    for (const [bank, x] of benchX.entries()) {
      box(.66, .045, 6 * pitch, x, .755, first + 2.5 * pitch, wood, benches); box(.035, .71, 6 * pitch, x - .30, .37, first + 2.5 * pitch, wood, benches); obstacle(x, first + 2.5 * pitch, .68, 6 * pitch);
      for (let i = 0; i < 6; i++) {
        const z = first + i * pitch; box(.65, .70, .025, x, .37, z - pitch / 2, wood, benches); box(.65, .045, .025, x, .80, z - pitch / 2, black, benches);
        monitor(x - .08, z, benches, Math.PI / 2); chair(x + .64, z, benches, -Math.PI / 2, false, (i + bank) % 5 === 1);
      }
    }
    const mx = -w / 2 + .64, mz = -1.55;
    box(.90, .92, 2.6, mx, .48, mz, white, training); obstacle(mx, mz, 1.02, 2.72);
    const smoked = mat(0x405462, .23, .32);
    for (const dx of [-.44, .44]) for (const dz of [-1.23, 1.23]) box(.045, 1.37, .045, mx + dx, 1.58, mz + dz, steel, training);
    box(.88, 1.28, .018, mx, 1.59, mz - 1.24, smoked, training); box(.018, 1.28, 2.48, mx + .45, 1.59, mz, smoked, training);
    for (const dz of [-1.23, 1.23]) box(.92, .045, .055, mx, 2.27, mz + dz, steel, training);
    box(.055, .045, 2.5, mx - .44, 2.27, mz, steel, training); box(.055, .045, 2.5, mx + .44, 2.27, mz, steel, training);
    for (let i = 0; i < 6; i++) { const z = mz - 1 + i * .38; cylinder(.09, .12, mx, 1.01, z, steel, training); box(.16, .08, .18, mx + .15, 1.12, z, black, training); box(.02, .11, .24, mx - .18, 1.09, z, blue, training); }
    const arm = new THREE.Group(); arm.position.set(mx, 1.14, mz + .45); training.add(arm); moving.push(arm);
    cylinder(.12, .12, 0, 0, 0, black, arm); bar(new THREE.Vector3(0, .05, 0), new THREE.Vector3(.2, .42, 0), .055, steel, arm); bar(new THREE.Vector3(.2, .42, 0), new THREE.Vector3(.05, .65, .12), .05, steel, arm); box(.12, .08, .16, .05, .65, .12, black, arm);
    monitor(mx + .48, mz + .87, training, Math.PI / 2, 1.95, .65);
    box(.30, .24, .06, mx + .49, 1.45, mz + .87, steel, training); box(.23, .15, .015, mx + .53, 1.46, mz + .87, black, training);
    const compressor = cylinder(.20, .43, mx + .12, .27, mz + 1.64, steel, training); compressor.scale.z *= .8; obstacle(mx + .12, mz + 1.64, .45, .5);
    const sx = -w / 2 + .40, sz = 2.6, glass = mat(0x6e7270, .32);
    box(.72, 2.35, 2.05, sx, 1.18, sz, warm, storage); obstacle(sx, sz, .75, 2.1);
    for (let door = 0; door < 4; door++) { const z = sz - .75 + door * .5; box(.025, 1.87, .43, sx + .375, 1.32, z, glass, storage); box(.035, 1.98, .04, sx + .39, 1.30, z - .235, warm, storage); box(.03, .14, .025, sx + .42, 1.20, z + .16, steel, storage); }
    for (const y of [.2, .7, 1.2, 1.7, 2.18]) { box(.68, .035, 2.00, sx + .015, y, sz, warm, storage); for (let i = 0; i < 6; i++) box(.38, .15, .16, sx + .08, y + .10, sz - .8 + i * .31, i % 2 ? blue : steel, storage); }
    mountedBox(3.5, 1.18, .045, -.1, 1.63, d / 2 - .08, black, 'south', teaching); mountedBox(3.42, 1.10, .015, -.1, 1.63, d / 2 - .11, white, 'south', teaching);
    mountedBox(2.55, .12, .13, -.25, 2.51, d / 2 - .13, white, 'south', teaching); teacherDesk(-.95, d / 2 - .9, teaching); chair(-.95, d / 2 - .32, teaching, Math.PI, true);
  }

  if (furnished && room.id === 'E302') {
    const arena = add(tr("Sân thử nghiệm có lưới", "Netted test arena"), .25, -.3, tr("Khung lưới bảo vệ · sàn đường thử", "Safety-net enclosure and marked test floor"), tr("Khung lưới đen bao quanh sân thử drone và robot di động. Lối mở phía sau cho phép quan sát bên trong; số thiết bị và kích thước là ước lượng từ bốn ảnh sân lưới.", "A black safety-net enclosure surrounds the drone and mobile-robot test floor. An opening at the back provides access. Equipment counts and dimensions are estimated from four arena photos."), tr("Chạy / dừng thử nghiệm", "Start / stop demonstration"));
    const consoleGroup = add(tr("Bàn điều khiển", "Control desk"), -w / 2 + 1.0, d / 2 - 1.8, tr("Bàn đen · ba màn hình", "Black desk with three monitors"), tr("Bàn điều khiển ba màn hình, bàn phím, chuột và bộ điều khiển cầm tay đặt phía ngoài lưới bảo vệ.", "A control desk with three monitors, keyboard, mouse and handheld controllers outside the safety net."), tr("Bật / tắt màn hình", "Screen on / off"));
    const robots = add(tr("Drone & robot di động", "Drones and mobile robots"), .3, 1.5, tr("Thiết bị trên sân thử", "Test-floor equipment"), tr("Drone nhiều cánh quạt và robot di động có cột cảm biến được mô tả theo hình dáng trong ảnh. Chuyển động là minh họa, không phản ánh máy đang vận hành.", "Multi-rotor drones and mobile robots with sensor masts follow the visible shapes in the photos. Their movement is a demonstration and does not indicate that real equipment is operating."), tr("Chạy / dừng robot", "Start / stop robots"));
    const seats = add(tr("Khu quan sát", "Observation area"), 0, d / 2 - .6, tr("Ghế chờ màu đen", "Black waiting chairs"), tr("Dãy ghế chờ và hộp thiết bị bên ngoài sân lưới, ở phía đối diện cửa vào.", "A row of waiting chairs and equipment boxes outside the netted arena, opposite the entrance."));
    const cx = .05, cz = -.45, aw = Math.min(4.5, w - 2.1), ad = d - 4.0, x0 = cx - aw / 2, x1 = cx + aw / 2, z0 = cz - ad / 2, z1 = cz + ad / 2;
    const track = drawingTexture(768, 1280, ctx => {
      ctx.fillStyle = '#343a3d'; ctx.fillRect(0, 0, 768, 1280); ctx.strokeStyle = '#7f8a8d'; ctx.lineWidth = 1.3;
      for (let x = 30; x < 768; x += 64) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 1280); ctx.stroke(); }
      for (let y = 32; y < 1280; y += 64) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(768, y); ctx.stroke(); }
      ctx.strokeStyle = '#f1eee3'; ctx.lineWidth = 5; ctx.beginPath(); ctx.roundRect(110, 150, 548, 970, 160); ctx.stroke(); ctx.beginPath(); ctx.roundRect(205, 300, 358, 650, 110); ctx.stroke();
      ctx.strokeStyle = '#b85951'; ctx.lineWidth = 3; for (const y of [185, 640, 1090]) { ctx.beginPath(); ctx.arc(384, y, 13, 0, Math.PI * 2); ctx.stroke(); }
      ctx.fillStyle = '#dedac2'; ctx.fillRect(565, 950, 180, 290);
    });
    const trackMat = mat(0xffffff); trackMat.map = track; box(aw, .015, ad, cx, .012, cz, trackMat, arena);
    const frame = mat(0x242b2d), wire = new THREE.LineBasicMaterial({ color: 0x1f2b2e, transparent: true, opacity: .22, depthWrite: false });
    for (const x of [x0, x1]) for (const z of [z0, z1]) { box(.055, 2.62, .055, x, 1.31, z, frame, arena); obstacle(x, z, .075, .075); }
    for (const x of [x0, x1]) { box(.055, .055, ad, x, 2.62, cz, frame, arena); box(.07, .05, ad, x, .04, cz, frame, arena); obstacle(x, cz, .06, ad); }
    box(aw, .055, .055, cx, 2.62, z0, frame, arena); box(aw, .055, .055, cx, 2.62, z1, frame, arena); obstacle(cx, z0, aw, .06);
    const gate = 1.3; for (const side of [-1, 1]) { const length = (aw - gate) / 2, x = cx + side * (gate / 2 + length / 2); box(length, .05, .06, x, .04, z1, frame, arena); obstacle(x, z1, length, .06); }
    const points: number[] = [], line = (ax: number, ay: number, az: number, bx: number, by: number, bz: number) => points.push(ax, ay, az, bx, by, bz);
    for (let y = .18; y < 2.62; y += .25) { for (const x of [x0, x1]) line(x, y, z0, x, y, z1); line(x0, y, z0, x1, y, z0); line(x0, y, z1, cx - gate / 2, y, z1); line(cx + gate / 2, y, z1, x1, y, z1); }
    for (let z = z0; z <= z1; z += .25) for (const x of [x0, x1]) line(x, 0, z, x, 2.62, z);
    for (let x = x0; x <= x1; x += .25) { line(x, 0, z0, x, 2.62, z0); if (Math.abs(x - cx) > gate / 2) line(x, 0, z1, x, 2.62, z1); }
    const net = new THREE.LineSegments(new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(points, 3)), wire); net.name = 'flight-arena-net'; arena.add(net);
    const drone = (x: number, z: number) => { const group = new THREE.Group(); group.position.set(x, .15, z); robots.add(group); moving.push(group); obstacle(x, z, .55, .55); box(.24, .09, .19, 0, 0, 0, black, group); for (const dx of [-.22, .22]) for (const dz of [-.22, .22]) { bar(new THREE.Vector3(), new THREE.Vector3(dx, 0, dz), .015, steel, group); cylinder(.035, .07, dx, .015, dz, black, group); const rotor = box(.23, .007, .025, dx, .06, dz, black, group); rotor.rotation.y = dx * 2; } return group; };
    drone(cx - .8, cz + .3); drone(cx + .8, cz - .9);
    for (const [i, x] of [cx - 1.1, cx, cx + 1.1].entries()) { const vehicle = robot(x, cz - ad / 2 + .65, robots, 0x242b30); cylinder(.025, .9, x, .75, cz - ad / 2 + .65, steel, robots); box(.24, .09, .12, x, 1.23, cz - ad / 2 + .65, black, robots); vehicle.rotation.y = i * .08; }
    const tx = -w / 2 + 1.0, tz = d / 2 - 1.85; box(1.7, .045, .65, tx, .755, tz, black, consoleGroup); for (const dx of [-.72, .72]) box(.04, .72, .58, tx + dx, .37, tz, steel, consoleGroup); obstacle(tx, tz, 1.75, .68);
    for (const dx of [-.54, 0, .54]) monitor(tx + dx, tz, consoleGroup, 0, 1.11, .50); chair(tx, tz + .62, consoleGroup, Math.PI, true);
    box(.23, .06, .18, tx + .55, .81, tz + .18, steel, consoleGroup); for (const dx of [-.06, .06]) cylinder(.018, .035, tx + .55 + dx, .86, tz + .18, black, consoleGroup);
    for (let i = 0; i < 4; i++) chair(-.55 + i * .60, d / 2 - .40, seats, Math.PI, true);
    for (let i = 0; i < 2; i++) box(.48, .34, .43, w / 2 - .4, .18 + i * .34, d / 2 - .6, mat(0xb89c76), seats); obstacle(w / 2 - .4, d / 2 - .6, .52, .47);
  }

  if (furnished && layout === 'road') {
    const trackGroup = add(tr("Sa bàn đường thử", "Road-test layout"), .1, 0, tr("Thảm đường thử robot di động", "Mobile-robot road mat"), tr("Thảm đen trải gần hết sàn, có làn đường cong, vạch đứt, chỗ đỗ, vạch sang đường và vùng đánh dấu xanh theo ảnh. Đây là mặt sàn có thể đi trên.", "A black mat covers most of the floor, with curved lanes, dashed markings, parking bays, crossings and a green marked area based on the photos. You can walk across this floor."));
    const vehicles = add(tr("Dãy robot di động", "Parked mobile robots"), .7, -d / 2 + .65, tr("Robot bánh xe · mô-đun cảm biến", "Wheeled robots and sensor modules"), tr("Các robot thử nghiệm nhiều kích thước xếp dọc mép thảm, có bánh xe, mặt mạch và cảm biến. Số lượng và tỷ lệ được ước lượng từ ảnh.", "Test robots of different sizes line the edge of the mat, with wheels, circuit boards and sensors. Their number and proportions are estimated from the photos."), tr("Chạy / dừng robot", "Start / stop robots"));
    const teaching = add(tr("Bàn điều khiển & bảng", "Control desk and whiteboard"), w / 2 - 1.0, -d / 2 + .8, tr("Bàn máy tính trắng · bảng trắng", "White computer desk and whiteboard"), tr("Bàn điều khiển có máy tính, ghế xoay đen và tủ thấp, cạnh bảng trắng và màn cuốn.", "A computer control desk, black swivel chair and low cabinet beside the whiteboard and roller screen."), tr("Bật / tắt màn hình", "Screen on / off"));
    const seating = add(tr("Ghế & rèm cửa", "Seating and blinds"), w / 2 - .7, d / 2 - .55, tr("Ghế chờ · rèm lá dọc", "Waiting chairs and vertical blinds"), tr("Ghế chờ kem và cam ở đầu phòng; rèm lá dọc che cụm kính lớn phía cuối phòng.", "Cream and orange waiting chairs at the front, with vertical blinds over the large glazed bay at the far end."));
    const tw = w - 1.5, td = d - 1.25, cx = -.05, cz = .10;
    const road = drawingTexture(1536, 896, ctx => {
      ctx.fillStyle = '#34383b'; ctx.fillRect(0, 0, 1536, 896);
      for (let y = 0; y < 896; y += 8) { ctx.strokeStyle = `rgba(255,255,255,${y % 3 * .006})`; ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(1536, y); ctx.stroke(); }
      ctx.strokeStyle = '#eeeede'; ctx.lineWidth = 5;
      const loop = (x: number, y: number, width: number, depth: number, radius: number) => { ctx.beginPath(); ctx.roundRect(x, y, width, depth, radius); ctx.stroke(); };
      loop(55, 50, 1426, 796, 120); loop(150, 140, 1236, 616, 160); loop(370, 245, 810, 405, 95);
      ctx.setLineDash([24, 23]); ctx.lineWidth = 3; loop(105, 96, 1326, 704, 140); loop(420, 292, 710, 308, 70); ctx.setLineDash([]);
      ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(175, 450); ctx.bezierCurveTo(300, 450, 240, 650, 420, 650); ctx.bezierCurveTo(700, 650, 650, 190, 970, 190); ctx.lineTo(1240, 190); ctx.stroke();
      for (let i = 0; i < 7; i++) { ctx.strokeRect(700 + i * 75, 54, 65, 80); ctx.fillRect(1275, 230 + i * 23, 72, 11); }
      ctx.fillStyle = '#527943'; ctx.fillRect(650, 340, 230, 75); ctx.strokeStyle = '#d0d47a'; ctx.lineWidth = 3;
      for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.moveTo(650 + i * 57, 415); ctx.lineTo(677 + i * 57, 340); ctx.lineTo(707 + i * 57, 415); ctx.stroke(); }
      ctx.fillStyle = '#efeee2'; ctx.font = 'bold 58px Arial'; ctx.textAlign = 'center'; ctx.fillText('↗', 260, 250); ctx.fillText('→', 450, 110); ctx.fillText('←', 1040, 790); ctx.font = 'bold 100px Arial'; ctx.fillText('↻', 780, 555);
    });
    const roadMat = mat(0xffffff); roadMat.map = road; box(tw, .018, td, cx, .015, cz, white, trackGroup); box(tw - .05, .005, td - .05, cx, .028, cz, roadMat, trackGroup);
    const colors = [0x8e6443, 0x383b3e, 0xa9563b, 0x566474, 0x30383e];
    for (let i = 0; i < 9; i++) robot(-tw / 2 + .45 + i * .53, -td / 2 + .06, vehicles, colors[i % colors.length], Math.PI);
    const demonstration = robot(.2, .35, vehicles, 0xd5d2bf, Math.PI / 4); moving.push(demonstration);
    for (const [x, z] of [[-1.5, -.4], [1.8, .8], [-.9, 1.2]]) { cylinder(.025, .36, x, .22, z, black, trackGroup); cylinder(.10, .012, x, .045, z, white, trackGroup); const sign = cylinder(.07, .012, x, .43, z, blue, trackGroup); sign.rotation.x = Math.PI / 2; }
    const tx = w / 2 - 1.25, tz = -d / 2 + .65; teacherDesk(tx, tz, teaching); chair(tx - .6, tz + .65, teaching, Math.atan2(.45, -.67), true);
    box(.50, .70, .48, tx + .45, .35, tz + .63, steel, teaching); obstacle(tx + .45, tz + .63, .54, .52);
    mountedBox(.045, 1.12, 2.35, w / 2 - .07, 1.58, .65, black, 'east', teaching); mountedBox(.015, 1.04, 2.27, w / 2 - .10, 1.58, .65, white, 'east', teaching); mountedBox(.15, .12, 2.55, w / 2 - .12, 2.46, .65, white, 'east', teaching);
    // Vertical blind leaves on the far glazing, kept thin for cutaway clarity.
    const curtain = mountedMaterial(mat(0xa8adb8, .55), 'east'); for (let z = -d / 2 + .35; z < -d / 2 + 1.5; z += .13) { const leaf = box(.025, 2.25, .135, w / 2 - .17, 1.18, z, curtain, seating); leaf.rotation.y = .15; leaf.renderOrder = 8; leaf.castShadow = false; }
    for (let i = 0; i < 2; i++) { const x = w / 2 - .65 - i * .6, z = d / 2 - .4; const seat = new THREE.Group(); seating.add(seat); box(.47, .07, .44, x, .45, z, mat(i ? 0xe5dfca : 0xd96f46), seat); box(.47, .38, .045, x, .68, z + .19, mat(i ? 0xe5dfca : 0xd96f46), seat); for (const dx of [-.18, .18]) box(.035, .43, .035, x + dx, .23, z, black, seat); obstacle(x, z, .50, .48); }
  }

  if (furnished) {
    const led = mat(0xfff9e8, .18); led.emissive.set(0xfff5da); led.emissiveIntensity = .2;
    for (let x = -w / 2 + 1; x < w / 2; x += 1.8) for (let z = -d / 2 + 1.3; z < d / 2; z += 2.0) { const light = box(.60, .025, .60, x, 2.96, z, led, overhead); light.castShadow = light.receiveShadow = false; }
    const projector = box(.32, .13, .24, 0, 2.64, layout === 'road' ? 0 : 1.1, white, overhead); projector.castShadow = false;
    box(.04, .28, .04, 0, 2.84, layout === 'road' ? 0 : 1.1, steel, overhead);
    for (const z of [-d / 2 + 1.6, d / 2 - 1.2]) {
      for (const x of [-w / 2 + .16, w / 2 - .16]) { box(.23, .29, 1.0, x, 2.56, z, white, overhead); box(.02, .04, .88, x + (x < 0 ? .13 : -.13), 2.46, z, steel, overhead); }
    }
    for (const x of [-w / 2 + .17, w / 2 - .17]) {
      const fan = new THREE.Group(); fan.position.set(x, 2.47, 0); fan.rotation.y = Math.PI / 2; overhead.add(fan);
      const ring = new THREE.Mesh(new THREE.TorusGeometry(.21, .012, 6, 24), steel); fan.add(ring);
      for (let i = 0; i < 6; i++) { const spoke = box(.006, .40, .006, 0, 0, 0, steel, fan); spoke.rotation.z = i * Math.PI / 6; }
    }
  }
  // A small projected patch changes state on teaching interaction without adding
  // fabricated real screen content or implying a connected physical device.
  const projection = new THREE.Group(); projection.visible = false; groups[layout === 'automation' ? 3 : layout === 'road' ? 2 : 1]?.add(projection);
  if (furnished && layout === 'automation') mountedBox(1.65, .76, .012, -.15, 1.68, d / 2 - .13, mat(0x9bc4c6), 'south', projection);
  const selection = new THREE.BoxHelper(new THREE.Object3D(), 0xf17b38); selection.visible = false; scene.add(selection);
  let selected = -1;
  const portals: Portal[] = worldDoors.map((entry, index) => ({ id: `exit-${index}`, label: tr("Ra hành lang", "To the corridor"), x: entry.x, z: entry.z, kind: 'exit' }));
  scene.userData.observedRoomSurvey = { ...RESEARCH_ROOM_SURVEYS[room.id as keyof typeof RESEARCH_ROOM_SURVEYS], openings: architectureOpenings, estimates: true };
  return {
    floor, obstacles, interactables, items, width, depth, start: roomEntry(room).start, portals,
    highlight: (index: number) => { selected = index; selection.visible = furnished && index >= 0 && index < groups.length; if (selection.visible) selection.setFromObject(groups[index]); },
    activate: (index: number) => {
      if (active.has(index)) active.delete(index); else active.add(index);
      screens.forEach(screen => { screen.color.set(active.size ? 0x216d7c : 0x111a20); screen.emissiveIntensity = active.size ? .55 : .025; });
      projection.visible = furnished && layout === 'automation' && active.has(3);
    },
    update: (time: number, dt: number, camera: THREE.Camera, top: boolean) => {
      const settling = architecture.update(camera, top, dt); overhead.visible = furnished && !top;
      for (const entry of wallMounted) entry.material.opacity = THREE.MathUtils.lerp(entry.base, Math.min(entry.base, .10), architecture.walls.find(wall => wall.side === entry.side)?.fade ?? 0);
      const animating = furnished && (room.id === 'E302' ? active.has(0) || active.has(2) : active.has(1));
      moving.forEach((object, index) => {
        if (layout === 'automation') object.rotation.y = animating ? Math.sin(time * .0008) * .7 : 0;
        else if (room.id === 'E302') { object.position.y = .15 + (animating ? .25 + Math.sin(time * .0012 + index) * .06 : 0); object.rotation.y = animating ? Math.sin(time * .0005 + index) * .4 : 0; }
        else object.rotation.y = Math.PI / 4 + (animating ? Math.sin(time * .001) * .5 : 0);
      });
      const net = scene.getObjectByName('flight-arena-net'); if (net) net.visible = furnished && !top;
      if (selected >= 0 && selection.visible) selection.update();
      return settling || animating;
    },
  };
}
