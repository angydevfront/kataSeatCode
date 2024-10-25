const { src, dest, watch } = require('gulp');
const less = require('gulp-less');

function css(done) {
    
    src('src/clientlib-base/css/start.less')
        .pipe( less({outputStyle: 'compressed'}) )
        .pipe( dest('build/css'))
    done();

    src('src/clientlib-components/css/index.less')
        .pipe( less({outputStyle: 'compressed'}) )
        .pipe( dest('build/css'))
    done();

}
function images () {
  return src('src/clientlib-base/images/**/*.{png,jpg}')
    .pipe (dest('build/img'))

    
}
function dev() {
    watch('src/clientlib-components/**/*.less', css);
    watch('src/clientlib-base/**/*.less', css);
    watch('src/clientlib-base/**/*', images);
}

exports.css = css;
exports.dev = dev;
exports.images = images;