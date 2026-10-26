import { tr } from './locale';
import * as THREE from 'three';
import { createRoom104, ROOM104, ROOM_ITEMS } from './room104-scene';
import { createTeachingRoom, type TourRoom } from './campus-tour-scene';
import { createComputerLabRoom, isInstalledComputerLab } from './computer-lab-scene';
import { createObservedStudyRoom, isObservedStudyRoom } from './observed-study-scene';
import { createObservedResearchRoom, isObservedResearchRoom } from './observed-research-scene';

export function createRoomTour(scene: THREE.Scene, room: TourRoom, furnished: boolean) {
  if (room.id === 'E104') return {
    ...createRoom104(scene, furnished, 'render'), items: ROOM_ITEMS, width: ROOM104.width, depth: ROOM104.depth,
    portals: [{ id: 'exit', label: tr("Ra hành lang", "To the corridor"), x: -ROOM104.width / 2, z: -ROOM104.depth / 2 + 1.28, kind: 'exit' as const }],
  };
  if (isInstalledComputerLab(room.id)) return createComputerLabRoom(scene, room, furnished);
  if (isObservedStudyRoom(room.id)) return createObservedStudyRoom(scene, room, furnished);
  if (isObservedResearchRoom(room.id)) return createObservedResearchRoom(scene, room, furnished);
  return createTeachingRoom(scene, room, furnished);
}
