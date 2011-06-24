/* 
*  Adapted from Jake Gordons's script (http://codeincomplete.com/)
*  
*  This file is still rather messy, but I will eventually clean it up.
*  Basically, this just moves a box around, within a canvas element,
*  and detects if it's hit the edge(s) of the element.
*  A fair amount of it was adapted from a script Jake Gordon wrote,
*  I just changed a few things around, and added some forms to 
*  change colors, start the animation, and revert the styles back to default.
*  
*  It isn't anything fancy, just something to get the project going. 
*/

(function () {
	var canvas = document.getElementById('output'),
		context;
	
	//  I'll probably have this link to a page where you can download a 
	//  browser supporting the features. For now though, this will have to do.
	if (Modernizr.canvas) {
		context = canvas.getContext('2d');
	} else {
		alert('Sorry, your browser does not support HTML5 canvas.');
		return;
	}
	
	//  After this, if the browser doesn't support the features we need, the 
	//  whole script will stop, so there is no point in detecting any other 
	//  feature set.
	var background = document.getElementById('bg-color'),
		block = document.getElementById('block-color'),
		revert = document.getElementById('revert'),
		start = document.getElementById('start'),
		expr = /^#[0-9a-f]{3}([0-9a-f]{3})?$/i, //  Used for color validation.
		colors = { background: '#fff',  block: '#000' },
		width = canvas.width,
		height = canvas.height,
		maxx = width - 50,
		maxy = height - 50,
		x = 0, y = 0, 
		dx = 0.1, dy = 0.1,
		locked = false,
		last = Date.now();
	
	var render = function() {
		//  Clear our background, so we don't get a trail...
		context.fillStyle = colors.background;
		context.fillRect(0, 0, width, height);
		
		//  ...and draw our block!
		context.fillStyle = colors.block;
		context.fillRect(x, y, 50, 50);
	};
	
	var update = function(dt) {
		x = x + (dx * dt);
		y = y + (dy * dt);

		if ((dx < 0) && (x <= 0))
			dx = -dx;
		else if ((dx > 0) && (x >= maxx))
			dx = -dx;

		if ((dy < 0) && (y <= 0))
			dy = -dy;
		else if ((dy > 0) && (y >= maxy))
			dy = -dy;

	};
	
	var frame = function(now) {
		update(now - last);
		render();
		last = now;
		requestAnimationFrame(frame);
	};	
	
	
	start.onclick = function() {
		if (!locked) {
			frame(Date.now());
			locked = true;
		}
	};
	
	//  In case you want to revert to the 'default' style.
	revert.onclick = function() {
		colors.background = '#fff';
		colors.block = '#000';
	};
	
	document.onkeypress = function(event) {
		if (event.keyCode === 13) {
			if (background !== '') {
				//  Because any number of values can be entered, we 
				//  want to make sure that it's a valid CSS color code.
				if (expr.test(background.value)) {
					colors.background = background.value;
				}
				background.value = '';
			}
			if (block !== '') {
				//  Same this as above. We want to make sure it's valid.
				if (expr.test(block.value)) {
					colors.block = block.value;
				}
				block.value = '';
			}
		}
	};
}());