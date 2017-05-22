/*globals XEngine*/

var Player = function (game, posX, posY, sprite) {
    //Llamamos al constructor padre para heredar todas sus funciones
    XEngine.Sprite.call(this, game, posX, posY, sprite);
    
    //Input inicial
    this.playerInput = this.player1Input;
    this.playerKeyDown = this.player1KeyDown;
    
    //Ponemos el anclaje al centro del sprite
    this.anchor.setTo(0.5);
    
    //Lo escalamos un poco porque el sprite es muy grande en relación al resto de objetos
    this.scale.setTo(0.7);
    
    //activamos las físicas para este objeto
    game.physics.enablePhysics(this);
    
    //Acotamos los bounds del objeto para que se ajusten a lo que queremos
    this.body.bounds.width *= 0.7;
    this.body.bounds.height *= 0.6;
    
    //Desactivamos la gravedad
    this.body.gravity = 0;
    
    //ponemos una fricción muy alta para que no patine demasiado
    this.body.staticFriction = 600;
    
    //Variables a usar
    this.playerVelocity = 100;
    this.hasBall = false;
    this.ball = null;
    this.score = 0;
    
    //Añadimos el evento al apretar una tecla
    game.input.onKeyDown.add(this.onKeyDown, this);
};

Player.prototype = Object.create(XEngine.Sprite.prototype);
Player.constructor = Player;

Player.prototypeExtends = {
    
    updatePlayer: function (deltaTime) {
        //Actualizamos el imput de movimiento
        if(!this.hasBall){
            this.playerInput();
        }
    },
    
    onKeyDown: function (event) {
        //Llamamos al envento keyDown
        this.playerKeyDown(event);
    },
    
    setPlayerOneControls : function () {
        this.playerInput = this.player1Input;
        this.playerKeyDown = this.player1KeyDown;
    },
    
    setPlayerTwoControls : function () {
        this.playerInput = this.player2Input;
        this.playerKeyDown = this.player2KeyDown;
    },
    
    player1Input: function () {
      if(this.game.input.isPressed(XEngine.KeyCode.S)){                         //Se mueve abajo
            this.body.velocity.y = this.playerVelocity;
        }else if(this.game.input.isPressed(XEngine.KeyCode.W)){                 //Se mueve arriba
            this.body.velocity.y = -this.playerVelocity;
        }
        if(this.game.input.isPressed(XEngine.KeyCode.A)){                       //Se mueve izquierda
            this.body.velocity.x = -this.playerVelocity;
        }else if(this.game.input.isPressed(XEngine.KeyCode.D)){                 //Se mueve derecha
            this.body.velocity.x = this.playerVelocity;
        }
    },
    
    player2Input: function (input) {
      if(this.game.input.isPressed(XEngine.KeyCode.DOWN)){
            this.body.velocity.y = this.playerVelocity;
        }else if(this.game.input.isPressed(XEngine.KeyCode.UP)){
            this.body.velocity.y = -this.playerVelocity;
        }
        if(this.game.input.isPressed(XEngine.KeyCode.LEFT)){
            this.body.velocity.x = -this.playerVelocity;
        }else if(this.game.input.isPressed(XEngine.KeyCode.RIGHT)){
            this.body.velocity.x = this.playerVelocity;
        }
    },
    
    player1KeyDown: function (event) {
        if(this.hasBall){
    		if(event.keyCode == XEngine.KeyCode.J){                             //RECTO
                this.hasBall = false;
                this.ball.launch(0, this); 
                this.ball = null;
    		}
    		if(event.keyCode == XEngine.KeyCode.K){                             //ABAJO PICADO
                this.hasBall = false;
                this.ball.launch(60, this); 
                this.ball = null;
    		}
    		if(event.keyCode == XEngine.KeyCode.L){                             //ABAJO
    		    this.hasBall = false;
                this.ball.launch(40, this); 
                this.ball = null;
    		}
    		if(event.keyCode == XEngine.KeyCode.I){                             //ARIBA PICADO
                this.hasBall = false;
                this.ball.launch(300, this);
                this.ball = null;
    		}
    		if(event.keyCode == XEngine.KeyCode.O){                             // ARRIBA
    		    this.hasBall = false;
                this.ball.launch(320, this);
                this.ball = null;
    		}
        }
    },
    
    player2KeyDown: function (event) {
        if(this.hasBall){
    		if(event.keyCode == XEngine.KeyCode.PAD4){                          //RECTO
                this.hasBall = false;
                this.ball.launch(180, this); 
                this.ball = null;
    		}
    		if(event.keyCode == XEngine.KeyCode.PAD2){                          //ABAJO PICADO
                this.hasBall = false;
                this.ball.launch(120, this); 
                this.ball = null;
    		}
    		if(event.keyCode == XEngine.KeyCode.PAD1){                          //ABAJO
    		    this.hasBall = false;
                this.ball.launch(140, this); 
                this.ball = null;
    		}
    		if(event.keyCode == XEngine.KeyCode.PAD8){                          //ARIBA PICADO
                this.hasBall = false;
                this.ball.launch(240, this);
                this.ball = null;
    		}
    		if(event.keyCode == XEngine.KeyCode.PAD7){                          // ARRIBA
    		    this.hasBall = false;
                this.ball.launch(220, this);
                this.ball = null;
    		}
        }
    }
    
};

Object.assign(Player.prototype, Player.prototypeExtends);