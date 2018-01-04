var gulp = require('gulp');
var jshint = require('gulp-jshint');
var jscs = require('gulp-jscs');
var nodemon = require('gulp-nodemon');
var jsfiles = ['*.js', 'src/**/*.js'];
var sass = require('gulp-sass');
var sassDir = 'public/sass/**/*.scss';

gulp.task('style', function(){
    gulp.src(jsfiles)
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish', {
            verbose: true
        }))
        .pipe(jscs());
});

gulp.task('inject', function() {
	var wiredep = require('wiredep').stream;
	var options = {
		bowerJson: require('./bower.json'),
		directory: './public/lib',
		ignorePath: '../../public',
		devDependencies: true,
		'overrides': {
	    'font-awesome': {
	      'main': 'css/font-awesome.css'
	    },
	    'material-design-icons': {
	      'main': 'iconfont/material-icons.css'
	    }
	  }
	};
	return gulp.src('public/index.html')
			.pipe(wiredep(options))
			.pipe(gulp.dest('public'));
});

gulp.task('scss', function() {
	gulp.src(sassDir)
			.pipe(sass().on('error', sass.logError))
			.pipe(sass({outputStyle: 'compressed'}))
			.pipe(gulp.dest('./public/css/'));
});

//Watch task
gulp.task('watch:scss',function() {
	gulp.watch(sassDir,['scss']);
});

gulp.task('serve', ['style', 'inject', 'scss', 'watch:scss'], function() {
	var options = {
		script: 'server.js',
		delayTime: 1,
		env: {
			'PORT': 3000
		},
		watch: [jsfiles, sassDir]
	};
	return nodemon(options)
	.on('restart', function(ev){
		console.log('Restarting server...');
	});
});