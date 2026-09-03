"use client";

import Link from "next/link";
import { CSSProperties, useMemo, useState } from "react";
import { CampusModelViewer } from "@/components/CampusModelViewer";
import { floorLabels, labs } from "@/data/labs";
import { findCampusPath } from "@/lib/campusNavmesh";

type ExplorerMode = "building" | "floors";
type PlanPoint = { x: number; y: number };
type DoorSide = "top" | "right" | "bottom" | "left";
type StairId = "CT1" | "CT2";
type ConnectionId = StairId | "LIFT";
type RouteLocation = { id: string; label: string; floor: string; room: string; point: PlanPoint };
type PlanRoom = {
  rooms: string[];
  label: string;
  style: CSSProperties;
  door: { side: DoorSide; position: number; double?: boolean };
  point: PlanPoint;
  kind?: "room" | "lounge";
};
type StairSpec = {
  id: StairId;
  point: PlanPoint;
  style: CSSProperties;
  direction: "up" | "down" | "both";
  orientation: "horizontal" | "vertical";
};
type FloorPlanSpec = {
  rooms: PlanRoom[];
  stairs: StairSpec[];
  columns: PlanPoint[];
  variant: "ground" | "typical" | "combined" | "top";
};

const FLOORS = ["7", "6", "5", "4", "3", "2", "1", "0"];
const FLOOR_DEPTH = 54;

const rect = (left: string, top: string, width: string, height: string, clipPath?: string): CSSProperties => ({
  left, top, width, height, ...(clipPath ? { clipPath } : {}),
});

const typicalPlan = (floor: string): FloorPlanSpec => ({
  variant: "typical",
  rooms: [
    {
      rooms: [`E${floor}03`], label: `E${floor}03`,
      style: rect("7%", "35%", "22%", "48%", "polygon(2% 0,100% 0,100% 100%,0 94%)"),
      door: { side: "top", position: 18, double: true }, point: { x: 11, y: 35 },
    },
    {
      rooms: [`E${floor}02`], label: `E${floor}02`,
      style: rect("30%", "35%", "29%", "50%", "polygon(0 0,91% 0,100% 8%,100% 100%,0 91%)"),
      door: { side: "top", position: 48, double: true }, point: { x: 44, y: 35 },
    },
    {
      rooms: [`E${floor}04`], label: `E${floor}04`, style: rect("60%", "8%", "31%", "29%"),
      door: { side: "left", position: 22, double: true }, point: { x: 60, y: 14 },
    },
    {
      rooms: [`E${floor}01`], label: `E${floor}01`,
      style: rect("74%", "39%", "18%", "48%", "polygon(0 0,100% 0,100% 100%,0 94%)"),
      door: { side: "left", position: 36 }, point: { x: 74, y: 56 },
    },
  ],
  stairs: [
    { id: "CT2", point: { x: 31, y: 31 }, style: rect("12%", "10%", "19%", "22%"), direction: "both", orientation: "horizontal" },
    { id: "CT1", point: { x: 66, y: 62 }, style: rect("60%", "39%", "13%", "23%"), direction: "both", orientation: "vertical" },
  ],
  columns: [
    { x: 8, y: 12 }, { x: 29, y: 12 }, { x: 59, y: 12 }, { x: 74, y: 12 }, { x: 91, y: 12 },
    { x: 8, y: 35 }, { x: 29, y: 35 }, { x: 59, y: 35 }, { x: 74, y: 38 }, { x: 91, y: 38 },
    { x: 8, y: 82 }, { x: 29, y: 83 }, { x: 59, y: 85 }, { x: 74, y: 87 }, { x: 91, y: 89 },
  ],
});

const floorFour = typicalPlan("4");
floorFour.variant = "combined";
floorFour.rooms = [
  {
    rooms: ["E402", "E403"], label: "E402 · E403",
    style: rect("7%", "35%", "52%", "50%", "polygon(1% 0,95% 0,100% 8%,100% 100%,0 92%)"),
    door: { side: "top", position: 48, double: true }, point: { x: 32, y: 35 },
  },
  ...floorFour.rooms.filter((room) => room.label === "E404" || room.label === "E401"),
];

const floorSix = typicalPlan("6");
floorSix.variant = "combined";
floorSix.rooms = [
  {
    rooms: ["E602", "E603"], label: "E602 · E603",
    style: rect("7%", "35%", "52%", "50%", "polygon(1% 0,95% 0,100% 8%,100% 100%,0 92%)"),
    door: { side: "top", position: 48, double: true }, point: { x: 32, y: 35 },
  },
  ...floorSix.rooms.filter((room) => room.label === "E604" || room.label === "E601"),
];

