/**
 * @tag models, home
 * Wraps backend article services.  Enables 
 * [Article.static.findAll retrieving],
 * [Article.static.update updating],
 * [Article.static.destroy destroying], and
 * [Article.static.create creating] articles.
 */
$.Model.extend('Article',
/* @Static */
{
    /**
     * Retrieves articles
     * @param {Object} params params that might refine your results.
     * @param {Function} success a callback function that returns wrapped article objects.
     * @param {Function} error a callback function for an error in the ajax request.
     * @param {Integer} cat_id id of category articles belong to.
     * @param {Integer} tag_id id of tag articles belong to.
     * @param {Array} data date between articles are published.
     */
    find_all: function(params, success, error, cat_id, tag_id, date){
        var obj = this

        //pagination
        var current_page = parseInt(params[0])
        var limit = parseInt(localStorage['limit_article_display'])
        var offset = parseInt((current_page < 2 ? current_page-1 : ((current_page-1)*limit)))
        
        //only if we need to display articles in certain category, call from find_by_category() method
        var category_join = (typeof cat_id != 'undefined' ? "LEFT JOIN categorizations c2 ON c1.id = c2.article_id LEFT JOIN categories c3 ON c2.category_id = c3.id " : '')
        var category_where = (typeof cat_id != 'undefined' ? "AND (c2.category_id="+cat_id+")" : " AND (c1.id=c1.id)")

        //only if we need to display articles in certain tag, call from find_byt_tag_id() method
        var tag_join = (typeof tag_id != 'undefined' ? 'INNER JOIN articles_tags a1 ON c1.id = a1.article_id ' : '')
        var tag_where = (typeof tag_id != 'undefined' ? ' AND (a1.tag_id ='+tag_id+')' : '')

        //only if we need to display articles published at certain time
        var date_where = (typeof date != 'undefined' ? ' AND (c1.published_at BETWEEN "'+date[0]+'-'+date[1]+'-1'+' 00:00:00" AND "'+date[0]+'-'+date[1]+'-31 23:59:59")' : '')

        db.transaction(function(tx) {
            tx.executeSql("SELECT c1 . * " +
                "FROM contents c1 " +
                category_join +
                tag_join +
                "WHERE (( c1.published =1 ) AND ( c1.type =  'Article' ) "+category_where+" "+tag_where+" "+date_where+" ) ORDER BY c1.published_at DESC LIMIT ? OFFSET ?", [limit,offset],
                function(tx, articles) {
                    tx.executeSql("SELECT count(*) as count " +
                        "FROM contents c1 " +
                        category_join +
                        tag_join +
                        "WHERE (( c1.published =1 ) AND ( c1.type =  'Article' ) "+category_where+" "+tag_where+" "+date_where+" )",[],
                        function(tx,rs) {
                            var row = rs.rows.item(0)
                            return success(obj.parse_result(articles),current_page,row['count'])
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
     * Finds article by id
     * @param {Integer} id unique id representing your content.
     * @param {Function} success a callback function that indicates a successful update.
     * @param {Function} error a callback that should be called with an object of errors.
     */
    find_by_id: function(id, success, error) {
        var article_id = this.get_id(id)
        var obj = this
        db.transaction(function(tx) {
            tx.executeSql('SELECT * FROM contents WHERE id = ?', [article_id],function(tx, article) {
                tx.executeSql('SELECT * FROM feedback WHERE article_id = ? and type = ?',[article_id,'Comment'],function(tx,comments){
                    tx.executeSql('SELECT tags.* FROM tags tags JOIN articles_tags at ON tags.id=at.tag_id JOIN contents contents on contents.id = at.article_id WHERE contents.id=?',[article_id],
                        function(tx,tags){
                            return success(obj.parse_result(article,comments,tags))
                        },
                        function(tx,err){
                            return error(err)
                        })
                },
                function(tx,err){
                    return error(err)
                })
            },
            function(tx,err){
                return error(err)
            })
        })
    },
    /**
     * Finds archive of articles
     * @param {Array} params params that might refine your results.
     * @param {Function} success a callback function that returns wrapped article objects.
     * @param {Function} error a callback that should be called with an object of errors.
     */
    find_archive: function(params, success, error) {
        var obj = this
        db.transaction(function(tx) {
            tx.executeSql("SELECT * FROM contents WHERE ( (contents.published = 1) AND (contents.type = 'Article' ) ) ORDER BY published_at DESC", [],
                function(tx, rs) {
                    return success(obj.parse_result(rs))
                },function(tx,err){
                    return error(err)
                })
        })
    },
    /**
     * Finds page by name
     * @param {String} page name of the page.
     * @param {Function} success a callback function that indicates a successful update.
     * @param {Function} error a callback that should be called with an object of errors.
     */
    find_page: function(page, success, error) {
        var obj = this
        db.transaction(function(tx) {
            tx.executeSql("SELECT * FROM contents WHERE (contents.name = ?) AND ( (contents.type = 'Page' ) ) LIMIT 1", [page],
                function(tx, rs) {
                    return success(obj.parse_result(rs))
                },function(tx,err){
                    return error(err)
                })
        })
    },
    /**
     * Finds articles by catetegory id
     * @param {Integer} params params that might refine your results.
     * @param {Function} success a callback function that returns wrapped article objects.
     * @param {Function} error a callback function for an error in the ajax request.
     */
    find_by_category_id: function(params, success, error ){
        params[1] = this.get_id(params[1])
        this.find_all(params,success,error,params[1])
    },
    /**
     * Finds articles by tag id
     * @param {Integer} params params that might refine your results.
     * @param {Function} success a callback function that returns wrapped article objects.
     * @param {Function} error a callback function for an error in the ajax request.
     */
    find_by_tag_id: function(params, success, error ){
        params[1] = this.get_id(params[1])
        this.find_all(params,success,error,undefined,params[1])
    },
    /**
     * Finds articles by published date
     * @param {Array} params params that might refine your results.
     * @param {Function} success a callback function that returns wrapped article objects.
     * @param {Function} error a callback function for an error in the ajax request.
     */
    find_by_published_at: function(params, success, error) {
        //pagination
        var current_page = parseInt(params[0])
        var limit = parseInt(localStorage['limit_article_display'])
        var offset = parseInt((current_page < 2 ? current_page-1 : ((current_page-1)*limit)))

        //date of articles to be displayed
        var date = params[1].split("_")
        this.find_all(params,success,error,undefined,undefined,date)
    },
    /**
     * Finds articles for article sidebar
     * @param {Array} params that might refine your results.
     * @param {Function} success a callback function that returns wrapped article objects.
     * @param {Function} error a callback function for an error in the ajax request.
     */
    sidebar: function(params, success, error ){
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
     * Finds pages for page sidebar
     * @param {Array} params that might refine your results.
     * @param {Function} success a callback function that returns wrapped article objects.
     * @param {Function} error a callback function for an error in the ajax request.
     */
    sidebar_page: function(params, success, error ){
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
    /**
     * Parses result of sql
     * @param {Object} sql result
     */
    parse_result: function(article_rs,comments_rs,tags_rs) {
        var result = []
        var comments = ''
        var tags = ''
        var row = ''
        var last_saved_id = 0
        var last_index = -1

        if(typeof comments_rs == 'object') {
            comments = []
            for(var i=0; i<comments_rs.rows.length; i++) {
                row = comments_rs.rows.item(i)
                comments[i] = {
                    id: row['id'],
                    title: row['title'],
                    author: row['author'],
                    body: row['body'],
                    created_at: row['created_at'],
                    url: row['url']
                }
            }
        }
        if(typeof tags_rs == 'object') {
            tags = []
            for(var i=0;i<tags_rs.rows.length;i++) {
                row = tags_rs.rows.item(i)
                tags[i] = {
                    id: row['id'],
                    name: row['name'],
                    display_name: row['display_name']
                }
            }
        }
        for(var i=0; i<article_rs.rows.length; i++) {
            row = article_rs.rows.item(i)
            //category must by array, because article has many categories
            if(i>0){
                if(result[last_index].id == row['id']) {
                    result[last_index].category.push({
                        id:row['category_id'],
                        name:row['category_name']
                    })
                }
            }
            if(last_saved_id != row['id']) {
                result[last_index + 1] = {
                    id: row['id'],
                    title: row['title'],
                    name: row['name'],
                    body: row['body'],
                    author: row['author'],
                    published_at: row['published_at'],
                    extended: row['extended'],
                    keywords: row['keywords'],
                    excerpt: row['excerpt'],
                    allow_comments: row['allow_comments'],
                    state: row['state'],
                    category: [{
                        id: row['category_id'],
                        name: row['category_name']
                    }],
                    comments: comments,
                    tags: tags,
                }
                //we saved last index and id because article has many categorie
                last_saved_id = row['id']
                last_index = i
            }
        }
        return this.wrapMany(result)
    },
    /**
     * Returns record id
     * @param {String} id record id in format model_id
     */
    get_id: function(id) {
        var record_id = id.split('_')
        return record_id[1]
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
    }
})