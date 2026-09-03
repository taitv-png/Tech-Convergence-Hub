"use client";

import { useEffect, useRef, useState } from "react";

const metrics = [
  { value: 36, padded: false, label: "không gian công nghệ" },
  { value: 7, padded: true, label: "cụm năng lực liên ngành" },
  { value: 1, padded: true, label: "nền tảng đổi mới mở" },
];

export function VisionSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [counts, setCounts] = useState([0, 0, 0]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.22 });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    const startedAt = performance.now();
    let frame = 0;
    const animate = (now: number) => {
      const progress = Math.min(1, (now - startedAt) / 1500);
      const eased = 1 - Math.pow(1 - progress, 4);
      setCounts(metrics.map((metric) => Math.round(metric.value * eased)));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [visible]);

  return (
    <section className={`tch-intro${visible ? " is-visible" : ""}`} id="vision" ref={sectionRef}>
      <div className="tch-section-index tch-reveal-stage stage-index">
        <span>01</span>
        <p>Tầm nhìn</p>
      </div>

      <div className="tch-intro-main">
        <p className="tch-section-kicker tch-reveal-stage stage-heading">A shared platform for open innovation</p>
        <h2 className="tch-reveal-stage stage-heading">
          Một hệ sinh thái được thiết kế để{" "}
          <em>công nghệ gặp nhau.</em>
        </h2>

        <div className="tch-intro-columns tch-reveal-stage stage-copy">
          <p>
            Tech-Convergence Hub là hạt nhân của hệ sinh thái UniverCity Innovation Hub UEH — nơi tri thức
            liên ngành, công nghệ mũi nhọn và những bài toán thực tế cùng hiện diện trong một không gian mở.
          </p>
          <p>
            Tại đây, nghiên cứu, đào tạo, thử nghiệm và chuyển giao không tách rời. Sinh viên, giảng viên,
            doanh nghiệp, chính quyền và cộng đồng cùng đồng thiết kế những giải pháp có thể được kiểm chứng trong đời sống.
          </p>
        </div>

        <div className="tch-metrics tch-reveal-stage stage-metrics" aria-label="Quy mô Tech-Convergence Hub">
          {metrics.map((metric, index) => (
            <div key={metric.label}>
              <strong>{metric.padded ? String(counts[index]).padStart(2, "0") : counts[index]}</strong>
              <span>{metric.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

