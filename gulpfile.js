var gulp = require('gulp');
var $ = require('gulp-load-plugins')({ rename: { 'gulp-rev-delete-original': 'revdel', 'gulp-if': 'if' } });

gulp.task('copy', function() {
    return gulp.src(['frontend/assets/{img,font,webfonts}/**/*', 'frontend/app.yaml', 'frontend/CNAME', 'frontend/assets/files/*'], { base: 'frontend' })
        .pipe(gulp.dest('docs'));
});

gulp.task('clean', function() {
    return gulp.src('docs/', { read: false })
        .pipe($.clean());
});

gulp.task('minify-js', function() {
    return gulp.src('frontend/**/*.js')
        .pipe($.uglify())
        .pipe(gulp.dest('docs/'))
});

gulp.task('minify-css', function() {
    return gulp.src('frontend/**/*.css')
        .pipe($.cssnano({ safe: true }))
        .pipe(gulp.dest('docs/'))
});

gulp.task('minify-html', function() {
    return gulp.src('frontend/**/*.html')
        .pipe($.htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest('docs/'))
});

gulp.task('useref', function() {
    return gulp.src('frontend/index.html')
        .pipe($.useref())
        .pipe($.if('*.html', $.inlineSource()))
        .pipe($.if('*.html', $.htmlmin({ collapseWhitespace: true })))
        .pipe($.if('*.js', $.uglify()))
        .pipe($.if('*.css', $.cssnano({ safe: true })))
        .pipe(gulp.dest('docs'));
});

gulp.task('imagemin', function() {
    return gulp.src('frontend/assets/img/*')
        .pipe($.imagemin({
            progressive: true,
            svgoPlugins: [
                { removeViewBox: false },
                { cleanupIDs: false }
            ]
        }))
        .pipe(gulp.dest('docs/assets/img'));
});

gulp.task('rev', function() {
    return gulp.src(['docs/**/*.{css,js,jpg,jpeg,png,svg}'])
        .pipe($.rev())
        .pipe($.revdel())
        .pipe(gulp.dest('docs/'))
        .pipe($.rev.manifest())
        .pipe(gulp.dest('docs/'))
})

gulp.task('revreplace', ['rev'], function() {
    return gulp.src(['docs/index.html', 'docs/works-2.html', 'docs/app.yaml', 'docs/**/*.css'])
        .pipe($.revReplace({
            manifest: gulp.src('docs/rev-manifest.json'),
            replaceInExtensions: ['.html', '.yaml', '.js', '.css', '.png', '.svg']
        }))
        .pipe(gulp.dest('docs/'));
});

gulp.task('minify', ['minify-js', 'minify-css', 'minify-html']);
gulp.task('build', $.sequence(['minify-js', 'minify-css', 'imagemin'], 'useref', 'revreplace'));
gulp.task('default', $.sequence('clean', 'copy', 'minify', 'build'));