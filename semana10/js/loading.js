/* global XEngine Menu GamePlay*/

var textStyle = {
	font: 'PressStart',
	font_size: 10,
	font_color: 'white',
	
};

function initGame(argument) {
    var game = new XEngine.Game(320,224, 'gameCanvas');
    game.canvas.imageSmoothingEnabled= false;
    game.frameLimit = 60;														
    game.setBackgroundColor('black');	
    
    //Establecemos como se va a escalar el juego
    game.scale.scaleType = XEngine.Scale.SHOW_ALL;
    game.scale.updateScale();
    
    //Añadimos los estados del juego
    game.state.add('loading', Loading);	
    game.state.add('game', GamePlay);
    
    //Empezamos la carga
    game.state.start('loading');
}

var Loading = function (game) {
	this.porcentaje = null;
	this.circulo = null;
};

Loading.prototype = {
	
	preload: function () {														//Cargamos los assets del juego
	
		//Pequeña animación de carga
		this.porcentaje = this.game.add.text(this.game.width/2,this.game.height/2, '0%',textStyle);
	    this.porcentaje.anchor.setTo(0.5);
	    this.circulo = this.game.add.circle(this.game.width/2,this.game.height/2, 50, 'red', 5, 'white', false,0, 0.1);
	    
	    //Asignamos el callback de archivo completado
	    this.game.load.onCompleteFile.add(this.onCompleteFile, this);
	    
	    //Añadimo los archivos a la cola de descarga
	    this.game.load.image('floor', 'img/Suelo.png');
	    this.game.load.image('juez', 'img/Juez.png');
	    this.game.load.image('lat_derecha', 'img/Lateral_Derecha.png');
	    this.game.load.image('lat_izquierda', 'img/Lateral_Izquierda.png');
	    this.game.load.image('par_superior', 'img/ParedSuperior.png');
	    this.game.load.image('par_inferior', 'img/Pared_Inferior.png');
	    this.game.load.image('cesped', 'img/cesped.png');
	    this.game.load.image('player1', 'img/spiderman.png');
	    this.game.load.image('player2', 'img/wolverine.png');
	    this.game.load.image('disc', 'img/disco.png');
	    this.game.load.image('publico', 'img/Publico.png');
	    this.game.load.image('marcador', 'img/Marcador.png');
	},
	
	start: function () {
		this.game.tween.add(this.porcentaje).to({alpha : 0}, 500, XEngine.Easing.Linear, true).onComplete.addOnce(function () {
			this.game.state.start('game');
		}, this);
	},
	
	onCompleteFile: function (progress) {
		//Actualizamos la animación
		this.porcentaje.text = Math.round(progress * 100) + '%';
		this.circulo.endAngle = XEngine.Mathf.lerp(0.1,360, progress);
		this.circulo.strokeColor = XEngine.Mathf.lerpColor('#ff0000', '#00ff00', progress);
	}
};