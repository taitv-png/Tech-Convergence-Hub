export type SiteNavItem = {
	href: string;
	label: string;
active?: boolean;
};

export const siteNavItems = [
	{ href: "/", label: "Về TCH" },
	{ href: "/news", label: "Tin & sự kiện" },
	{ href: "/", label: "Giáo dục" },
	{ href: "/labs", label: "Danh mục labs" },
	{ href: "/", label: "Nhân sự" },
	{ href: "/news", label: "Video" },
	{ href: "/news", label: "Ấn phẩm" },
	{ href: "/", label: "Liên hệ" },
] satisfies SiteNavItem[];