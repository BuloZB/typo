/**
 * @tag controllers, home
 * Displays a table of articles.  Lets the user 
 * ["ArticleController.prototype.form submit" create], 
 * ["ArticleController.prototype.&#46;edit click" edit],
 * or ["ArticleController.prototype.&#46;destroy click" destroy] articles.
 */
jQuery.Controller.extend('ArticleController',
/* @Static */
{
    onDocument: true
},
/* @Prototype */
{
    /**
     * When the page loads, gets all articles to be displayed.
     */
    load: function(){
        if(!$("#article").length)
            $('.section').attr('id','article')
        Article.find_all([1], this.callback('list'),this.callback(db_con.error));
    },
    /**
     * Displays a list of articles
     * @param {Array} articles An array of Article objects.
     */
    list: function(articles,current_page,count){
        $('.section').html(this.view('init', {
            articles:articles,
            current_page:current_page,
            count:count
        } ))
    },
    list_archive: function(articles,current_page,count){
        $('.section').html(this.view('init_archive', {
            articles:articles,
            current_page:current_page,
            count:count
        } ))
    },
    show: function(article) {
        $('.section').html(this.view('show',article[0]))
    },
    '.view click': function(el) {
        var article = el.parents().model()
        Article.find_by_id(article.identity(),this.callback('show'),this.callback(db_con.error))
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
        jQuery("#article form input[type!=submit]").val(""); //clear old vals
        jQuery("#article form textarea").val(""); //clear old vals

    },
    '#form-preview-button click': function(el) {
        
    },
    '.archive click': function(el) {
        Article.find_by_published_at([1,$(el).attr('id')],this.callback('list'),this.callback(db_con.error))
    },
    '.article_paginate click': function(el,ev) {
        Article.find_all([$(el).attr('id')],this.callback('list'),this.callback(db_con.error))
    },
    '.archive_paginate click': function(el,ev) {
        Article.find_all([$(el).attr('id')],this.callback('list'),this.callback(db_con.error))
    }
});