Array.max = function (array) { return Math.max.apply(Math, array); };
Array.min = function (array) { return Math.min.apply(Math, array); };
Array.prototype.rand = function () { return this[Math.floor(Math.random() * this.length)]; };

function Helpers(){}

Helpers.GlobalWidth = 1000;
Helpers.GlobalHeight = 800;

Helpers.IsUndefined = function (obj) {
	return typeof obj === "undefined";
};

Helpers.Rand = function (min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
};

Helpers.DoPolygonsIntersect = function (a, b) {
	/// <summary>
	/// If you pass in two closed polygons, this should return true if they intersect.
	/// </summary>
	/// <param name="a">an array of connected points [{x:, y:}, {x:, y:},...] that form a closed polygon</param>
	/// <param name="b">an array of connected points [{x:, y:}, {x:, y:},...] that form a closed polygon</param>
	var polygons = [a, b];
	var minA, maxA, projected, i, i1, j, minB, maxB;

	for (i = 0; i < polygons.length; i++) {

		// for each polygon, look at each edge of the polygon, and determine if it separates
		// the two shapes
		var polygon = polygons[i];
		for (i1 = 0; i1 < polygon.length; i1++) {

			// grab 2 vertices to create an edge
			var i2 = (i1 + 1) % polygon.length;
			var p1 = polygon[i1];
			var p2 = polygon[i2];

			// find the line perpendicular to this edge
			var normal = { x: p2.y - p1.y, y: p1.x - p2.x };

			minA = maxA = undefined;
			// for each vertex in the first shape, project it onto the line perpendicular to the edge
			// and keep track of the min and max of these values
			for (j = 0; j < a.length; j++) {
				projected = normal.x * a[j].x + normal.y * a[j].y;
				if (Helpers.IsUndefined(minA) || projected < minA) {
					minA = projected;
				}
				if (Helpers.IsUndefined(maxA) || projected > maxA) {
					maxA = projected;
				}
			}

			// for each vertex in the second shape, project it onto the line perpendicular to the edge
			// and keep track of the min and max of these values
			minB = maxB = undefined;
			for (j = 0; j < b.length; j++) {
				projected = normal.x * b[j].x + normal.y * b[j].y;
				if (Helpers.IsUndefined(minB) || projected < minB) {
					minB = projected;
				}
				if (Helpers.IsUndefined(maxB) || projected > maxB) {
					maxB = projected;
				}
			}

			// if there is no overlap between the projects, the edge we are looking at separates the two
			// polygons, and we know there is no overlap
			if (maxA < minB || maxB < minA) {
				return false;
			}
		}
	}
	return true;
};

Helpers.getRotatedCoordsForRect = function (x1, y1, x2, y2, x3, y3, x4, y4, angle, pivotX, pivotY) {
	var cosa = Math.cos(angle),
		sina = Math.sin(angle),
		w = x3 - x1,    // width of the rectangle
		h = y3 - y1,    // height of the rectangle
		w2 = w / 2,     // width/2
		h2 = h / 2,     // height/2
		Nw2 = -w2,    // negative w/2
		Nh2 = -h2,    // negative h/2
		xo = pivotX || (x1 + w2), // x-offset for center of rectangle
		yo = pivotY || (y1 + h2); // y-offset for center of rectangle

	/**
		We rotate based on the classical rotation matrix:

		  new_x = x * cos(angle) - y * sin(angle);
		  new_y = x * sin(angle) + y * cos(angle);

		This is relative to an origin of (0,0), so we
		really need to do this:

		  new_x = x' * cos(angle) - y' * sin(angle) + xo;
		  new_y = x' * sin(angle) + y' * cos(angle) + yo;

		where x' and y' are translations so that the
		rectangle's center is on 0,0 -- xo and yo are
		the values by which we need to translate back.    
	**/

	var nx1 = Nw2 * cosa - Nh2 * sina + xo,
		ny1 = Nw2 * sina + Nh2 * cosa + yo,
		nx2 = w2 * cosa - Nh2 * sina + xo,
		ny2 = w2 * sina + Nh2 * cosa + yo,
		nx3 = w2 * cosa - h2 * sina + xo,
		ny3 = w2 * sina + h2 * cosa + yo,
		nx4 = Nw2 * cosa - h2 * sina + xo,
		ny4 = Nw2 * sina + h2 * cosa + yo;

	return {
		x1: nx1, y1: ny1,
		x2: nx2, y2: ny2,
		x3: nx3, y3: ny3,
		x4: nx4, y4: ny4
	};
};

Helpers.AngleDraw = function (img, canvasX, canvasY, spriteMapX, spriteMapY, width, height, angle, resizeWidth, resizeHeight) {
	ctx.save();

	var xCenter = canvasX + width / 2,
		yCenter = canvasY + height / 2,
		xTopLeft = -width / 2,
		yTopLeft = -height / 2;

	ctx.translate(xCenter, yCenter);
	ctx.rotate(angle);

	ctx.drawImage(img, spriteMapX, spriteMapY, width, height, xTopLeft, yTopLeft, resizeWidth ? resizeWidth : width, resizeHeight ? resizeHeight : height);

	ctx.restore();
};

Helpers.GetRadians = function (degree) {
	return degree * Math.PI / 180;
};

Helpers.GetDegreesFromRadians = function (radians) {
	return (radians * 180) / Math.PI;
};

Helpers.DrawRect = function (x1, y1, x2, y2, x3, y3, x4, y4) {
	ctx.moveTo(x1, y1);
	ctx.lineTo(x2, y2);
	ctx.lineTo(x3, y3);
	ctx.lineTo(x4, y4);
	ctx.lineTo(x1, y1);
	ctx.stroke();
};

Helpers.GetPoint = function (pivotX, pivotY, upperLeftCornerX, upperLeftCornerY, newAngle) {
				
		var x, y, dist, diffX, diffY, ca, na;

		/// get distance from center to point
		diffX = upperLeftCornerX - pivotX;
		diffY = upperLeftCornerY - pivotY;
		dist = Math.sqrt(diffX * diffX + diffY * diffY);

		/// find angle from pivot to corner
		ca = Math.atan2(diffY, diffX) * 180 / Math.PI;

		/// get new angle based on old + current delta angle
		na = ((ca + newAngle) % 360) * Math.PI / 180;

		/// get new x and y and round it off to integer
		x = (pivotX + dist * Math.cos(na) + 0.5) | 0;
		y = (pivotY + dist * Math.sin(na) + 0.5) | 0;

		//return { x: x, y: y, dist: dist };
		return { x: x, y: y };
	
};
		
module.exports = Helpers;