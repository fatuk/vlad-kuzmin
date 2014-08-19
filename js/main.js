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
			'click .js-slideArrowRight': 'nextPage'
		},
		resetRoute: function() {
			router.navigate(App.Routes[this.routeCounter], {
				trigger: true
			});
		},
		prevPage: function() {
			if (this.routeCounter < App.Routes.length) {
				this.resetRoute();
				this.routeCounter--;
			} else {
				this.routeCounter = 0;
				this.routeCounter--;
				this.resetRoute();
			}
			console.log(this.routeCounter, App.Routes.length);
		},
		nextPage: function() {
			if (this.routeCounter < App.Routes.length) {
				this.resetRoute();
				this.routeCounter++;
			} else {
				this.routeCounter = 0;
				this.routeCounter++;
				this.resetRoute();
			}
			console.log(this.routeCounter, App.Routes.length);
		},
		initialize: function() {

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
		fadeInTiming: 1000,
		fadeOutTiming: 500,
		reset: function() {
			appView.$('.js-section').fadeOut(this.fadeOutTiming);
			appView.$('.js-menuLink').removeClass('active');
		},
		home: function(request, page) {
			console.log(request, page);
			this.reset();
			appView.$('#home').fadeIn(this.fadeInTiming);
			appView.$('.js-menuLink[href="#home"]').addClass('active');
		},
		resume: function() {
			this.reset();
			appView.$('#resume').fadeIn(this.fadeInTiming);
			appView.$('.js-menuLink[href="#resume"]').addClass('active');
		},
		show: function() {
			this.reset();
			appView.$('#show').fadeIn(this.fadeInTiming);
			appView.$('.js-menuLink[href="#show"]').addClass('active');
		},
		mirazh: function() {
			this.reset();
			appView.$('#mirazh').fadeIn(this.fadeInTiming);
			appView.$('.js-menuLink[href="#mirazh"]').addClass('active');
		},
		gallery: function() {
			this.reset();
			appView.$('#gallery').fadeIn(this.fadeInTiming);
			appView.$('.js-menuLink[href="#gallery"]').addClass('active');
		},
		news: function() {
			this.reset();
			appView.$('#news').fadeIn(this.fadeInTiming);
			appView.$('.js-menuLink[href="#news"]').addClass('active');
		},
		contacts: function() {
			this.reset();
			appView.$('#contacts').fadeIn(this.fadeInTiming);
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