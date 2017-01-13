getContainers = function(){
    var containers = _.map(idx, function(e, i){
	console.log('here');
	
	console.log(i);
	console.log(heights[i]);
	
	var container = document.createElement( 'div' );
	$('#renderer_' + e).append( container );
	$('#renderer_' + e).css('height', heights[i] );
	return container
    });
    return containers;
}

makeRenderers = function(containers){
    renderers = _.map(containers, function(e, i){
	var renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
	// var renderer = new THREE.CanvasRenderer();
	renderer.setSize( sizes[i].width, sizes[i].height );
	e.appendChild( renderer.domElement );
	return renderer;
    });
    return renderers;
}

var IroRouter = Backbone.Router.extend({
    routes: {
	'single' : 'viewSingle',
	'three'  : 'viewThree'
    },
    viewSingle : function(){
	var idx = [1];
	var heights = ['100%'];
	var zooms   = [1.5];

	$.get('/i/c/single.html', function(d){
	    $('#main').html(d)
	    console.log('renderer');
	    var containers = _.map(idx, function(e, i){
		$('#renderer_' + e).css('height', heights[i] );
		return $('#renderer_' + e)[0]
	    });
	    renderers = _.map(containers, function(e, i){
    		var renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    		renderer.setSize( sizes[i].width, sizes[i].height );
    		e.appendChild( renderer.domElement );
    		return renderer;
	    })
	})
    }
})

var appRouter = new IroRouter();

Backbone.history.start();
