//#region Module dependencies
var Configs = require("./config");
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
    res.locals();
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

var Utils = require("./js/Utils.js"),
	Helpers = require("./js/Helpers.js"),
	Player = require("./js/Player.js"),
	Tank = require("./js/Tank.js"),
	PlayersManager = require("./js/PlayersManager.js"),
	MissilesManager = require("./js/MissilesManager.js"),
	ExplosionsManager = require("./js/ExplosionsManager.js");

var playersManager = new PlayersManager(),
	missilesManager = new MissilesManager(),
	explosionsManager = new ExplosionsManager();

//#endregion

//#region socket info
io.sockets.on('connection', function (socket) {
	
    var socketId = socket.id;

	// add player session to session collection
	var thePlayer = playersManager.Add(socketId);
	
    socket.on('disconnect', function () { 
	
		if (thePlayer.userName == null){
			console.log("Removing anonymous player (never logged in)");	
		} else {
			console.log("Removing the player: " + thePlayer.userName);
		}

		// when disconnecting, remove session
		playersManager.Remove(socketId); 
		
		LoadPlayers();
		
	});

	// when client wants their socket id, send it
    socket.on("getSocket", function(){
		console.info("Telling client the socket id: " + socketId);
        socket.emit("setSocket", { socketId: socketId });
    });

	// Step 1: set username
	socket.on("setUsername", function(data){
		console.log("Setting player's name to: " + data.userName);
        thePlayer.userName = data.userName;
	});
	
	// Step 2: set user tank
	socket.on("setPlayerTank", function(data){
		
		var xRange = { min: 100, max: 550 },
			yRange = { min: 100, max: 400 },
			randAngle = [0, -180].rand(),
			randX = Helpers.Rand(xRange.min, xRange.max), 
			randY = Helpers.Rand(yRange.min, yRange.max);
			
			/*
			thePlayer.tank.x = randX;
			thePlayer.tank.y = randY;
			thePlayer.tank.angle = randAngle;
			thePlayer.tank.gun = {
				angle : -randAngle,
				x: 0, 
				y: 0
			};
			*/
			
		thePlayer.tank = new Tank(randX, randY, data.tank.color, randAngle, socketId, thePlayer.userName);
		
	    //console.log("Setting player's tank information...");
		//console.log(thePlayer.tank);
	});
	
	// Step 3: create random coords for tank
	socket.on("LoadNewTank", function(){

		var xRange = { min: 100, max: 550 },
			yRange = { min: 100, max: 400 },
			randAngle = [0, -180].rand(),
			randX = Helpers.Rand(xRange.min, xRange.max), 
			randY = Helpers.Rand(yRange.min, yRange.max);
			
			thePlayer.tank.x = randX;
			thePlayer.tank.y = randY;
			thePlayer.tank.angle = randAngle;
			thePlayer.tank.gun = {
				angle : -randAngle,
				x: 0, 
				y: 0
			};
			
			/*
			console.log("Create random position for tank...");
			
			console.log({
				randX: randX,
				randY: randY,
				color: thePlayer.tank.color,
				angle: randAngle, 
				socketId: thePlayer.socketId, 
				userName: thePlayer.userName
			});
			*/
			
			socket.emit("LoadNewTank", {
				randX: randX,
				randY: randY,
				color: thePlayer.tank.color,
				angle: randAngle, 
				socketId: thePlayer.socketId, 
				userName: thePlayer.userName
			});
		
	});
	
	// Step 4: if player is requesting to move tank, record and broadcast new positions
	socket.on("UpdatePosition", function(data){
		
		data.angle = Helpers.GetDegreesFromRadians(data.angle);
		
		//console.log(thePlayer.userName + " is updating their position: x: " + data.x + ", y: " + data.y + ", a: " + data.angle + ";");
		
		// make sure there is a tank object for the current player
		if(!thePlayer.tank){
			LoadPlayers();
			return false;
		}
		
		var priorTankVals = {
                angle: thePlayer.tank.angle,
                y: thePlayer.tank.y,
                x: thePlayer.tank.x,
                gunAngle: thePlayer.tank.angle,
                gunY: thePlayer.tank.gun.y,
                gunX: thePlayer.tank.gun.x
            };

		var angle = data.angle,
			y = data.y,
			x = data.x,
			gunAngle = data.angle,
			gunX = data.x,
			gunY = data.y;
		
		thePlayer.tank.angle = angle;
		thePlayer.tank.y = y;
		thePlayer.tank.x = x;
		
		thePlayer.tank.gun.angle = gunAngle;
		thePlayer.tank.gun.x = gunX;
		thePlayer.tank.gun.y = gunY;
		
		 var playerTankPolygonCoords = thePlayer.tank.GetPolygonCoords();
            
		playersManager.players.forEach(function (player, ix, arr) {
			var opponentTank = player.tank;

			// determine if an unexploded tank (other than the current player) is intersecting the player's tank
			if (opponentTank 
				&& opponentTank != thePlayer.tank 
				&& !opponentTank.isExploded 
				&& !isNaN(playerTankPolygonCoords[0].x)) {

				opponentTankPolygonCoords = opponentTank.GetPolygonCoords();

				if (Helpers.DoPolygonsIntersect(playerTankPolygonCoords, opponentTankPolygonCoords)) {
					console.log("TANKS COLLIDED: " + thePlayer.tank.color + " and " + opponentTank.color + "... Resetting " + thePlayer.tank.color + "'s coordinates.");
					thePlayer.tank.angle = priorTankVals.angle;
					thePlayer.tank.y = priorTankVals.y;
					thePlayer.tank.x = priorTankVals.x;
					thePlayer.tank.gun.angle = priorTankVals.gunAngle;
					thePlayer.tank.gun.y = priorTankVals.gunY;
					thePlayer.tank.gun.x = priorTankVals.gunX;
				}
			}
		});
		
	});
	
	// clients can request player info (with tank coords)
	socket.on("LoadPlayers", function(){ LoadPlayers(); });
	
	// client wishes to fire a missile
	socket.on("Fire Missile", function(data){
		console.log(thePlayer.userName + " is firing a missile!");
		missilesManager.Add(thePlayer.tank);
		console.log("Total missiles now: " + missilesManager.missiles.length);
	});
	
	// for debugging
	socket.on("msg", function(data){ console.log("FROM CLIENT ("+data.socketId+"): " + data.msg); });
	
	// reusable functions
	function LoadPlayers(){
	
		var activePlayers = playersManager.GetActivePlayers();
		
		//console.log((thePlayer.userName || "(New User)") + " is asking for all the players (" + activePlayers.length + ")");
		
		io.sockets.emit("LoadPlayers", {
			players: activePlayers
		});
	}
	
});

