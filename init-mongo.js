db.createUser (
    {
        user : "naennai",
        pwd : "pwd",
        roles : [
            {
                role : "readWrite",
                db : "firstmongodb"
            }
        ]
    }
);

