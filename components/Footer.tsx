import Image from "next/image";
import Link from "next/link";

const primaryLinks = [
  { label: "Về TCH", href: "/" },
  { label: "Tin & sự kiện", href: "/news" },
  { label: "Giáo dục", href: "/" },
  { label: "Danh mục labs", href: "/labs" },
  { label: "Nhân sự", href: "/" },
];

const exploreLinks = [
  { label: "Video", href: "/news" },
  { label: "Ấn phẩm", href: "/news" },
  { label: "Liên hệ", href: "/" },
];

const socialLinks = [
  { label: "X", href: "https://x.com" },
  { label: "Facebook", href: "https://facebook.com" },
  { label: "Instagram", href: "https://instagram.com" },
  { label: "LinkedIn", href: "https://linkedin.com" },
  { label: "YouTube", href: "https://youtube.com" },
];

export function Footer() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-column footer-column-main no-symbol">
          <nav className="footer-link-list footer-link-list-main" aria-label="Điều hướng chính">
            {primaryLinks.map((item) => (
              <Link key={item.label} href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="footer-column">
          <span className="footer-heading">Khám phá thêm</span>
          <nav className="footer-link-list" aria-label="Khám phá thêm">
            {exploreLinks.map((item) => (
              <Link key={item.label} href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="footer-column footer-column-side">
          <div className="footer-social" aria-label="Kênh xã hội">
            {socialLinks.map((item) => (
              <a key={item.label} href={item.href} target="_blank" rel="noreferrer">
                {item.label}
              </a>
            ))}
          </div>

          <div className="footer-signature">
            <a className="footer-ueh-logo-link" href="https://ueh.edu.vn/" target="_blank" rel="noreferrer">
              <Image
                className="footer-ueh-logo"
                src={`${basePath}/logos/ueh.png`}
                alt="UEH"
                width={240}
                height={90}
              />
            </a>
            <p>Đại học Kinh tế Thành phố Hồ Chí Minh</p>
          </div>

          <div className="footer-contact" aria-label="Thông tin liên hệ TCH">
            <a href="mailto:tch@ueh.edu.vn">tch@ueh.edu.vn</a>
            <p>54 Nguyễn Văn Thủ, Tân Định, Hồ Chí Minh</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
