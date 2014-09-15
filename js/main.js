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
     *  Models
     *
     ******************/

    App.Routes = [{
        id: 0,
        route: 'home',
        color: 'rgba(72,47,31,.45)'
    }, {
        id: 1,
        route: 'resume',
        color: 'rgba(42,7,34,.45)'
    }, {
        id: 2,
        route: 'show',
        color: 'rgba(72,47,31,0)'
    }, {
        id: 3,
        route: 'school',
        color: 'rgba(17,64,94,.8)'
    }, {
        id: 4,
        route: 'gallery',
        color: 'rgba(0,0,0,.45)'
    }, {
        id: 5,
        route: 'news',
        color: 'rgba(50,43,21,.45)'
    }, {
        id: 6,
        route: 'contacts',
        color: 'rgba(54,76,91,.45)'
    }];

    /*****************
     *
     *  Views
     *
     ******************/

    App.Views.App = Backbone.View.extend({
        el: 'body',
        routeCounter: 0,
        events: {
            'click .js-slideArrowLeft': 'prevPage',
            'click .js-slideArrowRight': 'nextPage',
            'click .js-showVideoSliderBtn': 'showVideoSlider',
            'keyup': 'arrowSlide',
            'click .js-menuLink': 'setPointer'
        },
        frameWidth: 0,
        frameHeight: 0,
        framesCount: 0,
        currentFrame: 0,
        headerHeight: 0,
        footerHeight: 0,
        animationSpeed: 500,
        setPointer: function(e) {
            var $currentTarget = $(e.currentTarget),
                $pointer = this.$('.js-menuPointer'),
                menuItemWidth = $currentTarget.outerWidth(),
                menuItemPosition = $currentTarget.position().left;

            $pointer.css({
                'left': menuItemPosition + (menuItemWidth / 2) - 5
            });
        },
        getFramesInfo: function() {
            var $window = $(window);
            this.frameWidth = $window.width() >= 940 ? $window.width() : 940;
            this.frameHeight = $window.height() >= 680 ? $window.height() : 680;
            this.framesCount = this.$('.js-section').length;

            this.headerHeight = this.$('.js-siteHeader').height();
            this.footerHeight = this.$('.js-siteFooter').height();
        },
        resize: function(e) {
            var self = this;

            $(window).off('resize');

            setTimeout(function() {
                self.setSizes();
                newsView.setSizes();
                router.setActiveFrame(self.currentFrame);
                // Uodate custom scroll
                appView.$('.js-scroll').perfectScrollbar('update');
                $(window).on('resize', function(e) {
                    self.resize(e);
                });
            }, 700);
        },
        setSizes: function() {
            this.getFramesInfo();

            this.$('.js-framesContainer').css({
                'width': this.frameWidth * this.framesCount,
                'height': this.frameHeight
            });
            this.$('.js-section, .js-frame').css({
                'width': this.frameWidth,
                'height': this.frameHeight
            });
            this.$('.js-container').css({
                'height': this.frameHeight - this.headerHeight - 30 - this.footerHeight,
                'margin-top': this.headerHeight + 30
            });
            this.$('.js-article').css({
                'max-height': this.frameHeight - this.headerHeight - 30 - this.footerHeight - 100
            });
            this.$('.js-tabsContent').css({
                'max-height': this.frameHeight - this.headerHeight - 30 - this.footerHeight - 30
            });
            this.$('.js-newsContainer').css({
                'max-height': this.frameHeight - this.headerHeight - 30 - this.footerHeight - 100
            });
            this.$('.js-galleryContainer').css({
                'height': this.frameHeight - this.headerHeight - 30 - this.footerHeight - 30
            });
        },
        initialize: function() {
            var self = this;
            $(window).on('resize', function(event) {
                self.resize(event);
            });

            this.setSizes();

            // Columnizer
            this.$('.js-article').columnize({
                columns: 3,
                lastNeverTallest: true,
                buildOnce: true
            });

            this.$('.js-scroll').perfectScrollbar();

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
                    '-webkit-transition': 'none',
                    '-moz-transition': 'none',
                    '-ms-transition': 'none',
                    'transition': 'none',
                    '-webkit-transform': 'translate3d(' + -1 * appView.frameWidth + 'px, 0, 0)',
                    '-moz-transform': 'translate3d(' + -1 * appView.frameWidth + 'px, 0, 0)',
                    '-ms-transform': 'translate3d(' + -1 * appView.frameWidth + 'px, 0, 0)',
                    'transform': 'translate3d(' + -1 * appView.frameWidth + 'px, 0, 0)'
                });

                setTimeout(function() {
                    appView.$('.js-framesContainer').css({
                        '-webkit-transition': 'transform ' + appView.animationSpeed / 1000 + 's',
                        '-moz-transition': 'transform ' + appView.animationSpeed / 1000 + 's',
                        '-ms-transition': 'transform ' + appView.animationSpeed / 1000 + 's',
                        'transition': 'transform ' + appView.animationSpeed / 1000 + 's',
                        '-webkit-transform': 'translate3d(' + 0 + 'px, 0, 0)',
                        '-moz-transform': 'translate3d(' + 0 + 'px, 0, 0)',
                        '-ms-transform': 'translate3d(' + 0 + 'px, 0, 0)',
                        'transform': 'translate3d(' + 0 + 'px, 0, 0)'
                    });

                    setTimeout(function() {
                        appView.$('.js-section:last').after(appView.$('.js-section:first'));
                        appView.$('.js-framesContainer').css({
                            '-webkit-transition': 'none',
                            '-moz-transition': 'none',
                            '-ms-transition': 'none',
                            'transition': 'none',
                            '-webkit-transform': 'translate3d(' + -(appView.framesCount - 1) * appView.frameWidth + 'px, 0, 0)',
                            '-moz-transform': 'translate3d(' + -(appView.framesCount - 1) * appView.frameWidth + 'px, 0, 0)',
                            '-ms-transform': 'translate3d(' + -(appView.framesCount - 1) * appView.frameWidth + 'px, 0, 0)',
                            'transform': 'translate3d(' + -(appView.framesCount - 1) * appView.frameWidth + 'px, 0, 0)'
                        });
                        appView.currentFrame = appView.framesCount - 1;
                    }, appView.animationSpeed);

                    router.navigate(App.Routes[(appView.framesCount - 1)].route, {
                        trigger: false
                    });

                    router.setOverlayColor(appView.framesCount - 1);

                    appView.$('.js-menuLink').removeClass('active');
                    appView.$('.js-menuLink[data-id="' + (appView.framesCount - 1) + '"]').addClass('active');

                    appView.$('[href="#contacts"]').trigger('click');
                }, 200);
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
                    '-webkit-transition': 'none',
                    '-moz-transition': 'none',
                    '-ms-transition': 'none',
                    'transition': 'none',
                    '-webkit-transform': 'translate3d(' + -(appView.framesCount - 2) * appView.frameWidth + 'px, 0, 0)',
                    '-moz-transform': 'translate3d(' + -(appView.framesCount - 2) * appView.frameWidth + 'px, 0, 0)',
                    '-ms-transform': 'translate3d(' + -(appView.framesCount - 2) * appView.frameWidth + 'px, 0, 0)',
                    'transform': 'translate3d(' + -(appView.framesCount - 2) * appView.frameWidth + 'px, 0, 0)'
                });

                setTimeout(function() {
                    appView.currentFrame = 0;

                    appView.$('.js-framesContainer').css({
                        '-webkit-transition': 'transform ' + appView.animationSpeed / 1000 + 's',
                        '-moz-transition': 'transform ' + appView.animationSpeed / 1000 + 's',
                        '-ms-transition': 'transform ' + appView.animationSpeed / 1000 + 's',
                        'transition': 'transform ' + appView.animationSpeed / 1000 + 's',
                        '-webkit-transform': 'translate3d(' + -(appView.framesCount - 1) * appView.frameWidth + 'px, 0, 0)',
                        '-moz-transform': 'translate3d(' + -(appView.framesCount - 1) * appView.frameWidth + 'px, 0, 0)',
                        '-ms-transform': 'translate3d(' + -(appView.framesCount - 1) * appView.frameWidth + 'px, 0, 0)',
                        'transform': 'translate3d(' + -(appView.framesCount - 1) * appView.frameWidth + 'px, 0, 0)'
                    });

                    setTimeout(function() {
                        appView.$('.js-section:first').before(appView.$('.js-section:last'));
                        appView.$('.js-framesContainer').css({
                            '-webkit-transition': 'none',
                            '-moz-transition': 'none',
                            '-ms-transition': 'none',
                            'transition': 'none',
                            '-webkit-transform': 'translate3d(' + appView.currentFrame * appView.frameWidth + 'px, 0, 0)',
                            '-moz-transform': 'translate3d(' + appView.currentFrame * appView.frameWidth + 'px, 0, 0)',
                            '-ms-transform': 'translate3d(' + appView.currentFrame * appView.frameWidth + 'px, 0, 0)',
                            'transform': 'translate3d(' + appView.currentFrame * appView.frameWidth + 'px, 0, 0)'
                        });

                        setTimeout(function() {
                            appView.$el.delegate('.js-slideArrowRight', 'click keyup', function() {
                                appView.nextPage();
                            });
                        }, 300);
                    }, appView.animationSpeed);

                    router.navigate(App.Routes[0].route, {
                        trigger: false
                    });

                    router.setOverlayColor(0);
                    appView.$('[href="#home"]').trigger('click');

                    appView.$('.js-menuLink').removeClass('active');
                    appView.$('.js-menuLink[data-id="0"]').addClass('active');
                }, 200);
            }
        },
        showVideoSlider: function() {
            this.$('.js-videoSlider').fadeIn('fast');
        }
    });

    // Slider view

    App.Views.Slider = Backbone.View.extend({
        el: '.js-videoSlider',
        events: {
            'click .js-slideLeft': 'prevSlide',
            'click .js-slideRight': 'nextSlide',
            'click .js-closeBtn': 'close'
        },
        slidesCount: 0,
        slideWidth: 0,
        currentSlide: 0,
        escape: function(e) {
            if (e.keyCode === 27) {
                this.close();
            }
        },
        close: function() {
            this.$el.fadeOut('fast');
        },
        initialize: function() {
            var self = this;
            this.slidesCount = this.$('.js-sliderItem').length;
            this.slideWidth = this.$('.js-sliderItem').width();
            this.$('.js-slideLeft').hide();

            this.$('.js-sliderContainer').css({
                'width': this.slidesCount * this.slideWidth
            });

            $('body').on('keyup', function(e) {
                self.escape(e);
            });
        },
        setActiveSlide: function(slide) {
            this.$('.js-sliderContainer').animate({
                'left': -slide * this.slideWidth
            }, appView.animationSpeed);
        },
        prevSlide: function(e) {
            var self = this;
            this.currentSlide--;
            if (this.currentSlide > 0) {
                this.$('.js-slideArrow').show();
                this.setActiveSlide(this.currentSlide);
            } else {
                this.currentSlide = 0;
                this.setActiveSlide(this.currentSlide);
                $(e.currentTarget).hide();
            }
        },
        nextSlide: function(e) {
            var self = this;
            this.currentSlide++;
            if (this.currentSlide < this.slidesCount - 1) {
                this.$('.js-slideArrow').show();
                this.setActiveSlide(this.currentSlide);
            } else {
                this.currentSlide = this.slidesCount - 1;
                this.setActiveSlide(this.currentSlide);
                $(e.currentTarget).hide();
            }
        }
    });

    // News view
    App.Views.News = Backbone.View.extend({
        el: '.js-newsContainer',
        initialize: function() {
            this.collection.on('reset', function() {
                this.render();
            }, this);
        },
        render: function() {
            this.$el.html('');
            this.collection.each(function(newsItem) {
                var newsItemView = new App.Views.NewsItem({
                    model: newsItem
                });
                this.$el.append(newsItemView.el);
            }, this);
        }
    });

    // News item view
    App.Views.NewsItem = Backbone.View.extend({
        template: $('#newsItemTemplate').html(),
        initialize: function() {
            this.render();
        },
        render: function() {
            var rendered = Mustache.render(this.template, this.model.toJSON());
            this.$el.html(rendered);
            console.log(this.template);
            return this;
        }
    });

    // News archive view
    App.Views.NewsArchive = Backbone.View.extend({
        initialize: function() {
            this.render();
        },
        render: function() {

        }
    });

    // News archive item view
    App.Views.NewsArchiveItem = Backbone.View.extend({
        initialize: function() {
            this.render();
        },
        render: function() {

        }
    });

    // Tabs view
    App.Views.Tabs = Backbone.View.extend({
        el: '.js-tabs',
        events: {
            'click .js-tabBtn': 'setTab'
        },
        initialize: function() {
            setTimeout(function() {
                $('.js-tabBtn.active').trigger('click');
            }, 0);
        },
        setTab: function(e) {
            e.preventDefault();

            var $currentTab = $(e.currentTarget),
                currentTabId = $currentTab.attr('href');

            if (!$currentTab.hasClass('active') || !this.$('.js-tabsContent').is(':visible')) {
                this.resetTabsContent();
                $(currentTabId).fadeIn('slow');
                $currentTab.addClass('active');
            }
        },
        resetTabsContent: function() {
            this.$('.js-tabsContent').hide();
            this.$('.js-tabBtn').removeClass('active');
        }
    });

    // Accordion
    App.Views.Accordion = Backbone.View.extend({
        el: '.js-accordion',
        events: {
            'click .js-accordionBtn': 'click'
        },
        click: function(e) {
            e.preventDefault();

            if ($(e.currentTarget).hasClass('expanded')) {
                this.close(e);
            } else {
                this.open(e);
            }
        },
        open: function(e) {
            var $currentBtn = $(e.currentTarget),
                $accordion = $(e.currentTarget).closest('.js-accordion'),
                $content = $accordion.find('.js-accordionContent'),
                $plus = $accordion.find('.js-accordionPlus'),
                $minus = $accordion.find('.js-accordionMinus');

            $currentBtn.addClass('expanded');
            $content.slideDown('fast');
            $plus.hide();
            $minus.show();
        },
        close: function(e) {
            var $currentBtn = $(e.currentTarget),
                $accordion = $(e.currentTarget).closest('.js-accordion'),
                $content = $accordion.find('.js-accordionContent'),
                $plus = $accordion.find('.js-accordionPlus'),
                $minus = $accordion.find('.js-accordionMinus');

            $currentBtn.removeClass('expanded');
            $content.slideUp('fast');
            $plus.show();
            $minus.hide();
        }
    });

    // Gallery
    App.Views.Gallery = Backbone.View.extend({
        el: '.js-gallery',
        initialize: function() {
            this.render();
        },
        render: function() {
            this.collection.each(function(galleryItem) {
                var galleryItemView = new App.Views.GalleryItem({
                    model: galleryItem
                });
                this.$('.js-galleryContainer').find('ul').append(galleryItemView.el);
            }, this);

            // Gallery scroll init
            this.$('.js-scroll').perfectScrollbar({
                wheelSpeed: 40
            });
        }
    });

    App.Views.GalleryItem = Backbone.View.extend({
        initialize: function() {
            this.render();
        },
        tagName: 'li',
        className: 'gallery__item',
        template: $('#galleryItemTemplate').html(),
        render: function() {
            var rendered = Mustache.render(this.template, this.model.toJSON());
            this.$el.html(rendered);
            return this;
        }
    });

    /*****************
     *
     *  Routes
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
            'contacts': 'contacts',
            '*path': 'home'
        },
        activeFrame: 0,
        setActiveFrame: function(frame) {
            appView.$('.js-menuLink').removeClass('active');
            var $activeMenuLink = appView.$('.js-menuLink[data-id="' + frame + '"]'),
                self = this;
            $activeMenuLink.addClass('active');


            setTimeout(function() {
                $activeMenuLink.trigger('click');
            }, 300);

            appView.$('.js-framesContainer').css({
                '-webkit-transform': 'translate3d(' + -frame * appView.frameWidth + 'px, 0, 0)',
                '-moz-transform': 'translate3d(' + -frame * appView.frameWidth + 'px, 0, 0)',
                '-ms-transform': 'translate3d(' + -frame * appView.frameWidth + 'px, 0, 0)',
                'transform': 'translate3d(' + -frame * appView.frameWidth + 'px, 0, 0)',
                '-webkit-transition': 'transform ' + appView.animationSpeed / 1000 + 's',
                '-moz-transition': 'transform ' + appView.animationSpeed / 1000 + 's',
                '-ms-transition': 'transform ' + appView.animationSpeed / 1000 + 's',
                'transition': 'transform ' + appView.animationSpeed / 1000 + 's',
                '-webkit-backface-visibility': 'hidden'
            });

            this.navigate(App.Routes[frame].route, {
                trigger: false
            });

            self.setOverlayColor(frame);
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
        setOverlayColor: function(frame) {
            appView.$('.js-colorOverlay').css({
                'background-color': App.Routes[frame].color
            });
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
     *  Collections
     *
     ******************/

    var galleryData = [{
        "thumb": "img/photo-1.jpg",
        "img": "img/photo-1.jpg"
    }, {
        "thumb": "img/photo-1.jpg",
        "img": "img/photo-1.jpg"
    }, {
        "thumb": "img/photo-1.jpg",
        "img": "img/photo-1.jpg"
    }, {
        "thumb": "img/photo-1.jpg",
        "img": "img/photo-1.jpg"
    }, {
        "thumb": "img/photo-1.jpg",
        "img": "img/photo-1.jpg"
    }, {
        "thumb": "img/photo-1.jpg",
        "img": "img/photo-1.jpg"
    }, {
        "thumb": "img/photo-1.jpg",
        "img": "img/photo-1.jpg"
    }, {
        "thumb": "img/photo-1.jpg",
        "img": "img/photo-1.jpg"
    }, {
        "thumb": "img/photo-1.jpg",
        "img": "img/photo-1.jpg"
    }, {
        "thumb": "img/photo-1.jpg",
        "img": "img/photo-1.jpg"
    }, {
        "thumb": "img/photo-1.jpg",
        "img": "img/photo-1.jpg"
    }, {
        "thumb": "img/photo-1.jpg",
        "img": "img/photo-1.jpg"
    }, {
        "thumb": "img/photo-1.jpg",
        "img": "img/photo-1.jpg"
    }, {
        "thumb": "img/photo-1.jpg",
        "img": "img/photo-1.jpg"
    }, {
        "thumb": "img/photo-1.jpg",
        "img": "img/photo-1.jpg"
    }, {
        "thumb": "img/photo-1.jpg",
        "img": "img/photo-1.jpg"
    }, {
        "thumb": "img/photo-1.jpg",
        "img": "img/photo-1.jpg"
    }, {
        "thumb": "img/photo-1.jpg",
        "img": "img/photo-1.jpg"
    }, {
        "thumb": "img/photo-1.jpg",
        "img": "img/photo-1.jpg"
    }, {
        "thumb": "img/photo-1.jpg",
        "img": "img/photo-1.jpg"
    }, {
        "thumb": "img/photo-1.jpg",
        "img": "img/photo-1.jpg"
    }, {
        "thumb": "img/photo-1.jpg",
        "img": "img/photo-1.jpg"
    }];

    App.Collections.Gallery = Backbone.Collection.extend({});
    App.Collections.NewsArchive = Backbone.Collection.extend({});
    App.Collections.News = Backbone.Collection.extend({
        url: $('#newsItemTemplate').data('url'),
        parse: function(response) {
            console.log(response.posts);
            return response.posts;
        },
        initialize: function() {
            this.fetch({
                reset: true
            });
        }
    });


    /*****************
     *
     *  Initialize
     *
     ******************/

    var galleryCollection = new App.Collections.Gallery(galleryData),
        newsArchiveCollection = new App.Collections.NewsArchive(),
        newsCollection = new App.Collections.News();

    var appView = new App.Views.App(),
        videoSliderView = new App.Views.Slider(),
        tabsView = new App.Views.Tabs(),
        accordionView = new App.Views.Accordion(),
        galleryView = new App.Views.Gallery({
            collection: galleryCollection
        }),
        newsView = new App.Views.News({
            collection: newsCollection
        });

    var router = new App.Router.App();

    Backbone.history.start();

});