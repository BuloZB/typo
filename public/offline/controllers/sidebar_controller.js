jQuery.Controller.extend('SidebarController',
/* @Static */
{
    onDocument: true
},
/* @Prototype */
{
    load: function(sidebars) {
        this.sidebar_status()
        this.sidebar_search()
        Category.sidebar([],this.callback('sidebar_category'))
        Tag.sidebar([],this.callback('sidebar_tag'),this.callback(db_con.error))
        Article.sidebar([],this.callback('sidebar_archive'),this.callback(db_con.error))
        Article.sidebar_page([],this.callback('sidebar_page'),this.callback(db_con.error))
    },

    /**
     * Creates search sidebar.
     */
    sidebar_search: function() {
        if(!$('#SearchSidebar').length) {
            $('#boxes').append($(document.createElement('section')).attr('id','SearchSidebar'))
        }
        $("#SearchSidebar").html(this.view('sidebar/search',{}))
    },

    /**
     * Creates category sidebar.
     * @param {Array} categories - a list of categories.
     */
    sidebar_category: function(categories) {
        if(!$('#CategorySidebar').length) {
            $('#boxes').append($(document.createElement('section')).attr('id','CategorySidebar'))
        }
        $("#CategorySidebar").html(this.view('sidebar/category',{
            categories:categories
        }))
    },

    /**
     * Creates tag sidebar.
     * @param {Array} tags - a list of tags.
     */
    sidebar_tag: function(tags) {
        if (!$('#TagSidebar').length) {
            $('#boxes').append($(document.createElement('section')).attr('id','TagSidebar'))
        }
        $("#TagSidebar").html(this.view('sidebar/tag',{
            tags:tags
        }))
    },

    /**
     * Creates archive sidebar.
     * @param {Array} articles - a list of articles.
     */
    sidebar_archive: function(articles) {
        if (!$('#ArchivesSidebar').length) {
            $('#boxes').append($(document.createElement('section')).attr('id','ArchivesSidebar'))
        }
        $("#ArchivesSidebar").html(this.view('sidebar/archive',{
            articles:articles
        }))
    },

    /**
     * Creates page sidebar.
     * @param {Array} pages - a list of pages.
     */
    sidebar_page: function(pages) {
        if (!$('#PageSidebar').length) {
            $('#boxes').append($(document.createElement('section')).attr('id','PageSidebar'))
        }
        $("#PageSidebar").html(this.view('sidebar/page',{
            pages:pages
        }))
    },

    /**
     * Creates status sidebar.
     */
    sidebar_status: function() {
        if (!$('#StatusSidebar').length) {
            $('#boxes').append($(document.createElement('section')).attr('id','StatusSidebar'))
        }
        var status = navigator.onLine ? 'online' : 'offline'
        var last_sync = localStorage['last_sync']
        $("#StatusSidebar").html(this.view('sidebar/status',{
            status:status,
            last_sync:last_sync
        }))
    },

    //Events handlers
    
    '#synchronize click': function() {
        //when we click on sync button, we need to reload all sidebars with new data
        this.load()
    }
});