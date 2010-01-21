/**
 * @tag models, home
 * Wraps backend tag services.  Enables 
 * [Tag.static.findAll retrieving],
 * [Tag.static.update updating],
 * [Tag.static.destroy destroying], and
 * [Tag.static.create creating] tags.
 */
$.Model.extend('Tag',
/* @Static */
{
    /**
     * Retrieves tags data from your backend services.
     * @param {Object} params params that might refine your results.
     * @param {Function} success a callback function that returns wrapped tag objects.
     * @param {Function} error a callback function for an error in the ajax request.
     */
    sidebar: function(params, success, error) {
        var obj = this
        db.transaction(function(tx) {
            tx.executeSql("SELECT tags.id, tags.name, tags.display_name, COUNT( articles_tags.article_id ) AS article_counter "+
                "FROM tags tags "+
                "LEFT OUTER JOIN articles_tags articles_tags ON articles_tags.tag_id = tags.id "+
                "LEFT OUTER JOIN contents articles ON articles_tags.article_id = articles.id "+
                "WHERE articles.published =1 "+
                "GROUP BY tags.id, tags.name, tags.display_name "+
                "ORDER BY tags.name", [],
                function(tx, rs) {
                    return success(obj.parse_result(rs))
                },function(tx,err) {
                    return error(err)
                })
        })
    },
    /**
     * Parse result of sql
     * @param {Object} sql result
     */
    parse_result: function(rs) {
        var result = []
        for(var i=0; i<rs.rows.length; i++) {
            var row = rs.rows.item(i)
            result[i] = {
                id: row['id'],
                name: row['name'],
                display_name: row['display_name'],
                article_counter: row['article_counter'],
            }
        }
        return this.wrapMany(result)
    }
},
/* @Prototype */
{
    /**
     * Counts font size of tag inside tag sidebar
     * @param {Array} tags tags
     */
    font_size: function(tags) {
        var total = 0;
        jQuery.each(tags, function(i,data){
            total += parseInt(data.article_counter)
        })
        var average = parseFloat(total)/parseFloat(tags.length)
        var size = parseFloat(this.article_counter)/average
        var font_size = Math.min(Math.max(2.0/3.0,size),2) * 100
        return font_size
    }
})