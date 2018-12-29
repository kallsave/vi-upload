const path = require('path');
const buble = require('rollup-plugin-buble');
const babel = require('rollup-plugin-babel');
const node = require('rollup-plugin-node-resolve');
const cjs = require('rollup-plugin-commonjs');
const postcss = require('rollup-plugin-postcss');
const minify = require('rollup-plugin-babel-minify');

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
      minify()
    ]
  },
  umd: {
    input: resolve('src/index.js'),
    output: {
      file: resolve('dist/vi-upload.umd.js'),
      format: 'umd',
      name: 'ViUpload',
    },
    plugins: [
      postcss(),
      node(),
      cjs(),
      buble(),
      minify()
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





