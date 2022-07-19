const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.n5uzfgn.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

function verifyJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send({ message: 'Unauthorized access' })
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
        if (err) {
            return res.status(403).send({ message: 'Forbidden access' })
        }
        req.decoded = decoded;
        next();
    });
}

async function run(){
    try{
        await client.connect();
        const addedTaskCollection = client.db('to-do-app').collection('addedTask');

        app.get('/addedTask', async(req, res) =>{
            const allTask = await addedTaskCollection.find().toArray();
            res.send(allTask);
        })

        app.post('/addedTask', async(req, res) =>{
            const task = req.body;
            const result = await addedTaskCollection.insertOne(task);
            res.send(result);
        });
    }
    finally{
}

}

run().catch(console.dir);


app.get('/', (req, res) =>{
    res.send('Hello! I am Rimon a Full Stack Developer and You are in the server site now.')
})

app.listen(port, () =>{
    console.log(`App listening on port ${port}`)
})