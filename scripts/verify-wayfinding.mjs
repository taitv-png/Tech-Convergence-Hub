// Navigation and cutaway regressions using the actual room-tour scene factory.
// Run from any directory: node scripts/verify-wayfinding.mjs
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';
import ts from 'typescript';
import * as THREE from 'three';

const root = fileURLToPath(new URL('../', import.meta.url));
const require = createRequire(import.meta.url);
const threeUrl = pathToFileURL(require.resolve('three').replace('three.cjs', 'three.module.js')).href;
const gradient = () => ({ addColorStop() {} });
const context = new Proxy({
  measureText: text => ({ width: String(text).length * 14 }),
  createLinearGradient: gradient, createRadialGradient: gradient,
  createImageData: (w, h) => ({ data: new Uint8ClampedArray(w * h * 4) }),
}, { get: (object, key) => key in object ? object[key] : () => {}, set: () => true });
globalThis.document = {
  // Node-only CanvasTexture stub; no browser API is invoked.
  // eslint-disable-next-line typescript/no-deprecated
  documentElement: { lang: 'en' },
  createElement: () => ({ width: 0, height: 0, getContext: () => context }),
};
const modules = new Map();
function compile(relativeFile) {
  const file = path.resolve(root, relativeFile);
  if (modules.has(file)) return modules.get(file);
  let js = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
  }).outputText.replace(/(['"])three\1/g, JSON.stringify(threeUrl));
  js = js.replace(/(from\s*|import\s*)(['"])(\.{1,2}\/[^'"]+)\2/g, (_match, prefix, _quote, dependency) => {
    const base = path.resolve(path.dirname(file), dependency);
    const resolved = [base, `${base}.ts`, `${base}.tsx`, `${base}.js`].find(candidate => fs.existsSync(candidate) && fs.statSync(candidate).isFile());
    assert.ok(resolved, `Cannot resolve ${dependency} from ${file}`);
    return prefix + JSON.stringify(compile(resolved));
  });
  const url = 'data:text/javascript;base64,' + Buffer.from(js).toString('base64');
  modules.set(file, url); return url;
}
const importText = source => import('data:text/javascript;base64,' + Buffer.from(ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText).toString('base64'));
const { createRoomTour } = await import(compile('components/wayfinding/room-tour.ts'));
const { createRoomArchitecture } = await import(compile('components/wayfinding/room-architecture.ts'));
const { createHallway, roomEntry } = await import(compile('components/wayfinding/campus-tour-scene.ts'));
const { floorRooms } = await import(compile('components/wayfinding/floor-rooms.ts'));
const ROOMS = Array.from({length:8}, (_,floor)=>floorRooms(floor)).flat();
const campus = fs.readFileSync(path.join(root, 'components/wayfinding/CampusEMap.tsx'), 'utf8');
const walkSource = campus.slice(campus.indexOf('function roomFree('), campus.indexOf('function RoomPreview('));
assert.ok(walkSource.includes('function roomWalkPath('), 'Production navigation helpers were not found');
const navigation = await importText(`const E104_PLAN={};\nconst dist=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1]);\n${walkSource}\nexport {roomFree,roomSegmentFree,roomWalkPath};`);
const free = (p, b) => navigation.roomFree(p.x, p.z, b.obstacles, b.width, b.depth);
const segmentFree = (a, b, scene) => navigation.roomSegmentFree([a.x, a.z], [b.x, b.z], scene.obstacles, scene.width, scene.depth);
function reachableFloor(built, label) {
  assert.ok(free(built.start, built), `${label}: entry spawn intersects furniture or a wall`);
  const step = .16, key = p => `${Math.round((p.x - built.start.x) / step)},${Math.round((p.z - built.start.z) / step)}`;
  const queue = [{ x: built.start.x, z: built.start.z }], seen = new Set([key(queue[0])]);
  for (let index = 0; index < queue.length; index++) {
    const point = queue[index];
    for (const [dx, dz] of [[step, 0], [-step, 0], [0, step], [0, -step]]) {
      const next = { x: point.x + dx, z: point.z + dz }, id = key(next);
      if (seen.has(id) || !free(next, built) || !segmentFree(point, next, built)) continue;
      seen.add(id); queue.push(next);
    }
  }
  assert.ok(queue.length > 100, `${label}: entry opens onto an isolated landing`);
  return queue;
}
function verifyRoute(built, destination, label) {
  const route = navigation.roomWalkPath([built.start.x, built.start.z], [destination.x, destination.z], built.obstacles, built.width, built.depth);
  assert.ok(route.length, `${label}: production click-to-walk cannot find a route`);
  let previous = built.start;
  for (const [x, z] of route) {
    const point = { x, z };
    assert.ok(free(point, built) && segmentFree(previous, point, built), `${label}: smoothed route intersects an obstacle`);
    previous = point;
  }
}
function validateTransforms(scene, label) {
  scene.updateMatrixWorld(true);
  scene.traverse(object => {
    assert.ok(object.matrixWorld.elements.every(Number.isFinite), `${label}: nonfinite transform on ${object.name || object.type}`);
    if (object.isInstancedMesh) assert.ok(object.instanceMatrix.array.every(Number.isFinite), `${label}: invalid furniture instance`);
  });
}
function verifyDoorGeometry(scene, wallGroups, portal, built, label) {
  scene.updateMatrixWorld(true);
  const normal = new THREE.Vector3(
    Math.abs(portal.x + built.width / 2) < .01 ? -1 : Math.abs(portal.x - built.width / 2) < .01 ? 1 : 0,
    0,
    Math.abs(portal.z + built.depth / 2) < .01 ? -1 : Math.abs(portal.z - built.depth / 2) < .01 ? 1 : 0,
  );
  assert.equal(normal.length(), 1, `${label}: portal must lie on a wall`);
  const tangent = new THREE.Vector3(-normal.z, 0, normal.x);
  for (const offset of [-.2, 0, .2]) {
    const origin = new THREE.Vector3(portal.x, 1.35, portal.z).addScaledVector(normal, -.4).addScaledVector(tangent, offset);
    const ray = new THREE.Raycaster(origin, normal, .01, .8);
    const blockers = ray.intersectObjects(wallGroups, true).filter(hit => {
      if (!hit.object.isMesh) return false;
      const materials = Array.isArray(hit.object.material) ? hit.object.material : [hit.object.material];
      // Classify the actual solid frame/plaster, even while a cutaway fades it.
      return materials.some(material => [0x293236, 0xf0efe8, 0xa6b0b0].includes(material.color?.getHex()));
    });
    assert.equal(blockers.length, 0, `${label}: a wall/frame fills the physical doorway`);
  }
}
function dispose(scene) {
  const geometries = new Set(), materials = new Set(), textures = new Set();
  scene.traverse(object => {
    if (object.geometry) geometries.add(object.geometry);
    for (const material of object.material ? Array.isArray(object.material) ? object.material : [object.material] : []) {
      materials.add(material); if (material.map) textures.add(material.map);
    }
  });
  geometries.forEach(geometry => geometry.dispose()); materials.forEach(material => material.dispose()); textures.forEach(texture => texture.dispose());
}

// The same helper must fade the visible pair without moving any actual door.
const cutawayScene = new THREE.Scene();
const architecture = createRoomArchitecture(cutawayScene, { width: 10, depth: 8, openings: [
  { side: 'north', from: -2, to: -.7, kind: 'door' },
  { side: 'north', from: 0, to: 2, kind: 'window' },
  { side: 'east', from: 1, to: 2.3, kind: 'door' },
] });
const camera = new THREE.PerspectiveCamera(), leaves = [];
cutawayScene.traverse(object => { if (object.userData.fixedDoorLeaf) leaves.push(object); });
const leafTransforms = () => JSON.stringify(leaves.map(leaf => [...leaf.position, ...leaf.rotation.toArray(), ...leaf.scale]));
const originalLeaves = leafTransforms();
const materialFlags = () => architecture.walls.map(wall => wall.materials.map(entry => [entry.material.transparent, entry.material.depthWrite, entry.material.version]));
const originalFlags = materialFlags();
function settle(x, z) {
  camera.position.set(x, 7, z); let settling = true, frames = 0;
  while (settling && frames++ < 300) settling = architecture.update(camera, false, 1 / 60);
  assert.equal(settling, false, 'The fade must converge with a stationary camera');
  return architecture.walls.map(wall => wall.materials[0].material.opacity);
}
for (const angle of [.7, 2.2, 3.9, 5.3]) {
  settle(Math.cos(angle) * 12, Math.sin(angle) * 12);
  assert.equal(architecture.walls.filter(wall => wall.fade > .9).length, 2, 'Orbit must fade two adjacent camera-facing walls');
  assert.equal(architecture.walls.filter(wall => wall.fade < .1).length, 2, 'The opposite pair must remain opaque');
  const opacity = JSON.stringify(architecture.walls.map(wall => wall.materials.map(entry => entry.material.opacity)));
  for (let i = 0; i < 120; i++) assert.equal(architecture.update(camera, false, 1 / 60), false);
  assert.equal(JSON.stringify(architecture.walls.map(wall => wall.materials.map(entry => entry.material.opacity))), opacity, 'Stationary frames must not flicker');
  assert.equal(leafTransforms(), originalLeaves, 'Camera movement must not change door-leaf geometry');
  assert.deepEqual(materialFlags(), originalFlags, 'Opacity updates must not switch material depth/transparent flags or recompile shaders');
}
for (const [before, after] of [
  [[.0999, Math.sqrt(1 - .0999 ** 2)], [.1001, Math.sqrt(1 - .1001 ** 2)]],
  [[4.9999, 6], [5.0001, 6]],
]) {
  const a = settle(...before), b = settle(...after);
  assert.ok(a.every((opacity, index) => Math.abs(opacity - b[index]) < .03), 'Crossing the previous angle/boundary thresholds must not pop opacity');
}
architecture.update(camera, true, .016); assert.ok(architecture.walls.every(wall => wall.group.scale.y === .08));
architecture.update(camera, false, .016); assert.ok(architecture.walls.every(wall => wall.group.scale.y === 1));
dispose(cutawayScene);

const failures = [], results = [];
for (const room of ROOMS) {
  let hiddenObstacles = [], furnishedBuilt;
  for (const furnished of [true, false]) {
    const scene = new THREE.Scene(), label = `${room.id} ${furnished ? 'furnished' : 'hidden'}`;
    try {
      const built = createRoomTour(scene, room, furnished);
      if (furnished) furnishedBuilt = built; else hiddenObstacles = built.obstacles;
      const reachable = reachableFloor(built, label), wallGroups = [];
      scene.traverse(object => { if (object.userData.architectureWall) wallGroups.push(object); });
      assert.equal(wallGroups.length, 4, `${label}: every room must use the shared door/window/cutaway construction`);
      if (room.id !== 'E104') {
        const actualDoors = room.doors ?? [room.door];
        assert.equal(built.portals.length, actualDoors.length, `${label}: preserve every entrance in the floor-plan data`);
        for (const door of actualDoors) {
          const expected = roomEntry({ ...room, door });
          assert.ok(built.portals.some(portal => Math.hypot(portal.x - expected.x, portal.z - expected.z) < .001), `${label}: portal and floor-plan doorway do not align`);
        }
      }
      for (const portal of built.portals) {
        // E102's display grids must leave both entrances visibly open.
        verifyDoorGeometry(scene, room.id === 'E102' ? [...wallGroups, ...built.interactables] : wallGroups, portal, built, label);
        const approach = { x: THREE.MathUtils.clamp(portal.x, -built.width / 2 + .65, built.width / 2 - .65),
          z: THREE.MathUtils.clamp(portal.z, -built.depth / 2 + .65, built.depth / 2 - .65) };
        assert.ok(free(approach, built), `${label}: blocked portal landing ${portal.id}`);
        assert.ok(reachable.some(point => Math.hypot(point.x - approach.x, point.z - approach.z) < .24), `${label}: disconnected portal ${portal.id}`);
        verifyRoute(built, approach, `${label} portal ${portal.id}`);
      }
      if (furnished) for (const item of built.items) {
        const candidates = reachable.filter(point => Math.hypot(point.x - item.x, point.z - item.z) < 2.2)
          .sort((a, b) => Math.hypot(a.x - item.x, a.z - item.z) - Math.hypot(b.x - item.x, b.z - item.z));
        const approach = candidates.find(point => navigation.roomWalkPath([built.start.x, built.start.z], [point.x, point.z], built.obstacles, built.width, built.depth).length);
        assert.ok(approach, `${label}: equipment cannot be approached: ${item.name}`);
        verifyRoute(built, approach, `${label} item ${item.name}`);
        built.highlight(built.items.indexOf(item)); built.activate(built.items.indexOf(item)); built.activate(built.items.indexOf(item));
      }
      built.highlight(-1);
      const currentLeaves = [], flags = [];
      wallGroups.forEach(group => group.traverse(object => {
        if (object.userData.fixedDoorLeaf) currentLeaves.push(object);
        for (const material of object.material ? Array.isArray(object.material) ? object.material : [object.material] : []) flags.push({ material, transparent: material.transparent, depthWrite: material.depthWrite });
      }));
      const initialLeaves = JSON.stringify(currentLeaves.map(leaf => [...leaf.position, ...leaf.rotation.toArray()]));
      for (const top of [true, false]) for (const angle of [.7, 2.2, 3.9, 5.3]) {
        camera.position.set(Math.cos(angle) * 14, top ? 20 : 7, Math.sin(angle) * 14);
        for (let i = 0; i < 8; i++) built.update(1000 + i * 16, .016, camera, top);
        validateTransforms(scene, label);
        assert.equal(JSON.stringify(currentLeaves.map(leaf => [...leaf.position, ...leaf.rotation.toArray()])), initialLeaves, `${label}: door leaves move during orbit`);
        flags.forEach(entry => { assert.equal(entry.material.transparent, entry.transparent); assert.equal(entry.material.depthWrite, entry.depthWrite); });
      }
      results.push({ room: room.id, furnished, doors: built.portals.length, items: built.items.length, reachable: reachable.length });
    } catch (error) { failures.push(`${label}: ${error.message}`); }
    finally { dispose(scene); }
  }
  if (furnishedBuilt) for (const obstacle of hiddenObstacles) {
    if (free(obstacle, furnishedBuilt)) failures.push(`${room.id}: hiding furniture changed a structural collision`);
  }
}
for (let floor = 0; floor < 8; floor++) {
  const scene = new THREE.Scene();
  try {
    const built = createHallway(scene, floorRooms(floor), floor, 'CT1'), reachable = reachableFloor(built, `hall F${floor}`);
    for (const portal of built.portals) assert.ok(reachable.some(point => Math.hypot(point.x - portal.x, point.z - portal.z) < 1.3), `hall F${floor}: unreachable ${portal.id}`);
    validateTransforms(scene, `hall F${floor}`);
  } catch (error) { failures.push(error.message); }
  finally { dispose(scene); }
}
console.log(JSON.stringify({ status: failures.length ? 'FAIL' : 'PASS', rooms: ROOMS.length, states: results.length, hallways: 8,
  equipmentApproaches: results.filter(result => result.furnished).reduce((total, result) => total + result.items, 0),
  cutaway: 'four quadrants, stable stationary frames, fixed doors, fixed material flags, smooth thresholds', failures,
  ...(process.argv.includes('--verbose') ? { results } : {}) }, null, 2));
if (failures.length) process.exit(1);

const {ROOM_SURVEYS} = await import(compile('components/wayfinding/room-surveys.ts'));
const photos = new Set();
for (const survey of Object.values(ROOM_SURVEYS)) for (const photo of survey.photos) {
 const relative = `public/rooms/${survey.folder}/${photo.file}.jpg`;
 assert.ok(fs.existsSync(path.join(root,relative)), `Missing survey photo ${relative}`); photos.add(relative);
}
assert.equal(photos.size,76);
assert.equal(ROOM_SURVEYS.E002.photos.length,10);
assert.equal(ROOM_SURVEYS.E302.photos.length,4);
console.log(`PASS ${photos.size} survey assets; E302 excludes the misfiled photo`);
