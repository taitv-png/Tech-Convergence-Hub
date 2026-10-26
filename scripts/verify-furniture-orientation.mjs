// Measure rendered furniture, including each instance, rather than survey metadata.
// Run from any directory: node scripts/verify-furniture-orientation.mjs
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
const { createRoomTour } = await import(compile('components/wayfinding/room-tour.ts'));
const { floorRooms } = await import(compile('components/wayfinding/floor-rooms.ts'));
const { ROOM_SURVEYS } = await import(compile('components/wayfinding/room-surveys.ts'));
const rooms = Array.from({ length: 8 }, (_, floor) => floorRooms(floor)).flat();
const near = (a, b, tolerance = .006) => Math.abs(a - b) < tolerance;
const horizontal = vector => vector.clone().setY(0);
const distance = (a, b) => horizontal(a.clone().sub(b)).length();
const direction = (a, b) => horizontal(b.clone().sub(a)).normalize();
const sameStation = (a, b) => a.station === b.station;
const rounded = vector => vector.toArray().map(number => +number.toFixed(3)).join(',');

function measure(scene) {
  scene.updateMatrixWorld(true);
  const parts = [];
  scene.traverse(object => {
    if (!object.isMesh || !object.geometry) return;
    let parent = object, station;
    while (parent) {
      if (Number.isInteger(parent.userData.station)) { station = parent; break; }
      parent = parent.parent;
    }
    if (!station) return; // Architecture, lights and ground are not furniture.
    object.geometry.computeBoundingBox();
    const bounds = object.geometry.boundingBox;
    const localCenter = bounds.getCenter(new THREE.Vector3()), localSize = bounds.getSize(new THREE.Vector3());
    const count = object.isInstancedMesh ? object.count : 1;
    for (let index = 0; index < count; index++) {
      const matrix = object.matrixWorld.clone();
      if (object.isInstancedMesh) {
        const instance = new THREE.Matrix4(); object.getMatrixAt(index, instance); matrix.multiply(instance);
      }
      const scale = new THREE.Vector3(); matrix.decompose(new THREE.Vector3(), new THREE.Quaternion(), scale);
      const size = localSize.clone().multiply(scale), center = localCenter.clone().applyMatrix4(matrix);
      const worldBounds = bounds.clone().applyMatrix4(matrix);
      parts.push({ object, index, station, matrix, center, size, bounds: worldBounds,
        material: Array.isArray(object.material) ? object.material[0] : object.material,
        wide: Math.max(size.x, size.z), thin: Math.min(size.x, size.z),
      });
    }
  });
  return parts;
}

function chairs(parts) {
  const seats = parts.filter(part => part.center.y > .42 && part.center.y < .49
    && part.size.y >= .05 && part.size.y <= .081
    && part.size.x >= .41 && part.size.x <= .49 && part.size.z >= .41 && part.size.z <= .49);
  return seats.map(seat => {
    const candidates = parts.filter(part => sameStation(part, seat) && part !== seat
      && part.center.y - seat.center.y > .16 && part.center.y - seat.center.y < .44
      && part.size.y > .27 && part.size.y < .82 && part.thin < .09 && part.wide > .40 && part.wide < .51
      && distance(part.center, seat.center) > .13 && distance(part.center, seat.center) < .29);
    candidates.sort((a, b) => distance(a.center, seat.center) - distance(b.center, seat.center));
    assert.ok(candidates.length, `Missing backrest for seat ${rounded(seat.center)}`);
    // The actual seat-to-backrest offset defines forward, independent of helper conventions.
    return { ...seat, back: candidates[0], forward: direction(candidates[0].center, seat.center) };
  });
}

function screens(parts, minHeight = .27, maxHeight = .67) {
  return parts.filter(part => part.material.emissive?.getHex() > 0 && part.material.emissiveIntensity > 0
    && part.center.y > .95 && part.center.y < 2.2 && part.size.y >= minHeight && part.size.y <= maxHeight
    && part.thin < .026 && part.wide >= .43).map(front => {
    const bodies = parts.filter(part => part !== front && sameStation(part, front)
      && Math.abs(part.center.y - front.center.y) < .035 && distance(part.center, front.center) < .09
      && part.size.y > front.size.y + .015 && part.size.y < front.size.y + .22
      && part.wide > front.wide && part.wide < front.wide + .18 && part.thin > front.thin && part.thin < .12);
    bodies.sort((a, b) => b.size.y * b.wide - a.size.y * a.wide);
    assert.ok(bodies.length, `Missing monitor housing at ${rounded(front.center)}`);
    const body = bodies[0];
    assert.ok(distance(body.center, front.center) > .005, 'Screen face must sit outside its housing');
    return { ...front, body, forward: direction(body.center, front.center) };
  });
}

