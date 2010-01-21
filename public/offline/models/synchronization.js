/**
 * @tag models, home
 * Wraps backend synchronization services.
 */
$.Model.extend('Synchronization',
/* @Static */
{
    start: function(success, error) {
        var obj = new Synchronization()
        obj.sync_remote_feedback_table()
        Synchronization.blog([],obj.sync_blog_table)
        Synchronization.articles_tags([],obj.sync_articles_tags_table)
        Synchronization.categories([],obj.sync_categories_table)
        Synchronization.categorizations([],obj.sync_categorizations_table)
        Synchronization.sidebars([],obj.sync_table_sidebars)
        Synchronization.tags([],obj.sync_table_tags)
        Synchronization.contents([],obj.sync_table_contents)
        Synchronization.feedback([],obj.sync_table_feedback)
        localStorage['last_sync'] = (new Date()).getTime()
        return success
    },
    /**
     * Retrieves synchronizations data from your backend services.
     * @param {Object} params params that might refine your results.
     * @param {Function} success a callback function that returns wrapped synchronization objects.
     * @param {Function} error a callback function for an error in the ajax request.
     */
    blog : function(params, success, error){
        $.ajax({
            url: '/sync/blog.json',
            type: 'get',
            dataType: 'json',
            data: params,
            success: this.callback(['wrapMany',success]),
            error: error,
            async: false,
            fixture: false //calculates the fixture path from the url and type.
        })
    },
    /**
     * Retrieves synchronizations data from your backend services.
     * @param {Object} params params that might refine your results.
     * @param {Function} success a callback function that returns wrapped synchronization objects.
     * @param {Function} error a callback function for an error in the ajax request.
     */
    categories : function(params, success, error){
        $.ajax({
            url: '/sync/categories.json',
            type: 'get',
            dataType: 'json',
            data: params,
            success: this.callback(['wrapMany',success]),
            error: error,
            async: false,
            fixture: false //calculates the fixture path from the url and type.
        })
    },
    /**
     * Retrieves synchronizations data from your backend services.
     * @param {Object} params params that might refine your results.
     * @param {Function} success a callback function that returns wrapped synchronization objects.
     * @param {Function} error a callback function for an error in the ajax request.
     */
    categorizations : function(params, success, error){
        $.ajax({
            url: '/sync/categorizations.json',
            type: 'get',
            dataType: 'json',
            data: params,
            success: this.callback(['wrapMany',success]),
            error: error,
            async: false,
            fixture: false //calculates the fixture path from the url and type.
        })
    },
    /**
     * Retrieves synchronizations data from your backend services.
     * @param {Object} params params that might refine your results.
     * @param {Function} success a callback function that returns wrapped synchronization objects.
     * @param {Function} error a callback function for an error in the ajax request.
     */
    contents : function(params, success, error){
        $.ajax({
            url: '/sync/contents.json',
            type: 'get',
            dataType: 'json',
            data: params,
            success: this.callback(['wrapMany',success]),
            error: error,
            async: false,
            fixture: false //calculates the fixture path from the url and type.
        })
    },
    /**
     * Retrieves synchronizations data from your backend services.
     * @param {Object} params params that might refine your results.
     * @param {Function} success a callback function that returns wrapped synchronization objects.
     * @param {Function} error a callback function for an error in the ajax request.
     */
    feedback : function(params, success, error){
        $.ajax({
            url: '/sync/feedback.json',
            type: 'get',
            dataType: 'json',
            data: params,
            success: this.callback(['wrapMany',success]),
            error: error,
            async: false,
            fixture: false //calculates the fixture path from the url and type.
        })
    },
    /**
     * Retrieves synchronizations data from your backend services.
     * @param {Object} params params that might refine your results.
     * @param {Function} success a callback function that returns wrapped synchronization objects.
     * @param {Function} error a callback function for an error in the ajax request.
     */
    sidebars : function(params, success, error){
        $.ajax({
            url: '/sync/sidebars.json',
            type: 'get',
            dataType: 'json',
            data: params,
            success: this.callback(['wrapMany',success]),
            error: error,
            async: false,
            fixture: false //calculates the fixture path from the url and type.
        })
    },
    /**
     * Retrieves synchronizations data from your backend services.
     * @param {Object} params params that might refine your results.
     * @param {Function} success a callback function that returns wrapped synchronization objects.
     * @param {Function} error a callback function for an error in the ajax request.
     */
    tags : function(params, success, error){
        $.ajax({
            url: '/sync/tags.json',
            type: 'get',
            dataType: 'json',
            data: params,
            success: this.callback(['wrapMany',success]),
            error: error,
            async: false,
            fixture: false //calculates the fixture path from the url and type.
        })
    },
    /**
     * Retrieves synchronizations data from your backend services.
     * @param {Object} params params that might refine your results.
     * @param {Function} success a callback function that returns wrapped synchronization objects.
     * @param {Function} error a callback function for an error in the ajax request.
     */
    articles_tags : function(params, success, error){
        $.ajax({
            url: '/sync/articles_tags.json',
            type: 'get',
            dataType: 'json',
            data: params,
            success: this.callback(['wrapMany',success]),
            error: error,
            async: false,
            fixture: false //calculates the fixture path from the url and type.
        })
    },
    /**
     * Creates a synchronization.
     * @param {Object} attrs A synchronization's attributes.
     * @param {Function} success a callback function that indicates a successful create.  The data that comes back must have an ID property.
     * @param {Function} error a callback that should be called with an object of errors.
     */
    update_feedback : function(attrs, success, error){
        $.ajax({
            url: '/sync/feedback',
            type: 'post',
            success: success,
            error: error,
            data: attrs,
            async: false,
            fixture: false
        })
    }
},
/* @Prototype */
{
    sync_remote_feedback_table: function() {
        db.transaction(function(tx) {
            tx.executeSql("SELECT * FROM sync WHERE table_name = ?",['feedback'],function(tx,rs){
                for(var i=0;i<rs.rows.length;i++) {
                    var row = rs.rows.item(i)
                    var id = row.id
                    tx.executeSql("SELECT author,body,email,article_id,url FROM feedback WHERE id = ?",[row.row_id],
                        function(tx,rs){
                            var row = rs.rows.item(0)
                            Synchronization.update_feedback("author="+row.author+"&body="+row.body+"&email="+row.email+"&url="+row.url+"&article_id="+row.article_id+"")
                            tx.executeSql("DELETE FROM sync WHERE id = ?",[id])
                        })
                }
            },function(tx,error){
                Notification.msg(error.message)
            }
            )
        })
    },
    //sync blog table
    sync_blog_table: function(result) {
        if(result.length > 0) {
            var data = result[0]

            //we must parse data.settings from json format into single string
            data.settings = JSON.stringify(data.settings).replace("{","").replace("}", "").replace(/,/g, "\n").replace(/"/g,"")

            db.transaction(function(tx) {
                tx.executeSql("DELETE FROM blogs",[],function(tx,rs){
                    tx.executeSql("INSERT INTO blogs VALUES(?,?,?)",[data.id,data.settings,data.base_url],
                        function(tx, rs) {
                        },function(tx,error){
                            Notification.msg(error.message)
                        })
                },function(tx,error){
                    Notification.msg(error.message)
                }
                )
            })
        }
    },
    //sync articles_tags table
    sync_articles_tags_table: function(result) {
        if(result.length > 0) {
            db.transaction(function(tx) {
                tx.executeSql("DELETE FROM articles_tags")
            })
            jQuery.each(result,function(i,data){
                db.transaction(function(tx) {
                    tx.executeSql("INSERT INTO articles_tags VALUES(?,?)",[data.article_id,data.tag_id],
                        function(tx, rs) {
                        },function(tx,error){
                            Notification.msg(error.message)
                        })
                })
            })
        }
    },
    //sync table categories
    sync_categories_table: function(result) {
        if(result.length > 0) {
            db.transaction(function(tx) {
                tx.executeSql("DELETE FROM categories")
            })
            jQuery.each(result,function(i,data){
                db.transaction(function(tx) {
                    tx.executeSql("INSERT INTO categories VALUES(?,?,?,?,?,?,?)",[data.id,data.name,data.position,data.permalink,data.keywords,data.description,data.parent_id],
                        function(tx, rs) {
                        },function(tx,error){
                            Notification.msg(error.message)
                        })
                })
            })
        }
    },
    //sync table categorizations
    sync_categorizations_table: function(result) {
        if(result.length > 0) {
            db.transaction(function(tx) {
                tx.executeSql("DELETE FROM categorizations")
            })
            jQuery.each(result,function(i,data){
                db.transaction(function(tx) {
                    tx.executeSql("INSERT INTO categorizations VALUES(?,?,?,?)",[data.id,data.article_id,data.category_id,data.is_primary],
                        function(tx, rs) {
                        },function(tx,error){
                            Notification.msg(error.message)
                        })
                })
            })
        }
    },
    //sync table sidebars
    sync_table_sidebars: function(result) {
        if(result.length > 0) {
            db.transaction(function(tx) {
                tx.executeSql("DELETE FROM sidebars")
            })
            jQuery.each(result,function(i,data){
                data.config = JSON.stringify(data.config).replace("{","").replace("}", "").replace(/,/g, "\n").replace(/"/g,"")
                db.transaction(function(tx) {
                    tx.executeSql("INSERT INTO sidebars VALUES(?,?,?,?,?)",[data.id,data.active_position,data.config,data.staged_position,data.type],
                        function(tx, rs) {
                        },function(tx,error){
                            Notification.msg(error.message)
                        })
                })
            })
        }
    },
    //sync table tags
    sync_table_tags: function(result) {
        if(result.length > 0) {
            db.transaction(function(tx) {
                tx.executeSql("DELETE FROM tags")
            })
            jQuery.each(result,function(i,data){
                db.transaction(function(tx) {
                    tx.executeSql("INSERT INTO tags VALUES(?,?,?,?,?)",[data.id,data.name,data.created_at,data.updated_at,data.display_name],
                        function(tx, rs) {
                        },function(tx,error){
                            Notification.msg(error.message)
                        })
                })
            })
        }
    },
    //sync table contents
    sync_table_contents: function(result) {
        if(result.length > 0) {
            db.transaction(function(tx) {
                tx.executeSql("DELETE FROM contents")
            })
            jQuery.each(result,function(i,data){
                db.transaction(function(tx) {
                    data.whiteboard = JSON.stringify(data.whiteboard)
                    data.published = data.published == true ? 1 : 0
                    data.published_at = data.published_at.substr(0,19).replace(new RegExp(/\//g),"-")
                    data.created_at = data.created_at.substr(0,19).replace(new RegExp(/\//g),"-")
                    data.updated_at = data.updated_at.substr(0,19).replace(new RegExp(/\//g),"-")
                    tx.executeSql("INSERT INTO contents VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                        [data.id,data.type,data.title,data.author,data.body,data.extended,data.excerpt,data.keywords,data.created_at,data.updated_at,data.user_id,data.permalink,data.guid,
                        data.text_filter_id,data.whiteboard,data.name,data.published,data.allow_pings,data.allow_comments,data.published_at,'published'],
                        function(tx, rs) {
                        },function(tx,error){
                            Notification.msg(error.message)
                        })
                })
            })
        }
    },
    //sync table feedback
    sync_table_feedback: function(result) {
        if(result.length > 0) {
            db.transaction(function(tx) {
                tx.executeSql("DELETE FROM feedback")
            })
            jQuery.each(result,function(i,data){
                db.transaction(function(tx) {
                    data.whiteboard = JSON.stringify(data.whiteboard)
                    data.published = data.published == true ? 1 : 0
                    data.published_at = data.published_at.substr(0,19).replace(new RegExp(/\//g),"-")
                    data.created_at = data.created_at.substr(0,19).replace(new RegExp(/\//g),"-")
                    data.updated_at = data.updated_at.substr(0,19).replace(new RegExp(/\//g),"-")
                    tx.executeSql("INSERT INTO feedback VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                        [data.id,data.type,data.title,data.author,data.body,data.excerpt,data.created_at,data.updated_at,data.user_id,data.guid,data.text_filter_id,data.whiteboard,data.article_id,data.email,data.url,data.ip,data.blog_name,data.published,data.published_at,data.state,data.status_confirmed],
                        function(tx, rs) {
                        },function(tx,error){
                            Notification.msg(error.message)
                        })
                })
            })
        }
    },
})