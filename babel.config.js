module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          alias: {
            "@": "./"
          },
          extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
        }
      ],
      "react-native-reanimated/plugin" // ⬅️ Required for Reanimated to work!
    ]
  };
};