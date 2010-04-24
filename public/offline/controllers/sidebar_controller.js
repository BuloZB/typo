jQuery.Controller.extend('SidebarController',
/* @Static */
{
    onDocument: true
},
/* @Prototype */
{
    /**
     * Loads all boxes
     */
    load: function() {
        this.status_box()
        this.search_box()
        Category.box([],this.callback('categories_box'))
        Tag.box([],this.callback('tags_box'),this.callback(Notification.msg))
        Article.archives_box([],this.callback('archives_box'),this.callback(Notification.msg))
        Article.page_box([],this.callback('page_box'),this.callback(Notification.msg))
    },

    /**
     * Creates search box.
     */
    search_box: function() {
        if(!$('#search-box').length) {
            $('#sidebar').append($(document.createElement('section')).attr('id','search-box'))
        }
        $("#search-box").html(this.view('sidebar/search',{}))
    },

    /**
     * Creates categories box.
     * @param {Array} categories - a list of categories.
     */
    categories_box: function(categories) {
        if(!$('#categories-box').length) {
            $('#sidebar').append($(document.createElement('section')).attr('id','categories-box'))
        }
        $("#categories-box").html(this.view('sidebar/category',{
            categories:categories
        }))
    },

    /**
     * Creates tags box.
     * @param {Array} tags - a list of tags.
     */
    tags_box: function(tags) {
        if (!$('#tags-box').length) {
            $('#sidebar').append($(document.createElement('section')).attr('id','tags-box'))
        }
        $("#tags-box").html(this.view('sidebar/tag',{
            tags:tags
        }))
    },

    /**
     * Creates archives box.
     * @param {Array} articles - a list of articles.
     */
    archives_box: function(articles) {
        if (!$('#archives-box').length) {
            $('#sidebar').append($(document.createElement('section')).attr('id','archives-box'))
        }
        $("#archives-box").html(this.view('sidebar/archive',{
            articles:articles
        }))
    },

    /**
     * Creates page box.
     * @param {Array} pages - a list of pages.
     */
    page_box: function(pages) {
        if (!$('#page-box').length) {
            $('#sidebar').append($(document.createElement('section')).attr('id','page-box'))
        }
        $("#page-box").html(this.view('sidebar/page',{
            pages:pages
        }))
    },

    /**
     * Creates status box.
     */
    status_box: function() {
        if (!$('#status-box').length) {
            $('#sidebar').append($(document.createElement('section')).attr('id','status-box'))
        }
        var last_sync = localStorage['last_sync']
        $("#status-box").html(this.view('sidebar/status',{
            last_sync:last_sync
        }))
    },

    //Events handlers
    
    '#synchronize click': function() {
        //when we click on sync button, we need to reload all sidebars with new data
        this.load()
    }
});