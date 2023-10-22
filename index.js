const express = require('express');
const app = express();
const port = 4000;
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

app.use(cors());
app.use(express.json());
// app.use((req, res, next) => {
// res.header("Access-Control-Allow-Origin", "*");
// next();
// });





const uri = `mongodb+srv://${process.env.USERNAME}:${process.env.USER_PASSWORD}@cluster0.lnoc98n.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true, 
    }
});

async function run() {
    try {

        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const countryDB = client.db('country&city').collection('country');
        const stateDB = client.db('country&city').collection('state');
        const cityDB = client.db('country&city').collection('city');


        // --- getting all the country data 
        app.get('/getCountry', async(req, res)=>{
            const query = {} ;
            const cursor = countryDB.find(query) ; 
            const result = await cursor.toArray() ; 
            res.send(result) ; 
        })

        // --- getting state lists according to the country 
        app.get('/getCountryState/:countryId', async(req, res)=>{
            const {countryId} = req.params ; 
            const query = {country_id : countryId} ;
            const cursor = stateDB.find(query) ; 
            const result = await cursor.toArray();
            res.send(result); 
        })

        // --- getting city lists according to the state
        app.get('/getCityList/:stateId', async(req, res)=>{
            const {stateId} = req.params ; 
            const query = {state_id : stateId} ; 
            const cursor = cityDB.find(query);
            const result = await cursor.toArray();
            res.send(result)
            
            console.log(result);
        }) 
       

    } finally {
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Server Ran Successfully');
})

app.listen(port, () => {
    console.log('Listening to port ', port);
})