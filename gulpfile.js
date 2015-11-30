var gulp   = require('gulp');
var tsc    = require('gulp-tsc');
var shell  = require('gulp-shell');
var runseq = require('run-sequence');
var del  = require('del');

var paths = {
	tscripts : { 
		src : ['app/src/**/*.ts'],
		dest : 'app/build' 
	},
	tests: {
		src: ['test/**/*.ts'],
		dest: 'app/build/test'
	},
	output: 'output/**/*',
	srcAndTests:[]
};
paths.srcAndTests = [].concat(paths.tscripts.src, paths.tests.src);

gulp.task('default', ['watch']);


// ** Running ** //

gulp.task('run', shell.task([
  'node app/build/app.js ../aws-sdk-js/apis'
]));

gulp.task('buildrun', function (cb) {
	runseq('build', 'run', 'compile:tests', cb);
});

// ** Watching ** //
gulp.task('watch', ['build'], function () {
	gulp.watch(paths.tscripts.src, ['build']);
});

gulp.task('watchrun', ['buildrun'], function () {
	gulp.watch(paths.srcAndTests, ['buildrun'])
	.on('change', function(event) {
			console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
		});
});

// ** Compilation ** //
gulp.task('build', function(cb) {
	runseq('clean',	'compile:typescript', cb);
});

gulp.task('compile:typescript', function () {
	return gulp
	.src(paths.tscripts.src)
	.pipe(tsc({
		module: "commonjs",
		emitError: false
	}))
	.pipe(gulp.dest(paths.tscripts.dest));
});

gulp.task('compile:tests', function() {
	return gulp
	.src(paths.tests.src)
	.pipe(tsc({
		module: "commonjs",
		emitError: false
	}))
	.pipe(gulp.dest(paths.tests.dest));
});


// ** Clean ** //

gulp.task('clean', ['clean:generated', 'clean:build']);

gulp.task('clean:generated', function() {
	return del(paths.output);
});

gulp.task('clean:build', function() {
	return del(paths.tscripts.dest);
});
