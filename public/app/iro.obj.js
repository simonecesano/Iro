Iro.object = function(objstr){
    this.object = undefined;

    this.materials = {};
    this.view = undefined;
    this.selection = {};
    this.groups = {};
    this.scale = 1;

    if (objstr) { this.setObject(objstr) }
    
    return this;
}

// this.materials holds the ACTUAL materials assigned to the object
// the idea is that materials get assigned to the three.js object for visualization purposes
// but the real material is stored in this.materials

Iro.object.prototype.setObject = function(objstr) {
    // assign object

    var iro = this
    var manager = new THREE.LoadingManager();
    var loader = new THREE.OBJLoader( manager );
    var object = loader.parse(objstr);
    var count = 0;

    var material = new THREE.MeshLambertMaterial({ color: 0xCC0000 });

    var box    = new THREE.Box3().setFromObject( object )
    var size   = box.getSize();
    var center = box.getCenter();


    // console.log('center before');
    // console.log(center);

    
    var scale = 1 / _.min([size.x, size.y, size.z]);

    // console.log('scale');
    // console.log(scale);

    
    object.scale.x = scale;
    object.scale.y = scale;
    object.scale.z = scale;

    this.scale = scale;

    
    // console.log('center after scale');
    // console.log(new THREE.Box3().setFromObject( object ).getCenter());

    var box    = new THREE.Box3().setFromObject( object )
    var center = box.getCenter();

    // object.translateZ(-center.z)
    // object.translateY(-center.y)
    // object.translateX(-center.x)
    
    // console.log('center after translate');
    // console.log(new THREE.Box3().setFromObject( object ).getCenter());
    
    object.traverse( function ( child ) {
	if ( child instanceof THREE.Mesh ) {
	    child.material = material.clone();
	    var r = 0.7; var g = 0.7; var b = 0.7;
	    child.material.color.setRGB (r, g, b);
	    iro.materials[child.id] = child.material.clone();
	}
    } );
    
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
    // console.log(this.selection)
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

Iro.object.prototype.clone = function(){
    var o;
    o = this.object.clone(true);
    o.traverse( function ( child ) {
	if ( child instanceof THREE.Mesh ) {
	    child.material = child.material.clone();
	}
    } );
    var t = jQuery.extend(true, {}, this);
    t.object = undefined;
    // console.log('cloning');
    // console.log(this.object);
    // console.log(t);
    t.object = o;
    // console.log(o);
    return t;
}
