// Imports nécessaires à l'utilisation de Express
const express = require('./node_modules/express/index.js')
const app = express()
// Permet d'effectuer les requêtes CORS
var cors = require('cors')
const port = 3000
// Imports nécessaires à l'utilisation de Mongo
const mongo = require('./node_modules/mongodb/index.js');
const MongoClient = mongo.MongoClient;
const url = 'mongodb://localhost:27017/';

app.use(cors())

app.get('/parkings', (req, res) => {
    console.log("On entre sur /parkings !")
    getData('parking').then((parkings) => {
        console.log(parkings);
        res.send(parkings);
    })
    .catch(()=> {
        console.log("Une erreur a popay")
        res.status(500);
        res.end(JSON.stringify({type: "error", error: 500, message: "Tout a pété !"}));
    });  
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

// Récupère les informations depuis la base de données Mongo dans la collection données en paramètre
function getData(collection){
    return new Promise((resolve, reject) => {
        let parkings = [];
        MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
            if (err) {
                console.log(err);
                throw err;
            }
            const db = client.db("firstmongodb");
            db.collection(collection).find({}).toArray()
            .then((docs) => {
                for (const item of docs) {
                    console.log(`Item : ${item.name}`);
                    console.log(`Item capacite : ${item.capacite}`);
                    parkings.push(item);
                }
                client.close();
                resolve(parkings);
            })
            .catch((err) => {
                console.log(err);
                client.close();
                reject(err);
            })
            
        });
    })
}