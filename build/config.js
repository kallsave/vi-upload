const path = require('path');
const buble = require('rollup-plugin-buble');
const node = require('rollup-plugin-node-resolve');
const cjs = require('rollup-plugin-commonjs');
const postcss = require('rollup-plugin-postcss');

const resolve = (p) => {
  return path.resolve(__dirname, '../', p);
}

const builds = {
  esm: {
    input: resolve('src/index.js'),
    output: {
      file: resolve('dist/vi-upload.esm.js'),
      format: 'es',
    },
    plugins: [
      postcss(),
      node(),
      cjs(),
    ]
  },
  umd: {
    input: resolve('src/index.js'),
    output: {
      file: resolve('dist/vi-upload.umd.js'),
      // 直接引入
      format: 'umd',
      name: 'ViUpload',
    },
    plugins: [
      postcss(),
      node(),
      cjs(),
      buble(),
    ]
  }
}

function genConfig(name) {
  const options = builds[name];
  let config = {
    input: options.input,
    output: options.output,
    plugins: options.plugins,
  };
  return config;
}

if (process.env.TARGET) {
  module.exports = genConfig(process.env.TARGET);
} else {
  exports.getBuild = genConfig;
  exports.getAllBuilds = () => Object.keys(builds).map(genConfig);
}





