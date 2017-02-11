Iro.object = function(){
    this.object = undefined;

    this.materials = {};
    this.view = undefined;
    this.selection = {};
    this.groups = {};
    
    return this;
}

// this.materials holds the ACTUAL materials assigned to the object
// the idea is that materials get assigned to the three.js object for visualization purposes
// but the real material is stored in this.materials

Iro.object.prototype.setObject = function(object_string) {
    // assign object

    var iro = this
    var manager = new THREE.LoadingManager();
    var loader = new THREE.OBJLoader( manager );
    var object = loader.parse(object_string);
    var count = 0;

    var material = new THREE.MeshLambertMaterial({ color: 0xCC0000 });

    object.scale.x = 1;
    object.scale.y = 1;
    object.scale.z = 1;

    object.traverse( function ( child ) {
	if ( child instanceof THREE.Mesh ) {
	    child.material = material.clone();
	    var r = 0.7; var g = 0.7; var b = 0.7;
	    child.material.color.setRGB (r, g, b);
	    iro.materials[child.id] = child.material.clone();
	    // console.log(child.id)
	}
    } );
    console.log(object);
    
    this.object = object;
    
    return this;
}

Iro.object.prototype.toggleSelection = function(id, addMode){
    if (addMode) {
	this.selection[id] = this.selection[id] ? this.selection[id]++ : 1;
    } else {
	this.selection = {}
	this.selection[id] = 1
    }
    console.log(this.selection)
    return this;
}

Iro.object.prototype.selectedIDs = function(){
    return _.keys(this.selection);
}

Iro.object.prototype.setView = function(){

}

Iro.object.prototype.toggleShow = function(){

}

Iro.object.prototype.setColor = function(id, color){
    // if id array etc;
}

Iro.object.prototype.setTexture = function(id, texture){
    // if id array etc;
}

Iro.object.prototype.idsInGroup = function(){
    // search if the materials is in a group (key exists in this.groups)
    // if yes, search if the group is in a group
    // and so on recursively until no group is found
}

