// Exact room names confirmed by the user on 2026-10-26.
// Run: node scripts/verify-room-names.mjs [optional-standalone-project-directory]
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const root = fileURLToPath(new URL('../', import.meta.url));
const require = createRequire(import.meta.url);
function loader() {
  const cache = new Map();
  return function load(file) {
    file = path.resolve(file);
    if (cache.has(file)) return cache.get(file).exports;
    const module = { exports: {} }; cache.set(file, module);
    const compiled = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    }).outputText;
    const localRequire = dependency => {
      if (!dependency.startsWith('.') && !dependency.startsWith('@/')) return require(dependency);
      const base = dependency.startsWith('@/') ? path.join(root, dependency.slice(2)) : path.resolve(path.dirname(file), dependency);
      const resolved = [base, `${base}.ts`, `${base}.tsx`].find(candidate => fs.existsSync(candidate) && fs.statSync(candidate).isFile());
      assert.ok(resolved, `Unresolved import ${dependency} from ${file}`);
      return load(resolved);
    };
    new Function('module', 'exports', 'require', compiled)(module, module.exports, localRequire);
    return module.exports;
  };
}
const cases = [
  { codes: ['E104'], names: ['Immersive Technology Convergence Center', 'Human Experience Lab'] },
  { codes: ['E202'], names: ['Guest Researchers and Visiting Scholars'] },
  { codes: ['E204'], names: ['Smart City Lab', 'Urban Sense Lab'] },
  { codes: ['E303'], names: ['MPS Station Center'] },
  { codes: ['E304'], names: ['Automated Vehicles & Systems Lab'] },
  { codes: ['E401'], names: ['Smart Seaport Logistics & Terminal Operations Lab', 'Smart Mobility Lab - Rail Systems Lab'] },
  { codes: ['E402', 'E403'], names: ['AI and Big Data Lab'] },
  { codes: ['E404'], names: ['Ocean Monitoring & Spatial Planning Lab', 'Ocean Physics & Coastal Dynamics Laboratory', 'Ocean Renewable Energy Lab'] },
  { codes: ['E502', 'E503'], names: ['Advanced Initiative of Science and Technology Lab'] },
  { codes: ['E602', 'E603'], names: ['Cyber Security Lab'] },
  { codes: ['E702'], names: ['Open Lab & Prototyping Area', 'Digital Library'] },
];
const stableIds = `precision-mechanics-lab hologram-printing-lab classroom-e103 hologram-exhibition-room
immersive-technology-center human-centered-ai-lab urban-physics-lab research-lab smart-city-lab digital-twin-lab
automated-vehicles-lab space-ocean-robotics-lab ocean-robotics-lab industrial-production-line-lab embedded-iot-process-lab
process-control-industrial-network-lab edge-physical-ai-lab ai-big-data-lab ocean-monitoring-planning-energy-lab
ocean-physics-lab ocean-renewable-energy-lab smart-port-mobility-rail-lab smart-mobility-lab rail-systems-lab
classroom-e503 classroom-e502 classroom-e504 classroom-e501 security-lab security-lab-extra circular-economy-lab
isc-open-lab open-lab-prototyping-library meeting-station-cafe innovation-lounge`.split(/\s+/).sort();
const parts = name => name.split(' | ');
const roomCodes = room => room.match(/E\d{3}/g) ?? [];
const matching = (spaces, codes) => spaces.filter(space => roomCodes(space.room).some(code => codes.includes(code)));
const expectedCatalogue = item => item.codes[0] === 'E502' ? item.codes : [item.codes.join('+')];
let verifiedRecords = 0;
for (const lang of ['en', 'vi']) {
  globalThis.document = { documentElement: { lang } };
  const load = loader();
  const { ROOM_CATALOGUE } = load(path.join(root, 'components/wayfinding/room-catalogue.ts'));
  const { floorRooms } = load(path.join(root, 'components/wayfinding/floor-rooms.ts'));
  const { allSpaces, labs } = load(path.join(root, 'data/labs.ts'));
  const { getAllSpaces, getLabs, getLab } = load(path.join(root, 'lib/content.ts'));
  assert.deepEqual(allSpaces.map(space => space.id).sort(), stableIds, `${lang}: stable URLs`);
  assert.equal(labs.length, 32); assert.equal(Object.keys(ROOM_CATALOGUE).length, 26);
  assert.equal(allSpaces.find(lab => lab.id === 'industrial-production-line-lab')?.room, 'E303', 'MPS room binding');
  assert.equal(allSpaces.find(lab => lab.id === 'automated-vehicles-lab')?.room, 'E304', 'Automated vehicles room binding');
  const localized = getAllSpaces(lang), listed = getLabs(lang);
  assert.equal(listed.length, 32);
  for (const item of cases) {
    for (const id of expectedCatalogue(item)) assert.equal(ROOM_CATALOGUE[id]?.name, item.names.join(' | '), `${lang}: ${id} map title`);
    const records = matching(localized, item.codes);
    assert.ok(records.length, `${lang}: missing ${item.codes}`);
    assert.deepEqual([...new Set(records.flatMap(record => parts(record.name)))].sort(), [...item.names].sort(), `${lang}: physical room names`);
    for (const record of records) {
      assert.ok(listed.some(lab => lab.id === record.id), `${lang}: missing directory alias ${record.id}`);
      assert.equal(getLab(lang, record.id)?.name, record.name, `${lang}: detail title ${record.id}`);
    }
    if (lang === 'en') verifiedRecords += records.length;
  }
  const fifthFloor = floorRooms(5);
  for (const code of ['E502', 'E503']) {
    assert.equal(fifthFloor.find(room => room.id === code)?.kind, 'lab');
    const lab = listed.find(space => space.room === code);
    for (const key of ['cardImage', 'detailImage']) assert.ok(fs.existsSync(path.join(root, 'public', lab.visual[key])), `${code}: missing ${key}`);
  }
  for (const code of ['E501', 'E504']) assert.equal(fifthFloor.find(room => room.id === code)?.kind, 'class');
  for (const id of ['classroom-e103', 'classroom-e501', 'classroom-e504']) assert.ok(!labs.some(lab => lab.id === id));
}
if (process.argv[2]) {
  const { ROOM_CATALOGUE } = loader()(path.resolve(process.argv[2], 'components/room-catalogue.ts'));
  for (const item of cases) for (const id of expectedCatalogue(item)) assert.equal(ROOM_CATALOGUE[id]?.name, item.names.join(' | '), `standalone: ${id}`);
}
delete globalThis.document;
console.log(`Room names passed: ${cases.length} physical groups, ${verifiedRecords} retained records, 35 stable IDs, 32 directory entries, both locales${process.argv[2] ? ', standalone checked' : ''}.`);
