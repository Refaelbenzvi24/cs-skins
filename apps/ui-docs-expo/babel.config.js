module.exports = function (api) {
    api.cache(true);
    return {
        plugins: [
            "nativewind/babel",
            require.resolve("expo-router/babel"),
            ["babel-plugin-react-docgen-typescript", {exclude: "node_modules"}]
        ],
        presets: ["babel-preset-expo"],
    };
};
