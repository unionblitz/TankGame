
function Tank() {
    "use strict";
    
    this.gamePieceTitle = null,
        this.degree = 0,
        this.x = null,
        this.y = null,
        this.events = {
            FIRE: function(degree, x, y, movingLeft, movingUp){},
            MOVE_BARREL: function(moveDirection){},
            MOVE_TANK: function(moveDirection){}
        };
}

Tank.Refresh = function(tank){
    $(".arena div.t-" + tank.gamePieceTitle).remove();

    $("<div class='turret t-" + tank.gamePieceTitle + "'><div class='turret-gun'></div></div>").appendTo(".arena");
    var domGun = $(".arena div.t-" + tank.gamePieceTitle + " .turret-gun");



    // rotate the gun for each player appropriately
    domGun.css({ rotate: tank.degree + "deg" });
};


Tank.prototype.GetDom = function(){
    return $(".arena .t-" + this.gamePieceTitle);
};

Tank.prototype.getRotateCSS = function(deg){
    "use strict";
    return {'-webkit-transform': 'rotate(' + deg + 'deg)',
                    '-moz-transform': 'rotate(' + deg + 'deg)',
                    '-ms-transform': 'rotate(' + deg + 'deg)',
                    '-o-transform': 'rotate(' + deg + 'deg)',
                    'transform': 'rotate(' + deg + 'deg)'};
}

    
Tank.prototype.handleKeyUp = function(keyCode){
    "use strict";

    var domTurretGun = this.GetDom().find(".turret-gun");
    
    var offsetX = 0, offsetY = 0;

    var gunWidth = domTurretGun.width(),
                    gunHeight = domTurretGun.height(),
                    radians = this.degree * Math.PI / 180,
                    sideOffset = this.GetDom().position(),
                    turretHeight = this.GetDom().height(),
                    gunOffset = domTurretGun.position();

    var offsetX = 15; 
        offsetY = 19;


    var gunX = sideOffset.left + offsetX + Math.cos(radians),
        gunY = sideOffset.top + offsetY + Math.sin(radians);
    
    console.log(keyCode);

    switch(keyCode){

        case 68: // d
            this.events.MOVE_TANK("RIGHT");
            break;

        case 65: // a
            this.events.MOVE_TANK("LEFT");
            break;

        case 83: // s
            this.events.MOVE_TANK("DOWN");
            break;

        case 87: // w
            this.events.MOVE_TANK("UP");
            break;

        case 32: // spacebar                
        
            var movingLeft = (this.degree < -90 && this.degree > -270) || (this.degree > 90 && this.degree < 270);
            var movingUp = (this.degree < 0 && this.degree > -180);
            
            this.events.FIRE(this.degree, gunX, gunY, movingLeft, movingUp);

            return false;
            
            break;

        case 37: // left arrow
        case 38: // top arrow
            this.degree += 10;
            this.events.MOVE_BARREL("RIGHT");
            
            return false;
            break;

        case 39: // right arrow
        case 40: // bottom arrow
            
            this.degree -= 10;
            this.events.MOVE_BARREL("LEFT");

            //domGun.transition({ rotate: this.degree + "deg" });
            return false;
            break;
    }   

    return false;

}

Tank.prototype.debug = function () {
    "use strict";

    console.log("Gun Turret");
};


Tank.prototype.initialize = function (data) {
    "use strict";
    
    $(".arena div.t-" + data.tank.gamePieceTitle).remove();

    $("<div class='turret t-" + data.tank.gamePieceTitle + "'><div class='turret-gun'></div></div>").appendTo(".arena");

    $(".t-" + data.tank.gamePieceTitle).css({
        top: data.tank.y + "px",
        left: data.tank.x + "px"
    });

    this.gamePieceTitle = data.tank.gamePieceTitle;
    this.degree = data.tank.degree;

    var domGun = this.GetDom().find(".turret-gun"),
        domGunHeight = domGun.height(),
        domGunWidth = domGun.width(),
        domGunPosition = this.GetDom().position(),
        domGunX = domGunPosition.left,
        domGunY = domGunPosition.top;

    this.x = domGunX + domGunWidth;
    this.y = domGunY - (domGunHeight / 2);
    
    domGun.css({ 
        rotate: this.degree + "deg"
    });

    
    var self = this;
    $.extend(self.events, data);

    $(document).keyup(function(ev){
        if(!self.handleKeyUp(ev.which)){
            ev.preventDefault();
            return false;
        }
    });

};
