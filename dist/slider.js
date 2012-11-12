/**
 * Slider 0.1.0
 * (c) 2012 Stephen Mathieson, WTFPL
 */
(function (window, document, undefined) {
	'use strict';


/*jslint browser:true*/

// element for testing support
var div = document.createElement('div');

// namespace for UA support of various features
var support = {};

/**
 * Support for CSS3 transitions
 *
 * Adapted from https://gist.github.com/1038271
 *
 * @type {Boolean|String} `false` if transitions are not supported, the transition CSS property when they are
 */
support.transitions = (function (style) {
	'use strict';

	var index, length, prefixes, prop,
		transition = 'Transition';

	// first, check without prefixes
	prop = transition.toLowerCase();
	if (style[prop] !== undefined) {
		return prop;
	}

	// don't create the array until we need it
	prefixes = ['webkit', 'Moz', 'Ms', 'O'];

	// check each prefix
	for (index = 0, length = prefixes.length; index < length; index += 1) {
		prop = prefixes[index] + transition;
		if (style[prop] !== undefined) {
			return prop;
		}
	}

	return false;

}(div.style));

// HTMLElement.classList support
support.classList = !!div.classList;

// support for CSS opacity
support.opacity = (function () {
	'use strict';

	var bold;

	div.innerHTML = '<b style="opacity:.55"></b>';

	bold = div.getElementsByTagName('b')[0];

	return (/^0\.55/).test(bold.style.opacity);

}());

/*global support*/

var toString = Object.prototype.toString;

/**
 * A robust shim for `String#trim`.
 *
 * @param  {String} str The string to trim
 * @return {String}     A string without whitespace-padding
 */
var trim = (function () {
	'use strict';

	var regex;

	if (String.prototype.trim) {
		return function (str) {
			return str.trim();
		};
	}

	// simple regex to act like string.trim
	//
	// cache this so we're not re-creating the expression each time `trim()` is
	// called
	regex = /^\s+|\s+$/g;

	return function (str) {
		return str.replace(regex, '');
	};

}());

/**
 * Add a class to an element
 *
 * @param {HTMLElement} element   The element
 * @param {String}      className The class to add
 */
var addClass = (function () {
	'use strict';

	if (support.classList) {
		return function (element, className) {
			className = trim(className);
			// @todo does Element.classList.add trim strings for us?
			element.classList.add(className);
		};
	}

	return function (element, className) {
		className = trim(className);

		element.className = element.className + ' ' + className;
	};

}());


/**
 * Remove a class from an element
 *
 * @param {HTMLElement} element   The element
 * @param {String}      className The class to remove
 */
var removeClass = (function () {
	'use strict';

	if (support.classList) {
		return function (element, className) {
			className = trim(className);
			// @todo does Element.classList.add trim strings for us?
			element.classList.remove(className);
		};
	}

	return function (element, className) {

		className = ' ' + trim(className) + ' ';

		var classList = element.className;

		if (classList) {
			classList = ' ' + classList + ' ';

			classList = classList.replace(className, '');
			classList = trim(classList);

			element.className = classList;

		}

	};

}());

/*global support*/
/*jslint browser:true*/

// the transition we'll use
// @todo make this configurable (duration, timing-function)
var transition = 'opacity 1s ease-in';

/**
 * Cross-browser update CSS opacity.  When `opacity` is not supported, will update the `filter` property instead.
 *
 * @param {CSSStyleDeclaration} style The `style` object to update
 * @param {Number}              value The new `opacity` value
 */
var setOpacity = (function () {
	'use strict';

	if (support.opacity) {
		return function (style, value) {
			style.opacity = value;
		};
	}

	return function (style, value) {
		style.filter = 'alpha(opacity=' + (value * 100).toString() + ')';
	};

}());

/**
 * Fade an element by updating its opacity.  When CSS3 transitions are supported, they will be used.
 *
 * @todo   Should use requestAnimationFrame polyfil
 * @param  {HTMLElement} element The element to fade-out
 * @param  {Number}      to      The target opacity (0 to fade out, 1 to fade in)
 * @param  {Function}    next    The callback
 */
var fadeTo = (function (transitions) {
	'use strict';

	if (transitions) {
		return function (element, to, next) {
			var style = element.style;

			// set the transition property when necessary
			if (!style[transitions]) {
				style[transitions] = transition;
			}

			setOpacity(style, to);
			return next();
		};
	}

	return function (element, to, next) {

		var interval, opacity, animation,
			style = element.style;

		// fadeOut
		if (!to) {

			opacity = 0.9;

			animation = function () {
				opacity += -0.1;

				if (opacity < 0) {
					setOpacity(style, 0);
					window.clearInterval(interval);
					return next();
				}

				setOpacity(style, opacity);
			};


		} else { // fadeIn

			opacity = 0;

			animation = function () {
				opacity += 0.1;

				if (opacity > 1) {
					setOpacity(style, 1);
					window.clearInterval(interval);
					return next();
				}

				setOpacity(style, opacity);
			};

		}

		interval = window.setInterval(animation, 100);

	};

}(support.transitions));

/*jslint browser:true*/
/*global toString, setOpacity, addClass, removeClass, fadeTo*/

/**
 * [Slider description]
 *
 * @constructor
 * @param {HTMLElement} element [description]
 * @param {NodeList}    images  [description]
 * @param {Object}      options [description]
 */
function Slider(element, images, options) {
	'use strict';

	var defaults, active;

	if (!element.nodeType) {
		throw new Error('Slider: invalid element');
	}

	/* FireFox says [object HTMLCollection]
	if (toString.call(images) !== '[object NodeList]') {
		throw new Error('Slider: Invalid images list');
	}
	*/

	defaults = {
		duration: 2000,
		preload: false,
		activeClass: null
	};

	this.element = element;
	this.images = images;
	this.options = options || defaults;

	this.index = 0;

	// grab the first image
	active = this.images[this.index];
	// to start, show the first image
	setOpacity(active.style, 1);

	// add the active class (if there is one)
	if (this.options.activeClass) {
		addClass(active, this.options.activeClass);
	}

	this.interval = null;
}

/**
 * [play description]
 * @return {[type]} [description]
 */
Slider.prototype.play = function () {
	'use strict';

	var slider = this;

	this.interval = window.setTimeout(function () {

		slider.next();

	}, this.options.duration);

	return this;
};

/**
 * [pause description]
 * @return {[type]} [description]
 */
Slider.prototype.pause = function () {
	'use strict';

	window.clearTimeout(this.interval);
	this.interval = null;

	return this;
};

/**
 * [moveBy description]
 * @param  {[type]} value [description]
 * @return {[type]}       [description]
 */
Slider.prototype.moveBy = function (value) {
	'use strict';

	var next,
		slider = this,
		className = this.options.activeClass,
		current = this.images[this.index];

	window.clearTimeout(this.interval);

	this.index += value;

	if (this.index === this.images.length) {
		this.index = 0;
	} else if (this.index === -1) {
		this.index = (this.images.length - 1);
	}

	next = this.images[this.index];

	if (className) {
		removeClass(current, className);
		addClass(next, className);
	}

	fadeTo(current, 0, function () {
		fadeTo(next, 1, function () {
			slider.interval = window.setTimeout(function () {
				slider.next();
			}, slider.options.duration);
		});
	});

};

/**
 * [prev description]
 * @return {[type]} [description]
 */
Slider.prototype.prev = function () {
	'use strict';

	this.moveBy(-1);
};

/**
 * [next description]
 * @return {Function} [description]
 */
Slider.prototype.next = function () {
	'use strict';

	this.moveBy(1);
};

	var slider = window.slider = function (container, images, options) {
		return new Slider(container, images, options);
	};

}(window, document));