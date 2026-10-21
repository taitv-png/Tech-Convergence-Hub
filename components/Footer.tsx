import Image from "next/image";
import Link from "next/link";
import { Arrow } from "./Arrow";
export function Footer() {
  return (
    <footer className="site-footer" id="contact">
      <div className="site-container">
        <div className="footer-top">
          <div>
            <Image
              src={(process.env.NEXT_PUBLIC_BASE_PATH ?? "") + "/tch-logo-lockup.png"}
              width={200}
              height={70}
              alt="Tech-Convergence Hub"
            />
            <p>
              Tri thức liên ngành.
              <br />
              Công nghệ hội tụ. Giá trị thực tiễn.
            </p>
          </div>
          <div>
            <span className="eyebrow">Khám phá</span>
            <Link href="/labs">Không gian & Labs</Link>
            <Link href="/explore">Bản đồ & Tham quan 3D</Link>
            <Link href="/news">Tin & hoạt động</Link>
          </div>
          <div>
            <span className="eyebrow">Kết nối với TCH</span>
            <a href="mailto:tch@ueh.edu.vn">
              tch@ueh.edu.vn <Arrow diagonal />
            </a>
            <p>
              Campus E, UEH
              <br />
              54 Nguyễn Văn Thủ, TP. Hồ Chí Minh
            </p>
            <a href="https://iscm.ueh.edu.vn/" target="_blank" rel="noreferrer">
              ISCM, UEH <Arrow diagonal />
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Tech-Convergence Hub</span>
          <span>Nền tảng nghiên cứu và đổi mới mở tại UEH</span>
          <Link href="/credits">Nguồn ảnh</Link>
          <a href="#main-content">Về đầu trang ↑</a>
        </div>
      </div>
    </footer>
  );
}
