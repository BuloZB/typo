jQuery.Controller.extend('MainController',
/* @Static */
{
    onDocument: true
},
/* @Prototype */
{
    load: function() {
        //set time displayed in homepage
        this.time()

        //set blog settings (name, description, number of index articles etc.)
        Blog.settings([],this.callback('load_settings'),this.callback(db_con.error))

        $(window).bind('online', this.callback('is_online'))
        $(window).bind('offline',this.callback('is_online'))

        //init dialog window
        $("#dialog-message").dialog({
            modal: true,
            autoOpen: false,
            show: 'clip'
        });

        //initial syncing, when user comes for the first time
        this.initial_syncing()
    },
    
    /**
     * Shows current time in a template.
     */
    time: function() {
        var date = new Date()
        $('#date > span').html(date.toLocaleDateString())
    },

    /**
     * Displays a list of articles.
     * @param {Array} articles - a list of articles.
     * @param {Array} params - params that might refine your results.
     */
    article_list: function(articles,params){
        $('#article').html(this.view('article/init', {
            articles:articles,
            params:params,
        } ))
    },

    /**
     * Displays a message in offline mode.
     */
    offline_msg: function() {
        Notification.msg('This function is not available in offline mode')
    },

    /**
     * Displays a page.
     * @param {Object} page - a page to be displayed.
     */
    show_page: function(page) {
        $('#article').html(this.view('article/show',page[0]))
    },

    /**
     * Displays an archive of articles.
     * @param {Array} articles - a list of articles.
     */
    archive: function(articles) {
        $('#article').html(this.view('article/archive', {
            articles:articles,
        } ))
    },

    /**
     * Sets blog settings.
     * @param {Array} settings - blog settings.
     */
    load_settings: function(settings) {
        //blog header
        $('#logo > hgroup > h1').html(settings['blog_name'])
        $('#logo > hgroup > h2').html(settings['blog_subtitle'])

        //number of articles in index
        if(parseInt(localStorage['limit_article_display']) != parseInt(settings['limit_article_display'])) {
            localStorage['limit_article_display'] = settings['limit_article_display']
        }
    },

    /**
     * Displays user status.
     */
    is_online: function() {
        var status = navigator.onLine ? 'online' : 'offline'
        var el = $('#status')
        el.attr("class",status + '-status')
        el.html(status)
        Notification.msg("You are now " + status)
    },

    /**
     * Performs initial db syncing.
     */
    initial_syncing: function() {
        if(typeof localStorage['last_sync'] == 'undefined') {
            if(navigator.onLine) {
                this.syncing_dialog('<p>It seems you are here for the first time. Before you continue, you must sync your db for offline using.<br/><br/>Click on sync button to start synchronization process.</p>')
            } else {
                Notification.msg("Sync error: you must be online.")
            }
        }
    },

    /**
     * Displays a dialog for syncing process.
     * @param {String} msg - a message to be displayed.
     */
    syncing_dialog: function(msg) {
        //content of dialog
        $('#dialog-message').html(msg)

        var obj = this

        $('#dialog-message').dialog('option','title','Syncing process')
        $('#dialog-message').dialog('option','buttons',{
            sync: function() {
                Synchronization.start()

                $('#dialog-message').dialog('option','buttons',{
                    done: function() {
//                        $(this).dialog('close')
                        window.location.reload()
                    }
                })
                $('#dialog-message').html('Syncing done succesfully. Click on done button.')
                $('#dialog-message').dialog('open')

                //we must reload a page with new data
//                Article.find_all({
//                    current_page:1
//                }, obj.callback('article_list'),obj.callback(db_con.error))
//
//                Blog.settings([],obj.callback('load_settings'),obj.callback(db_con.error))
            },
        })
        $('#dialog-message').dialog('open')
    },

    //Events handlers
    
    '#searchform submit': function(el) {
        this.offline_msg()
    },

    '#home-page click': function(el) {
        Article.find_all({
            current_page:1
        }, this.callback('article_list'),this.callback(db_con.error));
    },

    '.offline click': function(el) {
        this.offline_msg()
    },

    '.page click': function(el) {
        Article.find_page($(el).attr('id'), this.callback('show_page'),this.callback(db_con.error));
    },

    '#archive click': function(el) {
        Article.find_archive({},this.callback('archive'),this.callback(db_con.error))
    },

    '#synchronize click': function() {
        if(navigator.onLine) {
            this.syncing_dialog("To start syncing please click on sync button.")
        } else {
            Notification.msg("Sync error: you must be online.")
        }
    }
});