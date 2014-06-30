function Missile(startX, startY, movingLeft, movingUp, angle){
    
    this.x = startX,
        this.y = startY,
        this.speed = 10,
        this.height = 20,
        this.width = 20,
        this.movingLeft = movingLeft, 
        this.movingUp = movingUp,
        this.refreshRate = 10, // in milliseconds
        this.angle = angle,
        this.domId = new Date().getTime();

    var radians = this.GetRadians(this.angle);
    this.offsetX = Math.cos(radians) * this.speed,
    this.offsetY = Math.sin(radians) * this.speed;


    if($("#" + this.domId).length == 0){

        var cssStyle = "style='width: {0}px; height: {1}px; left: {2}px; top: {3}px;'"
                            .replace("{0}", this.width)
                            .replace("{1}", this.height)
                            .replace("{2}", this.x)
                            .replace("{3}", this.y);

        $("<div class='missile' id='" + this.domId + "' " + cssStyle + "></div>").appendTo(".arena");
        $("#" + this.domId).css({
            top: this.y + "px",
            left: this.x + "px"
        });
    }

    this.Move();
}

Missile.prototype.GetRadians = function(angle){
    return angle * Math.PI / 180;
};


Missile.prototype.Move = function(){
    //debugger;
    this.x += this.offsetX;
    this.y += this.offsetY;
    this.arenaPadding = 2;

    var doneX = false,
        doneY = false;

    if (this.movingLeft){ if(this.x + this.width < 0){ doneX = true; } } 
    else { if(this.x - this.width > 800){ doneX = true; } }

    if (this.movingUp){ if(this.y + this.height < 0){ doneY = true; } } 
    else { if(this.y - this.height > 600){ doneY = true; } }
    
    //console.log({
    //    mL: this.movingLeft,
    //    x: doneX,
    //    mU: this.movingUp,
    //    y: doneY
    //});

    if (!doneX && !doneY){
    
        if($("#" + this.domId).length == 0){

            $("<div class='missile' id='" + this.domId + "'></div>").appendTo(".arena");
            $("#" + this.domId).css({
                top: this.y + "px",
                left: this.x + "px"
            });
        } else {
            $("#" + this.domId).css({
                top: this.y + "px",
                left: this.x + "px"
            });
        }
        
        var self = this;

        setTimeout(function(){
            self.Move();
        }, this.refreshRate);

    } else {
        $("#" + this.domId).remove();
    }

    
}