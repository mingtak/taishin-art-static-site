if (module.hot) {
	module.hot.accept();
}
var $ = require("jquery");
var jQuery = require("jquery");
global.jQuery = require('jquery');
var jQBridget = require('jquery-bridget');
var Isotope = require('isotope-layout');
var imagesLoaded = require('imagesloaded');
var slick =  require('slick-carousel');
var AOS = require('aos');

jQuery.bridget( 'isotope', Isotope );



jQuery(function() {
	initNavigationSelect();
	switchTabBySelect();
	initMobileNav();
	initFixedHeader();
	initSameHeight();
	initFilter();
	initSlickSlider();
	initAos();
	initOpenClose();
	initSmoothScroll();
});


// open-close init
function initOpenClose() {
	jQuery('.share-block').openClose({
		activeClass: 'active',
		opener: '.opener',
		slider: '.share-holder',
		animSpeed: 400,
		effect: 'slide'
	});

	jQuery('.share-content').openClose({
		activeClass: 'active',
		opener: '.opener',
		slider: '.share-holder',
		animSpeed: 400,
		effect: 'fade'
	});

	jQuery('.shareit').openClose({
		activeClass: 'active',
		opener: '.opener',
		slider: '.drop',
		animSpeed: 400,
		effect: 'fade'
	});
}





// loaded state script
(function(w) {
	w.addEventListener('load', function() {
		var loader = document.querySelector('html');
		if (loader) {
			loader.classList.add('loaded');
		}
	});
}(window));



function initSmoothScroll() {
	var btn = jQuery('.btn-scroll');

	btn.on('click', function(e) {
		e.preventDefault();
		jQuery('body, html').animate({
			scrollTop: jQuery(btn.attr('href')).offset().top
		}, 500);
	});

	

	var scroll = jQuery('.scroll');
	scroll.on('click', function(e) {
		e.preventDefault();
		var target = $(this).attr('href'), $target = $(target); {
			$('html, body').stop().animate({
				'scrollTop' : $target.offset().top - jQuery('#header').outerHeight()
			}, 900, 'swing', function() {
				window.location.hash = target;
			});
		}
	});
}

function initAos() {
	AOS.init({
		duration: 1000,
		once: true,
	});
}




function initSlickSlider() {
	jQuery(".slider").slick({
		arrows: false,
		fade: true,
		dots: true,
		slidesToScroll: 1,
		rows: 0,
	});
}

// align blocks height
function initSameHeight() {
	jQuery('.posts').sameHeight({
		elements: '.post-holder',
		flexible: true,
		multiLine: true
	});
}

function initFilter() { 
	var $container = jQuery('.filter-container');
	var select = jQuery('.side-holder .nav-select');

	$container.imagesLoaded( function(){
		$container.isotope({
			itemSelector: '.grid-item',
			layoutMode: 'fitRows' 
		});
	});

	if (location.hash.length && location.hash.replace(/_/g, ' ').slice(1) != 'all' && location.hash.replace(/_/g, ' ').slice(1) != 'section1') {
		
		$container.isotope({
			filter: '[data-filter*=' + location.hash.replace(/_/g, ' ').slice(1) + ']'
		});
	}

	var links = jQuery('.side-list').find('a');

	links.on('click', function(e) {
		e.preventDefault();
		var parent = jQuery(this).closest('li');
		parent.addClass('active').siblings().removeClass('active');

		var filter = jQuery(this).data('filter');
		$container.isotope({ filter: filter === 'all' ? '*' : '[data-filter*=' + filter + ']'});
		var f = filter.replace(/\s/g, '_');

		if (location) {
			location.hash = f;
		}
		initAos();
	});
}


function initFixedHeader() {
	var header = jQuery('#header');
	var win = jQuery(window);
	var headerParent = header.parent('.sticky-header');

	if (headerParent.length) {
		win.on('load resize', function() {
			var headerHeight = header.outerHeight();
			header.parent('.sticky-header').css('height', headerHeight);
		})

		function resizeHandler() {
			var scrollTop = win.scrollTop();

			if (scrollTop > header.parent().offset().top) {
				header.addClass('header-fixed');
			}	 else {
				header.removeClass('header-fixed');
			}
		}
		resizeHandler();
		win.on('resize scroll', resizeHandler);
	}
}

