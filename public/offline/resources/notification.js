/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
jQuery.Class.extend('Notification',{
    //shows message to user
    msg: function(msg) {
        var el = $('#message')
        el.html(msg)
        el.css('margin-left',-(el.width()/2))
        $('#message').filter(':not(:animated)').fadeIn(2000,function callback(){
            $('#message').fadeOut(4000)
        })
    },
    validation_errors: function(errors) {
        var msg = ''
        jQuery.each(errors,function(i,val){
            msg += i + ' - ' + val + '\n'
        })
        alert(msg)
    }
},
{
}
);