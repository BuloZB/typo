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
        show: function(tag,params) {
            $('.section').html(this.view('init', {
                tag:tag,
                params:params,
            } ))
        },

        //Events handlers
        "history.tag.index subscribe": function(called, data) {
            var tag = data.view
            var page = (data.page != null && data.page > 0) ? data.page : 1
            
            Tag.find_by_name({
                current_page:page,
                tag:tag
            },this.callback('show'),this.callback(Notification.msg))
        },
    });