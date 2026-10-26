import { tr } from './locale';
import * as THREE from 'three';
import { roomEntry, roomSize, type Portal, type TourItem, type TourRoom } from './campus-tour-scene';
import type { RoomObstacle } from './room104-scene';
import { createRoomArchitecture, doorOpenings, type RoomOpening } from './room-architecture';

export const isObservedStudyRoom = (id: string) => id === 'E201' || id === 'E202';

// Reconstructed from IMG_5102–5107 (E201), IMG_5084–5100 (E202).
// Furniture sizes and seating are visual estimates; the envelope follows the
// simplified wayfinding plan, rather than constituting a measured survey.
export function createObservedStudyRoom(scene: THREE.Scene, room: TourRoom, furnished: boolean) {
  const { width: w, depth: d } = roomSize(room), h = 3.0, is201 = room.id === 'E201';
  const obstacles: RoomObstacle[] = [], interactables: THREE.Object3D[] = [];
  const items: TourItem[] = [], groups: THREE.Group[] = [];
  const mat = (color: number, roughness = .72) => new THREE.MeshStandardMaterial({ color, roughness });
  const white = mat(0xf0f0e8), black = mat(0x252c2f, .52), steel = mat(0x929c9e, .38);
  const cream = mat(0xe8e4d1), lime = mat(0xa4ca81), orange = mat(0xe89059);
  const walnut = mat(0x674634, .46), darkTop = mat(0x393832, .22), oak = mat(0xa8805e);
  const timber = document.createElement('canvas'); timber.width = 512; timber.height = 256;
  const ctx = timber.getContext('2d')!; ctx.fillStyle = '#a78362'; ctx.fillRect(0, 0, 512, 256);
  for (let i = 0; i < 112; i++) {
    ctx.beginPath(); ctx.strokeStyle = `rgba(67,42,25,${.05 + i % 4 * .012})`; ctx.lineWidth = .6;
    for (let x = 0; x <= 512; x += 12) { const y = i * 2.3 + Math.sin(x * .02 + i) * 1.8; if (x) ctx.lineTo(x, y); else ctx.moveTo(x, y); }
    ctx.stroke();
  }
  const texture = new THREE.CanvasTexture(timber); texture.colorSpace = THREE.SRGBColorSpace; oak.map = texture;
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const box = (a: number, b: number, c: number, x: number, y: number, z: number, material: THREE.Material, parent: THREE.Object3D = scene) => {
    const mesh = new THREE.Mesh(geometry, material); mesh.scale.set(a, b, c); mesh.position.set(x, y, z);
    mesh.castShadow = mesh.receiveShadow = true; parent.add(mesh); return mesh;
  };
  const rod = (a: THREE.Vector3, b: THREE.Vector3, radius: number, material: THREE.Material, parent: THREE.Object3D) => {
    const delta = b.clone().sub(a), mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, delta.length(), 8), material);
    mesh.position.copy(a).add(b).multiplyScalar(.5); mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), delta.normalize()); parent.add(mesh); return mesh;
  };
  const obstacle = (x: number, z: number, a: number, c: number) => obstacles.push({ x, z, w: a, d: c });
  const floor = box(w, .12, d, 0, -.06, 0, mat(0xe0ddd1)); floor.userData.walkable = true;
  const grout = mat(0xbdbdb4);
  for (let x = -w / 2 + .6; x < w / 2; x += .6) box(.006, .002, d, x, .002, 0, grout);
  for (let z = -d / 2 + .6; z < d / 2; z += .6) box(w, .002, .006, 0, .002, z, grout);
  const entries = (room.doors ?? [room.door]).map(door => roomEntry({ ...room, door }));
  const openings: RoomOpening[] = doorOpenings(entries, w, d);
  if (is201) {
    for (const [from, to] of [[-4.82, -2.92], [-.72, 1.28], [2.22, 4.34]]) openings.push({ side: 'east', from, to, bottom: .32, top: 2.47, kind: 'window' });
  } else {
    const northDoor = entries.find(entry => Math.abs(entry.z + d / 2) < .1);
    const center = northDoor?.x ?? .38;
    openings.push({ side: 'north', from: -w / 2 + .4, to: center - .9, bottom: .86, top: 2.43, kind: 'window' },
      { side: 'north', from: center + .9, to: w / 2 - .4, bottom: .86, top: 2.43, kind: 'window' });
  }
  const architecture = createRoomArchitecture(scene, { width: w, depth: d, height: h, openings, namePrefix: `observed-${room.id}` });
  const add = (name: string, x: number, z: number, description: string, action = tr("Tìm hiểu", "Learn more")) => {
    const index = items.length; items.push({ name, x, z, title: name, description, action });
    const group = new THREE.Group(); group.name = `${room.id}-station-${index}`; group.userData.station = index;
    group.visible = furnished; scene.add(group); groups.push(group); if (furnished) interactables.push(group); return group;
  };
  const table = (x: number, z: number, a: number, c: number, parent: THREE.Object3D, finish: THREE.Material = oak, panel = false) => {
    box(a, .055, c, x, .755, z, finish, parent);
    if (panel) {
      for (const dx of [-a / 2 + .06, a / 2 - .06]) box(.055, .72, c - .12, x + dx, .37, z, walnut, parent);
      box(a - .1, .52, .045, x, .44, z, walnut, parent);
    } else {
      for (const dx of [-a / 2 + .10, a / 2 - .10]) {
        box(.055, .71, .055, x + dx, .37, z, black, parent);
        box(.08, .045, c - .05, x + dx, .045, z, black, parent);
      }
      box(a - .15, .055, .055, x, .24, z, black, parent);
    }
    obstacle(x, z, a, c);
  };
  const chair = (x: number, z: number, rotation: number, parent: THREE.Object3D, color: THREE.Material = cream, office = false) => {
    // The backrest is at local +Z, so an unrotated chair faces -Z.
    const group = new THREE.Group(); group.position.set(x, 0, z); group.rotation.y = rotation; parent.add(group);
    box(.44, .065, .43, 0, .46, 0, office ? black : color, group);
    box(.46, office ? .48 : .30, .045, 0, office ? .76 : .68, .20, office ? black : color, group);
    if (!office) {
      // Slot in the classroom-chair back is expressed by the surrounding frame.
      box(.15, .045, .012, 0, .76, .228, mat(0xc2c2b8), group);
    }
    for (const dx of [-.18, .18]) {
      box(.03, .67, .03, dx, .35, .19, office ? steel : black, group);
      box(.03, .40, .03, dx, .23, -.15, office ? steel : black, group);
      box(.03, .035, .48, dx, .04, .015, office ? steel : black, group);
      if (office) { box(.035, .04, .35, dx * 1.3, .67, .015, black, group); box(.025, .2, .025, dx * 1.3, .57, .10, steel, group); }
    }
    obstacle(x, z, .49, .50);
  };
  const monitorMaterials: THREE.MeshStandardMaterial[] = [];
  const monitor = (x: number, z: number, parent: THREE.Object3D, rotation = 0) => {
    const group = new THREE.Group(); group.position.set(x, 0, z); group.rotation.y = rotation; parent.add(group);
    const screen = mat(0x142127, .28); screen.emissive.set(0x176c82); screen.emissiveIntensity = .03; monitorMaterials.push(screen);
    box(.59, .36, .045, 0, 1.10, 0, black, group); box(.54, .31, .009, 0, 1.10, .029, screen, group);
    box(.045, .22, .055, 0, .86, -.01, steel, group); box(.24, .018, .17, 0, .79, .01, steel, group);
    box(.38, .016, .13, 0, .792, .24, black, group); box(.05, .025, .08, .28, .80, .24, black, group);
    const arm = box(.045, .04, .30, .04, 1.01, -.17, black, group); arm.rotation.x = -.35;
    box(.026, .30, .026, .04, .89, -.29, steel, group);
  };
  const board = (x: number, z: number, width: number, parent: THREE.Object3D, south = false) => {
    box(width, 1.18, .075, x, 1.65, z, black, parent);
    box(width - .08, 1.10, .018, x, 1.65, z + (south ? -.05 : .05), white, parent);
    box(width, .035, .16, x, 1.06, z + (south ? -.08 : .08), steel, parent);
    box(width * .82, .10, .13, x, 2.49, z + (south ? -.05 : .05), cream, parent);
  };
  let projectorGroup: THREE.Group | undefined;
  let deskIndex = -1, boardIndex = -1;
  const overhead = new THREE.Group(); overhead.name = `${room.id}-overhead`; overhead.visible = furnished; scene.add(overhead);
  const ceilingMat = new THREE.MeshStandardMaterial({ color: 0xf6f4e7, transparent: true, opacity: .18, depthWrite: false, roughness: .8 });
  const blinds = new THREE.Group(); blinds.name = `${room.id}-vertical-blinds`; scene.add(blinds);
  if (is201) {
    // One column is visible between the meeting and teaching zones in 5102/5107.
    box(.42, h, .42, -.03, h / 2, .08, white); obstacle(-.03, .08, .42, .42);
    const blindMat = new THREE.MeshStandardMaterial({ color: 0x899193, transparent: true, opacity: .37, depthWrite: false });
    for (const aperture of openings.filter(opening => opening.kind === 'window')) {
      for (let z = aperture.from + .06; z < aperture.to; z += .14) {
        const slat = box(.12, 2.08, .075, w / 2 - .09, 1.43, z, blindMat, blinds); slat.castShadow = false;
      }
      box(.13, .05, aperture.to - aperture.from + .08, w / 2 - .08, 2.51, (aperture.from + aperture.to) / 2, steel, blinds);
    }
    const meeting = add(tr("Khu tiếp khách & trao đổi", "Reception and discussion area"), .1, -3.1, tr("Bàn họp mặt tối, ghế lưới đen và bàn làm việc gỗ sẫm ở đầu phòng, đối chiếu ảnh 5102–5104.", "A dark-top meeting table, black mesh chairs and a dark wood desk at the front, based on photos 5102-5104."));
    const teaching = add(tr("Cụm bàn học chữ U", "U-shaped study tables"), .25, 2.0, tr("Các bàn gỗ khung thép ghép thành cụm, ghế kem xen cam và xanh lá; hướng và số chỗ dựng theo ảnh 5105–5107.", "Wood tables with steel frames form a group, with cream, orange and green chairs. Orientation and seating are estimated from photos 5105-5107."));
    deskIndex = items.length; const work = add(tr("Bàn máy tính", "Computer desk"), .15, d / 2 - .8, tr("Bàn trắng và màn hình trên tay đỡ ở cuối phòng, cạnh tủ cao trắng.", "A white desk with an arm-mounted monitor at the far end, beside a tall white cabinet."), tr("Bật / tắt máy tính", "Computer on / off"));
    boardIndex = items.length; const writing = add(tr("Bảng trắng & màn cuốn", "Whiteboard and roller screen"), 0, -d / 2 + .35, tr("Bảng trắng lớn ở đầu phòng; hộp màn chiếu cuốn ở phía trên theo ảnh 5103.", "A large whiteboard at the front with a roller-screen housing above, as shown in photo 5103."), tr("Bật / tắt trình chiếu", "Projection on / off"));
    const literature = add(tr("Giá tài liệu & bàn đứng", "Brochure rack and standing table"), .5, .35, tr("Giá gấp kim loại nhiều khay gần cột; bàn đứng tròn và cần đỡ đặt ở hốc tường cạnh cửa.", "A folding metal brochure rack near the column, with a round standing table and support arm in the wall recess beside the entrance."));
    if (furnished) {
      table(.42, -3.45, 1.13, 1.93, meeting, darkTop, true);
      for (const z of [-3.96, -2.96]) { chair(-.52, z, -Math.PI / 2, meeting, black, true); chair(1.35, z, Math.PI / 2, meeting, black, true); }
      table(-w / 2 + .45, -3.5, .58, 1.85, meeting, darkTop, true); chair(-w / 2 + .45, -4.77, Math.PI, meeting, black, true);
      table(.18, 1.22, 1.86, .55, teaching); table(.18, 2.85, 1.86, .55, teaching);
      table(1.42, 2.03, .55, 2.18, teaching);
      for (const [index, x] of [-.52, .18, .88].entries()) {
        chair(x, 1.84, 0, teaching, [orange, cream, lime][index]);
        chair(x, 3.47, 0, teaching, [cream, orange, cream][index]);
      }
      table(.18, d / 2 - .55, 1.78, .60, work, white); monitor(.18, d / 2 - .68, work, Math.PI); chair(.18, d / 2 - 1.25, Math.PI, work, black, true);
      box(.69, 2.6, .61, w / 2 - .39, 1.3, d / 2 - .36, white, work); obstacle(w / 2 - .39, d / 2 - .36, .69, .61);
      box(.025, 2.5, .025, w / 2 - .39, 1.29, d / 2 - .043, steel, work); box(.025, .16, .028, w / 2 - .5, 1.29, d / 2 - .02, black, work);
      board(0, -d / 2 + .08, w - .65, writing);
      const rackX = .60, rackZ = .35;
      for (const x of [rackX - .22, rackX + .22]) {
        rod(new THREE.Vector3(x, .02, rackZ - .22), new THREE.Vector3(x, 1.50, rackZ + .10), .014, steel, literature);
        rod(new THREE.Vector3(x, .02, rackZ + .22), new THREE.Vector3(x, 1.50, rackZ - .10), .014, steel, literature);
      }
      for (let i = 0; i < 4; i++) {
        const tray = box(.48, .025, .28, rackX, .25 + i * .38, rackZ, steel, literature); tray.rotation.x = -.35;
        const paper = box(.39, .27, .012, rackX, .35 + i * .38, rackZ + .07, i % 2 ? walnut : white, literature); paper.rotation.x = -.35;
      }
      obstacle(rackX, rackZ, .50, .49);
      const standX = -w / 2 + .48, standZ = -1.55;
      const top = new THREE.Mesh(new THREE.CylinderGeometry(.34, .34, .035, 32), darkTop); top.position.set(standX, 1.08, standZ); literature.add(top);
      rod(new THREE.Vector3(standX, .06, standZ), new THREE.Vector3(standX, 1.06, standZ), .045, steel, literature);
      box(.50, .035, .46, standX, .035, standZ, steel, literature); obstacle(standX, standZ, .66, .66);
      rod(new THREE.Vector3(standX - .25, 1.08, standZ), new THREE.Vector3(standX, 1.48, standZ), .014, black, literature);
    }
  } else {
    const benches = add(tr("Bàn nghiên cứu có vách kính", "Partitioned research desks"), 0, -3.65, tr("Hai bàn trắng có vách kính mờ xanh nhạt, ghế lưới đen; kệ thấp nâu và khoang tủ trắng ở đầu cụm theo ảnh 5084–5088.", "Two white desks with pale green frosted dividers and black mesh chairs. Low brown shelves and white storage units sit at the ends, based on photos 5084-5088."));
    const meeting = add(tr("Bàn trao đổi nhóm", "Group discussion table"), 0, -.15, tr("Bàn chữ nhật mặt gỗ, các ghế nhựa kem và xanh lá ở khu giữa phòng.", "A rectangular wood-top table with cream and green plastic chairs in the middle of the room."));
    const conference = add(tr("Bàn họp & ghế bọc đệm", "Meeting table and padded chairs"), -.10, 2.9, tr("Bàn họp lớn mặt tối và ghế đen tay gỗ tại khu cuối phòng, đối chiếu ảnh 5094–5099.", "A large dark-top meeting table with black chairs and wood armrests at the far end, based on photos 5094-5099."));
    deskIndex = items.length; const work = add(tr("Bàn máy tính & tủ hồ sơ", "Computer desk and storage cabinet"), w / 2 - .65, 3.8, tr("Bàn trắng có màn hình trên tay đỡ và các ghế văn phòng; tủ hồ sơ gỗ sẫm cao cạnh bảng.", "A white desk with arm-mounted monitors and office chairs. A tall dark wood cabinet stands beside the whiteboard."), tr("Bật / tắt máy tính", "Computer on / off"));
    boardIndex = items.length; const writing = add(tr("Bảng trắng & máy chiếu", "Whiteboard and projector"), -.8, d / 2 - .35, tr("Bảng trắng khung đen, màn chiếu cuốn và máy chiếu trần ở đầu khu họp.", "A black-framed whiteboard, roller screen and ceiling projector at the front of the meeting area."), tr("Bật / tắt trình chiếu", "Projection on / off"));
    const sideboard = add(tr("Bàn dài sát tường", "Wall-side console tables"), w / 2 - .45, 1.6, tr("Bàn gỗ dài sát tường phía cửa bên, giữ lối đi từ hai cửa vào khu trao đổi.", "Long wood console tables along the side-entrance wall, with clear aisles from both entrances to the discussion area."));
    if (furnished) {
      const mint = new THREE.MeshStandardMaterial({ color: 0xb8d5d1, roughness: .38, transparent: true, opacity: .76, depthWrite: false });
      for (const side of [-1, 1]) {
        const x = side * 1.75;
        table(x, -3.78, .75, 2.14, benches, white);
        box(.035, .76, 2.02, x, 1.14, -3.78, mint, benches);
        for (const z of [-4.76, -2.80]) box(.06, 1.5, .055, x, .76, z, white, benches);
        box(.055, .045, 2.10, x, 1.53, -3.78, white, benches);
        for (const z of [-4.24, -3.34]) chair(x + side * .65, z, side > 0 ? Math.PI / 2 : -Math.PI / 2, benches, black, true);
        box(.47, 1.72, .42, x, .86, -2.56, white, benches); obstacle(x, -2.56, .47, .42);
        const shelfX = x + side * .54;
        for (const y of [.10, .44, .76]) box(.95, .035, .42, shelfX, y, -2.48, oak, benches);
        for (const dx of [-.46, .46]) box(.03, .69, .42, shelfX + dx, .43, -2.48, oak, benches);
        box(.95, .69, .025, shelfX, .43, -2.70, oak, benches); obstacle(shelfX, -2.48, .95, .44);
      }
      table(0, -.10, 2.03, 1.00, meeting, oak, true);
      for (const [index, x] of [-.67, 0, .67].entries()) { chair(x, -.94, Math.PI, meeting, index % 2 ? cream : lime); chair(x, .75, 0, meeting, cream); }
      table(-.16, 3.15, 1.30, 2.65, conference, darkTop, true);
      for (const z of [2.40, 3.75]) { chair(-1.20, z, -Math.PI / 2, conference, black, true); chair(.89, z, Math.PI / 2, conference, black, true); }
      chair(-.16, 4.93, 0, conference, black, true);
      table(w / 2 - .58, 3.50, .66, 1.78, work, white);
      monitor(w / 2 - .58, 3.18, work, -Math.PI / 2); monitor(w / 2 - .58, 3.96, work, -Math.PI / 2);
      chair(w / 2 - 1.30, 3.25, -Math.PI / 2, work, black, true); chair(w / 2 - 1.30, 4.03, -Math.PI / 2, work, black, true);
      box(1.22, 2.25, .56, w / 2 - .70, 1.125, d / 2 - .30, walnut, work); obstacle(w / 2 - .70, d / 2 - .30, 1.22, .56);
      for (const dx of [-.31, .31]) { box(.025, .30, .025, w / 2 - .70 + dx, 1.34, d / 2 - .005, steel, work); box(.015, 2.15, .015, w / 2 - .70, 1.12, d / 2 - .01, black, work); }
      board(-.9, d / 2 - .08, w * .50, writing, true);
      table(w / 2 - .29, 1.25, .45, 1.95, sideboard, darkTop, true);
      table(-w / 2 + .28, 3.78, .44, 2.6, sideboard, darkTop, true);
      projectorGroup = new THREE.Group(); writing.add(projectorGroup); projectorGroup.visible = false;
      const projectedMat = mat(0xe0eeeb); projectedMat.emissive.set(0x1c7580); projectedMat.emissiveIntensity = .15;
      box(2.25, 1.22, .02, -.9, 1.76, d / 2 - .15, projectedMat, projectorGroup);
      for (let i = 0; i < 4; i++) box(1.3 - i * .16, .035, .012, -.9, 2.08 - i * .21, d / 2 - .17, mat(0x238398), projectorGroup);
    }
  }
  if (is201 && furnished) {
    projectorGroup = new THREE.Group(); groups[boardIndex].add(projectorGroup); projectorGroup.visible = false;
    box(2.0, 1.16, .02, 0, 1.72, -d / 2 + .15, mat(0xe5efeb), projectorGroup);
    for (let i = 0; i < 3; i++) box(1.3 - i * .18, .045, .012, 0, 2.01 - i * .23, -d / 2 + .17, mat(0x258493), projectorGroup);
  }
  if (furnished) {
    for (let x = -w / 2 + .8; x < w / 2; x += 1.8) for (let z = -d / 2 + .9; z < d / 2; z += 1.8) {
      const light = box(.57, .025, .57, x, 2.92, z, ceilingMat, overhead); light.castShadow = light.receiveShadow = false;
    }
    const equipmentMat = new THREE.MeshStandardMaterial({ color: 0xe5e5dc, transparent: true, opacity: .35, depthWrite: false });
    if (is201) {
      for (const z of [-1.9, 1.7]) box(.23, .30, 1.0, w / 2 - .17, 2.57, z, equipmentMat, overhead);
    } else {
      for (const z of [-3.5, 2.5]) box(.23, .30, 1.0, -w / 2 + .17, 2.57, z, equipmentMat, overhead);
      box(.33, .13, .26, -.8, 2.67, 1.3, equipmentMat, overhead); box(.035, .24, .035, -.8, 2.85, 1.3, steel, overhead);
    }
    for (const side of [-1, 1]) {
      const fan = new THREE.Mesh(new THREE.TorusGeometry(.21, .012, 6, 24), steel); fan.position.set(side * (w / 2 - .15), 2.42, is201 ? d / 2 - .5 : -d / 2 + 1.0); fan.rotation.y = Math.PI / 2; overhead.add(fan);
      for (let i = 0; i < 7; i++) { const bar = box(.008, .40, .008, 0, 0, 0, steel, fan); bar.rotation.z = i * Math.PI / 7; }
    }
    overhead.traverse(object => { if (object instanceof THREE.Mesh) object.castShadow = object.receiveShadow = false; });
  }
  // Wall-mounted fittings follow the shared wall fade, using local material
  // copies so furniture which shares a colour or finish remains opaque.
  const fadingMaterials = (group: THREE.Object3D) => {
    const copies = new Map<THREE.Material, { material: THREE.Material; base: number }>();
    group.traverse(object => {
      if (!(object instanceof THREE.Mesh)) return;
      const clone = (original: THREE.Material) => {
        let entry = copies.get(original);
        if (!entry) {
          const material = original.clone(); material.transparent = true; material.depthWrite = false; material.forceSinglePass = true;
          entry = { material, base: original.opacity }; copies.set(original, entry);
        }
        return entry.material;
      };
      object.material = Array.isArray(object.material) ? object.material.map(clone) : clone(object.material);
      object.renderOrder = 8; object.castShadow = false;
    });
    return [...copies.values()];
  };
  const boardMaterials = fadingMaterials(groups[boardIndex]), blindMaterials = fadingMaterials(blinds);
  const boardWall = architecture.walls.find(wall => wall.side === (is201 ? 'north' : 'south'));
  const blindWall = architecture.walls.find(wall => wall.side === 'east');
  const selection = new THREE.BoxHelper(new THREE.Object3D(), 0xec792f); selection.visible = false; scene.add(selection);
  let selected = -1, computerOn = false;
  const portals: Portal[] = entries.map((entry, index) => ({ id: `exit-${index}`, label: tr("Ra hành lang", "To the corridor"), x: entry.x, z: entry.z, kind: 'exit' }));
  scene.userData.observedRoomSurvey = { room: room.id, source: is201 ? 'IMG_5102–5107' : 'IMG_5084–5100', estimated: true,
    openings, fixedColumns: is201 ? [{ x: -.03, z: .08 }] : [] };
  return {
    floor, obstacles, interactables, items, width: w, depth: d, start: roomEntry(room).start, portals,
    highlight: (index: number) => { selected = index; selection.visible = furnished && index >= 0 && index < groups.length; if (selection.visible) selection.setFromObject(groups[index]); },
    activate: (index: number) => {
      if (index === deskIndex) { computerOn = !computerOn; monitorMaterials.forEach(material => { material.color.set(computerOn ? 0x247e91 : 0x142127); material.emissiveIntensity = computerOn ? .75 : .03; }); }
      if (index === boardIndex && projectorGroup) projectorGroup.visible = !projectorGroup.visible;
    },
    update: (_time: number, dt: number, camera: THREE.Camera, top: boolean) => {
      overhead.visible = furnished && !top; blinds.visible = !top;
      if (selected >= 0 && selection.visible) selection.update();
      const settling = architecture.update(camera, top, dt);
      for (const entry of boardMaterials) entry.material.opacity = THREE.MathUtils.lerp(entry.base, Math.min(entry.base, .10), boardWall?.fade ?? 0);
      for (const entry of blindMaterials) entry.material.opacity = THREE.MathUtils.lerp(entry.base, Math.min(entry.base, .10), blindWall?.fade ?? 0);
      return settling;
    },
  };
}
