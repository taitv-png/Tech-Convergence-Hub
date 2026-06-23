import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	webpack(config) {
		config.watchOptions = {
			...(config.watchOptions ?? {}),
			ignored: [
				...(Array.isArray(config.watchOptions?.ignored)
					? config.watchOptions.ignored.filter(
							(item): item is string => typeof item === "string" && item.length > 0,
						)
					: []),
				"**/pagefile.sys",
				"**/swapfile.sys",
				"**/hiberfil.sys",
			],
		};

		return config;
	},
};

export default nextConfig;
