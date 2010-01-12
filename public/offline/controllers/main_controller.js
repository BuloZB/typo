/**
 * @tag controllers, home
 */
jQuery.Controller.extend('MainController',
/* @Static */
{
    onDocument: true
},
/* @Prototype */
{
    load: function() {
        //set time displayed on homepage
        this.time()

        //set blog settings (name, description, number of index articles etc.)
        Blog.settings([],this.callback('load_settings'),this.callback(db_con.error))
    },
    /**
     * Shows current time in template
     */
    time: function() {
        var date = new Date()
        $('#date').html(date.toLocaleDateString())
    },
    /**
     * Displays a list of articles
     * @param {Array} articles An array of Article objects.
     */
    article_list: function(articles,current_page,count){
        $('#article').html(this.view('article/init', {
            articles:articles,
            current_page: current_page,
            count: count
        } ))
    },
    /**
     * Displays meessage about unvailable function because of offline mode
     */
    offline_msg: function() {
        Notification.msg('This function is not available in offline mode')
    },
    /**
     * Displays a page
     * @param {Array} page a page to be displayed
     */
    show_page: function(page) {
        $('#article').html(this.view('article/show',page[0]))
    },
    /**
     * Displays the archive of articles
     * @param {Array} articles An array of Article objects.
     */
    archive: function(articles) {
        $('#article').html(this.view('article/archive', {
            articles:articles,
        } ))
    },
    /**
     * Set blog settings
     * @param {Array} settings blog settings
     */
    load_settings: function(settings) {
        //set blog name a description
        $('#logo > hgroup > h1').html(settings['blog_name'])
        $('#logo > hgroup > h2').html(settings['blog_subtitle'])

        //set number of articles to be displayed on index page
        localStorage['limit_article_display'] = settings['limit_article_display']
    },
    '#searchform submit': function(el) {
        this.offline_msg()
    },
    '#home-page click': function(el) {
        Article.find_all([1], this.callback('article_list'),this.callback(db_con.error));
    },
    '.offline click': function(el) {
        this.offline_msg()
    },
    '.page click': function(el) {
        Article.find_page($(el).attr('id'), this.callback('show_page'),this.callback(db_con.error));
    },
    '#archive click': function(el) {
        Article.find_archive([],this.callback('archive'),this.callback(db_con.error))
    }
});