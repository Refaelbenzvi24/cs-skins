import bundleAnalyzer from "@next/bundle-analyzer";
import withTwin from './withTwin.mjs'
import Icons from 'unplugin-icons/webpack'
import AutoImport from "unplugin-auto-import/webpack"
import IconsResolver from 'unplugin-icons/resolver'
import "./src/env.mjs";
import "@acme/auth/env.js";

/**
 * @type {import('next').NextConfig}
 */
const config = withTwin({
	reactStrictMode: true,
	swcMinify: true,
	experimental: {
		serverActions: true
		// optimizeCss: true, // enabling this will enable SSR for Tailwind
	},

	webpack: (config, {webpack}) => {
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
						extension:       'jsx'
					})
				],
				include:   [
					/\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
					/\.md$/, // .md
				],
				dts:       'src/auto-imports.d.ts',
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

		return config
	},
	transpilePackages: ["@acme/api", "@acme/auth", "@acme/db", "@acme/ui", "@trpc/next-layout"],
	eslint: {ignoreDuringBuilds: true},
	typescript: {ignoreBuildErrors: true},
})

export default config
