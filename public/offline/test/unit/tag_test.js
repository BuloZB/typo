jQuery.Test.Unit.extend("Tests.Unit.Tag",{
    init : function(){ //setup code
        
    },
    destroy : function(){ //teardown code
        
    },
    test_findAll: function() {
       Tag.findAll({}, this.callback("found"))
    },
    found : function(tags){
        this.assert(tags)
        this.assert(tags.length)
        this.assert(tags[0].name)
        this.assert(tags[0].description)
    },
    test_create : function(){
        new Tag({name: "dry cleaning", description: "take to street corner"}).save(this.callback("created"))
    },
    created : function(tag){
        this.assert(tag);
        this.assert(tag.id);
        this.assertEqual("dry cleaning",tag.name)
        tag.destroy()
    },
    test_update : function(){
        new Tag({name: "cook dinner", description: "chicken"}).
            save(this.callback("updateCreated"))
    },
    updateCreated : function(tag){
        this.assertEqual("chicken",tag.description);
        tag.update({description: "steak"},this.callback("updated"))
    },
    updated : function(tag){
        this.assertEqual("steak",tag.description);
        tag.destroy();
    },
    test_destroy : function(){
        new Tag({name: "mow grass", description: "use riding mower"}).
            save(this.callback("destroyCreated"))
    },
    destroyCreated : function(tag){
        tag.destroy(this.callback("destroyed"))
    },
    destroyed : function(tag){
        this.assertNull( Tag.store.findOne(tag.id) )
    }
});