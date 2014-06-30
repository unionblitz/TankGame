var Helpers = require("./Helpers.js");

function Missile(fromTank){
    
	 var x = fromTank.x,
        y = fromTank.y,
        angle = fromTank.angle;

	
    // flip the missile 90 degrees...
	//Helpers.GetDegreesFromRadians(theRadian);
    var degree = -(fromTank.angle - 90);

    angle = Helpers.GetRadians(degree);
	
	console.log("tank w:" + fromTank.width + "; h: " + fromTank.height);
	
	/*
	console.log("fromTank degree: " + fromTank.angle + "; "
		+ "missile degree: " + degree + "; "
		+ "missile radian: " + angle);
	*/
	
    var self = this;
    this.id = new Date().getTime();
    this.x = x,
    this.y = y,
    this.width = 62,
    this.height = 46,
    this.fromTank = fromTank,
    this.speed = 4.5,
    this.angle = angle,
    this.xPath = Math.cos(this.angle) * this.speed,
    this.yPath = Math.sin(this.angle) * this.speed;
	
    var dirX = "", dirY = "";
    if (Math.floor(this.xPath) > 0) { dirX = "right"; }
    if (Math.floor(this.xPath) < 0) { dirX = "left"; }
    if (Math.floor(this.yPath) > 0) { dirY = "down "; }
    if (Math.floor(this.yPath) < 0) { dirY = "up "; }
    this.direction = dirY + dirX;

    this.showFlame = false; // delay flame till out a certain distance away from turret

    this.missileCoords = {
        x1: null, y1: null,
        x2: null, y2: null,
        x3: null, y3: null,
        x4: null, y4: null
    };

    this.ixSprite = 0;

    this.sprites = [
        { x: 12, y: 6, w: 62, h: 46 },
        { x: 90, y: 6, w: 62, h: 46 },
        { x: 164, y: 6, w: 62, h: 46 },
        { x: 242, y: 6, w: 62, h: 46 },
        { x: 318, y: 6, w: 62, h: 46 },
        { x: 395, y: 6, w: 62, h: 46 },
        { x: 473, y: 6, w: 62, h: 46 },
        { x: 12, y: 54, w: 62, h: 46 },
        { x: 88, y: 54, w: 62, h: 46 },
        { x: 164, y: 54, w: 62, h: 46 },
        { x: 239, y: 55, w: 62, h: 46 },
        { x: 316, y: 55, w: 62, h: 46 },
        { x: 316, y: 55, w: 62, h: 46 },
        { x: 395, y: 55, w: 62, h: 46 }
    ];

    this.totalSprites = this.sprites;

    this.ixFlameSprite = 0;
    this.flameSprites = [
        { x: 171, y: 382, w: 23, h: 21 },
        { x: 205, y: 382, w: 26, h: 21 },
        { x: 243, y: 382, w: 28, h: 21 },
        { x: 284, y: 382, w: 32, h: 21 },
        { x: 243, y: 382, w: 28, h: 21 },
        { x: 205, y: 382, w: 26, h: 21 }
    ];

    this.totalFlameSprites = this.flameSprites.length;

    this.remove = false;
}

Missile.prototype.Update = function () {
    
	var self = this;
    
	if (!this.showFlame) {
        setTimeout(function () {
            self.showFlame = true;
        }, 100);
	}

};


