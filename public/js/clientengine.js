//#region ClientEngine
function ClientEngine() {

    var self = this;
    
	this.v2Missiles = [];
	this.v2Explosions = [];
	
    this.socketId = null;
    global_socket = io.connect(socketUrl);
	this.socket = global_socket;
	
    this.socket.emit('getSocket');
    this.socket.on("setSocket", function(data){ 
		console.log("setting socket id");
		self.socketId = data.socketId; 
		global_socket_id = data.socketId; 
	});
	
	this.socket.on("LoadDrawData", function(data){
		if(self.clientTank != null){
			
			var newTankList = [];
			
			data.gameData.tanks.forEach(function(dataTank, arr, ix){
				
				if (dataTank.socketId == self.socketId){
					$.extend(self.clientTank, dataTank);
				}
				
				//Helpers.Log(player.socketId + ": " + player.tank.angle + "; " + player.tank.gun.angle);
				
				var theTank = new Tank(
					dataTank.x, 
					dataTank.y, 
					dataTank.color,
					dataTank.angle, 
					dataTank.socketId, 
					dataTank.userName
				);
				
				theTank.gun.angle = -Helpers.GetRadians(dataTank.angle);
				
				newTankList.push(theTank);
				
			});
		
			self.tanks = newTankList;
			
			self.v2Missiles = [],
			self.v2Explosions = [];
			
			data.gameData.draw.missiles.forEach(function(obj, ix, arr){
				var v2Missile = new V2_Missile(obj);
				if(!v2Missile.remove){
					//console.log("remove missile #" + (ix+1));
					self.v2Missiles.push(v2Missile);
				} 
			});
			
			data.gameData.draw.explosions.forEach(function(obj, ix, arr){
				var v2Explosion = new V2_Explosion(obj);
				if(!v2Explosion.remove){
					//console.log("remove explosion #" + (ix+1));
					self.v2Explosions.push(v2Explosion);
				} 
			});
			
			data.gameData.damage.forEach(function(obj, ix, arr){
				self.tanks.forEach(function(objTank, ixTank, arrTanks){
					if(objTank.socketId == obj.socketId){
						objTank.damage = obj.damage;
						objTank.hits = obj.hits;
					}
				});
			});
			
			//console.log(self.v2Missiles.length + " vs " + data.gameData.draw.missiles.length);
		}
	});
	
	// when user chooses tank, 
	// the server will create random position for the tank to be drawn on canvas
	this.socket.on("LoadNewTank", function(data){
		
		var theTank = new Tank(
			data.randX, 
			data.randY, 
			data.color,
			data.randAngle, 
			data.socketId, 
			data.userName
		);

		if(self.socketId == data.socketId){
			self.clientTank = theTank;
		}
		
		self.tanks.push(theTank);
		
		self.socket.emit('LoadPlayers');
		
	});
	
	// after the tank is drawn for the first time on the screen,
	// load the other tanks in the match
	self.socket.on("LoadPlayers", function(data){
		
		var newTankList = [];
		
		data.players.forEach(function(player, arr, ix){
			
			if (player.socketId == self.socketId){
				$.extend(self.clientTank, player.tank);
			}
			
			//Helpers.Log(player.socketId + ": " + player.tank.angle + "; " + player.tank.gun.angle);
			
			var theTank = new Tank(
				player.tank.x, 
				player.tank.y, 
				player.tank.color,
				player.tank.angle, 
				player.socketId, 
				player.userName
			);
			
			theTank.gun.angle = -Helpers.GetRadians(player.tank.angle);
			
			newTankList.push(theTank);
			
		});
		
		self.tanks = newTankList;
				
		//Helpers.Log("Total Tanks: " + newTankList.length + " ( " + data.players.length + ")");	
		
	});
	
		
    this.startTime = new Date().getTime();

    this.loginKeyManager = new LoginKeyManager();
    this.chooseTankManager = new ChooseTankManager();

    this.showFps = true;
    this.timer_missiles = null;

    this.tanks = [];

    //this.missiles = [];
    //this.explosions = [];

    this.KEY_SPACE = 32,
    this.KEY_UP = 87,
    this.KEY_DOWN = 83,
    this.KEY_LEFT = 65,
    this.KEY_RIGHT = 68,
    this.KEY_SHIFT = 16;

    this.clientTank = null;

    /*
    var xRange = { min: 100, max: 550 },
        yRange = { min: 100, max: 400 };

    this.clientTank = new Tank(Helpers.Rand(xRange.min, xRange.max), Helpers.Rand(yRange.min, yRange.max), "red", [0, -180].rand(), 343245345, "John Doe");
    
    this.tanks.push(this.clientTank);
            
    this.tanks.push(new Tank(Helpers.Rand(xRange.min, xRange.max), Helpers.Rand(yRange.min, yRange.max), "blue", [0, -180].rand()));

    */
            
            

    $(document).keydown(function (ev) {
        //console.log(ev.keyCode);
        global_keystate[ev.keyCode || ev.which] = true;
    }).keyup(function (ev) {
        global_keystate[ev.keyCode || ev.which] = false;
        global_keystate["LAST_KEY_INFO"] = {
            val: ev.keyCode || ev.which,
            stamp: new Date().getTime()
        };
    });

}

