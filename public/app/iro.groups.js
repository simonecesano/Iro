Iro.groups = function(){
    this.parts = {};
    this.groups = {};
}

Iro.groups.prototype.create = function(ids) {
    var uuid = createUUID();
    _.each(ids, function(e, i){ this.parts[e] = uuid })
    this.groups[uuid] = ids;
    return uuid;
}

Iro.groups.ungroup = function(id){
    var uuid = this.parts[id];
    var ids = this.groups[uuid];
    _.each(ids, function(e, i){ delete this.parts[e] })
    delete this.groups[uuid]
}

Iro.groups.siblings = function(id){
}

Iro.groups.topGroup = function(id){

}
