var clock = new THREE.Clock();
var delta = clock.getDelta(); // seconds.
var rotateAngle = Math.PI / 2 * delta;   // pi/2 radians (90 degrees) per second
var container, stats;

var camera, scene, renderer, look_at, controls, box;

var mouseX = 0, mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var height_factor = 0.5;

var r_width  = $('#renderer_1').width();
var r_height = window.innerHeight * height_factor;

var xyz = ["x", "y", "z"];
var colors = [];
var cameras = [1, 2, 3, 4];

var renderers = [];
var containers = _.map([1, 2, 3, 4], function(e, i){
    var container = document.createElement( 'div' );
    console.log($('#renderer_' + e));
    $('#renderer_' + e).append( container );
    return container
});

var camera_offsets = [
    { x:   0, y:  0, z: 70 },
    { x: -70, y:  0, z:  0 },
    { x:   0, y: 70, z:  0 },
    { x: -50, y: 40, z: 70 }
];

var light_offsets = [
    { x:   0, y:  0, z: 70 },
    { x: -70, y:  0, z:  0 },
    { x:   0, y: 70, z:  0 },
    { x: -50, y: 40, z: 70 }
];


$('#scale').val(200)

animate();

function init(file) {
    // camera
    $('.renderers').css('height', r_height)
    console.log(file.substr(0, 100));
    cameras = _.map(cameras, function(e, i){
	camera = new THREE.OrthographicCamera( r_width / - 2, r_width / 2, r_height / 2, r_height / - 2, 1, 1000 );
	camera.zoom = 15;
	camera.updateProjectionMatrix();
	return camera;
    });
    console.log(cameras);
    
    // scene
    scene = new THREE.Scene();
    
    var ambient = new THREE.AmbientLight( 0x101030 );
    ambient.shadowDarkness = 0
    scene.add( ambient );

    _.each(light_offsets, function(e, i){
	var directionalLight = new THREE.DirectionalLight( 0x887766 ); // 0xffeedd
	directionalLight.position.set( e.x, e.y, e.z );
	directionalLight.shadowDarkness = 0
	scene.add( directionalLight );
    })
    scene.background = new THREE.Color( 0xffffff );

    
    // texture

    var texture = new THREE.TextureLoader().load( './public/textures/XDFG7688.jpg' );
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set( 100, 100 );

    var material =
	new THREE.MeshLambertMaterial({
	    color: 0xCC0000
	    // ,
	    // map: texture
	});
	
    var manager = new THREE.LoadingManager();
    manager.onProgress = function ( item, loaded, total ) {
	console.log( item, loaded, total );
    };
    
    // model
    var loader = new THREE.OBJLoader( manager );

    object = loader.parse(file);
    var count = 0;
    object.traverse( function ( child ) {
	if ( child instanceof THREE.Mesh ) {
	    child.material = material.clone();
	    console.log(child.name)
	    var r = Math.random(); var g = Math.random(); var b = Math.random();
	    var c = chroma(r * 256, g * 256, b * 256);
		colors.push({ uuid: child.uuid, hex: c.hex(), id: child.id });
	    child.material.color.setRGB (r, g, b);
	    count++;
	}
    } );

    object.scale.x = 170;
    object.scale.y = 170;
    object.scale.z = 170;
    
    obj = object;
    
    scene.add( obj );
    // ###################################################################

    renderers = _.map(containers, function(e, i){
	var renderer = new THREE.WebGLRenderer({ alpha: true });
	renderer.setSize( r_width, r_height );
	e.appendChild( renderer.domElement );
	return renderer;
    })
    console.log(renderers);
    window.addEventListener( 'resize', onWindowResize, false );
}

function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    r_width  = $('#renderer').width();
    r_height = window.innerHeight * height_factor;
    
    camera.aspect = r_width / r_height;
    camera.updateProjectionMatrix();
    
    renderer.setSize( r_width, r_height );
}

function animate() {
    setTimeout( function() {
        requestAnimationFrame( animate );
    }, 1000 * 0.01 );
    if (1) { render() }
}


function render() {
    obj.rotation.y = 90 * Math.PI / 180;

    var box = new THREE.Box3().setFromObject( obj );
    var look_at = box.getCenter();

    _.each(renderers, function(e, i){
	var camera = cameras[i];
	_.chain(xyz).each(function(e, k){
	    camera.position[e] = box.getCenter()[e] + camera_offsets[i][e];
	})
	camera.lookAt( look_at );
	e.render( scene, camera );
    })
}
