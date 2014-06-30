function ChooseTankManager(){
    
    this.isDone = false;
    this.lastKeyStamp = null;
    this.cursorBlock = { x: 110, y: 410, w: 104, h: 132};
    this.selectedTankIndex = 0;

    var self = this;
    
    this.tanks = [
        ChooseTankManager.CreateTank("red", "Soviets"),
        ChooseTankManager.CreateTank("blue", "'Murica"),
        ChooseTankManager.CreateTank("green", "Green"),
        ChooseTankManager.CreateTank("yellow", "Yellow")
    ];

    this.tanks[0].isSelected = true;
}

ChooseTankManager.CreateTank = function(color, name){
    var theTank = {};
    theTank.img = global_imgs[color];
    theTank.color = color;
    theTank.sprite = { x: 9, y: 7, w: 84, h: 112 };
    theTank.width = theTank.sprite.w;
    theTank.height = theTank.sprite.h;
    theTank.img.onload = function () { theTank.img.isLoaded = true; };
    theTank.gun = new TankGun(theTank);
    theTank.name = name;
    theTank.isSelected = false;
    return theTank;
};

ChooseTankManager.prototype.Draw = function(userName){

    ctx.font = "68px 'Press Start 2P', Georgia";
    ctx.fillStyle = "#fff";
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 10;
    ctx.strokeText("TANKS GAME", 55, 135);
    ctx.fillText("TANKS GAME", 55, 135);

    ctx.font = "28px 'Press Start 2P', Georgia";
    ctx.fillStyle = "#ff0";
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 5;
    ctx.strokeText("Welcome, " + userName + "!", 55, 265);
    ctx.fillText("Welcome, " + userName + "!", 55, 265);

    ctx.font = "38px 'Press Start 2P', Georgia";
    ctx.fillStyle = "#ff0";
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 5;
    ctx.strokeText("CHOOSE A TANK:", 55, 365);
    ctx.fillText("CHOOSE A TANK:", 55, 365);

    ctx.font = "18px 'Press Start 2P', Georgia";
    ctx.fillStyle = "#ff0";
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 5;
    ctx.strokeText("( Use Arrow keys, then press Enter )", 60, 589);
    ctx.fillText("( Use Arrow keys, then press Enter )", 60, 589);


    this.tanks.forEach(function(obj, ix, arr){
        obj.x = 120 + (ix * 150);
        obj.y = 420;
        obj.gun.x = obj.x;
        obj.gun.y = obj.y;
        obj.angle = 0;
        Helpers.AngleDraw(obj.img, 120 + (ix * 150), 420, obj.sprite.x, obj.sprite.y, obj.sprite.w, obj.sprite.h, Helpers.GetRadians(obj.angle));
        obj.gun.Draw();

        if(obj.isSelected){

            ctx.font = "28px 'Press Start 2P', Georgia";
            ctx.fillStyle = obj.color;
            ctx.strokeStyle = "#000";
            ctx.lineWidth = 5;
            ctx.strokeText(obj.name, 585, 359);
            ctx.fillText(obj.name, 585, 359);


        }



    });
    

    ctx.beginPath();
    ctx.rect(this.cursorBlock.x + (150 * this.selectedTankIndex), this.cursorBlock.y, this.cursorBlock.w, this.cursorBlock.h);
    ctx.fillStyle = "rgba(255,255,0,0.2)";
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = "rgba(155,155,155,0.7)";
    ctx.stroke();
    ctx.closePath();


};

ChooseTankManager.prototype.GetSelectedTank = function(){
    var chosenTank = null;
    this.tanks.forEach(function(obj,ix,arr){
        //Helpers.AngleDraw(obj.img, 400, 400, obj.sprite.x, obj.sprite.y, obj.sprite.w, obj.sprite.h, -90);
        if(obj.isSelected){
            chosenTank = obj;
        }
    });
    return chosenTank;
};

ChooseTankManager.prototype.Queue = function(lastKeyState, priorScreenTimeStamp){
    
    if(typeof lastKeyState !== "undefined"){
        var elapsedKeyTime = new Date().getTime() - lastKeyState.stamp;
        if(elapsedKeyTime <= 150 && (this.lastKeyStamp == null || this.lastKeyStamp != lastKeyState.stamp)){
            
            switch(lastKeyState.val){
                //left
                case 37:
                case 65:
                    this.selectedTankIndex -= 1;
                    break;

                // right
                case 39:
                case 68:
                    this.selectedTankIndex += 1;
                    break;

                // enter key
                case 13:
                    var diff = new Date().getTime() - priorScreenTimeStamp;
                    if(diff > 1000){ 
						this.isDone = true; 
					
						var chosenTank = this.GetSelectedTank();
						
						global_socket.emit("setPlayerTank", {
							socketId: global_socket_id,
							tank: {
								color: chosenTank.color,
								width: chosenTank.width,
								height: chosenTank.height	
							}
						});

					}
                    break;
            }
            
            if(this.selectedTankIndex < 0){this.selectedTankIndex = 0;}
            if(this.selectedTankIndex >= this.tanks.length){this.selectedTankIndex = this.tanks.length-1;}

            this.tanks.forEach(function(obj,arr,ix){ obj.isSelected = false; });

            this.tanks[this.selectedTankIndex].isSelected = true;

            this.lastKeyStamp = lastKeyState.stamp;
        }
    }

    
    this.tanks.forEach(function(obj,ix,arr){
        //Helpers.AngleDraw(obj.img, 400, 400, obj.sprite.x, obj.sprite.y, obj.sprite.w, obj.sprite.h, -90);
        obj.gun.Queue();
    });
};