jQuery.Test.Unit.extend("Tests.Unit.Category",{
    init : function(){ //setup code
        
    },
    destroy : function(){ //teardown code
        
    },
    test_findAll: function() {
       Category.findAll({}, this.callback("found"))
    },
    found : function(categories){
        this.assert(categories)
        this.assert(categories.length)
        this.assert(categories[0].name)
        this.assert(categories[0].description)
    },
    test_create : function(){
        new Category({name: "dry cleaning", description: "take to street corner"}).save(this.callback("created"))
    },
    created : function(category){
        this.assert(category);
        this.assert(category.id);
        this.assertEqual("dry cleaning",category.name)
        category.destroy()
    },
    test_update : function(){
        new Category({name: "cook dinner", description: "chicken"}).
            save(this.callback("updateCreated"))
    },
    updateCreated : function(category){
        this.assertEqual("chicken",category.description);
        category.update({description: "steak"},this.callback("updated"))
    },
    updated : function(category){
        this.assertEqual("steak",category.description);
        category.destroy();
    },
    test_destroy : function(){
        new Category({name: "mow grass", description: "use riding mower"}).
            save(this.callback("destroyCreated"))
    },
    destroyCreated : function(category){
        category.destroy(this.callback("destroyed"))
    },
    destroyed : function(category){
        this.assertNull( Category.store.findOne(category.id) )
    }
});