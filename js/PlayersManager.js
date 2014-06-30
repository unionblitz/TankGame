var Player = require("./Player.js");

function PlayersManager(){
	this.players = [];
}

PlayersManager.prototype.Add = function(socketId){
	var player = new Player(socketId);
	this.players.push(player);
	return player;
};

PlayersManager.prototype.Remove = function(socketId){
	var self = this;
	
	var newPlayers = [];
	
	this.players.forEach(function(obj, arr, ix){
		if(obj.socketId == socketId){
			// (don't add player to new list)
			console.log("Removing player!");
		} else {
			// add player to new list
			newPlayers.push(obj);
		}
	});
		
	// assign players collection to new list
	this.players = newPlayers;
	console.log("Removed player(?); Total now: " + this.players.length);
};

PlayersManager.prototype.Get = function(socketId){
	var self = this;
	var thePlayer = null;
	this.players.forEach(function(obj, arr, ix){
		if(obj.socketId == socketId){
			thePlayer = obj;
		}
	});
	return thePlayer;
};

PlayersManager.prototype.GetActivePlayers = function(){
	var arrActivePlayers = [];
	this.players.forEach(function(obj,arr,ix){
		if(obj.userName != null && obj.tank != null){
			arrActivePlayers.push(obj);
		}
	});
	return arrActivePlayers;
};

PlayersManager.prototype.GetTanks = function(){
	var arrTanks = [];
	this.GetActivePlayers().forEach(function(obj,ix, arr){
		arrTanks.push(obj.tank);
	});
	return arrTanks;
};

module.exports = PlayersManager;