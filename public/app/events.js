$(function(){
    $('#menu_view a').on('click', function(){
	iro.opts.cameras[iro.activeRendererNumber].offset = offsets[$(this).data('view')];
    })
})
