const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bkfjr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


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
        // await client.connect();

        const equipmentCollection = client.db('equipmentDB').collection('equipments');




        app.get('/equipments', async (req, res) => {
            const cursor = equipmentCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        });


        app.get('/fixedEquipments', async (req, res) => {
            const cursor = equipmentCollection.find().limit(6);
            const result = await cursor.toArray();
            res.send(result);
        });


        app.get('/equipments/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await equipmentCollection.findOne(query);
            res.send(result);
        });

        app.get('/equipments/email/:userEmail', async (req, res) => {
            const email = req.params.userEmail;
            const query = { userEmail: email };
            const result = await equipmentCollection.find(query).toArray();
            res.send(result);
        });


        app.get('/equipments/category/:category', async (req, res) => {
            const category = req.params.category;
            const query = { category };
            const result = await equipmentCollection.find(query).toArray();
            res.send(result);
        });



        app.post('/equipments', async (req, res) => {
            const newEquipment = req.body;
            console.log('Adding new equipment', newEquipment);

            const result = await equipmentCollection.insertOne(newEquipment);
            res.send(result);
        });


        app.put('/equipments/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updatedEquipment = {
                $set: req.body
            };

            const result = await equipmentCollection.updateOne(filter, updatedEquipment, options);

            res.send(result);
        });



        app.delete('/equipments/:id', async (req, res) => {
            console.log('going to delete', req.params.id);
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await equipmentCollection.deleteOne(query);
            res.send(result);
        });



        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        // console.log("Pinged your deployment. You successfully connected to MongoDB!!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('b10a10 equiSports project server is running')
});


app.listen(port, () => {
    console.log(`equiSports server is running on PORT: ${port}`)
});