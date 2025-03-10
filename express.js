// Imports nécessaires à l'utilisation de Express
const express = require('./node_modules/express/index.js')
const app = express()

const port = 3000;
//const fetch = require("node-fetch");
const fetch = require('./node_modules/node-fetch/');
// Imports nécessaires à l'utilisation de Mongo
const mongo = require('./node_modules/mongodb/index.js');
const MongoClient = mongo.MongoClient;
const url = 'mongodb://localhost:27017/';
const urlParking = "https://geoservices.grand-nancy.org/arcgis/rest/services/public/VOIRIE_Parking/MapServer/0/query?where=1%3D1&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=nom%2Cadresse%2Cplaces%2Ccapacite&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=4326&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&resultOffset=&resultRecordCount=&queryByDistance=&returnExtentsOnly=false&datumTransformation=&parameterValues=&rangeValues=&f=pjson";

app.use(express.static('.'));
MongoClient.connect(url, {useUnifiedTopology: true}, (error, client) => {
    if (error) {
        console.log(error);
        throw error;
    }
    const db = client.db('firstmongodb');
    if (db.collection("parking") === null) {
        db.createCollection('parking');
        fetch(urlParking).then((result) => {
            if (result.status > 400) {
                throw new Error("Mauvaise réponse du serveur");
            }
            return result.json();
        }).then((result) => {
            for (const item of result.features) {
                db.collection('parking').insertOne(item);

            }
        });
    }
    if (db.collection('cinema') === null) {
        db.createCollection('cinema');
        db.collection('cinema').insertOne({"nom": "UGC Saint-Jean", "x": 6.179, "y": 48.6899});
        db.collection('cinema').insertOne({"nom": "UGC Ludres", "x": 6.1751, "y": 48.6178});
        db.collection('cinema').insertOne({"nom": "Kinépolis", "x": 6.1964, "y": 48.6919});
    }
});


app.get('/', (req, res) => {
    res.sendfile('./index.html');
});

app.get('/parkings', (req, res) => {
    console.log("On entre sur /parkings !")
    getData('parking').then((parkings) => {
        console.log(parkings);
        res.send(parkings);
    })
        .catch(() => {
            console.log("Une erreur a popay");
            res.status(500);
            res.end(JSON.stringify({type: "error", error: 500, message: "Tout a pété !"}));
        });
});

app.get('/cinemas', (req, res) => {
    console.log("On entre sur /cinemas !")
    getData('cinema').then((cinemas) => {
        console.log(cinemas);
        res.send(cinemas);
    }).catch(() => {
        console.log("Une erreur a popay");
        res.status(500);
        res.end(JSON.stringify({type: "error", error: 500, message: "Tout a pété !"}));
    });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

// Récupère les informations depuis la base de données Mongo dans la collection données en paramètre
function getData(collection) {
    return new Promise((resolve, reject) => {
        let parkings = [];
        MongoClient.connect(url, {useUnifiedTopology: true}, (err, client) => {
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