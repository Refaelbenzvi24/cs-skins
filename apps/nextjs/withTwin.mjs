import path from 'path'
import babelPluginMacros from 'babel-plugin-macros'
// @ts-ignore
import emotionBabelPlugin from "@emotion/babel-plugin"
// @ts-ignore
import babelPluginSyntaxTypescript from '@babel/plugin-syntax-typescript'
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

// The folders containing files importing twin.macro
const includedDirs = [
    path.resolve(__dirname, 'src'),
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

export default withTwin
