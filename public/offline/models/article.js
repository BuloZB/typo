MainModel.extend('Article',
    /* @Static */
    {
        /**
        * Retrieves articles.
        * @param {Array} params - params that might refine your results.
        * @param {Function} success - a callback function that returns wrapped article objects.
        * @param {Function} error - a callback function for an error.
        */
        find_all: function(params, success, error){
            var obj = this
            var current_page = 0
            var limit = 0
            var offset = 0
            var join = ''
            var where = ''
            var args = new Array
            var limit_offset = ''

            //only if we need to display articles in certain category, called from find_by_category() method
            if(params.category != undefined) {
                join += ' LEFT JOIN categorizations c2 ON c1.id = c2.article_id LEFT JOIN categories c3 ON c2.category_id = c3.id '
                where += ' AND (c2.category_id='+params.category+') '
            }

            //only if we need to display articles in certain tag, called from find_byt_tag_id() method
            if(params.tag != undefined) {
                join += ' INNER JOIN articles_tags a1 ON c1.id = a1.article_id '
                where += ' AND (a1.tag_id ='+params.tag+') '
            }
            
            //only if we need to display articles published at certain time, called from find_by_published_at() method
            if(params.date != undefined) {
                where += ' AND (c1.published_at BETWEEN "'+params.date.year+'-'+params.date.month+'-1'+' 00:00:00" AND "'+params.date.year+'-'+params.date.month+'-31 23:59:59") '
            }

            //pagination
            if(params.current_page) {
                current_page = parseInt(params.current_page)
                limit = parseInt(localStorage['limit_article_display'])
                if(isNaN(limit)) limit = 10
                offset = (current_page < 2 ? current_page-1 : ((current_page-1)*limit))
                args = [limit,offset]
                limit_offset = " LIMIT ? OFFSET ? "
            }

            //perform search
            if(params.search) {
                where += ' AND title like ("%'+params.search+'%")'
                //                args.unshift(params.search)
                console.log(args)
            }

            db.transaction(function(tx) {
                tx.executeSql("SELECT c1 . * " +
                    "FROM contents c1 " +
                    join +
                    "WHERE (( c1.published=1 ) AND ( c1.type =  'Article' ) "+where+" ) " +
                    "ORDER BY c1.published_at DESC " +
                    limit_offset, args,
                    function(tx, rs) {
                        tx.executeSql("SELECT count(*) as count " +
                            "FROM contents c1 " +
                            join +
                            "WHERE (( c1.published =1 ) AND ( c1.type =  'Article' ) "+where+" )",[],
                            function(tx,rs2) {
                                params.count = rs2.rows.item(0).count
                                var articles = obj.parse_result(rs)

                                //we need categories info
                                for(var i=0;i<articles.length;i++) {
                                    Category.find_by_article_id(articles[i].id,i,function(categories,step){
                                        articles[step].categories = categories
                                        //we are at the end must return array
                                        if(step == articles.length-1) {
                                            return success(articles,params)
                                        }
                                    },error)
                                }
                            },
                            function(tx,err) {
                                return error(err)
                            }
                            )
                    },
                    function(tx, err) {
                        return error(err)
                    })
            })
        },

        /**
        * Finds article by id.
        * @param {String} permalink - unique permalink representing your content.
        * @param {Function} success - a callback function that returns wrapped article objects.
        * @param {Function} error - a callback function for an error.
        */
        find_by_permalink: function(permalink, success, error) {
            var obj = this
            db.transaction(function(tx) {
                tx.executeSql('SELECT * FROM contents WHERE permalink = ? AND published=1 AND type="Article"', [permalink],function(tx, rs) {
                    var article = obj.parse_result(rs)[0]
                    //query comments
                    Comment.find_by_article_id(article.id,function(comments){
                        article.comments = comments
                        //query tags
                        Tag.find_by_article_id(article.id, function(tags){
                            article.tags = tags
                            return success(article)
                        },error)
                    },error)
                },
                function(tx,err){
                    return error(err)
                })
            })
        },

        /**
        * Finds a page by name.
        * @param {String} page - the name of a page.
        * @param {Function} success - a callback function that returns wrapped article objects.
        * @param {Function} error - a callback function for an error.
        */
        find_page: function(page, success, error) {
            var obj = this
            db.transaction(function(tx) {
                tx.executeSql("SELECT * FROM contents WHERE (contents.name = ?) AND ( (contents.type = 'Page' ) ) LIMIT 1", [page],
                    function(tx, rs) {
                        return success(obj.parse_result(rs)[0])
                    },function(tx,err){
                        return error(err)
                    })
            })
        },

        /**
        * Finds articles by catetegory id.
        * @param {Array} params - params that might refine your results.
        * @param {Function} success - a callback function that returns wrapped article objects.
        * @param {Function} error - a callback function for an error.
        */
        find_by_category_id: function(params, success, error ){
            this.find_all(params,success,error)
        },

        /**
        * Finds articles by tag id.
        * @param {Array} params - params that might refine your results.
        * @param {Function} success - a callback function that returns wrapped article objects.
        * @param {Function} error - a callback function for an error.
        */
        find_by_tag_id: function(params, success, error ){
            this.find_all(params,success,error)
        },

        /**
        * Finds articles by published date.
        * @param {Array} params params that might refine your results.
        * @param {Function} success a callback function that returns wrapped article objects.
        * @param {Function} error a callback function for an error.
        */
        find_by_published_at: function(params, success, error) {
            this.find_all(params,success,error)
        },

        search: function(params, success, error) {
            this.find_all(params,success,error)
        },

        /**
        * Finds articles for article sidebar.
        * @param {Array} params - params that might refine your results.
        * @param {Function} success - a callback function that returns wrapped article objects.
        * @param {Function} error - a callback function for an error.
        */
        archives_box: function(params, success, error ){
            var obj = this
            db.transaction(function(tx) {
                tx.executeSql("select count(*) as count, strftime('%Y', published_at) as year, strftime('%m', published_at) as month from contents where type='Article' and published = ? and published_at < ? group by year,month order by year desc,month desc", [1,"date('now')"],
                    function(tx, rs) {
                        var result = []
                        for(var i=0;i<rs.rows.length;i++){
                            var row = rs.rows.item(i)
                            result[i] = {
                                year: row['year'],
                                month: row['month'],
                                count: row['count']
                            }
                        }
                        return success(result)
                    },function(tx,err){
                        return error(err)
                    })
            })
        },

        /**
        * Finds pages for page sidebar.
        * @param {Array} params - params that might refine your results.
        * @param {Function} success - a callback function that returns wrapped article objects.
        * @param {Function} error - a callback function for an error.
        */
        page_box: function(params, success, error ){
            var obj = this
            db.transaction(function(tx) {
                tx.executeSql("SELECT * FROM `contents` WHERE ( (`contents`.`type` = 'Page' ) )", [],
                    function(tx, rs) {
                        return success(obj.parse_result(rs))
                    },function(tx,err){
                        return error(err)
                    })
            })
        },
    },
    /* @Prototype */
    {
        published_at_month: function() {
            var date = this.published_at.split(" ")
            var month = date[0].split("-")
            return month[1]
        },
        published_at_year: function() {
            var date = this.published_at.split(" ")
            var year = date[0].split("-")
            return year[0]
        },
        published_at_mday: function() {
            var date = this.published_at.split(" ")
            var mday = date[0].split("-")
            return mday[2]
        },
        mark_search_term: function(term) {
            jQuery.each(this,function(i,value) {
                console.log("value: " + value)
            })
        }
    })