const FLOOR_PLANS: Record<string, FloorPlanSpec> = {
  "0": {
    variant: "ground",
    rooms: [
      {
        rooms: ["E002"], label: "E002",
        style: rect("6%", "38%", "23%", "45%", "polygon(5% 0,100% 0,100% 100%,0 94%)"),
        door: { side: "right", position: 20 }, point: { x: 29, y: 47 },
      },
      {
        rooms: ["E001"], label: "E001",
        style: rect("30%", "62%", "18%", "22%", "polygon(0 0,100% 0,100% 100%,0 88%)"),
        door: { side: "left", position: 14 }, point: { x: 30, y: 65 },
      },
    ],
    stairs: [
      { id: "CT2", point: { x: 29, y: 33 }, style: rect("12%", "12%", "17%", "22%"), direction: "up", orientation: "horizontal" },
      { id: "CT1", point: { x: 52, y: 62 }, style: rect("45%", "40%", "14%", "23%"), direction: "up", orientation: "vertical" },
    ],
    columns: [
      { x: 7, y: 13 }, { x: 29, y: 13 }, { x: 47, y: 13 }, { x: 60, y: 13 }, { x: 75, y: 13 }, { x: 92, y: 13 },
      { x: 7, y: 37 }, { x: 29, y: 37 }, { x: 47, y: 37 }, { x: 60, y: 37 }, { x: 75, y: 37 }, { x: 92, y: 37 },
      { x: 7, y: 82 }, { x: 29, y: 83 }, { x: 48, y: 85 }, { x: 61, y: 87 }, { x: 75, y: 89 }, { x: 92, y: 91 },
    ],
  },
  "1": typicalPlan("1"), "2": typicalPlan("2"), "3": typicalPlan("3"), "4": floorFour,
  "5": typicalPlan("5"), "6": floorSix,
  "7": {
    variant: "top",
    rooms: [
      {
        rooms: ["E702"], label: "E702",
        style: rect("8%", "35%", "30%", "35%", "polygon(2% 0,100% 0,100% 100%,0 94%)"),
        door: { side: "right", position: 42 }, point: { x: 38, y: 50 },
      },
      {
        rooms: ["E701"], label: "E701", style: rect("64%", "33%", "18%", "37%"),
        door: { side: "left", position: 42 }, point: { x: 64, y: 49 },
      },
      {
        rooms: ["E7 Hall"], label: "SẢNH / LOUNGE", style: rect("39%", "8%", "51%", "21%"),
        door: { side: "bottom", position: 62 }, point: { x: 71, y: 29 }, kind: "lounge",
      },
    ],
    stairs: [{ id: "CT1", point: { x: 62, y: 51 }, style: rect("48%", "36%", "15%", "22%"), direction: "down", orientation: "vertical" }],
    columns: [
      { x: 8, y: 12 }, { x: 38, y: 12 }, { x: 63, y: 12 }, { x: 82, y: 12 }, { x: 91, y: 12 },
      { x: 8, y: 35 }, { x: 38, y: 35 }, { x: 63, y: 35 }, { x: 82, y: 35 }, { x: 91, y: 35 },
      { x: 8, y: 70 }, { x: 38, y: 72 }, { x: 63, y: 75 }, { x: 82, y: 78 }, { x: 91, y: 80 },
    ],
  },
};

function floorName(floor: string) { return floor === "0" ? "Tầng trệt" : `Tầng ${floor}`; }
function floorCode(floor: string) { return floor === "0" ? "GF" : `F${floor}`; }
function planRoomFor(room: string, floor: string) { return FLOOR_PLANS[floor]?.rooms.find((spec) => spec.rooms.includes(room)); }
function doorPointForRoom(room: string, floor: string): PlanPoint { return planRoomFor(room, floor)?.point ?? { x: 50, y: 50 }; }
function stairSpec(floor: string, stair: StairId) { return FLOOR_PLANS[floor].stairs.find((item) => item.id === stair); }
const LIFT_STOPS = new Set(["0", "4", "5", "6", "7"]);
const liftPoint = (floor: string): PlanPoint => floor === "0" ? { x: 54, y: 72 } : { x: 54, y: 70 };
const hasLiftStop = (floor: string) => LIFT_STOPS.has(floor);
const canUseLift = (startFloor: string, destinationFloor: string) => hasLiftStop(startFloor) && hasLiftStop(destinationFloor) && startFloor !== destinationFloor;

