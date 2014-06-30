//#region Tank Gun
function TankGun(fromTank) {
    this.x = fromTank.x,
    this.y = fromTank.y,
    this.angle = fromTank.angle;

    //console.log({ d: degree, n: orgVal });

    //switch (degree) {
    //    case 90: this.x += 20; break; // up
    //    case -225: this.x += 30; break; // up left
    //    case -180: this.y -= 15; break; // left
    //    case -135: this.y -= 15; break; // down left
    //    case -90: this.x += 2; break; // down left
    //    case -45: this.x += 6; break; // down right
    //    case 45: this.x += 16; break; // up right
    //}



    //if (orgVal == 180) { orgVal = 0; }
    //else if (orgVal == 0) { orgVal = 180; }
    //0, -45, 


    var self = this;
    this.id = new Date().getTime();
            
    this.width = 62,
    this.height = 46,
    this.fromTank = fromTank,
    this.xPath = Math.cos(this.angle) * this.speed,
    this.yPath = Math.sin(this.angle) * this.speed;
            
    this.img = global_imgs[fromTank.color];

    this.gunSprite = { x: 439, y: 310, w: 40, h: 64 };
	
    this.remove = false;

}

TankGun.prototype.Update = function () {

};

TankGun.prototype.Draw = function () {

	this.width = this.gunSprite.w;
	this.height = this.gunSprite.h;

	//Helpers.AngleDraw(this.img, this.x, this.y, this.gunSprite.x, this.gunSprite.y, this.gunSprite.w, this.gunSprite.h, this.angle);

	ctx.save();

	var xCenter = this.x + this.fromTank.width / 2,
		yCenter = this.y + this.fromTank.height / 2,
		xTopLeft = -this.fromTank.width / 2,
		yTopLeft = -this.fromTank.height / 2;

	ctx.translate(xCenter, yCenter);
	ctx.rotate(this.angle);

	ctx.drawImage(this.img, this.gunSprite.x, this.gunSprite.y, this.gunSprite.w, this.gunSprite.h, xTopLeft + this.gunSprite.w - 20, yTopLeft + 39, this.gunSprite.w, this.gunSprite.h);

	ctx.restore();

	//Missile.AngleDraw(this.img, this.x, this.y, flame.x, flame.y, flame.w, flame.h, this.angle);

	//console.log({ x: this.x, y: this.y });


};

TankGun.prototype.Queue = function () {

    //this.x += this.xPath;
    //this.y += this.yPath;

    //if (this.x + this.width > globalWidth) {
    //    this.remove = true;
    //}
    //if (this.y + this.height > globalHeight) {
    //    this.remove = true;
    //}
    //if (this.x < 0) {
    //    this.remove = true;
    //}
    //if (this.y < 0) {
    //    this.remove = true;
    //}
};

//#endregion
