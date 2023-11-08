/** @type {import("tailwindcss").Config} */
const config = {
    content: ["./stories/**/*.tsx", "../../packages/ui/src/**/*.tsx"],
    // @ts-ignore
    presets: [require("@acme/tailwind-config")],
    plugins: [require("tailwindcss-rtl")]
};

module.exports = config;
