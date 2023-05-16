/** @type {import("tailwindcss").Config} */
const config = {
    content: ["./src/**/*.tsx", "../../packages/ui/src/**/*.tsx"],
    // @ts-ignore
    presets: [require("@acme/tailwind-config")],
    // @ts-ignore
    plugins: [require("tailwindcss-rtl")]
};

module.exports = config;