function switchTabBySelect() {
	jQuery('.side-list').each(function(e){
		var tabSet = jQuery(this);
		var links = tabSet.find('a');
		var select = tabSet.siblings('select');

		links.on('click', function(){
			select.prop('selectedIndex', links.index(jQuery(this)));
		});

		select.on('change', function(){
			links.eq(this.selectedIndex).trigger('click');
		});
	});
}

// generate select from navigation
function initNavigationSelect() {
	jQuery('.side-list').navigationSelect({
		levelIndentHTML: '&bull; ',
		defaultOptionAttr: 'title',
		useDefaultOption: false,
		selectClass: 'select-nav',
		activeClass: 'active'
	});
}


// mobile menu init
function initMobileNav() {

	jQuery('body').mobileNav({
		menuActiveClass: 'nav-active',
		menuOpener: '.nav-opener',
		hideOnClickOutside: true,
		menuDrop: '.nav-drop'
	});
}




/*
 * Convert navigation to select
 */
 ;(function($) {
 	function NavigationSelect(options) {
 		this.options = $.extend({
 			list: null,
 			levelIndentHTML: ' &bull; ',
 			defaultOptionAttr: 'title',
 			defaultOptionText: '...',
 			selectClass: 'nav-select',
 			activeClass: 'nav-active',
 			defaultOptionClass: 'opt-default',
 			hasDropClass: 'opt-sublevel',
 			levelPrefixClass: 'opt-level-',
 			useDefaultOption: true
 		}, options);
 		if(this.options.list) {
 			this.createSelect();
 			this.attachEvents();
 		}
 	}
 	NavigationSelect.prototype = {
 		createSelect: function() {
 			var self = this;
 			this.startIndex = 0;
 			this.navigation = $(this.options.list);
 			this.select = $('<select>').addClass(this.options.selectClass);
 			this.createDefaultOption();
 			this.createList(this.navigation, 0);
 			this.select.insertBefore(this.navigation);
 		},
 		createDefaultOption: function() {
 			if(this.options.useDefaultOption) {
 				var attrText = this.navigation.attr(this.options.defaultOptionAttr);
 				var defaultOption = $('<option>').addClass(this.options.defaultOptionClass).html(attrText || this.options.defaultOptionText);
 				this.navigation.removeAttr(this.options.defaultOptionAttr);
 				this.select.append(defaultOption);
 				this.startIndex = 1;
 			}
 		},
 		createList: function(list, level) {
 			var self = this;
 			list.children().each(function(index, item) {
 				var listItem = $(this),
 				listLink = listItem.find('a').eq(0),
 				listDrop = listItem.find('ul').eq(0),
 				hasDrop = listDrop.length > 0;

 				if(listLink.length) {
 					self.select.append(self.createOption(listLink, hasDrop, level, listLink.hasClass(self.options.activeClass)));
 				}
 				if(hasDrop) {
 					self.createList(listDrop, level + 1);
 				}
 			});
 		},
 		createOption: function(link, hasDrop, level, selected) {
 			var optionHTML = this.getLevelIndent(level) + link.html();
 			return $('<option>').html(optionHTML)
 			.addClass(this.options.levelPrefixClass + (level + 1))
 			.toggleClass(this.options.hasDropClass, hasDrop)
 			.val(link.attr('href')).attr('selected', selected ? 'selected' : false);
 		},
 		getLevelIndent: function(level) {
 			return (new Array(level + 1)).join(this.options.levelIndentHTML);
 		},
 		attachEvents: function() {
   // redirect on select change
   var self = this;
   this.select.change(function() {
    // if(this.selectedIndex >= self.startIndex) {
    //  location.href = this.value;
    // }
});
}
};

 // jquery pluginm interface
 $.fn.navigationSelect = function(opt) {
 	return this.each(function() {
 		new NavigationSelect($.extend({list: this}, opt));
 	});
 };
}(jQuery));


