var S = {
	
	dot:
	[[1]],
	
	box3:
	[[1,1,1],
	 [1,1,1],
	 [1,1,1]],
	
	line:
	{
		horizontal: 
		{
			two:
			[[1,1]],
			
			three:
			[[1,1,1]],
			
			four:
			[[1,1,1,1]],
			
			five:
			[[1,1,1,1,1]],
		},
		
		vertical:
		{
			two:
			[[1],
			 [1]],
			
			three:
			[[1],
			 [1],
			 [1]],
			
			four:
			[[1],
			 [1],
			 [1],
			 [1]],
			
			five:
			[[1],
			 [1],
			 [1],
			 [1],
			 [1]],
		}
	},
	
	dbleline:
	{
		horizontal:
		{
			three:
			[[1,1,1],
			 [1,1,1]],
		},
		
		vertical:
		{
			three:
			[[1,1],
			 [1,1],
			 [1,1]],
		}
	},
	
	zorrow:
	{
		unflipped:
		{
			horizontal:
			[[1,1,0],
			 [0,1,1]],
			
			vertical:
			[[0,1],
			 [1,1],
			 [1,0]],
		},
		
		flipped:
		{
			horizontal:
			[[0,1,1],
			 [1,1,0]],
			
			vertical:
			[[1,0],
			 [1,1],
			 [0,1]],
		}
	},
	
	knight:
	{
		unflipped:
		{
			north:
			[[1, 0],
			 [1, 0],
			 [1, 1]],
			
			east:
			[[1, 1, 1],
			 [1, 0, 0]],
			
			south:
			[[1, 1],
			 [0, 1],
			 [0, 1]],
			
			west:
			[[0, 0, 1],
			 [1, 1, 1]],
		},
		
		flipped:
		{
			north:
			[[0, 1],
			 [0, 1],
			 [1, 1]],
			
			east:
			[[1, 0, 0],
			 [1, 1, 1]],
			
			south:
			[[1, 1],
			 [1, 0],
			 [1, 0]],
			
			west:
			[[1, 1, 1],
			 [0, 0, 1]],
		}
	},
			
	tee:
	[[0, 1, 0],
	 [1, 1, 1]],
	
	diagonal:
	{
		north:
		{
			two:
			[[1,0],
			 [1,1]],
			
			three:
			[[1, 0, 0],
			 [1, 0, 0],
			 [1, 1, 1]],
		},
		
		east:
		{
			two:
			[[1,1],
			 [1,0]],
			
			three:
			[[1, 1, 1],
			 [1, 0, 0],
			 [1, 0, 0]],
		},
		
		south:
		{
			two:
			[[1,1],
			 [0,1]],
			
			three:
			[[1, 1, 1],
			 [0, 0, 1],
			 [0, 0, 1]],
		},
		
		west:
		{
			two:
			[[0,1],
			 [1,1]],
			
			three:
			[[0, 0, 1],
			 [0, 0, 1],
			 [1, 1, 1]],
		}
	},
	
	cross:
	{
		three:
		[[0,1,0],
		 [1,1,1],
		 [0,1,0]],
	},	
};

