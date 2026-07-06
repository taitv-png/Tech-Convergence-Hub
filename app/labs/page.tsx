import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { LabDirectory } from "@/components/LabDirectory";
import { ProjectSideNav } from "@/components/ProjectSideNav";
import { ProjectIntroStrip } from "../../components/ProjectIntroStrip";
import { siteNavItems } from "@/components/siteNavItems";

export default function LabsPage() {
  return (
    <>
      <Header />
      <main>
        <section className="container page-title-wrap page-title-grid labs-title-wrap" id="labs-title">
          <div>
            <h1 className="page-title">Phòng thí nghiệm</h1>
            <p className="lead news-lead">
              Danh mục được tổ chức theo cụm công nghệ hội tụ, bám theo kế hoạch
              phát triển Tech-Convergence Hub giai đoạn 2026-2030.
            </p>
          </div>

          <div className="page-title-media" aria-hidden="true" />
        </section>

        <section className="project-page-section">
          <div className="container project-page-layout">
            <ProjectSideNav
              ariaLabel="Điều hướng trong mục phòng thí nghiệm"
              backHref="/"
              backLabel="Overview"
              kicker="In this Project:"
              links={siteNavItems.map((item) => ({
                href: item.href,
                label: item.label,
                current: item.label === "Danh mục labs",
              }))}
            />

            <div className="project-page-content">
              <ProjectIntroStrip
                id="lab-intro"
                description="Tech-Convergence Hub được định vị là hạt nhân chiến lược của hệ sinh thái UniverCity Innovation Hub UEH, nơi hội tụ công nghệ mũi nhọn, tri thức liên ngành và thực tiễn đô thị nhằm giải quyết các thách thức phát triển của Việt Nam và khu vực. Trung tâm hướng tới hình thành một hệ sinh thái đổi mới sáng tạo đa ngành tiêu chuẩn quốc tế, dựa trên các nền tảng công nghệ cốt lõi như trí tuệ nhân tạo, robotics, khoa học dữ liệu, công nghệ mô phỏng, vả nhập vai. Các nền tảng này được tích hợp trong các mô hình phòng thí nghiệm truyền thống, phòng thí nghiệm sống (Living Labs) và không gian thử nghiệm công nghệ mở, cho phép nghiên cứu, đào tạo, ứng dụng, chuyển giao được triển khai song song, liên tục và gắn chặt với thực tiễn."
              />
            </div>
          </div>

          <LabDirectory showHeader={false} />
        </section>
      </main>
      <Footer />
    </>
  );
}