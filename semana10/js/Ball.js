/*globals XEngine*/

var Ball = function (game, posX, posY, sprite, state) {
    //Llamamos al constructor padre para heredar todas sus funciones
    XEngine.Sprite.call(this, game, posX, posY, sprite);
    
    //Ponemos el anclaje al centro del sprite
    this.anchor.setTo(0.5);
    
    //Lo escalamos un poco porque el sprite es muy grande en relación al resto de objetos
    this.scale.setTo(0.7);
    
     //activamos las físicas para este objeto
    game.physics.enablePhysics(this);
    
    //Desactivamos la gravedad
    this.body.gravity = 0;
    
    //Le ponemos 0 de fricción porque no queremos perder velocidad con el paso del tiempo
    this.body.staticFriction = 0;
    
    //Le asignamos una velocidad máxima
    this.body.maxVelocity = 300;
    
    //Acotamos los bounds del objeto para que se ajusten a lo que queremos
    this.body.bounds.width *= 0.6;
    this.body.bounds.height *= 0.6;
    
    //Le ponemos restitución a 1 porque no queremos perder velocidad al chocar
    this.body.restitution = 1;
    
    //variables a usar
    this.ballVelocity = 260;
    this.lastPlayer = null;
    this.state = state;
};

Ball.prototype = Object.create(XEngine.Sprite.prototype);
Ball.constructor = Ball;

Ball.prototypeExtends = {
    
    update: function (deltaTime) {
        
    },
    
    //Lanza el disco a un angulo y guarda una referencia del jugador que lo ha lanzado
    launch: function (angle, player) {
          this.lastPlayer = player;
          var toRads = Math.PI / 180;
          this.body.velocity.x = this.ballVelocity * Math.cos(angle * toRads);
          this.body.velocity.y = this.ballVelocity * Math.sin(angle * toRads);;
    },
    
    onOverlap:function (other) {
        //Si hace overlap con el jugador que no ha lanzado el disco se, se actualiza la posición a la posición del jugador
        if(Player.prototype.isPrototypeOf(other) && this.lastPlayer != other){
            this.body.velocity.x = 0;
            this.body.velocity.y = 0;
            this.body.position.x = other.position.x;
            this.body.position.y = other.position.y;
            other.hasBall = true;
            other.ball = this;
        }else if(!Player.prototype.isPrototypeOf(other)){                       //En caso contrario es una portería y según su posición se añaden puntos a un jugador a otro
            if(this.position.x > this.game.width / 2){
                if(this.position.y > 89 && this.position.y < 166){
                    this.state.player1.score += 3;
                }else{
                    this.state.player1.score += 5;
                }
                this.body.position.x = this.state.player2.position.x;
                this.body.position.y = this.state.player2.position.y;
            }else{
                if(this.position.y > 89 && this.position.y < 166){
                    this.state.player2.score += 3;
                }else{
                    this.state.player2.score += 5;
                }
                this.body.position.x = this.state.player1.position.x;
                this.body.position.y = this.state.player1.position.y;
            }
        }
    },
    
};

Object.assign(Ball.prototype, Ball.prototypeExtends);