var Helpers = require("./Helpers.js"),
	Tank = require("./Tank.js");

function Player(socketId){
    this.socketId = socketId;
    this.userName = null;
	this.tank = null;
}

module.exports = Player;