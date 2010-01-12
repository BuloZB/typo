/**
 * @tag controllers, home
 */
jQuery.Controller.extend('SidebarController',
/* @Static */
{
    onDocument: true
},
/* @Prototype */
{
    load: function(sidebars) {
        Category.sidebar([],this.callback('sidebar_category'))
        Tag.sidebar([],this.callback('sidebar_tag'),this.callback(db_con.error))
        Article.sidebar([],this.callback('sidebar_archive'),this.callback(db_con.error))
        Article.sidebar_page([],this.callback('sidebar_page'),this.callback(db_con.error))
    },
    sidebar_category: function(categories) {
        if(!$('#CategorySidebar').length) {
            $('#boxes').append($(document.createElement('section')).attr('id','CategorySidebar'))
        }
        $("#CategorySidebar").html(this.view('sidebar/category',{
            categories:categories
        }))
    },
    sidebar_tag: function(tags) {
        if (!$('#TagSidebar').length) {
            $('#boxes').append($(document.createElement('section')).attr('id','TagSidebar'))
        }
        $("#TagSidebar").html(this.view('sidebar/tag',{
            tags:tags
        }))
    },
    sidebar_archive: function(articles) {
        if (!$('#ArchivesSidebar').length) {
            $('#boxes').append($(document.createElement('section')).attr('id','ArchivesSidebar'))
        }
        $("#ArchivesSidebar").html(this.view('sidebar/archive',{
            articles:articles
        }))
    },
    sidebar_page: function(pages) {
        if (!$('#PageSidebar').length) {
            $('#boxes').append($(document.createElement('section')).attr('id','PageSidebar'))
        }
        $("#PageSidebar").html(this.view('sidebar/page',{
            pages:pages
        }))
    }
});