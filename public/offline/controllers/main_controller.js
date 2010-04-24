jQuery.Controller.extend('MainController',
    /* @Static */
    {
        onDocument: true
    },
    /* @Prototype */
    {
        load: function() {
            //set time displayed in homepage
            this.time()

            //set blog settings (name, description, number of index articles etc.)
            Blog.settings([],this.callback('load_settings'),this.callback(Notification.msg))

            //init dialog window
            $("#dialog-message").dialog({
                modal: true,
                autoOpen: false,
                show: 'clip'
            });

            //check server status every 60 seconds
            var self = this
            this.connection_status()
            setInterval(function(){
                self.connection_status()
            },60000)
        },
    
        /**
        * Shows current time in a template.
        */
        time: function() {
            var date = new Date()
            $('#date > span').html(date.toLocaleDateString())
        },

        connection_status: function() {
            var worker = new Worker("resources/connection.js")
            var el = $('#status')
            var status = ''
            
            worker.onmessage = function(event) {
                if(event.data == 200) {
                    status = 'online'
                } else {
                    status = 'offline'
                }
                el.attr("class",status + '-status')

                //status changed
                if(el.html() != status) {
                    Notification.msg("Server status: " + status)
                }
                el.html(status)
                this.terminate()
                return
            }
            //start worker
            worker.postMessage("")
        },

        /**
        * Displays a message in offline mode.
        */
        offline_msg: function() {
            Notification.msg('This function is not available in offline mode')
        },

        /**
        * Sets blog settings.
        * @param {Array} settings - blog settings.
        */
        load_settings: function(settings) {
            //blog header
            $('#logo > hgroup > h1').html(settings['blog_name'])
            $('#logo > hgroup > h2').html(settings['blog_subtitle'])

            //number of articles in index
            if(parseInt(localStorage['limit_article_display']) != parseInt(settings['limit_article_display'])) {
                localStorage['limit_article_display'] = settings['limit_article_display']
            }
            localStorage['limit_article_display'] = 2
        },

        /**
        * Displays user status.
        */
        is_online: function() {
            var status = navigator.onLine ? 'online' : 'offline'
            var el = $('#status')
            el.attr("class",status + '-status')
            el.html(status)
            Notification.msg("You are now " + status)
        },

        //Events handlers
    
        '.offline click': function(el) {
            this.offline_msg()
        },
    });