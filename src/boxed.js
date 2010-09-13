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
		
	var size1 = block1.getSize();
	var size2 = block2.getSize();
			
	var m = xdelta / blockSize;
	var n = ydelta / blockSize;
		
	function check(x, y) {
		if (x >= 0 && x < size2.width && y >= 0 && y < size2.height) {
			return block2.matrix[y][x];
		}
		return 0;
	}
	
	var resolution = { x: 0, y: 0 };
	var max = 0;
		
	for (var i = 0; i < size1.width; i++) {
		for (var j = 0; j < size1.height; j++) {
			
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

function Boxed(playfieldElement, scoreboardElement) {
	this.container = playfieldElement;
	this.scoreboard = scoreboardElement;
	this.pieces = [];
	
	this.score = 0;
	this.base = 0;
	this.multiplier = 1;
	
	if (this.container.offsetWidth < 480) {
		this.blockSize = 20;
	} else {
		this.blockSize = 40;
	}

	this._initializeScoring();
	this.resize(this.container.offsetWidth, this.container.offsetHeight);
}

Boxed.prototype = {
	
	_addToOccupationGrid: function (block) {
		var position = block.getPosition();
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
		var position = block.getPosition();
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
		var matrixWidth = bottomRightCorner.x - topLeftCorner.x;
		for (var i = 0; i < matrixHeight; i++) {
			mergedMatrix[i] = new Array();
			for (var j = 0; j < matrixWidth; j++) { mergedMatrix[i].push(0) };
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
	
	_shrinkBlock: function (block) {
		var matrixHeight = block.matrix.length;
		
		var shrunkenMatrix = [];
		for (var i = 0; i < matrixHeight / 2; i++) {
			shrunkenMatrix[i] = new Array();
		}

		for (var y in block.matrix) {
			for (var x in block.matrix[y]) {
				if (!(x % 2 || y % 2)) {
					shrunkenMatrix[y / 2][x / 2] = block.matrix[y][x];
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
			visited.push(flatten(position))
			
			if (occupationGrid[position.y] != undefined && occupationGrid[position.y][position.x] != undefined)
				adjacents[occupationGrid[position.y][position.x]] = true;
			else
				return;
			
			bbox.min.x = Math.min(position.x, bbox.min.x);
			bbox.min.y = Math.min(position.y, bbox.min.y);
			bbox.max.x = Math.max(position.x, bbox.max.x);
			bbox.max.y = Math.max(position.y, bbox.max.y);
			
			var up = { x: position.x, y: position.y - 1 };
			var left = { x: position.x - 1, y: position.y };
			var right = { x: position.x + 1, y: position.y };
			var down = { x: position.x, y: position.y + 1 };
			
			if (visited.indexOf(flatten(up)) < 0)
				findBoundingBox(adjacents, bbox, visited, up);
			if (visited.indexOf(flatten(left)) < 0)
				findBoundingBox(adjacents, bbox, visited, left);
			if (visited.indexOf(flatten(right)) < 0)
				findBoundingBox(adjacents, bbox, visited, right);
			if (visited.indexOf(flatten(down)) < 0)
				findBoundingBox(adjacents, bbox, visited, down);		
		}
		
		function scanRange(blocks, start, end, direction) {
			var consecutive = 0;
			var x = start.x;
			var y = start.y;
			
			do {
				if (blocks[occupationGrid[y][x]]) {
					consecutive++;
				} else {
					if (consecutive % 2 == 0)
						consecutive = 0;
					else
						return false;
				}
				
				if (direction == 'horizontal')
					x += 1;
				else
					y += 1;
				
			} while (x <= end.x && y <= end.y);
			
			return consecutive % 2 == 0;
		}
		
		function scanBoundingBox(blocks, bbox) {
			var width = bbox.max.x - bbox.min.x;
			var height = bbox.max.y - bbox.min.y;

			for (var y = 0; y <= height; y++) {
				if (!scanRange(blocks, { x: bbox.min.x, y: bbox.min.y + y }, { x: bbox.max.x, y: bbox.min.y + y }, 'horizontal'))
					return false;
			}

			for (var x = 0; x <= width; x++) {
				if (!scanRange(blocks, { x: bbox.min.x + x, y: bbox.min.y }, { x: bbox.min.x + x, y: bbox.max.y }, 'vertical'))
					return false;
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
		
	_initializeScoring: function ()	{
		$(this.scoreboard).append('<span class="score" id="score-total">0</span>');
	},
		
	addScore: function (base, multiplier) {
		var self = this;
		var baseE = $(document.createElement('span')).addClass('score score-base').html(base);
		var multiplierE = $(document.createElement('span')).addClass('score score-multiplier').html(multiplier);
		
		$(this.scoreboard).append(baseE);
		$(this.scoreboard).append(multiplierE);
		
		setTimeout(function () {
			baseE.remove();
			multiplierE.remove();
			self.score += base * multiplier
			$('#score-total').html(self.score);
		}, 1000);
	},
		 
	resize: function (width, height) {
		this.occupationGrid = [];
		this.gridHeight = Math.ceil(height / this.blockSize);
		this.gridWidth =  Math.ceil(width / this.blockSize);
		
		for (var i = 0; i < this.gridHeight; i++) {
			this.occupationGrid[i] = new Array();
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
			var matrix = Shapes[shape];
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

	play: function (puzzleIndex) {
		console.log("playing " + puzzleIndex);
		
		this.pieces.forEach(function (block) {
			this.removeBlock(block);
		}, this);
		
		this.pieces = [];
		this.layoutBlocks(puzzles[puzzleIndex-1].puzzle);
		$('#message').html(puzzles[puzzleIndex-1].tip);
		$('#message').toggleClass('hidden-message', false);
		
		setTimeout(function () {
			$('#message').toggleClass('hidden-message', true);
		}, 10000);
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
								
		function mergeAndShrinkSolutions() {
			self._prepareOccupationGrid();
			var solutions = self._scanForSolutions();
			
			solutions.forEach(function (solution) {
				var merged = self._mergeBlocks(solution);
				self.addScore(200, 2);
				
				setTimeout(function() {
					// wait until the canvas element is initialized
					merged.canvas.style.webkitTransformOrigin = "left top";
					merged.pushTransformAnimated('scale(0.5)', '0.3s ease-in', function () {
						var shrunken = self._shrinkBlock(merged);
						self._compressBlocks();
						mergeAndShrinkSolutions();
					});
				}, 100);
			});
			
			if (self.pieces.length == 1) {
				// puzzle is complete
				console.log("puzzle solved!");
				$(self).trigger('boxed.solved');
			}
		}
		
		var blocks = this.pieces;
		var alignedCounter = 0;
		
		for (var i in blocks) {
			this._alignBlockToGrid(blocks[i], function () {
				alignedCounter++;
				if (alignedCounter == blocks.length) {
					mergeAndShrinkSolutions();
				}
			});
		}							  	  
	}
	
};

function ProgressRecorder(dialog, boxed) {
	this.dialog = dialog;
	this.boxed = boxed;
	
	var puzzle;
	
	$(dialog).find('.puzzle-selection-button').each(function () {
		if (localStorage.getItem($(this).attr('href'))) {
			$(this).addClass("solved");
		}
	})
	
	$(dialog).find('.puzzle-selection-button').click(function(event) {
		event.preventDefault();
		puzzle = $(this).attr('href');
		boxed.play(puzzle);
		$(dialog).hide();
	});
	
	boxed.solved(function () {
		$(dialog).find('.puzzle-selection-button[href=' + puzzle + ']').addClass("solved");
		$(dialog).show();
		localStorage.setItem(puzzle, true);
	});
}

function Block(container, matrix, blockSize, color) {
	this.lineWidth = 2;
	this.matrix = matrix;
	this._matrixSize = this._calculateSize(matrix);
	this._size = { width: this._matrixSize.width * blockSize, height: this._matrixSize.height * blockSize };
	this.canvas = container.appendChild(this._createCanvas(this._size.width + this.lineWidth, this._size.height + this.lineWidth));
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

		if (color) {
			this.color = color;
		} else {
			var r = Math.floor(50 + Math.random() * 200);
			var g = Math.floor(50 + Math.random() * 200);
			var b = Math.floor(50 + Math.random() * 200);
			this.color = "rgb(" + [r ,g, b].join(',') + ")";
		}

		ctx.fillStyle = this.color;
		ctx.strokeStyle = "black";
		ctx.lineWidth = this.lineWidth;
		ctx.lineCap = 'round';
		ctx.translate(ctx.lineWidth / 2, ctx.lineWidth / 2);
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
		ctx.stroke();
	},
	
	_calculateSize: function(matrix, blockSize) {
		return { width:  matrix[0].length, height: matrix.length };
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
	
	getBBox: function () {
		return { x: this._x, y: this._y, width: this._size.width, height: this._size.height };
	},
	
	getSize: function () {
		return { width: this._matrixSize.width, height: this._matrixSize.height };
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
	
	hline:
	[[1, 1, 1, 1]],
	
	knight1:	
	[[1, 0],
	 [1, 0],
	 [1, 1]],
	
	knight2:	
	[[1, 1, 1],
	 [1, 0, 0]],
	
	knight3:	
	[[1, 1],
	 [0, 1],
	 [0, 1]],
	
	knight4:	
	[[0, 0, 1],
	 [1, 1, 1]],
	
	knight1f:	
	[[0, 1],
	 [0, 1],
	 [1, 1]],

	knight2f:	
	[[1, 0, 0],
	 [1, 1, 1]],

	knight3f:	
	[[1, 1],
	 [1, 0],
	 [1, 0]],

	knight4f:	
	[[1, 1, 1],
	 [0, 0, 1]],
		
	hle:
	[[1, 0, 0],
	 [1, 1, 1]],
	
	fhle:
	[[1, 1, 1],
	 [1, 0, 0]],
	
	hel:
	[[1, 1, 1],
	 [0, 0, 1]],
	
	fhel:
	[[0, 0, 1],
	 [1, 1, 1]],
	
	tee:
	[[0, 1, 0],
	 [1, 1, 1]],
	
	diag1:	
	[[1, 0, 0],
	 [1, 0, 0],
	 [1, 1, 1]],
	
	diag2:	
	[[1, 1, 1],
	 [1, 0, 0],
	 [1, 0, 0]],
	
	diag3:	
	[[1, 1, 1],
	 [0, 0, 1],
	 [0, 0, 1]],
		
	dot:	
	[[1]],
	
	hline2:
	[[1,1]],
	
	vline2:
	[[1],
	 [1]],
	
	hline3:
	[[1,1,1]],
	
	vline3:
	[[1],
	 [1],
	 [1]],
	
	vline:
	[[1],
	 [1],
	 [1],
	 [1]]
		
};

var puzzles = [
	{
		tip: "The puzzle is solved when only one block remains",
		puzzle: ["knight1", "knight3"]
	},
	{
		tip: "meh meh",
		puzzle: ["vline", "knight1", "knight4"]
	},
	{
		tip: "blocks grouped together can merge into a smaller version of itself",
		puzzle: ["tee", "vline", "hline", "vline", "knight3", "knight3f", "hline", "vline3"]
	},
	{
		tip: "galet",
		puzzle:	["knight3", "knight4", "knight1f", "knight4f"]
	},
	{
		tip: "blocks only merge when they form a block which can be shrunken",
		puzzle: ["dot", "knight1", "knight1", "knight3", "knight4", "knight1", "knight3"]
	},
	{
		tip: "getting harder",
		puzzle: ["vline3", "vline3", "hline3", "hline3", "hline2", "hline2"]
	},
	{
		tip: "wazza what?!",
		puzzle: ["knight1", "hline", "hline3", "vline", "vline", "dot"],
	},
	{
		tip: "Easy peasy",
		puzzle: ["tee", "hline2", "tee", "dot", "dot"]
	}
];