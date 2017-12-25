var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

gulp.task('mergeTask', [], function() {
 // gulp.src(["src/plugins/TE.js","src/plugins/**/!(TE).js",'!./gulpfile.js',"src/init.js"])
	 gulp.src([
		 "src/plugins/TE.js",
		 "src/plugins/**/!(TE).js",
		 '!src/plugins/test.js',
		 "src/init.js"
	 ])
      .pipe(concat('main.js'))
	 // .pipe(uglify())
      .pipe(gulp.dest('build/js'))
});

gulp.task('pkg',function(){
	gulp.watch('src/**/*.js',['mergeTask'])
	
})