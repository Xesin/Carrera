/* global XEngine Menu GamePlay*/

var textStyle = {
	font: 'PressStart',
	font_size: 20,
	font_color: 'white',
	
};

function initGame(argument) {
    var game = new XEngine.Game(1280,720, 'gameCanvas');
    
    game.frameLimit = 60;														
    game.setBackgroundColor('black');	
    game.scale.scaleType = XEngine.Scale.SHOW_ALL;
    game.scale.updateScale();
    game.state.add('loading', Loading);	
    game.state.add('menu', Menu);											//Añadimos el estado del menú
    game.state.add('game', GamePlay);
    game.state.start('loading');
}

var Loading = function (game) {
	this.porcentaje = null;
	this.circulo = null;
};

Loading.prototype = {
	
	preload: function () {														//Cargamos los assets del juego
		this.porcentaje = this.game.add.text(this.game.width/2,this.game.height/2, '0%',textStyle);
	    this.porcentaje.anchor.setTo(0.5);
	    this.circulo = this.game.add.circle(this.game.width/2,this.game.height/2, 100, 'red', 5, 'white', false,0, 0.1);
	    this.game.load.onCompleteFile.add(this.onCompleteFile, this);
	},
	
	start: function () {
		this.game.tween.add(this.porcentaje).to({alpha : 0}, 500, XEngine.Easing.Linear, true).onComplete.addOnce(function () {
			var webSocket = new WebSocket("ws://carrera-videoj-xferrer.c9users.io:9898");
			webSocket.onopen = function () {
				console.log("connected");
			};
			webSocket.onerror = function (error) {
				console.log(error);
			};
			webSocket.onmessage = function (e) {
				console.log('Server: ' + e.data);
			};
			/*var background = this.game.add.audio('background', true, -0.2);
			background.persist = true;
			background.loop(true);*/
			this.game.state.start('menu');
		}, this);
	},
	
	onCompleteFile: function (progress) {
		this.porcentaje.text = Math.round(progress * 100) + '%';
		this.circulo.endAngle = XEngine.Mathf.lerp(0.1,360, progress);
		this.circulo.strokeColor = XEngine.Mathf.lerpColor('#ff0000', '#00ff00', progress);
	}
};