const { addBeforeLoader, loaderByName } = require('@craco/craco');

module.exports = {
  style: {
    postcss: {
      plugins: [require("tailwindcss"), require("autoprefixer")],
    },
  },
  webpack: {
    configure: (webpackConfig) => {
      const workerLoader = {
        test: /\.worker\.ts$/,
        use: [
          {
            loader: require.resolve('worker-loader'),
          },
        ],
      };

      addBeforeLoader(webpackConfig, loaderByName('ts-loader'), workerLoader);

      return webpackConfig;
    },
  },
};
