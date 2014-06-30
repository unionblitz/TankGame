function LoginKeyManager(){
    this.blinkState = false;
    this.startTime = new Date().getTime();
    this.lastKeyStamp = null;
    this.userCharacters = "";
    this.isDone = false;
    this.doneStamp = null;
	
	
	// preload images
	var preloadImage = function(key, imgSrc){
		global_imgs[key].isLoaded = false;
		global_imgs[key].onload = function(){
			global_imgs[key].isLoaded = true;
			//Helpers.Log(key + " img preloaded! (Total Preloaded: " + global_imgs.getPercentage() + "%)");
			console.log(key + " img preloaded! (Total Preloaded: " + global_imgs.getPercentage() + "%)");
		};
		global_imgs[key].src = imgSrc;
	};
	
	// preload tanks, backgrounds and game aux images
	[ 
		{ title: "red", file: "./img/tank-red.png" }, 
		{ title: "blue", file: "./img/tank-blue.png" }, 
		{ title: "green", file: "./img/tank-green.png" }, 
		{ title: "yellow", file: "./img/tank-yellow.png" }, 
		{ title: "loginBg", file: "./img/orangeBg.jpg" }, 
		{ title: "imgBg", file: "./img/mud_bg.jpg" },
		{ title: "missile", file: "./img/missile.png" },
		{ title: "explosion", file: "./img/explosion.png" }
	].forEach(function(bgSrc, ix, arr){
		
		setTimeout(function(){
		
			preloadImage(bgSrc.title, bgSrc.file);
		
		}, ix * 250);
		
	});
		
}

LoginKeyManager.prototype.Draw = function(lastReqTime){

    ctx.font = "68px 'Press Start 2P', Georgia";
    ctx.fillStyle = "#fff";
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 10;
    ctx.strokeText("TANKS GAME", 55, 135);
    ctx.fillText("TANKS GAME", 55, 135);        

    var txtLoading = "What's Your Name?";
    var textMeasurement = ctx.measureText(txtLoading);
    var txtCoords = {x: globalWidth / 2 - 340, y: globalHeight / 2 - 55};
            
    ctx.font = "38px 'Press Start 2P', Georgia";
    ctx.fillStyle = "#fff";
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 10;
    ctx.strokeText(txtLoading, txtCoords.x, txtCoords.y);
    ctx.fillText(txtLoading, txtCoords.x, txtCoords.y);        

    var helpText = "( Use keyboard to input name )";
    ctx.font = "11px 'Press Start 2P', Arial";
    ctx.fillStyle = "#ff0";
    ctx.strokeStyle = "#232323";
    ctx.lineWidth = 2;
    ctx.strokeText(helpText, txtCoords.x, txtCoords.y +30);
    ctx.fillText(helpText, txtCoords.x, txtCoords.y + 30);   


    if(this.userCharacters.substr(0,1) == "t"){
        this.userCharacters = this.userCharacters.substr(1);
    }

    if (lastReqTime){
                
        var delta = (new Date().getTime() - this.startTime);
        var txtCoords = {x: globalWidth / 2 - 340, y: globalHeight / 2 - 15};
        

        //this.blinkState = doBlink ? !this.blinkState : this.blinkState;
        var offsetDelta = parseInt(delta > 500 ? delta.toString().slice(-3) : delta, 10);
        this.blinkState = offsetDelta > 500;
        var blinker = this.blinkState ? "_" : "";
                
        var reachedMaxLength = this.userCharacters.length >= 10;

        ctx.font = "48px 'Press Start 2P', Arial";
        ctx.fillStyle = "#ff0";
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 10;
        
        var width = 60, 
            charLength = this.userCharacters.length,
            xPos = txtCoords.x + 30,
            yPos = txtCoords.y + 160;

        for(var ix = 0; ix < charLength; ix++){
        
            var c = this.userCharacters[ix];    
            if (c==="t"){continue;}
            ctx.strokeText(c, xPos + width * (ix), yPos);
            ctx.fillText(c, xPos + width * (ix), yPos); 

        }

        ctx.fillStyle = reachedMaxLength ? "#f00" : "#ff0";
        ctx.strokeText(blinker, xPos + charLength * width, yPos);
        ctx.fillText(blinker, xPos + charLength * width, yPos);

    }

    if(this.userCharacters.length > 0){
        ctx.font = "25px 'Press Start 2P', Georgia";
        enterTextColor = "rgb(255,255,0)";
        ctx.fillStyle = enterTextColor;
        ctx.strokeStyle = "rgb(0,0,0)";
        ctx.lineWidth = 10;
        ctx.strokeText("PRESS ENTER -->", txtCoords.x + 350, txtCoords.y + 300);
        ctx.fillText("PRESS ENTER -->", txtCoords.x + 350, txtCoords.y+ 300);        
    }
};


LoginKeyManager.prototype.Queue = function(lastKeyState){
    
    if(typeof lastKeyState !== "undefined"){
            var elapsedKeyTime = new Date().getTime() - lastKeyState.stamp;
            if(elapsedKeyTime <= 150 && (this.lastKeyStamp == null || this.lastKeyStamp != lastKeyState.stamp)){

                // if user presses delete, remove last character
                if (lastKeyState.val == 8 && this.userCharacters.length > 0) {
                    this.userCharacters = this.userCharacters.substring(0, this.userCharacters.length - 1);
                }
                // if user presses enter, move on to next screen (if character(s) added)
                if (lastKeyState.val == 13 && this.userCharacters.length > 0) {
                    this.isDone = true;
                    this.doneStamp = new Date().getTime();
					global_socket.emit("setUsername", {
						socketId: global_socket_id,
						userName: this.userCharacters
					});
                }
                else if (lastKeyState.val == 32 && this.userCharacters.length > 0 && this.userCharacters.length < 10) {
                        this.userCharacters += " ";
                }
                else{
                    var theCharacter = String.fromCharCode(lastKeyState.val);
                    if(theCharacter.search(/[^A-Za-z]/) == -1 && this.userCharacters.length < 10){
                        //console.log(lastKeyState);
                        if(this.userCharacters.substr(0,1) == "t"){
                            this.userCharacters = this.userCharacters.substr(1);
                        }
                        this.userCharacters += theCharacter;
                    }

                }

                
                

                this.lastKeyStamp = lastKeyState.stamp;
            }
        }

};
