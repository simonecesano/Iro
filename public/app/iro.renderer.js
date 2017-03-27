Iro.renderer = function(element, renderer){
    var e = $(element);

    if (renderer !== undefined) {
	// console.log('here');
	this.renderer = renderer;
    } else {
	this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, preserveDrawingBuffer: true });
	this.renderer.setPixelRatio( window.devicePixelRatio );
    }
    if (element === undefined) { element = $('<div></div>') }
    
    this.renderer.setSize( $(e).width(), $(e).height() );
    
    $(e).empty();
    $(e).append( this.renderer.domElement );

    this.interval = 0.01;
    this.scenes = [];
    this.domElement = this.renderer.domElement;

    return this;
}

Iro.renderer.prototype.setDOMelement = function(e){
    this.renderer.setSize( $(e).width(), $(e).height() );
    
    $(e).empty();
    $(e).append( this.renderer.domElement );

    this.domElement = this.renderer.domElement;

    return this;
}
