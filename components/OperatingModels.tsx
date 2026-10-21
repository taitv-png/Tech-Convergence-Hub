import { operatingModels } from "@/data/operating-models";
import { technologyThemes } from "@/data/technology-themes";
import { SectionHeading } from "./SectionHeading";

// How spaces are run, as opposed to what they research (the technology themes).
export function OperatingModels() {
  return (
    <section className="site-container home-section" id="models">
      <div className="section-heading">
        <SectionHeading title="Mô hình không gian">
          Năm cách vận hành. <span>Một hệ sinh thái.</span>
        </SectionHeading>
        <p>
          {technologyThemes.length} hướng công nghệ nói về nội dung nghiên cứu. Năm mô hình dưới đây
          nói về cách một không gian được vận hành và ai có thể dùng nó.
        </p>
      </div>
      <ul className="cv-models-list">
        {operatingModels.map((model) => (
          <li key={model.id}>
            <h3>{model.name}</h3>
            <p>{model.summary}</p>
            <dl>
              <div>
                <dt>Bạn có thể</dt>
                <dd>{model.activities}</dd>
              </div>
              <div>
                <dt>Đầu ra</dt>
                <dd>{model.outcomes}</dd>
              </div>
            </dl>
          </li>
        ))}
      </ul>
      <p className="cv-models-note">
        Tóm tắt từ hồ sơ đề xuất hệ thống phòng thí nghiệm TCH.
      </p>
    </section>
  );
}
