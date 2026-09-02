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
    labs: ["Embedded & IoT System Lab"],
  },
  {
    id: "immersive",
    code: "02 / IMMERSIVE",
    name: "Immersive Tech",
    description: "Hologram, AR, VR và trải nghiệm tương tác phục vụ đào tạo, nghiên cứu và trình diễn.",
    tags: ["AR / VR", "Hologram", "Experience"],
    labs: ["Hologram Printing Lab", "Immersive Technology Convergence", "Immersive Technology Center"],
  },
  {
    id: "logistics",
    code: "03 / LOGISTICS",
    name: "Logistics",
    description: "Mô phỏng cảng thông minh, vận hành terminal và chuỗi cung ứng trong môi trường kết nối.",
    tags: ["Smart seaport", "Terminal", "Supply chain"],
    labs: ["Smart Seaport Logistics & Terminal Operations Lab", "MPS Station Center"],
  },
  {
    id: "ocean",
    code: "04 / OCEAN",
    name: "Ocean Tech",
    description: "Quan trắc biển, dữ liệu không gian và mô phỏng động lực học vùng bờ cho phát triển bền vững.",
    tags: ["Monitoring", "Spatial data", "Coastal systems"],
    labs: ["Ocean Monitoring & Spatial Planning Lab", "Ocean Physics & Coastal Dynamics Lab", "Spatial Analytics & Planning Lab"],
  },
  {
    id: "ai",
    code: "05 / AI",
    name: "Artificial Intelligence",
    description: "Kết nối Physical AI, dữ liệu lớn và các mô hình thông minh cho những bài toán thực tế.",
    tags: ["Physical AI", "Big data", "Intelligence"],
    labs: ["Edge–Physical AI Lab", "AI & Big Data Lab"],
  },
  {
    id: "mobility",
    code: "06 / MOBILITY",
    name: "Mobility",
    description: "Kết nối phương tiện tự hành, đường sắt và dữ liệu di chuyển cho đô thị linh hoạt hơn.",
    tags: ["Smart mobility", "Rail systems", "Autonomous vehicles"],
    labs: ["Smart Mobility Lab", "Rail Systems Lab", "Automated Vehicles & Systems Lab"],
  },
  {
    id: "robotics",
    code: "07 / ROBOTICS",
    name: "Robotics",
    description: "Phát triển robot di động, robot đại dương và hệ thống tự hành trong môi trường thực.",
    tags: ["Mobile robots", "Ocean robotics", "Autonomy"],
    labs: ["Automated Vehicles & Systems Lab", "Mobile Robot Lab", "Ocean Robotics Lab"],
  },
  {
    id: "smart-city",
    code: "08 / SMART CITY",
    name: "Smart City",
    description: "Biến dữ liệu đô thị thành mô hình, mô phỏng và quyết định thiết kế có thể kiểm chứng.",
    tags: ["Urban data", "Digital twin", "Urban design"],
    labs: ["Smart City Lab", "Data-Driven Urban Design Lab", "META – Digital Twin Lab"],
  },
  {
    id: "energy",
    code: "09 / ENERGY",
    name: "Energy",
    description: "Nghiên cứu năng lượng tái tạo đại dương và các hệ vật lý phục vụ chuyển dịch xanh.",
    tags: ["Renewable energy", "Ocean physics", "Sustainability"],
    labs: ["Ocean Renewable Energy Lab", "Ocean Physics Lab"],
  },
  {
    id: "materials",
    code: "10 / MATERIAL",
    name: "Material",
    description: "Hội tụ cơ khí chính xác, vật lý kiến trúc, điều khiển công nghiệp và kinh tế tuần hoàn.",
    tags: ["Precision", "Industrial control", "Circular economy"],
    labs: ["Precision Mechanics Lab", "Architectural & Urban Physics Lab", "Process Control & Industrial Communication Network Lab", "Circular Economy Lab"],
  },
  {
    id: "cyber",
    code: "11 / CYBER",
    name: "Cyber Security",
    description: "Thực hành bảo vệ dữ liệu, hạ tầng số và các hệ thống kết nối của campus thông minh.",
    tags: ["Cybersecurity", "Digital infrastructure", "Resilience"],
    labs: ["Cybersecurity Lab"],
  },
  {
    id: "ux",
    code: "12 / UX",
    name: "UX",
    description: "Đặt con người ở trung tâm của giao diện, trải nghiệm và những ứng dụng AI mới.",
    tags: ["Ergonomics", "Human-centered AI", "Interaction"],
    labs: ["ErgoUX Lab", "Human-Centered AI Innovation Lab"],
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

      <div className="tch-system-map" aria-label="Khám phá mười hai theme công nghệ của Tech-Convergence Hub">
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

        {systems.map((system, index) => (
          <button
            className={`system-node system-node-${index} ${activeId === system.id ? "is-active" : ""}`}
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
          <span>{active.labs.length.toString().padStart(2, "0")} labs dưới theme</span>
          <ul>
            {active.labs.map((lab) => <li key={lab}>{lab}</li>)}
          </ul>
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

