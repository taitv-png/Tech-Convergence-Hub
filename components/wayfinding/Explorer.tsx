"use client";
import dynamic from "next/dynamic";
const Campus = dynamic(() => import("./CampusEMap"), {
  ssr: false,
  loading: () => (
    <div className="explorer-loading" role="status">
      Đang chuẩn bị bản đồ Campus E...
    </div>
  ),
});
export function Explorer() {
  return (
    <div className="wayfinding-scope">
      <Campus />
    </div>
  );
}
