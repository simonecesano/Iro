Iro = function(){
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color( 0xffffff );
    
    this.renderers = [];
    this.interval = 0.1;
    this.cameras = [];
    this.lights = [];
    this.opts = {};
    this.dataURLs = [];
    
    this.selection = {};
    this.activeRendererNumber = 0;
    
    this.obj = undefined;
    
    this.init = function(opts){
	this.addRenderers(opts.containers)
	this.addCameras(opts.cameras)
	this.addlights(opts.lights)
    };

    this.addRenderers = function(containers){
	this.renderers = _.map(containers, function(e, i){
	    // var foo = new Iro.renderer();
	    
    	    var renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, preserveDrawingBuffer: true });
	    renderer.setClearColor( 0x000000, 0 );
	    renderer.setClearAlpha(0);
	    
	    // var renderer = THREE.CanvasRenderer();
	    console.log('renderer')
	    console.log(renderer)
	    // var renderer = new THREE.SVGRenderer();
	    renderer.setPixelRatio( window.devicePixelRatio );
    	    renderer.setSize( $(e).width(), $(e).height() );
    	    e.appendChild( renderer.domElement );
    	    return renderer;
	})
    }

    this.addCameras = function(cameras){
	var r = this.renderers;
	this.opts.cameras = cameras

	console.log("cameras: " + cameras.length);

	this.cameras = _.map(cameras, function(e, i){
	    var p = $(r[i].domElement).parent();
	    camera = new THREE.PerspectiveCamera( 45, $(p).width() / $(p).height(), 1, 2000 );
	    camera.zoom = e.zoom;
	    camera.updateProjectionMatrix();
	    return camera;
	});
    }

    this.addlights = function(lights){
	var scene = this.scene
	_.each(this.lights, function(e){
	    console.log(e);
	    scene.remove(e)
	})
	
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

    this.addObject = function(object_string, index){
	if (index === undefined) { index = 0 };
	
	var manager = new THREE.LoadingManager();
	var loader = new THREE.OBJLoader( manager );
	var object = loader.parse(object_string);
	var count = 0;
	var material = new THREE.MeshLambertMaterial({ color: 0xCC0000 });

	// var material = new THREE.MeshBasicMaterial({ color: 0xCC0000 });
	object.traverse( function ( child ) {
	    if ( child instanceof THREE.Mesh ) {
		child.material = material.clone();
		var r = 0.7; var g = 0.7; var b = 0.7;
		
		var c = chroma(0.7, 0.7, 0.7);
		child.material.color.setRGB (r, g, b);
		count++;
	    }
	} );

        object.scale.x = 170;
        object.scale.y = 170;
        object.scale.z = 170;

	this.scene.remove( this.obj );
        this.obj = object;
	this.scene.add( this.obj );
	this.initEvents();
    }
    
    this.render = function(){
	var iro = this;
	var cameras = this.cameras;
	var renderers = this.renderers;

	var box = new THREE.Box3().setFromObject( iro.obj );
	var look_at = box.getCenter();
	
	_.each(renderers, function(e, i){
	    var camera = cameras[i];
	    _.chain(['x', 'y', 'z']).each(function(e, k){
		camera.position[e] = box.getCenter()[e] + iro.opts.cameras[i].offset[e];
	    })
	    camera.lookAt( look_at );
	    e.render( iro.scene, camera );
	    // console.log(e.domElement.toDataURL())
	    // iro.dataURLs[i] = e.domElement.toDataURL();
	})

    }

    this.onWindowResize = function() {
	var cameras = this.cameras;
	_.each(this.renderers, function(e, i) {
	    var renderer = e;
	    var p = $(renderers[i].domElement).parent();
	    var camera = cameras[i];
	    
    	    renderer.setSize( $(p).width(), $(p).height() );
	    camera.aspect = $(p).width() /  $(p).height();
	    camera.updateProjectionMatrix();
	})
    }
    
    return this;
}

Iro.prototype.initEvents = function(){
    var renderers = this.renderers;
    var cameras   = this.cameras;
    var iro       = this;

    _.each(renderers, function(e, i) {
	console.log(e);
	
	e.domElement.addEventListener('mousedown', function(event) {
	    // var bb = this.getBoundingClientRect();
	    iro.activeRendererNumber = i;
	    var obj = iro.obj;
	    
	    console.log(obj);
	    console.log('---------- obj ---------------');
	    
	    var camera = cameras[i];
	    var vector = new THREE.Vector3(
	    	  (event.layerX) / this.width  * 2 - 1,
	    	- (event.layerY) / this.height * 2 + 1,
	    	0
	    );
	    vector.unproject(camera);
	    
	    var raycaster = new THREE.Raycaster(
		camera.position,
		vector.sub(camera.position).normalize()
	    );
	    
	    var intersects = raycaster.intersectObjects(obj.children);
	    if (intersects.length) {
		var r = Math.random(); var g = Math.random(); var b = Math.random();
		var c = chroma(r * 256, g * 256, b * 256);
		iro.toggleSelection(intersects[0].object, event.shiftKey)
		intersects[0].object.material.color.setRGB (0.9, 0.9, 0.9);
		console.log(intersects[0].object.id)
	    } else {
		// console.log('nothing here'); console.log(vector);
	    }
	}, false)
    })
};

Iro.prototype.toggleSelection = function(object, addMode){
    if (addMode) {
	this.selection[object.id] = this.selection[object.id] ? this.selection[object.id]++ : 1;
    } else {
	this.selection = {}
	this.selection[object.id] = 1
    }
    console.log(this.selection)
}

Iro.prototype.selectedIDs = function(){
    return _.keys(this.selection);
}

Iro.renderer = function(container) {
    this.obj = undefined;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color( 0xffffff );

    this.renderers = [];

    this.cameras = [];
    this.lights = [];
    this.opts = {};

    this.selection = {};
    this.activeRendererNumber = 0;
    
    this.obj = undefined;

    this.materials = {};
    
    return this;
}

Iro.prototype.animate = function() {
    var iro = this;
    if (this.interval) {
	setTimeout( function() {
            requestAnimationFrame( function(){ iro.animate() });
	}, 1000 * iro.interval );
	iro.render();
    } else {
	iro.render();
    }
}


IroPage = function(){
    this.containers = [];
    this.init = function(opts){
	this.containers = [];
	var i = 1;
	var r = $('#renderer_' + i);

	while (r.length) {
	    var h = opts.heights[i - 1];
	    r.css('height', h || opts.heights[0]);
	    this.containers.push(r.get(0));
	    i = i + 1;
	    r = $('#renderer_' + i);
	}
    }
    return this;
}