var puzzles = [
	{
		tip: "The puzzle is solved by constructing a single block.",
		puzzle: [S.knight.unflipped.north, S.knight.unflipped.south]
	},
	{
		tip: "The shape of the block doesn't matter as long as it matches a shape magnified 2x",
		puzzle: [S.line.vertical.three, S.line.vertical.two, S.line.horizontal.three, S.line.horizontal.four]
	},
	{
		tip: "Sometimes intermediate blocks have to be created.",
		puzzle: [S.diagonal.north.two, S.line.vertical.two, S.line.vertical.two]
	},
	{
		tip: "The big block doesn't shrink because it consists of an odd number of bricks",
		puzzle: [S.box3, S.line.vertical.three, S.line.horizontal.four]
	},
	{
		tip: "Chaining",
		puzzle: [S.diagonal.north.two, S.diagonal.east.two, S.diagonal.south.two, S.diagonal.west.two, S.dot]
	},
	{
		tip: "The worst tetris piece",
		puzzle: [S.diagonal.north.three, S.diagonal.north.two, S.diagonal.south.three, S.diagonal.south.two]
	},
	{
		tip: "Easy peasy",
		puzzle: [S.tee, S.line.horizontal.two, S.tee, S.dot, S.dot]
	},
	{
		tip: "Whatever",
		puzzle: [S.line.vertical.five, S.line.vertical.five, S.line.horizontal.five, S.line.horizontal.five, S.line.vertical.three, S.line.vertical.three, S.line.horizontal.three, S.line.horizontal.three]
	},
	{
		tip: "Write something clever here",
		puzzle: [S.box3, S.box3, S.line.vertical.three, S.line.vertical.three, S.line.horizontal.two, S.line.horizontal.two]
	},
	{
		tip: "Grrr no more",
		puzzle: [S.knight.flipped.north, S.knight.unflipped.north, S.knight.flipped.east, S.knight.unflipped.west, S.line.vertical.two, S.line.vertical.two]
	},
	{
		tip: "Meh meh meh",
		puzzle: [S.line.vertical.four, S.knight.unflipped.north, S.knight.unflipped.west]
	},
	{
		tip: "Så här kan också göra",
		puzzle: [S.tee, S.line.vertical.four, S.line.horizontal.four, S.line.vertical.four, S.knight.unflipped.south, S.knight.flipped.south, S.line.horizontal.four, S.line.vertical.three]
	},
	{
		tip: "Galet",
		puzzle:	[S.knight.unflipped.south, S.knight.unflipped.west, S.knight.flipped.north, S.knight.flipped.west]
	},
	{
		tip: "Mono culture",
		puzzle: [S.dot, S.knight.unflipped.north, S.knight.unflipped.north, S.knight.unflipped.south, S.knight.unflipped.west, S.knight.unflipped.north, S.knight.unflipped.south]
	},
	{
		tip: "Getting harder",
		puzzle: [S.line.vertical.three, S.line.vertical.three, S.line.horizontal.three, S.line.horizontal.three, S.line.horizontal.two, S.line.horizontal.two]
	},
	{
		tip: "Wazza what?!",
		puzzle: [S.knight.unflipped.north, S.line.horizontal.four, S.line.horizontal.three, S.line.vertical.four, S.line.vertical.four, S.dot]
	},
	{
		tip: "Stairway to heaven",
		puzzle: [S.line.horizontal.two, S.line.vertical.two, S.line.vertical.two, S.line.vertical.two, S.knight.flipped.south, S.knight.unflipped.west, S.diagonal.south.three, S.line.horizontal.three, S.line.horizontal.three, S.box3, S.box3]
	},
	{
		tip: "Symmetry is a pretty",
		puzzle: [S.diagonal.north.three, S.diagonal.east.three, S.diagonal.south.three, S.diagonal.west.three, S.line.vertical.four, S.line.vertical.three, S.line.vertical.four, S.line.vertical.three, S.line.horizontal.four, S.line.horizontal.three, S.line.horizontal.four, S.line.horizontal.three]
	},
	{
		tip: "Clearcutting",
		puzzle: [S.dbleline.vertical.three, S.dbleline.vertical.three, S.dbleline.vertical.three, S.dbleline.horizontal.three, S.dbleline.horizontal.three, S.dbleline.horizontal.three, S.line.vertical.three]
	},
	{
		tip: "Anaconda attack",
		puzzle: [S.dot, S.zorrow.unflipped.horizontal, S.zorrow.unflipped.horizontal, S.zorrow.flipped.vertical, S.diagonal.east.three, S.diagonal.east.three, S.dot]
	},
	{
		tip: "Space ships don't need wings",
		puzzle: [S.dbleline.vertical.three, S.knight.flipped.north, S.knight.unflipped.north, S.zorrow.unflipped.vertical, S.zorrow.flipped.vertical, S.line.horizontal.three, S.line.horizontal.three]
	}
];

function boundingBoxTest(position1, dim1, position2, dim2) {
	var xdelta = position1.x - position2.x;
	var ydelta = position1.y - position2.y;

	if (xdelta > 0) {
		if (dim2.width <= xdelta) {
			return false;
		}
	} else {
		if (-dim1.width >= xdelta) {
			return false;
		}
	}
	
	if (ydelta > 0) {
		if (dim2.height <= ydelta) {
			return false;
		}
	} else {
		if (-dim1.height >= ydelta) {
			return false;
		}
	}

	return true;
}

