Creator.extend('DatabaseCreator',{
    create: function(engine) {
        switch (engine) {
            case "sqlite":
                return new SqliteDriver()
                break;
            default:
                throw new Error("There is no db engine called " + engine)
                break;
        }

    }
},
{
    
}
);