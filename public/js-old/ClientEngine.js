var socketUrl = "http://192.168.123.53:1337",
    clientEngine = null;

function ClientEngine() {
    "use strict";

    this.id = null, // filled by initialize
    this.socket = null, // filled by initialize
    this.tank = null;
	this.playerScreen = null;
    this.initialize();
}

ClientEngine.prototype.debug = function(){
    "use strict";
    
    return {
        id: id
    };
}

ClientEngine.prototype.RefreshBoard = function(data){
    
    // clean up the board
    $(".arena *").remove();

    // update each game piece
    for(var ix = 0; ix < data.players.length; ix++){

        var player = data.players[ix];
        Tank.Refresh(player.tank);

    }
    
};


ClientEngine.prototype.initialize = function(){
    "use strict";

    var self = this;

    this.socket = io.connect(socketUrl);

    this.socket.emit('startLoad');
    

    this.socket.on("refreshBoard", function (data) {
        self.RefreshBoard(data);
    });

    this.socket.on("beginSession", function(data){
        $(".player-select-screen-title").fadeOut(function(){
            $(".player-select-screen").fadeOut(function(){
                $(".player-select-screen-title, .player-select-screen").remove();
                self.tank = new Tank();
        
                self.tank.initialize(
                    $.extend({
                        FIRE: function(deg, x, y, movingLeft, movingUp){
                            self.socket.emit("fireMissile", {
                                x: x, 
                                y: y, 
                                movingLeft: movingLeft, 
                                movingUp: movingUp, 
                                deg: deg
                            });
                            //self.missiles.push(new Missile(x, y, movingLeft, movingUp, deg));
                        },
                        MOVE_BARREL: function(moveDirection){
                            self.socket.emit("moveBarrel", { moveDirection: moveDirection });
                        },
                        MOVE_TANK: function(moveDirection){
                            self.socket.emit("moveTank", { moveDirection: moveDirection, socketId: self.id });
                        }
                    }, data.player)
                );


            });
        });
    });

    // step 1: show choose tank screen and the username/login screen
    this.socket.on("load", function (data) {

        self.id = data.socketId;
		
		this.playerScreen = new PlayerScreen(data.slots, data.players, {
			
            // step 2: log into the server and wait to load the board
            StartGame: function(chosenTank, userName){
				self.socket.emit("startLogin", {
					chosenTank: chosenTank,
					userName: userName
				});
			}
		});

		this.playerScreen.ChooseTank();

        
        
    });

    this.socket.on("missileUpdate", function(data){
        
        if($("#" + data.domId).length == 0){

            var cssStyle = "style='width: {0}px; height: {1}px; left: {2}px; top: {3}px;'"
                            .replace("{0}", data.w)
                            .replace("{1}", data.h)
                            .replace("{2}", data.x)
                            .replace("{3}", data.y);

            $("<div class='missile' id='" + data.domId + "' " + cssStyle + "></div>").appendTo(".arena");

        } else {
            $("#" + data.domId).css({
                top: data.y + "px",
                left: data.x + "px"
            });
        }

        if(data.isMissileDone){
            $("#" + data.domId).remove();
        }

    });

    this.socket.on("updateGunDirection", function(dataPlayer){
        var domGun = $(".arena .t-" + dataPlayer.tank.gamePieceTitle + " .turret-gun");
        domGun.transition({ rotate: dataPlayer.tank.degree + "deg" });
    });

    this.socket.on("updateTankDirection", function(dataPlayer){
        var domTank = $(".arena .t-" + dataPlayer.tank.gamePieceTitle);
        domTank.transition({ 
            x: dataPlayer.tank.x, 
            y: dataPlayer.tank.y 
        });
    });

}



$(function () {    
    clientEngine = new ClientEngine();
});