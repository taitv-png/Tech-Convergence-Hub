import type { NextConfig } from "next";

const repoName = "Tech-Convergence-Hub";
const isGithubPagesBuild = process.env.GITHUB_ACTIONS === "true";
const basePath = isGithubPagesBuild ? `/${repoName}` : "";

const watchIgnoredPattern =
	/node_modules|^[a-z]:[\\/](?:dumpstack\.log\.tmp|pagefile\.sys|swapfile\.sys|hiberfil\.sys)(?:$|[\\/])|^[a-z]:[\\/]system volume information(?:$|[\\/])/i;

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
			ignored: watchIgnoredPattern,
		};

		return config;
	},
};

export default nextConfig;
