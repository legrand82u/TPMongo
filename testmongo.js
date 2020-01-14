const mongo = require('./node_modules/mongodb/index.js');
const MongoClient = mongo.MongoClient;
const url = 'mongodb://localhost:27017/';

let parkings = [];
MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
if (err) {
    console.log(err);
    throw err;
}
const db = client.db("firstmongodb");
db.collection('parking').find({}).toArray()
.then((docs) => {
    for (const item of docs) {
        console.log(`Item : ${item.name}`);
        console.log(`Item capacite : ${item.capacite}`);
        parkings.push(item);
    }
})
.catch((err) => {

    console.log(err);
})
client.close();
});
