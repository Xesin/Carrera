/* global Player Ball*/
var currentLevel = 1;
var GamePlay = function (game) {
	
	this.gameTime = 60;
	
	//estilos de texto
	this.textStyle = {
		font: 'PressStart',
		font_size: 10,
		font_color: 'white',
		stroke_width: 2,
		stroke_color: 'black'
	};
	
	this.timerStyle = {
		font: 'PressStart',
		font_size: 6,
		font_color: 'white',
		stroke_width: 2,
		stroke_color: 'black'
	};
};

GamePlay.GameStates = {
	PLAY: 0,
	TIMEUP: 1
};

GamePlay.prototype = {
	
	start: function () {
		//Arrancamos el sistema de físicas ya que lo vamos a necesitar
		this.game.physics.startSystem();
		
		//Ponemos todos los sprites
		this.setScene();
		
		//Estado actual de la partida
		this.gameState = GamePlay.GameStates.PLAY;
		
		//Le ponemos al player sus controles
		this.player1.setPlayerOneControls();
		this.player2.setPlayerTwoControls();
	},
	
	
	setScene: function () {
		
		//Suelo y el publico
		this.game.add.sprite(0,47, 'floor');
		this.game.add.sprite(0,0, 'publico');
		
		//Pared superior, se añade a parte de las otras porque nos tenemos que asegurar que está detrás de todo
		this.paredSuperior = this.game.add.sprite(160, 35, 'par_superior');
		this.paredSuperior.anchor.setTo(0.5, 0);
		this.game.physics.enablePhysics(this.paredSuperior);
		this.paredSuperior.body.restitution = 1;
		this.paredSuperior.body.bounds.height *= 0.2;
		this.paredSuperior.body.bounds.width *= 1.2;
		this.paredSuperior.body.immovable = true;
		
		//Agregamos los elementos de la partida (jugadores y disco)
		this.player1 = this.game.add.existing(new Player(this.game, 50,120, 'player1'));
		this.player2 = this.game.add.existing(new Player(this.game, 265,120, 'player2'));
		this.disc = this.game.add.existing(new Ball(this.game, 60, 120, 'disc', this));
		
		//creamos el grupo para las porterias
		this.porterias = this.game.add.group();
		
		//añadimos el cesped
		this.game.add.sprite(0, 207, 'cesped');
		
		//añadimos las porterias
		var lateralIzquierda = this.game.add.sprite(8, 40, 'lat_izquierda');
		this.game.physics.enablePhysics(lateralIzquierda);
		lateralIzquierda.body.immovable = true;
		lateralIzquierda.body.restitution = 1;
		lateralIzquierda.body.bounds.height *= 1.2;
		this.porterias.add(lateralIzquierda);
		
		var lateralDerecha = this.game.add.sprite(303, 40, 'lat_derecha');
		this.game.physics.enablePhysics(lateralDerecha);
		lateralDerecha.body.immovable = true;
		lateralDerecha.body.restitution = 1;
		lateralDerecha.body.bounds.height *= 1.2;
		this.porterias.add(lateralDerecha);
		
		//Añadimos la pared inferior
		this.paredInferior = this.game.add.sprite(160, 208, 'par_inferior');
		this.paredInferior.anchor.setTo(0.5, 1);
		this.game.physics.enablePhysics(this.paredInferior);
		this.paredInferior.body.restitution = 1;
		this.paredInferior.body.bounds.height *= 0.2;
		this.paredInferior.body.bounds.width *= 1.2;
		this.paredInferior.body.immovable = true;
		
		
		//Añadimos un rectángulo invisible que actue como collider para los jugadores
		this.red = this.game.add.rect(158,0, 5, 300, 'black');
		this.game.physics.enablePhysics(this.red);
		this.red.body.immovable = true;
		this.red.alpha = 0;
		
		//Velocidad inicial del disco
		this.disc.body.velocity.x = 100;
		this.disc.body.velocity.y = 100;
		
		//añadimos el juez de linea
		this.game.add.sprite(140, 175, 'juez');
		
		//Añadimos el marcador
		this.game.add.sprite(110, 0, 'marcador');
		
		//Colocamos el texto de puntuación y de tiempo
		this.score1 = this.game.add.text(136,23, '0', this.textStyle);
		this.score1.anchor.setTo(0.5);
		
		this.score2 = this.game.add.text(183,23, '0', this.textStyle);
		this.score2.anchor.setTo(0.5);
		
		this.timer = this.game.add.text(160, 26, this.gameTime.toString(), this.timerStyle);
		this.timer.anchor.setTo(0.5);
	},
	
	update: function (deltaTime) {
		if(this.gameState == GamePlay.GameStates.PLAY){
			//Reducimos el tiempo del contador
			this.gameTime -= deltaTime;
			
			//Llamamos al update de los jugadores
			this.player1.updatePlayer(deltaTime);
			this.player2.updatePlayer(deltaTime);
			
			//Actualizamos los textos de la puntuación
			this.score1.text = this.player1.score.toString();	
			this.score2.text = this.player2.score.toString();
			
			//Actualizamos el texto del temporizador
			this.timer.text = Math.ceil(this.gameTime).toString();
			if(this.gameTime <= 0){
				this.gameState = GamePlay.GameStates.TIMEUP;
			}
		}
		
	},
	
	physicsUpdate : function (deltaTime) {
		
		//Ejecutamos las colisiones y los overlaps
		//JUGADORES
		this.game.physics.collide(this.player1, this.paredInferior);
		this.game.physics.collide(this.player2, this.paredInferior);
		this.game.physics.collide(this.player1, this.paredSuperior);
		this.game.physics.collide(this.player2, this.paredSuperior);
		this.game.physics.collide(this.player1, this.red);
		this.game.physics.collide(this.player2, this.red);
		this.game.physics.collide(this.player1, this.porterias);
		this.game.physics.collide(this.player2, this.porterias);
		
		//DISCO
		this.game.physics.collide(this.disc, this.paredInferior);
		this.game.physics.collide(this.disc, this.paredSuperior);
		this.game.physics.overlap(this.disc, this.player1);
		this.game.physics.overlap(this.disc, this.player2);
		this.game.physics.overlap(this.disc, this.porterias);
	},
};