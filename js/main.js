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
	 *	Collections
	 *
	 ******************/

	/*****************
	 *
	 *	Views
	 *
	 ******************/

	App.Views.App = Backbone.View.extend({
		el: 'body',
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
		fadeTiming: 1000,
		reset: function() {
			appView.$('.js-section').fadeOut(this.fadeTiming);
			appView.$('.js-menuLink').removeClass('active');
		},
		home: function() {
			this.reset();
			appView.$('#home').fadeIn(this.fadeTiming);
			appView.$('.js-menuLink[href="#home"]').addClass('active');
		},
		resume: function() {
			this.reset();
			appView.$('#resume').fadeIn(this.fadeTiming);
			appView.$('.js-menuLink[href="#resume"]').addClass('active');
		},
		show: function() {
			this.reset();
			appView.$('#show').fadeIn(this.fadeTiming);
			appView.$('.js-menuLink[href="#show"]').addClass('active');
		},
		mirazh: function() {
			this.reset();
			appView.$('#mirazh').fadeIn(this.fadeTiming);
			appView.$('.js-menuLink[href="#mirazh"]').addClass('active');
		},
		gallery: function() {
			this.reset();
			appView.$('#gallery').fadeIn(this.fadeTiming);
			appView.$('.js-menuLink[href="#gallery"]').addClass('active');
		},
		news: function() {
			this.reset();
			appView.$('#news').fadeIn(this.fadeTiming);
			appView.$('.js-menuLink[href="#news"]').addClass('active');
		},
		contacts: function() {
			this.reset();
			appView.$('#contacts').fadeIn(this.fadeTiming);
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