/*
 * Simple Mobile Navigation
 */
 ;(function($) {
 	function MobileNav(options) {
 		this.options = $.extend({
 			container: null,
 			hideOnClickOutside: false,
 			menuActiveClass: 'nav-active',
 			menuOpener: '.nav-opener',
 			menuDrop: '.nav-drop',
 			toggleEvent: 'click',
 			outsideClickEvent: 'click touchstart pointerdown MSPointerDown'
 		}, options);
 		this.initStructure();
 		this.attachEvents();
 	}
 	MobileNav.prototype = {
 		initStructure: function() {
 			this.page = $('html');
 			this.container = $(this.options.container);
 			this.opener = this.container.find(this.options.menuOpener);
 			this.drop = this.container.find(this.options.menuDrop);
 		},
 		attachEvents: function() {
 			var self = this;

 			if(activateResizeHandler) {
 				activateResizeHandler();
 				activateResizeHandler = null;
 			}

 			this.outsideClickHandler = function(e) {
 				if(self.isOpened()) {
 					var target = $(e.target);
 					if(!target.closest(self.opener).length && !target.closest(self.drop).length) {
 						self.hide();
 					}
 				}
 			};

 			this.openerClickHandler = function(e) {
 				e.preventDefault();
 				self.toggle();
 			};

 			this.opener.on(this.options.toggleEvent, this.openerClickHandler);
 		},
 		isOpened: function() {
 			return this.container.hasClass(this.options.menuActiveClass);
 		},
 		show: function() {
 			this.container.addClass(this.options.menuActiveClass);
 			if(this.options.hideOnClickOutside) {
 				this.page.on(this.options.outsideClickEvent, this.outsideClickHandler);
 			}
 		},
 		hide: function() {
 			this.container.removeClass(this.options.menuActiveClass);
 			if(this.options.hideOnClickOutside) {
 				this.page.off(this.options.outsideClickEvent, this.outsideClickHandler);
 			}
 		},
 		toggle: function() {
 			if(this.isOpened()) {
 				this.hide();
 			} else {
 				this.show();
 			}
 		},
 		destroy: function() {
 			this.container.removeClass(this.options.menuActiveClass);
 			this.opener.off(this.options.toggleEvent, this.clickHandler);
 			this.page.off(this.options.outsideClickEvent, this.outsideClickHandler);
 		}
 	};

 	var activateResizeHandler = function() {
 		var win = $(window),
 		doc = $('html'),
 		resizeClass = 'resize-active',
 		flag, timer;
 		var removeClassHandler = function() {
 			flag = false;
 			doc.removeClass(resizeClass);
 		};
 		var resizeHandler = function() {
 			if(!flag) {
 				flag = true;
 				doc.addClass(resizeClass);
 			}
 			clearTimeout(timer);
 			timer = setTimeout(removeClassHandler, 500);
 		};
 		win.on('resize orientationchange', resizeHandler);
 	};

 	$.fn.mobileNav = function(opt) {
 		var args = Array.prototype.slice.call(arguments);
 		var method = args[0];

 		return this.each(function() {
 			var $container = jQuery(this);
 			var instance = $container.data('MobileNav');

 			if (typeof opt === 'object' || typeof opt === 'undefined') {
 				$container.data('MobileNav', new MobileNav($.extend({
 					container: this
 				}, opt)));
 			} else if (typeof method === 'string' && instance) {
 				if (typeof instance[method] === 'function') {
 					args.shift();
 					instance[method].apply(instance, args);
 				}
 			}
 		});
 	};
 }(jQuery));

 
