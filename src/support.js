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
