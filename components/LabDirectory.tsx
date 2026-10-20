"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { clusters, labs } from "@/data/labs";
import { technologyThemes } from "@/data/technology-themes";
import { Arrow } from "./Arrow";
import { imageForCluster, roomRenders } from "@/data/site-images";
import { getExplorerHref } from "@/lib/explorer-link";
const normalize = (text: string) =>
  text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();
const roomPhotos = roomRenders;
export function LabDirectory({ showHeader = true }: { showHeader?: boolean }) {
  const [query, setQuery] = useState("");
  const [floor, setFloor] = useState("");
  const [cluster, setCluster] = useState("");
  const [theme, setTheme] = useState("");
  const selectedTheme = technologyThemes.find((item) => item.id === theme);
  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get("cluster");
    if (requested && clusters.some((c) => c.name === requested)) setCluster(requested);
    const requestedTheme = new URLSearchParams(window.location.search).get("theme");
    if (requestedTheme && technologyThemes.some((item) => item.id === requestedTheme))
      setTheme(requestedTheme);
  }, []);
  const filtered = useMemo(
    () =>
      labs.filter(
        (lab) =>
          (!floor || lab.floor === floor) &&
          (!cluster || lab.cluster === cluster) &&
          (!selectedTheme || selectedTheme.labs.includes(lab.id)) &&
          normalize([lab.name, lab.room, lab.cluster, ...lab.tech].join(" ")).includes(
            normalize(query.trim()),
          ),
      ),
    [query, floor, cluster, selectedTheme],
  );
  const reset = () => {
    setQuery("");
    setFloor("");
    setCluster("");
    setTheme("");
    if (window.location.search)
      window.history.replaceState(null, "", window.location.pathname + "#lab-directory");
  };
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return (
    <section className="site-container" id="lab-directory">
      {showHeader && (
        <div className="section-heading">
          <h2>Khám phá không gian công nghệ</h2>
        </div>
      )}
      <div className="directory-toolbar">
        <label>
          Tìm không gian
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tên lab, mã phòng hoặc công nghệ..."
          />
        </label>
        <label>
          Tầng
          <select value={floor} onChange={(e) => setFloor(e.target.value)}>
            <option value="">Tất cả tầng</option>
            {Array.from({ length: 8 }, (_, i) => (
              <option key={i} value={i.toString()}>
                {i === 0 ? "Tầng trệt" : "Tầng " + i}
              </option>
            ))}
          </select>
        </label>
        <label>
          Hướng công nghệ
          <select value={theme} onChange={(e) => setTheme(e.target.value)}>
            <option value="">Tất cả hướng công nghệ</option>
            {technologyThemes.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Cụm năng lực
          <select value={cluster} onChange={(e) => setCluster(e.target.value)}>
            <option value="">Tất cả cụm năng lực</option>
            {clusters.map((item) => (
              <option key={item.name} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="directory-summary">
        <span role="status">
          <strong>{filtered.length}</strong> / {labs.length} không gian
          {query && ' cho "' + query + '"'}
          {selectedTheme && " · " + selectedTheme.name}
          {cluster && " · " + cluster}
          {floor && " · " + (floor === "0" ? "Tầng trệt" : "Tầng " + floor)}
        </span>
        {(query || floor || cluster || theme) && (
          <button type="button" onClick={reset}>
            Xóa bộ lọc <span aria-hidden="true">×</span>
          </button>
        )}
      </div>
      {filtered.length === 0 ? (
        <div className="directory-empty">
          <h3>Chưa tìm thấy không gian phù hợp</h3>
          <p>Thử một tên công nghệ khác hoặc xóa bộ lọc để xem toàn bộ danh mục.</p>
          <button type="button" className="button button-dark" onClick={reset}>
            Xem tất cả không gian
          </button>
        </div>
      ) : (
        <div className="directory-grid">
          {filtered.map((lab) => (
            <article
              className={"space-card" + (roomPhotos[lab.room] ? " has-render" : " has-reference")}
              key={lab.id}
            >
              <Link href={"/labs/" + lab.id}>
                <div className="space-image">
                  <Image
                    src={
                      base +
                      (roomPhotos[lab.room] ??
                        imageForCluster(lab.cluster)?.src ??
                        lab.visual.realImage ??
                        lab.visual.cardImage)
                    }
                    width={960}
                    height={540}
                    alt={lab.name}
                    loading="lazy"
                  />
                </div>
                <div className="space-meta">
                  <span>
                    {lab.room} · {lab.floor === "0" ? "Tầng trệt" : "Tầng " + lab.floor}
                  </span>
                  {roomPhotos[lab.room] && <span>Phối cảnh thiết kế</span>}
                </div>
                <h3>{lab.name}</h3>
                <p>{lab.desc}</p>
              </Link>
              <Link className="space-location" href={getExplorerHref(lab.room, lab.floor)}>
                Tìm trên bản đồ <Arrow diagonal />
              </Link>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
