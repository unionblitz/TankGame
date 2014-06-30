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
            
    this.gunSprite = { x: 439, y: 310, w: 40, h: 64 };
	
    this.remove = false;

}

TankGun.prototype.Update = function () {

};

TankGun.prototype.Draw = function () {

	this.width = this.gunSprite.w;
	this.height = this.gunSprite.h;

	var xCenter = this.x + this.fromTank.width / 2,
		yCenter = this.y + this.fromTank.height / 2,
		xTopLeft = -this.fromTank.width / 2,
		yTopLeft = -this.fromTank.height / 2;


	//ctx.drawImage(this.img, this.gunSprite.x, this.gunSprite.y, this.gunSprite.w, this.gunSprite.h, xTopLeft + this.gunSprite.w - 20, yTopLeft + 39, this.gunSprite.w, this.gunSprite.h);


};

TankGun.prototype.Queue = function () {
};

//#endregion


module.exports = TankGun;