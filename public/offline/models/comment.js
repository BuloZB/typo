MainModel.extend('Comment',
    /* @Static */
    {
        init: function() {
            // Call the base classes constructor.
            this._super();

            this.validatesPresenceOf(['author'], {
                message: "must be supplied"
            });

            this.validatesPresenceOf(['body'], {
                message: 'must be supplied'
            });
        },
    
        /**
        * Creates a comment.
        * @param {Object} attrs - a comment's attributes.
        * @param {Function} success - a callback function that indicates a successful create.
        * @param {Function} error - a callback function for an error.
        */
        create: function(attrs, success, error){
            var obj = this
            db.transaction(function(tx) {
                tx.executeSql("INSERT INTO feedback (type,author,body,article_id,email,url,ip,published,state) VALUES (?,?,?,?,?,?,?,?,?)",
                    ['Comment',attrs['author'],attrs['body'],attrs['article_id'],attrs['email'],attrs['url'],'',1,'presumed_ham'],
                    function(tx, rs) {
                        tx.executeSql("INSERT INTO sync (table_name,row_id,action) VALUES (?,?,?)",['feedback',rs.insertId,'post'],
                            function(rs,tx){
                                //we need to display date when the comment was created.
                                var created_at = new Date()
                                attrs['created_at'] = created_at.strftime('%Y-%m-%d %H:%M:%S')
                                attrs['published'] = 1
                                return success(attrs)
                            },
                            function(tx,err){
                                return error(err)
                            })
                    },
                    function(tx, err) {
                        return error(err)
                    })
            })
        },

        /**
        * Finds comments by article id.
        * @param {Integer} id - unique id representing your content.
        * @param {Function} success - a callback function that returns wrapped article objects.
        * @param {Function} error - a callback function for an error.
        */
        find_by_article_id: function(article_id, success, error) {
            var obj = this
            db.transaction(function(tx) {
                tx.executeSql('SELECT * FROM feedback WHERE article_id = ? and type = "Comment"',[article_id],function(tx,rs){
                    return success(obj.parse_result(rs))
                })

            })
        },

        /**
        * Counts comments by article id.
        * @param {Integer} id - unique id representing your content.
        * @param {Function} success - a callback function that returns wrapped article objects.
        * @param {Function} error - a callback function for an error.
        */
        count: function(article_id,success) {
            var obj = this
            db.transaction(function(tx) {
                tx.executeSql('SELECT count(*) FROM feedback WHERE article_id = ? and type = "Comment"',[article_id],function(tx,rs){
                    return success(obj.parse_result(rs))
                })

            })
        }
    },
    /* @Prototype */
    {})