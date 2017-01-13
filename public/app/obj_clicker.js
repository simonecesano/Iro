_.each(renderers, function(e, i) {
    console.log(e);
    e.domElement.addEventListener('mousedown', function(event) {
	console.log(event);
	console.log(this);
	console.log("i is " + i);
	console.log(this.getBoundingClientRect());
	var bb = this.getBoundingClientRect();
	console.log(_.map(cameras, function(e, i){ return e.uuid }));
	console.log({
	    pagex:      event.pageX,
	    offsetleft: this.offsetLeft,
	    bb_left:    bb.left,
	    width:      this.width
	})
	console.log({
	    pagey:     event.pageY,
	    offsettop: this.offsetTop,
	    bb_top:    bb.top,
	    height:    this.height
	})
	
	var camera = cameras[i];
	console.log(camera);
	var vector = new THREE.Vector3(
              (event.pageX - this.offsetLeft) / this.width * 2 - 1,
            - (event.pageY - this.offsetTop)  / this.height * 2 + 1,
            0
	);
	var vector = new THREE.Vector3(
	      (event.layerX) / this.width  * 2 - 1,
	    - (event.layerY) / this.height * 2 + 1,
	    0
	);
	vector.unproject(camera);
	console.log('vector');
	console.log(vector);
	
	var raycaster = new THREE.Raycaster(
	    camera.position,
	    vector.sub(camera.position).normalize()
	);
	
	var intersects = raycaster.intersectObjects(obj.children);
	if (intersects.length) {
	    var r = Math.random(); var g = Math.random(); var b = Math.random();
	    var c = chroma(r * 256, g * 256, b * 256);
	    intersects[0].object.material.color.setRGB (r, g, b);
	    console.log(intersects[0].object.id)
	    // idw.toggleSelect(intersects[0].object.id, event.shiftKey);
	    // console.log(idw);
	} else {
	    console.log('nothing here'); console.log(vector);
	}
    }, false)
});
