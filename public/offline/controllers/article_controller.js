jQuery.Controller.extend('ArticleController',
/* @Static */
{
    onDocument: true
},
/* @Prototype */
{
    load: function(){
        if(!$("#article").length)
            $('.section').attr('id','article')

        Article.find_all({
            current_page:1
        }, this.callback('list'),this.callback(db_con.error));
    },

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
    list_archive: function(articles,params){
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
        $('.section').html(this.view('show',article[0]))
    },

    /**
     * Pagination for articles
     */
    paginate: function(el,ev) {
        Article.find_all({
            current_page:$(el).attr('id')
        },this.callback('list'),this.callback(db_con.error))
    },

    //Events handlers
    
    '.view click': function(el) {
        var article = el.parents().model().identity()
        Article.find_by_id(article,this.callback('show'),this.callback(db_con.error))
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

    '#form-preview-button click': function(el) {
        
    },

    '.archive click': function(el) {
        Article.find_by_published_at({
            current_page:1,
            date:$(el).attr('id'),
            //we need to add action because of pagination
            action:"archive"
        },this.callback('list_archive'),this.callback(db_con.error))
    },

    '.article_paginate click': function(el,ev) {
        this.paginate(el,ev)
    },

    '.archive_paginate click': function(el,ev) {
        Article.find_by_published_at({
            current_page:$(el).attr('id'),
            //we take additional info from parent's class attribute
            date:$(el).parent().attr('class'),
            action:"archive"
        },this.callback('list_archive'),this.callback(db_con.error))
    }
});