Missile.prototype.Draw = function () {
	
	var sprite = this.sprites[this.ixSprite];
	this.ixSprite = (this.ixSprite + 1 >= this.sprites.length) ? 0 : this.ixSprite + 1;

	var resizeWidth = 36,
		resizeHeight = 27;

	this.width = resizeWidth;
	this.height = resizeHeight;


	var xCenter = this.x + this.fromTank.width / 2,
		yCenter = this.y + this.fromTank.height / 2,
		xTopLeft = -resizeWidth / 2,
		yTopLeft = -resizeHeight / 2;

		
	// xCenter, yCenter, this.angle, sprite, newX, newY, resizeWidth, resizeHeight
	
	var xyCorners = this.GetXYCorners();			
									
	var newX = xTopLeft - sprite.w + 80,
		newY = yTopLeft + 8;

									
	// we need to rotate the angle for some reason to get this to work correctly:
	var newDeg = Helpers.GetDegreesFromRadians(this.angle) + 90,
		newRad = Helpers.GetRadians(newDeg);

	var tankCorners = this.fromTank.GetXYCorners();

	var x1Missile = this.fromTank.x + (this.fromTank.width + resizeWidth) / 2,
		y1Missile = this.fromTank.y + (this.fromTank.height + resizeHeight) / 2,
		x2Missile = x1Missile + resizeHeight,
		y2Missile = y1Missile,
		x3Missile = x1Missile + resizeHeight,
		y3Missile = y1Missile + resizeWidth,
		x4Missile = x1Missile,
		y4Missile = y1Missile + resizeWidth;

	var newMissileCoords = Helpers.getRotatedCoordsForRect(
			x1Missile, y1Missile,
			x2Missile, y2Missile,
			x3Missile, y3Missile,
			x4Missile, y4Missile,
			newRad,
			tankCorners.xPivot, tankCorners.yPivot);

	if (this.missileCoords.x1 == null) {
		this.missileCoords = newMissileCoords;
	} else {
		this.missileCoords.x1 += this.xPath;
		this.missileCoords.x2 += this.xPath;
		this.missileCoords.x3 += this.xPath;
		this.missileCoords.x4 += this.xPath;
		this.missileCoords.y1 += this.yPath;
		this.missileCoords.y2 += this.yPath;
		this.missileCoords.y3 += this.yPath;
		this.missileCoords.y4 += this.yPath;
	}

	var xyCorners = this.GetXYCorners();
	
	var result = {
		remove: this.remove,
		width: this.width,
		height: this.height,
		fromTankId: this.fromTank.socketId,
		fromTankColor: this.fromTank.color,
		fromTankAngle: this.fromTank.angle, // degrees
		direction: this.direction,
		xCenter: xCenter, 
		yCenter: yCenter, 
		angle: newDeg, // degrees
		speed: this.speed,		
		sprite: sprite, 
		newX: newX, 
		newY: newY, 
		resizeWidth: resizeWidth, 
		resizeHeight: resizeHeight,
		missileCoords: this.missileCoords,
		xyCorners: xyCorners,
		flameInfo: {
			show: this.showFlame,
			xCenter: 0, yCenter : 0, angle : 0,
			x: 0, y: 0, w: 0, h: 0,
			canvas_x: 0, canvas_y: 0, canvas_w: 0, canvas_h: 0
		}
	};
	
									

	if (this.showFlame) {
	
		var flame = this.flameSprites[this.ixFlameSprite];
		this.ixFlameSprite = (this.ixFlameSprite + 1 >= this.flameSprites.length) ? 0 : this.ixFlameSprite + 1;
		
		var xCenter = this.x + this.fromTank.width / 2,
			yCenter = this.y + this.fromTank.height / 2,
			xTopLeft = -resizeWidth / 2,
			yTopLeft = -resizeHeight / 2;
			
		result.flameInfo.xCenter = xCenter;
		result.flameInfo.yCenter = yCenter;
		result.flameInfo.angle = this.angle;
		result.flameInfo.x = flame.x;
		result.flameInfo.y = flame.y;
		result.flameInfo.w = flame.w;
		result.flameInfo.h = flame.h;
		result.flameInfo.canvas_x = xTopLeft - flame.w + 20;
		result.flameInfo.canvas_y = yTopLeft + 8;
		result.flameInfo.canvas_w = flame.w;
		result.flameInfo.canvas_h = flame.h;
		
	}

	return result;

};

