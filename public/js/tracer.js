importScripts("https://cdn.rawgit.com/jankovicsandras/imagetracerjs/1aeb1b14/imagetracer_v1.1.2.js");

// https://developer.mozilla.org/en-US/docs/Web/API/ImageData/ImageData
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8ClampedArray

// https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/readPixels


onmessage = function(e) {
    console.log(e.data.pixels.length);
    console.log(e.data.width);
    console.log(e.data.height);
    var imageData = new ImageData(Uint8ClampedArray.from(e.data.pixels), e.data.width, e.data.height);
    var svgstr = ImageTracer.imagedataToSVG( imageData, { scale: 1 } );
    postMessage(svgstr);
}

