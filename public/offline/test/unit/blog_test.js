jQuery.Test.Unit.extend("Tests.Unit.Blog",{
    init : function(){ //setup code
        
    },
    destroy : function(){ //teardown code
        
    },
    test_findAll: function() {
       Blog.findAll({}, this.callback("found"))
    },
    found : function(blogs){
        this.assert(blogs)
        this.assert(blogs.length)
        this.assert(blogs[0].name)
        this.assert(blogs[0].description)
    },
    test_create : function(){
        new Blog({name: "dry cleaning", description: "take to street corner"}).save(this.callback("created"))
    },
    created : function(blog){
        this.assert(blog);
        this.assert(blog.id);
        this.assertEqual("dry cleaning",blog.name)
        blog.destroy()
    },
    test_update : function(){
        new Blog({name: "cook dinner", description: "chicken"}).
            save(this.callback("updateCreated"))
    },
    updateCreated : function(blog){
        this.assertEqual("chicken",blog.description);
        blog.update({description: "steak"},this.callback("updated"))
    },
    updated : function(blog){
        this.assertEqual("steak",blog.description);
        blog.destroy();
    },
    test_destroy : function(){
        new Blog({name: "mow grass", description: "use riding mower"}).
            save(this.callback("destroyCreated"))
    },
    destroyCreated : function(blog){
        blog.destroy(this.callback("destroyed"))
    },
    destroyed : function(blog){
        this.assertNull( Blog.store.findOne(blog.id) )
    }
});