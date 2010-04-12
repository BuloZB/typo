Driver.extend('SqliteDriver',
    {
    },
    {
        init: function(){
            this._super('SqliteTypo','1.0','10485760','Offline database for Typosphere')
        },
        create_tables: function() {
            var queries = [
            //table Contents
            "CREATE TABLE IF NOT EXISTS contents (id INTEGER PRIMARY KEY, type TEXT, title TEXT, author TEXT, body TEXT, extended TEXT, excerpt TEXT, keywords TEXT, created_at TEXT, updated_at TEXT, user_id INTEGER, permalink TEXT, guid TEXT, text_filter_id INTEGER, whiteboard TEXT, name TEXT, published INTEGER, allow_pings INTEGER, allow_comments INTEGER, published_at TEXT, state TEXT)",
            "CREATE INDEX IF NOT EXISTS index_contents_on_published ON contents (published)",
            "CREATE INDEX IF NOT EXISTS index_contents_on_text_filter_id ON contents (text_filter_id)",
            //table categories
            "CREATE TABLE IF NOT EXISTS categories (id INTEGER PRIMARY KEY, name TEXT, position INTEGER, permalink TEXT, keywords TEXT, description TEXT, parent_id INTEGER)",
            "CREATE INDEX IF NOT EXISTS index_categories_on_permalink ON categories (permalink)",
            //table categorizations
            "CREATE TABLE IF NOT EXISTS categorizations (id INTEGER PRIMARY KEY, article_id INTEGER, category_id INTEGER, is_primary INTEGER)",
            //table tags
            "CREATE TABLE IF NOT EXISTS tags (id INTEGER PRIMARY KEY, name TEXT, created_at TEXT, updated_at TEXT, display_name TEXT)",
            //table articles_tags
            "CREATE TABLE IF NOT EXISTS articles_tags (article_id INTEGER, tag_id INTEGER)",
            //table comments
            "CREATE TABLE IF NOT EXISTS feedback (id INTEGER PRIMARY KEY, type TEXT, title TEXT, author TEXT, body TEXT, excerpt TEXT, created_at TEXT DEFAULT CURRENT_TIMESTAMP, updated_at TEXT DEFAULT CURRENT_TIMESTAMP, user_id INTEGER, guid TEXT, text_filter_id INTEGER, whiteboard TEXT, article_id INTEGER, email TEXT, url TEXT, ip TEXT, blog_name TEXT, published INTEGER, published_at TEXT, state TEXT, status_confirmed INTEGER)",
            "CREATE INDEX IF NOT EXISTS index_feedback_on_article_id ON feedback (article_id)",
            "CREATE INDEX IF NOT EXISTS index_feedback_on_text_filter_id ON feedback (text_filter_id)",
            //table sidebars
            "CREATE TABLE IF NOT EXISTS sidebars (id INTEGER PRIMARY KEY, active_position INTEGER, config TEXT, staged_position INTEGER, type TEXT)",
            //table blogs
            "CREATE TABLE IF NOT EXISTS blogs (id INTEGER PRIMARY KEY, settings TEXT, base_url TEXT)",
            //table sync
            "CREATE TABLE IF NOT EXISTS sync (id INTEGER PRIMARY KEY, table_name TEXT, row_id INTEGER, action TEXT)"
            ]
            this._super(queries)
        }
    });