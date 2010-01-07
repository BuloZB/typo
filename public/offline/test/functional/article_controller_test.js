jQuery.Test.Functional.extend('Tests.Functional.ArticleController',{
    test_articlesPresent: function(){
        this.driver.exists('.article', this.timeoutCallback('ready', 5000));
    },
    ready : function(){
        this.assert(true)
    },
    test_create : function(){
        this.driver.type("form input[name=name]","Ice")
        this.driver.type("form input[name=description]","Cold Water")
        this.driver.click("form input[type=submit]")
        this.driver.exists('.article:nth-child(2)', this.timeoutCallback('created', 5000));
    },
    created : function(){
        this.assert(/Ice/.test(  this.driver.text('.article:nth-child(2) td:first') )  )
    },
    test_edit : function(){
        this.driver.click('.article:nth-child(2) a.edit');
        this.driver.type(".article input[name=name]"," Water")
        this.driver.type(".article input[name=description]","\b\b\b\b\bTap Water")
        this.driver.click(".update")
        this.driver.exists('.article:nth-child(2) .edit', this.timeoutCallback('updated', 5000));
    },
    updated : function(){
        this.assert(/Ice Water/.test(  this.driver.text('.article:nth-child(2) td:first') )  )
        this.assert(/Cold Tap Water/.test(  this.driver.text('.article:nth-child(2) td:nth-child(2)') )  )
    },
    test_destroy : function(){
        this.driver.click(".article:nth-child(2) .destroy")
        this.driver.missing('.article:nth-child(2)', this.timeoutCallback('destroyed', 5000))
    },
    destroyed : function(){
        this.assert(true)
    }
    
});