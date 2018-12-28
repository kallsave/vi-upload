const rollup = require('rollup');

let builds = require('./config').getAllBuilds();

for (let config of builds) {
  buildEntry(config);
}

function buildEntry (config) {
  rollup.rollup({
    input: config.input,
    plugins: config.plugins
  }).then(function(bundle){
    bundle.write(config.output)
  })
}
