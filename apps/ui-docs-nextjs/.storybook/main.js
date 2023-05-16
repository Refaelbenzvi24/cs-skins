const Icons = require('unplugin-icons/webpack')

module.exports = {
    webpackFinal: (config) => {
        config.plugins.push(
            Icons({
                compiler: 'jsx',
                jsx:      'react'
            }),
        )

        return config
    },
    "stories":    [
        "../stories/**/*.stories.mdx",
        "../stories/**/*.stories.@(js|jsx|ts|tsx)"
    ],
    "addons":     [
        "@storybook/addon-links",
        "@storybook/addon-essentials",
        "@storybook/addon-interactions",
        "storybook-addon-rtl-direction",
        "storybook-addon-next",
        "storybook-addon-next-router",
        "storybook-dark-mode"
    ],
    "framework":  "@storybook/react",
    "core":       {
        "builder": "@storybook/builder-webpack5"
    },
    "features":   {
        "storyStoreV7": true
    },

    "typescript": {
        "reactDocgen": false
    }
}