ClientEngine.prototype.Loop = function () {
    this.Clear();
    this.Update();
    this.Draw();
    this.Queue();

    if (!lastReqTime) {
        lastReqTime = new Date().getTime();
        fps = 0;
    }

    var delta = (new Date().getTime() - lastReqTime) / 1000;
    lastReqTime = new Date().getTime();
    fps = 1 / delta;

    if (this.showFps) {
        ctx.font = "10px Georgia";
        ctx.fillStyle = "#ff0";
        ctx.fillText(parseInt(fps, 10) + "fps", globalWidth - 40, 12);
        ctx.fillStyle = "#0f0";
        ctx.fillText(parseInt(delta * 1000, 10) + "ms", globalWidth - 40, 27);
    }

};

ClientEngine.prototype.Clear = function () {
    ctx.clearRect(0, 0, globalWidth, globalHeight);
};

ClientEngine.prototype.Update = function () {
	
	/*
    this.missiles.forEach(function (obj, ix, arr) {
        obj.Update();
    });

    this.explosions.forEach(function (obj, ix, arr) {
        obj.Update();
    });
	*/
	
    this.tanks.forEach(function (obj, ix, arr) {
        obj.Update();
    });

    this.tanks.forEach(function (obj, ix, arr) {
        obj.gun.Update();
    });

};

ClientEngine.prototype.Draw = function () {

    // show the name screen
    if (this.clientTank == null){
            
        //console.log("draw");
        ctx.beginPath();
				
        if (global_imgs.getPercentage() >= 100) { 
            
            ctx.drawImage(global_imgs.loginBg, 0, 0); 

            if(!this.loginKeyManager.isDone){

                this.loginKeyManager.Draw(lastReqTime);

            } else if (!this.chooseTankManager.isDone){
                
                this.chooseTankManager.Draw(this.loginKeyManager.userCharacters);

            }else{
				console.log("LOAD NEW TANK!!");
				global_socket.emit("LoadNewTank");
            }
        } else {
            var txtLoading = "LOADING: " + global_imgs.getPercentage() + "%";
            var textMeasurement = ctx.measureText(txtLoading);
            var txtCoords = {x: globalWidth / 2 - 455, y: globalHeight / 2};
            ctx.font = "60px 'Press Start 2P', Georgia";
            ctx.fillStyle = "#fff";
            ctx.strokeStyle = "#000";
            ctx.lineWidth = 10;
            ctx.strokeText(txtLoading, txtCoords.x, txtCoords.y);
            ctx.fillText(txtLoading, txtCoords.x, txtCoords.y);        
        }
        
        ctx.closePath();        

        
    } 
    // draw the tank field/tanks
    else {
        ctx.beginPath();

		ctx.drawImage(global_imgs.imgBg, 0, 0);
        
        ctx.lineWidth = 1;
        ctx.strokeStyle = "#000";
        ctx.rect(0, 0, globalWidth, globalHeight);
        ctx.stroke();

        // draw the "exploded"/dead tanks
        this.tanks.forEach(function (obj, ix, arr) {
            if (obj.isExploded) {
                obj.Draw();
            }
        });

        this.tanks.forEach(function (obj, ix, arr) {
            if (!obj.isExploded) {
                obj.Draw();
                obj.gun.Draw();
            }
        });

		this.v2Missiles.forEach(function(obj,ix,arr){
			obj.Draw();
		});
		
		this.v2Explosions.forEach(function(obj,ix,arr){
			obj.Draw();
		});
		
		/*
        this.missiles.forEach(function (obj, ix, arr) {
            obj.Draw();
        });

        this.explosions.forEach(function (obj, ix, arr) {
            obj.Draw();
        });
		*/
		
    }
    

};

