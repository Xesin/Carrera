/* global XEngine Player Ball*/
var currentLevel = 1;
var GamePlay = function (game) {
	this.player = null;
	this.ball = null;
	this.bricks = null;
	this.textStyle = {
		font: 'PressStart',
		font_size: 20,
		font_color: 'white',
		stroke_width: 8,
		stroke_color: 'black'
	};
};

GamePlay.prototype = {
	
	start: function () {
		
	},
	
	update : function (deltaTime) {
		
	},
};