/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
jQuery.Class.extend('Sqlite',{
    },
    {
        init: function(){
            this.name = 'Typo'
            this.version = '1.0'
            this.size = '10485760' //approximately 10MB
            this.description = 'Offline database for Typosphere'
        },
        open: function() {
            this.con = openDatabase(this.name, this.version, this.description, this.size)
            this.create_db()
        },
        create_db: function() {
            this.con.transaction(function(tx) {
                //table Contents
                tx.executeSql("CREATE TABLE IF NOT EXISTS contents (id INTEGER PRIMARY KEY, type TEXT, title TEXT, author TEXT, body TEXT, extended TEXT, excerpt TEXT, keywords TEXT, created_at TEXT, updated_at TEXT, user_id INTEGER, permalink TEXT, guid TEXT, text_filter_id INTEGER, whiteboard TEXT, name TEXT, published INTEGER, allow_pings INTEGER, allow_comments INTEGER, published_at TEXT, state TEXT)")
                tx.executeSql("CREATE INDEX IF NOT EXISTS index_contents_on_published ON contents (published)")
                tx.executeSql("CREATE INDEX IF NOT EXISTS index_contents_on_text_filter_id ON contents (text_filter_id)")
                //table categories
                tx.executeSql("CREATE TABLE IF NOT EXISTS categories (id INTEGER PRIMARY KEY, name TEXT, position INTEGER, permalink TEXT, keywords TEXT, description TEXT, parent_id)")
                tx.executeSql("CREATE INDEX IF NOT EXISTS index_categories_on_permalink ON categories (permalink)")
                //table categorizations
                tx.executeSql("CREATE TABLE IF NOT EXISTS categorizations (id INTEGER PRIMARY KEY, article_id INTEGER, category_id INTEGER, is_primary INTEGER)")
                //table tags
                tx.executeSql("CREATE TABLE IF NOT EXISTS tags (id INTEGER PRIMARY KEY, name TEXT, created_at  TEXT, updated_at  TEXT, display_name  TEXT)")
                //table articles_tags
                tx.executeSql("CREATE TABLE IF NOT EXISTS articles_tags (article_id INTEGER, tag_id INTEGER)")
                //table comments
                tx.executeSql("CREATE TABLE IF NOT EXISTS feedback (id INTEGER PRIMARY KEY, type TEXT, title TEXT, author TEXT, body TEXT, excerpt TEXT, created_at TEXT DEFAULT CURRENT_TIMESTAMP, updated_at TEXT DEFAULT CURRENT_TIMESTAMP, user_id INTEGER, guid TEXT, text_filter_id INTEGER, whiteboard TEXT, article_id INTEGER, email TEXT, url TEXT, ip TEXT, blog_name TEXT, published INTEGER, published_at TEXT, state TEXT, status_confirmed INTEGER)")
                tx.executeSql("CREATE INDEX IF NOT EXISTS index_feedback_on_article_id ON feedback (article_id)")
                tx.executeSql("CREATE INDEX IF NOT EXISTS index_feedback_on_text_filter_id ON feedback (text_filter_id)")
                //table sidebars
                tx.executeSql("CREATE TABLE IF NOT EXISTS sidebars (id INTEGER PRIMARY KEY, active_position INTEGER, config TEXT, staged_position INTEGER, type TEXT)")
                //table blogs
                tx.executeSql("CREATE TABLE IF NOT EXISTS blogs (id INTEGER PRIMARY KEY, settings TEXT, base_url TEXT)")
                //table sync
                tx.executeSql("CREATE TABLE IF NOT EXISTS sync (id INTEGER PRIMARY KEY, table_name TEXT, row_id INTEGER, action TEXT)")
//                tx.executeSql("CREATE INDEX IF NOT EXISTS index_feedback_on_table ON feedback (table_name)")
            });
        },
        get_instance: function() {
            return this.con
        },
        error: function(error){
            Notification.msg('Database error: ' + error.message)
        }
    }
    );

var db_con = new Sqlite()
db_con.open()
var db = db_con.get_instance()