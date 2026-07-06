import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { NewsSection } from "@/components/NewsSection";
import { ProjectIntroStrip } from "@/components/ProjectIntroStrip";
import { ProjectSideNav } from "@/components/ProjectSideNav";
import { siteNavItems } from "@/components/siteNavItems";

export default function NewsPage() {
  return (
    <>
      <Header />
      <main>
        <section className="container page-title-wrap news-title-grid news-title-wrap" id="news-title">
          <div>
            <h1 className="page-title">Tin tức</h1>
            <p className="lead news-lead">
              Cập nhật định hướng, cơ chế vận hành và danh mục đầu tư của
              Tech-Convergence Hub theo hồ sơ đề xuất mới nhất.
            </p>
          </div>
          <div className="news-title-media" aria-hidden="true" />
        </section>
        <section className="project-page-section">
          <div className="container project-page-layout">
            <ProjectSideNav
              ariaLabel="Điều hướng trong mục tin tức"
              backHref="/"
              backLabel="Overview"
              kicker="In this Project:"
              links={siteNavItems.map((item) => ({
                href: item.href,
                label: item.label,
                current: item.label === "Tin & sự kiện",
              }))}
            />

            <div className="project-page-content">
              <ProjectIntroStrip
                id="news-intro"
                title="Tin tức và hoạt động"
                description="Mục Tin tức được tổ chức như lớp vận hành của Tech-Convergence Hub, nơi ghi nhận các quyết định quản trị, tiến độ triển khai, quan hệ hợp tác và các mốc hoạt động quan trọng của dự án. Nội dung ở đây phản ánh những gì đang thay đổi trong hệ sinh thái: từ định hướng chiến lược, phân bổ nguồn lực, đến các chương trình làm việc, công bố và sự kiện kết nối với đối tác. Cấu trúc này giúp người đọc theo dõi nhanh nhịp phát triển của dự án, đồng thời nhìn thấy mối liên hệ giữa hạ tầng labs, hoạt động nghiên cứu và truyền thông cập nhật của toàn hệ thống."
              />
            </div>
          </div>

          <NewsSection showHeader={false} />
        </section>
      </main>
      <Footer />
    </>
  );
}