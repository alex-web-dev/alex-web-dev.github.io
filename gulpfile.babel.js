import postcss from 'gulp-postcss';
import sourcemaps from 'gulp-sourcemaps';
import autoprefixer from 'autoprefixer';
import del from 'del';
import { src, dest, watch, series, parallel } from 'gulp';
import yargs from 'yargs';
import sass from 'gulp-sass';
import cleanCss from 'gulp-clean-css';
import gulpif from 'gulp-if';
import imagemin from 'gulp-imagemin';
import webpack from 'webpack-stream';
import named from 'vinyl-named';
import browserSync from 'browser-sync';
import hash from 'gulp-hash';
import clone from 'gulp-clone';
import webp from 'gulp-webp';
import penthouse from 'penthouse';
import replace from 'gulp-replace';
import inject from 'gulp-inject-string';

var cloneSink = clone.sink();

const PRODUCTION = yargs.argv.prod;
export const html = () => {
    return src(["*.php", "*.html"])
        .pipe(replace(new RegExp('<!-- Critical CSS --><style>.*<\/style>', "g"), '<!-- Critical CSS -->'))
        .pipe(dest('.'))

}

export const styles = () => {
    return src(['src/scss/main.scss'])
        .pipe(gulpif(!PRODUCTION, sourcemaps.init()))
        .pipe(sass().on('error', sass.logError))
        .pipe(gulpif(PRODUCTION, postcss([autoprefixer])))
        .pipe(gulpif(PRODUCTION, cleanCss({ compatibility: 'ie8' })))
        .pipe(gulpif(!PRODUCTION, sourcemaps.write()))
        .pipe(dest('dist/css'))
        .pipe(server.stream());
}

export const watcher = () => {
    watch('src/scss/**/*.scss', series(styles, reload));
    watch('src/images/**/*.{jpg,jpeg,png,svg,gif}', series(images, reload));
    watch(['src/**/*', '!src/{images,js,scss}', '!src/{images,js,scss}/**/*'], series(copy, reload));
    watch('src/js/**/*.js', series(scripts, reload));
    watch("**/*.php", reload);
    watch("**/*.html", reload);

}

export const images = () => {
    return src('src/images/**/*.{jpg,jpeg,png,svg,gif}')
        .pipe(gulpif(PRODUCTION, imagemin()))
        .pipe(cloneSink)        // clone image
        .pipe(webp())      // convert cloned image to WebP
        .pipe(cloneSink.tap())  // restore original image
        .pipe(dest('dist/images'));
}

export const copy = () => {
    return src(['src/**/*', '!src/{images,js,scss}', '!src/{images,js,scss}/**/*'])
        .pipe(dest('dist'));
}

export const clean = () => del(['dist']);

export const scripts = () => {
    return src(['src/js/common.js'])
        .pipe(named())
        .pipe(webpack({
            module: {
                rules: [
                    {
                        test: /\.js$/,
                        use: {
                            loader: 'babel-loader',
                            options: {
                                presets: ["@babel/preset-env"]
                            }
                        }
                    }
                ]
            },
            mode: PRODUCTION ? 'production' : 'development',
            devtool: !PRODUCTION ? 'inline-source-map' : false,
            output: {
                filename: '[name].js'
            }
        }))
        .pipe(dest('dist/js'))
}

export const criticalCSS = () => {
    return penthouse({
        url: 'file:///D:/Sites/alex-web-dev.github.io/index.html', //Use file:/// for local html files
        css: 'dist/css/main.css',
        width: 1280,
        height: 800
    }, function (err, criticalCss) {
        if (criticalCss) {
            src('./index.html')
                .pipe(inject.after('<!-- Critical CSS -->', '<style>' + criticalCss + '</style>'))
                .pipe(dest('.'))
        }
    });
}

const server = browserSync.create();
export const serve = done => {
    server.init({
        server: "./"
    });
    done();
};

export const reload = done => {
    server.reload();
    done();
};

export const dev = series(clean, parallel(styles, images, copy, scripts), html, serve, watcher);
export const build = series(clean, parallel(styles, images, copy, scripts), html, criticalCSS);
export default dev;