type CorridorNode = { id: string; point: PlanPoint; links: string[] };
const TYPICAL_CORRIDOR: CorridorNode[] = [
  { id: "west", point: { x: 30, y: 33 }, links: ["middle", "ct2"] },
  { id: "middle", point: { x: 47, y: 33 }, links: ["west", "east"] },
  { id: "east", point: { x: 58, y: 33 }, links: ["middle", "coreWest", "e104"] },
  { id: "e104", point: { x: 58, y: 14 }, links: ["east"] },
  { id: "coreWest", point: { x: 58, y: 65 }, links: ["east", "coreSouth", "liftGate"] },
  { id: "coreSouth", point: { x: 66, y: 65 }, links: ["coreWest", "s5", "ct1"] },
  { id: "s5", point: { x: 72, y: 65 }, links: ["coreSouth", "e101"] },
  { id: "e101", point: { x: 72, y: 56 }, links: ["s5"] },
  { id: "liftGate", point: { x: 58, y: 70 }, links: ["coreWest", "lift"] },
  { id: "lift", point: { x: 54, y: 70 }, links: ["liftGate"] },
  { id: "ct1", point: { x: 66, y: 62 }, links: ["coreSouth"] },
  { id: "ct2", point: { x: 31, y: 31 }, links: ["west"] },
];

function shortestCorridorPath(fromId: string, toId: string): PlanPoint[] {
  if (fromId === toId) return [];
  const byId = new Map(TYPICAL_CORRIDOR.map((node) => [node.id, node]));
  const queue = [fromId];
  const previous = new Map<string, string>();
  const visited = new Set([fromId]);
  while (queue.length) {
    const current = queue.shift()!;
    if (current === toId) break;
    for (const next of byId.get(current)?.links ?? []) {
      if (visited.has(next)) continue;
      visited.add(next); previous.set(next, current); queue.push(next);
    }
  }
  const ids: string[] = [];
  let cursor = toId;
  while (cursor !== fromId && previous.has(cursor)) { ids.unshift(cursor); cursor = previous.get(cursor)!; }
  return ids.map((id) => byId.get(id)!.point);
}

function roomCorridorEntry(location: RouteLocation): { points: PlanPoint[]; node: string } {
  if (location.floor === "0") {
    if (location.id === "entrance") return { points: [location.point, { x: 78, y: 58 }], node: "groundEast" };
    if (location.room === "E002") return { points: [location.point, { x: 37, y: 47 }, { x: 37, y: 58 }], node: "groundMid" };
    return { points: [location.point, { x: 38, y: 65 }, { x: 38, y: 58 }], node: "groundMid" };
  }
  if (location.floor === "7") {
    if (location.room === "E702") return { points: [location.point, { x: 47, y: 50 }], node: "topWest" };
    if (location.room === "E701") return { points: [location.point, { x: 62, y: 49 }], node: "topEast" };
    return { points: [location.point, { x: 71, y: 32 }], node: "topEast" };
  }
  const digit = location.room.match(/(\d)$/)?.[1];
  if (digit === "3") return { points: [location.point, { x: location.point.x, y: 33 }, { x: 30, y: 33 }], node: "west" };
  if (digit === "2") return { points: [location.point, { x: location.point.x, y: 33 }, { x: 47, y: 33 }], node: "middle" };
  if (digit === "4") return { points: [location.point, { x: 58, y: location.point.y }, { x: 58, y: 14 }], node: "e104" };
  return { points: [location.point, { x: 72, y: location.point.y }, { x: 72, y: 56 }], node: "e101" };
}

function connectionNode(connection: ConnectionId) { return connection === "LIFT" ? "lift" : connection.toLowerCase(); }

function routeToConnection(location: RouteLocation, connection: ConnectionId): PlanPoint[] {
  const target = connection === "LIFT" ? liftPoint(location.floor) : stairSpec(location.floor, connection)?.point ?? location.point;
  const entry = roomCorridorEntry(location);
  const corridorStart = entry.points.at(-1) ?? location.point;
  const navmeshPath = findCampusPath(location.floor, corridorStart, target);
  if (navmeshPath.length >= 2) return [...entry.points, ...navmeshPath.slice(1)];
  if (location.floor === "0") {
    if (connection === "CT2") return [...entry.points, { x: 37, y: 58 }, { x: 37, y: 33 }, target];
    if (connection === "LIFT") return [...entry.points, { x: 64, y: 58 }, { x: 64, y: 72 }, target];
    return [...entry.points, { x: 58, y: 58 }, { x: 58, y: 62 }, target];
  }
  if (location.floor === "7") {
    if (connection === "LIFT") return [...entry.points, { x: 62, y: 69 }, target];
    return [...entry.points, { x: 62, y: entry.points.at(-1)!.y }, target];
  }
  return [...entry.points, ...shortestCorridorPath(entry.node, connectionNode(connection))];
}

