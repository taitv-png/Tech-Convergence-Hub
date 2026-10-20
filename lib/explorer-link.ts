import { ROOM_CATALOGUE } from "@/components/wayfinding/room-catalogue";
export function getExplorerHref(room: string, floor?: string) {
  const compact = room.replace(/\s/g, "").replace(/,/g, "+");
  const aliases: Record<string, string> = {
    E402: "E402+E403",
    E403: "E402+E403",
    E602: "E602+E603",
    E603: "E602+E603",
  };
  const id = aliases[compact] ?? compact;
  return id in ROOM_CATALOGUE
    ? "/explore?room=" + encodeURIComponent(id)
    : floor
      ? "/explore?floor=" + encodeURIComponent(floor)
      : "/explore";
}