function keyboards(parts) {
  return parts.filter(part => part.center.y > .77 && part.center.y < .82
    && part.size.y > .010 && part.size.y < .024 && part.wide >= .33 && part.wide <= .44
    && part.thin >= .10 && part.thin <= .155);
}

function verifyComputers(parts, seats, label, expectedScreens, { keyboard = true, elevated = 0 } = {}) {
  const displays = screens(parts), keys = keyboards(parts), seated = displays.filter(screen => screen.center.y < 1.6);
  assert.equal(displays.length, expectedScreens, `${label}: detected monitor count changed`);
  assert.equal(displays.length - seated.length, elevated, `${label}: elevated equipment displays`);
  if (keyboard) assert.equal(keys.length, displays.length, `${label}: every monitor must retain a keyboard`);
  const usedSeats = new Set();
  for (const screen of displays) {
    const tag = `${label} monitor ${rounded(screen.center)}`;
    if (keyboard) {
      const candidates = keys.filter(key => sameStation(key, screen)).sort((a, b) => distance(a.center, screen.center) - distance(b.center, screen.center));
      const key = candidates[0]; assert.ok(key, `${tag}: missing keyboard`);
      const offset = horizontal(key.center.clone().sub(screen.body.center));
      assert.ok(offset.dot(screen.forward) > .12, `${tag}: keyboard is behind the screen`);
      assert.ok(offset.dot(screen.forward) < .45, `${tag}: keyboard is too far from the monitor`);
      assert.ok(Math.abs(offset.x * screen.forward.z - offset.z * screen.forward.x) < .12, `${tag}: keyboard is on the wrong desk`);
    }
    if (screen.center.y >= 1.6) continue; // Standing machine-control screen, not a seated workstation.
    const candidates = seats.filter(seat => sameStation(seat, screen)).sort((a, b) => distance(a.center, screen.center) - distance(b.center, screen.center));
    const seat = candidates[0]; assert.ok(seat && distance(seat.center, screen.center) < 1.25, `${tag}: no seat within reach`);
    assert.ok(screen.forward.dot(direction(screen.center, seat.center)) > .65, `${tag}: silver back/housing faces the chair`);
    assert.ok(seat.forward.dot(direction(seat.center, screen.center)) > .65, `${tag}: chair faces away from monitor`);
    usedSeats.add(seat);
  }
  return { displays, usedSeats };
}

function tabletops(parts) {
  return parts.filter(part => part.center.y > .72 && part.center.y < .79 && part.size.y >= .04 && part.size.y <= .07
    && part.wide >= .55 && part.thin >= .42);
}
function edgeDistance(point, table) {
  const local = point.clone().applyMatrix4(table.matrix.clone().invert());
  const box = table.object.geometry.boundingBox, target = new THREE.Vector3(
    THREE.MathUtils.clamp(local.x, box.min.x, box.max.x), local.y,
    THREE.MathUtils.clamp(local.z, box.min.z, box.max.z),
  ).applyMatrix4(table.matrix);
  return distance(point, target);
}
function verifyTableSeats(parts, seats, label, expectedSeats, { sideSeatingStation } = {}) {
  assert.equal(seats.length, expectedSeats, `${label}: detected chair count changed`);
  const tables = tabletops(parts);
  for (const seat of seats) {
    let candidates = tables.filter(table => sameStation(table, seat));
    if (seat.station.userData.station === sideSeatingStation) {
      // In the U layout, row seats face the long edge, not the adjacent return table.
      candidates = candidates.filter(table => {
        const longAxis = new THREE.Vector3(table.size.x > table.size.z ? 1 : 0, 0, table.size.z >= table.size.x ? 1 : 0).transformDirection(table.matrix);
        return Math.abs(longAxis.dot(seat.forward)) < .2;
      });
    }
    candidates.sort((a, b) => edgeDistance(seat.center, a) - edgeDistance(seat.center, b));
    const table = candidates[0], tag = `${label} seat ${rounded(seat.center)}`;
    assert.ok(table && edgeDistance(seat.center, table) < .85, `${tag}: no table within reach`);
    assert.ok(seat.forward.dot(direction(seat.center, table.center)) > .35, `${tag}: backrest faces its table`);
  }
}

