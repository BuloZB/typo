$.extend($.View.Helpers.prototype, {
    pagination: function(page,count,controller,action) {
        var current_page = parseInt(page)
        var count = Math.ceil(parseInt(count)/localStorage['limit_article_display'])
        var previous_page = ((current_page - 1)<1 ? '' : current_page-1)
        var next_page = ((current_page + 1) > count ? '' : current_page+1)
        var previous_span = ''
        var next_span = ''

        if(typeof action == 'undefined') {
            action = controller
        }

        if(previous_page != '') {
            previous_span = '<span><a href="javascript:void(0)" id="'+previous_page+'" class="'+action+'_paginate"><< newer</a></span>'
            }
        if(next_page != ''){
            next_span = '<span><a href="javascript:void(0)" id="'+next_page+'" class="'+action+'_paginate">older >></a></span>'
            }
        
        if(previous_span == '' && next_span == '') {
            return ''
        } else {
            return '<div id="'+controller+'" class="pagination">'+previous_span+' | '+next_span+'</div>'
        }
    }
});