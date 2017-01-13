Iro = function(){
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color( 0xffffff );

    this.renderers = [];

    this.cameras = [];
    this.lights = [];
    this.opts = {};
    
    this.obj = undefined;
    
    this.init = function(opts){
	this.addRenderers(opts.containers)
	this.addCameras(opts.cameras)
	this.addlights(opts.lights)
    };

    this.addRenderers = function(containers){
	this.renderers = _.map(containers, function(e, i){
    	    var renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
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

    this.addObject = function(object_string){
	var manager = new THREE.LoadingManager();
	var loader = new THREE.OBJLoader( manager );
	var object = loader.parse(object_string);
	var count = 0;
	var material = new THREE.MeshLambertMaterial({ color: 0xCC0000 });
	object.traverse( function ( child ) {
	    if ( child instanceof THREE.Mesh ) {
		child.material = material.clone();
		var r = Math.random(); var g = Math.random(); var b = Math.random();
		
		var c = chroma(r * 256, g * 256, b * 256);
		child.material.color.setRGB (r, g, b);
		count++;
	    }
	} );

        object.scale.x = 170;
        object.scale.y = 170;
        object.scale.z = 170;
	
        this.obj = object;
	this.scene.add( this.obj );
    }
    
    this.render = function(){
	var iro = this;
	var cameras = this.cameras;
	var renderers = this.renderers;
	
	this.obj.rotation.y = 90 * Math.PI / 180;

	var box = new THREE.Box3().setFromObject( iro.obj );
	var look_at = box.getCenter();
	// console.log('cameras: ' + cameras.length)
	
	_.each(renderers, function(e, i){
	    var camera = cameras[i];
	    _.chain(['x', 'y', 'z']).each(function(e, k){
		camera.position[e] = box.getCenter()[e] + iro.opts.cameras[i].offset[e];
	    })
	    camera.lookAt( look_at );
	    e.render( iro.scene, camera );
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


