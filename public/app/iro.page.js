// includes all page rendering related aspects of Iro

Iro.page = function(){
    this.containers = [];
    this.activeScene = undefined;
    this.interval = 0.05;
    
    this.scenes = [];
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

Iro.page.prototype.clearScenes = function(){ this.scenes = [] }
Iro.page.prototype.addScene = function(scene){
    this.scenes.push(scene)
    scene.page = this;
}

Iro.page.prototype.initEvents = function(){
    var page = this;
    var mousedownID = -1;
    $('#zoom_in').on('mousedown', function(e){
	if (mousedownID==-1) {
	    mousedownID = setInterval(function(){
		_.each(page.scenes, function(e, i){ e.camera.zoom = e.camera.zoom + 0.1 })
		page.render()
	    }, 50)
	
	}
    });
    $('#zoom_out').on('mousedown', function(e){
	if (mousedownID==-1) {
	    mousedownID = setInterval(function(){
		_.each(page.scenes, function(e, i){ e.camera.zoom = e.camera.zoom - 0.1 })
		page.render()
	    }, 50)
	}
    });

    $('#zoom_in, #zoom_out').on('mouseup', function(e){
	if( mousedownID != -1) {  //Only stop if exists
	    clearInterval(mousedownID);
	    mousedownID = -1;
	}
    });

    $('#menu_rotate a').off('click').on('click', function(e){
	e.preventDefault();
	e.stopPropagation();

	console.log('here');
	var axis = $(this).data('rotation')
	console.log(axis);
	
	var o = obj.object;
	o.rotation[axis] = o.rotation[axis] + 90 * Math.PI / 180

	page.render()
    });

}

Iro.page.prototype.animate = function() {
    var page = this;

    _.each(this.scenes, function(e, i){
	if (page.interval) {
	    setTimeout( function() {
		requestAnimationFrame( function(){ e.animate() });
	    }, 1000 * page.interval );
	    e.render()
	} else {
	    e.render()
	}
    })
}

Iro.page.prototype.render = function(){
    // console.log(this.scenes.length);
    _.each(this.scenes, function(e, i){ e.render() })
}

Iro.page.prototype.view = function(type, distance) {
    
    var vs = {
	side:    { x: -70, y: 0, z: 0 },
	top:     { x:  0, y: 70, z: 0 },
	medial:  { x: 0, y: 0, z: -70 },
	toe:     { x: -70, y:  0, z:  0 },
	heel:    { x: 70, y:  0, z:  0 },
	threeq:  { x: -50, y: 40, z: -70 },
	bottom:  { x: 0, y: -70, z: 0 },
    };
    var v = vs[type];
    if (!v) { return };
    if (distance) {
	v.x = v.x * distance
	v.y = v.y * distance
	v.z = v.z * distance
    }
    return v;
}
