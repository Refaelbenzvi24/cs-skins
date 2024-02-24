import bundleAnalyzer from "@next/bundle-analyzer";
import withTwin from './withTwin.mjs'
import Icons from 'unplugin-icons/webpack'
import AutoImport from "unplugin-auto-import/webpack"
import IconsResolver from 'unplugin-icons/resolver'
import "./src/env.mjs";
import "@acme/auth/env";

/**
 * @type {import('next').NextConfig}
 */
const config = withTwin({
	reactStrictMode: true,
	swcMinify: true,
	productionBrowserSourceMaps: true,
	experimental: {
		serverActions: true,
		esmExternals: "loose",
		// optimizeCss: true, // enabling this will enable SSR for Tailwind
	},

	webpack: (config, options) => {
		const {webpack} = options
		if (options.isServer) config.devtool = 'source-map';

		config.plugins.push(
			Icons({
				compiler: 'jsx',
				jsx: 'react'
			})
		)

		config.plugins.push(
			AutoImport({
				resolvers: [
					IconsResolver({
						componentPrefix: 'Icon',
						extension: 'jsx'
					})
				],
				include: [
					/\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
					/\.md$/, // .md
				],
				dts: 'src/auto-imports.d.ts',
			})
		)

		config.plugins.push(
			bundleAnalyzer({
				enabled: process.env.ANALYZE === "true",
			}),
		)

		config.plugins.push(new webpack.IgnorePlugin({
			resourceRegExp: /^pg-native$|^cloudflare:sockets$/,
		}))

		config.module.rules.push({
			test: /\.ya?ml$/,
			use: 'yaml-loader'
		})

		const fileLoaderRule = config.module.rules.find((rule) =>
			rule.test?.test?.('.svg'),
		)
		config.module.rules.push(
			// Reapply the existing rule, but only for svg imports ending in ?url
			{
				...fileLoaderRule,
				test: /\.svg$/i,
				resourceQuery: /url/, // *.svg?url
			},
			// Convert all other *.svg imports to React components
			{
				test: /\.svg$/i,
				issuer: fileLoaderRule.issuer,
				resourceQuery: {not: [...fileLoaderRule.resourceQuery.not, /url/]}, // exclude if *.svg?url
				use: ['@svgr/webpack'],
			},
		)
		// Modify the file loader rule to ignore *.svg, since we have it handled now.
		fileLoaderRule.exclude = /\.svg$/i

		config.plugins.push(
			new webpack.EnvironmentPlugin({
				NODE_ENV: 'production',
			})
		)

		return {...config}
	},
	transpilePackages: ["@acme/api", "@acme/auth", "@acme/db", "@acme/logger", "@acme/ui"],
	eslint: {ignoreDuringBuilds: true},
	typescript: {ignoreBuildErrors: true},
})

export default config
