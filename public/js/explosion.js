﻿//#region Explosion
function Explosion(x, y, angle, fromMissile) {

    var self = this;

    this.x = x,
    this.y = y,
    this.width = 0,
    this.height = 0,
    this.fromMissile = fromMissile,
    this.speed = 2.5,
    this.angle = -angle, //Helpers.GetRadians(angle),
    this.xPath = Math.cos(this.angle) * this.speed,
    this.yPath = Math.sin(this.angle) * this.speed;
	this.img = global_imgs.explosion;
    this.ixSprite = 0;

    this.sprites = [
        { x: 3, y: 0, w: 127, h: 126 },
        { x: 130, y: 0, w: 127, h: 126 },
        { x: 257, y: 0, w: 127, h: 126 },
        { x: 386, y: 0, w: 127, h: 126 },
        { x: 513, y: 0, w: 127, h: 126 },
        { x: 641, y: 0, w: 127, h: 126 },
        { x: 770, y: 0, w: 127, h: 126 },
        { x: 897, y: 0, w: 127, h: 126 },

        { x: 3, y: 127, w: 127, h: 126 },
        { x: 130, y: 127, w: 127, h: 126 },
        { x: 257, y: 127, w: 127, h: 126 },
        { x: 386, y: 127, w: 127, h: 126 },
        { x: 513, y: 127, w: 127, h: 126 },
        { x: 641, y: 127, w: 127, h: 126 },
        { x: 770, y: 127, w: 127, h: 126 },
        { x: 897, y: 127, w: 127, h: 126 },

        { x: 3, y: 253, w: 127, h: 126 },
        { x: 130, y: 253, w: 127, h: 126 },
        { x: 257, y: 253, w: 127, h: 126 },
        { x: 386, y: 253, w: 127, h: 126 },
        { x: 513, y: 253, w: 127, h: 126 },
        { x: 641, y: 253, w: 127, h: 126 },
        { x: 770, y: 253, w: 127, h: 126 },
        { x: 897, y: 253, w: 127, h: 126 },

        { x: 3, y: 384, w: 127, h: 126 },
        { x: 130, y: 384, w: 127, h: 126 },
        { x: 257, y: 384, w: 127, h: 126 },
        { x: 386, y: 384, w: 127, h: 126 },
        { x: 513, y: 384, w: 127, h: 126 },
        { x: 641, y: 384, w: 127, h: 126 },
        { x: 770, y: 384, w: 127, h: 126 },
        { x: 897, y: 384, w: 127, h: 126 },

        { x: 3, y: 511, w: 127, h: 126 },
        { x: 130, y: 511, w: 127, h: 126 },
        { x: 257, y: 511, w: 127, h: 126 },
        { x: 386, y: 511, w: 127, h: 126 },
        { x: 513, y: 511, w: 127, h: 126 },
        { x: 641, y: 511, w: 127, h: 126 },
        { x: 770, y: 511, w: 127, h: 126 },
        { x: 897, y: 511, w: 127, h: 126 }

    ];

    this.totalSprites = this.sprites;

    this.remove = false;

}

Explosion.prototype.Update = function () {

};

Explosion.prototype.Draw = function () {

    if (!this.remove) {

        var sprite = this.sprites[this.ixSprite++];

        this.width = sprite.w;
        this.height = sprite.h;

        Helpers.AngleDraw(this.img, this.x, this.y, sprite.x, sprite.y, sprite.w, sprite.h, this.angle);
    }

};

Explosion.prototype.Queue = function () {

    //this.x = this.xPath;
    //this.y = this.yPath;

    if (this.x + this.width > globalWidth) {
        this.remove = true;
    }
    if (this.y + this.height > globalHeight) {
        this.remove = true;
    }
    if (this.x < 0) {
        this.remove = true;
    }
    if (this.y < 0) {
        this.remove = true;
    }

    this.remove = this.ixSprite + 1 >= this.sprites.length;

};
//#endregion
