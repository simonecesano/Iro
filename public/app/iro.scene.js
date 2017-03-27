Iro.scene = function(element, renderer) {
    if (arguments.length > 1) {
	element  = arguments[0];
	renderer = arguments[1];
	
	this.element = $(element);
	this.renderer = renderer.renderer; // this needs fixing
    } else {
	renderer = arguments[0];
	this.element = $(renderer.domElement);
	this.renderer = renderer.renderer; // this needs fixing
    }

    this.frame = undefined;
    this.page = undefined;
    
    this.obj = undefined;
    this.interval = 0.1;
    
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
    // console.log(this.obj.uuid);
    this.scene.add( this.obj );
};

Iro.scene.prototype.addCamera = function(camera){
    var camera = camera ? camera : new THREE.PerspectiveCamera( 45, this.element.width() / this.element.height(), 1, 200 );
    
    camera.zoom = 20;
    camera.updateProjectionMatrix();
    this.camera = camera;
    // var scene = this.scene
    this.scene.add(camera);
    return camera;
};
    
Iro.scene.prototype.addLights = function(lights){
    var scene = this.scene
    _.each(this.lights, function(e){ scene.remove(e) })
    
    var ambient = new THREE.AmbientLight( 0x101010 );
    scene.add( ambient );
    
    this.lights.push(ambient);
    this.lights = _.map(lights, function(e, i){
	var directionalLight = new THREE.DirectionalLight( e.color || 0x777777 ); // 0xffeedd
	var o = e.offset;
	directionalLight.position.set( o.x, o.y, o.z );
	scene.add( directionalLight );
	return directionalLight;
    })
}

Iro.scene.prototype.updateBoundingClientRect = function(){
    var element = this.element.get(0);

    var rect = element.getBoundingClientRect();

    // console.log(rect);
    
    this.width  = rect.right - rect.left;
    this.height = rect.bottom - rect.top;

    this.left   = this.x = rect.left;
    this.bottom = this.y = this.renderer.domElement.clientHeight - rect.bottom;

    this.aspect = this.width / this.height
}

Iro.scene.prototype.render = function(){
    this.updateBoundingClientRect();

    var renderer = this.renderer;
    var offsets  = this.offsets;
    var canvas   = renderer.domElement;

    var obj      = this.obj;
    var scene    = this.scene;

    // console.log('Inside rendering');
    // console.log(canvas);

    
    var width  = canvas.clientWidth;
    var height = canvas.clientHeight;

    if ( canvas.width !== width || canvas.height != height ) { renderer.setSize( width, height, false ) }


    var box = new THREE.Box3().setFromObject( obj );
    var look_at = box.getCenter();
    var camera = this.camera;
    if (camera) {
	_.chain(['x', 'y', 'z']).each(function(e, k){
	    camera.position[e] = look_at[e] + offsets[e];
	})
	camera.lookAt(look_at);
	// console.log(this.aspect);
	camera.aspect = this.aspect;
	camera.updateProjectionMatrix();
    }

    // this needs to be set if one renderer is assigned to multiple element
    // renderer.setViewport( this.left, this.bottom, this.width, this.height );
    // renderer.setScissor( this.left, this.bottom, this.width, this.height );

    // console.log(this.renderer);
    // console.log(this.renderer.domElement.parentNode);
    // console.log(this.scene);
    // console.log(this.obj);
    // console.log(this.obj.children.length);
    // console.log(this.camera);
    // this.scene.remove(this.obj);
    this.scene.add(this.obj)
    // console.log(this.obj.uuid);
    renderer.render( this.scene, this.camera );
}

Iro.scene.prototype.animate = function() {
    var scene = this;
    if (scene.interval) {
	setTimeout( function() {
            requestAnimationFrame( function(){ scene.animate() });
	}, 1000 * scene.interval );
	if (scene.obj) { scene.render() }
    } else {
	if (scene.obj) { scene.render() }
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

Iro.scene.prototype.initEvents = function(){
    var scene = this;
    if (scene.renderer.domElement === undefined) { return };

    scene.renderer.domElement.addEventListener('mousedown', function(event) {

	// console.log('clicked on renderer')
	// console.log(scene.camera)
	// console.log(scene.obj)
	// console.log({ x: event.layerX, y: event.layerY })
	// console.log({ width: this.width, height: this.height })
	// console.log({ parentwidth: $(this).parent().width(), parentheight: $(this).parent().height() })
	
	var camera = scene.camera;
	var obj = scene.obj
	// console.log(scene.renderer.domElement)
	// console.log(obj.uuid)
	
        var vector = new THREE.Vector3(
              (event.layerX) / $(this).parent().width()  * 2 - 1,
            - (event.layerY) / $(this).parent().height() * 2 + 1,
            0
        );
        vector.unproject(camera);
        
        var raycaster = new THREE.Raycaster(
            camera.position,
            vector.sub(camera.position).normalize()
        );

        var intersects = raycaster.intersectObjects(obj.children);
	
	// console.log(intersects.length)

        if (intersects.length) {
            var r = Math.random(); var g = Math.random(); var b = Math.random();
            var c = chroma(r * 256, g * 256, b * 256);
            // iro.toggleSelection(intersects[0].object, event.shiftKey)
	    var id = intersects[0].object.id;
	    var uuid = intersects[0].object.uuid;
	    // obj.getObjectById( id ).material.color.setRGB (r, g, b);
	    // console.log('Material ' + obj.getObjectByProperty('uuid', uuid ).material.uuid)
	    // var m = obj.getObjectByProperty('uuid', uuid ).material.clone()
	    // m.color.setRGB (r, g, b);
	    obj.getObjectByProperty('uuid', uuid ).material.color.setRGB (r, g, b);
            // intersects[0].object.material.color.setRGB (r, g, b);
            // console.log(intersects[0].object.id)
	    // console.log(intersects[0].object.material)
        } else {
            // console.log('nothing here');
	    // console.log(vector);
        }
	// return;
	scene.page.render();
    }, false)

}


Iro.scene.prototype.init = function(opts){
    var scene = this;
    
    scene.addObject(opts.obj);
    scene.addLights(opts.lights);
    scene.addCamera();
    scene.offsets = opts.offsets;
    scene.render()
    scene.initEvents();
    return scene;
}
