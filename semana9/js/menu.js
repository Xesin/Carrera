/* global XEngine textStyle*/

var Menu = function (game) {

};

Menu.prototype = {
	
	start: function () {
		var text = this.game.add.text(this.game.width/2, this.game.height/2, 'Start', textStyle);
		text.anchor.setTo(0.5);
		text.alpha = 0;
		text.inputEnabled = true;
		text.onClick.addOnce(function () {
			this.game.state.start('game');
		}, this);
		this.game.tween.add(text).to({alpha: 1.0}, 700, XEngine.Easing.ExpoOut, true, 700);
	},
	
};