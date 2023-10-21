import Icons from 'unplugin-icons/webpack'
import withTwin from "./withTwin.cjs";
import {default as withNextTranslate} from "next-translate-plugin"
// Importing env files here to validate on build
import "./src/env.mjs";
import "@acme/auth/env.mjs";

/** @type {import("next").NextConfig} */
const config = withTwin(withNextTranslate({
    reactStrictMode: true,
    swcMinify:       true,
    experimental: {
        serverActions: true,
    },

    // @ts-ignore-next-line
    i18n: {
        localeDetection: false,
    },

    webpack: (config) => {
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
    transpilePackages: ["@acme/api", "@acme/auth", "@acme/db"],
    eslint: { ignoreDuringBuilds: true },
    typescript: { ignoreBuildErrors: true },
}))

export default config
