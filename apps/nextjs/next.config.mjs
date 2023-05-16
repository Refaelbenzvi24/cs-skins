import Icons from 'unplugin-icons/webpack'
import withTwin from "./withTwin.mjs";
import {default as withNextTranslate} from "next-translate-plugin"

/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds and Linting.
 */
!process.env.SKIP_ENV_VALIDATION && (await import("./src/env.mjs"));

/** @type {import("next").NextConfig} */
const config = withTwin(withNextTranslate({
    reactStrictMode: true,
    swcMinify:       true,
    webpack:         (config) => {
        config.plugins.push(
            Icons({
                compiler: 'jsx',
                jsx:      'react'
            })
        )
        config.module.rules.push({
            test: /\.ya?ml$/,
            use:  'yaml-loader'
        })

        return config
    },
    // experimental:      {
    //     optimizeCss: true, // enabling this will enable SSR for Tailwind
    // },
    transpilePackages: ["@acme/api", "@acme/auth", "@acme/db", "@acme/ui"],
    /** We already do linting and typechecking as separate tasks in CI */
    eslint:     {ignoreDuringBuilds: !!process.env.CI},
    typescript: {ignoreBuildErrors: !!process.env.CI}
}))

export default config