function routeBetweenLocations(start: RouteLocation, destination: RouteLocation): PlanPoint[] {
  const from = roomCorridorEntry(start);
  const to = roomCorridorEntry(destination);
  const navmeshPath = findCampusPath(start.floor, from.points.at(-1) ?? start.point, to.points.at(-1) ?? destination.point);
  if (navmeshPath.length >= 2) return [...from.points, ...navmeshPath.slice(1, -1), ...to.points.slice().reverse()];
  if (start.floor === "0") {
    return [...from.points, { x: 58, y: 58 }, { x: 38, y: 58 }, ...to.points.slice().reverse()];
  }
  if (start.floor === "7") {
    return [...from.points, { x: 62, y: 50 }, ...to.points.slice().reverse()];
  }
  return [...from.points, ...shortestCorridorPath(from.node, to.node), ...to.points.slice(0, -1).reverse()];
}

function reversePath(points: PlanPoint[]) { return [...points].reverse(); }
function doorStyle(side: DoorSide, position: number): CSSProperties {
  if (side === "top" || side === "bottom") return { left: `${position}%`, [side]: "-1px" };
  return { top: `${position}%`, [side]: "-1px" };
}

function RouteTrace({ points }: { points?: PlanPoint[] }) {
  if (!points || points.length < 2) return null;
  const polyline = points.map((point) => `${point.x},${point.y}`).join(" ");
  return (
    <div className="tch-route-trace" aria-hidden="true">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none"><polyline points={polyline} /></svg>
      <i className="tch-route-point is-start" style={{ left: `${points[0].x}%`, top: `${points[0].y}%` }} />
      <i className="tch-route-point is-end" style={{ left: `${points.at(-1)!.x}%`, top: `${points.at(-1)!.y}%` }} />
    </div>
  );
}

function FloorPlanGraphic({ floor, locations, routePoints, activeConnection, interactive = false, destinationId, onDestination, compact = false }: {
  floor: string; locations: RouteLocation[]; routePoints?: PlanPoint[]; activeConnection?: ConnectionId;
  interactive?: boolean; destinationId?: string; onDestination?: (id: string) => void; compact?: boolean;
}) {
  const plan = FLOOR_PLANS[floor];
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const topViewCode = floor === "0" ? "gf" : `f${floor}`;
  return (
    <div className={`tch-clean-plan has-topview plan-${plan.variant} floor-${floor}${compact ? " is-compact" : ""}`}>
      <img className="tch-plan-topview" src={`${basePath}/models/campus-e/topviews/campus-e-${topViewCode}-top.png`} alt={`Mặt bằng Top View ${floorName(floor)} từ mô hình SketchUp Campus E`} loading="lazy" />
      <div className="tch-plan-shell" aria-hidden="true" />
      <div className="tch-plan-hall hall-s4" aria-hidden="true"><span>S4</span></div>
      <div className="tch-plan-hall hall-s5" aria-hidden="true"><span>{floor === "0" ? "SẢNH" : floor === "7" ? "LOUNGE" : "S5"}</span></div>
      <div className={`tch-service-core${hasLiftStop(floor) ? " has-stop" : " is-skip-stop"}${activeConnection === "LIFT" ? " is-route-lift" : ""}`} aria-label={hasLiftStop(floor) ? `Thang máy có dừng tại ${floorName(floor)}` : `Thang máy không dừng tại ${floorName(floor)}`}>
        <i /><span>LIFT</span><strong>{floor === "0" ? "GF ↕ F4–F7" : hasLiftStop(floor) ? "CÓ DỪNG" : "KHÔNG DỪNG"}</strong><b />
      </div>
      {floor !== "0" && floor !== "7" && <div className="tch-plan-toilets" aria-label={`Khu vệ sinh ${floorName(floor)}`}><span>WC NAM</span><span>WC NỮ</span></div>}
      {plan.stairs.map((stair) => (
        <div className={`tch-plan-stair stair-${stair.id.toLowerCase()} orientation-${stair.orientation}${activeConnection === stair.id ? " is-route-stair" : ""}`} style={stair.style} key={stair.id}>
          <span>{stair.id}</span>
          <div className="tch-stair-flights" aria-hidden="true">
            <div className="tch-stair-flight flight-a">{Array.from({ length: 6 }, (_, index) => <i key={`a-${index}`} />)}</div>
            <div className="tch-stair-landing" />
            <div className="tch-stair-flight flight-b">{Array.from({ length: 6 }, (_, index) => <i key={`b-${index}`} />)}</div>
          </div>
          <b>{stair.orientation === "horizontal" ? (stair.direction === "up" ? "→" : stair.direction === "down" ? "←" : "↔") : (stair.direction === "up" ? "↑" : stair.direction === "down" ? "↓" : "↕")}</b>
          <small>{stair.direction === "up" ? "LÊN" : stair.direction === "down" ? "XUỐNG" : "LÊN / XUỐNG"}</small>
        </div>
      ))}
      {plan.columns.map((point) => <i className="tch-plan-column" key={`${point.x}-${point.y}`} style={{ left: `${point.x}%`, top: `${point.y}%` }} />)}
      {plan.rooms.map((roomSpec) => {
        const roomLocations = locations.filter((location) => roomSpec.rooms.includes(location.room));
        const primary = roomLocations[0];
        const selected = roomLocations.some((location) => location.id === destinationId);
        const content = <><span>{roomSpec.label}</span><i className={`tch-room-door door-${roomSpec.door.side}${roomSpec.door.double ? " is-double" : ""}`} style={doorStyle(roomSpec.door.side, roomSpec.door.position)} aria-hidden="true"><b /><em /></i></>;
        const className = `tch-plan-room${roomSpec.kind === "lounge" ? " is-lounge" : ""}${selected ? " is-selected" : ""}`;
        return interactive && primary ? <button className={className} style={roomSpec.style} key={roomSpec.label} onClick={() => onDestination?.(primary.id)} title={primary.label}>{content}</button>
          : <div className={className} style={roomSpec.style} key={roomSpec.label}>{content}</div>;
      })}
      <RouteTrace points={routePoints} />
      <div className="tch-plan-north" aria-hidden="true"><i />N</div>
    </div>
  );
}

