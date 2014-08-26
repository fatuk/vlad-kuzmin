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
		route: 'school'
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
			this.frameHeight = $window.height() >= 680 ? $window.height() : 680;
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
					this.$('.js-slideArrowLeft').trigger('click');
					break;
				case 39:
					this.$('.js-slideArrowRight').trigger('click');
					break;
			}
		},
		prevPage: function() {
			appView.currentFrame--;
			// To prevent dbl click
			this.$el.undelegate('.js-slideArrowLeft', 'click');
			if (appView.currentFrame >= 0) {
				router.setActiveFrame(appView.currentFrame);

				// To prevent dbl click
				setTimeout(function() {
					appView.$el.delegate('.js-slideArrowLeft', 'click', function() {
						appView.prevPage();
					});
				}, 300);
			} else {
				// To prevent dbl click
				setTimeout(function() {
					appView.$el.delegate('.js-slideArrowLeft', 'click keyup', function() {
						appView.prevPage();
					});
				}, 300);

				appView.$('.js-section:first').before(appView.$('.js-section:last'));
				appView.$('.js-framesContainer').css({
					'transition': 'left 0s ease-in-out',
					'left': -1 * appView.frameWidth
				});

				appView.$('.js-framesContainer').animate({
					'left': 0 * appView.frameWidth
				}, 300, function() {
					appView.$('.js-section:last').after(appView.$('.js-section:first'));
					appView.$('.js-framesContainer').css({
						'transition': 'left 0s ease-in-out',
						'left': -(appView.framesCount - 1) * appView.frameWidth
					});
					appView.currentFrame = appView.framesCount - 1;
				});

				router.navigate(App.Routes[(appView.framesCount - 1)].route, {
					trigger: false
				});

				appView.$('.js-menuLink').removeClass('active');
				appView.$('.js-menuLink[data-id="' + (appView.framesCount - 1) + '"]').addClass('active');
			}

		},
		nextPage: function() {
			appView.currentFrame++;
			// To prevent dbl click
			this.$el.undelegate('.js-slideArrowRight', 'click');
			if (appView.currentFrame < appView.framesCount) {
				router.setActiveFrame(appView.currentFrame);

				setTimeout(function() {
					appView.$el.delegate('.js-slideArrowRight', 'click keyup', function() {
						appView.nextPage();
					});
				}, 300);
			} else {
				appView.$('.js-section:last').after(appView.$('.js-section:first'));
				appView.$('.js-framesContainer').css({
					'left': -(appView.framesCount - 2) * appView.frameWidth
				});

				appView.currentFrame = 0;
				appView.$('.js-framesContainer').animate({
					'left': -(appView.framesCount - 1) * appView.frameWidth
				}, 300, function() {
					appView.$('.js-section:first').before(appView.$('.js-section:last'));
					appView.$('.js-framesContainer').css({
						'left': appView.currentFrame * appView.frameWidth
					});

					setTimeout(function() {
						appView.$el.delegate('.js-slideArrowRight', 'click keyup', function() {
							appView.nextPage();
						});
					}, 300);
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
			'school': 'school',
			'gallery': 'gallery',
			'news': 'news',
			'contacts': 'contacts'
		},
		activeFrame: 0,
		setActiveFrame: function(frame) {
			appView.$('.js-menuLink').removeClass('active');
			appView.$('.js-menuLink[data-id="' + frame + '"]').addClass('active');

			appView.$('.js-framesContainer').animate({
				'left': -frame * appView.frameWidth
			}, 300, function() {

			});
			this.navigate(App.Routes[frame].route, {
				trigger: false
			});
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
		school: function() {
			var id = this.getRouteId('school');
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