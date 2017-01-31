Iro.scene = function(element, renderer) {
    this.element = element;
    this.renderer = renderer;

    this.frame = undefined;
    
    this.obj = undefined;
    
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color( 0xffffff );
    this.interval = 0.1;
    
    this.camera = undefined;
    this.offsets = { x: 0, y: 0, z: 0 };
    this.lights = [];
    this.opts = {};
    
    return this;
}

Iro.scene.prototype.init = function(){
    // this.frame = $('#c');
    // var e = this.frame;

    // console.log( $(e).width(), $(e).height() );
    // this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, preserveDrawingBuffer: true });
    // this.renderer.setPixelRatio( window.devicePixelRatio );
    // this.renderer.setSize( $(e).width(), $(e).height() );
    // e.empty();
    // e.append( this.renderer.domElement );
}
    
Iro.scene.prototype.addObject = function(iro_object){
    this.scene.remove( this.obj );
    this.obj = iro_object.object;
    this.scene.add( this.obj );
};

Iro.scene.prototype.addCamera = function(camera){
    var camera = new THREE.PerspectiveCamera( 45, this.element.width() / this.element.height(), 1, 200 );
    camera.zoom = 20;
    camera.updateProjectionMatrix();
    this.camera = camera;
    
    return camera;
};
    
Iro.scene.prototype.addLights = function(lights){
    var scene = this.scene
    _.each(this.lights, function(e){ scene.remove(e) })
    
    var ambient = new THREE.AmbientLight( 0x101010 );
    ambient.shadowDarkness = 0
    scene.add( ambient );
    
    this.lights.push(ambient);
    this.lights = _.map(lights, function(e, i){
	var directionalLight = new THREE.DirectionalLight( e.color || 0x777777 ); // 0xffeedd
	var o = e.offset;
	directionalLight.position.set( o.x, o.y, o.z );
	directionalLight.shadowDarkness = 0
	scene.add( directionalLight );
	return directionalLight;
    })
}


Iro.scene.prototype.render = function(){
    var renderer = this.renderer;
    var offsets = this.offsets;

    var canvas = renderer.domElement;

    var width = canvas.clientWidth;
    var height = canvas.clientHeight;

    if ( canvas.width !== width || canvas.height != height ) { renderer.setSize( width, height, false ) }

    // renderer.setClearColor( 0xffffff ); renderer.setScissorTest( false ); renderer.clear();
    // renderer.setClearColor( 0xe0e0e0 ); renderer.setScissorTest( true );
    
    var element = this.element.get(0);
    // get its position relative to the page's viewport

    var rect = element.getBoundingClientRect();
    console.log(rect);
    if ( rect.bottom < 0 || rect.top  > renderer.domElement.clientHeight ||
	 rect.right  < 0 || rect.left > renderer.domElement.clientWidth ) {
	return;  // it's off screen
    }
    
    var width  = rect.right - rect.left;
    var height = rect.bottom - rect.top;
    var left   = rect.left;
    var bottom = renderer.domElement.clientHeight - rect.bottom;
    
    // console.log(this.element);
    
    var box = new THREE.Box3().setFromObject( this.obj );
    var look_at = box.getCenter();

    var camera = this.camera;
    _.chain(['x', 'y', 'z']).each(function(e, k){
	camera.position[e] = box.getCenter()[e] + offsets[e];
    })
    camera.lookAt( look_at );
    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setViewport( left, bottom, width, height );
    renderer.setScissor( left, bottom, width, height );
    
    this.renderer.render( this.scene, camera );
}

Iro.scene.prototype.animate = function() {
    var iro = this;
    if (this.interval) {
	setTimeout( function() {
            requestAnimationFrame( function(){ iro.animate() });
	}, 1000 * iro.interval );
	if (iro.obj) { iro.render() }
    } else {
	if (iro.obj) { iro.render() }
    }
}

Iro.scene.prototype.fitObject = function(axis) {
    var box = new THREE.Box3().setFromObject( this.obj );
    var sphere = box.getBoundingSphere();
    
    var distance = sphere.center.distanceTo(this.camera.position) - sphere.radius;

    var size;
    if (axis) { size = Math.abs(box.min[axis] - box.max[axis]) } else { size = sphere.radius }
    
    var screen_height = Math.tan( (this.camera.fov / 2) * (Math.PI / 180) ) * distance ;
    this.camera.zoom = screen_height / size;
    this.camera.updateProjectionMatrix();
}

Iro.scene.prototype.showAxes = function(){
    var scene = this.scene;
    var colors = [0xff0000, 0x00ff00, 0x0000ff ]

    _.each(['x', 'y', 'z'], function(e, i){
	var mat = new THREE.LineBasicMaterial({ linewidth: 3, color: colors[i] });
	var geom = new THREE.Geometry();
	var v = new THREE.Vector3( 0, 0, 0 )
	geom.vertices.push( v )
	var u = v.clone()
	u[e] = 10;
	geom.vertices.push( u );
	var axis = new THREE.Line( geom, mat, THREE.LinePieces );
	
	scene.add(axis);
    })

}
