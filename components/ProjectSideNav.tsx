import Link from "next/link";
import type { SiteNavItem } from "./siteNavItems";

type NavLink = {
	href: string;
	label: string;
	current?: boolean;
};

type ProjectSideNavProps = {
	ariaLabel: string;
	backHref: string;
	backLabel: string;
	kicker: string;
	links: NavLink[];
	compact?: boolean;
};

function toSiteNavLink(link: NavLink): SiteNavItem {
	return { href: link.href, label: link.label, active: link.current };
}

export function ProjectSideNav({ ariaLabel, backHref, backLabel, kicker, links, compact }: ProjectSideNavProps) {
	const siteNavLinks = links.map(toSiteNavLink);

	return (
		<aside className="home-vision-nav" aria-label={ariaLabel}>
			<div className="home-vision-nav-card">
				<nav className="home-vision-links">
					<Link className="home-vision-back" href={backHref} style={{ color: "#111111" }}>
						<span aria-hidden="true">←</span>
						<span>{backLabel}</span>
					</Link>

					{!compact ? <div className="home-vision-rule" aria-hidden="true" /> : null}

					{!compact ? <p className="home-vision-kicker">{kicker}</p> : null}

					{siteNavLinks.map((link) => (
						<Link
							key={link.label}
							href={link.href}
							className={link.active ? "active" : undefined}
							aria-current={link.active ? "location" : undefined}
							style={{ color: link.active ? "var(--accent)" : "#111111" }}
						>
							{link.label}
						</Link>
					))}

					{!compact ? <div className="home-vision-rule home-vision-rule-bottom" aria-hidden="true" /> : null}
				</nav>
			</div>
		</aside>
	);
}