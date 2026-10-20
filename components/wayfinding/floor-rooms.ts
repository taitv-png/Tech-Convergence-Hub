import { ROOM_CATALOGUE } from "./room-catalogue";
type P = [number, number];
export type Room = {
  id: string;
  name: string;
  floor: number;
  box: [number, number, number, number];
  door: P;
  doors?: P[];
  outline?: P[];
  kind: "lab" | "class" | "support";
};
const names: Record<string, string> = Object.fromEntries(
  Object.entries(ROOM_CATALOGUE).map(([id, room]) => [id, room.name]),
);

export function floorRooms(floor: number): Room[] {
  if (floor === 0)
    return [
      {
        id: "E002",
        name: names.E002,
        floor,
        box: [0.35, 2.62, 2.62, 6.95],
        door: [2.62, 4.0],
        kind: "lab",
      },
      {
        id: "E001",
        name: names.E001,
        floor,
        box: [2.8, 5.1, 5.38, 7.35],
        door: [3.15, 5.1],
        outline: [
          [2.8, 5.1],
          [5.38, 5.1],
          [5.38, 5.85],
          [4.85, 5.85],
          [4.85, 7.35],
          [2.8, 7.0],
        ],
        kind: "lab",
      },
    ];
  const sets = [
    [],
    ["E103", "E102", "E104", "E101"],
    ["E203", "E202", "E204", "E201"],
    ["E303", "E302", "E304", "E301"],
    ["E402+E403", "E404", "E401"],
    ["E503", "E502", "E504", "E501"],
    ["E602+E603", "E604", "E601"],
    ["E702", "E701"],
  ] as string[][];
  const boxes =
    sets[floor].length === 4
      ? [
          [0.35, 2.62, 2.55, 6.95],
          [2.72, 2.62, 5.38, 6.95],
          [6.45, 0.25, 9.85, 2.18],
          [8.18, 2.62, 9.85, 6.95],
        ]
      : floor === 7
        ? [
            [0.35, 2.62, 5.38, 6.95],
            [8.18, 2.62, 9.85, 6.95],
          ]
        : [
            [0.35, 2.62, 5.38, 6.95],
            [6.45, 0.25, 9.85, 2.18],
            [8.18, 2.62, 9.85, 6.95],
          ];
  const doors4: P[] = [
    [1.3, 2.62],
    [4.2, 2.62],
    [6.45, 1.42],
    [8.18, 4.6],
  ];
  const doors3: P[] = [
    [4.2, 2.62],
    [6.45, 1.42],
    [8.18, 4.6],
  ];
  const doors7: P[] = [
    [5.38, 4.6],
    [8.18, 4.6],
  ];
  const doors = sets[floor].length === 4 ? doors4 : floor === 7 ? doors7 : doors3;
  return sets[floor].map((id, i) => ({
    id,
    name: names[id],
    floor,
    box: boxes[i] as Room["box"],
    door: doors[i],
    doors:
      floor < 7 && (id.endsWith("02") || id.includes("+")) ? [doors[i], [5.38, 4.6]] : [doors[i]],
    kind: floor === 5 || id.endsWith("03") ? "class" : "lab",
  }));
}
