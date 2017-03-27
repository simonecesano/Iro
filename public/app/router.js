var clock = new THREE.Clock();
var delta = clock.getDelta(); // seconds.

var iro = new Iro();
iro.interval = 0.1;

Iro.app = Backbone.Model.extend({
    initialize: function(){ console.log("Welcome to this world") }
});

var page = new Iro.page();
var obj  = new Iro.object();
var app = new Iro.app({page: page, obj: obj })

var renderers = [];
var scenes = [];

var lights = [
    { offset: { x: 0, y: 0, z: 70 },    shadowDarkness: 0, color: 0x777777 },
    { offset: { x: -70, y:  0, z:  0 }, shadowDarkness: 0, color: 0x777777 },
    { offset: { x:   0, y: 70, z:  0 }, shadowDarkness: 0, color: 0x777777 },
    { offset: { x: -50, y: 40, z: 70 }, shadowDarkness: 0, color: 0x777777 }
];

var offsets = [ 'side', 'top', 'bottom', 'threeq' ]


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
	page.clearScenes();
	$('#main').html($('#template_three').html())
	$('.renderer').each(function(i, e){
	    var r = parseInt($(e).attr('id').match(/\d+/)[0]) - 1;
	    renderers[r].setDOMelement(e);
	    scenes[r].showAxes();
	    page.addScene(scenes[r]);
	})
	page.initEvents()
	page.render();
    },
    viewFour : function(){
	if (!obj.object) { location.hash = "#drop" }
	page.clearScenes();
	$('#main').html($('#template_four').html())
	$('.renderer').each(function(i, e){
	    var r = parseInt($(e).attr('id').match(/\d+/)[0]) - 1;
	    renderers[r].setDOMelement(e);
	    scenes[r].showAxes();
	    page.addScene(scenes[r]);
	})
	page.initEvents()
	page.render();
    },
    viewSingle : function(){
	if (!obj.object) { location.hash = "#drop" }
	$('#main').html($('#template_single').html())
	page.clearScenes();
	$('.renderer').each(function(i, e){
	    var r = parseInt($(e).attr('id').match(/\d+/)[0]) - 1;
	    renderers[r].setDOMelement(e);
	    scenes[r].showAxes();
	    page.addScene(scenes[r]);
	})
	page.render();
	page.initEvents()
    },
    viewDrop : function(){
	var heights = ['100%'];
	$.get('/i/c/drop.html', function(d){
	    $('#main').html(d)
	})
    }
})

var appRouter = new IroRouter();

Backbone.history.start();

window.addEventListener( 'resize', iro.onWindowResize, false );
