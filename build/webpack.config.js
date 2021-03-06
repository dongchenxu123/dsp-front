import webpack from 'webpack'
var path = require("path");
import cssnano from 'cssnano'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import config from '../config'
import _debug from 'debug'
const debug = _debug('app:webpack:config')
const paths = config.utils_paths

const {__DEV__, __PROD__, __TEST__} = config.globals

const ignoreModules = new webpack.IgnorePlugin(/redux-devtools/)

const nodeModulesDir = paths.base() + '/node_modules';

debug('Create configuration.')
debug('Create version.' + process.env.TARGETAGENCY )
const webpackConfig = {
  name: 'client',
  target: 'web',
  devtool: config.compiler_devtool,
  // cache: config.compiler_cache,
  resolve: {
    root: paths.base(config.dir_client),
    extensions: ['', '.js', '.jsx'],
    alias: {
    }
  },
  module: {}
}
// ------------------------------------
// Entry Points
// ------------------------------------
const APP_ENTRY_PATH = paths.base(config.dir_client) + `/entry/main-${config.targetAgency || 'xb'}.js`

webpackConfig.entry = {
  app: __DEV__
    ? [APP_ENTRY_PATH, 'webpack-hot-middleware/client?path=/__webpack_hmr']
    : [APP_ENTRY_PATH],
  vendor: config.compiler_vendor
}

// ------------------------------------
// Bundle Output
// ------------------------------------
webpackConfig.output = {
  filename: `${config.dev_url_prefix}[name].[${config.compiler_hash_type}].js`,
  path: paths.base(config.dir_dist),
  publicPath: config.compiler_public_path
}

/*------------------------------------
 Plugins
new webpack.DllReferencePlugin({
  context: '../build_vendor',
  manifest: require('../dll/vendor.manifest.json')
}),
// ------------------------------------
*/
webpackConfig.plugins = [
  new webpack.DefinePlugin(config.globals),
  new webpack.optimize.DedupePlugin(),
  new webpack.optimize.OccurrenceOrderPlugin(),
  /*new webpack.optimize.CommonsChunkPlugin({
    name: "vendor.js",
    minChunks: module => /node_modules/.test(module.resource)
  }),*/
  new HtmlWebpackPlugin({
    template: paths.client('indexTpl/index-' + (config.targetAgency || 'xb') +'.html'),
    hash: false,
    //favicon: paths.client('static/favicon.ico'),
    filename: 'index.html',
    inject: 'body',
    minify: {
      collapseWhitespace: true
    }
  })
]

if (__DEV__) {
  debug('Enable plugins for live development (HMR, NoErrors).')
  webpackConfig.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  )
} else if (__PROD__) {
  debug('Apply UglifyJS plugin.')
  webpackConfig.plugins.push(ignoreModules)
  webpackConfig.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        unused: true,
        dead_code: true,
        warnings: false
      }
    })
  )
}

// Don't split bundles during testing, since we only want import one bundle
if (!__TEST__) {
  webpackConfig.plugins.push(
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor'],
      minChunks: module => /node_modules/.test(module.resource)
  }))
}

webpackConfig.module.noParse = [
  nodeModulesDir
]

// ------------------------------------
// Pre-Loaders
// ------------------------------------
webpackConfig.module.preLoaders = [{
  test: /\.(js|jsx)$/,
  loader: 'eslint',
  exclude: /node_modules/
}]

webpackConfig.eslint = {
  configFile: paths.base('.eslintrc'),
  emitWarning: __DEV__
}

// ------------------------------------
// Loaders
/*env: {
 production: {
 presets: ['react-optimize']
 }
 }*/
// ------------------------------------
// JavaScript / JSON
webpackConfig.module.loaders = [{
  test: /\.(js|jsx)$/,
  exclude: /node_modules/,
  loader: 'babel',
  query: {
    cacheDirectory: true,
    plugins: ['transform-runtime'],
    presets: __DEV__
      ? ['es2015', 'react', 'stage-0', 'react-hmre']
      : ['es2015', 'react', 'stage-0']

  }
},
{
  test: /\.json$/,
  loader: 'json'
}]

