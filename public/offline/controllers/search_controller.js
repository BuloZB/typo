/**
 * @tag controllers, home
 */
jQuery.Controller.extend('SearchController',
/* @Static */
{
    onDocument: true
},
/* @Prototype */
{
    display_articles: function(articles,params) {
        $('.section').html(this.view('init', {
            articles:articles,
            params:params
        } ))
    },

    perform_search: function(query,page) {
        if(query.length > 1) {
            window.location.hash = "#search&page=" + page + "&q=" + query
            Article.search({
                current_page:page,
                search:query
            },this.callback('display_articles'),this.callback(Notification.msg))
        } else {
            Notification.msg("The length of a search term must be more than 1 character")
        }
    },

    //Events handler

    //goes from search from
    "form submit": function(el,ev) {
        this.perform_search($("#q").val(),1)
    },

    //goes form url
    "history.search.index subscribe": function(called,data) {
        this.perform_search(data.q,data.page)
    }
});