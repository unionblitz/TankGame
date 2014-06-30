var Missile = require("./Missile.js");

function MissilesManager(){
	this.missiles = [];
}

MissilesManager.prototype.Add = function(fromTank){
	var missile = new Missile(fromTank);
	this.missiles.push(missile);
	return missile;
};

MissilesManager.prototype.Remove = function(id){
	var self = this;
	
	var newmissiles = [];
	
	this.missiles.forEach(function(obj, arr, ix){
		if(obj.id != id){
			// add missile to new list
			newmissiles.push(obj);
		}
	});
		
	// assign missiles collection to new list
	this.missiles = newmissiles;
	console.log("Removed missile(?); Total now: " + this.missiles.length);
};

MissilesManager.prototype.Get = function(socketId){
	var self = this;
	var theMissile = null;
	this.missiles.forEach(function(obj, arr, ix){
		if(obj.socketId == socketId){
			theMissile = obj;
		}
	});
	return theMissile;
};

module.exports = MissilesManager;