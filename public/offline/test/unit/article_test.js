jQuery.Test.Unit.extend("Tests.Unit.Article",{
    init : function(){ //setup code
        
    },
    destroy : function(){ //teardown code
        
    },
    test_findAll: function() {
       Article.findAll({}, this.callback("found"))
    },
    found : function(articles){
        this.assert(articles)
        this.assert(articles.length)
        this.assert(articles[0].name)
        this.assert(articles[0].description)
    },
    test_create : function(){
        new Article({name: "dry cleaning", description: "take to street corner"}).save(this.callback("created"))
    },
    created : function(article){
        this.assert(article);
        this.assert(article.id);
        this.assertEqual("dry cleaning",article.name)
        article.destroy()
    },
    test_update : function(){
        new Article({name: "cook dinner", description: "chicken"}).
            save(this.callback("updateCreated"))
    },
    updateCreated : function(article){
        this.assertEqual("chicken",article.description);
        article.update({description: "steak"},this.callback("updated"))
    },
    updated : function(article){
        this.assertEqual("steak",article.description);
        article.destroy();
    },
    test_destroy : function(){
        new Article({name: "mow grass", description: "use riding mower"}).
            save(this.callback("destroyCreated"))
    },
    destroyCreated : function(article){
        article.destroy(this.callback("destroyed"))
    },
    destroyed : function(article){
        this.assertNull( Article.store.findOne(article.id) )
    }
});