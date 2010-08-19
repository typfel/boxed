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
		
	var xoffset =  boxed.blockSize - xdelta.mod(blockSize);
	var yoffset =  boxed.blockSize - ydelta.mod(blockSize);
	var rxoffset = boxed.blockSize - xoffset;
	var ryoffset = boxed.blockSize - yoffset;
		
	var len = block1.matrix.length;
		
	var m = xdelta / blockSize;
	var n = ydelta / blockSize;
		
	function check(x, y) {
		if (x >= 0 && x < len && y >= 0 && y < len) {
			return block2.matrix[y][x];
		}
		return 0;
	}
	
	var resolution = { x: 0, y: 0 };
	var max = 0;
	
	//console.log("###");
	
	for (var i = 0; i < len; i++) {
		for (var j = 0; j < len; j++) {
			
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
	this.blockSize = 40;
	
	this.addPiece(Shapes.L, 0, 0);
	this.addPiece(Shapes.T, 0, 160);
}

Boxed.prototype = {
	
	resize: function (width, height) {
		//this.paper.setSize(width, height);
	},
		
	addPiece: function (shape, x, y) {
		var block = new Block(this.container, shape, this.blockSize);
		block.setPosition(x, y);
		this.pieces.push(block);
		
		block.drag(
			function () {
				block.initialPosition = block.getPosition();
				block.lastPosition = block.getPosition();
				block.ddx = 0;
				block.ddy = 0;
			}.bindScope(this),
			function (dx, dy) {
				block.lastPosition = block.getPosition();

				var x = block.lastPosition.x + (dx - block.ddx);
				var y = block.lastPosition.y + (dy - block.ddy);
				
				block.ddx = dx;
				block.ddy = dy;
				block.setPosition(x, y);
				
				for (i in this.pieces) {
					var piece = this.pieces[i];
					
					if (piece != block) {
						if (boundingBoxTest(block.getBBox(), piece.getBBox())) {							
							resolution = getBlockCollisionResolution(block, piece, this.blockSize);
							block.setPosition(x + resolution.x, y + resolution.y);
						}
					}
				}
			}.bindScope(this),
			function() {

		});
	}
	
};


function Block(container, matrix, blockSize) {
	this.matrix = matrix;
	this._size = this._calculateSize(matrix, blockSize);
	this.canvas = container.appendChild(this._createCanvas(this._size.width, this._size.height));
	this.ctx = this.canvas.getContext("2d");
	this._render(this.ctx, matrix, blockSize);
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

		var isEqual = function(vector1, vector2) {
			return vector1.x == vector2.x && vector1.y == vector2.y;
		}

		var get = function(x, y) {
			var row = matrix[y];

			if (row) {
				return row[x];
			} else {
				return null;
			}
		}

		var findBlock = function(matrix) {
			for (var i = 0; i < matrix.length; i++) {
				for (var j = 0; j < matrix[i].length; j++) {
					if (matrix[i][j]) {
						return { x: j, y: i };
					}
				}
			}
		}

		// find first active block	
		var start = findBlock(matrix);

		var turns = 0;
		var direction = {x: 1, y: 0 };
		var position = start;
		var gposition = { x: position.x * blockSize, y: position.y * blockSize };
		gposition = translate(gposition, { x: direction.x * blockSize, y: direction.y * blockSize });

		ctx.fillStyle = "rgb(200,0,0)";
		ctx.beginPath();
		ctx.moveTo(gposition.x, gposition.y);

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
					//ctx.lineTo(direction.x * blockSize, direction.y * blockSize);
					gposition = translate(gposition, { x: direction.x * blockSize, y: direction.y * blockSize });
					ctx.lineTo(gposition.x, gposition.y);
				}
			} else {
				// turn left
				direction = rotateRight(direction);
				//ctx.lineTo(direction.x * blockSize, direction.y * blockSize);
				gposition = translate(gposition, { x: direction.x * blockSize, y: direction.y * blockSize });
				ctx.lineTo(gposition.x, gposition.y);
				turns++;
			}

		} while (!(isEqual(position, start) && isEqual(direction, { x: 1, y: 0 })));

		ctx.closePath();
		ctx.fill();
	},
	
	_calculateSize: function(matrix, blockSize) {
		return { width: matrix[0].length * blockSize, height: matrix.length * blockSize };
	},
	
	setPosition: function (x, y) {
		this._x = x;
		this._y = y;
		this.canvas.style.webkitTransform = ['translate3d(', x, 'px,', y, 'px,', '0px)'].join('');
	},
	
	getPosition: function() {
		return {x: this._x, y: this._y };
	},
	
	getBBox: function() {
		return { x: this._x, y: this._y, width: this._size.width, height: this._size.height };
	},
		
	drag: function(grabbed, moved, released) {		
		var canvas = this.canvas;
		var self = this;
		var touchSupport = "createTouch" in document;
		
		var down = "mousedown";
		var move = "mousemove";
		var up = "mouseup";
		
		if (touchSupport) {
			down = "touchstart";
			move = "touchmove";
			up = "touchend";
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
			document.removeEventListener(move, _moved, false);
			document.removeEventListener(up, _released, false);
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
			
			document.addEventListener(move, _moved, false);
			document.addEventListener(up, _released, false);			
		});
	}
		
}

var Shapes = {
	
	L: [[1, 1, 1, 0],
		[1, 0, 1, 0],
		[1, 0, 0, 0],
		[1, 0, 0, 0]],
		
	T: [[0, 1, 0, 0],
		[0, 1, 1, 0],
		[0, 1, 1, 0],
		[0, 1, 1, 1]]
		
}