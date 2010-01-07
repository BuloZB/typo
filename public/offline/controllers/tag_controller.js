/**
 * @tag controllers, home
 */
jQuery.Controller.extend('TagController',
/* @Static */
{
    onDocument: true
},
/* @Prototype */
{
    show: function(articles,current_page,count) {
        $('.section').html(this.view('init', {
            articles:articles,
            current_page:current_page,
            count:count
        } ))
    },
    '.view click': function(el) {
        var element = el.model()
        Article.find_by_tag_id([1,element.identity()],this.callback('show'),this.callback(db_con.error))
    }
});