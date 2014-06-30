var Explosion = require("./Explosion.js");

function ExplosionsManager(){
	this.explosions = [];
}

ExplosionsManager.prototype.Add = function(x, y, angle, fromMissile){
	var explosion = new Explosion(x, y, angle, fromMissile);
	this.explosions.push(explosion);
	return explosion;
};

ExplosionsManager.prototype.Remove = function(id){
	var self = this;
	
	var newexplosions = [];
	
	this.explosions.forEach(function(obj, arr, ix){
		if(obj.id != id){
			// add explosion to new list
			newexplosions.push(obj);
		}
	});
		
	// assign explosions collection to new list
	this.explosions = newexplosions;
	console.log("Removed explosion(?); Total now: " + this.explosions.length);
};

ExplosionsManager.prototype.Get = function(socketId){
	var self = this;
	var theExplosion = null;
	this.explosions.forEach(function(obj, arr, ix){
		if(obj.socketId == socketId){
			theExplosion = obj;
		}
	});
	return theExplosion;
};

module.exports = ExplosionsManager;