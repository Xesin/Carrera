function drawBW(frameData){
    for(var i = 0; i < self.width; i++){
        var x = i * 4;
        for(var j = self.y; j < self.height + self.y; j++){
            var y = j * (self.canvasWidth * 4);
            var pos = x + y;
            
            if(self.paintedData[pos]){
                self.oldData[pos] = frameData[pos];
                self.oldData[pos+1] = frameData[pos+1];
                self.oldData[pos+2] = frameData[pos+2];
            }else{
                var sensibility = 20;
                if((self.oldData[pos] && ((frameData[pos] < self.oldData[pos] + sensibility && frameData[pos] > self.oldData[pos] - sensibility) || (frameData[pos+1] < self.oldData[pos+1] + sensibility && frameData[pos+1] > self.oldData[pos+1] - sensibility) || (frameData[pos+2] < self.oldData[pos+2] + sensibility && frameData[pos+2] > self.oldData[pos+2] - sensibility)) )){
                
                self.oldData[pos] = frameData[pos];
                self.oldData[pos+1] = frameData[pos+1];
                self.oldData[pos+2] = frameData[pos+2];
                
                frameData[pos] = frameData[pos];
                frameData[pos+1] = frameData[pos];
                frameData[pos+2] = frameData[pos];
                
                
                }else if(self.oldData[pos]){
                    
                    self.oldData[pos] = frameData[pos];
                    self.oldData[pos+1] = frameData[pos+1];
                    self.oldData[pos+2] = frameData[pos+2];
                    
                    /*frameData[pos] = 255;
                    frameData[pos+1] = 255;
                    frameData[pos+2] = 255;*/
                    
                    self.paintedData[pos] = true;
                }else{
                    self.oldData[pos] = frameData[pos];
                    self.oldData[pos+1] = frameData[pos+1];
                    self.oldData[pos+2] = frameData[pos+2];
                }
            }
            
            
        }
    }
    var fromPos = self.y;
    var toPos = self.y + self.height - 1;
    postMessage({frameData: frameData, from: fromPos, to: toPos});
}

onmessage = function (e) {
    if(e.data.type == 'setData'){
        self.x = e.data.x;
        self.y = e.data.y;
        self.width = e.data.width;
        self.height = e.data.height;
        self.canvasWidth = e.data.canvasWidth;
        self.canvasHeight = e.data.canvasHeight;
        self.oldData = new Array();
        self.paintedData = new Array();
        console.log("Data set correctly");
    }else{
        drawBW(e.data);
    }
};

