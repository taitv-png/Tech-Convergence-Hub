"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { clusters, labs } from "../data/labs";

export function OrbitMap() {
  const [activeName, setActiveName] = useState(clusters[0].name);
  const activeIndex = clusters.findIndex((c) => c.name === activeName);
  const activeCluster =
    clusters.find((c) => c.name === activeName) ?? clusters[0];
  const relatedLabs = useMemo(
    () => labs.filter((l) => l.cluster === activeCluster.name),
    [activeCluster.name],
  );
  const activeFloors = useMemo(
    () => new Set(relatedLabs.map((l) => l.floor)).size,
    [relatedLabs],
  );
  return (
    <section className="container section" id="orbit-section">
      <div className="section-head">
        <h2 style={{ display: "none" }}>Cụm năng lực</h2>
      </div>
      <div className="orbit-cluster-wrap">
        <div className="panel cluster-orbit-panel">
          <div className="orbit-map">
            {clusters.map((c) => {
              const count = labs.filter((l) => l.cluster === c.name).length;
              return (
                <button
                  key={c.code}
                  className={`orbit-cluster-node ${c.name === activeName ? "active" : ""}`}
                  type="button"
                  onClick={() => setActiveName(c.name)}
                >
                  <b>{c.name}</b>
                  <span>
                    {count} phòng
                  </span>
                </button>
              );
            })}
          </div>
        </div>
        <aside className="panel orbit-detail">
          <div className="big-code">{activeCluster.code}</div>
          <h3>{activeCluster.name}</h3>
          <p>{activeCluster.desc}</p>
          <div className="orbit-quick-stats" aria-label="Thông tin nhanh cụm phòng thí nghiệm">
            <div className="orbit-stat">
              <span>Số phòng</span>
              <strong>{relatedLabs.length}</strong>
            </div>
            <div className="orbit-stat">
              <span>Tầng</span>
              <strong>{activeFloors}</strong>
            </div>
            <div className="orbit-stat">
              <span>Thẻ</span>
              <strong>{activeCluster.tags.length}</strong>
            </div>
          </div>
          <div className="chip-row">
            {activeCluster.tags.map((t) => (
              <span className="chip" key={t}>
                {t}
              </span>
            ))}
          </div>
          <span className="linked-count">{relatedLabs.length} phòng liên kết</span>
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