//-------------------------------------------------------------------
// RUN THROUGH THE GAME LOOP (UPDATE, DRAW, QUEUE... REPEAT)
//-------------------------------------------------------------------
var gameData = {
	damage: [],
	tanks: [],
	update: {},
	draw: { 
		missiles: [], 
		explosions: [] 
	},
	queue: { 
		missiles: []
	}
};

//-------------------------------------------------------------------
// physics loop
//-------------------------------------------------------------------
setInterval(function(){
	
	// session data that gets passed back to clients
	gameData = {
		damage: [],
		tanks: [],
		update: {},
		draw: { 
			missiles: [], 
			explosions: [] 
		},
		queue: { 
			missiles: []
		}
	};
	
	// update
	missilesManager.missiles.forEach(function(objMissile, ix, arr){ objMissile.Update(); });
	explosionsManager.explosions.forEach(function(objExplosion, ix, arr){ objExplosion.Update(); });
	
	// draw
	missilesManager.missiles.forEach(function(objMissile, ix, arr){ gameData.draw.missiles.push(objMissile.Draw()); });	
	explosionsManager.explosions.forEach(function(objExplosion, ix, arr){ gameData.draw.explosions.push(objExplosion.Draw()); });	
	
	// queue
	missilesManager.missiles.forEach(function(objMissile, ix, arr){
		
		var missileHitInfo = objMissile.Queue(playersManager.GetTanks());
		var shouldRemove = objMissile.remove;
		
		gameData.queue.missiles.push({
			missileId: objMissile.id, 
			hitInfo: missileHitInfo,
			remove: shouldRemove
		});
		
		
		// if remove, create explosion and remove missile
		if (objMissile.remove) {

			if (missileHitInfo.hitTank) {
				missileHitInfo.hitTank.TakeDamage(missileHitInfo.hit);
			}
			var deg = Helpers.GetDegreesFromRadians(objMissile.angle);
				
			//#region x/y for explosion (we need to offset to compensate for the explosion sprite)
			var x = objMissile.width / 2 + objMissile.x - 50,
				y = objMissile.height / 2 + objMissile.y;

			if (x > Helpers.GlobalWidth) { x = Helpers.GlobalWidth - objMissile.width / 2; }
			if (x < 0) { x = objMissile.width / 2; }
			if (y > Helpers.GlobalHeight) { y = Helpers.GlobalHeight - objMissile.height / 2; }
			if (y < 0) { y = objMissile.height / 2; }

			switch (objMissile.direction.toUpperCase().trim()) {
				case "LEFT": x = objMissile.x - 127 / 2 + 20; y = objMissile.y - 11; break;
				case "UP LEFT": x = objMissile.x - 127 / 2 + 20; y = objMissile.y - 33; break;
				case "UP": x = objMissile.x - 127 / 2 + 48; y = objMissile.y - 33; break;
				case "UP RIGHT": x = objMissile.x - 127 / 2 + 62; y = objMissile.y - 33; break;
				case "RIGHT": x = objMissile.x - 127 / 2 + 55; y = objMissile.y - 5; break;
				case "DOWN RIGHT": x = objMissile.x - 127 / 2 + 48; y = objMissile.y + 3; break;
				case "DOWN": x = objMissile.x - 127 / 2 + 38; y = objMissile.y + 3; break;
				case "DOWN LEFT": x = objMissile.x - 127 / 2 + 38; y = objMissile.y + 3; break;
			}
				
			if (y < 0) y = -60;
			explosionsManager.Add(x, y, objMissile.angle, objMissile.id);
			//#endregion

			missilesManager.Remove(objMissile.id);
		}
		
	});			
	
	explosionsManager.explosions.forEach(function(objExplosion, ix, arr){	
		objExplosion.Queue();
	});
	
	var activePlayers = playersManager.GetActivePlayers();
	var activePlayerTanks = [];
	activePlayers.forEach(function(objPlayer, ix, arr){
		var playerTank = objPlayer.tank;
		activePlayerTanks.push({
			x: playerTank.x,
			y: playerTank.y,
			color: playerTank.color,
			angle: playerTank.angle,
			socketId: objPlayer.socketId,
			userName: objPlayer.userName,
		});
		gameData.damage.push({
			socketId: objPlayer.socketId,
			color: playerTank.color,
			damage: playerTank.damage,
			hits: playerTank.hits
		});
	});
		
	gameData.tanks = activePlayerTanks;
		
}, 1 / 66);

//-------------------------------------------------------------------
// server update loop
//-------------------------------------------------------------------
setInterval(function(){
			
	io.sockets.emit("LoadDrawData", {
		gameData: gameData
	});

}, 1 / 22);

//#endregion

//#region start up server
server.listen(app.get('port'), function(){
  //console.log('Express server listening on port ' + app.get('port'));
});
//#endregion