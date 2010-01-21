/**
 * @tag controllers, home
 */
jQuery.Controller.extend('CategoryController',
/* @Static */
{
    onDocument: true
},
/* @Prototype */
{
    show: function(articles,params) {
        $('.section').html(this.view('init', {
            articles:articles,
            params:params,
            id:params.category
        } ))
    },
    click: function(el,ev) {
        var category = el.parents().model().identity().split('_')[1]
        Article.find_by_category_id({
            current_page:1,
            category:category
        },this.callback('show'),this.callback(db_con.error))
        ev.stopDelegation();
        ev.stopPropagation(); 
    },
    //called from sidebar
    '.view click': function(el,ev) {
        this.click(el,ev)
    },
    //called from article
    '.category_view click': function(el,ev) {
        this.click(el,ev)
    },
    '.category_paginate click': function(el,ev) {
        var category = el.parents().model().identity().split('_')[1]
        Article.find_by_category_id({
            current_page:$(el).attr('id'),
            category:category
        },this.callback('show'),this.callback(db_con.error))
    }
});