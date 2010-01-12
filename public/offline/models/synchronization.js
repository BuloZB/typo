/**
 * @tag models, home
 * Wraps backend synchronization services.
 */
$.Model.extend('Synchronization',
/* @Static */
{
    /**
     * Retrieves synchronizations data from your backend services.
     * @param {Object} params params that might refine your results.
     * @param {Function} success a callback function that returns wrapped synchronization objects.
     * @param {Function} error a callback function for an error in the ajax request.
     */
    blog : function(params, success, error){
        $.ajax({
            url: '/sync/blog.json',
            type: 'get',
            dataType: 'json',
            data: params,
            success: this.callback(['wrapMany',success]),
            error: error,
            async: false,
            fixture: false //calculates the fixture path from the url and type.
        })
    },
    /**
     * Retrieves synchronizations data from your backend services.
     * @param {Object} params params that might refine your results.
     * @param {Function} success a callback function that returns wrapped synchronization objects.
     * @param {Function} error a callback function for an error in the ajax request.
     */
    categories : function(params, success, error){
        $.ajax({
            url: '/sync/categories.json',
            type: 'get',
            dataType: 'json',
            data: params,
            success: this.callback(['wrapMany',success]),
            error: error,
            async: false,
            fixture: false //calculates the fixture path from the url and type.
        })
    },
    /**
     * Retrieves synchronizations data from your backend services.
     * @param {Object} params params that might refine your results.
     * @param {Function} success a callback function that returns wrapped synchronization objects.
     * @param {Function} error a callback function for an error in the ajax request.
     */
    categorizations : function(params, success, error){
        $.ajax({
            url: '/sync/categorizations.json',
            type: 'get',
            dataType: 'json',
            data: params,
            success: this.callback(['wrapMany',success]),
            error: error,
            async: false,
            fixture: false //calculates the fixture path from the url and type.
        })
    },
    /**
     * Retrieves synchronizations data from your backend services.
     * @param {Object} params params that might refine your results.
     * @param {Function} success a callback function that returns wrapped synchronization objects.
     * @param {Function} error a callback function for an error in the ajax request.
     */
    contents : function(params, success, error){
        $.ajax({
            url: '/sync/contents.json',
            type: 'get',
            dataType: 'json',
            data: params,
            success: this.callback(['wrapMany',success]),
            error: error,
            async: false,
            fixture: false //calculates the fixture path from the url and type.
        })
    },
    /**
     * Retrieves synchronizations data from your backend services.
     * @param {Object} params params that might refine your results.
     * @param {Function} success a callback function that returns wrapped synchronization objects.
     * @param {Function} error a callback function for an error in the ajax request.
     */
    feedback : function(params, success, error){
        $.ajax({
            url: '/sync/feedback.json',
            type: 'get',
            dataType: 'json',
            data: params,
            success: this.callback(['wrapMany',success]),
            error: error,
            async: false,
            fixture: false //calculates the fixture path from the url and type.
        })
    },
    /**
     * Retrieves synchronizations data from your backend services.
     * @param {Object} params params that might refine your results.
     * @param {Function} success a callback function that returns wrapped synchronization objects.
     * @param {Function} error a callback function for an error in the ajax request.
     */
    sidebars : function(params, success, error){
        $.ajax({
            url: '/sync/sidebars.json',
            type: 'get',
            dataType: 'json',
            data: params,
            success: this.callback(['wrapMany',success]),
            error: error,
            async: false,
            fixture: false //calculates the fixture path from the url and type.
        })
    },
    /**
     * Retrieves synchronizations data from your backend services.
     * @param {Object} params params that might refine your results.
     * @param {Function} success a callback function that returns wrapped synchronization objects.
     * @param {Function} error a callback function for an error in the ajax request.
     */
    tags : function(params, success, error){
        $.ajax({
            url: '/sync/tags.json',
            type: 'get',
            dataType: 'json',
            data: params,
            success: this.callback(['wrapMany',success]),
            error: error,
            async: false,
            fixture: false //calculates the fixture path from the url and type.
        })
    },
    /**
     * Retrieves synchronizations data from your backend services.
     * @param {Object} params params that might refine your results.
     * @param {Function} success a callback function that returns wrapped synchronization objects.
     * @param {Function} error a callback function for an error in the ajax request.
     */
    articles_tags : function(params, success, error){
        $.ajax({
            url: '/sync/articles_tags.json',
            type: 'get',
            dataType: 'json',
            data: params,
            success: this.callback(['wrapMany',success]),
            error: error,
            async: false,
            fixture: false //calculates the fixture path from the url and type.
        })
    },
    /**
     * Creates a synchronization.
     * @param {Object} attrs A synchronization's attributes.
     * @param {Function} success a callback function that indicates a successful create.  The data that comes back must have an ID property.
     * @param {Function} error a callback that should be called with an object of errors.
     */
    update_feedback : function(attrs, success, error){
        $.ajax({
            url: '/sync/feedback',
            type: 'post',
            success: success,
            error: error,
            data: attrs,
            async: false,
            fixture: false
        })
    }
},
/* @Prototype */
{})