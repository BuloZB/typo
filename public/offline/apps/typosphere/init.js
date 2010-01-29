include.plugins('model','view','controller','dom/form_params','model/validation','view/helpers');


include(function(){ //runs after prior includes are loaded
    include.resources('sqlite_driver','notification','strftime','jquery-ui-1-2/jquery-ui-1.7.2.custom.min');
    include.models('article','category','tag','sidebar','comment','blog','synchronization');

    include.controllers('main','article','category','tag','sidebar');
    include.views('views/article/show','views/article/archive','views/article/init','views/article/init_archive','views/article/comment','views/article/comment_form','views/article/list',
        'views/category/show','views/category/init',
        'views/sidebar/archive','views/sidebar/category','views/sidebar/page','views/sidebar/tag','views/sidebar/status',
        'views/tag/init','views/tag/show');
})