function getBlockCollisionResolution(position1, matrix1, position2, matrix2, delta, blockSize) {	
	var xdelta = position1.x - position2.x;
	var ydelta = position1.y - position2.y;
		
	var rxoffset = xdelta.mod(blockSize);
	var ryoffset = ydelta.mod(blockSize);
	var xoffset =  blockSize - rxoffset;
	var yoffset =  blockSize - ryoffset;
		
	var size1 = { width: matrix1[0].length, height: matrix1.length };
	var size2 = { width: matrix2[0].length, height: matrix2.length };
			
	var m = xdelta / blockSize;
	var n = ydelta / blockSize;
	
	var xlook = rxoffset === 0 ? 0 : 1;
	var ylook = ryoffset === 0 ? 0 : 1;
		
	var delta_se = delta.x >= 0 && delta.y >= 0;
	var delta_sw = delta.x <= 0 && delta.y >= 0;
	var delta_ne = delta.x >= 0 && delta.y <= 0;
	var delta_nw = delta.x <= 0 && delta.y <= 0;
	
	var resolution = { x: 0, y: 0 };
		
	function resolve(horizontal, vertical, hdirection, vdirection, hoffset, voffset) {
		if (horizontal) {
			resolution.x = hoffset;
		} else if (vertical) {
			resolution.y = voffset;
		} else if (hdirection) {
			resolution.x = hoffset;
		} else if (vdirection) {
			resolution.y = voffset;
		} else if (Math.abs(hoffset) < Math.abs(voffset)) {
			resolution.x = hoffset;
		} else {
			resolution.y = voffset;
		}
	}
		
	function check(matrix, size, x, y) {
		if (x >= 0 && x < size.width && y >= 0 && y < size.height) {
			return matrix[y][x];
		}
		return 0;
	}
			
	for (var i = 0; i < size1.width; i++) {
		for (var j = 0; j < size1.height; j++) {
			
			if (!matrix1[j][i]) {
				// Empty cell
				continue;
			}
			
			var top = check(matrix1, size1, i, j + 1);
			var bottom = check(matrix1, size1, i, j - 1);
			var right = check(matrix1, size1, i + 1, j);
			var left = check(matrix1, size1, i - 1, j);
							
			// Convert matrix1 cell coordinates into matrix2 space		
			var s = Math.floor(i + m);
			var t = Math.floor(j + n);
						
			// Check for collisions with the surrouding cells in matrix2
			var a = check(matrix2, size2, s, t);
			var b = check(matrix2, size2, s + xlook, t);
			var c = check(matrix2, size2, s, t + ylook);
			var d = check(matrix2, size2, s + xlook, t + ylook);
									
			if (a + b + c + d == 1) {
				// Collision with a single cell in matrix2.
				
				if (a) {
					resolve(bottom, left, delta_sw, delta_ne, xoffset, yoffset);
				} else if (b) {
					resolve(bottom, right, delta_se, delta_nw, -rxoffset, yoffset);
				} else if (c) {
					resolve(top, left, delta_nw, delta_se, xoffset, -ryoffset);
				} else {
					resolve(top, right, delta_ne, delta_sw, -rxoffset, -ryoffset);
				}
			}
			else {
				// Collision with two adjacent cells in matrix2
				 
				if (a && b) {
					resolution.y = yoffset;
				} else
				if (d && c) {
					resolution.y = -ryoffset;
				}

				if (b && d) {
					resolution.x = -rxoffset;
				} else
				if (c && a) {
					resolution.x = xoffset;
				}	
			}
		}
	}
		
	return { x: -resolution.x, y: -resolution.y };
}

Transforms = {
	
	translate3d: function (x, y) {
		return ['translate3d(', x, 'px,', y, 'px,', '0px)'].join('');
	}
	
};

Number.prototype.mod = function(n) {
	return ((this % n) + n) % n;
};

Function.prototype.curry = function() {
	var fn = this, args = Array.prototype.slice.call(arguments);
	return function() {
		return fn.apply(this, args.concat(Array.prototype.slice.call(arguments)));
	};
};

Function.prototype.bindScope = function(scope) {
	var fn = this;
	return function() {
		return fn.apply(scope, arguments);
	};
};

function Block(container, matrix, blockSize, color) {
	this.matrix = matrix;
	this._matrixSize = this._calculateSize(matrix);
	this._size = { width: this._matrixSize.width * blockSize, height: this._matrixSize.height * blockSize };
	this.canvas = container.appendChild(this._createCanvas(this._size.width, this._size.height));
	this.ctx = this.canvas.getContext("2d");
	this._render(this.ctx, matrix, blockSize, color);
	this.transforms = ['translate3d(0,0)'];
}

Block.layerCount = 0;

