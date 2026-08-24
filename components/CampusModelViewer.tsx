"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { ColladaLoader } from "three/examples/jsm/loaders/ColladaLoader.js";
import { CSS2DObject, CSS2DRenderer } from "three/examples/jsm/renderers/CSS2DRenderer.js";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

type PlanPoint = { x: number; y: number };
type ConnectionId = "CT1" | "CT2" | "LIFT";
type RoomAnchor = { id: string; label: string; point: PlanPoint };

type CampusModelViewerProps = {
  activeFloor: string;
  startFloor: string;
  destinationFloor: string;
  routePaths: Record<string, PlanPoint[]>;
  connection?: ConnectionId;
  roomAnchors: Record<string, RoomAnchor[]>;
  onFloorSelect: (floor: string) => void;
};

type FloorRecord = {
  container: THREE.Group;
  material: THREE.MeshStandardMaterial;
  bounds: THREE.Box3;
  floor: string;
};

const FLOORS = ["0", "1", "2", "3", "4", "5", "6", "7"];
const FLOOR_GAP = 7.2;
const ARCHITECTURE = new THREE.Color("#e9e4dc");
const STRUCTURE = new THREE.Color("#8f8b84");
const ROUTE = new THREE.Color("#ff914d");
const ROUTE_SECONDARY = new THREE.Color("#d5a3aa");

function floorNodePrefix(floor: string) {
  return floor === "0" ? "Campus_E_GF" : `Campus_E_F${floor}`;
}

function localPoint(record: FloorRecord, point: PlanPoint, height = 0.42) {
  const center = record.bounds.getCenter(new THREE.Vector3());
  const x = THREE.MathUtils.lerp(record.bounds.min.x, record.bounds.max.x, point.x / 100) - center.x;
  const z = THREE.MathUtils.lerp(record.bounds.max.z, record.bounds.min.z, point.y / 100) - center.z;
  return new THREE.Vector3(x, height, z);
}

function connectionPoint(floor: string, connection: ConnectionId): PlanPoint | null {
  if (connection === "LIFT") {
    if (!["0", "4", "5", "6"].includes(floor)) return null;
    return floor === "0" ? { x: 54, y: 72 } : { x: 54, y: 70 };
  }
  if (floor === "7") return connection === "CT1" ? { x: 62, y: 51 } : null;
  if (floor === "0") return connection === "CT1" ? { x: 52, y: 62 } : { x: 29, y: 33 };
  return connection === "CT1" ? { x: 66, y: 62 } : { x: 31, y: 31 };
}

function routeTube(points: THREE.Vector3[], color: THREE.Color, radius = 0.12) {
  if (points.length < 2) return null;
  const curve = new THREE.CurvePath<THREE.Vector3>();
  points.slice(1).forEach((point, index) => curve.add(new THREE.LineCurve3(points[index], point)));
  const geometry = new THREE.TubeGeometry(curve, Math.max(16, points.length * 8), radius, 7, false);
  const material = new THREE.MeshBasicMaterial({ color, depthTest: false, transparent: true, opacity: 0.96 });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.renderOrder = 20;
  return mesh;
}

