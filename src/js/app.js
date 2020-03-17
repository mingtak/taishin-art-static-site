if (module.hot) {
	module.hot.accept();
}

import jQuery from "jquery";


jQuery(function() {
	initNavigationSelect();
	initMobileNav();
	initFixedHeader();
});


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

// generate select from navigation
function initNavigationSelect() {
	jQuery('.side-list').navigationSelect({
		activeClass: 'nav-active',
		defaultOptionAttr: 'title',
		levelIndentHTML: ' &amp;bull; ',
		defaultOptionText: '全部入圍作品'
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
 				var defaultOption = $('<option>').addClass(this.options.defaultOptionClass).text(attrText || this.options.defaultOptionText);
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
				if(this.selectedIndex >= self.startIndex) {
					location.href = this.value;
				}
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