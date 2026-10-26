import * as THREE from 'three';

export type WallSide = 'west' | 'east' | 'north' | 'south';
export type RoomOpening = {
  side: WallSide;
  from: number;
  to: number;
  bottom?: number;
  top?: number;
  kind: 'door' | 'window';
};
type Aperture = Required<RoomOpening>;
type ArchitectureOptions = {
  width: number;
  depth: number;
  height?: number;
  openings: RoomOpening[];
  namePrefix?: string;
};

/** Convert room-centred door positions to the common aluminium glazed opening. */
export function doorOpenings(entries: { x: number; z: number }[], width: number, depth: number): RoomOpening[] {
  return entries.map(entry => {
    const side: WallSide = Math.abs(entry.x + width / 2) < .12 ? 'west'
      : Math.abs(entry.x - width / 2) < .12 ? 'east'
        : Math.abs(entry.z + depth / 2) < .12 ? 'north' : 'south';
    const at = side === 'west' || side === 'east' ? entry.z : entry.x;
    return { side, from: at - .65, to: at + .65, bottom: 0, top: 2.4, kind: 'door' };
  });
}

/**
 * One construction and cutaway behavior for every room. Glass is a single
 * two-sided sheet; frost sits off the sheet, and frames never share its plane.
 * Transparency/depth flags remain fixed while orbiting, avoiding shader/depth
 * switching at a camera threshold. Only opacity changes, with a damped blend.
 */