function StairFlight3D({ startFloor, destinationFloor, stair }: { startFloor: string; destinationFloor: string; stair: StairId }) {
  const minFloor = Math.min(Number(startFloor), Number(destinationFloor));
  const maxFloor = Math.max(Number(startFloor), Number(destinationFloor));
  const transitions = Math.max(1, maxFloor - minFloor);
  const count = transitions * 7 + 1;
  const anchor = stairSpec(startFloor, stair)?.point ?? stairSpec(destinationFloor, stair)?.point ?? { x: 60, y: 50 };
  return (
    <div className={`tch-3d-stair-flight stair-${stair.toLowerCase()}`} style={{ left: `${anchor.x}%`, top: `${anchor.y}%` }} aria-label={`Tuyến bậc thang ${stair} từ ${floorCode(startFloor)} đến ${floorCode(destinationFloor)}`}>
      {Array.from({ length: count }, (_, index) => {
        const progress = index / (count - 1);
        const depth = minFloor * FLOOR_DEPTH + progress * transitions * FLOOR_DEPTH;
        const stepOffset = (index % 7) * 2.4;
        return <i key={index} style={{ transform: `translate3d(${stepOffset}px, ${-stepOffset}px, ${depth}px)` }} />;
      })}
      <span className="tch-3d-flight-label is-start" style={{ transform: `translate3d(12px, -8px, ${Number(startFloor) * FLOOR_DEPTH}px)` }}>{floorCode(startFloor)}</span>
      <span className="tch-3d-flight-label is-end" style={{ transform: `translate3d(12px, -8px, ${Number(destinationFloor) * FLOOR_DEPTH}px)` }}>{floorCode(destinationFloor)}</span>
      <strong>{stair}</strong>
    </div>
  );
}

