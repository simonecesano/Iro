var clock = new THREE.Clock();
var delta = clock.getDelta(); // seconds.

var iroPage = new IroPage;

var iro = new Iro();
var file = '/public/obj/Superstar.obj';
$.get(file, function(d){ iro.addObject(d) } );

var IroRouter = Backbone.Router.extend({
    routes: {
	'single' : 'viewSingle',
	'three'  : 'viewThree',
	'four'  : 'viewFour'
    },
    viewSingle : function(){
	var heights = ['100%'];

	$.get('/i/c/single.html', function(d){
	    $('#main').html(d)
	    iroPage.init({ heights: [ '100%' ]});
	    iro.init({
		containers: iroPage.containers,
		cameras: [{ offset: { x: 0, y: 0, z: 70 }, zoom: 1.5 }],
		lights:  [
		    { offset: { x: 0, y: 0, z: 70 },    shadowDarkness: 0, color: 0x777777 },
		    { offset: { x: -70, y:  0, z:  0 }, shadowDarkness: 0, color: 0x777777 },
		    { offset: { x:   0, y: 70, z:  0 }, shadowDarkness: 0, color: 0x777777 },
		    { offset: { x: -50, y: 40, z: 70 }, shadowDarkness: 0, color: 0x777777 }
		]
	    })
	})
    },
    viewThree : function(){
	$.get('/i/c/three.html', function(d){
	    $('#main').html(d)
	    iroPage.init({ heights: ['100%', '33%', '33%', '33%'] });
	    iro.init({
		containers: iroPage.containers,
		cameras: [
		    { offset: { x: 0, y: 0, z: 70 },    zoom: 1.2 },
		    { offset: { x: -70, y: 0, z: 0 },   zoom: 1.2 },
		    { offset: { x: 0, y: 70, z: 0 },    zoom: 1.2 },
		    { offset: { x: -50, y: 40, z: 70 }, zoom: 1.2 }
		],
		lights:  [
		    { offset: { x: 0, y: 0, z: 70 },    shadowDarkness: 0, color: 0x777777 },
		    { offset: { x: -70, y:  0, z:  0 }, shadowDarkness: 0, color: 0x777777 },
		    { offset: { x:   0, y: 70, z:  0 }, shadowDarkness: 0, color: 0x777777 },
		    { offset: { x: -50, y: 40, z: 70 }, shadowDarkness: 0, color: 0x777777 }
		]
	    })
	})
    },
    viewFour : function(){
	$.get('/i/c/four.html', function(d){
	    $('#main').html(d)
	    iroPage.init({ heights: ['50%', '50%', '50%', '50%'] });
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
