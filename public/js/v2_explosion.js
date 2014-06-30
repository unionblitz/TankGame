//#region Explosion
function V2_Explosion(nodeData) {

    this.x = nodeData.x,
    this.y = nodeData.y,
    this.width = nodeData.width,
    this.height = nodeData.height,
    this.speed = nodeData.speed,
    this.angle = nodeData.angle, //Helpers.GetRadians(angle),
    this.xPath = nodeData.xPath,
    this.yPath = nodeData.yPath,
	this.sprite = nodeData.sprite,
	this.remove = nodeData.remove,
	this.img = global_imgs.explosion;
    
}


V2_Explosion.prototype.Draw = function () {
	if (!this.remove) {
        Helpers.AngleDraw(this.img, this.x, this.y, this.sprite.x, this.sprite.y, this.sprite.w, this.sprite.h, this.angle);
    }
};

//#endregion
