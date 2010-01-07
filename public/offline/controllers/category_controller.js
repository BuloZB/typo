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
    show: function(articles,current_page,count) {
        $('.section').html(this.view('init', {
            articles:articles,
            current_page:current_page,
            count:count,
        } ))
    },
    click: function(el,ev) {
        var element = el.parents().model()
        Article.find_by_category_id([1,element.identity()],this.callback('show'),this.callback(db_con.error))
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
        Article.find_all([$(el).attr('id')],this.callback('show'),this.callback(db_con.error))
    }
});