function ElevatorFlight3D({ startFloor, destinationFloor }: { startFloor: string; destinationFloor: string }) {
  const minFloor = Math.min(Number(startFloor), Number(destinationFloor));
  const maxFloor = Math.max(Number(startFloor), Number(destinationFloor));
  const transitions = Math.max(1, maxFloor - minFloor);
  const count = transitions * 5 + 1;
  const anchor = liftPoint(startFloor);
  const routeStops = Array.from(LIFT_STOPS).filter((floor) => Number(floor) >= minFloor && Number(floor) <= maxFloor);
  return (
    <div className="tch-3d-elevator-flight" style={{ left: `${anchor.x}%`, top: `${anchor.y}%` }} aria-label={`Tuyến thang máy từ ${floorCode(startFloor)} đến ${floorCode(destinationFloor)}, chỉ dừng GF và F4 đến F7`}>
      {Array.from({ length: count }, (_, index) => {
        const progress = index / (count - 1);
        const depth = minFloor * FLOOR_DEPTH + progress * transitions * FLOOR_DEPTH;
        return <i key={index} style={{ transform: `translate3d(0, 0, ${depth}px)` }} />;
      })}
      {routeStops.map((floor) => <span key={floor} style={{ transform: `translate3d(12px, -8px, ${Number(floor) * FLOOR_DEPTH}px)` }}>{floorCode(floor)}</span>)}
      <strong>LIFT</strong>
    </div>
  );
}

