include.plugins('model','view','controller','dom/form_params','model/validation','view/helpers');
include.resources('jquery-ui-1-2/jquery-ui-1.7.2.custom.min','modernizr-1.1.min');


include(function(){ //runs after prior includes are loaded

    //Modernizr does not support sqlstorage test
    Modernizr.addTest('sqlstorage',function(){
        return typeof window.openDatabase == "function" ? true : false;
    })
    if(!(Modernizr.applicationcache && Modernizr.sqlstorage && Modernizr.localstorage)) {
        //show dialog
        $("#dialog-message").dialog({
            modal: true,
            autoOpen: false,
            show: 'clip'
        });
        $('#dialog-message').dialog('option','buttons',{
            close: function() {
                $(this).dialog('close')
            }
        })

        var msg = '<div id="html5-detection"><h1>Your browser doesn\'t support some of these HTML5 features:</h1>'
        msg += '<dl>'
        msg += '<dt>Application cache:</dt>' + '<dd> ' + Modernizr.applicationcache + '</dd>'
        msg += '<dt>SQL storage:</dt>' + '<dd> ' + Modernizr.sqlstorage + '</dd>'
        msg += '<dt>Local storage:</dt>' + '<dd> ' + Modernizr.localstorage + '</dd>'
        msg += '</dl>'
        msg += '<p><strong>Only Safari and Chrome are supported.</strong></p>'
        msg += '</div>'

        $('#dialog-message').html(msg)
        $('#dialog-message').dialog('open')
    }

    include.resources('sqlite_driver','strftime','notification','jquery-ui-1-2/jquery-ui-1.7.2.custom.min','modernizr-1.1.min')
    include.models('article','category','tag','sidebar','comment','blog','synchronization');

    include.controllers('main','article','category','tag','sidebar');
    include.views('views/article/show','views/article/archive','views/article/init','views/article/init_archive','views/article/comment','views/article/comment_form','views/article/list',
        'views/category/show','views/category/init',
        'views/sidebar/archive','views/sidebar/category','views/sidebar/page','views/sidebar/tag','views/sidebar/status','views/sidebar/search',
        'views/tag/init','views/tag/show');
})