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

        Article.find_all({
            current_page:1
        }, this.callback('list'),this.callback(db_con.error));
    },
    /**
     * Displays a list of articles
     * @param {Array} articles An array of Article objects.
     */
    list: function(articles,params){
        $('.section').html(this.view('init', {
            articles:articles,
            params:params
        } ))
    },
    list_archive: function(articles,params){
        $('.section').html(this.view('init_archive', {
            articles:articles,
            params:params
        } ))
    },
    show: function(article) {
        $('.section').html(this.view('show',article[0]))
    },
    paginate: function(el,ev) {
        Article.find_all({
            current_page:$(el).attr('id')
        },this.callback('list'),this.callback(db_con.error))
    },
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
//        var date = el.parents().model().identity().split('_')[1]
        alert($(el).parent().get(0).className)
        Article.find_by_published_at({
            current_page:$(el).attr('id'),
            date:date
        },this.callback('list_archive'),this.callback(db_con.error))
    }
});