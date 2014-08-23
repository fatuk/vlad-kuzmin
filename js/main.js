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

	App.Routes = [{
		id: 0,
		route: 'home'
	}, {
		id: 1,
		route: 'resume'
	}, {
		id: 2,
		route: 'show'
	}, {
		id: 3,
		route: 'mirazh'
	}, {
		id: 4,
		route: 'gallery'
	}, {
		id: 5,
		route: 'news'
	}, {
		id: 6,
		route: 'contacts'
	}];

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

			this.$('.js-framesContainer').on('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', function() {
				$(this).trigger('animationEnded');
			});
		},
		setRoute: function(id) {
			router.navigate(App.Routes[id].route, {
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
			appView.currentFrame--;
			if (appView.currentFrame >= 0) {
				router.setActiveFrame(appView.currentFrame);
			} else {
				appView.$('.js-section:first').before(appView.$('.js-section:last'));
				appView.$('.js-framesContainer').css({
					'left': -1 * appView.frameWidth
				}).animate({
					'left': 0 * appView.frameWidth
				}, 500, function() {
					appView.$('.js-section:last').after(appView.$('.js-section:first'));
					appView.$('.js-framesContainer').css({
						'left': -(appView.framesCount - 1) * appView.frameWidth
					});
					appView.currentFrame = appView.framesCount - 1;
					router.setActiveFrame(appView.currentFrame);
				});
			}
		},
		nextPage: function() {
			appView.currentFrame++;
			if (appView.currentFrame < appView.framesCount) {
				router.setActiveFrame(appView.currentFrame);
				appView.$('.js-framesContainer').off('animationEnded');
			} else {
				appView.$('.js-section:last').after(appView.$('.js-section:first'));
				appView.$('.js-framesContainer').css({
					'transition': 'left 0s ease-in-out',
					'left': -(appView.currentFrame - 2) * appView.frameWidth
				});

				// css transition fix
				setTimeout(function() {
					appView.$('.js-framesContainer').css({
						'transition': 'left .5s ease-in-out',
						'left': -(appView.framesCount - 1) * appView.frameWidth
					});
				}, 0);

				appView.currentFrame = 0;
				appView.$('.js-framesContainer').on('animationEnded', function() {
					appView.$('.js-section:first').before(appView.$('.js-section:last'));
					appView.$('.js-framesContainer').css({
						'transition': 'left 0s ease-in-out',
						'left': appView.currentFrame * appView.frameWidth
					});
				});

				router.navigate(App.Routes[0].route, {
					trigger: false
				});

				appView.$('.js-menuLink').removeClass('active');
				appView.$('.js-menuLink[data-id="0"]').addClass('active');
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
			appView.$('.js-menuLink[data-id="' + frame + '"]').addClass('active');

			appView.$('.js-framesContainer').css({
				'transition': 'left .5s ease-in-out',
				'left': -frame * appView.frameWidth
			});

			this.navigate(App.Routes[frame].route, {
				trigger: true
			});

			appView.$('.js-framesContainer').off('animationEnded');
		},
		getRouteId: function(routeName) {
			var pageId = null;
			_.find(App.Routes, function(route, i) {
				if (route.route === routeName) {
					pageId = i;
					return route;
				}
			});

			return pageId;
		},
		home: function() {
			var id = this.getRouteId('home');
			this.setActiveFrame(id);
			appView.currentFrame = id;
		},
		resume: function() {
			var id = this.getRouteId('resume');
			this.setActiveFrame(id);
			appView.currentFrame = id;
		},
		show: function() {
			var id = this.getRouteId('show');
			this.setActiveFrame(id);
			appView.currentFrame = id;
		},
		mirazh: function() {
			var id = this.getRouteId('mirazh');
			this.setActiveFrame(id);
			appView.currentFrame = id;
		},
		gallery: function() {
			var id = this.getRouteId('gallery');
			this.setActiveFrame(id);
			appView.currentFrame = id;
		},
		news: function() {
			var id = this.getRouteId('news');
			this.setActiveFrame(id);
			appView.currentFrame = id;
		},
		contacts: function() {
			var id = this.getRouteId('contacts');
			this.setActiveFrame(id);
			appView.currentFrame = id;
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