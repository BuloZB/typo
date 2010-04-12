jQuery.Controller.extend('CategoryController',
/* @Static */
{
    onDocument: true
},
/* @Prototype */
{
    /**
     * Displays articles in a category.
     * @param {Array} articles - a list of articles.
     * @param {Array} params - params that might refine your results.
     */
    show: function(articles,params) {
        $('.section').html(this.view('init', {
            articles:articles,
            params:params,
            id:params.category
        } ))
    },

    /**
     * Displays first page of categories list.
     * @param {Object} el - invoked element.
     * @param {Object} ev - invoked event.
     */
    click: function(el,ev) {
        var category = el.parents().model().identity().split('_')[1]
        Article.find_by_category_id({
            current_page:1,
            category:category
        },this.callback('show'),this.callback(Notification.msg))
        ev.stopDelegation();
        ev.stopPropagation(); 
    },

    //Events handlers

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
        },this.callback('show'),this.callback(Notification.msg))
    }
});