jQuery.Class.extend("Driver", {

    },
    {
        init: function(name, version, size, description) {

            //objects can only be created from DatabaseFactory
            if(this.Class.caller != DatabaseCreator.create) {
                throw new Error("There is no public constructor for " + this.Class.className)
                return
            }

            this.name = name
            this.version = version
            this.size = size
            this.description = description
            this.connection = openDatabase(this.name, this.version, this.description, this.size)
        },

        create_tables: function(queries) {
            var object = this
            jQuery.each(queries,function(i,val){
                object.connection.transaction(function(tx){
                    tx.executeSql(val)
                    })
            })
        },

        get_connection: function() {
            return this.connection
        },
    })