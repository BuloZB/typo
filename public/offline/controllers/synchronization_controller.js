jQuery.Controller.extend('SynchronizationController',
    /* @Static */
    {
        onDocument: true
    },
    /* @Prototype */
    {
        load: function() {
            //initial syncing, when user comes for the first time
            if(localStorage['last_sync'] == undefined) {
                if(navigator.onLine) {
                    this.sync_process()
                } else {
                    Notification.msg("Sync error: you must be online to sync database.")
                }
            }
        },

        /**
        * Displays a dialog for syncing process.
        */
        sync_process: function() {

            //update view
            $("#sync-link").html("syncing...")
            $("#progressbar").show()

            //prevent window to start sync action by reloading a page
            window.location.hash = ""

            //start syncing
            Synchronization.start(this.callback("success"),this.callback("error"))
        },

        success: function() {
            Notification.msg("Synchronization successfull")

            //update view
            var link = $(document.createElement("a"))
            link.attr("href", "/offline/index.html")
            link.html("reload a page with new data")
            $("#sync-link").html(link)

            //update time of last syncing
            localStorage['last_sync'] = (new Date()).getTime()
        },

        error: function() {
            Notification.msg("Synchronization failed. Please try again!")

            //update view
            var link = $(document.createElement("a"))
            link.attr("href", "#sync")
            link.html("synchronize")
            $("#sync-link").html(link)
            $('#progressbar').hide()
        },

        'history.sync.index subscribe': function(called, data) {
            if(navigator.onLine) {
                this.sync_process()
            } else {
                Notification.msg("Sync error: you must be online to sync database.")
            }
        },
    });