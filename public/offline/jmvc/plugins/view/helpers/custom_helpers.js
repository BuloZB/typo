$.extend($.View.Helpers.prototype, {
    pagination: function(url,params) {
        var current_page = parseInt(params.current_page)
        var count = Math.ceil(parseInt(params.count)/parseInt(localStorage['limit_article_display']))
        var previous_page = ((current_page - 1)<1 ? '' : current_page-1)
        var next_page = ((current_page + 1) > count ? '' : current_page+1)
        var search = ''
        var previous_span = ''
        var next_span = ''

        //total number of items is undefined, we must end up
        if(isNaN(count)) return;

        if(params.search != undefined) {
            search = '&amp;q=' + params.search
        }

        if(previous_page != '') {
            previous_span = '<span><a href="' + url + '&amp;page=' + previous_page + search +'">« newer</a></span>'
        }
        if(next_page != ''){
            next_span = '<span><a href="' + url + '&amp;page=' + next_page + search +'">older »</a></span>'
        }
        
        if(previous_span == '' && next_span == '') {
            return ''
        } else {
            return '<div class="pagination">' + previous_span + next_span + '</div>'
        }
    },

    mark_search_term: function(articles,term) {
        var reg = new RegExp(term, "gi")
        $.each(articles,function(i,value) {
            articles[i].title = value.title.replace(reg,function(str) {
                return "<mark>" + str + "</mark>"
            })
        })
    }
});