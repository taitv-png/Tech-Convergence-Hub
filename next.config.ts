import type { NextConfig } from "next";

const repoName = "Tech-Convergence-Hub";
const isGithubPagesBuild = process.env.GITHUB_ACTIONS === "true";
const basePath = isGithubPagesBuild ? `/${repoName}` : "";

const nextConfig: NextConfig = {
	output: "export",
	images: {
		unoptimized: true,
	},
	env: {
		NEXT_PUBLIC_BASE_PATH: basePath,
	},
	basePath,
	assetPrefix: basePath ? `${basePath}/` : undefined,
	webpack(config) {
		config.watchOptions = {
			...(config.watchOptions ?? {}),
			ignored: [
				...(Array.isArray(config.watchOptions?.ignored)
					? config.watchOptions.ignored.filter(
							(item: unknown): item is string =>
								typeof item === "string" && item.length > 0,
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
