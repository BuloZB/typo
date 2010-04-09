$.extend($.View.Helpers.prototype, {
    pagination: function(params,controller,id) {
        var current_page = parseInt(params.current_page)
        var count = Math.ceil(parseInt(params.count)/parseInt(localStorage['limit_article_display']))
        var previous_page = ((current_page - 1)<1 ? '' : current_page-1)
        var next_page = ((current_page + 1) > count ? '' : current_page+1)
        var previous_span = ''
        var next_span = ''
        var identity = ''
        var additional_info = ''

        //total number of items is undefined, we must end up
        if(isNaN(count)) return;

        if(typeof params.action == 'undefined') {
            params.action = controller
        }

        if (typeof params.date != 'undefined') {
            additional_info = params.date.year + '_' + params.date.month
        }

        //identity is used for $(el).parents().model().id()
        if(typeof id != 'undefined') {
            identity = controller + '_' + id.toString()
        }
        
        if(previous_page != '') {
            previous_span = '<span class="'+additional_info+'"><a href="javascript:void(0)" id="'+previous_page+'" class="'+params.action+'_paginate">« newer</a></span>'
            }
        if(next_page != ''){
            next_span = '<span class="'+additional_info+'"><a href="javascript:void(0)" id="'+next_page+'" class="'+params.action+'_paginate">older »</a></span>'
            }
        
        if(previous_span == '' && next_span == '') {
            return ''
        } else {
            return '<div id="'+controller+'" class="pagination '+identity+'">'+previous_span+next_span+'</div>'
        }
    }
});