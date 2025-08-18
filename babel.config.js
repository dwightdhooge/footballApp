module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          alias: {
            '@': './src',
            '@/components': './src/components',
            '@/screens': './src/screens',
            '@/navigation': './src/navigation',
            '@/services': './src/services',
            '@/context': './src/context',
            '@/types': './src/types',
            '@/utils': './src/utils',
            '@/hooks': './src/hooks',
            '@/styles': './src/styles',
          },
        },
      ],
    ],
  };
}; 