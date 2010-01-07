//js apps/typosphere/compress.js

include = {
    done : function(total){
        var compressed = include.collectAndCompress(total);
        new include.File('apps/typosphere/production.js').save(compressed);
        print("Compressed to 'apps/typosphere/production.js'.");
        include.plugins('documentation')
        var app = new include.Doc.Application(total, "typosphere");
        app.generate();
        print("Generated docs.");
        if(!window.MVCDontQuit) quit();
    },
    env: "compress"
}

load('jmvc/rhino/env.js');
Envjs('apps/typosphere/index.html', {scriptTypes : {"text/javascript" : true,"text/envjs" : true}});