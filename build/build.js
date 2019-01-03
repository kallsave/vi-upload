const rollup = require('rollup');
const browserSync = require('browser-sync').create();
const path = require('path');
const portfinder = require('portfinder');

const resolve = (p) => {
  return path.resolve(__dirname, '../', p);
}

const builds = require('./config').getAllBuilds();

async function buildEntry() {
  for (let i = 0; i < builds.length; i++) {
    let config = builds[i];
    await (() => {
      return new Promise((resolve) => {
        rollup.rollup({
          input: config.input,
          plugins: config.plugins
        }).then((bundle) => {
          bundle.write(config.output);
          resolve();
        });
      }).catch(() => {
        console.error(err);
      });
    })();
  }
}

;(async () => {
  await buildEntry()
  if (process.env.NODE_ENV === 'develop') {
    portfinder.getPort((err, port) => {
      if (err) {
        console.log(err)
      } else {
        browserSync.init({
          server: {
            // 服务器的根目录设置在项目根目录,这样项目的文件才能正确访问
            baseDir: resolve(''),
            index: 'examples/index.html'
          },
          port: port,
          notify: false,
          files: [
            {
              match: [resolve('src/**')],
              async fn() {
                await buildEntry()
                browserSync.reload()
              }
            }
          ]
        });
      }
    })
  }
})();