Block.prototype = {
	
	_createCanvas: function (width, height) {
		Block.layerCount += 1;
		var canvas = document.createElement('canvas');
		canvas.setAttribute('class', 'block');
		canvas.setAttribute('style', 'z-index: ' + Block.layerCount);
		canvas.setAttribute('width', width);
		canvas.setAttribute('height', height);
		return canvas;
	},
		
	_render: function (ctx, matrix, blockSize, color) {
		
		if (color) {
			this.color = color;
		} else {
			var r = Math.floor(50 + Math.random() * 170);
			var g = Math.floor(50 + Math.random() * 170);
			var b = Math.floor(50 + Math.random() * 170);
			this.color = "rgb(" + [r ,g, b].join(',') + ")";
		}
		
		function renderBox(ctx, x, y, color) {
			ctx.fillStyle = color;
			ctx.fillRect(x, y, blockSize, blockSize);
			
			var inset = 2;
			var insetLength = blockSize - inset;
			
			ctx.fillStyle = "white";
			ctx.globalAlpha = 0.5;
			ctx.fillRect(x, y, insetLength, inset);
			ctx.globalAlpha = 0.3;
			ctx.fillRect(x, y + inset, inset, insetLength);
			
			ctx.fillStyle = "black";
			ctx.globalAlpha = 0.5;
			ctx.fillRect(x + inset, y + insetLength, insetLength, inset);
			ctx.globalAlpha = 0.3;
			ctx.fillRect(x + insetLength, y, inset, insetLength);
			
			ctx.globalAlpha = 1.0;
		}
		
		for (var y = 0; y < matrix.length; y++) {
			for (var x = 0; x < matrix[y].length; x++) {
				if (matrix[y][x] === 1) {
					renderBox(ctx, x * blockSize, y * blockSize, this.color);
				}
			}
		}
	},
	
	_calculateSize: function(matrix, blockSize) {
		return { width:  matrix[0].length, height: matrix.length };
	},
		
	pushTransformAnimated: function (transform, transition, callback) {
		
		var transitionEnd = function () {
			this.removeEventListener('webkitTransitionEnd', transitionEnd, false);
			if (callback) { callback(); }
		};
				
		this.canvas.addEventListener('webkitTransitionEnd', transitionEnd, false);
		this.canvas.style.webkitTransition = '-webkit-transform ' + transition;
		this.transforms.push(transform);
		this.canvas.style.webkitTransform = this.transforms.join(' ');
	},
		
	pushTransform: function(transform) {
		this.transforms.push(transform);
		this.canvas.style.webkitTransform = this.transforms.join(' ');
	},
	
	popTransform: function () {
		this.transforms.pop();
		this.canvas.style.webkitTransform = this.transforms.join(' ');
	},
	
	setPosition: function (x, y) {
		this.canvas.style.webkitTransition = '';
		this.transforms = [];
		this.pushTransform(Transforms.translate3d(x,y));
		this._x = x;
		this._y = y;
	},
	
	setPositionAnimated: function (x, y, callback) {
		
		if (this.getPosition().x == x && this.getPosition().y == y) {
			if (callback) { callback(); }
		} else {
			this.transforms = [];
			this.pushTransformAnimated(Transforms.translate3d(x, y), "0.2s ease-in", callback);
			this._x = x;
			this._y = y;
		}
	},
		
	getPosition: function() {
		return {x: this._x, y: this._y };
	},
	
	getBBox: function () {
		return { x: this._x, y: this._y, width: this._size.width, height: this._size.height };
	},
	
	getSize: function () {
		return { width: this._matrixSize.width, height: this._matrixSize.height };
	},
	
	getDimensions: function() {
		return { width: this._size.width, height: this._size.height };
	},
	
	getOffset: function () {
		for (var i = 0; i < this.matrix.length; i++) {
			for (var j = 0; j < this.matrix[i].length; j++) {
				if (this.matrix[i][j]) {
					return { x: j, y: i };
				}
			}
		}
	},
	
	getColor: function () {
		return this.color;
	},
		
	drag: function (grabbed, moved, released) {
		var canvas = this.canvas;
		var self = this;
		var touchSupport = "createTouch" in document;
		
		var down = "mousedown";
		var move = "mousemove";
		var up = "mouseup";
		var target = document;
		
		if (touchSupport) {
			down = "touchstart";
			move = "touchmove";
			up = "touchend";
			target = canvas;
		}
		
		function _moved(event) {
			event.preventDefault();
			var dx, dy;
			
			if (touchSupport) {
				dx = event.targetTouches[0].pageX - self._startX;
			    dy = event.targetTouches[0].pageY - self._startY;
			} else {
				dx = event.pageX - self._startX;
				dy = event.pageY - self._startY;
			}
			
			moved(dx, dy);
		}
		
		function _released(event) {
			target.removeEventListener(move, _moved, false);
			target.removeEventListener(up, _released, false);
			released();
		}
		
		canvas.addEventListener(down, function (event) {
			event.preventDefault();
			grabbed();
			
			if (touchSupport) {
				self._startX = event.targetTouches[0].pageX;
			    self._startY = event.targetTouches[0].pageY;
			} else {
				self._startX = event.pageX;
				self._startY = event.pageY;
			}
			
			target.addEventListener(move, _moved, false);
			target.addEventListener(up, _released, false);
		});
	}	
};

function Boxed(playfieldElement) {
	this.container = playfieldElement;
	this.pieces = [];
	
	this.base = 0;
	this.multiplier = 1;
	
	if (this.container.offsetWidth < 480) {
		this.blockSize = 20;
	} else {
		this.blockSize = 40;
	}
	
	this.container.ontouchmove = function (event) {
		event.preventDefault();
	};

	this.resize($(this.container).width(), $(this.container).height());
}

