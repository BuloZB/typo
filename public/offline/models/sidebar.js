/**
 * @tag models, home
 * Wraps backend sidebar services.  Enables 
 * [Sidebar.static.findAll retrieving],
 * [Sidebar.static.update updating],
 * [Sidebar.static.destroy destroying], and
 * [Sidebar.static.create creating] sidebars.
 */
$.Model.extend('Sidebar',
/* @Static */
{
    /**
     * Retrieves sidebars data from your backend services.
     * @param {Object} params params that might refine your results.
     * @param {Function} success a callback function that returns wrapped sidebar objects.
     * @param {Function} error a callback function for an error in the ajax request.
     */
    find_all : function(params, success, error){
        var obj = this
        db.transaction(function(tx) {
            tx.executeSql("SELECT * FROM sidebars ORDER BY active_position ASC", [],
                function(tx, rs) {
                    return success(obj.parse_result(rs))
                },
                function(tx, error) {
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
                type: row['type'],
            }
        }
        return this.wrapMany(result)
    },
},
/* @Prototype */
{})