Missile.prototype.Queue = function (tankCollection) {

    var queueResult = {
        hitTank: null,
        hit: {
            horizontal: null,
            vertical: null
        }
    };

    this.x += this.xPath;
    this.y += this.yPath;

    if (this.x + this.height + 45 > Helpers.GlobalWidth) {
        this.remove = true;
    }
    if (this.y + this.width + 45 > Helpers.GlobalHeight) {
        this.remove = true;
    }
    if (this.x - this.height + 32 < 0) {
        this.remove = true;
    }
    if (this.y - this.width + 65 < 0) {
        this.remove = true;
    }

    var self = this;
    var firstPolygonsCoords = this.GetPolygonCoords();

    var minX = 0, minY = 0, maxX = 0, maxY = 0, midX = 0, midY = 0;
    firstPolygonsCoords.forEach(function (obj, ix, arr) {
        if (obj.x < minX || minX == 0) { minX = obj.x; }
        if (obj.x > maxX || maxX == 0) { maxX = obj.x; }
        if (obj.y < minY || minY == 0) { minY = obj.y; }
        if (obj.y > maxY || maxY == 0) { maxY = obj.y; }
    });

    midX = (minX + maxX) / 2;
    midY = (minY + maxY) / 2;

    var hSpot = "",
        vSpot = self.direction.indexOf("up") > -1 ? "down" : "up";

    if (self.direction.indexOf("right") > -1 || self.direction.indexOf("left") > -1) {
        hSpot = self.direction.indexOf("right") > -1 ? "left" : "right";
    }

    if (self.direction.indexOf("up") > -1 || self.direction.indexOf("down") > -1) {
        vSpot = self.direction.indexOf("up") > -1 ? "down" : "up";
    }


    tankCollection.forEach(function (obj, ix, arr) {
                
        if (obj != self.fromTank && !obj.isExploded) {
                    
            secondPolygonCoords = obj.GetPolygonCoords();
                    
            var minXTank = 0, minYTank = 0,
                maxXTank = 0, maxYTank = 0,
                midXTank = 0, midYTank = 0;

            //console.log({
            //    midX: midX, midXTank: midXTank,
            //    midY: midY, midYTank: midYTank,
            //    hit: vSpot
            //});
                    

            if (Helpers.DoPolygonsIntersect(firstPolygonsCoords, secondPolygonCoords)) {
                queueResult.hitTank = obj;
                //console.log({
                //    tankAngle: Helpers.GetDegreesFromRadians(obj.angle),
                //    direction: self.direction
                //});

                var tempRotateToTop = Helpers.GetDegreesFromRadians(-obj.angle);

                secondPolygonCoords.forEach(function (objTank, ixTank, arrTank) {
                    if (objTank.x < minXTank || minXTank == 0) { minXTank = objTank.x; }
                    if (objTank.x > maxXTank || maxXTank == 0) { maxXTank = objTank.x; }
                    if (objTank.y < minYTank || minYTank == 0) { minYTank = objTank.y; }
                    if (objTank.y > maxYTank || maxYTank == 0) { maxYTank = objTank.y; }
                });

                midXTank = (minXTank + maxXTank) / 2;
                midYTank = (minYTank + maxYTank) / 2;

                var rotatedHitPoint = {
                    xy1: Helpers.GetPoint(midXTank, midYTank, firstPolygonsCoords[0].x, firstPolygonsCoords[0].y, tempRotateToTop),
                    xy2: Helpers.GetPoint(midXTank, midYTank, firstPolygonsCoords[1].x, firstPolygonsCoords[1].y, tempRotateToTop),
                    xy3: Helpers.GetPoint(midXTank, midYTank, firstPolygonsCoords[2].x, firstPolygonsCoords[2].y, tempRotateToTop),
                    xy4: Helpers.GetPoint(midXTank, midYTank, firstPolygonsCoords[3].x, firstPolygonsCoords[3].y, tempRotateToTop)
                };

                var minXRotated = rotatedHitPoint.xy1.x,
                    maxXRotated = rotatedHitPoint.xy1.x,
                    minYRotated = rotatedHitPoint.xy1.y,
                    maxYRotated = rotatedHitPoint.xy1.y;
                        
                if (minXRotated < rotatedHitPoint.xy2.x) { minXRotated = rotatedHitPoint.xy2.x; }
                if (minXRotated < rotatedHitPoint.xy3.x) { minXRotated = rotatedHitPoint.xy3.x; }
                if (minXRotated < rotatedHitPoint.xy4.x) { minXRotated = rotatedHitPoint.xy4.x; }
                if (maxXRotated > rotatedHitPoint.xy2.x) { maxXRotated = rotatedHitPoint.xy2.x; }
                if (maxXRotated > rotatedHitPoint.xy3.x) { maxXRotated = rotatedHitPoint.xy3.x; }
                if (maxXRotated > rotatedHitPoint.xy4.x) { maxXRotated = rotatedHitPoint.xy4.x; }
                if (minYRotated < rotatedHitPoint.xy2.y) { minYRotated = rotatedHitPoint.xy2.y; }
                if (minYRotated < rotatedHitPoint.xy3.y) { minYRotated = rotatedHitPoint.xy3.y; }
                if (minYRotated < rotatedHitPoint.xy4.y) { minYRotated = rotatedHitPoint.xy4.y; }
                if (maxYRotated > rotatedHitPoint.xy2.y) { maxYRotated = rotatedHitPoint.xy2.y; }
                if (maxYRotated > rotatedHitPoint.xy3.y) { maxYRotated = rotatedHitPoint.xy3.y; }
                if (maxYRotated > rotatedHitPoint.xy4.y) { maxYRotated = rotatedHitPoint.xy4.y; }

                var midXRotated = (minXRotated + maxXRotated) / 2,
                    midYRotated = (minYRotated + maxYRotated) / 2;

                var hPoint = (midXRotated > midXTank) ? "right" : "left",
                    vPoint = (midYRotated < midYTank) ? "up" : "down";

                queueResult.hit.horizontal = hPoint;
                queueResult.hit.vertical = vPoint;

                //console.log(vPoint + " " + hPoint);

                       

                self.remove = true;
            }

        }
    });
            
    return queueResult;

};

