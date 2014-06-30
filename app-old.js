//#region Module dependencies
var Utils = require('./js/utils.js'),
    Tank = require("./js/Tank.js"),
	Missile = require("./js/Missile.js"),
    MissileManager = require("./js/MissileManager.js"),
    PlayerManager = require("./js/PlayerManager.js"),
    Configs = require("./config");

//#endregion

//#region includes
var express = require('express'),
    jshtml = require("jshtml-express"),
    routes = require('./routes'),
    user = require('./routes/user'),
    extend = require('extend'),
    routes_test = require('./routes/test'),
    http = require('http'),
    path = require('path');

//#endregion

//#region Setup Server/Engines 

// setup server/engines 
var app = express(),
    server = http.createServer(app),
    isDevelopment = 'development' == app.get('env'),
    io = require("socket.io").listen(server, {log: isDevelopment});

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine("jshtml", jshtml);
app.set("view engine", "jshtml");

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));



// development only
if (isDevelopment) {
  app.use(express.errorHandler());
}

app.get('/', function(req, res) {
    res.locals({
        title : 'Test!'
        , message : 'De groeten'
    });

    res.render('index');
});

app.get('/tank', function(req, res) {
    res.locals({
        title : 'Tank Game v1.0'
    });

    res.render('tank');
});
//#endregion 


//#region session objects
var players = [];

var missileManager = new MissileManager({
    missileUpdate: function(x, y, w, h, domId, isMissileDone){
        io.sockets.emit("missileUpdate", { 
            x: x, 
            y: y, 
            w: w, 
            h: h, 
            domId: domId, 
            isMissileDone: isMissileDone
        });
    }
});
var playerManager = new PlayerManager();
//#endregion

//#region socket info
io.sockets.on('connection', function (socket) {

    
    socket.on('disconnect', function () {
        
        playerManager.Remove(socket.id);

        // refresh screen when someone leaves
        io.sockets.emit("refreshBoard", {
            players: playerManager.players
        });

	});

    socket.on("startLoad", function(){
                
        var player = playerManager.Add(socket.id);

        socket.emit("load", {
            socketId: socket.id,
			slots: playerManager.gamePieces,
            players: playerManager.players
        });

        //io.sockets.emit("refreshBoard", { players: playerManager.players });

    });

	socket.on("startLogin", function(data){

		var gamePieceTitle = data.chosenTank,
			userName = data.userName;

		player = playerManager.Login(socket.id, userName, gamePieceTitle);

		socket.emit("beginSession", {
            player: player,
			players: playerManager.players
        });

	});

    socket.on("fireMissile", function(data){
        
        //x, y, movingLeft, movingUp, deg
        var domId = new Date().getTime();
        var newMissile = new Missile(data.x, data.y, data.movingLeft, data.movingUp, data.deg, domId);
        missileManager.Add(newMissile);
    });

    socket.on("moveTank", function(data){
        
        var moveDir = data.moveDirection;
        var playerData = playerManager.GetBySocketId(data.socketId);

        switch(moveDir){
            case "RIGHT": 
                playerData.tank.x += 10;
                break;
            case "LEFT": 
                playerData.tank.x -= 10;
                break;
            case "DOWN": 
                playerData.tank.y += 10;
                break;
            case "UP": 
                playerData.tank.y -= 10;
                break;
        }

        io.sockets.emit("updateTankDirection", playerData);

    });

    socket.on("moveBarrel", function(data){
        var moveDir = data.moveDirection;
        var playerData = playerManager.GetBySocketId(socket.id);
        
        switch(moveDir){
            
            case "LEFT":
                playerData.tank.degree -= 10;
                break;

            case "RIGHT":
                playerData.tank.degree += 10;
                break;
        
        }

        io.sockets.emit("updateGunDirection", playerData);

    });

});
//#endregion

//#region start up server
server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
//#endregion