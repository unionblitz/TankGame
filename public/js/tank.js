//#region Tank
function Tank(x, y, color, angle, socketId, playerName) {

    var self = this;
            
    this.x = x,
    this.y = y,
    this.width = 0,
    this.height = 0,
    this.speed = 2.5,
    this.angle = Helpers.GetRadians(angle),
    this.xPath = Math.cos(this.angle) * this.speed,
    this.yPath = Math.sin(this.angle) * this.speed,
    this.color = color;
    this.damage = 0.0; // 0 = none; 0.5 = 50%; 1.0 = 100%
    this.socketId = socketId;
    this.playerName = playerName;

    this.img = global_imgs[color];
    this.isExploded = false;
    this.ixSprite = 0;

    this.sprites = [
        { x: 9, y: 7, w: 84, h: 112 }
    ];

    this.totalSprites = this.sprites;

    this.deadSprite = { x: 405, y: 10, w: 119, h: 126 };

    this.hits = [
        { x: 224, y: 10, w: 39, h: 32, show: false }, // upper left
        { x: 308, y: 10, w: 31, h: 32, show: false }, // lower left
        { x: 266, y: 10, w: 39, h: 32, show: false }, // upper right
        { x: 343, y: 10, w: 31, h: 32, show: false } // lower right
    ];

    this.remove = false;
    this.gun = new TankGun(this);

}

Tank.prototype.Update = function () {

    var self = this;
    var wasExploded = this.isExploded;
    this.isExploded = (this.damage >= 1.0);

    // if this tank just exploded, adjust the x/y to the size of the new dead sprite
    if (!wasExploded && this.isExploded) {
        this.x = this.x - 19;
        this.y = this.y - 12;
    }

};

Tank.prototype.GetXYCorners = function () {
    return {
        x1: this.x,                 y1: this.y,   // TOP LEFT CORNER
        x2: this.x + this.width,    y2: this.y,   // TOP RIGHT CORNER
        x3: this.x + this.width,    y3: this.y + this.height, // BOTTOM RIGHT CORNER
        x4: this.x,                 y4: this.y + this.height,
        xPivot: this.x + this.width / 2,
        yPivot: this.y + this.height / 2
                
    }; 
};

Tank.prototype.GetPolygonCoords = function () {
    var tankCorners = this.GetXYCorners();

    // we need to rotate the angle for some reason to get this to work correctly:
    var newDeg = Helpers.GetDegreesFromRadians(this.angle) + 90,
        newRad = Helpers.GetRadians(newDeg);

    var newTankCoords = Helpers.getRotatedCoordsForRect(
        tankCorners.x1, tankCorners.y1,
        tankCorners.x2, tankCorners.y2,
        tankCorners.x3, tankCorners.y3,
        tankCorners.x4, tankCorners.y4,
        -this.angle);
            
    return [
        { x: newTankCoords.x1, y: newTankCoords.y1 },
        { x: newTankCoords.x2, y: newTankCoords.y2 },
        { x: newTankCoords.x3, y: newTankCoords.y3 },
        { x: newTankCoords.x4, y: newTankCoords.y4 }
    ];
};

Tank.prototype.TakeDamage = function (hit) {
    switch (hit.horizontal) {
        case "left":
            switch (hit.vertical) {
                case "down": this.hits[1].show = true; break;
                case "up": this.hits[0].show = true; break;
            }
            break;
        case "right":
            switch (hit.vertical) {
                case "down": this.hits[3].show = true; break;
                case "up": this.hits[2].show = true; break;
            }
            break;
    }
            
    this.damage += 0.15;
    if (this.damage > 1.0) { this.damage = 1.0; }
};

