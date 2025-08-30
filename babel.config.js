module.exports = function (api) {
  api.cache(false);

  const plugins = [
    [
      require.resolve("babel-plugin-module-resolver"),
      {
        root: ["."],
        extensions: [
          ".js",
          ".android.js",
          ".ios.js",
          ".android.tsx",
          ".ios.tsx",
          ".ts",
          ".tsx",
          ".ios.ts",
          ".android.ts",
        ],
        alias: {
          "@/hooks": "./src/core/hooks",
          "@/components": "./src/platforms/mobile/components",
          "@/screens": "./src/platforms/mobile/screens",
          "@/navigation": "./src/platforms/mobile/navigation",
          "@/services": "./src/core/services",
          "@/context": "./src/core/context",
          "@/types": "./src/core/types",
          "@/utils": "./src/core/utils",
          "@/styles": "./src/shared/styles",
          "@/i18n": "./src/shared/i18n/i18n",
        },
      },
    ],
  ];

  return {
    presets: ["babel-preset-expo"],
    plugins,
  };
};
