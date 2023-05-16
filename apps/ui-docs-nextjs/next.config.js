const withTwin = require('./withTwin.js')
const Icons    = require('unplugin-icons/webpack')

/** @type {import("next").NextConfig} */
const config = withTwin({
    reactStrictMode: true,
    swcMinify:       true,
    webpack:         (config) => {
        config.plugins.push(
            Icons({
                compiler: 'jsx',
                jsx:      'react'
            }),
        )

        return config
    },

    /** Enables hot reloading for local packages without a build step */
    transpilePackages: ["@acme/ui"],
    /** We already do linting and typechecking as separate tasks in CI */
    eslint:     {ignoreDuringBuilds: !!process.env.CI},
    typescript: {ignoreBuildErrors: !!process.env.CI}
})

module.exports = config;
