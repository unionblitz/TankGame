function PlayerScreen(slots, players, actions){

	var self = this;

	this.slots = slots;
    this.players = players;

	this.chosenTank = null;
	this.userName = null;
	this.actions = $.extend({
		StartGame: function(chosenTank, playerName){}
	}, actions);
}

PlayerScreen.prototype.GetPlayerBySocketId = function(socketId){
    var result = null;

    for(var ix = 0; ix < this.players.length; ix++){
        var p = this.players[ix];
        if(p.socketId == socketId){
            return p;
        }
    }  
};

PlayerScreen.prototype.ChooseTank = function(){

	var self = this;
	
	var getTankStatus = function(pieceTitle){
        var currentSocketId = self.GetGamePiece(pieceTitle).socketId;
		return currentSocketId != null ? { txt: "disabled", id: currentSocketId } : { txt: "enabled", id: null };
	};

	var GetGamePieceHtml = function(pieceTitle){
        var tankStat = getTankStatus(pieceTitle);
        
        var currentOccupiedUserTxt = "";
        if(tankStat.id != null){
            var p = self.GetPlayerBySocketId(tankStat.id);
            var uN = p.userName == null ? p.socketId : p.userName;
            currentOccupiedUserTxt = "<span>" + uN + "</span>";
        }
		return "<a href='#' class='pieceLink'><div class='piece piece-" + pieceTitle + " " + tankStat.txt + "' data-id='" + pieceTitle + "'>"
			+ "<b></b>"
			+ "<i></i>"
            + currentOccupiedUserTxt
			+ "</div><u></u></a>";
	};

	$(".arena .player-select-screen").remove();
	
	var markup = "<div class='player-select-screen'><section>"
		+ GetGamePieceHtml("red")
		+ GetGamePieceHtml("green")
		+ GetGamePieceHtml("blue")
		+ GetGamePieceHtml("yellow")				
	+ "</section></div>";
	
	$(markup).appendTo(".arena");
	$("<div class='player-select-screen-title'>Choose your tank</div>").appendTo(".arena");

	$(".pieceLink").click(function(){
		var chosenTankPiece = $(this).find(">div").attr("data-id");
		self.chosenTank = chosenTankPiece;
		self.FillInUsername();
	});
};

PlayerScreen.prototype.FillInUsername = function(){
	
	var self = this;

	$(".player-select-screen-title").attr("style", "color: " + this.chosenTank + ";").text("What's Your Username");
	$(".player-select-screen > section > *").remove();
	
	$("<div class='player-username-form'>"
		+ "<a href='#' class='btnBack'>&lt;-</a>"
		+ "<input type='text' class='txtUserName' placeholder='John Doe' />"
		+ "<a href='#' class='btnPlay'>-&gt;</a>"
	+ "</div>").appendTo(".player-select-screen > section");
	
	$(".player-username-form input").focus();

	$(".player-username-form .btnBack").click(function(){
		self.ChooseTank();
	});

	$(".player-username-form .btnPlay").click(function(){
		self.actions.StartGame(self.chosenTank, $(".player-username-form input").val());
	});
};

PlayerScreen.prototype.GetGamePiece = function(pieceTitle){
	var result = $(this.slots).filter(function(){
		return (this.title == pieceTitle);
	});

    return (result.length > 0) ? result[0] : null;
};