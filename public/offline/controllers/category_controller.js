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
        show: function(category,params) {
            $('.section').html(this.view('init', {
                category:category,
                params:params,
            } ))
        },

        //Events handlers

        "history.category.index subscribe": function(called, data) {
            var category = data.view
            var page = (data.page != null && data.page > 0) ? data.page : 1

            Category.find_by_permalink({
                current_page:page,
                category:category
            },this.callback('show'),this.callback(Notification.msg))
        },
    });