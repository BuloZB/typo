$.Model.extend('MainModel',
    /* @Static */
    {
        /**
        * Parses result of sql.
        * @param {Object} rs - a sql result.
        */
        parse_result: function(rs) {
            var result = new Array
            var row = new Array
            var line = new Array
            for(var i=0; i<rs.rows.length; i++) {
                row = rs.rows.item(i)

                for(var key in row) {
                    line[key] = row[key]
                }
                result[i] = line
                line = new Array
                row = new Array
            }

            return this.wrapMany(result)
        }
    },
    /* @Prototype */
    {})