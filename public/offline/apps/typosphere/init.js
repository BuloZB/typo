include.plugins('model','view','controller','dom/fixtures','dom/form_params','model/validation','view/helpers');

include.resources('sqlite_driver','notification');

include(function(){ //runs after prior includes are loaded
    include.models('article','category','tag','sidebar','comment','blog');
    include.controllers('main','article','category','tag','sidebar');
    include.views('views/article/show','views/article/archive','views/article/init','views/article/init_archive','views/article/comment','views/article/comment_form','views/article/list',
                    'views/category/show','views/category/init',
                    'views/sidebar/archive','views/sidebar/category','views/sidebar/page','views/sidebar/tag',
                    'views/tag/init','views/tag/show');
});