function verifyAudience(seats, target, label, minDot = .5) {
  for (const seat of seats) assert.ok(seat.forward.dot(direction(seat.center, target)) > minDot,
    `${label}: observation/study chair faces away from its target at ${rounded(seat.center)}`);
}
function dispose(scene) {
  const geometries = new Set(), materials = new Set(), textures = new Set();
  scene.traverse(object => {
    if (object.geometry) geometries.add(object.geometry);
    for (const material of object.material ? Array.isArray(object.material) ? object.material : [object.material] : []) {
      materials.add(material); if (material.map) textures.add(material.map);
    }
  });
  geometries.forEach(value => value.dispose()); materials.forEach(value => value.dispose()); textures.forEach(value => value.dispose());
}

// Negative controls alter rendered transforms, then require the same production
// measurement to reject them. This catches a test that accidentally reads only
// labels, metadata or intended helper angles instead of the visible furniture.
let rejectedMutations = 0;
function rejectReversedPart(parts, part, pivot, verify, label) {
  const object = part.object, original = object.isInstancedMesh ? new THREE.Matrix4() : object.position.clone();
  if (object.isInstancedMesh) object.getMatrixAt(part.index, original);
  const worldDelta = pivot.clone().sub(part.center).multiplyScalar(2);
  const parentInverse = (object.isInstancedMesh ? object.matrixWorld : object.parent.matrixWorld).clone().invert();
  const localDelta = worldDelta.applyMatrix3(new THREE.Matrix3().setFromMatrix4(parentInverse));
  try {
    if (object.isInstancedMesh) {
      const changed = original.clone(); changed.elements[12] += localDelta.x; changed.elements[13] += localDelta.y; changed.elements[14] += localDelta.z;
      object.setMatrixAt(part.index, changed);
    } else object.position.add(localDelta);
    assert.throws(verify, undefined, `${label}: deliberately reversed geometry escaped detection`);
    rejectedMutations++;
  } finally {
    if (object.isInstancedMesh) object.setMatrixAt(part.index, original); else object.position.copy(original);
  }
}

