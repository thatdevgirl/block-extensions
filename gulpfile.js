const gulp       = require( 'gulp' ),
      babel      = require( 'gulp-babel' )
      browserify = require( 'browserify' ),
      buffer     = require( 'vinyl-buffer' ),
      source     = require( 'vinyl-source-stream' ),
      uglify     = require( 'gulp-uglify' );

// JS editor build task.
gulp.task( 'js-editor', () => {
  return browserify( { entries: [ 'source/js/block-extensions.js' ] } )
    .transform( 'babelify', { presets: [ 'es2015', 'react' ] } )
    .bundle()
    .pipe( source( 'block-extensions.min.js' ) )
    .pipe( buffer() )
    .pipe( uglify() )
    .pipe( gulp.dest( 'build' ) );
} );

// Default task.
gulp.task( 'default', gulp.series( 'js-editor' ) );
