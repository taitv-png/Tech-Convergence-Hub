export type SiteNavItem = {
	href: string;
	label: string;
active?: boolean;
};

export const siteNavItems = [
	{ href: "/", label: "Về Technology Convergence Hub" },
	{ href: "/news", label: "Tin & sự kiện" },
	{ href: "/", label: "Giáo dục" },
	{ href: "/labs", label: "Danh mục labs" },
	{ href: "/", label: "Nhân sự" },
	{ href: "/news", label: "Video" },
	{ href: "/news", label: "Ấn phẩm" },
	{ href: "/", label: "Liên hệ" },
] satisfies SiteNavItem[];