export function CampusModelViewer({
  activeFloor,
  startFloor,
  destinationFloor,
  routePaths,
  connection,
  roomAnchors,
  onFloorSelect,
}: CampusModelViewerProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const floorRecordsRef = useRef(new Map<string, FloorRecord>());
  const routeLayerRef = useRef<THREE.Group | null>(null);
  const onFloorSelectRef = useRef(onFloorSelect);
  const [loadState, setLoadState] = useState<"loading" | "ready" | "error">("loading");

  onFloorSelectRef.current = onFloorSelect;

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x171717, 0.012);

    const camera = new THREE.PerspectiveCamera(34, 1, 0.05, 500);
    camera.position.set(44, 38, 54);

    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.1));
    renderer.setClearColor(0x171717, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.className = "tch-campus-webgl";
    host.appendChild(renderer.domElement);

    const labelRenderer = new CSS2DRenderer();
    labelRenderer.domElement.className = "tch-campus-label-layer";
    host.appendChild(labelRenderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.075;
    controls.target.set(0, 25, 0);
    controls.minDistance = 20;
    controls.maxDistance = 120;
    controls.maxPolarAngle = Math.PI * 0.49;

    scene.add(new THREE.HemisphereLight(0xfffaf5, 0x4a4642, 2.2));
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.8);
    keyLight.position.set(25, 55, 32);
    scene.add(keyLight);
    const rimLight = new THREE.DirectionalLight(0xff914d, 1.6);
    rimLight.position.set(-32, 30, -18);
    scene.add(rimLight);

    const building = new THREE.Group();
    scene.add(building);
    const routeLayer = new THREE.Group();
    routeLayerRef.current = routeLayer;
    scene.add(routeLayer);

    const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
    const loader = new ColladaLoader();
    let disposed = false;

    loader.loadAsync(`${basePath}/models/campus-e/campus-e-source.dae`).then((collada) => {
      if (disposed) return;
      if (!collada) throw new Error("Campus E DAE did not return a scene");
      collada.scene.updateMatrixWorld(true);

      FLOORS.forEach((floor) => {
        let source: THREE.Object3D | undefined;
        collada.scene.traverse((object) => {
          if (!source && typeof object.name === "string" && object.name.startsWith(floorNodePrefix(floor))) source = object;
        });
        if (!source) throw new Error(`Missing Campus E floor node ${floor}`);

        const rawBounds = new THREE.Box3().setFromObject(source);
        const center = rawBounds.getCenter(new THREE.Vector3());
        const material = new THREE.MeshStandardMaterial({
          color: ARCHITECTURE,
          roughness: 0.82,
          metalness: 0.03,
          transparent: true,
        });
        const floorGeometries: THREE.BufferGeometry[] = [];
        source.traverse((child) => {
          if (!(child instanceof THREE.Mesh) || !child.geometry) return;
          const geometry = child.geometry.index ? child.geometry.toNonIndexed() : child.geometry.clone();
          geometry.applyMatrix4(child.matrixWorld);
          Object.keys(geometry.attributes).forEach((attribute) => {
            if (attribute !== "position" && attribute !== "normal") geometry.deleteAttribute(attribute);
          });
          if (!geometry.getAttribute("normal")) geometry.computeVertexNormals();
          geometry.clearGroups();
          floorGeometries.push(geometry);
        });
        const mergedGeometry = mergeGeometries(floorGeometries, false);
        floorGeometries.forEach((geometry) => geometry.dispose());
        if (!mergedGeometry) throw new Error(`Could not merge Campus E floor geometry ${floor}`);

        const object = new THREE.Mesh(mergedGeometry, material);
        object.castShadow = false;
        object.receiveShadow = false;
        object.userData.floor = floor;
        object.position.set(-center.x, -rawBounds.min.y, -center.z);

        const container = new THREE.Group();
        container.position.y = Number(floor) * FLOOR_GAP;
        container.userData.floor = floor;
        container.add(object);
        building.add(container);

        const record: FloorRecord = { container, material, bounds: rawBounds, floor };
        floorRecordsRef.current.set(floor, record);

        (roomAnchors[floor] ?? []).forEach((room) => {
          const element = document.createElement("button");
          element.type = "button";
          element.className = "tch-model-room-label";
          element.textContent = room.id;
          element.title = room.label;
          element.addEventListener("click", (event) => {
            event.stopPropagation();
            onFloorSelectRef.current(floor);
          });
          const label = new CSS2DObject(element);
          label.position.copy(localPoint(record, room.point, 0.9));
          container.add(label);
        });
      });

      setLoadState("ready");
    }).catch((error) => {
      console.error("Campus E DAE load failed", error);
      if (!disposed) setLoadState("error");
    });

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const handlePointer = (event: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hit = raycaster.intersectObjects(building.children, true).find((item) => item.object.userData.floor);
      const floor = hit?.object.userData.floor as string | undefined;
      if (floor) onFloorSelectRef.current(floor);
    };
    renderer.domElement.addEventListener("pointerup", handlePointer);

    const resize = () => {
      const width = Math.max(320, host.clientWidth);
      const height = Math.max(420, host.clientHeight);
      renderer.setSize(width, height, false);
      labelRenderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    resize();

    let frame = 0;
    let lastRender = 0;
    let isVisible = true;
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    }, { rootMargin: "180px" });
    intersectionObserver.observe(host);
    const animate = (time = 0) => {
      frame = requestAnimationFrame(animate);
      if (!isVisible || document.hidden || time - lastRender < 32) return;
      lastRender = time;
      controls.update();
      renderer.render(scene, camera);
      labelRenderer.render(scene, camera);
    };
    animate();

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      renderer.domElement.removeEventListener("pointerup", handlePointer);
      controls.dispose();
      renderer.dispose();
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) object.geometry.dispose();
        if (object instanceof THREE.Mesh && object.material instanceof THREE.Material) object.material.dispose();
      });
      renderer.domElement.remove();
      labelRenderer.domElement.remove();
      floorRecordsRef.current.clear();
      routeLayerRef.current = null;
    };
  }, [roomAnchors]);

  useEffect(() => {
    const records = floorRecordsRef.current;
    const routeLayer = routeLayerRef.current;
    if (!routeLayer || loadState !== "ready") return;

    while (routeLayer.children.length) {
      const child = routeLayer.children.pop()!;
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();
        if (child.material instanceof THREE.Material) child.material.dispose();
      }
    }

    const routeFloors = new Set([startFloor, destinationFloor]);
    records.forEach((record, floor) => {
      const emphasized = routeFloors.has(floor) || floor === activeFloor;
      record.material.color.copy(emphasized ? ARCHITECTURE : STRUCTURE);
      record.material.opacity = emphasized ? 1 : 0.2;
      record.material.depthWrite = emphasized;
      record.container.traverse((object) => {
        if (!(object instanceof CSS2DObject)) return;
        const element = object.element as HTMLElement;
        element.classList.toggle("is-muted", !emphasized);
        element.classList.toggle("is-active-floor", floor === activeFloor);
      });
    });

    Object.entries(routePaths).forEach(([floor, planPoints]) => {
      const record = records.get(floor);
      if (!record || planPoints.length < 2) return;
      const points = planPoints.map((point) => {
        const local = localPoint(record, point, 0.48);
        return local.add(record.container.position);
      });
      const mesh = routeTube(points, ROUTE, 0.13);
      if (mesh) routeLayer.add(mesh);
    });

    if (connection && startFloor !== destinationFloor) {
      const min = Math.min(Number(startFloor), Number(destinationFloor));
      const max = Math.max(Number(startFloor), Number(destinationFloor));
      const connectorPoints: THREE.Vector3[] = [];
      for (let elevation = min; elevation <= max; elevation += 1) {
        const floor = String(elevation);
        const record = records.get(floor);
        const point = connectionPoint(floor, connection);
        if (!record || !point) continue;
        connectorPoints.push(localPoint(record, point, 0.52).add(record.container.position));
      }
      const connector = routeTube(connectorPoints, connection === "LIFT" ? ROUTE_SECONDARY : ROUTE, connection === "LIFT" ? 0.16 : 0.12);
      if (connector) routeLayer.add(connector);
    }
  }, [activeFloor, connection, destinationFloor, loadState, routePaths, startFloor]);

  return (
    <div className="tch-campus-model-host" ref={hostRef}>
      {loadState === "loading" && <div className="tch-model-status"><span />Đang tải mô hình Cơ sở E…</div>}
      {loadState === "error" && <div className="tch-model-status is-error">Mô hình đang được xuất từ SketchUp. Hãy tải lại trang sau khi xuất xong.</div>}
      <div className="tch-model-legend" aria-hidden="true"><i /> Tuyến đi <b /> Tầng đang xét</div>
    </div>
  );
}
