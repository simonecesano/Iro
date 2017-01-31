Iro.renderer = function(element){
    var e = $(element);

    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, preserveDrawingBuffer: true });
    this.renderer.setPixelRatio( window.devicePixelRatio );

    this.renderer.setSize( $(e).width(), $(e).height() );
    
    e.empty();
    e.append( this.renderer.domElement );

    this.interval = 0.1;
    this.scenes = [];

    return this;
}

Iro.renderer.prototype.render = function() {
    var renderer = this.renderer;
    var scenes = this.scenes;

    if (!scenes.length) { return };
    
    renderer.setClearColor( 0xffffff );
    renderer.setScissorTest( false );
    renderer.clear();
    renderer.setClearColor( 0xe0e0e0 );
    renderer.setScissorTest( true );    

    scenes.forEach( function( scene ) {
	scene.render();
    });

}

Iro.renderer.prototype.animate = function() {
    var iro = this;

    if (this.interval) {
	setTimeout( function() {
            requestAnimationFrame( function(){ iro.animate() });
	}, 1000 * iro.interval );
	iro.render()
    } else {
	iro.render()
    }
}
