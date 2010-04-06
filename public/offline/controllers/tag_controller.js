jQuery.Controller.extend('TagController',
/* @Static */
{
    onDocument: true
},
/* @Prototype */
{
    /**
     * Displays articles in a tag.
     * @param {Array} articles - a list of articles.
     * @param {Array} params - params that might refine your results.
     */
    show: function(articles,params) {
        $('.section').html(this.view('init', {
            articles:articles,
            params:params,
            id:params.tag
        } ))
    },

    //Events handlers
    
    '.view click': function(el) {
        var tag = el.model().identity().split('_')[1]
        Article.find_by_tag_id({current_page:1,tag:tag},this.callback('show'),this.callback(db_con.error))
    },
    
    '.tag_paginate click': function(el,ev) {
        var tag = el.parents().model().identity().split('_')[1]
        Article.find_by_tag_id({current_page:$(el).attr('id'),tag:tag},this.callback('show'),this.callback(db_con.error))
    }
});