/*
 * jQuery SameHeight plugin
 */
 ;(function($){
 	$.fn.sameHeight = function(opt) {
 		var options = $.extend({
 			skipClass: 'same-height-ignore',
 			leftEdgeClass: 'same-height-left',
 			rightEdgeClass: 'same-height-right',
 			elements: '>*',
 			flexible: false,
 			multiLine: false,
 			useMinHeight: false,
 			biggestHeight: false
 		},opt);
 		return this.each(function(){
 			var holder = $(this), postResizeTimer, ignoreResize;
 			var elements = holder.find(options.elements).not('.' + options.skipClass);
 			if(!elements.length) return;

			// resize handler
			function doResize() {
				elements.css(options.useMinHeight && supportMinHeight ? 'minHeight' : 'height', '');
				if(options.multiLine) {
					// resize elements row by row
					resizeElementsByRows(elements, options);
				} else {
					// resize elements by holder
					resizeElements(elements, holder, options);
				}
			}
			doResize();

			// handle flexible layout / font resize
			var delayedResizeHandler = function() {
				if(!ignoreResize) {
					ignoreResize = true;
					doResize();
					clearTimeout(postResizeTimer);
					postResizeTimer = setTimeout(function() {
						doResize();
						setTimeout(function(){
							ignoreResize = false;
						}, 10);
					}, 100);
				}
			};

			// handle flexible/responsive layout
			if(options.flexible) {
				$(window).bind('resize orientationchange fontresize', delayedResizeHandler);
			}

			// handle complete page load including images and fonts
			$(window).bind('load', delayedResizeHandler);
		});
 	};

	// detect css min-height support
	var supportMinHeight = typeof document.documentElement.style.maxHeight !== 'undefined';

	// get elements by rows
	function resizeElementsByRows(boxes, options) {
		var currentRow = $(), maxHeight, maxCalcHeight = 0, firstOffset = boxes.eq(0).offset().top;
		boxes.each(function(ind){
			var curItem = $(this);
			if(curItem.offset().top === firstOffset) {
				currentRow = currentRow.add(this);
			} else {
				maxHeight = getMaxHeight(currentRow);
				maxCalcHeight = Math.max(maxCalcHeight, resizeElements(currentRow, maxHeight, options));
				currentRow = curItem;
				firstOffset = curItem.offset().top;
			}
		});
		if(currentRow.length) {
			maxHeight = getMaxHeight(currentRow);
			maxCalcHeight = Math.max(maxCalcHeight, resizeElements(currentRow, maxHeight, options));
		}
		if(options.biggestHeight) {
			boxes.css(options.useMinHeight && supportMinHeight ? 'minHeight' : 'height', maxCalcHeight);
		}
	}

	// calculate max element height
	function getMaxHeight(boxes) {
		var maxHeight = 0;
		boxes.each(function(){
			maxHeight = Math.max(maxHeight, $(this).outerHeight());
		});
		return maxHeight;
	}

	// resize helper function
	function resizeElements(boxes, parent, options) {
		var calcHeight;
		var parentHeight = typeof parent === 'number' ? parent : parent.height();
		boxes.removeClass(options.leftEdgeClass).removeClass(options.rightEdgeClass).each(function(i){
			var element = $(this);
			var depthDiffHeight = 0;
			var isBorderBox = element.css('boxSizing') === 'border-box' || element.css('-moz-box-sizing') === 'border-box' || element.css('-webkit-box-sizing') === 'border-box';

			if(typeof parent !== 'number') {
				element.parents().each(function(){
					var tmpParent = $(this);
					if(parent.is(this)) {
						return false;
					} else {
						depthDiffHeight += tmpParent.outerHeight() - tmpParent.height();
					}
				});
			}
			calcHeight = parentHeight - depthDiffHeight;
			calcHeight -= isBorderBox ? 0 : element.outerHeight() - element.height();

			if(calcHeight > 0) {
				element.css(options.useMinHeight && supportMinHeight ? 'minHeight' : 'height', calcHeight);
			}
		});
		boxes.filter(':first').addClass(options.leftEdgeClass);
		boxes.filter(':last').addClass(options.rightEdgeClass);
		return calcHeight;
	}
}(jQuery));


