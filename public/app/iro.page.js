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

Iro.page.prototype.addPalette = function(target, palette){
    var template =
	Handlebars.compile([ '<style>.swatch {width:1em;height:1em;padding:1px;display:inline-block}</style>',
			     '<div>{{#each palette}}',
			     '<div class="swatch" data-rgb="{{ rgb }}" style="background-color:{{ rgb }}">&emsp;</div>',
			     '{{/each}}</div>' ].join("\n"))
    var data = {};
    data.palette = _.map(palette, function(e, i){
	if (typeof e !== 'object') { e = { rgb: e, name: "" } }
	return e;
    })
    // console.log(data);
    // console.log(template(data));
    $(target).html(template(data))
    $('.swatch').on('click', function(){
	// console.log(iro.obj);
	var c = chroma($(this).data('rgb'));
	// console.log(c.css());
	var all_ids = [];
	iro.obj.traverse( function ( child ) {
	    all_ids.push(child.id)
	})
	// console.log(all_ids);

	var ids = iro.selectedIDs();
	
	_.each(ids, function(e, i){
	    // console.log(e);
	    var o = iro.scene.getObjectById( parseInt(e), false );
	    // console.log(o);
	    o.material.color.setStyle(c.css())
	})
    })
}
