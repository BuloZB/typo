$.Model.extend('Synchronization',
    /* @Static */
    {
        /**
     * Starts sync process.
     * @param {Function} success - a callback function that returns wrapped synchronization objects.
     * @param {Function} error - a callback function for an error.
     */
        start: function(success, error) {
            var worker_input = new Worker("resources/sync.js")
            var worker_output = new Worker("resources/sync.js")
            var request = new Array
            var obj = this
            
            worker_input.onmessage = function(event) {
                if(event.data[0] == 200) {
                    request.push(event.data[1])
                } else {
                    worker_input.terminate()
                    return error()
                }

                //update progress bar
                $("#progressbar-status").width((request.length*13)+"%")
                $("#progressbar-status").html((request.length*13)+"%")

                if(request.length == 8) {
                    //we have all data we can start db transaction
                    db.transaction(function(tx) {

                        //all data are sent we can empty sync table
                        tx.executeSql("DELETE FROM sync")

                        //table blog
                        var blogs = request[0]
                        //we must split data.settings from json format into single string
                        tx.executeSql("DELETE FROM blogs")
                        jQuery.each(blogs,function(i,data){
                            data.settings = JSON.stringify(data.settings).replace("{","").replace("}", "").replace(/,/g, "\n").replace(/"/g,"")
                            tx.executeSql("INSERT INTO blogs VALUES(?,?,?)",[data.id,data.settings,data.base_url])
                        })
                        //table articles_tags
                        var articles_tags = request[1]
                        tx.executeSql("DELETE FROM articles_tags")
                        jQuery.each(articles_tags,function(i,data){
                            tx.executeSql("INSERT INTO articles_tags VALUES(?,?)",[data.article_id,data.tag_id])
                        })
                        
                        //table sidebars
                        var sidebars = request[2]
                        tx.executeSql("DELETE FROM sidebars")
                        jQuery.each(sidebars,function(i,data){
                            //we must split data.settings from json format into single string
                            data.config = JSON.stringify(data.config).replace("{","").replace("}", "").replace(/,/g, "\n").replace(/"/g,"")
                            tx.executeSql("INSERT INTO sidebars VALUES(?,?,?,?,?)",[data.id,data.active_position,data.config,data.staged_position,data.type])
                        })

                        //table categories
                        var categories = request[3]
                        tx.executeSql("DELETE FROM categories")
                        jQuery.each(categories,function(i,data){
                            db.transaction(function(tx) {
                                tx.executeSql("INSERT INTO categories VALUES(?,?,?,?,?,?,?)",[data.id,data.name,data.position,data.permalink,data.keywords,data.description,data.parent_id])
                            })
                        })

                        //table categorizations
                        var categorizations = request[4]
                        tx.executeSql("DELETE FROM categorizations")
                        jQuery.each(categorizations,function(i,data){
                            db.transaction(function(tx) {
                                tx.executeSql("INSERT INTO categorizations VALUES(?,?,?,?)",[data.id,data.article_id,data.category_id,data.is_primary])
                            })
                        })
                        
                        //table contents
                        var contents = request[5]
                        tx.executeSql("DELETE FROM contents")
                        jQuery.each(contents,function(i,data){
                            data.whiteboard = JSON.stringify(data.whiteboard)
                            data.published = data.published == true ? 1 : 0
                            data.published_at = obj.parse_date_string(data.published_at)
                            data.created_at = obj.parse_date_string(data.created_at)
                            data.updated_at = obj.parse_date_string(data.updated_at)
                            tx.executeSql("INSERT INTO contents VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                                [data.id,data.type,data.title,data.author,data.body,data.extended,data.excerpt,data.keywords,data.created_at,data.updated_at,data.user_id,data.permalink,data.guid,
                                data.text_filter_id,data.whiteboard,data.name,data.published,data.allow_pings,data.allow_comments,data.published_at,'published'])
                        })

                        //table feedback
                        var feedback = request[6]
                        tx.executeSql("DELETE FROM feedback")
                        jQuery.each(feedback,function(i,data){
                            data.whiteboard = JSON.stringify(data.whiteboard)
                            data.published = data.published == true ? 1 : 0
                            data.published_at = obj.parse_date_string(data.published_at)
                            data.created_at = obj.parse_date_string(data.created_at)
                            data.updated_at = obj.parse_date_string(data.updated_at)
                            tx.executeSql("INSERT INTO feedback VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                                [data.id,data.type,data.title,data.author,data.body,data.excerpt,data.created_at,data.updated_at,data.user_id,data.guid,data.text_filter_id,data.whiteboard,data.article_id,data.email,data.url,data.ip,data.blog_name,data.published,data.published_at,data.state,data.status_confirmed])
                        })

                        //table tags
                        var tags = request[7]
                        tx.executeSql("DELETE FROM tags")
                        jQuery.each(tags,function(i,data){
                            db.transaction(function(tx) {
                                tx.executeSql("INSERT INTO tags VALUES(?,?,?,?,?)",[data.id,data.name,data.created_at,data.updated_at,data.display_name])
                            })
                        })

                        $("#progressbar-status").width("100")
                        $("#progressbar-status").html("100%")

                    },function(err) {
                        worker_input.terminate()
                        worker_output.terminate()
                        return error()
                    },function() {
                        worker_input.terminate()
                        worker_output.terminate()
                        return success()
                    })
                }
            }

            worker_output.onmessage = function(event) {
                if(event.data != 200) {
                    worker_output.terminate()
                    worker_input.terminate()
                    return error()
                }
            }

            //first we need to send data to server
            db.transaction(function(tx) {
                tx.executeSql("SELECT * FROM sync WHERE table_name = ?",['feedback'],function(tx,rs){
                    for(var i=0;i<rs.rows.length;i++) {
                        var row = rs.rows.item(i)
                        var id = row.row_id
                        var method = row.method
                        tx.executeSql("SELECT author,body,email,article_id,url FROM feedback WHERE id = ?",[id],
                            function(tx,rs){
                                var row = rs.rows.item(0)
                                var params = "author="+row.author+"&body="+row.body+"&email="+row.email+"&url="+row.url+"&article_id="+row.article_id+""
                                worker_output.postMessage({
                                    url:"feedback",
                                    method:method,
                                    params:params
                                })
                            })
                    }
                })
            },function(err) {
                return error()
            },function() {
                //all data are sent, we can retrieve new data
                worker_input.postMessage({
                    url:"blog.json",
                    method:"GET"
                })
                worker_input.postMessage({
                    url:"articles_tags.json",
                    method:"GET"
                })
                worker_input.postMessage({
                    url:"sidebars.json",
                    method:"GET"
                })
                worker_input.postMessage({
                    url:"categories.json",
                    method:"GET"
                })
                worker_input.postMessage({
                    url:"categorizations.json",
                    method:"GET"
                })
                worker_input.postMessage({
                    url:"contents.json",
                    method:"GET"
                })
                worker_input.postMessage({
                    url:"feedback.json",
                    method:"GET"
                })
                worker_input.postMessage({
                    url:"tags.json",
                    method:"GET"
                })
            })
        },

        parse_date_string: function(str) {
            return str.substr(0,19).replace(new RegExp(/\//g),"-")
        }
    },
    /* @Prototype */
    {
    })