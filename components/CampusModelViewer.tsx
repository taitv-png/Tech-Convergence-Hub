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
  exploded: boolean;
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
  origin: THREE.Vector3;
  baseY: number;
  floor: string;
};

const FLOORS = ["0", "1", "2", "3", "4", "5", "6", "7"];
const EXPLODED_FLOOR_GAP = 5.8;
const ARCHITECTURE = new THREE.Color("#e9e4dc");
const STRUCTURE = new THREE.Color("#8f8b84");
const ROUTE = new THREE.Color("#ff914d");
const ROUTE_SECONDARY = new THREE.Color("#d5a3aa");

function floorNodePrefix(floor: string) {
  return floor === "0" ? "Campus_E_GF" : `Campus_E_F${floor}`;
}

function localPoint(record: FloorRecord, point: PlanPoint, height = 0.42) {
  const x = THREE.MathUtils.lerp(record.bounds.min.x, record.bounds.max.x, point.x / 100) - record.origin.x;
  const z = THREE.MathUtils.lerp(record.bounds.max.z, record.bounds.min.z, point.y / 100) - record.origin.z;
  return new THREE.Vector3(x, record.bounds.max.y - record.origin.y + height, z);
}

function connectionPoint(floor: string, connection: ConnectionId): PlanPoint | null {
  if (connection === "LIFT") {
    if (!["0", "4", "5", "6", "7"].includes(floor)) return null;
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
  exploded,
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
  const explodedRef = useRef(exploded);
  const onFloorSelectRef = useRef(onFloorSelect);
  const [loadState, setLoadState] = useState<"loading" | "ready" | "error">("loading");
  const [layoutRevision, setLayoutRevision] = useState(0);

  onFloorSelectRef.current = onFloorSelect;
  explodedRef.current = exploded;

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x171717, 0.012);

    const camera = new THREE.PerspectiveCamera(34, 1, 0.05, 500);
    camera.position.set(44, 38, 54);

    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1));
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
    building.rotation.y = -Math.PI / 2;
    scene.add(building);
    const context = new THREE.Group();
    scene.add(context);
    const movingCars: { object: THREE.Group; speed: number; limit: number; direction: number }[] = [];
    const movingPeople: { object: THREE.Group; speed: number; minX: number; maxX: number; direction: number }[] = [];
    const routeLayer = new THREE.Group();
    routeLayerRef.current = routeLayer;
    building.add(routeLayer);

    const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
    const loader = new ColladaLoader();
    let disposed = false;

    const loadCampusModel = async () => {
      if ("DecompressionStream" in window) {
        const response = await fetch(`${basePath}/models/campus-e/campus-e-source.dae.gz`);
        if (!response.ok || !response.body) throw new Error(`Campus E compressed model returned ${response.status}`);
        const stream = response.body.pipeThrough(new DecompressionStream("gzip"));
        const source = await new Response(stream).text();
        return loader.parse(source, `${basePath}/models/campus-e/`);
      }
      return loader.loadAsync(`${basePath}/models/campus-e/campus-e-source.dae`);
    };

    loadCampusModel().then((collada) => {
      if (disposed) return;
      if (!collada) throw new Error("Campus E DAE did not return a scene");
      collada.scene.updateMatrixWorld(true);

      const floorSources = new Map<string, { source: THREE.Object3D; bounds: THREE.Box3 }>();
      const campusRawBounds = new THREE.Box3();
      FLOORS.forEach((floor) => {
        let source: THREE.Object3D | undefined;
        collada.scene.traverse((object) => {
          if (!source && typeof object.name === "string" && object.name.startsWith(floorNodePrefix(floor))) source = object;
        });
        if (!source) throw new Error(`Missing Campus E floor node ${floor}`);
        const bounds = new THREE.Box3().setFromObject(source);
        floorSources.set(floor, { source, bounds });
        campusRawBounds.union(bounds);
      });
      const rawCenter = campusRawBounds.getCenter(new THREE.Vector3());
      const horizontalOrigin = new THREE.Vector3(rawCenter.x, 0, rawCenter.z);
      const floorBaseY = new Map<string, number>();
      let stackedY = 0;
      FLOORS.forEach((floor) => {
        const height = floorSources.get(floor)!.bounds.getSize(new THREE.Vector3()).y;
        floorBaseY.set(floor, stackedY);
        stackedY += Math.max(0.3, height * (floor === "0" ? 0.36 : 0.62));
      });

      FLOORS.forEach((floor) => {
        const floorSource = floorSources.get(floor)!;
        const source = floorSource.source;
        const rawBounds = floorSource.bounds;
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
        const origin = new THREE.Vector3(horizontalOrigin.x, rawBounds.min.y, horizontalOrigin.z);
        const baseY = floorBaseY.get(floor) ?? 0;
        object.position.set(-origin.x, -origin.y, -origin.z);

        const container = new THREE.Group();
        container.position.y = baseY + (explodedRef.current ? Number(floor) * EXPLODED_FLOOR_GAP : 0);
        container.userData.floor = floor;
        container.add(object);
        building.add(container);

        const record: FloorRecord = { container, material, bounds: rawBounds, origin, baseY, floor };
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

      building.updateMatrixWorld(true);
      const campusBounds = new THREE.Box3().setFromObject(building);
      const campusSize = campusBounds.getSize(new THREE.Vector3());
      const campusCenter = campusBounds.getCenter(new THREE.Vector3());
      const contextWidth = Math.max(68, campusSize.x * 3.2);
      const contextDepth = Math.max(56, campusSize.z * 2.8);
      const ground = new THREE.Mesh(
        new THREE.PlaneGeometry(contextWidth, contextDepth),
        new THREE.MeshStandardMaterial({ color: 0x242422, roughness: 1, metalness: 0 }),
      );
      ground.rotation.x = -Math.PI / 2;
      ground.position.set(campusCenter.x, -0.24, campusCenter.z + campusSize.z * 0.12);
      context.add(ground);

      const roadWidth = Math.max(9, campusSize.z * 0.28);
      const roadZ = campusBounds.max.z + roadWidth * 0.78;
      const road = new THREE.Mesh(
        new THREE.PlaneGeometry(contextWidth, roadWidth),
        new THREE.MeshStandardMaterial({ color: 0x101010, roughness: 0.96 }),
      );
      road.rotation.x = -Math.PI / 2;
      road.position.set(campusCenter.x, -0.19, roadZ);
      context.add(road);
      [-1.8, 1.8].forEach((offset) => {
        const marking = new THREE.Mesh(
          new THREE.BoxGeometry(contextWidth * 0.92, 0.035, 0.08),
          new THREE.MeshBasicMaterial({ color: 0x8b857d, transparent: true, opacity: 0.62 }),
        );
        marking.position.set(campusCenter.x, -0.14, roadZ + offset);
        context.add(marking);
      });

      const sidewalkMaterial = new THREE.MeshStandardMaterial({ color: 0x58534d, roughness: 1 });
      [-roadWidth * 0.57, roadWidth * 0.57].forEach((offset) => {
        const sidewalk = new THREE.Mesh(new THREE.BoxGeometry(contextWidth, 0.18, 2.2), sidewalkMaterial);
        sidewalk.position.set(campusCenter.x, -0.08, roadZ + offset);
        context.add(sidewalk);
      });

      const blockMaterial = new THREE.MeshStandardMaterial({ color: 0x343432, roughness: 0.92 });
      const blockSpecs = [
        [-0.54, -0.58, 0.18, 0.22, 0.31], [0.54, -0.58, 0.18, 0.22, 0.25],
        [-0.57, -0.12, 0.16, 0.2, 0.2], [0.57, -0.12, 0.16, 0.2, 0.27],
        [-0.32, -0.78, 0.16, 0.15, 0.18], [0.32, -0.78, 0.16, 0.16, 0.22],
      ];
      blockSpecs.forEach(([x, z, w, d, h]) => {
        const block = new THREE.Mesh(
          new THREE.BoxGeometry(contextWidth * w, Math.max(4, campusSize.y * h), contextDepth * d),
          blockMaterial,
        );
        block.position.set(campusCenter.x + contextWidth * x * 0.5, Math.max(2, campusSize.y * h * 0.5), campusCenter.z + contextDepth * z * 0.5);
        context.add(block);
      });

      const distantMaterial = new THREE.MeshStandardMaterial({ color: 0x4b4844, roughness: 1, transparent: true, opacity: 0.28, depthWrite: false });
      [-0.42, -0.14, 0.15, 0.43].forEach((x, index) => {
        const height = campusSize.y * (0.14 + (index % 3) * 0.035);
        const block = new THREE.Mesh(new THREE.BoxGeometry(contextWidth * 0.18, height, contextDepth * 0.13), distantMaterial);
        block.position.set(campusCenter.x + contextWidth * x, height * 0.5, roadZ + roadWidth * 1.22);
        context.add(block);
      });

      const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x4b3325, roughness: 1 });
      const crownMaterial = new THREE.MeshStandardMaterial({ color: 0x556346, roughness: 0.95 });
      const addTree = (x: number, z: number, scale = 1) => {
        const tree = new THREE.Group();
        const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.12 * scale, 0.16 * scale, 1.5 * scale, 6), trunkMaterial);
        trunk.position.y = 0.75 * scale;
        const crown = new THREE.Mesh(new THREE.IcosahedronGeometry(0.78 * scale, 0), crownMaterial);
        crown.position.y = 1.75 * scale;
        tree.add(trunk, crown);
        tree.position.set(x, 0, z);
        context.add(tree);
      };
      for (let index = 0; index < 12; index += 1) {
        const x = campusCenter.x - contextWidth * 0.42 + index * (contextWidth * 0.84 / 11);
        addTree(x, roadZ - roadWidth * 0.62, 1.12 + (index % 3) * 0.1);
      }
      [[-0.42, -0.18], [0.46, -0.22], [-0.58, 0.06], [0.6, 0.02], [-0.34, 0.24], [0.38, 0.26]].forEach(([x, z], index) => {
        addTree(campusCenter.x + contextWidth * x, campusCenter.z + contextDepth * z, 1.08 + (index % 2) * 0.16);
      });

      const peopleMaterial = new THREE.MeshStandardMaterial({ color: 0xe6ddd2, roughness: 0.9 });
      const peopleAccent = new THREE.MeshStandardMaterial({ color: 0xeb681c, roughness: 0.75 });
      for (let index = 0; index < 10; index += 1) {
        const person = new THREE.Group();
        const body = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.16, 0.75, 6), index % 4 === 0 ? peopleAccent : peopleMaterial);
        body.position.y = 0.48;
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.14, 7, 5), peopleMaterial);
        head.position.y = 0.98;
        person.add(body, head);
        person.position.set(campusCenter.x - contextWidth * 0.34 + index * contextWidth * 0.072, 0, roadZ - roadWidth * 0.62 + (index % 2 ? 0.55 : -0.45));
        context.add(person);
        movingPeople.push({ object: person, speed: 0.00038 + (index % 4) * 0.00007, minX: campusCenter.x - contextWidth * 0.4, maxX: campusCenter.x + contextWidth * 0.4, direction: index % 2 === 0 ? 1 : -1 });
      }

      const carColors = [0xeb681c, 0xd8d3cc, 0x73706b, 0xa7332c, 0x48606a, 0xe1b34b, 0x685a72, 0xb8b4ae];
      carColors.forEach((color, index) => {
        const car = new THREE.Group();
        const body = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.62, 1.05), new THREE.MeshStandardMaterial({ color, roughness: 0.56 }));
        const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.25, 0.48, 0.88), new THREE.MeshStandardMaterial({ color: 0x282b2d, roughness: 0.35 }));
        cabin.position.y = 0.5;
        car.add(body, cabin);
        const direction = index % 2 === 0 ? 1 : -1;
        car.position.set(campusCenter.x + direction * (index * 8 - contextWidth * 0.34), 0.18, roadZ + direction * 1.8);
        car.rotation.y = direction < 0 ? Math.PI : 0;
        context.add(car);
        movingCars.push({ object: car, speed: 0.0018 + index * 0.00018, limit: contextWidth * 0.46, direction });
      });

      controls.target.set(campusCenter.x, campusBounds.min.y + campusSize.y * 0.38, campusCenter.z);
      camera.position.set(campusCenter.x + campusSize.x * 1.15, campusBounds.min.y + campusSize.y * 0.82, campusCenter.z + campusSize.z * 1.55);
      controls.update();

      setLoadState("ready");
    }).catch((error) => {
      console.error("Campus E DAE load failed", error);
      if (!disposed) setLoadState("error");
    });

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let pointerDown: { x: number; y: number } | null = null;
    const rememberPointer = (event: PointerEvent) => {
      pointerDown = { x: event.clientX, y: event.clientY };
    };
    const handlePointer = (event: PointerEvent) => {
      if (!explodedRef.current || !pointerDown) return;
      const movement = Math.hypot(event.clientX - pointerDown.x, event.clientY - pointerDown.y);
      pointerDown = null;
      if (movement > 6) return;
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hit = raycaster.intersectObjects(building.children, true).find((item) => item.object.userData.floor);
      const floor = hit?.object.userData.floor as string | undefined;
      if (floor) onFloorSelectRef.current(floor);
    };
    renderer.domElement.addEventListener("pointerdown", rememberPointer);
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
      if (!isVisible || document.hidden || time - lastRender < 42) return;
      const frameDelta = Math.min(80, time - lastRender);
      lastRender = time;
      movingCars.forEach((car) => {
        car.object.position.x += car.speed * frameDelta * car.direction;
        if (Math.abs(car.object.position.x) > car.limit) car.object.position.x = -car.limit * car.direction;
      });
      movingPeople.forEach((person) => {
        person.object.position.x += person.speed * frameDelta * person.direction;
        if (person.object.position.x > person.maxX || person.object.position.x < person.minX) person.direction *= -1;
      });
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
      renderer.domElement.removeEventListener("pointerdown", rememberPointer);
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
    if (loadState !== "ready") return;
    const records = floorRecordsRef.current;
    const routeLayer = routeLayerRef.current;
    const starts = new Map<string, number>();
    records.forEach((record, floor) => starts.set(floor, record.container.position.y));
    const targetGap = exploded ? EXPLODED_FLOOR_GAP : 0;
    const startedAt = performance.now();
    let animationFrame = 0;
    if (routeLayer) routeLayer.visible = false;
    const animateLayout = (now: number) => {
      const progress = Math.min(1, (now - startedAt) / 620);
      const eased = 1 - Math.pow(1 - progress, 3);
      records.forEach((record, floor) => {
        const from = starts.get(floor) ?? 0;
        record.container.position.y = THREE.MathUtils.lerp(from, record.baseY + Number(floor) * targetGap, eased);
      });
      if (progress < 1) animationFrame = requestAnimationFrame(animateLayout);
      else {
        if (routeLayer) routeLayer.visible = exploded;
        setLayoutRevision((value) => value + 1);
      }
    };
    animationFrame = requestAnimationFrame(animateLayout);
    return () => cancelAnimationFrame(animationFrame);
  }, [exploded, loadState]);

  useEffect(() => {
    const records = floorRecordsRef.current;
    const routeLayer = routeLayerRef.current;
    if (!routeLayer || loadState !== "ready") return;
    routeLayer.visible = exploded;

    while (routeLayer.children.length) {
      const child = routeLayer.children.pop()!;
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();
        if (child.material instanceof THREE.Material) child.material.dispose();
      }
    }

    const routeFloors = new Set([startFloor, destinationFloor]);
    records.forEach((record, floor) => {
      const routeEmphasized = routeFloors.has(floor) || floor === activeFloor;
      const emphasized = !exploded || routeEmphasized;
      record.material.color.copy(emphasized ? ARCHITECTURE : STRUCTURE);
      record.material.opacity = emphasized ? 1 : 0.2;
      record.material.depthWrite = emphasized;
      record.container.traverse((object) => {
        if (!(object instanceof CSS2DObject)) return;
        const element = object.element as HTMLElement;
        element.classList.toggle("is-muted", !routeEmphasized);
        element.hidden = !exploded || !routeEmphasized;
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
  }, [activeFloor, connection, destinationFloor, exploded, layoutRevision, loadState, routePaths, startFloor]);

  return (
    <div className={`tch-campus-model-host${exploded ? " is-exploded" : " is-collapsed"}`} ref={hostRef}>
      {loadState === "loading" && <div className="tch-model-status"><span />Đang tải mô hình Cơ sở E…</div>}
      {loadState === "error" && <div className="tch-model-status is-error">Mô hình đang được xuất từ SketchUp. Hãy tải lại trang sau khi xuất xong.</div>}
      <div className="tch-model-legend" aria-hidden="true"><i /> Tuyến đi <b /> Tầng đang xét</div>
    </div>
  );
}

