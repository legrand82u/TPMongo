# TD2 - MongoDB - LEGRAND Théo - DUROY Maxence

* Lancer le container : `sudo docker-compose up -d`

* Se connecter à Mongo depuis le terminal : `mongo localhost:27017 -u naennai -p`

* Ajouter un objet depuis le terminal : `db.NOMCOLLECTION.insert({"prop1":"value","prop2":"value"})`

* Créer une collection depuis le terminal : `db.createCollection('NOMCOLLECTION')`

* Dans l'API parking, x est la longitude et y la latitude

# Comment démarrer le projet 

* `git pull https://github.com/legrand82u/TPMongo.git`
* `cd TPMongo`
* `npm install --save`
* `docker-compose up -d`
* `node express.js`
* Accèder au site sur localhost:3000