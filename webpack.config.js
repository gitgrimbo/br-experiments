const path = require("path");
const webpack = require("webpack");

const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

// the following folders are not web functions, and so should not be put in the entry object
// "roster", "stats", "twitter"
const entry = [
  "banner",
  "calendar",
  "google-picker",
  "image-generator",
  "roster-badge",
  "schedule",
  "sheets",
].reduce((entry, name) => {
  entry[name] = [
    "babel-polyfill",
    path.resolve(__dirname, `./experiments/${name}/index.js`),
  ];
  return entry;
}, {});

module.exports = {
  entry,
  mode: "development",
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        loader: "babel-loader",
        options: { presets: ["@babel/preset-env", "@babel/preset-react"] },
      },
    ],
  },
  resolve: { extensions: ["*", ".js", ".jsx"] },
  output: {
    path: path.resolve(__dirname, "dist/"),
    publicPath: "/br-experiments/dist/",
    filename: "[name].js",
  },
  devServer: {
    contentBase: path.join(__dirname, "/"),
    // use all hosts so that local DNS works with webpack dev server
    host: "0.0.0.0",
    port: 443,
    allowedHosts: [
      "local.sheffieldbladerunners.co.uk",
      "local.paulgri.me",
    ],
    publicPath: "http://localhost:3000/dist/",
    hotOnly: true,
    https: true,
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new BundleAnalyzerPlugin({
      openAnalyzer: false,
      analyzerMode: "static",
      generateStatsFile: true,
    }),
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          // outputs a vendors.js bundle
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all",
        },
      },
    },
  },
};
