MainModel.extend('Category',
    /* @Static */
    {
        /**
        * Retrieves categories.
        * @param {Object} params - params that might refine your results.
        * @param {Function} success - a callback function that returns wrapped category objects.
        * @param {Function} error - a callback function for an error.
        */
        box: function(params, success, error) {
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
        * Finds category by permalink.
        * @param {Array} params - params that might refine your results.
        * @param {Function} success - a callback function that returns wrapped article objects.
        * @param {Function} error - a callback function for an error.
        */
        find_by_permalink: function(params, success, error) {
            var obj = this
            db.transaction(function(tx) {
                tx.executeSql("SELECT * FROM categories WHERE permalink = ?", [params.category],
                    function(tx, rs) {
                        //parse result
                        var category = obj.parse_result(rs)[0]
                        
                        //query articles
                        params.category = category.id
                        Article.find_by_category_id(params,
                            function(articles){
                                category.articles = articles
                                return success(category,params)
                            },error)
                    },function(tx,err){
                        return error(err)
                    })
            })
        },

        find_by_article_id: function(article_id,step, success, error) {
            var obj = this
            db.transaction(function(tx) {
                tx.executeSql('SELECT * FROM categories c1 JOIN categorizations c2 ON c1.id = c2.category_id WHERE c2.article_id=?',[article_id],function(tx,rs){
                    return success(obj.parse_result(rs),step)
                })

            })
        }
    },
    /* @Prototype */
    {})