Missile.prototype.GetXYCorners = function () {
    var tempX = 20, tempY = 5,
        xOffset = tempX * Math.cos(this.angle) - tempY * Math.sin(this.angle),
        yOffset = tempX * Math.sin(this.angle) + tempY * Math.cos(this.angle);

    return {
        x1: this.missileCoords.x1 + xOffset, y1: this.missileCoords.y1 + yOffset,
        x2: this.missileCoords.x2 + xOffset, y2: this.missileCoords.y2 + yOffset,
        x3: this.missileCoords.x3 + xOffset, y3: this.missileCoords.y3 + yOffset,
        x4: this.missileCoords.x4 + xOffset, y4: this.missileCoords.y4 + yOffset
    };
};


Missile.prototype.GetPolygonCoords = function () {
    var missileCorners = this.GetXYCorners();

    // we need to rotate the angle for some reason to get this to work correctly:
    var newDeg = Helpers.GetDegreesFromRadians(this.angle) + 90,
        newRad = Helpers.GetRadians(newDeg);

    var newCoords = Helpers.getRotatedCoordsForRect(
        missileCorners.x1, missileCorners.y1,
        missileCorners.x2, missileCorners.y2,
        missileCorners.x3, missileCorners.y3,
        missileCorners.x4, missileCorners.y4,
        -this.angle);

    return [
        { x: newCoords.x1, y: newCoords.y1 },
        { x: newCoords.x2, y: newCoords.y2 },
        { x: newCoords.x3, y: newCoords.y3 },
        { x: newCoords.x4, y: newCoords.y4 }
    ];
};


module.exports = Missile;