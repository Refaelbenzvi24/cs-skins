const path                        = require('path')
const babelPluginMacros           = require('babel-plugin-macros')
const emotionBabelPlugin          = require('@emotion/babel-plugin')
const babelPluginSyntaxTypescript = require('@babel/plugin-syntax-typescript')

// The folders containing files importing twin.macro
const includedDirs = [
    path.resolve(__dirname, 'src/components'),
    path.resolve(__dirname, 'src/pages'),
    path.resolve(__dirname, 'src/styles'),
    path.resolve(__dirname, '../../packages/ui/src')
]

/** @type {(nextConfig: import("next").NextConfig) => import("next").NextConfig} */
const withTwin = (nextConfig) => {
    return {
        ...nextConfig,
        webpack(config, options) {
            const {dev, isServer} = options
            config.module         = config.module || {}
            config.module.rules   = config.module.rules || []
            config.module.rules.push({
                test:    /\.(tsx|ts)$/,
                include: includedDirs,
                use:     [
                    options.defaultLoaders.babel,
                    {
                        loader:  'babel-loader',
                        options: {
                            sourceMaps: dev,
                            presets:    [
                                [
                                    '@babel/preset-react',
                                    {runtime: 'automatic', importSource: '@emotion/react'},
                                ],
                            ],
                            plugins:    [
                                babelPluginMacros,
                                emotionBabelPlugin,
                                [
                                    babelPluginSyntaxTypescript,
                                    {isTSX: true},
                                ],
                            ],
                        },
                    },
                ],
            })

            if (!isServer) {
                config.resolve.fallback = {
                    ...(config.resolve.fallback || {}),
                    fs:     false,
                    module: false,
                    path:   false,
                    os:     false,
                    crypto: false,
                }
            }

            if (typeof nextConfig.webpack === 'function') {
                return nextConfig.webpack(config, options)
            } else {
                return config
            }
        },
    }
}

module.exports = withTwin
