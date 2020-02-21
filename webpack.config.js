const path = require("path");
const webpack = require("webpack");

const { DefinePlugin, HotModuleReplacementPlugin } = webpack;

const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const gitrev = require('git-rev-sync');

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
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /(node_modules|bower_components)/,
        loader: "babel-loader",
        options: {
          presets: ["@babel/preset-env", "@babel/preset-typescript", "@babel/preset-react"],
        },
      },
      {
        test: /\.html$/i,
        loader: "html-loader",
      },
    ],
  },
  resolve: { extensions: ["*", ".ts", ".tsx", ".js", ".jsx"] },
  output: {
    path: path.resolve(__dirname, "dist/"),
    publicPath: "/br-experiments/dist/",
    filename: "[name].js",
  },
  devtool: "source-map",
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
    new DefinePlugin({
      "GIT_SHORT": JSON.stringify(gitrev.short()),
      "GIT_LONG": JSON.stringify(gitrev.long()),
      "GIT_DATE": JSON.stringify(gitrev.date()),
      "GIT_BRANCH": JSON.stringify(gitrev.branch()),
    }),
    new HotModuleReplacementPlugin(),
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
