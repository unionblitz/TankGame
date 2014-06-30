//#region globals
window.requestAnimationFrame = window.requestAnimationFrame
    || window.mozRequestAnimationFrame
    || window.webkitRequestAnimationFrame
    || window.msRequestAnimationFrame;

var canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d"),
    globalWidth = 1000,
    globalHeight = 800,
    lastReqTime = null,
    global_keystate = {},
    global_debugging = false,
	global_socket = null,
	global_socket_id = null,
	global_imgs = { 
		red: new Image(), 
		blue: new Image(), 
		green: new Image(), 
		yellow: new Image(),
		loginBg: new Image(),
		imgBg: new Image(),
		missile: new Image(),
		explosion: new Image(),
		getPercentage: function(){
			var total = 0, 
				done = 0;
			
			for(var key in this){
				if ( typeof this[key] === "object" ){
					if (typeof this[key].isLoaded !== "undefined" && this[key].isLoaded) {
						done++;
					}
					total++;
				}
			}

			var percent = (done / total) * 100;
			return Math.round(percent * 100) / 100;			
		}
	},
    fps = null,
    socketUrl = "http://192.168.123.53:1337";

//#endregion
