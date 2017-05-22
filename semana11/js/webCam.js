/* global*/

var textStyle = {
	font: 'PressStart',
	font_size: 20,
	font_color: 'white',
	
};

function initWebCam(argument) {
    var game = new WebCam(1280,720, 'gameCanvas');
    game.start();
}

var WebCam = function (width, heigth, canvasId) {
	this.frameLimit = 120;
	/**
	 * Tiempo tiempo en el que se arrancó el juego
	 * 
	 * @property {Number} _startTime
	 * @readonly
	 * @private
	 */
	this._startTime = 0;
	/**
	 * Tiempo desde que se arrancó el juego
	 * 
	 * @property {Number} _elapsedTime
	 * @readonly
	 * @private
	 */
	this._elapsedTime = 0;
	/**
	 * Tiempo en el que transcurre el frame
	 * 
	 * @property {Number} frameTime
	 * @readonly
	 */
	this.frameTime = 0;
	/**
	 * Tiempo en el que transcurrió el último frame
	 * 
	 * @property {Number} previousFrameTime
	 * @readonly
	 */
	this.previousFrameTime = 0;
	/**
	 * Tiempo entre frames en segundos
	 * 
	 * @property {Number} deltaTime
	 * @readonly
	 */
	this.deltaTime = 0;
	/**
	 * Tiempo entre frames en milisegundos
	 * 
	 * @property {Number} deltaMillis
	 * @readonly
	 */
	this.deltaMillis = 0;
	
	WebCam._ref = this;
	
	var _this = this;
	this.canvas = document.getElementById(canvasId);
	this.ctx = this.canvas.getContext('2d');
	this.ctx.canvas.width = 400;
	this.ctx.canvas.height = 400;
	this.video = document.getElementById("videoElement");
	this.camLocalized = false;
	
	navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;
	
	if(navigator.getUserMedia) {
    	navigator.getUserMedia({audio: false, video: true},
    	function (stream) {
    		_this.video.src = window.URL.createObjectURL(stream);
    		_this.camLocalized = true;
    		},
    	function (e) {
    		console.log(e);
		});
	}
	
	
};

WebCam._updateCaller = function () {
	WebCam._ref.update();
};

WebCam.prototype = {
	
	start: function () {
		var _this = this;
		
		var canvas = document.createElement("canvas");
        canvas.width = this.ctx.canvas.width;
        canvas.height = this.ctx.canvas.height;
        
        this.ctx_webCam = canvas.getContext("2d");
		
		this.workers = new Array(4);
		this.createdWorkers = false;
		
	    this.numWorkers = this.workers.length;
	    this.finishedWorkers = this.numWorkers + 1;

		this.update();
	},
	
	render: function () {
		this.ctx.putImageData(this.thisFrame, 0,0);
		this.finishedWorkers++;
	},

	update: function () {
		var _this = this;
		
		if(window.requestAnimationFrame){
			window.requestAnimationFrame(WebCam._updateCaller);
		}else{
			clearTimeout(_this.timer);                       						//limpiamos el timer para que no se quede en memoria
			_this.timer = setTimeout(WebCam._updateCaller, _this.frameLimit / 1);
		}
		
		if(this.camLocalized && this.video.videoHeight != 0 && !this.cameraSetted){
			this.cameraSetted = true;
			this.canvas.width = this.video.videoWidth;
		    this.canvas.height = this.video.videoHeight;
		    this.ctx_webCam.canvas.width = this.video.videoWidth;
		    this.ctx_webCam.canvas.height = this.video.videoHeight;
		}
		
		if(!this.createdWorkers && this.cameraSetted){
		    
		    this.createdWorkers = true;
		    
		    var workerWidth = this.canvas.width;
		    var workerHeigth = this.canvas.height /4;
		    
		    var message = function (data) {
	    		_this.finishedWorkers ++;
	    		var frameData = data.data.frameData;
	    		var fromPixel = data.data.from;
	    		var toPixel = data.data.to;
	    		
	    		var thisFramedata = _this.thisFrame.data;
	    		for(var i = 0; i < _this.canvas.width; i++){
	    			for(var j = fromPixel; j <= toPixel; j++){
		    			var x = i * 4;
			    		var y = j * (_this.canvas.width * 4);
		            	var pos = x + y;
		    			thisFramedata[pos] = frameData[pos];
		                thisFramedata[pos+1] = frameData[pos+1];
		                thisFramedata[pos+2] = frameData[pos+2];
	    			}
	    		}
	    		if(_this.finishedWorkers >= _this.numWorkers){
	    			_this.render();
	    		}
	    	}
		    
	    	this.workers[0] = new Worker('js/worker_bw.js');
	    	this.workers[0].postMessage({type: 'setData', y:0, width: workerWidth, height: workerHeigth, canvasWidth: this.canvas.width});
	    	this.workers[0].onmessage = message;
	    	
	    	this.workers[1] = new Worker('js/worker_bw.js');
	    	this.workers[1].postMessage({type: 'setData', y:workerHeigth, width: workerWidth, height: workerHeigth, canvasWidth: this.canvas.width});
	    	this.workers[1].onmessage = message;
	    	
	    	this.workers[2] = new Worker('js/worker_bw.js');
	    	this.workers[2].postMessage({type: 'setData', y:workerHeigth*2, width: workerWidth, height: workerHeigth, canvasWidth: this.canvas.width});
	    	this.workers[2].onmessage = message;
	    	
	    	this.workers[3] = new Worker('js/worker_bw.js');
	    	this.workers[3].postMessage({type: 'setData', y:workerHeigth*3, width: workerWidth, height: workerHeigth, canvasWidth: this.canvas.width});
	    	this.workers[3].onmessage = message;
		}
		
		if(this.createdWorkers && this.finishedWorkers > this.numWorkers){
			if(this.canvas.height == 0) return;
			this.ctx_webCam.clearRect(0,0,this.canvas.width, this.canvas.height);
		    this.ctx_webCam.drawImage(this.video, 0, 0);
		    this.thisFrame = this.ctx_webCam.getImageData(0,0,this.canvas.width, this.canvas.height);
		    
		    var frameData = this.thisFrame.data;
		    this.finishedWorkers = 0;
		    this.workers[0].postMessage(frameData);
		    this.workers[1].postMessage(frameData);
		    this.workers[2].postMessage(frameData);
		    this.workers[3].postMessage(frameData);
		}
	}
};