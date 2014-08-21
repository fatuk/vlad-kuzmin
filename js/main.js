$(function() {
	// WOW css animation init
	// new WOW().init();

	var App = {};
	App.Collections = {};
	App.Models = {};
	App.Views = {};
	App.Router = {};

	/*****************
	 *
	 *	Models
	 *
	 ******************/

	App.Routes = [
		'home',
		'resume',
		'show',
		'mirazh',
		'gallery',
		'news',
		'contacts'
	];

	/*****************
	 *
	 *	Views
	 *
	 ******************/

	App.Views.App = Backbone.View.extend({
		el: 'body',
		routeCounter: 0,
		events: {
			'click .js-slideArrowLeft': 'prevPage',
			'click .js-slideArrowRight': 'nextPage',
			'keyup': 'arrowSlide'
		},
		frameWidth: 0,
		frameHeight: 0,
		framesCount: 0,
		currentFrame: 0,
		getFramesInfo: function() {
			var $window = $(window);
			this.frameWidth = $window.width() >= 940 ? $window.width() : 940;
			this.frameHeight = $window.height();
			this.framesCount = this.$('.js-section').length;
		},
		initialize: function() {
			this.getFramesInfo();
			this.$('.js-framesContainer').css({
				'width': this.frameWidth * this.framesCount,
				'height': this.frameHeight
			});
			this.$('.js-section, .js-frame').css({
				'width': this.frameWidth,
				'height': this.frameHeight
			});
		},
		setRoute: function(id) {
			router.navigate(App.Routes[id], {
				trigger: true
			});
		},
		arrowSlide: function(e) {
			switch (e.keyCode) {
				case 37:
					this.prevPage();
					break;
				case 39:
					this.nextPage();
					break;
			}
		},
		prevPage: function() {
			this.currentFrame--;
			if (this.currentFrame >= 0) {
				router.setActiveFrame(this.currentFrame);
			} else {
				this.currentFrame = this.framesCount - 1;
				router.setActiveFrame(this.currentFrame);
			}
		},
		nextPage: function() {
			this.currentFrame++;
			if (this.currentFrame < this.framesCount) {
				router.setActiveFrame(this.currentFrame);
			} else {
				this.currentFrame = 0;
				router.setActiveFrame(this.currentFrame);
			}
		}
	});

	/*****************
	 *
	 *	Routes
	 *
	 ******************/

	App.Router.App = Backbone.Router.extend({
		routes: {
			'': 'home',
			'home': 'home',
			'resume': 'resume',
			'show': 'show',
			'mirazh': 'mirazh',
			'gallery': 'gallery',
			'news': 'news',
			'contacts': 'contacts'
		},
		activeFrame: 0,
		setActiveFrame: function(frame) {
			appView.$('.js-menuLink').removeClass('active');
			appView.$('.js-framesContainer').css({
				'left': -frame * appView.frameWidth
			});

			this.navigate(App.Routes[frame], {
				trigger: true
			});
		},
		home: function(request, page) {
			this.setActiveFrame(0);
			appView.$('.js-menuLink[href="#home"]').addClass('active');
		},
		resume: function() {
			this.setActiveFrame(1);
			appView.$('.js-menuLink[href="#resume"]').addClass('active');
		},
		show: function() {
			this.setActiveFrame(2);
			appView.$('.js-menuLink[href="#show"]').addClass('active');
		},
		mirazh: function() {
			this.setActiveFrame(3);
			appView.$('.js-menuLink[href="#mirazh"]').addClass('active');
		},
		gallery: function() {
			this.setActiveFrame(4);
			appView.$('.js-menuLink[href="#gallery"]').addClass('active');
		},
		news: function() {
			this.setActiveFrame(5);
			appView.$('.js-menuLink[href="#news"]').addClass('active');
		},
		contacts: function() {
			this.setActiveFrame(6);
			appView.$('.js-menuLink[href="#contacts"]').addClass('active');
		}
	});


	/*****************
	 *
	 *	Initialize
	 *
	 ******************/

	var appView = new App.Views.App();
	var router = new App.Router.App();


	Backbone.history.start();

});