Tank.prototype.Draw = function () {

    var self = this;

    if (!this.remove) {

        var sprite = null,
            canvasX = this.x,
            canvasY = this.y;

        if (this.isExploded) {
            sprite = this.deadSprite;
        } else {

            // loop back to beginning of sprite
            this.ixSprite = this.ixSprite >= this.sprites.length ? 0 : this.ixSprite;
            sprite = this.sprites[this.ixSprite++];
        }

        this.width = sprite.w;
        this.height = sprite.h;

        Helpers.AngleDraw(this.img, canvasX, canvasY, sprite.x, sprite.y, sprite.w, sprite.h, this.angle * -1);
                
        // text of tank name
        if (!this.isExploded) {
            var playerName = Helpers.IsUndefined(this.playerName) || !this.playerName ? "Machine" : this.playerName;
            var priorLineWidth = ctx.lineWidth;
            ctx.beginPath();
            ctx.fillStyle = "rgba(255,125,20,0.85)";
            ctx.font = "bold 20px Arial";
            ctx.lineWidth = 3;
            ctx.strokeStyle = "black";
            ctx.strokeText(playerName, this.x - 10, this.y - 25);
            ctx.fillText(playerName, this.x - 10, this.y - 25)
            ctx.closePath();
            ctx.lineWidth = priorLineWidth;
        }

        // the health bar
        if (!this.isExploded) {
            ctx.beginPath();
            ctx.rect(this.x - 10, this.y - 20, (1 - this.damage) * 100, 7);
            ctx.fillStyle = "rgba(0,255,0,0.75)";
            ctx.fill();
            ctx.closePath();
            ctx.beginPath();
            ctx.rect(this.x - 10 + (1 - this.damage) * 100, this.y - 20, this.damage * 100, 7);
            ctx.fillStyle = "rgba(255,0,0,0.75)";
            ctx.fill();
            ctx.closePath();
        }

        if (!this.isExploded) {

            // show 
            this.hits.forEach(function (hit, ix, arr) {

                if (hit.show) {

                    switch (ix) {

                        case 0: // upper left

                            // need to rotate the damage sprite around to the tank... not relative to the damage sprite itself...
                            ctx.save();

                            var xCenter = self.x + sprite.w / 2,
                                yCenter = self.y + sprite.h / 2,
                                xTopLeft = -sprite.w / 2,
                                yTopLeft = -sprite.h / 2;

                            ctx.translate(xCenter, yCenter);
                            ctx.rotate(self.angle);

                            ctx.drawImage(self.img, hit.x, hit.y, hit.w, hit.h, xTopLeft, yTopLeft + 6, hit.w, hit.h);

                            ctx.restore();

                            break;

                        case 1: // lower left

                            // need to rotate the damage sprite around to the tank... not relative to the damage sprite itself...
                            ctx.save();

                            var xCenter = self.x + sprite.w / 2,
                                yCenter = self.y + sprite.h / 2,
                                xTopLeft = -sprite.w / 2,
                                yTopLeft = -sprite.h / 2;

                            ctx.translate(xCenter, yCenter);
                            ctx.rotate(self.angle);

                            ctx.drawImage(self.img, hit.x, hit.y, hit.w, hit.h, xTopLeft + 1, yTopLeft + self.height - hit.h - 5, hit.w, hit.h);

                            ctx.restore();

                            break;

                        case 2: // upper right
                            //debugger;

                            // need to rotate the damage sprite around to the tank... not relative to the damage sprite itself...
                            ctx.save();

                            var xCenter = self.x + sprite.w / 2,
                                yCenter = self.y + sprite.h / 2,
                                xTopLeft = -sprite.w / 2,
                                yTopLeft = -sprite.h / 2;

                            ctx.translate(xCenter, yCenter);
                            ctx.rotate(self.angle);

                            ctx.drawImage(self.img, hit.x, hit.y, hit.w, hit.h, xTopLeft + self.width - hit.w, yTopLeft + 6, hit.w, hit.h);

                            ctx.restore();
                            break;

                        case 3: // lower right


                            // need to rotate the damage sprite around to the tank... not relative to the damage sprite itself...
                            ctx.save();

                            var xCenter = self.x + sprite.w / 2,
                                yCenter = self.y + sprite.h / 2,
                                xTopLeft = -sprite.w / 2,
                                yTopLeft = -sprite.h / 2;

                            ctx.translate(xCenter, yCenter);
                            ctx.rotate(self.angle);

                            ctx.drawImage(self.img, hit.x, hit.y, hit.w, hit.h, xTopLeft + self.width - hit.w, yTopLeft + self.height - hit.h - 5, hit.w, hit.h);

                            ctx.restore();
                            break;

                            break;

                    }
                }
            });

        }
        // debug mode
        if (global_debugging) {
            var tankCorners = this.GetXYCorners();

            // we need to rotate the angle for some reason to get this to work correctly:
            var newDeg = Helpers.GetDegreesFromRadians(this.angle) + 90,
                newRad = Helpers.GetRadians(newDeg);

            var newTankCoords = Helpers.getRotatedCoordsForRect(
                tankCorners.x1, tankCorners.y1,
                tankCorners.x2, tankCorners.y2,
                tankCorners.x3, tankCorners.y3,
                tankCorners.x4, tankCorners.y4,
                -this.angle);

            // tank rectangle:
            ctx.beginPath();
            ctx.strokeStyle = "red";
            Helpers.DrawRect(newTankCoords.x1, newTankCoords.y1, newTankCoords.x2, newTankCoords.y2, newTankCoords.x3, newTankCoords.y3, newTankCoords.x4, newTankCoords.y4);
            ctx.stroke();
            ctx.closePath();
        }
    }

};

Tank.prototype.Queue = function () {
};


//#endregion
