import Link from "next/link";

const primaryLinks = [
  { label: "Tin tức + Cập nhật", href: "/news" },
  { label: "Nghiên cứu", href: "/labs" },
  { label: "Giới thiệu", href: "/" },
  { label: "Cơ hội hợp tác", href: "/labs" },
  { label: "Chương trình sau đại học", href: "/" },
  { label: "Con người", href: "/" },
  { label: "Sự kiện", href: "/news" },
  { label: "Cổng thông tin thành viên", href: "/" },
  { label: "Báo chí + Truyền thông", href: "/news" },
];

const exploreLinks = [
  { label: "Video", href: "/news" },
  { label: "Ấn phẩm", href: "/news" },
  { label: "Cơ hội nghề nghiệp", href: "/" },
  { label: "Liên hệ", href: "/" },
];

const socialLinks = [
  { label: "X", href: "https://x.com" },
  { label: "Facebook", href: "https://facebook.com" },
  { label: "Instagram", href: "https://instagram.com" },
  { label: "LinkedIn", href: "https://linkedin.com" },
  { label: "YouTube", href: "https://youtube.com" },
];

const legalLinks = [
  { label: "Chính sách truy cập", href: "/" },
  { label: "Hỗ trợ UEH", href: "/" },
];

export function Footer() {
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
            <strong>UEH</strong>
            <p>Đại học Kinh tế Thành phố Hồ Chí Minh</p>
          </div>

          <nav className="footer-link-list footer-link-list-side" aria-label="Thông tin bổ sung">
            {legalLinks.map((item) => (
              <Link key={item.label} href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