/*
 * jQuery Open/Close plugin
 */
 ;(function($) {
 	function OpenClose(options) {
 		this.options = $.extend({
 			addClassBeforeAnimation: true,
 			hideOnClickOutside: false,
 			activeClass: 'active',
 			opener: '.opener',
 			slider: '.slide',
 			animSpeed: 400,
 			effect: 'fade',
 			event: 'click'
 		}, options);
 		this.init();
 	}
 	OpenClose.prototype = {
 		init: function() {
 			if (this.options.holder) {
 				this.findElements();
 				this.attachEvents();
 				this.makeCallback('onInit', this);
 			}
 		},
 		findElements: function() {
 			this.holder = $(this.options.holder);
 			this.opener = this.holder.find(this.options.opener);
 			this.slider = this.holder.find(this.options.slider);
 		},
 		attachEvents: function() {
			// add handler
			var self = this;
			this.eventHandler = function(e) {
				e.preventDefault();
				if (self.slider.hasClass(slideHiddenClass)) {
					self.showSlide();
				} else {
					self.hideSlide();
				}
			};
			self.opener.on(self.options.event, this.eventHandler);

			// hover mode handler
			if (self.options.event === 'hover') {
				self.opener.on('mouseenter', function() {
					if (!self.holder.hasClass(self.options.activeClass)) {
						self.showSlide();
					}
				});
				self.holder.on('mouseleave', function() {
					self.hideSlide();
				});
			}

			// outside click handler
			self.outsideClickHandler = function(e) {
				if (self.options.hideOnClickOutside) {
					var target = $(e.target);
					if (!target.is(self.holder) && !target.closest(self.holder).length) {
						self.hideSlide();
					}
				}
			};

			// set initial styles
			if (this.holder.hasClass(this.options.activeClass)) {
				$(document).on('click touchstart', self.outsideClickHandler);
			} else {
				this.slider.addClass(slideHiddenClass);
			}
		},
		showSlide: function() {
			var self = this;
			if (self.options.addClassBeforeAnimation) {
				self.holder.addClass(self.options.activeClass);
			}
			self.slider.removeClass(slideHiddenClass);
			$(document).on('click touchstart', self.outsideClickHandler);

			self.makeCallback('animStart', true);
			toggleEffects[self.options.effect].show({
				box: self.slider,
				speed: self.options.animSpeed,
				complete: function() {
					if (!self.options.addClassBeforeAnimation) {
						self.holder.addClass(self.options.activeClass);
					}
					self.makeCallback('animEnd', true);
				}
			});
		},
		hideSlide: function() {
			var self = this;
			if (self.options.addClassBeforeAnimation) {
				self.holder.removeClass(self.options.activeClass);
			}
			$(document).off('click touchstart', self.outsideClickHandler);

			self.makeCallback('animStart', false);
			toggleEffects[self.options.effect].hide({
				box: self.slider,
				speed: self.options.animSpeed,
				complete: function() {
					if (!self.options.addClassBeforeAnimation) {
						self.holder.removeClass(self.options.activeClass);
					}
					self.slider.addClass(slideHiddenClass);
					self.makeCallback('animEnd', false);
				}
			});
		},
		destroy: function() {
			this.slider.removeClass(slideHiddenClass).css({
				display: ''
			});
			this.opener.off(this.options.event, this.eventHandler);
			this.holder.removeClass(this.options.activeClass).removeData('OpenClose');
			$(document).off('click touchstart', this.outsideClickHandler);
		},
		makeCallback: function(name) {
			if (typeof this.options[name] === 'function') {
				var args = Array.prototype.slice.call(arguments);
				args.shift();
				this.options[name].apply(this, args);
			}
		}
	};

	// add stylesheet for slide on DOMReady
	var slideHiddenClass = 'js-slide-hidden';
	(function() {
		var tabStyleSheet = $('<style type="text/css">')[0];
		var tabStyleRule = '.' + slideHiddenClass;
		tabStyleRule += '{position:absolute !important;left:-9999px !important;top:-9999px !important;display:block !important}';
		if (tabStyleSheet.styleSheet) {
			tabStyleSheet.styleSheet.cssText = tabStyleRule;
		} else {
			tabStyleSheet.appendChild(document.createTextNode(tabStyleRule));
		}
		$('head').append(tabStyleSheet);
	}());

	// animation effects
	var toggleEffects = {
		slide: {
			show: function(o) {
				o.box.stop(true).hide().slideDown(o.speed, o.complete);
			},
			hide: function(o) {
				o.box.stop(true).slideUp(o.speed, o.complete);
			}
		},
		fade: {
			show: function(o) {
				o.box.stop(true).hide().fadeIn(o.speed, o.complete);
			},
			hide: function(o) {
				o.box.stop(true).fadeOut(o.speed, o.complete);
			}
		},
		none: {
			show: function(o) {
				o.box.hide().show(0, o.complete);
			},
			hide: function(o) {
				o.box.hide(0, o.complete);
			}
		}
	};

	// jQuery plugin interface
	$.fn.openClose = function(opt) {
		var args = Array.prototype.slice.call(arguments);
		var method = args[0];

		return this.each(function() {
			var $holder = jQuery(this);
			var instance = $holder.data('OpenClose');

			if (typeof opt === 'object' || typeof opt === 'undefined') {
				$holder.data('OpenClose', new OpenClose($.extend({
					holder: this
				}, opt)));
			} else if (typeof method === 'string' && instance) {
				if (typeof instance[method] === 'function') {
					args.shift();
					instance[method].apply(instance, args);
				}
			}
		});
	};
}(jQuery));