jQuery.Class.extend('Notification',{
    //shows message to user
    msg: function(msg) {
        //set message position
        var el = $('#message')
        el.html(msg)
        el.css('margin-left',-(el.width()/2))
        //set message effect
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