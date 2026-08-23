"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

const systems = [
  {
    id: "iot",
    code: "01 / IOT",
    name: "IoT",
    description: "Kết nối hệ thống nhúng, cảm biến và Digital Twin để thu thập dữ liệu theo thời gian thực.",
    tags: ["Embedded systems", "Sensors", "Digital twin"],
    spaces: "E301 · E304",
    labLine: "Hệ thống Nhúng & IoT · Dây chuyền sản xuất thông minh",
    position: "node-urban",
  },
  {
    id: "immersive",
    code: "02 / IMMERSIVE",
    name: "Immersive Tech",
    description: "Hologram, AR, VR và trải nghiệm tương tác phục vụ đào tạo, nghiên cứu và trình diễn.",
    tags: ["AR / VR", "Hologram", "Experience"],
    spaces: "E101 — E104",
    labLine: "Human-Centered AI · Immersive Expo · Convergence Center",
    position: "node-immersive",
  },
  {
    id: "logistics",
    code: "03 / LOGISTICS",
    name: "Logistics",
    description: "Mô phỏng cảng thông minh, vận hành terminal và chuỗi cung ứng trong môi trường kết nối.",
    tags: ["Smart seaport", "Terminal", "Supply chain"],
    spaces: "E401 · E404",
    labLine: "Smart Port Logistics · Mobility & Rail Systems",
    position: "node-robotics",
  },
  {
    id: "ocean",
    code: "04 / OCEAN",
    name: "Ocean Tech",
    description: "Quan trắc biển, dữ liệu không gian và mô phỏng động lực học vùng bờ cho phát triển bền vững.",
    tags: ["Monitoring", "Spatial data", "Coastal systems"],
    spaces: "E302 · E404",
    labLine: "Ocean Robotics · Coastal Data & Monitoring",
    position: "node-automation",
  },
  {
    id: "ai",
    code: "05 / AI",
    name: "Artificial Intelligence",
    description: "Kết nối Physical AI, dữ liệu lớn và các mô hình thông minh cho những bài toán thực tế.",
    tags: ["Physical AI", "Big data", "Intelligence"],
    spaces: "E402 · E403 · E601",
    labLine: "Edge–Physical AI · Big Data · Open Innovation Lab",
    position: "node-ocean",
  },
] as const;

export function Hero() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const [activeId, setActiveId] = useState<(typeof systems)[number]["id"]>("iot");
  const active = useMemo(
    () => systems.find((system) => system.id === activeId) ?? systems[0],
    [activeId],
  );

  return (
    <section
      className="tch-hero"
      onPointerMove={(event) => {
        const bounds = event.currentTarget.getBoundingClientRect();
        event.currentTarget.style.setProperty("--pointer-x", `${event.clientX - bounds.left}px`);
        event.currentTarget.style.setProperty("--pointer-y", `${event.clientY - bounds.top}px`);
      }}
    >
      <div className="tch-hero-grid" aria-hidden="true" />
      <div className="tch-hero-glow" aria-hidden="true" />

      <div className="tch-hero-topline">
        <span>Institute of Smart City &amp; Management · UEH</span>
        <span>Technology convergence platform · 2026</span>
      </div>

      <div className="tch-system-map" aria-label="Khám phá năm cụm công nghệ của Tech-Convergence Hub">
        <div className="system-core">
          <i className="system-core-wave wave-one" aria-hidden="true" />
          <i className="system-core-wave wave-two" aria-hidden="true" />
          <i className="system-core-wave wave-three" aria-hidden="true" />
          <span className="system-core-logo">
            <Image
              src={`${basePath}/tch-logo-lockup.png`}
              width={307}
              height={107}
              alt="Tech Convergence Hub"
              priority
            />
          </span>
          <small>Campus E</small>
        </div>

        <div className="system-orbit system-orbit-one" aria-hidden="true" />
        <div className="system-orbit system-orbit-two" aria-hidden="true" />
        <div className="system-orbit system-orbit-three" aria-hidden="true" />
        <div className="system-axis system-axis-x" aria-hidden="true" />
        <div className="system-axis system-axis-y" aria-hidden="true" />

        {systems.map((system) => (
          <button
            className={`system-node ${system.position} ${activeId === system.id ? "is-active" : ""}`}
            type="button"
            key={system.id}
            aria-pressed={activeId === system.id}
            onClick={() => setActiveId(system.id)}
            onPointerEnter={() => setActiveId(system.id)}
          >
            <span>{system.code}</span>
            <strong>{system.name}</strong>
          </button>
        ))}

      </div>

      <div className="system-readout" aria-live="polite" key={active.id}>
        <span className="system-readout-code">{active.code}</span>
        <h2>{active.name}</h2>
        <p>{active.description}</p>
        <div className="system-readout-labs">
          <span>Không gian tiêu biểu</span>
          <strong>{active.spaces}</strong>
          <p>{active.labLine}</p>
        </div>
        <div className="system-readout-tags">
          {active.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      </div>

      <div className="tch-hero-copy">
        <p className="tch-kicker">Tech-Convergence Hub</p>
        <h1>
          Nơi công nghệ
          <br />
          <em>hội tụ.</em>
        </h1>
        <p className="tch-hero-lead">
          Một nền tảng nghiên cứu và đổi mới mở, kết nối AI, robot, dữ liệu, mô phỏng và công nghệ
          nhập vai để giải quyết những bài toán thực của đô thị và xã hội.
        </p>
        <div className="tch-hero-actions">
          <Link className="tch-arrow-link" href="/labs#lab-directory">
            Khám phá 36 không gian công nghệ <span aria-hidden="true">→</span>
          </Link>
          <a className="tch-text-link" href="#vision">
            Về hệ sinh thái
          </a>
        </div>
      </div>

      <div className="tch-hero-hint" aria-hidden="true">
        Rê chuột để khám phá · Chọn một cụm công nghệ
      </div>
    </section>
  );
}
