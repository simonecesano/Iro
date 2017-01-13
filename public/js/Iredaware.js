Iredaware = function(scene) {
    // this.obj = obj;
    this.scene = scene;
    this.parts = {};      // ids
    // {
    // 	id: undefined,
    // 	groups: [],
    // 	material: undefined
    // }

    this.groups = {}; // uuid
    // {
    // 	uuid: undefined,
    // 	parts: []
    // }
    
    this.selection = [];  // uuids
    this.items = [];      // uuids
    return this;
}

Iredaware.prototype.toggleSelect = function(id, add) {
    
    if (_.filter(this.selection, function(n){ return n === id }).length) {
	this.selection = _.filter(this.selection, function(n){ return n !== id });
    } else {
	if (add) {
	    this.selection.push(id);
	} else {
	    this.selection = [id];
	}
    }
}

Iredaware.prototype.each = function(f) {
    _.each(this.selection, function(e){
	f(this.scene.getObjectById(e));
    })
}


// idw.each(function(i){ i.material.color.setRGB (r, g, b) })

// click on part => get group => select all in group

// module.exports = Iredaware

Iredaware.part = function(id){
    this.id = id;
    this.groups = [];
    this.material = undefined;
}

Iredaware.group = function() {
    var uuid = THREE.Math.generateUUID();
}
