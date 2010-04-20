jQuery.Controller.extend('NavigationController',
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
        display_article_list: function(articles,params){
            $('.section').html(this.view('article/init', {
                articles:articles,
                params:params,
            } ))
        },

        /**
        * Displays a page.
        * @param {Object} page - a page to be displayed.
        */
        display_page: function(page) {
            $('.section').html(this.view('article/show',page))
        },
        
        /**
        * Displays an archive of articles.
        * @param {Array} articles - a list of articles.
        */
        display_archive: function(articles) {
            $('.section').html(this.view('article/archive', {
                articles:articles,
            } ))
        },

        //Events handlers

        "history.menu-home.index subscribe": function (el, ev) {
            Article.find_all({
                current_page:1
            },this.callback("display_article_list"),this.callback(Notification.msg))
        },

        "history.menu-archives.index subscribe": function(el, ev) {
            Article.find_all({},this.callback("display_archive"),this.callback(Notification.msg))
        },

        "history.menu-about.index subscribe": function(el, ev) {
            Article.find_page("about",this.callback("display_page"),this.callback(Notification.msg))
        }
    });