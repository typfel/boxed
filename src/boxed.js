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

Raphael.fn.block = function(x, y, matrix, blockSize) {
	
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
		
	var direction = {x: 1, y: 0 }
	var position = start;	
	var path = this.path("");
	var turns = 0;
	
	path.relatively();
	path.moveTo(direction.x * blockSize, direction.y * blockSize);

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
				path.lineTo(direction.x * blockSize, direction.y * blockSize);
			}
		} else {
			// turn left
			direction = rotateRight(direction);
			path.lineTo(direction.x * blockSize, direction.y * blockSize);
			turns++;
		}
		
	} while (!(isEqual(position, start) && isEqual(direction, { x: 1, y: 0 })));
	
	return path.andClose();
}

Raphael.el.setPosition = function(x, y) {
	var c = this.attr("translation");
	this.translate(x - c.x, y - c.y);
}

function Boxed(containerElement) {
	this.pieces = [];
	this.paper = Raphael(containerElement, containerElement.offsetWidth, containerElement.offsetHeight);
	this.blockSize = 40;
	
	this.addPiece(Shapes.L, 0, 0);
	this.addPiece(Shapes.T, 200, 100);
}

Boxed.prototype = {
	
	resize: function (width, height) {
		this.paper.setSize(width, height);
	},
		
	addPiece: function (shape, x, y) {

		var block = this.paper.block(0, 0, shape, this.blockSize).attr({
				fill: "hsb(.6, 1, 1)",
				stroke: "hsb(0, 0, 0)"
			});
		block.setPosition(x, y);

		var piece = new Piece(this, block);
		piece.mshape = shape;
		this.pieces.push(piece);
	}
	
};

function Piece(boxed, block) {
	this.boxed = boxed;
	this.block = block;
	
	block.drag(this.moved.bindScope(this), this.grabbed.bindScope(this), this.released.bindScope(this));
}

Piece.prototype.resolveCollision = function(aPiece) {
	var bbox1 = this.block.getBBox();
	var bbox2 = aPiece.block.getBBox();
	var boxed = this.boxed;
	
	var xdelta = bbox1.x - bbox2.x;
	var ydelta = bbox1.y - bbox2.y;
	
	//console.log(["xdelta: ", xdelta, " ydelta: ", ydelta].join(''));
	
	var xoffset =  boxed.blockSize - xdelta.mod(boxed.blockSize);
	var yoffset =  boxed.blockSize - ydelta.mod(boxed.blockSize);
	var rxoffset = boxed.blockSize - xoffset;
	var ryoffset = boxed.blockSize - yoffset;
	
	//var xoffset2 = bbox2.x.mod(boxed.blockSize);
	//var yoffset2 = bbox2.y.mod(boxed.blockSize);
	
	var len = this.mshape.length;
		
	var m = xdelta / boxed.blockSize;
	var n = ydelta / boxed.blockSize;
	
	//console.log(["m: ", m, " n: ", n].join(''));
	
	function check(x, y) {
		if (x >= 0 && x < len && y >= 0 && y < len) {
			return aPiece.mshape[y][x];
		}
		return 0;
	}
	
	var resolve = { x: 0, y: 0 };
	var max = 0;
	
	//console.log("###");
	
	for (var i = 0; i < len; i++) {
		for (var j = 0; j < len; j++) {
			
			if (!this.mshape[j][i]) {
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
			}
			*/
						
			if (a + b + c + d == 1) {
				if (a) {
					if (xoffset < yoffset) {
						resolve.x = xoffset;
					} else {
						resolve.y = yoffset;
					}
				} else
				if (b) {
					if (rxoffset < yoffset) {
						resolve.x = -rxoffset;
					} else {
						resolve.y = yoffset;
					}
				} else
				if (c) {
					if (xoffset < ryoffset) {
						resolve.x = xoffset
					} else {
						resolve.y = -ryoffset;
					}
				} else {
					if (rxoffset < ryoffset) {
						resolve.x = -rxoffset;
					} else {
						resolve.y = -ryoffset;
					}
				}
			}
			else {
				if (a && b) {
					resolve.y = yoffset;
				} else
				if (d && c) {
					resolve.y = -ryoffset;
				}

				if (b && d) {
					resolve.x = -rxoffset;
				} else
				if (c && a) {
					resolve.x = xoffset;
				}	
			}
		}
	}
	
	//console.log("xoffset: " + xoffset);
	//console.log("yoffset: " + yoffset);
	//console.log(["resolve(", resolve.x, ",", resolve.y, ")"].join(''));
	
	var position = this.block.attr("translation");
	this.block.setPosition(position.x + resolve.x, position.y + resolve.y);
}

Piece.prototype.grabbed = function() {
	this.initialPosition = this.block.attr("translation");
	this.lastPosition = this.block.attr("translation");
	this.ddx = 0;
	this.ddy = 0;
}

Piece.prototype.moved = function(dx, dy) {
	this.lastPosition = this.block.attr("translation");
	
	var x = this.lastPosition.x + (dx - this.ddx);
	var y = this.lastPosition.y + (dy - this.ddy);
	
	this.ddx = dx;
	this.ddy = dy;
	
	this.block.setPosition(x, y);
	var pieces = this.boxed.pieces;
	
	for (i in pieces) {
		var piece = pieces[i];
		if (piece != this) {
			if (boundingBoxTest(this.block.getBBox(), piece.block.getBBox())) {
				this.resolveCollision(piece);
			}
		}
	}
}

Piece.prototype.released = function() {
	var blockSize = this.boxed.blockSize
	var position = this.block.attr("translation");
		
	var xoffset = position.x.mod(blockSize);
	var yoffset = position.y.mod(blockSize);
		
	var correction = { x: 0, y: 0 };
	correction.x += xoffset < blockSize / 2 ? -xoffset : (blockSize - xoffset);
	correction.y += yoffset < blockSize / 2 ? -yoffset : (blockSize - yoffset);
		
	this.block.animate({ translation: [correction.x , correction.y].join(' ') }, 200, "backIn");
}

var Shapes = {
	
	L: [[1, 1, 1, 0],
		[1, 0, 1, 0],
		[1, 0, 0, 0],
		[1, 0, 0, 0]],
		
	T: [[0, 1, 0, 0],
		[0, 1, 1, 0],
		[0, 1, 1, 0],
		[1, 1, 1, 1]]
		
}