import gulp from 'gulp'
import { init, reload } from 'browser-sync'
import gulpIf from 'gulp-if'
import replace from 'gulp-replace'
import del from 'del'
// для html
import fileinclude from 'gulp-file-include'
import htmlmin from 'gulp-htmlmin'
// для scss
import dartSass from 'sass'
import gulpSass from 'gulp-sass'
const sass = gulpSass(dartSass)
import groupCssMQ from 'gulp-group-css-media-queries'
import autoPrefixer from 'gulp-autoprefixer'
import cleanCss from 'gulp-clean-css'
import concat from 'gulp-concat'
// для js
import webpackStream from 'webpack-stream'
// для картинок
import newer from 'gulp-newer'
import imagemin from 'gulp-imagemin'

// проверка режима разработка/продакшн
const isDev = !process.argv.includes('--build')
const isBuild = process.argv.includes('--build')

function html() {
	return gulp
		.src('src/**.html')
		.pipe(fileinclude())
		.pipe(replace(/@img\//g, 'img/'))
		.pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
		.pipe(gulp.dest('dist'))
}

function scss() {
	return (
		gulp
			.src('src/scss/*.scss', { sourcemaps: isDev })
			.pipe(replace(/@img\//g, '../img/'))
			.pipe(sass())
			.pipe(gulpIf(isBuild, groupCssMQ()))
			.pipe(gulpIf(isBuild, autoPrefixer({ grid: true })))
			.pipe(gulpIf(isBuild, cleanCss({ level: { 2: { specialComments: 0 } } })))
			.pipe(concat('style.min.css'))
			.pipe(gulp.dest('dist/css/'))
	)
}

function js() {
	return gulp
		.src('src/js/main.js', { sourcemaps: isDev })
		.pipe(
			webpackStream({
				optimization: {
					minimize: false
				},
				mode: isBuild ? 'production' : 'development',
				output: { filename: 'main.min.js' }
			})
		)
		.pipe(gulp.dest('dist/js'))
}

function images() {
	return (
		gulp
			.src('src/img/**/*.{jpg,jpeg,png,gif,webp,ico}')
			.pipe(newer('dist/img'))
			.pipe(
				gulpIf(
					isBuild,
					imagemin({
						progressive: true,
						svgoPlugins: [{ removeViewBox: false }],
						interlaced: true,
						optimizationLevel: 3 // От 0 до 7
					})
				)
			)
			.pipe(gulp.dest('dist/img'))
			.pipe(gulp.src('src/img/**/*.svg'))
			.pipe(gulp.dest('dist/img'))
	)
}

function reset() {
	return del('dist')
}

function serve() {
	init({
		server: './dist',
		notify: false
	})

	gulp.watch('src/**/*.html', gulp.series(html)).on('change', reload)
	gulp.watch('src/scss/**/*.scss', gulp.series(scss)).on('change', reload)
	gulp.watch('src/js/**/*.js', gulp.series(js)).on('change', reload)
	gulp.watch('src/img/**/*', gulp.series(images)).on('change', reload)
}

const mainTasks = gulp.parallel(html, scss, js, images)
export const dev = gulp.series(reset, mainTasks, serve)
export const build = gulp.series(reset, mainTasks)
