$(function(){
    $('#menu_view a').on('click', function(){
	iro.opts.cameras[iro.activeRendererNumber].offset = offsets[$(this).data('view')];
    });
    $('#menu_rotate a').on('click', function(){
	console.log('here');
	var axis = $(this).data('rotation')
	console.log(axis);
	iro.obj.rotation[axis] = iro.obj.rotation[axis] + 90 * Math.PI / 180
    });
})
