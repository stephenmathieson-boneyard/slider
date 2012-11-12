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