Boxed.prototype = {
	
	_addToOccupationGrid: function (block) {
		var x = Math.floor(block.getPosition().x / this.blockSize);
		var y = Math.floor(block.getPosition().y / this.blockSize);
				
		var size = block.getSize();
		var blockIndex = this.pieces.indexOf(block);
		
		for (var i = 0; i < size.height; i++) {
			for (var j = 0; j < size.width; j++) {
				var xocc = x + j;
				var yocc = y + i;
				
				if (xocc < 0 || xocc >= this.gridWidth || yocc < 0 || yocc >= this.gridHeight) {
					continue; // out of bounds
				}
				
				if (block.matrix[i][j]) {
					this.occupationGrid[yocc][xocc] = blockIndex;
				}
			}
		}
	},
	
	_removeFromOccupationGrid: function (block) {
		var x = Math.floor(block.getPosition().x / this.blockSize);
		var y = Math.floor(block.getPosition().y / this.blockSize);
				
		var size = block.getSize();
		
		for (var i = 0; i < size.height; i++) {
			for (var j = 0; j < size.width; j++) {
				if (block.matrix[i][j]) {
					delete this.occupationGrid[y + i][x + j];
				}
			}
		}
	},
	
	_prepareOccupationGrid: function () {
		this.occupationGrid = [];
				
		for (var i = 0; i < this.gridHeight; i++) {
			this.occupationGrid[i] = [];
		}
		
		this.pieces.forEach(function (block) {
			this._addToOccupationGrid(block);
		}, this);
	},
	
	_compressBlocks: function () {
		var compressed = [];
				
		this.pieces.forEach(function (block) {
			this._removeFromOccupationGrid(block);
			compressed.push(block);
		}, this);
		
		this.pieces = compressed;
		
		this.pieces.forEach(function (block) {
			this._addToOccupationGrid(block);
		}, this);
	},
	
	_mergeBlocks: function (blocks) {
		var mergedMatrix = [];
		var topLeftCorner = { x: this.gridWidth, y: this.gridHeight };
		var bottomRightCorner = { x: 0, y: 0 };
		var i, j;
					
		blocks.forEach(function (object, index) {
			var block = this.pieces[index];
			var x = Math.floor(block.getPosition().x / this.blockSize);
			var y = Math.floor(block.getPosition().y / this.blockSize);
			
			topLeftCorner.x = Math.min(topLeftCorner.x, x);
			topLeftCorner.y = Math.min(topLeftCorner.y, y);
			
			bottomRightCorner.x = Math.max(bottomRightCorner.x, x + block.matrix[0].length);
			bottomRightCorner.y = Math.max(bottomRightCorner.y, y + block.matrix.length);
		}, this);	
		
		var matrixHeight = bottomRightCorner.y - topLeftCorner.y;
		var matrixWidth = bottomRightCorner.x - topLeftCorner.x;
		
		for (i = 0; i < matrixHeight; i++) {
			mergedMatrix[i] = [];
			for (j = 0; j < matrixWidth; j++) { mergedMatrix[i].push(0); }
		}
		
		blocks.forEach(function (object, index) {
			var block = this.pieces[index];
			var xoffset = Math.floor(block.getPosition().x / this.blockSize) - topLeftCorner.x;
			var yoffset = Math.floor(block.getPosition().y / this.blockSize) - topLeftCorner.y;
			
			for (var y = 0; y < block.matrix.length; y++) {
				for (var x = 0; x < block.matrix[y].length; x++) {
					if (block.matrix[y][x]) {
						mergedMatrix[yoffset + y][xoffset + x] = 1;
					}
				}
			}
			
			this.removeBlock(block);			
		}, this);
				
		return this.addBlock(mergedMatrix, topLeftCorner.x * this.blockSize, topLeftCorner.y * this.blockSize);
	},
	
	_shrinkBlock: function (block) {
		var height = block.matrix.length;
		var width = block.matrix[0].length;
		var shrunkenMatrix = [];
			
		for (var y = 0; y < height; y++) {
			if (y % 2 === 0) {
				shrunkenMatrix[y / 2] = [];
				
				for (var x = 0; x < width; x++) {
					if (x % 2 === 0) {
						shrunkenMatrix[y / 2][x / 2] = block.matrix[y][x];
					}
				}
			}
		}
				
		this.removeBlock(block);
		return this.addBlock(shrunkenMatrix, block.getPosition().x, block.getPosition().y, block.getColor());
	},
	
	_scanForSolutions: function () {
		
		var gridHeight = this.gridHeight;
		var occupationGrid = this.occupationGrid;
				
		function flatten(position) {
			return position.y * gridHeight + position.x;
		}
		
		function findBoundingBox(adjacents, bbox, visited, position) {
			visited.push(flatten(position));
			
			if (occupationGrid[position.y] !== undefined && occupationGrid[position.y][position.x] !== undefined) {
				adjacents[occupationGrid[position.y][position.x]] = true;
			} else {
				return;
			}
			
			bbox.min.x = Math.min(position.x, bbox.min.x);
			bbox.min.y = Math.min(position.y, bbox.min.y);
			bbox.max.x = Math.max(position.x, bbox.max.x);
			bbox.max.y = Math.max(position.y, bbox.max.y);
			
			var up = { x: position.x, y: position.y - 1 };
			var left = { x: position.x - 1, y: position.y };
			var right = { x: position.x + 1, y: position.y };
			var down = { x: position.x, y: position.y + 1 };
			
			if (visited.indexOf(flatten(up)) < 0) { findBoundingBox(adjacents, bbox, visited, up); }
			if (visited.indexOf(flatten(left)) < 0) { findBoundingBox(adjacents, bbox, visited, left); }
			if (visited.indexOf(flatten(right)) < 0) { findBoundingBox(adjacents, bbox, visited, right); }
			if (visited.indexOf(flatten(down)) < 0) { findBoundingBox(adjacents, bbox, visited, down); }
		}
		
		function scanRange(blocks, start, end, direction) {
			var x = start.x;
			var y = start.y;
			var consecutive = 0;
			var prev = blocks[occupationGrid[y][x]];
			
			
			do {
				if (prev === blocks[occupationGrid[y][x]]) {
					consecutive++;
				} else {
					if (consecutive % 2 === 0) {
						consecutive = 1;
						prev = blocks[occupationGrid[y][x]];
					} else {
						return false;
					}
				}
				
				if (direction === 'horizontal') {
					x += 1;
				} else {
					y += 1;
				}
				
			} while (x <= end.x && y <= end.y);
			
			return consecutive % 2 === 0;
		}
		
		function scanBoundingBox(blocks, bbox) {
			var width = bbox.max.x - bbox.min.x;
			var height = bbox.max.y - bbox.min.y;

			for (var y = 0; y <= height; y++) {
				if (!scanRange(blocks, { x: bbox.min.x, y: bbox.min.y + y }, { x: bbox.max.x, y: bbox.min.y + y }, 'horizontal')) {
					return false;
				}
			}

			for (var x = 0; x <= width; x++) {
				if (!scanRange(blocks, { x: bbox.min.x + x, y: bbox.min.y }, { x: bbox.min.x + x, y: bbox.max.y }, 'vertical')) {
					return false;
				}
			}
			
			return true;
		}
		
		var solutions = [];
		var queue = this.pieces.map(function (value, index) { return index; });

		while(queue.length > 0) {
			var block = this.pieces[queue.pop()];
			var adjacentBlocks = [];
			
			var x = Math.floor(block.getPosition().x / this.blockSize);
			var y = Math.floor(block.getPosition().y / this.blockSize);

			var blockOffset = block.getOffset();

			x += blockOffset.x;
			y += blockOffset.y;
			
			var bbox = { min: { x: x, y: y}, max: { x: x, y: y } };
			findBoundingBox(adjacentBlocks, bbox, [], bbox.min);
			
			queue = queue.filter(function (index) {
				return adjacentBlocks[index] ? false : true;
			});
			
			if (scanBoundingBox(adjacentBlocks, bbox)) {
				solutions.push(adjacentBlocks);
			}
		}
							
		return solutions;
	},
		
	_resolveBorderConstraints: function (dimensions, position) {
		var resolution = { x: 0, y: 0 };
		resolution.x = position.x < 0 ? 0 : position.x;
		resolution.y = position.y < 0 ? 0 : position.y;
		
		resolution.x = Math.min(resolution.x, this.containerWidth - dimensions.width);
		resolution.y = Math.min(resolution.y, this.containerHeight - dimensions.height);
		
		return { x: resolution.x - position.x, y: resolution.y - position.y };
	},
	
	_resolveCollisions: function (block, delta) {
		var position = { x: block.getPosition().x + delta.x, y: block.getPosition().y + delta.y };
		var dimensions = block.getDimensions();
		var resolution = { x: delta.x , y: delta.y };
		
		var borderResolution = this._resolveBorderConstraints(dimensions, position);
						
		this.pieces.forEach(function (otherBlock) {
			var otherPosition = otherBlock.getPosition();
			var otherDimensions = otherBlock.getDimensions();
			
			if (block != otherBlock && boundingBoxTest(position, dimensions, otherPosition, otherDimensions)) {
				var collisionResolution = getBlockCollisionResolution(position, block.matrix, otherPosition, otherBlock.matrix, delta, this.blockSize);
				
				if (collisionResolution.x != 0 || collisionResolution.y != 0) {
					var blockResolution = this._resolveCollisions(otherBlock, collisionResolution);
										
					if (collisionResolution.x != 0) {
						var a = delta.x - (collisionResolution.x - blockResolution.x);
						if (Math.abs(a) < Math.abs(resolution.x)) {
							resolution.x = a;	
						}
					}
					if (collisionResolution.y != 0) {
						var b = delta.y - (collisionResolution.y - blockResolution.y);
						if (Math.abs(b) < Math.abs(resolution.y)) {
							resolution.y = b;
						}
					}
				}
			}
		}, this);
		
		if (Math.abs(borderResolution.x) > 0) {
			resolution.x = delta.x + borderResolution.x;
		}
		
		if (Math.abs(borderResolution.y) > 0) {
			resolution.y = delta.y + borderResolution.y;
		}
		
		return resolution;
	},
	
	_moveBlockTo: function(block, delta) {
		var oldPosition = block.getPosition();
		var newPosition = { x: oldPosition.x + delta.x, y: oldPosition.y + delta.y };
		block.setPosition(newPosition.x, newPosition.y);
		
		this.pieces.forEach(function (anotherBlock) {
			var anotherPosition = anotherBlock.getPosition();
			var anotherSize = anotherBlock.getDimensions();
			
			if (block != anotherBlock && boundingBoxTest(block.getPosition(), block.getDimensions(), anotherPosition, anotherSize)) {
				var collisionResolution = getBlockCollisionResolution(block.getPosition(), block.matrix, anotherPosition, anotherBlock.matrix, delta, this.blockSize);
				if (collisionResolution.x != 0 || collisionResolution.y != 0) {
					this._moveBlockTo(anotherBlock, collisionResolution);
				}
			}
		}, this);
	},
			
	_alignBlockToGrid: function (block, callback) {
		var blockSize = this.blockSize;
		var position = block.getPosition();

		var xoffset = position.x.mod(blockSize);
		var yoffset = position.y.mod(blockSize);

		var correction = { x: 0, y: 0 };
		correction.x += xoffset < blockSize / 2 ? -xoffset : (blockSize - xoffset);
		correction.y += yoffset < blockSize / 2 ? -yoffset : (blockSize - yoffset);
			
		block.setPositionAnimated(position.x + correction.x,
								  position.y + correction.y, callback);
	},
			 
	resize: function (width, height) {		
		this.occupationGrid = [];
		this.containerWidth = width;
		this.containerHeight = height;
		this.gridHeight = Math.ceil(height / this.blockSize);
		this.gridWidth =  Math.ceil(width / this.blockSize);
		
		for (var i = 0; i < this.gridHeight; i++) {
			this.occupationGrid[i] = [];
		}
	},
		
	addBlock: function (shape, x, y, color) {
		var block = new Block(this.container, shape, this.blockSize, color);
		block.setPosition(x, y);
		this.pieces.push(block);
		
		block.drag(this.grabbed.curry(block).bindScope(this),
				   this.moved.curry(block).bindScope(this),
				   this.released.curry(block).bindScope(this));
				
		this._alignBlockToGrid(block);
				
		return block;
	},
	
	removeBlock: function (block) {
		delete this.pieces[this.pieces.indexOf(block)];
		this.container.removeChild(block.canvas);
	},
	
	layoutBlocks: function(shapes) {
		var x = 1;
		var y = 1;
		var rowHeight = 0;
		
		shapes.forEach(function (shape) {
			var matrix = shape;
			var width = matrix[0].length;
			var height = matrix.length;
			
			if (x + width + 1> this.gridWidth) {
				y += rowHeight + 1;
				rowHeight = 0;
				x = 1;
			}
			
			this.addBlock(matrix, x * this.blockSize, y * this.blockSize);
			rowHeight = Math.max(rowHeight, height);
			x += width + 1;
		}, this);
	},

	play: function (puzzleIndex, reset) {	
		this.pieces.forEach(function (block) {
			this.removeBlock(block);
		}, this);
		
		this.pieces = [];
		this.layoutBlocks(puzzles[puzzleIndex-1].puzzle);
		
		if (!reset) {
			$(this).trigger('boxed.began', [puzzles[puzzleIndex-1]]);
		} else {
			$(this).trigger('boxed.reset', [puzzles[puzzleIndex-1]]);
		}
	},
	
	began: function (callback) {
		$(this).bind('boxed.began', callback);
	},

	solved: function (callback) {
		$(this).bind('boxed.solved', callback);
	},

	grabbed: function (block) {
		block.canvas.style.webkitTransition = '';
		block.initialPosition = block.getPosition();
		block.lastPosition = block.getPosition();
		block.ddx = 0;
		block.ddy = 0;
	},
	
	moved: function (block, dx, dy) {
		block.lastPosition = block.getPosition();
		
		var xdelta = (dx - block.ddx);
		var ydelta = (dy - block.ddy);
				
		var x = block.lastPosition.x + xdelta;
		var y = block.lastPosition.y + ydelta;
								
		block.ddx = dx;
		block.ddy = dy;
		
		var blockSize = this.blockSize / 2;
		
		var major = Math.max(Math.abs(xdelta), Math.abs(ydelta));
		if (major > blockSize) {
			var steps = Math.ceil(major / blockSize);						
			var xstep = xdelta > 0 ? Math.floor(xdelta / steps) : Math.ceil(xdelta / steps);
			var ystep = ydelta > 0 ? Math.floor(ydelta / steps) : Math.ceil(ydelta / steps);
			var xrest = xdelta - xstep * steps;
			var yrest = ydelta - ystep * steps;
						
			for (var step = 1; step <= steps; step++) {
				var delta = { x: xstep, y: ystep };
				var resolution = this._resolveCollisions(block, delta);
				if (resolution.x != 0 || resolution.y != 0) {
					this._moveBlockTo(block, resolution);
				} else {
					return;
				}
			}
			
			var resolution = this._resolveCollisions(block, { x: xrest, y: yrest });
			if (resolution.x != 0 || resolution.y != 0) {
				this._moveBlockTo(block, resolution);
			}
		} else {
			this._moveBlockTo(block, this._resolveCollisions(block, { x: xdelta, y: ydelta }));
		}
	},
	
	released: function (block) {
		var alignedCounter = 0;
		var blockSize = this.blockSize;
		var position = block.getPosition();

		var xoffset = position.x.mod(blockSize);
		var yoffset = position.y.mod(blockSize);

		var correction = { x: 0, y: 0 };
		correction.x += xoffset < blockSize / 2 ? -xoffset : (blockSize - xoffset);
		correction.y += yoffset < blockSize / 2 ? -yoffset : (blockSize - yoffset);
		
		var self = this;
								
		function mergeAndShrinkSolutions() {
			self._prepareOccupationGrid();
			var solutions = self._scanForSolutions();
			
			solutions.forEach(function (solution) {
				var merged = self._mergeBlocks(solution);
				
				setTimeout(function() {
					// wait until the canvas element is initialized
					merged.canvas.style.webkitTransformOrigin = "left top";
					merged.pushTransformAnimated('scale(0.5)', '0.3s ease-in', function () {
						self._shrinkBlock(merged);
						self._compressBlocks();
						mergeAndShrinkSolutions();
					});
				}, 100);
			});
			
			if (self.pieces.length == 1) {
				// puzzle is complete
				$(self).trigger('boxed.solved');
			}
		}
		
		function blocksAlignedJoin() {
			alignedCounter++;
			if (alignedCounter == self.pieces.length) {
				mergeAndShrinkSolutions();
			}
		}
				
		this.pieces.forEach(function (block) {
			this._alignBlockToGrid(block, blocksAlignedJoin);
		}, this);
	}
};

