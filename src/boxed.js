function boundingBoxTest(box1, box2) {
	var xdelta = box1.x - box2.x;
	var ydelta = box1.y - box2.y;

	if (xdelta > 0) {
		if (box2.width < xdelta) {
			return false;
		}
	} else {
		if (-box1.width > xdelta) {
			return false;
		}
	}
	
	if (ydelta > 0) {
		if (box2.height < ydelta) {
			return false;
		}
	} else {
		if (-box1.height > ydelta) {
			return false;
		}
	}

	return true;
}

function getBlockCollisionResolution(block1, block2, blockSize) {
	var bbox1 = block1.getBBox();
	var bbox2 = block2.getBBox();
	
	var xdelta = bbox1.x - bbox2.x;
	var ydelta = bbox1.y - bbox2.y;
		
	var xoffset =  blockSize - xdelta.mod(blockSize);
	var yoffset =  blockSize - ydelta.mod(blockSize);
	var rxoffset = blockSize - xoffset;
	var ryoffset = blockSize - yoffset;
		
	var width1 = block1.matrix[0].length;
	var height1 = block1.matrix.length;
	
	var width2 = block2.matrix[0].length;
	var height2 = block2.matrix.length;
		
	var m = xdelta / blockSize;
	var n = ydelta / blockSize;
		
	function check(x, y) {
		if (x >= 0 && x < width2 && y >= 0 && y < height2) {
			return block2.matrix[y][x];
		}
		return 0;
	}
	
	var resolution = { x: 0, y: 0 };
	var max = 0;
		
	for (var i = 0; i < width1; i++) {
		for (var j = 0; j < height1; j++) {
			
			if (!block1.matrix[j][i]) {
				continue;
			}
			
			var s = Math.floor(i + m);
			var t = Math.floor(j + n);
						
			var a = check(s, t);
			var b = check(s + 1, t);
			var c = check(s, t + 1);
			var d = check(s + 1, t + 1);
			
			/*
			if (a || b || c || d) {
				console.log("a: " + a);
				console.log("b: " + b);
				console.log("c: " + c);
				console.log("d: " + d);
				console.log("---");
			} */
						
			if (a + b + c + d == 1) {
				if (a) {
					if (xoffset < yoffset) {
						resolution.x = xoffset;
					} else {
						resolution.y = yoffset;
					}
				} else
				if (b) {
					if (rxoffset < yoffset) {
						resolution.x = -rxoffset;
					} else {
						resolution.y = yoffset;
					}
				} else
				if (c) {
					if (xoffset < ryoffset) {
						resolution.x = xoffset
					} else {
						resolution.y = -ryoffset;
					}
				} else {
					if (rxoffset < ryoffset) {
						resolution.x = -rxoffset;
					} else {
						resolution.y = -ryoffset;
					}
				}
			}
			else {
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
		
	return resolution;
}

Transforms = {
	
	translate3d: function (x, y) {
		return ['translate3d(', x, 'px,', y, 'px,', '0px)'].join('');
	}
}

Number.prototype.mod = function(n) {
	return ((this % n) + n) % n;
}

Function.prototype.curry = function() {
	var fn = this, args = Array.prototype.slice.call(arguments);
	return function() {
		return fn.apply(this, args.concat(Array.prototype.slice.call(arguments)));
	};
}

Function.prototype.bindScope = function(scope) {
	var fn = this;
	return function() {
		return fn.apply(scope, arguments);
	};
}

function Boxed(containerElement) {
	this.container = containerElement;
	this.pieces = [];
	
	if (containerElement.offsetWidth < 480) {
		this.blockSize = 20;
	} else {
		this.blockSize = 40;
	}
	this.resize(containerElement.offsetWidth, containerElement.offsetHeight);
	
	this.spawnBlock();
	this.spawnBlock();
	this.spawnBlock();
}

Boxed.prototype = {
	
	_addToOccupationGrid: function (block) {
		var position = block.getPosition();
		var x = Math.floor(block.getPosition().x / this.blockSize);
		var y = Math.floor(block.getPosition().y / this.blockSize);
		
		var xlen = block.matrix.length;
		var ylen = block.matrix[0].length;
		
		var blockIndex = this.pieces.indexOf(block);
		
		for (var i = 0; i < ylen; i++) {
			for (var j = 0; j < xlen; j++) {
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
		var position = block.getPosition();
		var x = Math.floor(block.getPosition().x / this.blockSize);
		var y = Math.floor(block.getPosition().y / this.blockSize);
		
		var xlen = block.matrix.length;
		var ylen = block.matrix[0].length;
		
		for (var i = 0; i < ylen; i++) {
			for (var j = 0; j < xlen; j++) {
				if (block.matrix[i][j]) {
					delete this.occupationGrid[y + i][x + j];
				}
			}
		}
	},
	
	_prepareOccupationGrid: function () {
		this.occupationGrid = [];
		
		for (var i = 0; i < this.gridHeight; i++) {
			this.occupationGrid[i] = new Array();
		}
		
		for (var i in this.pieces) {
			this._addToOccupationGrid(this.pieces[i]);
		}
	},
	
	_compressBlocks: function () {
		var compressed = [];
		
		for (var i in this.pieces) {
			var block = this.pieces[i];
			this._removeFromOccupationGrid(block);
			compressed.push(block);
		}
		
		this.pieces = compressed;
		
		for (var i in this.pieces) {
			var block = this.pieces[i];
			this._addToOccupationGrid(block);
		}
	},
	
	_mergeBlocks: function (blocks) {		
		var mergedMatrix = [];
		
		var topLeftCorner = { x: this.gridWidth, y: this.gridHeight };
		var bottomRightCorner = { x: 0, y: 0 };
		
		for (var i in blocks) {
			var block = this.pieces[i];
			
			var x = Math.floor(block.getPosition().x / this.blockSize);
			var y = Math.floor(block.getPosition().y / this.blockSize);
			
			topLeftCorner.x = Math.min(topLeftCorner.x, x);
			topLeftCorner.y = Math.min(topLeftCorner.y, y);
			
			bottomRightCorner.x = Math.max(bottomRightCorner.x, x + block.matrix[0].length);
			bottomRightCorner.y = Math.max(bottomRightCorner.y, y + block.matrix.length);
		}
		
		var matrixHeight = bottomRightCorner.y - topLeftCorner.y;
		for (var i = 0; i < matrixHeight; i++) {
			mergedMatrix[i] = new Array();
		}
		
		for (var i in blocks) {
			var block = this.pieces[i];
			
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
		}
		
		return this.addBlock(mergedMatrix, topLeftCorner.x * this.blockSize, topLeftCorner.y * this.blockSize);
	},
	
	_shrinkBlock: function(block) {
		var matrixHeight = block.matrix.length;
		
		var shrunkenMatrix = [];
		for (var i = 0; i < matrixHeight / 2; i++) {
			shrunkenMatrix[i] = new Array();
		}

		for (var y in block.matrix) {
			for (var x in block.matrix[y]) {
				if (!(x % 2 || y % 2)) {
					shrunkenMatrix[y / 2][x / 2] = 1;
				}
			}
		}
		
		this.removeBlock(block);
		return this.addBlock(shrunkenMatrix, block.getPosition().x, block.getPosition().y);
	},
	
	_scanForSolutions: function(block) {
		
		var x = Math.floor(block.getPosition().x / this.blockSize);
		var y = Math.floor(block.getPosition().y / this.blockSize);
		
		var blockOffset = block.getOffset();
		
		x += blockOffset.x;
		y += blockOffset.y;
						
		console.log(['x: ', x, ' y: ', y].join(''));
		
		var occupationGrid = this.occupationGrid;
		blocksInSolution = [];
		
		var findRange = function (x, y) {
			if (occupationGrid[y] == undefined || occupationGrid[y][x] == undefined) {
				return null;
			}
						
			var max = x;
			while (occupationGrid[y][max+1] != undefined) {
				blocksInSolution[occupationGrid[y][max+1]] = true;
				max++;
			}
			
			var min = x;
			while (occupationGrid[y][min-1] != undefined) {
				blocksInSolution[occupationGrid[y][min-1]] = true;
				min--;
			}
			
			return { min: min, max: max};
		}
		
		var rangeIsEmpty = function (y, range) {
			var nonEmpty = false;
			for (var x = range.min; x <= range.max; x++) {
				nonEmpty = nonEmpty || (occupationGrid[y][x] != undefined);
			}
			return !nonEmpty;
		}
		
		var scanLine = function(baseRange, x, y) {
			var range = findRange(x, y);
			
			if (range == null) {
				if (rangeIsEmpty(y, baseRange)) {
					return 1
				} else {
					return -1;
				}
			} else if (range.min != baseRange.min || range.max != baseRange.max) {
				return -1;	
			} else {
				return 0;
			}
		}
		
		var baseRange = findRange(x, y);
		console.log(["baserange(", baseRange.min, ', ', baseRange.max, ')'].join(''));
		
		if ((baseRange.max - baseRange.min + 1) % 2 != 0) {
			console.log("odd base range");
			return null;
		}
		
		var max = y;
		var valid;
		while ((valid = scanLine(baseRange, x, max)) == 0) {
			max++;
		}
		
		if (valid < 0) { return null; }
		
		var min = y;
		while ((valid = scanLine(baseRange, x, min)) == 0) {
			min--;
		}
		
		if (valid < 0) { return null; }
		
		console.log("y diff: " + (max - min));
		
		if ((max - min - 2) % 2 == 0) { return null; }
					
		return blocksInSolution;
	},
	
	_applyBorderConstraints: function (block) {
		var position = block.getPosition();
		var bbox = block.getBBox();
		
		position.x = position.x < 0 ? 0 : position.x;
		position.y = position.y < 0 ? 0 : position.y;
		
		position.x = Math.min(position.x, this.container.offsetWidth - bbox.width);
		position.y = Math.min(position.y, this.container.offsetHeight - bbox.height);
		
		block.setPosition(position.x, position.y);
	},
		
	_resolveConflicts: function (block) {
		this._applyBorderConstraints(block);

		var queue = [];				
		for (i in this.pieces) {
			var anotherBlock = this.pieces[i];

			if (block != anotherBlock) {
				if (boundingBoxTest(block.getBBox(), anotherBlock.getBBox())) {
					resolution = getBlockCollisionResolution(block, anotherBlock, this.blockSize);
					if (resolution.x != 0 || resolution.y != 0) {
						anotherBlock.setPosition(anotherBlock.getPosition().x - resolution.x, anotherBlock.getPosition().y - resolution.y);
						queue.push(anotherBlock);
					}
				}
			}
		}
		
		while (queue.length > 0) {
			this._resolveConflicts(queue.shift());
		}
	},
	
	_alignBlockToGrid: function (block, callback) {
		var blockSize = this.blockSize
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
		this.gridHeight = Math.ceil(height / this.blockSize);
		this.gridWidth =  Math.ceil(width / this.blockSize);
		
		for (var i = 0; i < this.gridHeight; i++) {
			this.occupationGrid[i] = new Array();
		}
	},
		
	addBlock: function (shape, x, y) {
		var block = new Block(this.container, shape, this.blockSize);
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
	
	
	spawnBlock: function() {
		//var randomShape = Shapes[Math.floor(Math.random() * Shapes.length)];
		var nextShape = Shapes[progress.shift()];
		var randomGridHeight = Math.floor(Math.random() * this.gridHeight) * this.blockSize;
		
		var randomBlock = this.addBlock(nextShape, 0, randomGridHeight)
		setTimeout(function() {
			randomBlock.setPositionAnimated(100, randomGridHeight);
		}, 100);
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

		var x = block.lastPosition.x + (dx - block.ddx);
		var y = block.lastPosition.y + (dy - block.ddy);
		
		block.ddx = dx;
		block.ddy = dy;
		block.setPosition(x, y);
		this._resolveConflicts(block);
	},
	
	released: function (block) {
		var blockSize = this.blockSize
		var position = block.getPosition();

		var xoffset = position.x.mod(blockSize);
		var yoffset = position.y.mod(blockSize);

		var correction = { x: 0, y: 0 };
		correction.x += xoffset < blockSize / 2 ? -xoffset : (blockSize - xoffset);
		correction.y += yoffset < blockSize / 2 ? -yoffset : (blockSize - yoffset);
		
		var self = this;
		
		function lookForSolution(block) {
			self._prepareOccupationGrid();
			
			var solution = self._scanForSolutions(block);
			if (solution) {
				var merged = self._mergeBlocks(solution);
				
				setTimeout(function() {
					// wait until the canvas element is initialized
					merged.canvas.style.webkitTransformOrigin = "left top";
					merged.pushTransformAnimated('scale(0.5)', '0.3s ease-in', function () {
						var shrunken = self._shrinkBlock(merged);
						lookForSolution(shrunken);
						self._compressBlocks();
						self.spawnBlock();
					});
				}, 100);
			}
		}
						
		function whenAlignedToGrid() {
			lookForSolution(block);
		}
		
		
		var blocks = this.pieces;
		var alignedCounter = 0;
		
		for (var i in blocks) {
			this._alignBlockToGrid(blocks[i], function () {
				alignedCounter++;
				if (alignedCounter == blocks.length) {
					whenAlignedToGrid.bindScope(this)();
				}
			});
		}							  	  
	}
	
};


function Block(container, matrix, blockSize) {
	this.matrix = matrix;
	this._size = this._calculateSize(matrix, blockSize);
	this.canvas = container.appendChild(this._createCanvas(this._size.width, this._size.height));
	this.ctx = this.canvas.getContext("2d");
	this._render(this.ctx, matrix, blockSize);
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
	
	_render: function (ctx, matrix, blockSize) {
		var lookup = [
			{ x:  1, y:  0 },
			{ x:  0, y:  1 },
			{ x: -1, y:  0 },
			{ x:  0, y: -1 },
		];

		var rotateLeft = function(vector) {
			for (var i = 0; i < 4; i++) {
				if (lookup[i].x == vector.x && lookup[i].y == vector.y) {
					return lookup[(4+i-1) % 4];
				}				
			}
		}

		var rotateRight = function(vector) {
			for (var i = 0; i < 4; i++) {
				if (lookup[i].x == vector.x && lookup[i].y == vector.y) {
					return lookup[(4+i+1) % 4];
				}				
			}
		}

		var translate = function (point, vector) {
			return { x: point.x + vector.x, y: point.y + vector.y };
		}

		var isEqual = function (vector1, vector2) {
			return vector1.x == vector2.x && vector1.y == vector2.y;
		}

		var get = function (x, y) {
			var row = matrix[y];
			return row ? row[x] : null;
		}
		
		// find first active block	
		var start = this.getOffset();

		var turns = 0;
		var direction = {x: 1, y: 0 };
		var position = start;
		var pointer = { x: position.x * blockSize, y: position.y * blockSize };
		pointer = translate(pointer, { x: direction.x * blockSize, y: direction.y * blockSize });

		var r = Math.floor(Math.random() * 255);
		var g = Math.floor(Math.random() * 255);
		var b = Math.floor(Math.random() * 255);
		
		ctx.fillStyle = "rgb(" + [r ,g, b].join(',') + ")";
		ctx.beginPath();
		ctx.moveTo(pointer.x, pointer.y);
		
		var lineTo = function (dx, dy) {
			pointer = translate(pointer, { x: dx, y: dy });
			ctx.lineTo(pointer.x, pointer.y);
		}

		do {
			var ff = translate(position, direction);
			var rr = translate(position, rotateLeft(direction));
			var fr = translate(ff, rotateLeft(direction));

			var ffValue = get(ff.x, ff.y);
			var rrValue = get(rr.x, rr.y);
			var frValue = get(fr.x, fr.y);

			if (rrValue && turns == 0) {
				// turn right
				direction = rotateLeft(direction);
				turns++;
			} else 
			if (ffValue) {
				// go forward
				position = ff;
				turns = 0;
				if (!frValue) {
					lineTo(direction.x * blockSize, direction.y * blockSize);
				}
			} else {
				// turn left
				direction = rotateRight(direction);
				lineTo(direction.x * blockSize, direction.y * blockSize);
				turns++;
			}

		} while (!(isEqual(position, start) && isEqual(direction, { x: 1, y: 0 })));

		ctx.closePath();
		ctx.fill();
	},
	
	_calculateSize: function(matrix, blockSize) {
		return { width: matrix[0].length * blockSize, height: matrix.length * blockSize };
	},
		
	pushTransformAnimated: function (transform, transition, callback) {
		
		var transitionEnd = function () {
			this.removeEventListener('webkitTransitionEnd', transitionEnd, false);
			if (callback) { callback(); };
		}
				
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
	
	getBBox: function() {
		return { x: this._x, y: this._y, width: this._size.width, height: this._size.height };
	},
	
	getOffset: function() {
		for (var i = 0; i < this.matrix.length; i++) {
			for (var j = 0; j < this.matrix[i].length; j++) {
				if (this.matrix[i][j]) {
					return { x: j, y: i };
				}
			}
		}
	},
		
	drag: function(grabbed, moved, released) {		
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
			
			if (touchSupport) {
				var dx = event.targetTouches[0].pageX - self._startX;
			    var dy = event.targetTouches[0].pageY - self._startY;
			} else {
				var dx = event.pageX - self._startX;
				var dy = event.pageY - self._startY;
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
}

var Shapes = {
	
	tee:
	[[0, 1, 1, 0],
	 [0, 1, 1, 0],
	 [1, 1, 1, 1],
	 [1, 1, 1, 1]],
	
	left_corner:	
	[[1, 0, 0, 0],
	 [1, 1, 0, 0],
	 [1, 1, 1, 0],
	 [1, 1, 1, 1]],
	
	right_corner:
	[[1, 1, 1],
	 [0, 1, 1],
	 [0, 0, 1]],
	
	diagonal:	
	[[1, 0, 0, 0],
	 [1, 1, 1, 0],
	 [0, 0, 1, 0],
	 [0, 0, 1, 1]],
	
	dot:	
	[[1]],
	
	line:
	[[1],
	 [1],
	 [1],
	 [1]]
		
};

var progress = ["left_corner", "right_corner", "dot", "dot", "dot", "dot", "diagonal", "line", "line", "dot", "dot"];