/**
 * @tag models, home
 * Wraps backend category services.  Enables 
 * [Category.static.findAll retrieving],
 * [Category.static.update updating],
 * [Category.static.destroy destroying], and
 * [Category.static.create creating] categories.
 */
$.Model.extend('Category',
/* @Static */
{
    /**
     * Retrieves categories data from your backend services.
     * @param {Object} params params that might refine your results.
     * @param {Function} success a callback function that returns wrapped category objects.
     * @param {Function} error a callback function for an error in the ajax request.
     */
    sidebar: function(params, success, error) {
        var obj = this
        db.transaction(function(tx) {
            tx.executeSql("SELECT categories.id, categories.name, categories.permalink, categories.position, COUNT(articles.id) AS article_counter " +
                "FROM categories categories " +
                "LEFT OUTER JOIN categorizations articles_categories " +
                "ON articles_categories.category_id = categories.id " +
                "LEFT OUTER JOIN contents articles " +
                "ON (articles_categories.article_id = articles.id AND articles.published = 1) " +
                "GROUP BY categories.id, categories.name, categories.position, categories.permalink " +
                "ORDER BY position", [],
                function(tx, rs) {
                    return success(obj.parse_result(rs))
                },function(tx,error){
                    alert(error.message)
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
                permalink: row['permalink'],
                position: row['position'],
                article_counter: row['article_counter'],
            }
        }
        return this.wrapMany(result)
    }
},
/* @Prototype */
{})