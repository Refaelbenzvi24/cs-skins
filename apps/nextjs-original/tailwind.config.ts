import type { Config } from "tailwindcss";

import baseConfig from "@acme/tailwind-config";

export default {
	content: ["./src/**/*.tsx", "../../packages/ui/src/**/*.tsx"],
	presets: [baseConfig],
	plugins: [require ("tailwindcss-rtl")]
} satisfies Config;
