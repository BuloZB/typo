MainModel.extend('Tag',
    /* @Static */
    {
        /**
         * Retrieves tags data.
         * @param {Object} params - params that might refine your results.
         * @param {Function} success - a callback function that returns wrapped tag objects.
         * @param {Function} error - a callback function for an error.
         */
        box: function(params, success, error) {
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
        * Finds tag by name.
        * @param {Array} params - params that might refine your results.
        * @param {Function} success - a callback function that returns wrapped article objects.
        * @param {Function} error - a callback function for an error.
        */
        find_by_name: function(params, success, error) {
            var obj = this
            db.transaction(function(tx) {
                tx.executeSql("SELECT * FROM tags WHERE name = ?", [params.tag],
                    function(tx, rs) {
                        //parse result
                        var tag = obj.parse_result(rs)[0]
                        
                        //query articles
                        params.tag = tag.id
                        Article.find_by_tag_id(params,
                            function(articles){
                                tag.articles = articles
                                return success(tag,params)
                            },error)
                    },function(tx,err){
                        return error(err)
                    })
            })
        },

        find_by_article_id: function(article_id, success, error) {
            var obj = this
            db.transaction(function(tx) {
                tx.executeSql('SELECT tags.* FROM tags tags JOIN articles_tags at ON tags.id=at.tag_id JOIN contents contents on contents.id = at.article_id WHERE contents.id=?',[article_id],function(tx,rs){
                    return success(obj.parse_result(rs))
                })

            })
        }
    },
    /* @Prototype */
    {
        /**
        * Counts font size of a tag.
        * @param {Array} tags - a list of tags.
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