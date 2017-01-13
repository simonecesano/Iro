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
    var container = document.createElement( 'div' );
    $('#renderer_' + e).append( container );
    $('#renderer_' + e).css('height', heights[i] );
    return container
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

    
    // texture

    var texture = new THREE.TextureLoader().load( '/public/textures/XDFG7688.jpg' );
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
	// var renderer = new THREE.CanvasRenderer();
	renderer.setSize( sizes[i].width, sizes[i].height );
	e.appendChild( renderer.domElement );
	return renderer;
    })
    console.log(renderers);

    window.addEventListener( 'resize', onWindowResize, false );
}

function onWindowResize() {
    var sizes = _.map(idx, function(e, i){
	var r = {
	    width:  $('#renderer_' + e).width(),
	    height: $('#renderer_' + e).height()
	};
	return r
    });

    _.each(idx, function(e, i) {
	var renderer = renderers[i];
	var camera = cameras[i];
	renderer.setSize( sizes[i].width, sizes[i].height );
	camera.aspect = sizes[i].width / sizes[i].height;
	console.log(camera.aspect);
	camera.updateProjectionMatrix();
    })
}

function animate() {
    setTimeout( function() {
        requestAnimationFrame( animate );
    }, 1000 * 0.5 );
    render();
}


function render() {
    obj.rotation.y = 90 * Math.PI / 180;

    var ids = [];
    obj.traverse( function ( child ) {
	if ( child instanceof THREE.Mesh ) {
	    ids.push(child.id);
	    child.material.opacity = 0;
	}
    })
    
    var id = ids[Math.floor(Math.random() * ids.length)];
    var one = scene.getObjectById( id, true );
    var color = one.material.color;
    // console.log(one);
    // console.log(one.material.opacity);
    one.material.opacity = 1
    //one.material.color.setRGB(0.9, 0.1, 0.1)
    one.material.color.setRGB(0, 0, 0)

    one.material.color = color;
    
    var box = new THREE.Box3().setFromObject( obj );
    var look_at = box.getCenter();

    _.each(renderers, function(e, i){
	var camera = cameras[i];
	_.chain(xyz).each(function(e, k){
	    camera.position[e] = box.getCenter()[e] + camera_offsets[i][e];
	})
	// console.log(id);
	// console.log(e.domElement.toDataURL());
	var part;
	// console.log($('#parts'));

	// console.log('<div id="part_' + id + '"></div');
	if ($('#part_' + id).length) {
	    part = $('#part_' + id)
	} else {
	    console.log($('#parts').append('<div id="part_' + id + '"></div'));
	    part = $('#part_' + id)
	    var canvas = document.createElement('canvas');
	    part.append(canvas)
	}
	var canvas = part.find('canvas')[0];
	console.log('canvas');
	console.log(canvas);
	var ctx = canvas.getContext("2d");
	console.log('ctx');
	console.log(ctx);
	var image = new Image();
	image.onload = function() {
	    console.log({ width: image.width, height: image.height })
	    console.log({ width: canvas.width, height: canvas.height })
	    ctx.clearRect(0, 0, canvas.width, canvas.height);
	    ctx.drawImage(image, 0, 0)
	    ctx.scale(0.25, 0.25);
	};
	image.src = e.domElement.toDataURL()

	console.log(part);
	camera.lookAt( look_at );
	e.render( scene, camera );
    })
}
