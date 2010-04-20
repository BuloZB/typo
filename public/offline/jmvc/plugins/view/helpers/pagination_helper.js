$.extend($.View.Helpers.prototype, {
    pagination: function(url,params) {
        var current_page = parseInt(params.current_page)
        var count = Math.ceil(parseInt(params.count)/parseInt(localStorage['limit_article_display']))
        var previous_page = ((current_page - 1)<1 ? '' : current_page-1)
        var next_page = ((current_page + 1) > count ? '' : current_page+1)
        var previous_span = ''
        var next_span = ''

        //total number of items is undefined, we must end up
        if(isNaN(count)) return;

        if(previous_page != '') {
            previous_span = '<span><a href="'+url+'&amp;page='+previous_page+'">« newer</a></span>'
            }
        if(next_page != ''){
            next_span = '<span><a href="'+url+'&amp;page='+next_page+'">older »</a></span>'
            }
        
        if(previous_span == '' && next_span == '') {
            return ''
        } else {
            return '<div class="pagination">'+previous_span+next_span+'</div>'
        }
    }
});