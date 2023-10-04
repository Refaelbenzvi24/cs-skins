import type { StorybookConfig } from "@storybook/nextjs"
import Icons from "unplugin-icons/webpack"

const config: StorybookConfig = {
	webpackFinal: (config) => {
		config.plugins.push (
			Icons ({
				compiler: "jsx",
				jsx:      "react"
			}),
		)

		return config
	},

	stories:   [
		"../stories/**/*.stories.mdx",
		"../stories/**/*.stories.@(js|jsx|ts|tsx)"
	],
	addons:    [
		"@storybook/addon-links",
		"@storybook/addon-essentials",
		"@storybook/addon-interactions",
		"storybook-addon-rtl-direction",
		// "storybook-addon-next",
		// "storybook-addon-next-router",
		"storybook-dark-mode",
		"@storybook/addon-a11y" // Additional addon for accessibility
	],
	framework: {
		name:    "@storybook/nextjs",
		options: {
			nextConfigPath: "../next.config.cjs",
		},
	},
	core:      {
		disableTelemetry: true,
	},
	"docs":      {
		"autodocs": true
	},

	babel: async options => {
		return {
			...options,
			presets: [...options.presets, "@emotion/babel-preset-css-prop"],
			plugins: [...options.plugins, "babel-plugin-twin", "babel-plugin-macros"],
		}
	},
}

export default config
