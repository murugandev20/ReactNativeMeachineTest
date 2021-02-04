const {MongoClient} = require('mongodb');
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
const cors = require('cors');
var ObjectId = require('mongodb').ObjectID;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8081;
var router = express.Router();

const uri = "mongodb+srv://cricket_admin:xDru7xNUqekseHJz@cricket-match-scoreboar.oixuu.mongodb.net?useUnifiedTopology=true";

const client = new MongoClient(uri);
client.connect();
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});
app.use('/api', router);

app.get('/match-scores/:id', function (req, res) {
    var listPlayers = {"data":[]};
    client.db("scoreboard")
    .collection("submitScores")
    .find({"_id" : ObjectId(req.params.id)})
    .toArray()
    .then(results => {
        
        listPlayers["data"] = results;
        res.send(listPlayers);
    })
    .catch(error => {
        res.send(error);
    })
});

app.post('/submit-scores', function (req, res, next) {
    client.db("scoreboard")
    .collection("submitScores")
    .insertOne(req.body)
    .then(result => {
        var data = {id: result.insertedId};
        res.json(data);
    })
    .catch(err => {
        res.json(err);
    });
});

app.post('/create-team', function (req, res, next) {
    console.log();
    client.db("scoreboard")
    .collection("teams")
    .insertOne(req.body)
    .then(result => {
        var data = {id: result.insertedId};
        res.json(data);
    })
    .catch(err => {
        res.json(err);
    });
    
});

app.post('/add-players', function (req, res, next) {
    console.log();
    client.db("scoreboard")
    .collection("teamPlayers")
    .insertMany(req.body)
    .then(result => {
        var data = {count: result.insertedCount};
        res.json(data);
    })
    .catch(err => {
        res.json(err);
    });
    
});

app.get('/players', function (req, res) {
    
    var listPlayers = {"data":[]};
    client.db("scoreboard")
    .collection("players")
    .find()
    .toArray()
    .then(results => {
        listPlayers["data"] = results;
        res.send(listPlayers);
    })
    .catch(error => {
        res.send(error);
    })
});

app.get('/teams', function (req, res) {
    
    var listPlayers = {"data":[]};
    client.db("scoreboard")
    .collection("teams")
    .find()
    .toArray()
    .then(results => {
        listPlayers["data"] = results;
        res.send(listPlayers);
    })
    .catch(error => {
        res.send(error);
    })
});

app.get('/team/:id', function (req, res) {
    
    var listPlayers = {"data":[]};
    client.db("scoreboard")
    .collection("teamPlayers")
    .find({"teamId" : req.params.id})
    .toArray()
    .then(results => {
        
        listPlayers["data"] = results;
        res.send(listPlayers);
    })
    .catch(error => {
        res.send(error);
    })
});

app.listen(port);
async function main(){
    
    try {
        // Connect to the MongoDB cluster
        await client.connect();

    } catch (e) {
        console.error(e);
    } finally {
        // await client.close();
    }
}

main().catch(console.error);
