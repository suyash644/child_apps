module.exports = function (api) {
  api.cache(true)
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Required for Expo Router
      require.resolve('expo-router/babel'),
      // Required for Zustand persist with React Native
      ['@babel/plugin-transform-modules-commonjs', { strictMode: true }],
    ],
  }
}