export function OrbitMap() {
  const locations = useMemo<RouteLocation[]>(() => {
    const uniqueRooms = new Map<string, RouteLocation>();
    labs.forEach((lab) => lab.room.split(",").map((room) => room.trim()).filter(Boolean).forEach((room) => {
      const key = `${lab.floor}-${room}`;
      if (!uniqueRooms.has(key)) uniqueRooms.set(key, {
        id: `room-${room.toLowerCase().replace(/\s+/g, "-")}`, label: `${room} · ${lab.name}`,
        floor: lab.floor, room, point: doorPointForRoom(room, lab.floor),
      });
    }));
    return [{ id: "entrance", label: "Sảnh chính · Tầng trệt", floor: "0", room: "Sảnh chính", point: { x: 92, y: 58 } },
      ...Array.from(uniqueRooms.values()).sort((a, b) => Number(a.floor) - Number(b.floor) || a.room.localeCompare(b.room))];
  }, []);
  const modelRoomAnchors = useMemo(() => Object.fromEntries(FLOORS.map((floor) => [
    floor,
    locations.filter((item) => item.floor === floor).map((item) => ({ id: item.room, label: item.label, point: item.point })),
  ])), [locations]);

  const [mode, setMode] = useState<ExplorerMode>("building");
  const [exploded, setExploded] = useState(false);
  const [activeFloor, setActiveFloor] = useState("1");
  const [startId, setStartId] = useState("entrance");
  const [destinationId, setDestinationId] = useState("room-e101");
  const start = locations.find((item) => item.id === startId) ?? locations[0];
  const destination = locations.find((item) => item.id === destinationId) ?? locations[1];
  const destinationLabs = useMemo(() => labs.filter((lab) => lab.floor === destination.floor
    && lab.room.split(",").map((room) => room.trim()).includes(destination.room)), [destination.floor, destination.room]);
  const destinationLab = destinationLabs[0];
  const destinationTags = useMemo(() => Array.from(new Set(destinationLabs.flatMap((lab) => [...lab.apps, ...lab.tech]))).slice(0, 4), [destinationLabs]);

  const route = useMemo(() => {
    const sameFloor = start.floor === destination.floor;
    const useLift = !sameFloor && canUseLift(start.floor, destination.floor);
    const commonStairs = FLOOR_PLANS[start.floor].stairs.map((item) => item.id).filter((id) => FLOOR_PLANS[destination.floor].stairs.some((item) => item.id === id));
    const stair = (commonStairs.length ? commonStairs : ["CT1"] as StairId[]).reduce((best, candidate) => {
      const startPoint = stairSpec(start.floor, candidate)?.point ?? start.point;
      const endPoint = stairSpec(destination.floor, candidate)?.point ?? destination.point;
      const candidateCost = Math.abs(start.point.x - startPoint.x) + Math.abs(start.point.y - startPoint.y) + Math.abs(destination.point.x - endPoint.x) + Math.abs(destination.point.y - endPoint.y);
      const bestStart = stairSpec(start.floor, best)?.point ?? start.point;
      const bestEnd = stairSpec(destination.floor, best)?.point ?? destination.point;
      const bestCost = Math.abs(start.point.x - bestStart.x) + Math.abs(start.point.y - bestStart.y) + Math.abs(destination.point.x - bestEnd.x) + Math.abs(destination.point.y - bestEnd.y);
      return candidateCost < bestCost ? candidate : best;
    }, commonStairs[0] ?? "CT1") as StairId;
    const connection: ConnectionId = useLift ? "LIFT" : stair;
    const pathsByFloor: Record<string, PlanPoint[]> = {};
    if (sameFloor) {
      pathsByFloor[start.floor] = routeBetweenLocations(start, destination);
    } else {
      pathsByFloor[start.floor] = routeToConnection(start, connection);
      pathsByFloor[destination.floor] = reversePath(routeToConnection(destination, connection));
    }
    const startLabel = start.room === "Sảnh chính" ? "sảnh chính" : `cửa ${start.room}`;
    const direction = Number(destination.floor) > Number(start.floor) ? "lên" : "xuống";
    const steps = sameFloor ? [`Rời ${startLabel}`, `Theo sảnh và hành lang, đi vòng lõi thang`, `Dừng ngay trước cửa ${destination.room}`]
      : useLift
        ? [`Từ ${startLabel}, theo tuyến cam đến thang máy`, `Vào thang máy tại ${floorCode(start.floor)}`, `Di chuyển ${direction} ${floorCode(destination.floor)} · chỉ dừng GF và F4–F7`, `Ra thang máy và theo hành lang`, `Dừng ngay trước cửa ${destination.room}`]
        : [`Từ ${startLabel}, theo tuyến cam đến sảnh thang ${stair}`, `Vào ${stair} tại ${floorCode(start.floor)}`, `Đi theo các vế thang và chiếu nghỉ ${direction} ${floorCode(destination.floor)}`, `Ra khỏi ${stair} tại ${floorCode(destination.floor)} và theo hành lang`, `Dừng ngay trước cửa ${destination.room}`];
    return { sameFloor, stair, connection, useLift, pathsByFloor, steps };
  }, [start, destination]);

  const roomsByFloor = (floor: string) => locations.filter((item) => item.floor === floor && item.id !== "entrance");
  const chooseFloor = (floor: string) => { setActiveFloor(floor); setMode("floors"); };
  const chooseStart = (id: string) => {
    setStartId(id);
    const next = locations.find((item) => item.id === id);
    if (next) { setActiveFloor(next.floor); setMode("floors"); }
  };
  const chooseDestination = (id: string) => {
    setDestinationId(id);
    const next = locations.find((item) => item.id === id);
    if (next) { setActiveFloor(next.floor); setMode("floors"); }
  };

  return (
    <section className="tch-campus-section" id="campus-explorer">
      <div className="tch-section-index"><strong>02</strong><span>Campus explorer</span></div>
      <div className="tch-campus-heading"><p>Eight connected levels · one shared infrastructure</p><h2>Khám phá hub <em>theo từng tầng.</em></h2><span>Mặt bằng được dựng lại theo đúng khối phòng, cửa, sảnh thang và hướng lên xuống của Cơ sở E.</span></div>
      <div className="tch-explorer-toolbar" role="group" aria-label="Chế độ khám phá Campus E"><button className={mode === "building" ? "is-active" : ""} onClick={() => setMode("building")}>3D Building</button><button className={mode === "floors" ? "is-active" : ""} onClick={() => setMode("floors")}>Mặt bằng tầng</button><span>{mode === "building" ? (exploded ? "Các tầng đang tách để quan sát" : "Toàn bộ Campus E đang ở dạng một khối") : `${floorName(activeFloor)} · chọn phòng trực tiếp trên mặt bằng`}</span></div>
      <div className={`tch-building-explorer mode-${mode}`}>
        {mode === "building" ? <div className="tch-building-panel is-model-viewer">
          <div className="tch-building-viewport is-webgl-viewer">
            <CampusModelViewer
              exploded={exploded}
              activeFloor={activeFloor}
              startFloor={start.floor}
              destinationFloor={destination.floor}
              routePaths={route.pathsByFloor}
              connection={route.sameFloor ? undefined : route.connection}
              roomAnchors={modelRoomAnchors}
              onFloorSelect={chooseFloor}
            />
            {exploded && <nav className="tch-building-floor-shortcuts" aria-label="Mở nhanh mặt bằng tầng">{FLOORS.map((floor) => <button key={floor} onClick={() => chooseFloor(floor)}>{floorCode(floor)}</button>)}</nav>}
          </div>
          <div className="tch-building-controls"><span>{exploded ? "Kéo để xoay · cuộn để phóng to · bấm nhẹ vào tầng để mở mặt bằng" : "Kéo để xoay · cuộn để phóng to · tách tầng trước khi chọn mặt bằng"}</span><button type="button" className={exploded ? "is-active" : ""} onClick={() => setExploded((value) => !value)}>{exploded ? "Ghép lại thành một khối" : "Tách các tầng để khám phá"}</button></div>
        </div> : <div className="tch-floor-browser">
          <nav className="tch-floor-tabs" aria-label="Chọn tầng">{FLOORS.slice().reverse().map((floor) => <button className={activeFloor === floor ? "is-active" : ""} key={floor} onClick={() => setActiveFloor(floor)}><span>{floorCode(floor)}</span>{floorName(floor)}</button>)}</nav>
          <div className="tch-floor-workspace">
            <section className="tch-room-intro-card" aria-live="polite" key={destination.id}>
              <div className="tch-room-intro-code"><span>Phòng đã chọn</span><strong>{destination.room}</strong><em>{floorCode(destination.floor)}</em></div>
              <div className="tch-room-intro-copy"><span>{destinationLabs.length > 1 ? `${destinationLabs.length} chức năng trong cùng không gian` : "Room profile"}</span><h3>{destinationLab?.name ?? destination.label.split(" · ")[1]}</h3><p>{destinationLab?.desc ?? `Không gian ${destination.room} thuộc ${floorName(destination.floor)}, phục vụ hoạt động nghiên cứu, đào tạo và kết nối dự án.`}</p>
                {destinationTags.length > 0 && <div className="tch-room-intro-tags">{destinationTags.map((tag) => <i key={tag}>{tag}</i>)}</div>}
                {destinationLab && <Link href={`/labs/${destinationLab.id}`}>Xem hồ sơ chi tiết <b>→</b></Link>}
              </div>
            </section>
            <div className="tch-plan-panel"><div className="tch-plan-meta"><span>Mặt bằng đang xem</span><strong>{floorName(activeFloor)}</strong><p>{floorLabels[activeFloor]}</p></div>
              <div className="tch-plan-canvas"><FloorPlanGraphic floor={activeFloor} locations={roomsByFloor(activeFloor)} routePoints={route.pathsByFloor[activeFloor]} activeConnection={!route.sameFloor && (activeFloor === start.floor || activeFloor === destination.floor) ? route.connection : undefined} interactive destinationId={destinationId} onDestination={chooseDestination} /></div>
              <div className="tch-floor-room-list">{roomsByFloor(activeFloor).map((room, index) => <button key={room.id} onClick={() => chooseDestination(room.id)} className={destinationId === room.id ? "is-active" : ""}><span>{String(index + 1).padStart(2, "0")}</span><strong>{room.room}</strong><em>{room.label.split(" · ")[1]}</em></button>)}</div>
            </div>
            <WayfindingPanel />
          </div>
        </div>}
        {mode === "building" && <WayfindingPanel />}
      </div>
    </section>
  );

  function WayfindingPanel() {
    return <aside className="tch-wayfinding-panel">
          <div className="tch-wayfinding-controls"><div className="tch-wayfinding-title"><span>Door-to-door wayfinding</span><strong>Đi đúng cửa · đúng thang · đúng tầng</strong></div>
            <label>Điểm bắt đầu<select value={startId} onChange={(event) => chooseStart(event.target.value)}><option value="entrance">Sảnh chính · Tầng trệt</option>{FLOORS.slice().reverse().map((floor) => <optgroup label={floorName(floor)} key={floor}>{roomsByFloor(floor).map((room) => <option value={room.id} key={room.id}>{room.label}</option>)}</optgroup>)}</select></label>
            <label>Điểm đến<select value={destinationId} onChange={(event) => chooseDestination(event.target.value)}>{FLOORS.slice().reverse().map((floor) => <optgroup label={floorName(floor)} key={floor}>{roomsByFloor(floor).map((room) => <option value={room.id} key={room.id}>{room.label}</option>)}</optgroup>)}</select></label>
          </div>
          <div className="tch-wayfinding-route"><ol>{route.steps.map((step, index) => <li key={step}><span>{String(index + 1).padStart(2, "0")}</span>{step}</li>)}</ol>
            <div className="tch-route-summary"><span>{route.sameFloor ? floorName(start.floor) : `${floorCode(start.floor)} → ${floorCode(destination.floor)}`}</span><strong>{route.sameFloor ? "Cùng tầng" : route.useLift ? "Thang máy · GF ↔ F4–F7" : `Bậc thang ${route.stair}`}</strong></div>
            <p className="tch-route-note">Tuyến cam bám theo cửa, sảnh và hành lang, không xuyên tường. Có hai cầu thang CT1–CT2; thang máy chỉ dừng GF và F4–F7. Chức năng định hướng, không thay thế sơ đồ thoát hiểm.</p>
            <Link href="/labs">Xem toàn bộ danh mục labs <span>→</span></Link>
          </div>
        </aside>;
  }
}

