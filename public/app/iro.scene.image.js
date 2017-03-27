Iro.scene.prototype.readPixels = function(){
    var renderer = this.renderer;
    var gl = renderer.domElement.getContext("webgl")
    // https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/readPixels
    var pixels = new Uint8Array(gl.drawingBufferWidth * gl.drawingBufferHeight * 4);
    gl.readPixels(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight, gl.RGBA, gl.UNSIGNED_BYTE, pixels);

    var clamped = new Uint8ClampedArray(pixels);
    return clamped;
}

Iro.scene.prototype.getSize = function(){
    var renderer = this.renderer;
    var gl = renderer.domElement.getContext("webgl")

    // console.log(gl.drawingBufferWidth);
    // console.log(gl.drawingBufferHeight);

    return {
	width:  gl.drawingBufferWidth,
	height: gl.drawingBufferHeight
    }
}



Iro.scene.prototype.getImage = function(x, y, width, height){
    var gl = this.renderer.domElement.getContext("webgl")

    var s = 4.2;
    
    x = x ? (x * s) | 0 : 0;
    y = y ? (y * s) | 0 : 0;

    width =  width  ? (width * s)  | 0 : gl.drawingBufferWidth;
    height = height ? (height * s) | 0 : gl.drawingBufferHeight;

    // console.log(x, y, width, height);
    
    // gl.viewport(x, y, width, height);
    // gl.scissor(x, y, width, height);

    // var pixels = new Uint8Array(gl.drawingBufferWidth * gl.drawingBufferHeight * 4);
    var pixels = new Uint8Array(width * height * 4);
    // console.log(pixels.length);
    
    // gl.readPixels(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
    gl.readPixels(x, y, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
    // pixels = pixels.reverse();

    // var imageData = new ImageData(Uint8ClampedArray.from(pixels), gl.drawingBufferWidth, gl.drawingBufferHeight);
    var imageData = new ImageData(Uint8ClampedArray.from(pixels), width, height);
    return imageData;
}

Iro.scene.prototype.toImgNode = function(){
    var imgData = this.renderer.domElement.toDataURL();
    imgNode = document.createElement("img");
    imgNode.src = imgData;
    return imgNode;
}

Iro.scene.prototype.toCanvas = function(canvas){
    var gl = this.renderer.domElement.getContext("webgl")

    var f = gl.drawingBufferWidth / $(window).width();
    
    canvas.width  = gl.drawingBufferWidth;
    canvas.height = gl.drawingBufferHeight;

    var o = this.element.offset()
    
    var ctx = canvas.getContext('2d');

    ctx.drawImage(gl.canvas, 0, 0, canvas.width, canvas.height);
    ctx.rect(o.left * f, o.top * f, this.element.width() * f, this.element.height() * f);
    ctx.stroke(); 
}
    
