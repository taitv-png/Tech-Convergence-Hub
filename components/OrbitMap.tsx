"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { labs } from "../data/labs";

const formatFloorLabel = (floor: string) =>
  floor === "0" ? "Tầng trệt" : `Lầu ${floor}`;

export function OrbitMap() {
  const floors = useMemo(
    () => [...new Set(labs.map((l) => l.floor))].sort((a, b) => Number(a) - Number(b)),
    [],
  );
  const [activeFloor, setActiveFloor] = useState(floors[0] ?? "0");
  const relatedLabs = useMemo(
    () =>
      labs
        .filter((l) => l.floor === activeFloor)
        .sort((a, b) => a.room.localeCompare(b.room, "vi")),
    [activeFloor],
  );
  const activeClusters = useMemo(
    () => [...new Set(relatedLabs.map((l) => l.cluster))],
    [relatedLabs],
  );
  const activeFunctions = useMemo(
    () => [...new Set(relatedLabs.flatMap((l) => l.apps))].length,
    [relatedLabs],
  );

  return (
    <section className="container section" id="orbit-section">
      <div className="section-head">
        <h2 style={{ display: "none" }}>Sơ đồ phòng theo tầng</h2>
      </div>
      <div className="orbit-cluster-wrap">
        <div className="panel cluster-orbit-panel">
          <div className="orbit-map">
            {floors.map((floor) => {
              const count = labs.filter((l) => l.floor === floor).length;
              return (
                <button
                  key={floor}
                  className={`orbit-cluster-node ${floor === activeFloor ? "active" : ""}`}
                  type="button"
                  onClick={() => setActiveFloor(floor)}
                >
                  <b>{formatFloorLabel(floor)}</b>
                  <span>
                    {count} phòng
                  </span>
                </button>
              );
            })}
          </div>
        </div>
        <aside className="panel orbit-detail">
          <div className="big-code">{activeFloor === "0" ? "G" : `F${activeFloor}`}</div>
          <h3>{formatFloorLabel(activeFloor)}</h3>
          <p>
            Tầng này có {relatedLabs.length} phòng thuộc {activeClusters.length} cụm năng lực,
            phục vụ đào tạo, nghiên cứu và chuyển giao công nghệ.
          </p>
          <div className="orbit-quick-stats" aria-label="Thông tin nhanh cụm phòng thí nghiệm">
            <div className="orbit-stat">
              <span>Số phòng</span>
              <strong>{relatedLabs.length}</strong>
            </div>
            <div className="orbit-stat">
              <span>Cụm năng lực</span>
              <strong>{activeClusters.length}</strong>
            </div>
            <div className="orbit-stat">
              <span>Chức năng</span>
              <strong>{activeFunctions}</strong>
            </div>
          </div>
          <div className="chip-row">
            {activeClusters.map((cluster) => (
              <span className="chip" key={cluster}>
                {cluster}
              </span>
            ))}
          </div>
          <span className="linked-count">{relatedLabs.length} không gian theo tầng</span>
          <div className="mini-labs">
            {relatedLabs.map((l) => (
              <Link className="mini-lab" href={`/labs/${l.id}`} key={l.id}>
                <div>
                  <b>{l.code}</b>
                  <br />
                  <span>{l.name}</span>
                </div>
                <span>{l.room}</span>
              </Link>
            ))}
          </div>
          <Link className="btn btn-primary" href="/labs#lab-directory">
            Xem tất cả phòng thí nghiệm
          </Link>
        </aside>
      </div>
    </section>
  );
}
