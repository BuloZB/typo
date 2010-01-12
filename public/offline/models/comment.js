/**
 * @tag models, home
 * Wraps backend comment services.  Enables 
 * [Comment.static.findAll retrieving],
 * [Comment.static.update updating],
 * [Comment.static.destroy destroying], and
 * [Comment.static.create creating] comments.
 */
$.Model.extend('Comment',
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
     * @param {Object} attrs A comment's attributes.
     * @param {Function} success a callback function that indicates a successful create.  The data that comes back must have an ID property.
     * @param {Function} error a callback that should be called with an object of errors.
     */
    create : function(attrs, success, error){
        var obj = this
        db.transaction(function(tx) {
            tx.executeSql("INSERT INTO feedback (type,author,body,article_id,email,url,ip,published,state) VALUES (?,?,?,?,?,?,?,?,?)",
                ['Comment',attrs['author'],attrs['body'],attrs['article_id'],attrs['email'],attrs['url'],'',1,'presumed_ham'],
                function(tx, rs) {
                    tx.executeSql("INSERT INTO sync (table_name,row_id,action) VALUES (?,?,?)",['feedback',rs.insertId,'post'],
                        function(rs,tx){
                            //we need to display when the comment was created.
                            var created_at = new Date()
                            attrs['created_at'] = created_at.strftime('%Y-%d-%m %H-%M-%S')
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
    }
},
/* @Prototype */
{})