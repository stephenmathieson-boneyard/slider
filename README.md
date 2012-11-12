# slider

A simple, library free image slider using CSS3 transitions.  Licensed under [WTFPL](http://wtfpl.org).

Put together as a learning experience, not for use in production.


### API

#### `slider(element, images, options)`

Creates a new `slider` instance

```javascript
var thingy,
	element = document.getElementById('slider'),
	images = element.getElementsByTagName('img')
	options = {
		duration: 5000, // the number of miliseconds to pause between slides
		activeClass: 'active' // the (optional) class to add to the currently active slide
	};

thingy = slider(element, images, options);
```

#### `slider#moveBy(number)`

Move a specified number of images

```javascript
thingy.moveBy(2); // move forward two images
```

```javascript
thingy.moveBy(-1); // move backwards one image
```

#### `slider#play`

Start the slider.  Will move forward one image every `duration`.

#### `slider#pause`

Stop the slider.

#### `slider#prev`

Move backward one image

#### `slider#next`

Move forward one image



### Revision History

#### 0.1.0
- initial release
- using CSS3 transitions to fade in/out images in a circular manor




### Stats

- Uncompressed size: _7925_ bytes
- Compressed size: _985_ bytes gzipped (_2439_ bytes minified)
