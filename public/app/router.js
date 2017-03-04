var clock = new THREE.Clock();
var delta = clock.getDelta(); // seconds.

var iro = new Iro();
iro.interval = 0.1;

Iro.app = Backbone.Model.extend({
    initialize: function(){ console.log("Welcome to this world") }
});

var page = new Iro.page();

var obj  = new Iro.object();

var file = '/public/obj/Superstar.obj';

var app = new Iro.app({page: page, obj: obj })


var IroRouter = Backbone.Router.extend({
    routes: {
	'drop'       : 'viewDrop',
	'adjust'     : 'viewAdjust',
	'single'     : 'viewSingle',
	'four'       : 'viewFour',
	'three'      : 'viewThree'
    },
    viewThree : function(){
	if (!obj.object) { location.hash = "#drop" }
	$.get('/i/c/three.html', function(d){
	    $('#main').html(d)
	    var lights = [
		{ offset: { x: 0, y: 0, z: 70 },    shadowDarkness: 0, color: 0x777777 },
		{ offset: { x: -70, y:  0, z:  0 }, shadowDarkness: 0, color: 0x777777 },
		{ offset: { x:   0, y: 70, z:  0 }, shadowDarkness: 0, color: 0x777777 },
		{ offset: { x: -50, y: 40, z: 70 }, shadowDarkness: 0, color: 0x777777 }
	    ];

	    // page.clearScenes();
	    var offsets = [ 'side', 'top', 'bottom', 'threeq' ]
	    $('.renderer').each(function(i, e){
		console.log('element');
		console.log($(e).attr('id'));
		
		var renderer = new Iro.renderer(e)
		var scene    = new Iro.scene(e, renderer);

		scene.addObject(obj)
		scene.addLights(lights)
		scene.addCamera();
		scene.showAxes();
		scene.offsets = page.view(offsets[i]);
		scene.render()

		scene.initEvents();
		page.addScene(scene);
	    })
	    page.initEvents()
	    page.render();
	})
    },
    viewFour : function(){
	if (!obj.object) { location.hash = "#drop" }
	$.get('/i/c/four.html', function(d){
	    $('#main').html(d)
	    var lights = [
		{ offset: { x: 0, y: 0, z: 70 },    shadowDarkness: 0, color: 0x777777 },
		{ offset: { x: -70, y:  0, z:  0 }, shadowDarkness: 0, color: 0x777777 },
		{ offset: { x:   0, y: 70, z:  0 }, shadowDarkness: 0, color: 0x777777 },
		{ offset: { x: -50, y: 40, z: 70 }, shadowDarkness: 0, color: 0x777777 }
	    ];

	    // page.clearScenes();
	    var offsets = [ 'side', 'top', 'bottom', 'threeq' ]
	    $('.renderer').each(function(i, e){
		console.log('element');
		console.log($(e).attr('id'));
		
		var renderer = new Iro.renderer(e)
		var scene    = new Iro.scene(e, renderer);

		scene.addObject(obj)
		scene.addLights(lights)
		scene.addCamera();
		scene.showAxes();
		scene.offsets = page.view(offsets[i]);
		scene.render()

		// scene.animate()
		scene.initEvents();
		page.addScene(scene);
		// scene.page = page;
	    })
	    page.initEvents()
	    page.render();
	})
    },
    viewSingle : function(){
	var heights = ['100%'];
	if (!obj.object) { location.hash = "#drop" }
	$.get('/i/c/single.html', function(d){
	    $('#main').html(d)
	    var lights = [
		{ offset: { x: 0, y: 0, z: 70 },    shadowDarkness: 0, color: 0x777777 },
		{ offset: { x: -70, y:  0, z:  0 }, shadowDarkness: 0, color: 0x777777 },
		{ offset: { x:   0, y: 70, z:  0 }, shadowDarkness: 0, color: 0x777777 },
		{ offset: { x: -50, y: 40, z: 70 }, shadowDarkness: 0, color: 0x777777 }
	    ];

	    page.clearScenes();
	    $('.renderer').each(function(i, e){
		console.log('element');
		console.log(e);

		var renderer = new Iro.renderer(e)
		var scene = new Iro.scene(e, renderer);

		scene.offsets = { x: -70, y: 0, z: 0 };

		scene.addObject(obj)
		scene.addLights(lights)
		scene.addCamera();
		scene.showAxes();
		scene.initEvents();
		page.addScene(scene);
	    })
	    page.render();
	    page.initEvents()
	})
    },
    viewDrop : function(){
	var heights = ['100%'];
	$.get('/i/c/drop.html', function(d){
	    console.log(app)
	    $('#main').html(d)
	})
    },
    viewAdjust: function(){
	var heights = ['100%'];
	$.get('/i/c/adjust.html', function(d){
	    $('#main').html(d)
	    var lights = [
		{ offset: { x: 0, y: 0, z: 70 },    shadowDarkness: 0, color: 0x777777 },
		{ offset: { x: -70, y:  0, z:  0 }, shadowDarkness: 0, color: 0x777777 },
		{ offset: { x:   0, y: 70, z:  0 }, shadowDarkness: 0, color: 0x777777 },
		{ offset: { x: -50, y: 40, z: 70 }, shadowDarkness: 0, color: 0x777777 }
	    ];

	    page.clearScenes();
	    $('.renderer').each(function(i, e){
		console.log('element');
		console.log(e);

		var renderer = new Iro.renderer(e)
		var scene = new Iro.scene(e, renderer);

		scene.offsets = { x: -70, y: 0, z: 0 };

		scene.addObject(obj)
		scene.addLights(lights)
		scene.addCamera();
		scene.showAxes();
		scene.initEvents();
		page.addScene(scene);
	    })
	    page.render();
	    page.initEvents()
	})
    }
})

var appRouter = new IroRouter();

Backbone.history.start();

window.addEventListener( 'resize', iro.onWindowResize, false );
