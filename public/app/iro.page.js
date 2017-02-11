// includes all page rendering related aspects of Iro

Iro.page = function(){
    this.containers = [];
    this.activeRendererNumber = 0;
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
