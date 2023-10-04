/** @type {import("next").NextConfig} */
const config = {
    reactStrictMode: true,
    swcMinify:       true,
    transpilePackages: ["@acme/ui"]
}

export default config
