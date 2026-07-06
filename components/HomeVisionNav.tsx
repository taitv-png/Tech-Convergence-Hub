import { ProjectSideNav } from "./ProjectSideNav";
import { siteNavItems } from "./siteNavItems";

export function HomeVisionNav() {
  return (
    <ProjectSideNav
      ariaLabel="Điều hướng trong phần giới thiệu"
      backHref="#vision"
      backLabel="Research"
      kicker="Về trang web này"
      links={siteNavItems.map((item) => ({
        href: item.href,
        label: item.label,
        current: item.label === "Về TCH",
      }))}
    />
  );
}