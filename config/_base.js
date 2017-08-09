/* eslint key-spacing:0 spaced-comment:0 */
import _debug from 'debug'
import path from 'path'
import { argv } from 'yargs'

const debug = _debug('app:config:_base')
const targetAgency = argv.target || process.env.TARGETAGENCY || 'xb'

const config = {
  env : process.env.NODE_ENV || 'development',

  dev_url_prefix: "",

  // ----------------------------------
  // Project Structure
  // ----------------------------------

  targetAgency: targetAgency,

  // ----------------------------------
  // Project Structure
  // ----------------------------------
  path_base  : path.resolve(__dirname, '../'),
  dir_client : 'src',
  dir_dist   : 'dist/' + targetAgency,
  dir_server : 'server',
  dir_test   : 'tests',
  // ----------------------------------
  // Server Configuration
  // ----------------------------------
  server_host : 'localhost',
  server_port : process.env.PORT || 3332,

  // ----------------------------------
  // Compiler Configuration
  // ----------------------------------
  // compiler_cache         : false,
  compiler_css_modules     : true,
  compiler_devtool          : 'source-map',
  compiler_hash_type        : 'hash',
  compiler_fail_on_warning : false,
  compiler_quiet             : false,
  compiler_public_path      : '',
  compiler_stats             : {
    chunks : false,
    chunkModules : false,
    colors : true
  },
  compiler_vendor : [
    'history',
    'react',
    'react-redux',
    'react-router',
    'redux',
    'redux-actions',
    'react-router-redux',
    'classnames',
    'axios',
    'babel-polyfill'
  ],

  // ----------------------------------
  // Test Configuration
  // ----------------------------------
  coverage_enabled   : !argv.watch,
  coverage_reporters : [
    { type : 'text-summary' },
    { type : 'html', dir : 'coverage' }
  ]
}

/************************************************
-------------------------------------------------

All Internal Configuration Below
Edit at Your Own Risk

-------------------------------------------------
************************************************/

// ------------------------------------
// Environment
// ------------------------------------
// N.B.: globals added here must _also_ be added to .eslintrc
config.globals = {
  'process.env'  : {
    'NODE_ENV' : JSON.stringify(config.env)
  },
  'NODE_ENV'     : config.env,
  '__DEV__'      : config.env === 'development',
  '__PROD__'     : config.env === 'production',
  '__TEST__'     : config.env === 'test',
  '__DEBUG__'    : config.env === 'development' && !argv.no_debug,
  '__DEBUG_NEW_WINDOW__' : !!argv.nw,
  '__BASENAME__' : JSON.stringify(process.env.BASENAME || ''),
  '__DEV_URL_PREFIX__': config.dev_url_prefix,
  '__TARGETAGENCY__': JSON.stringify(targetAgency),
  '__SITE_TITLE__': JSON.stringify(process.env.SITE_TITLE || '')
}

// ------------------------------------
// Validate Vendor Dependencies
// ------------------------------------
const pkg = require('../package.json')

config.compiler_vendor = config.compiler_vendor
  .filter(dep => {
    if (pkg.dependencies[dep]) return true

    debug(
      `Package "${dep}" was not found as an npm dependency in package.json; ` +
      `it won't be included in the webpack vendor bundle.\n` +
      `Consider removing it from vendor_dependencies in ~/config/index.js`
    )
  })
debug(config.globals.__SITE_TITLE__)
// ------------------------------------
// Utilities
// ------------------------------------
config.utils_paths = (() => {
  const resolve = path.resolve

  const base = (...args) =>
    resolve.apply(resolve, [config.path_base, ...args])

  return {
    base   : base,
    client : base.bind(null, config.dir_client),
    dist   : base.bind(null, config.dir_dist)
  }
})()

export default config
