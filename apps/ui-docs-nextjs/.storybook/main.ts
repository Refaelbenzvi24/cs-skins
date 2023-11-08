import { dirname, join } from "path";
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
		getAbsolutePath("@storybook/addon-links"),
		getAbsolutePath("@storybook/addon-essentials"),
		getAbsolutePath("@storybook/addon-interactions"),
		getAbsolutePath("storybook-addon-rtl-direction"),
		getAbsolutePath("storybook-dark-mode"),
		getAbsolutePath("@storybook/addon-a11y")
	],
	framework: {
		name:    getAbsolutePath("@storybook/nextjs"),
		options: {
			nextConfigPath: "../next.config.mjs",
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

function getAbsolutePath(value: string): any {
    return dirname(require.resolve(join(value, "package.json")));
}
