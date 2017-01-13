// var idw = new Iredaware(scene);

var clock = new THREE.Clock();
var delta = clock.getDelta(); // seconds.
var rotateAngle = Math.PI / 2 * delta;   // pi/2 radians (90 degrees) per second
var container, stats;

var camera, scene, renderer, look_at, controls, box;

var mouseX = 0, mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var height_factor = 0.4;

var r_width  = $('#renderer_1').width();
var r_height = window.innerHeight * height_factor;

var xyz = ["x", "y", "z"];
var colors = [];

var idx = _.chain(new Array(30))
    .map(function(e, i){ return i + 1})
    .filter(function(e, i){
	return $('#renderer_' + e).length > 0;
    }).value()

console.log(idx);

var cameras = [];

var renderers = [];
var containers = _.map(idx, function(e, i){
    $('#renderer_' + e).css('height', heights[i] );
    return $('#renderer_' + e)[0]
});

var sizes = _.map(idx, function(e, i){
    var r = {
	width:  $('#renderer_' + e).width(),
	height: $('#renderer_' + e).height()
    };
    return r
});

//117022B6-6765-4E08-9EA3-239DE3C27974

var camera_offsets = [
    { x:   0, y:  0, z: 70 },
    { x: -70, y:  0, z:  0 },
    { x:   0, y: 70, z:  0 },
    { x: -50, y: 40, z: 70 }
];

if (idx.length > 4) {
    camera_offsets = _.map(idx, function(e, i){ return camera_offsets[0] });
    sizes          = _.map(idx, function(e, i){ return sizes[0] });
    heights        = _.map(idx, function(e, i){ return heights[0] });
    zooms          = _.map(idx, function(e, i){ return zooms[0] });
}

var light_offsets = [
    { x:   0, y:  0, z: 70 },
    { x: -70, y:  0, z:  0 },
    { x:   0, y: 70, z:  0 },
    { x: -50, y: 40, z: 70 }
];


$('#scale').val(200)

init();
animate();
// render();

function init() {
    // camera
    cameras = _.map(idx, function(e, i){
	camera = new THREE.PerspectiveCamera( 45, sizes[i].width / sizes[i].height, 1, 2000 );
	camera.zoom = zooms[i];
	camera.updateProjectionMatrix();
	console.log(camera.uuid);
	return camera;
    });
    
    // scene
    scene = new THREE.Scene();
    
    var ambient = new THREE.AmbientLight( 0x101010 );
    ambient.shadowDarkness = 0
    scene.add( ambient );

    _.each(light_offsets, function(e, i){
	var directionalLight = new THREE.DirectionalLight( 0x777777 ); // 0xffeedd
	directionalLight.position.set( e.x, e.y, e.z );
	directionalLight.shadowDarkness = 0
	scene.add( directionalLight );
    })
    scene.background = new THREE.Color( 0xffffff );

    var material = new THREE.MeshLambertMaterial({ color: 0xCC0000 });
	
    var manager = new THREE.LoadingManager();
    // manager.onProgress = function ( item, loaded, total ) {
    // 	console.log( item, loaded, total );
    // };
    
    // model
    var loader = new THREE.OBJLoader( manager );
    var file = '/public/obj/Superstar.obj';
    $.get(file, function(d){
	console.log(d.length)
	object = loader.parse(d);
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
    } );
    // ###################################################################

    renderers = _.map(containers, function(e, i){
    	var renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
	// console.log(e.getBoundingClientRect())
	// console.log({ width: $(e).width(), height: $(e).height() })
	// console.log(sizes[i])
    	renderer.setSize( $(e).width(), $(e).height() );
    	e.appendChild( renderer.domElement );
    	return renderer;
    })
    console.log(renderers);

    window.addEventListener( 'resize', onWindowResize, false );
}

function onWindowResize() {
    _.each(renderers, function(e, i) {
	var renderer = e;
	var p = $(renderers[i].domElement).parent();
	var camera = cameras[i];

    	renderer.setSize( $(p).width(), $(p).height() );
	camera.aspect = $(p).width() /  $(p).height();
	camera.updateProjectionMatrix();
    })
}

function animate() {
    setTimeout( function() {
        requestAnimationFrame( animate );
    }, 1000 * 0.1 );
    render();
}


function render() {
    obj.rotation.y = 90 * Math.PI / 180;

    var ids = [];
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

