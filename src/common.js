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