const results = [], failures = [];
for (const room of rooms) {
  const scene = new THREE.Scene();
  try {
    if (room.id === 'E303' || room.id === 'E304') {
      const survey = ROOM_SURVEYS[room.id], first = room.id === 'E303' ? 5040 : 5053, last = room.id === 'E303' ? 5051 : 5066;
      assert.deepEqual(survey.photos.map(photo => photo.file), Array.from({ length: last - first + 1 }, (_, index) => `IMG_${first + index}`), `${room.id}: gallery must follow the swapped interior`);
      for (const photo of survey.photos) assert.ok(fs.existsSync(path.join(root, 'public/rooms', survey.folder, `${photo.file}.jpg`)), `${room.id}: attached survey photo is missing: ${photo.file}`);
    }
    createRoomTour(scene, room, true);
    const parts = measure(scene), seats = chairs(parts), label = room.id;
    let displayCount = 0;
    if (['E402+E403', 'E602+E603'].includes(room.id)) {
      assert.equal(seats.length, 51, `${label}: 50 students and one instructor`);
      const checked = verifyComputers(parts, seats, label, 51); displayCount = checked.displays.length;
      assert.equal(checked.usedSeats.size, 51, `${label}: each computer has its own chair`);
      assert.equal(checked.displays.filter(screen => screen.forward.x > .99).length, 50, `${label}: student screens face their east-side chairs`);
      assert.equal(checked.displays.filter(screen => screen.forward.x < -.99).length, 1, `${label}: instructor screen faces its west-side chair`);
      if (room.id === 'E402+E403') {
        const student = checked.displays.find(screen => screen.forward.x > .99);
        rejectReversedPart(parts, student, student.body.center, () => {
          const altered = measure(scene); verifyComputers(altered, chairs(altered), label, 51);
        }, `${label} reversed instanced screen`);
        const instructor = checked.displays.find(screen => screen.forward.x < -.99);
        const key = keyboards(parts).filter(value => sameStation(value, instructor))[0];
        // Reflect only horizontally; the keyboard remains on its tabletop.
        const pivot = instructor.body.center.clone().setY(key.center.y);
        rejectReversedPart(parts, key, pivot, () => {
          const altered = measure(scene); verifyComputers(altered, chairs(altered), label, 51);
        }, `${label} keyboard behind instructor monitor`);
      }
    } else if (room.id === 'E201' || room.id === 'E202') {
      verifyTableSeats(parts, seats, label, room.id === 'E201' ? 12 : 17, { sideSeatingStation: room.id === 'E201' ? 1 : undefined });
      const checked = verifyComputers(parts, seats, label, room.id === 'E201' ? 1 : 2); displayCount = checked.displays.length;
      assert.equal(checked.usedSeats.size, displayCount, `${label}: separate office seats`);
      const selected = seats.filter(seat => seat.station.userData.station === (room.id === 'E201' ? 0 : 1))
        .sort((a, b) => a.center.z - b.center.z)[0];
      rejectReversedPart(parts, selected.back, selected.center.clone().setY(selected.back.center.y), () => {
        const altered = measure(scene); verifyTableSeats(altered, chairs(altered), label, room.id === 'E201' ? 12 : 17, { sideSeatingStation: room.id === 'E201' ? 1 : undefined });
      }, `${label} backwards table chair`);
    } else if (room.id === 'E304') {
      assert.equal(seats.length, 13, `${label}: twelve student seats and one instructor`);
      const checked = verifyComputers(parts, seats, label, 14, { elevated: 1 }); displayCount = checked.displays.length;
      assert.equal(checked.usedSeats.size, 13, `${label}: distinct student/instructor seats`);
    } else if (room.id === 'E302') {
      assert.equal(seats.length, 5, `${label}: control seat and four observation seats`);
      const checked = verifyComputers(parts, seats, label, 3); displayCount = checked.displays.length;
      assert.equal(checked.usedSeats.size, 1, `${label}: three console screens share one operator seat`);
      const arena = parts.filter(part => part.material.map && part.center.y < .04 && part.wide > 3).sort((a, b) => b.wide * b.thin - a.wide * a.thin)[0];
      assert.ok(arena, `${label}: measured arena surface`);
      verifyAudience(seats.filter(seat => !checked.usedSeats.has(seat)), arena.center, label);
    } else if (room.id === 'E303') {
      assert.equal(seats.length, 3, `${label}: operator and two waiting seats`);
      const checked = verifyComputers(parts, seats, label, 1); displayCount = checked.displays.length;
      const road = parts.filter(part => part.material.map && part.center.y < .04 && part.wide > 3).sort((a, b) => b.wide * b.thin - a.wide * a.thin)[0];
      assert.ok(road, `${label}: measured road-test surface`);
      // Waiting chairs face into the broad road area, rather than its exact centre.
      verifyAudience(seats.filter(seat => !checked.usedSeats.has(seat)), road.center, label, .25);
    } else if (room.id === 'E104') {
      assert.equal(seats.length, 13, `${label}: ten students and three office chairs`);
      const checked = verifyComputers(parts, seats, label, 3); displayCount = checked.displays.length;
      const audience = seats.filter(seat => !checked.usedSeats.has(seat));
      verifyTableSeats(parts, audience, label, 10);
      const presentation = screens(parts, 1, 1.10);
      assert.equal(presentation.length, 1, `${label}: mobile presentation screen`);
      verifyAudience(audience, presentation[0].center, label);
      const centroid = audience.reduce((sum, seat) => sum.add(seat.center), new THREE.Vector3()).divideScalar(audience.length);
      assert.ok(presentation[0].forward.dot(direction(presentation[0].center, centroid)) > .9, `${label}: presentation screen faces the study area`);
    } else {
      // Generic teaching scenes use the same geometry across the remaining rooms.
      verifyTableSeats(parts, seats, label, seats.length);
      assert.ok(seats.length >= 1, `${label}: no teaching/office chairs detected`);
      const hasPresentationScreen = ['E102', 'E401'].includes(room.id);
      const checked = verifyComputers(parts, seats, label, hasPresentationScreen ? 2 : 1, { keyboard: false, elevated: hasPresentationScreen ? 1 : 0 }); displayCount = checked.displays.length;
      if (hasPresentationScreen) {
        const presentation = checked.displays.find(screen => screen.center.y >= 1.6);
        const audience = seats.filter(seat => !checked.usedSeats.has(seat));
        verifyAudience(audience, presentation.center, label, .35);
        const centroid = audience.reduce((sum, seat) => sum.add(seat.center), new THREE.Vector3()).divideScalar(audience.length);
        assert.ok(presentation.forward.dot(direction(presentation.center, centroid)) > .9, `${label}: presentation screen faces the rows`);
      }
    }
    results.push({ room: room.id, seats: seats.length, monitors: displayCount });
  } catch (error) {
    failures.push(`${room.id}: ${error.message}`);
  } finally { dispose(scene); }
}
console.table(results);
if (failures.length) { console.error(failures.join('\n')); process.exitCode = 1; }
else console.log(`PASS: actual furniture transforms in ${results.length} rooms; ${results.reduce((sum, result) => sum + result.seats, 0)} chairs and ${results.reduce((sum, result) => sum + result.monitors, 0)} monitors. Rejected ${rejectedMutations} reversed-geometry negative controls.`);