export function createRoomArchitecture(scene: THREE.Scene, options: ArchitectureOptions) {
  const { width: w, depth: d, height: h = 3.05, namePrefix = 'survey-wall' } = options;
  const groups = {} as Record<WallSide, THREE.Group>;
  const openings: Aperture[] = [];
  const walls: {
    side: WallSide;
    group: THREE.Group;
    normal: THREE.Vector3;
    fade: number;
    initialized: boolean;
    materials: { material: THREE.MeshStandardMaterial; base: number; faded: number }[];
  }[] = [];
  const sheetGeometry = new THREE.PlaneGeometry(1, 1);

  for (const side of ['west', 'east', 'north', 'south'] as const) {
    const vertical = side === 'west' || side === 'east';
    const sign = side === 'west' || side === 'north' ? -1 : 1;
    const length = vertical ? d : w, fixed = sign * (vertical ? w : d) / 2;
    const group = new THREE.Group(); group.name = `${namePrefix}-${side}`;
    group.userData.architectureWall = side; scene.add(group); groups[side] = group;
    const material = (color: number, opacity: number, roughness: number, faded: number, sheet = false) => {
      const m = new THREE.MeshStandardMaterial({ color, opacity, roughness, transparent: true,
        depthWrite: false, side: sheet ? THREE.DoubleSide : THREE.FrontSide });
      m.forceSinglePass = true;
      state.materials.push({ material: m, base: opacity, faded });
      return m;
    };
    const state = { side, group, normal: new THREE.Vector3(vertical ? sign : 0, 0, vertical ? 0 : sign),
      fade: 0, initialized: false, materials: [] as { material: THREE.MeshStandardMaterial; base: number; faded: number }[] };
    walls.push(state);
    const wall = material(0xf0efe8, 1, .82, .10);
    const frame = material(0x293236, 1, .55, .14);
    const glass = material(0xbfd5d8, .20, .22, .035, true);
    const frost = material(0xf3f1e7, .38, .8, .055, true);
    const trim = material(0xa6b0b0, 1, .36, .14);
    const meshBox = (a: number, b: number, c: number, x: number, y: number, z: number, m: THREE.Material,
      parent: THREE.Object3D = group) => {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(a, b, c), m);
      mesh.position.set(x, y, z); mesh.castShadow = mesh.receiveShadow = false;
      parent.add(mesh); return mesh;
    };
    const segment = (from: number, to: number, bottom: number, top: number, m: THREE.Material, inset = 0, thickness = .12) => {
      if (to - from < .001 || top - bottom < .001) return;
      return meshBox(vertical ? thickness : to - from, top - bottom, vertical ? to - from : thickness,
        vertical ? fixed - sign * inset : (from + to) / 2, (bottom + top) / 2,
        vertical ? (from + to) / 2 : fixed - sign * inset, m);
    };
    const sheet = (from: number, to: number, bottom: number, top: number, m: THREE.Material, inset = 0) => {
      if (to <= from || top <= bottom) return;
      const mesh = new THREE.Mesh(sheetGeometry, m);
      mesh.scale.set(to - from, top - bottom, 1); mesh.rotation.y = vertical ? -Math.PI / 2 : 0;
      mesh.position.set(vertical ? fixed - sign * inset : (from + to) / 2,
        (bottom + top) / 2, vertical ? (from + to) / 2 : fixed - sign * inset);
      group.add(mesh); return mesh;
    };
    const apertures: Aperture[] = options.openings.filter(opening => opening.side === side).map(opening => ({
      ...opening, from: Math.max(-length / 2 + .08, opening.from), to: Math.min(length / 2 - .08, opening.to),
      bottom: opening.kind === 'door' ? 0 : opening.bottom ?? .85,
      top: Math.min(h - .15, opening.top ?? 2.4),
    })).filter(opening => opening.to - opening.from > .12).sort((a, b) => a.from - b.from);
    let cursor = -length / 2;
    for (const opening of apertures) {
      const { from, to, bottom, top, kind } = opening;
      // Any overlap indicates ambiguous survey geometry; keep the existing gap
      // clear rather than insert a wall through a neighbouring door.
      segment(cursor, from, 0, h, wall); segment(from, to, 0, bottom, wall); segment(from, to, top, h, wall);
      openings.push(opening);
      segment(from - .03, from + .03, bottom, top, frame);
      segment(to - .03, to + .03, bottom, top, frame);
      segment(from, to, top - .03, top + .03, frame);
      if (kind === 'window') {
        segment(from, to, bottom, bottom + .055, frame);
        sheet(from + .035, to - .035, bottom + .055, top - .035, glass);
        const middle = (from + to) / 2;
        segment(middle - .022, middle + .022, bottom + .055, top - .035, frame, .015, .065);
        for (const y of [1.13, 1.27, 1.41, 2.06, 2.20]) {
          if (y > bottom + .06 && y + .055 < top) sheet(from + .04, to - .04, y, y + .055, frost, .012);
        }
        segment(middle - .075, middle + .075, 1.48, 1.56, trim, .055, .025);
      } else {
        // Fixed open leaves: all portals stay physically empty and no leaf
        // transform changes while the camera moves or the walls fade.
        for (const leafSide of [-1, 1]) {
          const hinge = leafSide < 0 ? from : to, leaf = new THREE.Group();
          leaf.position.set(vertical ? fixed : hinge, 0, vertical ? hinge : fixed);
          leaf.rotation.y = (vertical ? -Math.PI / 2 : 0) + (vertical ? -sign * leafSide : sign * leafSide) * 1.12;
          leaf.userData.fixedDoorLeaf = true; group.add(leaf);
          const leafWidth = (to - from) / 2, center = -leafSide * leafWidth / 2, doorTop = top - .05;
          const pane = new THREE.Mesh(sheetGeometry, glass); pane.scale.set(leafWidth - .055, doorTop - .09, 1);
          pane.position.set(center, doorTop / 2, 0); leaf.add(pane);
          for (const edge of [center - leafWidth / 2, center + leafWidth / 2]) meshBox(.035, doorTop, .055, edge, doorTop / 2, 0, frame, leaf);
          for (const y of [.025, doorTop - .025]) meshBox(leafWidth, .05, .055, center, y, 0, frame, leaf);
          for (const y of [1.06, 1.2, 1.34, 2.0, 2.14]) {
            if (y + .055 >= doorTop) continue;
            const stripe = new THREE.Mesh(sheetGeometry, frost); stripe.scale.set(leafWidth - .07, .055, 1);
            stripe.position.set(center, y, .012); leaf.add(stripe);
          }
          meshBox(.025, .23, .065, center - leafSide * .16, 1.04, .055, trim, leaf);
        }
      }
      cursor = Math.max(cursor, to);
    }
    segment(cursor, length / 2, 0, h, wall);
    let skirtStart = -length / 2;
    for (const opening of apertures.filter(aperture => aperture.kind === 'door')) {
      segment(skirtStart, opening.from, .015, .09, trim, .075, .025); skirtStart = opening.to;
    }
    segment(skirtStart, length / 2, .015, .09, trim, .075, .025);
  }
  const direction = new THREE.Vector3();
  return {
    walls, groups, openings,
    update: (camera: THREE.Camera, top: boolean, dt: number) => {
      direction.set(camera.position.x, 0, camera.position.z);
      if (direction.lengthSq() < .00001) direction.set(-1, 0, 1);
      direction.normalize(); let settling = false;
      for (const state of walls) {
        state.group.scale.y = top ? .08 : 1;
        const target = top ? 0 : THREE.MathUtils.smoothstep(direction.dot(state.normal), .06, .26);
        const fade = state.initialized ? THREE.MathUtils.damp(state.fade, target, 11, Math.max(0, Math.min(dt, .1))) : target;
        state.initialized = true;
        state.fade = Math.abs(fade - target) < .0005 ? target : fade;
        if (Math.abs(state.fade - target) >= .0005) settling = true;
        for (const entry of state.materials) entry.material.opacity = THREE.MathUtils.lerp(entry.base, entry.faded, state.fade);
      }
      return settling;
    },
  };
}
