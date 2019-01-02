const rollup = require('rollup');
const browserSync = require('browser-sync').create();
const gulp = require('gulp');
const plumber = require('gulp-plumber');
const stylus = require('gulp-stylus');
const path = require('path');

const resolve = (p) => {
  return path.resolve(__dirname, '../', p);
}

let builds = require('./config').getAllBuilds();

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
    browserSync.init({
      server: {
        // 服务器的根目录设置在项目根目录,这样项目的文件才能正确访问
        baseDir: resolve(''),
        index: 'examples/index.html'
      },
      port: 8999,
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
})();

gulp.task('stylus', function () {
  return gulp.src('../src/modules/**/*.styl')
    .pipe(plumber({
      errorHandler() {
        this.emit('end');
      }
    }))
    .pipe(stylus())
    .on('error', function (err) {
      console.log('Error: ', err.message);
    })
    .pipe(gulp.dest('../src/modules'))
});
