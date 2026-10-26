import { tr } from './locale';
import * as THREE from 'three';
import { roomEntry, roomSize, type Portal, type TourItem, type TourRoom } from './campus-tour-scene';
import type { RoomObstacle } from './room104-scene';
import { createRoomArchitecture, doorOpenings, type RoomOpening } from './room-architecture';

export const isInstalledComputerLab = (id: string) => id === 'E402+E403' || id === 'E602+E603';

// Shared installation, reconstructed from IMG_5027–5039 (October 2026).
// The envelope follows the existing wayfinding plan. Furniture dimensions, five
// rows and 2+3+5 places per row are visual estimates, not a measured inventory.
export const COMPUTER_LAB_SURVEY = {
  source: 'IMG_5027–IMG_5039', rows: 5, bankSeats: [5, 3, 2],
  doorCount: 3, windowBays: 3, columns: 2,
  boardWall: 'west', glazedWall: 'north', facing: '-X',
} as const;

export function createComputerLabRoom(scene: THREE.Scene, room: TourRoom, furnished: boolean) {
  const { width: w, depth: d } = roomSize(room), h = 3.05;
  const obstacles: RoomObstacle[] = [], interactables: THREE.Object3D[] = [];
  const items: TourItem[] = [], groups: THREE.Group[] = [];
  const mat = (color: number, roughness = .72, opacity = 1) => new THREE.MeshStandardMaterial({
    color, roughness, transparent: opacity < 1, opacity, depthWrite: opacity === 1,
  });
  const plaster = mat(0xf1f0e9), charcoal = mat(0x293236), silver = mat(0xaeb5b5, .38);
  const cream = mat(0xe5e4cd), lime = mat(0xa2ca7c), orange = mat(0xe88c56);
  const black = mat(0x172026), white = mat(0xf4f3ed), cable = mat(0x3d535e);
  const timber = document.createElement('canvas'); timber.width = 512; timber.height = 256;
  const tc = timber.getContext('2d')!; tc.fillStyle = '#b99b74'; tc.fillRect(0, 0, 512, 256);
  for (let i = 0; i < 120; i++) {
    tc.strokeStyle = `rgba(75,51,28,${.04 + i % 5 * .012})`; tc.lineWidth = .5 + i % 3 * .25;
    tc.beginPath();
    for (let x = 0; x <= 512; x += 12) { const y = i * 2.2 + Math.sin(x * .024 + i) * 1.3; if (x) tc.lineTo(x, y); else tc.moveTo(x, y); }
    tc.stroke();
  }
  const grain = new THREE.CanvasTexture(timber); grain.colorSpace = THREE.SRGBColorSpace;
  const wood = mat(0xffffff); wood.map = grain;
  const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
  const cylinderGeometry = new THREE.CylinderGeometry(1, 1, 1, 10);
  // Repeated furniture is instanced by material within each selectable bank.
  // This preserves separate interactions while avoiding thousands of draw calls.
  const batches = new Map<THREE.Object3D, Map<THREE.BufferGeometry, Map<THREE.Material, THREE.Matrix4[]>>>();
  const instance = (geometry: THREE.BufferGeometry, material: THREE.Material, parent: THREE.Object3D,
    x: number, y: number, z: number, sx: number, sy: number, sz: number, ry = 0, rz = 0) => {
    let geometries = batches.get(parent); if (!geometries) { geometries = new Map(); batches.set(parent, geometries); }
    let materials = geometries.get(geometry); if (!materials) { materials = new Map(); geometries.set(geometry, materials); }
    let matrices = materials.get(material); if (!matrices) { matrices = []; materials.set(material, matrices); }
    const quaternion = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, ry, rz));
    matrices.push(new THREE.Matrix4().compose(new THREE.Vector3(x, y, z), quaternion, new THREE.Vector3(sx, sy, sz)));
  };
  const ibox = (a: number, b: number, c: number, x: number, y: number, z: number, m: THREE.Material, g: THREE.Object3D, ry = 0, rz = 0) => instance(boxGeometry, m, g, x, y, z, a, b, c, ry, rz);
  const box = (a: number, b: number, c: number, x: number, y: number, z: number, m: THREE.Material, parent: THREE.Object3D = scene) => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(a, b, c), m); mesh.position.set(x, y, z);
    mesh.castShadow = mesh.receiveShadow = true; parent.add(mesh); return mesh;
  };
  const obstacle = (x: number, z: number, width: number, depth: number) => obstacles.push({ x, z, w: width, d: depth });
  const floor = box(w, .12, d, 0, -.06, 0, mat(0xe6e1d5)); floor.userData.walkable = true;
  const grout = mat(0xc5c3b8);
  for (let x = -w / 2 + .6; x < w / 2; x += .6) ibox(.007, .002, d, x, .002, 0, grout, scene);
  for (let z = -d / 2 + .6; z < d / 2; z += .6) ibox(w, .002, .007, 0, .002, z, grout, scene);

  const localDoors = (room.doors ?? [room.door]).map(door => roomEntry({ ...room, door }));
  const architecturalOpenings: RoomOpening[] = doorOpenings(localDoors, w, d);
  const northDoors = architecturalOpenings.filter(opening => opening.side === 'north').sort((a, b) => a.from - b.from);
  if (northDoors.length >= 2) {
    const left = northDoors[0].to + .32, right = northDoors[1].from - .32, middle = (left + right) / 2;
    architecturalOpenings.push(
      { side: 'north', from: left, to: middle - .16, bottom: .83, top: 2.4, kind: 'window' },
      { side: 'north', from: middle + .16, to: right, bottom: .83, top: 2.4, kind: 'window' },
      { side: 'north', from: northDoors[1].to + .32, to: w / 2 - .35, bottom: .83, top: 2.4, kind: 'window' },
    );
  }
  const architecture = createRoomArchitecture(scene, { width: w, depth: d, height: h, openings: architecturalOpenings });
  const openingMetadata = architecture.openings;

  const add = (name: string, x: number, z: number, title: string, description: string, action = tr("Tìm hiểu", "Learn more")) => {
    const index = items.length; items.push({ name, x, z, title, description, action });
    const group = new THREE.Group(); group.name = `survey-station-${index}`; group.userData.station = index;
    group.visible = furnished; scene.add(group); groups.push(group); if (furnished) interactables.push(group); return group;
  };
  const north = add(tr("Dãy máy sát cửa sổ", "Window-side computers"), .1, -2.95, tr("Bàn máy tính · dãy 5 chỗ", "Computer desks: five-place bank"), tr("Dãy bàn gỗ có viền đen, màn hình lưng bạc, bàn phím và chuột. Bố trí các hàng được ước lượng từ ảnh hiện trạng.", "Wood desks with black edging, silver-backed monitors, keyboards and mice. Row placement is estimated from site photos."), tr("Bật / tắt màn hình", "Screen on / off"));
  const middle = add(tr("Dãy máy giữa", "Central computer bank"), .1, 1.1, tr("Bàn máy tính · dãy 3 chỗ", "Computer desks: three-place bank"), tr("Cụm máy giữa phòng, hai bên có lối đi và cột kết cấu. Ghế nhựa màu kem xen xanh lá và cam theo ảnh hiện trạng.", "The central computer bank has aisles and structural columns on either side. Cream chairs are mixed with green and orange chairs as shown in the site photos."), tr("Bật / tắt màn hình", "Screen on / off"));
  const south = add(tr("Dãy máy sát tường", "Wall-side computers"), .1, 4.08, tr("Bàn máy tính · dãy 2 chỗ", "Computer desks: two-place bank"), tr("Cụm bàn hai chỗ bên tường đặc, tất cả màn hình hướng về bảng trắng ở đầu phòng.", "Two-place desk banks beside the solid wall. All screens face the whiteboard at the front of the room."), tr("Bật / tắt màn hình", "Screen on / off"));
  const teacher = add(tr("Bàn giảng viên", "Instructor desk"), -w / 2 + 1, d / 2 - 1.12, tr("Bàn trắng · ghế xoay đen", "White desk and black swivel chair"), tr("Bàn giảng viên ở góc đầu phòng phía tường đặc, có máy tính và ghế xoay tựa lưới.", "An instructor desk in the front corner beside the solid wall, with a computer and a mesh-back swivel chair."), tr("Bật / tắt máy giảng viên", "Instructor screen on / off"));
  const board = add(tr("Bảng & trình chiếu", "Whiteboard and projection"), -w / 2 + .35, 0, tr("Bảng trắng dài · màn chiếu cuốn", "Long whiteboard and roller screen"), tr("Bảng trắng trên tường đầu phòng. Máy chiếu treo trần và hộp màn chiếu cuốn dựng theo ảnh; nút bật chỉ minh họa trình chiếu.", "A whiteboard on the front wall, with a ceiling projector and roller-screen housing rebuilt from the photos. The button shows a sample projection."), tr("Bật / tắt trình chiếu", "Projection on / off"));
  const openings = add(tr("Cửa & cửa sổ", "Doors and windows"), w / 2 - 1, -d / 2 + .5, tr("Ba lối vào · ba cụm cửa sổ", "Three entrances and three window bays"), tr("Hai cửa trên dãy vách kính, một cửa trên tường cuối phòng phía cầu thang. Các khung kính màu sẫm có dải mờ ngang như ảnh hiện trạng.", "Two entrances along the glazed wall and a third on the rear wall beside the stairs. Dark frames and frosted horizontal bands follow the site photos."));
  const equipment = add(tr("Thiết bị trong phòng", "Room equipment"), 0, -.6, tr("Máy chiếu · điều hòa · quạt", "Projector, air conditioners and fans"), tr("Máy chiếu trần, các máy điều hòa treo tường, quạt và đèn LED vuông được tái dựng từ ảnh hiện trạng.", "The ceiling projector, wall air conditioners, fans and square LED lights are rebuilt from the site photos."));
  // A small representative detail makes the glazing/equipment stations pickable,
  // while the architectural wall itself retains its independent cutaway behavior.
  ibox(.16, .23, .035, w / 2 - .9, 1.35, -d / 2 + .075, silver, openings);

  const screens: THREE.MeshStandardMaterial[][] = Array.from({ length: 4 }, () => []);
  const screenMaterial = (bank: number) => { const m = mat(0x101a20, .28); m.emissive.set(0x18778c); m.emissiveIntensity = .025; screens[bank].push(m); return m; };
  const bankScreen = [screenMaterial(0), screenMaterial(1), screenMaterial(2), screenMaterial(3)];
  const monitor = (x: number, z: number, g: THREE.Group, bank: number, teacherMonitor = false) => {
    // Back to +X, viewing surface toward -X, matching every supplied photo.
    ibox(.052, .39, .62, x, 1.10, z, silver, g);
    ibox(.014, .36, .59, x - .032, 1.10, z, black, g);
    ibox(.009, .323, .555, x - .041, 1.108, z, bankScreen[bank], g);
    ibox(.065, .17, .055, x + .035, .87, z, silver, g);
    ibox(.25, .018, .29, x - .035, .785, z, silver, g);
    ibox(.14, .018, .43, x + .29, .786, z - .045, black, g);
    ibox(.027, .025, .058, x + .27, .79, z + .25, black, g);
    // Key rows and a visible cable bundle are geometry, not photo textures.
    for (const dx of [-.04, 0, .04]) ibox(.012, .003, .36, x + .29 + dx, .797, z - .045, silver, g);
    ibox(.018, .085, .02, x + .07, .81, z + .05, cable, g, 0, -.36);
    if (teacherMonitor) ibox(.22, .47, .13, x + .1, .4, z + .56, charcoal, g);
  };
  const roundedRectangle = (width: number, height: number, radius: number) => {
    const s = new THREE.Shape(), x = -width / 2, y = -height / 2;
    s.moveTo(x + radius, y); s.lineTo(x + width - radius, y); s.quadraticCurveTo(x + width, y, x + width, y + radius);
    s.lineTo(x + width, y + height - radius); s.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    s.lineTo(x + radius, y + height); s.quadraticCurveTo(x, y + height, x, y + height - radius);
    s.lineTo(x, y + radius); s.quadraticCurveTo(x, y, x + radius, y); return s;
  };
  const backShape = roundedRectangle(.48, .31, .045), slot = new THREE.Path();
  slot.moveTo(-.085, .065); slot.lineTo(-.085, .105); slot.lineTo(.085, .105); slot.lineTo(.085, .065); slot.closePath(); backShape.holes.push(slot);
  const chairBack = new THREE.ExtrudeGeometry(backShape, { depth: .035, bevelEnabled: false, curveSegments: 4 });
  chairBack.rotateY(Math.PI / 2);
  const chair = (x: number, z: number, g: THREE.Group, color: THREE.Material) => {
    ibox(.43, .055, .47, x, .45, z, color, g);
    instance(chairBack, color, g, x + .20, .69, z, 1, 1, 1);
    for (const dz of [-.19, .19]) {
      ibox(.032, .68, .032, x + .19, .36, z + dz, charcoal, g);
      ibox(.032, .39, .032, x - .16, .23, z + dz, charcoal, g);
      ibox(.49, .03, .035, x + .015, .035, z + dz, charcoal, g);
    }
    obstacle(x, z, .48, .49);
  };
  const seatPitch = .68, rowPitch = 2.05, firstRow = -w / 2 + 2.62;
  // The glazing-side aisle must also clear the .24 m avatar margin at both
  // northern door spawns. Row gaps let visitors bypass the two aisle columns.
  const bankCenters = [-d / 2 + 2.82, -d / 2 + 6.64, -d / 2 + 9.57];
  if (furnished) {
    [north, middle, south].forEach((group, bank) => {
      const count = COMPUTER_LAB_SURVEY.bankSeats[bank], width = count * seatPitch, center = bankCenters[bank];
      for (let row = 0; row < COMPUTER_LAB_SURVEY.rows; row++) {
        const x = firstRow + row * rowPitch;
        ibox(.68, .045, width, x, .755, center, wood, group);
        ibox(.04, .72, width, x - .30, .37, center, wood, group);
        obstacle(x, center, .70, width);
        for (let seat = 0; seat < count; seat++) {
          const z = center + (seat - (count - 1) / 2) * seatPitch;
          // Shared oak side panels and raised black cable edges between stations.
          ibox(.67, .72, .025, x, .37, z - seatPitch / 2, wood, group);
          ibox(.67, .045, .025, x, .80, z - seatPitch / 2, charcoal, group);
          ibox(.025, .045, seatPitch, x - .31, .80, z, charcoal, group);
          monitor(x - .12, z, group, bank);
          const color = (row + seat + bank) % 8 === 2 ? lime : (row + seat + bank) % 7 === 4 ? orange : cream;
          chair(x + .69, z, group, color);
        }
        ibox(.67, .72, .025, x, .37, center + width / 2, wood, group);
      }
    });
    const tx = -w / 2 + 1.15, tz = d / 2 - 1.17;
    ibox(.68, .045, 1.40, tx, .755, tz, white, teacher);
    for (const dz of [-.65, .65]) ibox(.63, .72, .045, tx, .37, tz + dz, white, teacher);
    ibox(.045, .65, 1.3, tx - .27, .38, tz, charcoal, teacher);
    monitor(tx - .10, tz, teacher, 3, true); obstacle(tx, tz, .70, 1.44);
    const cx = tx - .78;
    ibox(.46, .07, .48, cx, .46, tz, black, teacher);
    ibox(.055, .63, .48, cx - .20, .79, tz, charcoal, teacher);
    for (const dz of [-.27, .27]) { ibox(.34, .04, .035, cx, .67, tz + dz, black, teacher); ibox(.035, .2, .035, cx, .57, tz + dz, silver, teacher); }
    instance(cylinderGeometry, silver, teacher, cx, .23, tz, .035, .4, .035);
    for (let i = 0; i < 5; i++) {
      const angle = i * Math.PI * .4, dx = Math.sin(angle), dz = Math.cos(angle);
      ibox(.035, .035, .3, cx + dx * .13, .07, tz + dz * .13, charcoal, teacher, angle);
      ibox(.07, .055, .055, cx + dx * .27, .035, tz + dz * .27, black, teacher);
    }
    obstacle(cx, tz, .58, .64);
    ibox(.075, 1.22, d * .62, -w / 2 + .10, 1.65, 0, charcoal, board);
    ibox(.018, 1.14, d * .62 - .09, -w / 2 + .15, 1.65, 0, white, board);
    ibox(.16, .035, d * .62, -w / 2 + .19, 1.04, 0, silver, board);
    ibox(.17, .13, d * .66, -w / 2 + .15, 2.52, 0, cream, board);
    ibox(.015, .08, .4, -w / 2 + .24, 1.08, .4, charcoal, board);
  }
  const projected = new THREE.Group(); board.add(projected); projected.visible = false;
  if (furnished) {
    ibox(.02, 1.35, 2.45, -w / 2 + .205, 1.73, -.4, mat(0xe7f1ed), projected);
    const projectedInk = mat(0x218a9a); projectedInk.emissive.set(0x167e8c); projectedInk.emissiveIntensity = .35;
    for (let i = 0; i < 4; i++) ibox(.012, .055, 1.4 - i * .18, -w / 2 + .225, 2.07 - i * .22, -.5, projectedInk, projected);
  }

  // Structure remains present when furniture is hidden, including its collision.
  const columns = new THREE.Group(); columns.name = 'survey-structural-columns'; scene.add(columns);
  const columnX = -.56, columnZ = [(bankCenters[0] + 5 * seatPitch / 2 + bankCenters[1] - 3 * seatPitch / 2) / 2,
    (bankCenters[1] + 3 * seatPitch / 2 + bankCenters[2] - 2 * seatPitch / 2) / 2];
  for (const z of columnZ) {
    box(.44, h, .44, columnX, h / 2, z, plaster, columns); obstacle(columnX, z, .44, .44);
    box(.46, .08, .46, columnX, .04, z, silver, columns);
  }
  const overhead = new THREE.Group(); overhead.name = 'survey-ceiling-equipment'; overhead.visible = furnished; scene.add(overhead);
  const ceilingMetal = mat(0x9ea6a1, .65, .35), led = mat(0xf9f8df); led.emissive.set(0xfff4d2); led.emissiveIntensity = .65;
  if (furnished) {
    for (let x = -w / 2 + 1.3; x < w / 2 - .6; x += 2.1) for (let z = -d / 2 + 1.2; z < d / 2 - .6; z += 2.05) {
      ibox(.65, .026, .65, x, h - .07, z, silver, overhead);
      ibox(.59, .016, .59, x, h - .09, z, led, overhead);
    }
    // Sparse ceiling grid communicates the suspended panels without adding a roof.
    for (let x = -w / 2 + 1.2; x < w / 2; x += 1.2) ibox(.008, .008, d, x, h, 0, ceilingMetal, overhead);
    for (let z = -d / 2 + 1.2; z < d / 2; z += 1.2) ibox(w, .008, .008, 0, h, z, ceilingMetal, overhead);
    const px = -w / 2 + 4.2;
    ibox(.045, .30, .045, px, 2.86, .1, silver, equipment);
    ibox(.34, .13, .27, px, 2.67, .1, white, equipment);
    ibox(.02, .075, .075, px - .18, 2.66, .1, black, equipment);
    const ac = (x: number, z: number, vertical: boolean) => {
      ibox(vertical ? .23 : 1.05, .30, vertical ? 1.05 : .23, x, 2.58, z, white, overhead);
      ibox(vertical ? .025 : .93, .05, vertical ? .93 : .025, x - (vertical ? .13 : 0), 2.49, z + (vertical ? 0 : .13), silver, overhead);
    };
    ac(-1.6, -d / 2 + .18, false); ac(4.2, -d / 2 + .18, false);
    ac(w / 2 - .18, -3.0, true); ac(w / 2 - .18, 2.5, true);
    // Round wall fan, mounted on the solid rear wall as seen in IMG_5039.
    const fan = new THREE.Group(); fan.position.set(w / 2 - .22, 2.42, d / 2 - 1.2); fan.rotation.y = Math.PI / 2; overhead.add(fan);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(.23, .014, 6, 28), silver); fan.add(ring);
    for (let i = 0; i < 8; i++) ibox(.008, .45, .008, 0, 0, 0, silver, fan, 0, i * Math.PI / 8);
    for (let i = 0; i < 3; i++) ibox(.055, .18, .025, Math.sin(i * Math.PI * 2 / 3) * .09, Math.cos(i * Math.PI * 2 / 3) * .09, .02, white, fan, 0, -i * Math.PI * 2 / 3);
    instance(cylinderGeometry, charcoal, fan, 0, 0, .035, .045, .04, .045);
    for (const x of [-w / 2 + .25, w / 2 - .25]) for (const z of [-d / 2 + .25, d / 2 - .25]) {
      ibox(.13, .16, .12, x, 2.67, z, white, overhead); ibox(.09, .07, .09, x, 2.60, z, black, overhead);
    }
  }
  for (const [parent, geometries] of batches) for (const [geometry, materials] of geometries) for (const [material, matrices] of materials) {
    const mesh = new THREE.InstancedMesh(geometry, material, matrices.length);
    matrices.forEach((matrix, i) => mesh.setMatrixAt(i, matrix)); mesh.instanceMatrix.needsUpdate = true;
    mesh.castShadow = mesh.receiveShadow = true; mesh.computeBoundingBox(); mesh.computeBoundingSphere(); parent.add(mesh);
  }
  // Ceiling fixtures are a contextual overlay in the roofless tour. Their faint
  // materials and disabled shadows keep screens readable from the orbit camera.
  const overheadMaterials = new Map<THREE.Material, THREE.Material>();
  overhead.traverse(object => {
    if (!(object instanceof THREE.Mesh)) return;
    const original = object.material as THREE.MeshStandardMaterial;
    let faded = overheadMaterials.get(original);
    if (!faded) {
      const material = original.clone(); material.transparent = true;
      material.opacity = Math.min(original.opacity, .22); material.depthWrite = false;
      material.emissiveIntensity = Math.min(material.emissiveIntensity, .24);
      overheadMaterials.set(original, material); faded = material;
    }
    object.material = faded; object.castShadow = object.receiveShadow = false;
  });
  const boardMaterials = new Map<THREE.Material, { material: THREE.MeshStandardMaterial; opacity: number }>();
  board.traverse(object => {
    if (!(object instanceof THREE.Mesh)) return;
    const original = object.material as THREE.MeshStandardMaterial;
    let entry = boardMaterials.get(original);
    if (!entry) { const material = original.clone(); material.transparent = true; material.depthWrite = false; entry = { material, opacity: original.opacity }; boardMaterials.set(original, entry); }
    object.material = entry.material; object.castShadow = false;
  });
  const selection = new THREE.BoxHelper(new THREE.Object3D(), 0xf47d37); selection.visible = false; scene.add(selection);
  let selected = -1; const enabled = [false, false, false, false];
  const portals: Portal[] = localDoors.map((entry, i) => ({ id: `exit-${i}`, label: tr("Ra hành lang", "To the corridor"), x: entry.x, z: entry.z, kind: 'exit' }));
  scene.userData.computerLabSurvey = { ...COMPUTER_LAB_SURVEY, openings: openingMetadata, columnCenters: columnZ.map(z => ({ x: columnX, z })), estimatedStudentPlaces: 50 };
  return {
    floor, obstacles, interactables, items, width: w, depth: d, start: roomEntry(room).start, portals,
    highlight: (i: number) => { selected = i; selection.visible = furnished && i >= 0 && i < groups.length; if (selection.visible) selection.setFromObject(groups[i]); },
    activate: (i: number) => {
      if (i >= 0 && i < 4) { enabled[i] = !enabled[i]; screens[i].forEach(m => { m.color.set(enabled[i] ? 0x23798b : 0x101a20); m.emissiveIntensity = enabled[i] ? .65 : .025; }); }
      if (i === 4) projected.visible = !projected.visible;
    },
    update: (_time: number, dt: number, camera: THREE.Camera, top: boolean) => {
      overhead.visible = furnished && !top; equipment.visible = furnished && !top;
      let settling = architecture.update(camera, top, dt);
      boardMaterials.forEach(({ material, opacity }) => {
        const target = camera.position.x < -w / 2 ? Math.min(opacity, .12) : opacity;
        material.opacity = THREE.MathUtils.damp(material.opacity, target, 11, dt);
        if (Math.abs(material.opacity - target) > .001) settling = true;
      });
      // Keep columns legible in plan while leaving the desks visible behind them.
      columns.scale.y = top ? .20 : 1;
      if (selected >= 0 && selection.visible) selection.update();
      return settling;
    },
  };
}
