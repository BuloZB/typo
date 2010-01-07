jQuery.Test.Unit.extend("Tests.Unit.Sidebar",{
    init : function(){ //setup code
        
    },
    destroy : function(){ //teardown code
        
    },
    test_findAll: function() {
       Sidebar.findAll({}, this.callback("found"))
    },
    found : function(sidebars){
        this.assert(sidebars)
        this.assert(sidebars.length)
        this.assert(sidebars[0].name)
        this.assert(sidebars[0].description)
    },
    test_create : function(){
        new Sidebar({name: "dry cleaning", description: "take to street corner"}).save(this.callback("created"))
    },
    created : function(sidebar){
        this.assert(sidebar);
        this.assert(sidebar.id);
        this.assertEqual("dry cleaning",sidebar.name)
        sidebar.destroy()
    },
    test_update : function(){
        new Sidebar({name: "cook dinner", description: "chicken"}).
            save(this.callback("updateCreated"))
    },
    updateCreated : function(sidebar){
        this.assertEqual("chicken",sidebar.description);
        sidebar.update({description: "steak"},this.callback("updated"))
    },
    updated : function(sidebar){
        this.assertEqual("steak",sidebar.description);
        sidebar.destroy();
    },
    test_destroy : function(){
        new Sidebar({name: "mow grass", description: "use riding mower"}).
            save(this.callback("destroyCreated"))
    },
    destroyCreated : function(sidebar){
        sidebar.destroy(this.callback("destroyed"))
    },
    destroyed : function(sidebar){
        this.assertNull( Sidebar.store.findOne(sidebar.id) )
    }
});