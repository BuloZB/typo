jQuery.Controller.extend('ArticleController',
    /* @Static */
    {
        onDocument: true
    },
    /* @Prototype */
    {
        /**
        * Displays a list of articles.
        * @param {Array} articles - a list of articles.
        * @param {Array} params - params that might refine your results.
        */
        list: function(articles,params){
            $('.section').html(this.view('init', {
                articles:articles,
                params:params
            } ))
        },

        /**
        * Displays the archive of articles.
        * @param {Array} articles - list of articles.
        * @param {Array} params - params that might refine your results.
        */
        display_archive: function(articles,params){
            $('.section').html(this.view('init_archive', {
                articles:articles,
                params:params
            } ))
        },

        /**
        * Displays an article.
        * @param {Object} article - an article to be displayed.
        */
        show: function(article) {
            $('.section').html(this.view('show',article))
        },

        //Events handlers

        //default homepage listing
        'history.index subscribe': function(called,data) {
            var page = (data.page != null && data.page > 0) ? data.page : 1

            Article.find_all({
                current_page:page
            },this.callback('list'),this.callback(Notification.msg))
        },

        "history.page.index subscribe": function(called, data) {
            var article = data.view
            Article.find_page(article, this.callback("show"),this.callback(Notification.msg))
        },

        "history.article.index subscribe": function(called, data) {
            var article = data.view
            var page = (data.page != null && data.page > 0) ? data.page : 1

            Article.find_by_permalink(article, this.callback("show"),this.callback(Notification.msg))
        },

        "history.archive.index subscribe": function(called, data) {
            var page = (data.page != null && data.page > 0) ? data.page : 1

            Article.find_by_published_at({
                current_page:page,
                date:{
                    month:data.month,
                    year:data.year
                }
            },this.callback('display_archive'),this.callback(Notification.msg))
        },

        'form submit': function(el, ev){
            ev.preventDefault();
            var comment = new Comment( el.formParams() )
            if(!comment.save()){
                Notification.validation_errors(comment.errors)
            }
        },

        "comment.created subscribe": function(called, content){
            $('#commentList').append(this.view('comment', content))
            jQuery("#article form input[type=text]").val(""); //clear old vals
            jQuery("#article form textarea").val(""); //clear old vals

        },
    });