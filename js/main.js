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
            'keyup': 'arrowSlide'
        },
        frameWidth: 0,
        frameHeight: 0,
        framesCount: 0,
        currentFrame: 0,
        headerHeight: 0,
        footerHeight: 0,
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
                'max-height': this.frameHeight - this.headerHeight - 30 - this.footerHeight - 50
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

                router.setOverlayColor(appView.framesCount - 1);

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

                router.setOverlayColor(0);

                appView.$('.js-menuLink').removeClass('active');
                appView.$('.js-menuLink[data-id="0"]').addClass('active');
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
            }, 300);
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
        el: '.js-news',
        newsPagesCount: 0,
        newsFrameWidth: 0,
        newsFrameHeight: 0,
        currentNewsPage: 0,
        setSizes: function() {
            var $newsFrame = this.$('.js-newsFrame'),
                $newsContainer = this.$('.js-newsContainer');

            $newsContainer.css({
                'width': this.newsFrameWidth * this.newsPagesCount
            });

            $newsFrame.css({
                'width': this.newsFrameWidth,
                'height': this.newsFrameHeight
            });
        },
        initialize: function() {
            var $newsPage = this.$('.js-newsPage');

            this.newsPagesCount = $newsPage.length;
            this.newsFrameWidth = $newsPage.width();
            this.newsFrameHeight = $newsPage.height();

            this.setSizes();

            if (this.newsPagesCount === 1) {
                this.$('.js-newsArrow').css({
                    'visibility': 'hidden'
                });
            }
        },
        events: {
            'click .js-prevNews': 'prev',
            'click .js-nextNews': 'next'
        },
        setPage: function(id) {
            var $newsContainer = this.$('.js-newsContainer'),
                self = this;
            $newsContainer.animate({
                'left': -self.newsFrameWidth * id
            }, 300);
        },
        prev: function(e) {
            this.currentNewsPage--;
            if (this.currentNewsPage > 0) {
                this.setPage(this.currentNewsPage);
                this.$('.js-newsArrow').css({
                    'visibility': 'visible'
                });
            } else {
                this.currentNewsPage = 0;
                this.setPage(this.currentNewsPage);
                this.$('.js-newsArrow').css({
                    'visibility': 'visible'
                });
                $(e.currentTarget).css({
                    'visibility': 'hidden'
                });
            }
        },
        next: function(e) {
            this.currentNewsPage++;
            if (this.currentNewsPage < this.newsPagesCount - 1) {
                this.setPage(this.currentNewsPage);
                this.$('.js-newsArrow').css({
                    'visibility': 'visible'
                });
            } else {
                this.currentNewsPage = this.newsPagesCount - 1;
                this.setPage(this.currentNewsPage);
                this.$('.js-newsArrow').css({
                    'visibility': 'visible'
                });
                $(e.currentTarget).css({
                    'visibility': 'hidden'
                });
            }
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
            appView.$('.js-menuLink[data-id="' + frame + '"]').addClass('active');

            appView.$('.js-framesContainer').animate({
                'left': -frame * appView.frameWidth
            }, 300, function() {

            });

            this.setOverlayColor(frame);
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
        setOverlayColor: function(frame) {
            appView.$('.js-colorOverlay').css({
                'background': App.Routes[frame].color
            });
        },
        home: function() {
            var id = this.getRouteId('home');
            this.setActiveFrame(id);
            appView.currentFrame = id;
            this.setOverlayColor(id);
        },
        resume: function() {
            var id = this.getRouteId('resume');
            this.setActiveFrame(id);
            appView.currentFrame = id;
            this.setOverlayColor(id);
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

    // Sprite player view

    App.Views.SpritePlayer = Backbone.View.extend({
        el: '.js-sprite',
        events: {
            'mouseover': 'play',
            'mouseout': 'stop',
            'asd': 'show'
        },
        framesCount: 0,
        frameWidth: 0,
        frameHeight: 0,
        speed: 0,
        spriteUrl: null,
        timer: null,
        counter: 0,
        show: function(e) {
            console.log(e);
        },
        initialize: function() {
            this.speed = this.$el.data('speed');
            this.framesCount = this.$el.data('framesCount');
            this.frameWidth = this.$el.data('frameWidth');
            this.frameHeight = this.$el.data('frameHeight');
            this.spriteUrl = this.$el.data('spriteUrl');

            this.$el.css({
                'width': this.frameWidth,
                'height': this.frameHeight,
                'background': 'url(' + this.spriteUrl + ')'
            });
        },
        play: function(e) {
            var self = this;

            this.timer = setInterval(function() {
                var $currentSprite = $(e.currentTarget);
                self.counter++;
                if (self.counter < self.framesCount) {
                    $currentSprite.css({
                        'background-position-x': -self.counter * self.frameWidth
                    });
                } else {
                    self.counter = 0;
                    $currentSprite.css({
                        'background-position-x': -self.counter * self.frameWidth
                    });
                }

            }, (1 / this.speed) * 10);
        },
        stop: function() {
            clearInterval(this.timer);
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


    /*****************
     *
     *  Initialize
     *
     ******************/

    var galleryCollection = new App.Collections.Gallery(galleryData);

    var appView = new App.Views.App(),
        videoSliderView = new App.Views.Slider(),
        newsView = new App.Views.News(),
        tabsView = new App.Views.Tabs(),
        accordionView = new App.Views.Accordion(),
        galleryView = new App.Views.Gallery({
            collection: galleryCollection
        });

    var router = new App.Router.App();

    // Sprite player initializing
    /*$('.js-sprite').each(function(index, el) {
        spritePlayerView = new App.Views.SpritePlayer({
            el: $(el)
        });
    });*/


    Backbone.history.start();

});