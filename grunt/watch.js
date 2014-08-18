module.exports = {
	options: {
		livereload: true
	},
	less: {
		files: 'less/*.less',
		tasks: ['less', 'autoprefixer'],
		options: {
			interrupt: true,
			livereload: false
		}
	},
	css: {
		files: 'css/*.css'
	},
	html: {
		files: '*.html'
	},
	js: {
		files: ['js/*.js']
	},
	plugins: {
		files: 'bower_components/**',
		tasks: ['uglify']
	}
};