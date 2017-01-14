var clock = new THREE.Clock();
var delta = clock.getDelta(); // seconds.

var iroPage = new IroPage();

var colors = ['#a6cee3','#1f78b4','#b2df8a','#33a02c','#fb9a99','#e31a1c','#fdbf6f','#ff7f00','#cab2d6','#6a3d9a','#ffff99','#b15928'];
$.get('/c/nbs-iscc-tc', function(d){ colors = d } );

var iro = new Iro();
var file = '/public/obj/Superstar.obj';
$.get(file, function(d){ iro.addObject(d) } );

var offsets = {
    side:    { x: 0, y: 0, z: 70 },
    top:     { x:   0, y: 70, z:  0 },
    medial:  { x: 0, y: 0, z: -70 },
    toe:     { x: -70, y:  0, z:  0 },
    heel:    { x: 70, y:  0, z:  0 },
    threeq: { x: -50, y: 40, z: 70 },
    bottom: { x: 0, y: -70, z: 0 },
};

var IroRouter = Backbone.Router.extend({
    routes: {
	'single' : 'viewSingle',
	'three'  : 'viewThree',
	'four'  : 'viewFour',
	'drop'  : 'viewDrop'
    },
    viewSingle : function(){
	var heights = ['100%'];

	$.get('/i/c/single.html', function(d){
	    $('#main').html(d)
	    iroPage.init({ heights: [ '100%' ]});
	    iroPage.addPalette('#colors', colors);
	    iro.init({
		containers: iroPage.containers,
		cameras: [
		    { offset: offsets.side, zoom: 1.5 }
		],
		lights:  [
		    { offset: { x: 0, y: 0, z: 70 },    shadowDarkness: 0, color: 0x777777 },
		    { offset: { x: -70, y:  0, z:  0 }, shadowDarkness: 0, color: 0x777777 },
		    { offset: { x:   0, y: 70, z:  0 }, shadowDarkness: 0, color: 0x777777 },
		    { offset: { x: -50, y: 40, z: 70 }, shadowDarkness: 0, color: 0x777777 }
		]
	    })
	    iro.initEvents();
	})
    },
    viewThree : function(){
	$.get('/i/c/three.html', function(d){
	    $('#main').html(d)
	    iroPage.init({ heights: ['100%', '33%', '33%', '33%'] });
	    iroPage.addPalette('#colors', colors);
	    iro.init({
		containers: iroPage.containers,
		cameras: [
		    { offset: offsets.side, zoom: 1.2 },
		    { offset: offsets.toe,   zoom: 1.2 },
		    { offset: offsets.top,    zoom: 1.2 },
		    { offset: offsets.threeq, zoom: 1.2 }
		],
		lights:  [
		    { offset: { x: 0, y: 0, z: 70 },    shadowDarkness: 0, color: 0x777777 },
		    { offset: { x: -70, y:  0, z:  0 }, shadowDarkness: 0, color: 0x777777 },
		    { offset: { x:   0, y: 70, z:  0 }, shadowDarkness: 0, color: 0x777777 },
		    { offset: { x: -50, y: 40, z: 70 }, shadowDarkness: 0, color: 0x777777 }
		]
	    })
	    iro.initEvents();
	})
    },
    viewFour : function(){
	$.get('/i/c/four.html', function(d){
	    $('#main').html(d)
	    iroPage.init({ heights: ['50%', '50%', '50%', '50%'] });
	    iroPage.addPalette('#colors', colors);
	    
	    iro.init({
		containers: iroPage.containers,
		cameras: [
		    { offset: { x: 0, y: 0, z: 70 },    zoom: 1.5 },
		    { offset: { x: -70, y: 0, z: 0 },   zoom: 1.5 },
		    { offset: { x: 0, y: 70, z: 0 },    zoom: 1.5 },
		    { offset: { x: -50, y: 40, z: 70 }, zoom: 1.5 }
		],
		lights:  [
		    { offset: { x: 0, y: 0, z: 70 },    shadowDarkness: 0, color: 0x777777 },
		    { offset: { x: -70, y:  0, z:  0 }, shadowDarkness: 0, color: 0x777777 },
		    { offset: { x:   0, y: 70, z:  0 }, shadowDarkness: 0, color: 0x777777 },
		    { offset: { x: -50, y: 40, z: 70 }, shadowDarkness: 0, color: 0x777777 }
		]
	    })
	    iro.initEvents();
	})
    },
    viewDrop : function(){
	var heights = ['100%'];

	$.get('/i/c/drop.html', function(d){
	    console.log(d);
	    $('#main').html(d)
	})
    }
})

var appRouter = new IroRouter();

Backbone.history.start();

window.addEventListener( 'resize', iro.onWindowResize, false );

animate();

function animate() {
    setTimeout( function() {
        requestAnimationFrame( animate );
    }, 1000 * 0.1 );
    iro.render();
}
