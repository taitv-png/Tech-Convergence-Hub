import * as THREE from "three";
import { Pathfinding } from "three-pathfinding";

export type CampusPlanPoint = { x: number; y: number };

type Rect = { left: number; top: number; right: number; bottom: number };

const TYPICAL: Rect[] = [
  { left: 8, top: 29, right: 62, bottom: 38 },
  { left: 54, top: 10, right: 63, bottom: 72 },
  { left: 54, top: 53, right: 77, bottom: 73 },
  { left: 28, top: 27, right: 35, bottom: 38 },
];

const GROUND: Rect[] = [
  { left: 27, top: 53, right: 95, bottom: 64 },
  { left: 26, top: 29, right: 41, bottom: 69 },
  { left: 26, top: 43, right: 42, bottom: 61 },
  { left: 49, top: 53, right: 66, bottom: 75 },
];

const TOP: Rect[] = [
  { left: 35, top: 44, right: 67, bottom: 56 },
  { left: 59, top: 25, right: 75, bottom: 53 },
];

const FLOOR_RECTS: Record<string, Rect[]> = {
  "0": GROUND,
  "1": TYPICAL,
  "2": TYPICAL,
  "3": TYPICAL,
  "4": TYPICAL,
  "5": TYPICAL,
  "6": TYPICAL,
  "7": TOP,
};

function createGridNavmesh(rectangles: Rect[], cellSize = 1) {
  const vertices: number[] = [];
  const indices: number[] = [];
  const vertexByKey = new Map<string, number>();

  const vertex = (x: number, z: number) => {
    const key = `${x}:${z}`;
    const existing = vertexByKey.get(key);
    if (existing !== undefined) return existing;
    const index = vertices.length / 3;
    vertices.push(x, 0, z);
    vertexByKey.set(key, index);
    return index;
  };

  for (let x = 0; x < 100; x += cellSize) {
    for (let y = 0; y < 100; y += cellSize) {
      const centerX = x + cellSize / 2;
      const centerY = y + cellSize / 2;
      const navigable = rectangles.some((rect) => centerX >= rect.left && centerX <= rect.right && centerY >= rect.top && centerY <= rect.bottom);
      if (!navigable) continue;

      const a = vertex(x, y);
      const b = vertex(x + cellSize, y);
      const c = vertex(x + cellSize, y + cellSize);
      const d = vertex(x, y + cellSize);
      indices.push(a, c, b, a, d, c);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setIndex(indices);
  return geometry;
}

const pathfinding = new Pathfinding();
Object.entries(FLOOR_RECTS).forEach(([floor, rectangles]) => {
  const geometry = createGridNavmesh(rectangles);
  pathfinding.setZoneData(`campus-e-${floor}`, Pathfinding.createZone(geometry));
  geometry.dispose();
});

export function findCampusPath(floor: string, start: CampusPlanPoint, destination: CampusPlanPoint): CampusPlanPoint[] {
  const zone = `campus-e-${floor}`;
  const startVector = new THREE.Vector3(start.x, 0, start.y);
  const destinationVector = new THREE.Vector3(destination.x, 0, destination.y);
  const group = pathfinding.getGroup(zone, startVector);
  if (group === null || group === undefined) return [];
  const path = pathfinding.findPath(startVector, destinationVector, zone, group);
  if (!path?.length) return [];
  return [start, ...path.map((point) => ({ x: point.x, y: point.z }))];
}

export const campusNavmeshRules = {
  stairs: ["CT1", "CT2"] as const,
  elevatorStops: ["0", "4", "5", "6"] as const,
};