function ProgressRecorder(dialog, menuButton, resetButton, boxed) {
	this.dialog = dialog;
	this.boxed = boxed;
	
	var puzzle;
	
	$(dialog).find('.puzzle-button').each(function () {
		if (localStorage.getItem($(this).attr('href'))) {
			$(this).addClass("solved");
		}
	});
	
	$(dialog).find('.puzzle-button').click(function(event) {
		event.preventDefault();
		puzzle = $(this).attr('href').substring("puzzle/".length);
		boxed.play(puzzle);
		$(dialog).hide();
	});
	
	$(menuButton).click(function (event) {		
		if (puzzle) {
			// toggle menu on/off if a puzzle has been loaded
			$(dialog).toggle();
		}
	});
	
	$(resetButton).click(function (event) {
		if (puzzle) {
			boxed.play(puzzle, true);
		}
	});
	
	boxed.solved(function () {
		$(dialog).find('.puzzle-button[href="puzzle/' + puzzle + '"]').addClass("solved");
		$(dialog).show();
		localStorage.setItem('puzzle/' + puzzle, true);
		puzzle = null;
	});
}

function PuzzleTipster(dialog, boxed) {
		
	$(dialog).click(function (event) {
		$(dialog).toggleClass('hidden', true);
	});
	
	boxed.began(function (event, puzzle) {
		$(dialog).find('#message').html(puzzle.tip);
		$(dialog).toggleClass('hidden', false);
	});
	
	boxed.solved(function () {
		$(dialog).toggleClass('hidden', true);
	});
}