ClientEngine.prototype.Queue = function () {

    var self = this;

    //if (this.tanks.length == 0) {
    //    this.tanks.push(new Tank(200, 300, "red", 180));
    //}

    if (this.clientTank == null){
    
        if(!this.loginKeyManager.isDone){
            this.loginKeyManager.Queue(global_keystate["LAST_KEY_INFO"]);
        } else {
            this.chooseTankManager.Queue(global_keystate["LAST_KEY_INFO"], this.loginKeyManager.doneStamp);
        }
        

    } else {
        if (global_keystate[this.KEY_SPACE]) {

            if (this.timer_missiles != null) {
                clearTimeout(this.timer_missiles);
            }

            this.timer_missiles = setTimeout(function () {

                self.tanks.forEach(function (obj, ix, arr) {
                    if (obj.color == self.clientTank.color) {
					
						global_socket.emit("Fire Missile");
					
                        //self.missiles.push(new Missile(obj));
                    }
                });

            }, 50);

        }

        var speed = global_keystate[this.KEY_SHIFT] ? 3 : 1;
            
        var newTankAngle = null, newTankX = null, newTankY;

        if (global_keystate[this.KEY_LEFT] && global_keystate[this.KEY_UP]) { // up + left

            newTankAngle = Helpers.GetRadians(-135);
            newTankY = this.clientTank.y - speed;
            newTankX = this.clientTank.x - speed;
                
        }
        else if (global_keystate[this.KEY_LEFT] && global_keystate[this.KEY_DOWN]) { // down + left

            newTankAngle = Helpers.GetRadians(-45);
            newTankY = this.clientTank.y + speed;
            newTankX = this.clientTank.x - speed;

        } else if (global_keystate[this.KEY_RIGHT] && global_keystate[this.KEY_UP]) { // up + right

            newTankAngle = Helpers.GetRadians(135);
            newTankY = this.clientTank.y - speed;
            newTankX = this.clientTank.x + speed;

        } else if (global_keystate[this.KEY_RIGHT] && global_keystate[this.KEY_DOWN]) { // down + right

            newTankAngle = Helpers.GetRadians(45);
            newTankY = this.clientTank.y + speed;
            newTankX = this.clientTank.x + speed;

        }
        else {

            if (global_keystate[this.KEY_UP]) {

                newTankAngle = Helpers.GetRadians(180);
                newTankY = this.clientTank.y - speed;
                newTankX = this.clientTank.x;
                tankMoved = true;
            }

            if (global_keystate[this.KEY_DOWN]) {

                newTankAngle = Helpers.GetRadians(0);
                newTankY = this.clientTank.y + speed;
                newTankX = this.clientTank.x;
                tankMoved = true;

            }

            if (global_keystate[this.KEY_LEFT]) {

                newTankAngle = Helpers.GetRadians(-90);
                newTankY = this.clientTank.y;
                newTankX = this.clientTank.x - speed;
                tankMoved = true;

            }

            if (global_keystate[this.KEY_RIGHT]) {

                newTankAngle = Helpers.GetRadians(90);
                newTankY = this.clientTank.y;
                newTankX = this.clientTank.x + speed;
                tankMoved = true;

            }
        }
		
        if (this.clientTank != null && !isNaN(newTankAngle)) {

            var priorTankVals = {
                angle: this.clientTank.angle,
                y: this.clientTank.y,
                x: this.clientTank.x,
                gunAngle: -this.clientTank.angle,
                gunY: this.clientTank.gun.y,
                gunX: this.clientTank.gun.x
            };

            if (newTankX < 0) { newTankX = this.clientTank.x; }
            if (newTankY < 0) { newTankY = this.clientTank.y; }
            if (newTankY + this.clientTank.height > globalHeight) { newTankY = globalHeight - this.clientTank.height; }
            if (newTankX + this.clientTank.width > globalWidth) { newTankX = globalWidth - this.clientTank.width; }

            // catch all scenario (i.e. a bug occurred)
            if (newTankX < 0) { newTankX = 1; }
            if (newTankY < 0) { newTankY = 1; }

            if (newTankAngle != null) {

				//console.log("Move tank... a: " + newTankAngle + "; x: " + newTankX + "; y: " + newTankY);

				global_socket.emit("UpdatePosition", {
					angle : newTankAngle,
					y : newTankY,
					x : newTankX
				});

				/*
                this.clientTank.angle = newTankAngle;
                this.clientTank.y = newTankY;
                this.clientTank.x = newTankX;
                this.clientTank.gun.angle = -newTankAngle;
                this.clientTank.gun.y = newTankY;
                this.clientTank.gun.x = newTankX;
				
                var firstTankPolygonCoords = this.clientTank.GetPolygonCoords();
            
                this.tanks.forEach(function (obj, ix, arr) {
                    if (obj != self.clientTank && !obj.isExploded && !isNaN(firstTankPolygonCoords[0].x)) {

                        secondTankPolygonCoords = obj.GetPolygonCoords();

                        if (Helpers.DoPolygonsIntersect(firstTankPolygonCoords, secondTankPolygonCoords)) {
                            console.log(firstTankPolygonCoords[0].x);
                            self.clientTank.angle = priorTankVals.angle;
                            self.clientTank.y = priorTankVals.y;
                            self.clientTank.x = priorTankVals.x;
                            self.clientTank.gun.angle = priorTankVals.gunAngle;
                            self.clientTank.gun.y = priorTankVals.gunY;
                            self.clientTank.gun.x = priorTankVals.gunX;
                        }
                    }
                });

				*/

            }

        }

		/*
        this.missiles.forEach(function (obj, ix, arr) {
            var hitInfo = obj.Queue(self.tanks);
                
            // if remove, create explosion and remove missile
            if (obj.remove) {

                if (hitInfo.hitTank) {
                    hitInfo.hitTank.TakeDamage(hitInfo.hit);
                }
                var deg = Helpers.GetDegreesFromRadians(obj.angle);
                    
                // 0 <---> -90 => right, top right, up
                // 225 <---> 180 => top left, left
                // 90 <---> 135 => bottom left, bottom
                // 45 <---> 0 => bottom right, right


                //#region x/y for explosion (we need to offset to compensate for the explosion sprite)
                var x = obj.width / 2 + obj.x - 50,
                    y = obj.height / 2 + obj.y;

                if (x > globalWidth) { x = globalWidth - obj.width / 2; }
                if (x < 0) { x = obj.width / 2; }
                if (y > globalHeight) { y = globalHeight - obj.height / 2; }
                if (y < 0) { y = obj.height / 2; }

                switch (obj.direction.toUpperCase().trim()) {
                    case "LEFT": x = obj.x - 127 / 2 + 20; y = obj.y - 11; break;
                    case "UP LEFT": x = obj.x - 127 / 2 + 20; y = obj.y - 33; break;
                    case "UP": x = obj.x - 127 / 2 + 48; y = obj.y - 33; break;
                    case "UP RIGHT": x = obj.x - 127 / 2 + 62; y = obj.y - 33; break;
                    case "RIGHT": x = obj.x - 127 / 2 + 55; y = obj.y - 5; break;
                    case "DOWN RIGHT": x = obj.x - 127 / 2 + 48; y = obj.y + 3; break;
                    case "DOWN": x = obj.x - 127 / 2 + 38; y = obj.y + 3; break;
                    case "DOWN LEFT": x = obj.x - 127 / 2 + 38; y = obj.y + 3; break;
                }
                    
                if (y < 0) y = -60;
                    
                self.explosions.push(new Explosion(x, y, obj.angle, obj.id));
                //#endregion

                self.missiles.splice(ix, 1);
            }
	
        });
		*/
		
        this.tanks.forEach(function (obj, ix, arr) {
            obj.gun.Queue();
        });
		
		/*
        this.explosions.forEach(function (obj, ix, arr) {
            obj.Queue();
            if (obj.remove) { self.explosions.splice(ix, 1); }
        });
		*/
		
    }

    window.requestAnimationFrame(function () {
        self.Loop()
    });
};

clientEngine = new ClientEngine();
clientEngine.Loop();

//#endregion