// Styles
const cssLoader = !config.compiler_css_modules
  ? 'css?sourceMap'
  : [
    'css?modules',
    'sourceMap',
    'importLoaders=1',
    'localIdentName=[name]__[local]___[hash:base64:5]'
  ].join('&')

webpackConfig.module.loaders.push({
  test: /\.scss$/,
  include: /src/,
  loaders: [
    'style',
    cssLoader,
    'postcss',
    'sass'
  ]
})

webpackConfig.module.loaders.push({
  test: /\.css$/,
  include: /src/,
  loaders: [
    'style',
    cssLoader,
    'postcss'
  ]
})

/*webpackConfig.module.loaders.push({
  test: /\.less$/,
  loader: 'style!css!less?{"modifyVars":{"THEME":"' + config.targetAgency + '"}}'
})*/

// Don't treat global SCSS as modules
webpackConfig.module.loaders.push({
  test: /\.scss$/,
  exclude: /src/,
  loaders: [
    'style',
    'css?sourceMap',
    'postcss',
    'sass'
  ]
})

// Don't treat global, third-party CSS as modules
webpackConfig.module.loaders.push({
  test: /\.css$/,
  exclude: /src/,
  loaders: [
    'style',
    'css?sourceMap',
    'postcss'
  ]
})
webpackConfig.sassLoader = {
  includePaths: paths.client('styles')
}

webpackConfig.postcss = [
  cssnano({
    sourcemap: true,
    autoprefixer: {
      add: true,
      remove: true,
      browsers: ['last 2 versions']
    },
    safe: true,
    discardComments: {
      removeAll: true
    }
  })
]

webpackConfig.module.loaders.push({
  test: /\.less$/,
  exclude: /node_modules/,
  loaders: ['style', 'css', 'less?{"modifyVars":{"THEME":"' + config.targetAgency + '"}}']
})

// File loaders
/* eslint-disable */
webpackConfig.module.loaders.push(
  { test: /\.woff(\?.*)?$/,  loader: 'url?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=application/font-woff' },
  { test: /\.woff2(\?.*)?$/, loader: 'url?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=application/font-woff2' },
  { test: /\.otf(\?.*)?$/,   loader: 'file?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=font/opentype' },
  { test: /\.ttf(\?.*)?$/,   loader: 'url?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=application/octet-stream' },
  { test: /\.eot(\?.*)?$/,   loader: 'file?prefix=fonts/&name=[path][name].[ext]' },
  { test: /\.svg(\?.*)?$/,   loader: 'url?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=image/svg+xml' },
  { test: /\.(png|jpg)$/,    loader: 'url?limit=8192' }
)
/* eslint-enable */

// ------------------------------------
// Finalize Configuration
// ------------------------------------
// when we don't know the public path (we know it only when HMR is enabled [in development]) we
// need to use the extractTextPlugin to fix this issue:
// http://stackoverflow.com/questions/34133808/webpack-ots-parsing-error-loading-fonts/34133809#34133809
if (!__DEV__) {
  debug('Apply ExtractTextPlugin to CSS loaders.')
  const d = new Date()
  debug('start time', d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate() + '-' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds())
  webpackConfig.module.loaders.filter(loader =>
    loader.loaders && loader.loaders.find(name => /css/.test(name.split('?')[0]))
  ).forEach(loader => {
    const [first, ...rest] = loader.loaders
    loader.loader = ExtractTextPlugin.extract(first, rest.join('!'))
    delete loader.loaders
  })
  webpackConfig.plugins.push(
    new ExtractTextPlugin('[name].[contenthash].css', {
      allChunks: true
    })
  )
}

export default webpackConfig
