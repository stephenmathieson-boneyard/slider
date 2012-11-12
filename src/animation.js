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
