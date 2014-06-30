//#region Missile
function V2_Missile(nodeData) {

	var x = nodeData.newX,
        y = nodeData.newY,
        angle = nodeData.angle;

    // flip the missile 90 degrees...
    var degree = angle - 90; //-(angle - 90);

    angle = Helpers.GetRadians(degree);

    var self = this;
    this.id = new Date().getTime();
    this.x = nodeData.newX,
    this.y = nodeData.newY,
	this.xCenter = nodeData.xCenter,
	this.yCenter = nodeData.yCenter,
    this.width = nodeData.width,
    this.height = nodeData.height,
	this.missileCoords = nodeData.missileCoords,
	this.xyCorners = nodeData.xyCorners,
    this.fromTankId = nodeData.fromTankId,
	this.fromTankColor = nodeData.fromTankColor,
	this.fromTankAngle = nodeData.fromTankAngle,
    this.speed = nodeData.speed,
    this.angle = angle, //Helpers.GetRadians(angle),
    this.xPath = Math.cos(this.angle) * this.speed,
    this.yPath = Math.sin(this.angle) * this.speed;
	this.img = global_imgs.missile;
	this.sprite = nodeData.sprite;
    this.direction = nodeData.direction;
	this.flameInfo = nodeData.flameInfo;
   
	console.log(
		"Create new V2 " + this.fromTankColor + " Missile; " 
		+ "NodeAngle: " + nodeData.angle + "; "
		+ "Degree: " + degree + "; "
		+ "TankAngle: " + this.fromTankAngle);
   
	this.remove = nodeData.remove;
}

V2_Missile.prototype.Draw = function () {
	//console.log("Draw V2 Missile (x: " + this.xCenter + "; y: " + this.yCenter + ") for " + this.fromTankColor + "!");
	
	// need to rotate the missile relative to the tank... not relative to the missile itself...
	ctx.save();

	ctx.translate(this.xCenter, this.yCenter);
	ctx.rotate(this.angle);

	ctx.drawImage(
		this.img, 
		this.sprite.x, 
		this.sprite.y, 
		this.sprite.w, 
		this.sprite.h, 
		this.x, 
		this.y, 
		this.width, 
		this.height);

	ctx.restore();
							
	// missile rectangle
	if (global_debugging) {
		ctx.beginPath();
		ctx.strokeStyle = "yellow";

		Helpers.DrawRect(
			this.xyCorners.x1, this.xyCorners.y1,
			this.xyCorners.x2, this.xyCorners.y2,
			this.xyCorners.x3, this.xyCorners.y3,
			this.xyCorners.x4, this.xyCorners.y4);

		ctx.stroke();
		ctx.closePath();
	}

	if (this.flameInfo.show) {

		// need to rotate the flame relative to the missile... not relative to the flame itself...
		ctx.save();

		ctx.translate(this.flameInfo.xCenter, this.flameInfo.yCenter);
		ctx.rotate(this.flameInfo.angle);

		ctx.drawImage(
			this.img, 
			this.flameInfo.x, 
			this.flameInfo.y, 
			this.flameInfo.w, 
			this.flameInfo.h, 
			this.flameInfo.canvas_x, 
			this.flameInfo.canvas_y, 
			this.flameInfo.canvas_w, 
			this.flameInfo.canvas_h);

		ctx.restore();
	}

};


//#endregion
