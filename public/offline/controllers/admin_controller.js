jQuery.Controller.extend('AdminController',
    /* @Static */
    {
        onDocument: true
    },
    /* @Prototype */
    {
        "history.new-article.index subscribe": function() {
            $('.section').html(this.view('article/new'))
        },

        '#new-article submit': function(el, ev){
            ev.preventDefault();
            var article = new Article( el.formParams() )
            if(!article.save()){
                Notification.validation_errors(article.errors)
            }
        },

        "article.created subscribe": function(called, content){
            Notification.msg("The article has been saved")
            jQuery("#new-article input[type=text]").val(""); //clear old vals
            jQuery("#new-article textarea").val(""); //clear old vals
        },
    });