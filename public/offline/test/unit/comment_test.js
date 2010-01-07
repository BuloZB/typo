jQuery.Test.Unit.extend("Tests.Unit.Comment",{
    init : function(){ //setup code
        
    },
    destroy : function(){ //teardown code
        
    },
    test_findAll: function() {
       Comment.findAll({}, this.callback("found"))
    },
    found : function(comments){
        this.assert(comments)
        this.assert(comments.length)
        this.assert(comments[0].name)
        this.assert(comments[0].description)
    },
    test_create : function(){
        new Comment({name: "dry cleaning", description: "take to street corner"}).save(this.callback("created"))
    },
    created : function(comment){
        this.assert(comment);
        this.assert(comment.id);
        this.assertEqual("dry cleaning",comment.name)
        comment.destroy()
    },
    test_update : function(){
        new Comment({name: "cook dinner", description: "chicken"}).
            save(this.callback("updateCreated"))
    },
    updateCreated : function(comment){
        this.assertEqual("chicken",comment.description);
        comment.update({description: "steak"},this.callback("updated"))
    },
    updated : function(comment){
        this.assertEqual("steak",comment.description);
        comment.destroy();
    },
    test_destroy : function(){
        new Comment({name: "mow grass", description: "use riding mower"}).
            save(this.callback("destroyCreated"))
    },
    destroyCreated : function(comment){
        comment.destroy(this.callback("destroyed"))
    },
    destroyed : function(comment){
        this.assertNull( Comment.store.findOne(comment.id) )
    }
});