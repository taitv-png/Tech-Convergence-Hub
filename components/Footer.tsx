import Link from "next/link";

const footerLinks = [
  { label: "Tổng quan", href: "/" },
  { label: "Lab", href: "/labs" },
  { label: "Tin tức", href: "/news" },
];

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-col footer-brand-col">
          <div className="footer-mark">
            <span className="footer-mark-icon">TC</span>
            <div>
              <strong>Tech-Convergence Hub</strong>
              <p>UEH Technology Platform</p>
            </div>
          </div>

          <p className="footer-note">
            Nền tảng điều phối các phòng lab nghiên cứu ứng dụng, phục vụ đào
            tạo, thử nghiệm và chuyển giao công nghệ.
          </p>
        </div>

        <div className="footer-col footer-links-col">
          <span className="footer-label">Khám phá</span>
          <div className="footer-links">
            {footerLinks.map((item) => (
              <Link key={item.label} href={item.href}>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
