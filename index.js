const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.iua9cew.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

console.log(uri);

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const tourist_spotCollection = client
      .db("tourist_spotDB")
      .collection("tourist_spot");

    // get tourist spot data work
    app.get("/tourist_spot", async (req, res) => {
      const cursor = tourist_spotCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // post tourist spot data work here
    app.post("/tourist_spot", async (req, res) => {
      const newTouristSpot = req.body;
      console.log(newTouristSpot);
      const result = await tourist_spotCollection.insertOne(newTouristSpot);
      res.send(result);
    });

    // my cart data work here
    app.get("/myCart/:email", async (req, res) => {
      console.log(req.params.email);
      const result = await tourist_spotCollection
        .find({ email: req.params.email })
        .toArray();
      res.send(result);
    });

    // delete
    app.delete("/tourist_spot/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await tourist_spotCollection.deleteOne(query);
      res.send(result);
    });

    // single data  work here
    app.get("/singleSpot/:id", async (req, res) => {
      const result = await tourist_spotCollection.findOne({
        _id: new ObjectId(req.params.id),
      });
      res.send(result);
    });

    // update  work here
    app.put("/updateSpot/:id", async (req, res) => {
      console.log(req.params.id);
      const query = { _id: new ObjectId(req.params.id) };
      const data = {
        $set: {
          country_Name: req.body.country_Name,
          tourists_spot_name: req.body.tourists_spot_name,
          spot_Location: req.body.spot_Location,
          short_Description: req.body.short_Description,
          average_cost: req.body.average_cost,
          seasonality: req.body.seasonality,
          travel_time: req.body.travel_time,
          totalVisitorsPerYear: req.body.totalVisitorsPerYear,
          image_Url: req.body.image_Url,
        },
      };
      const result = await tourist_spotCollection.updateOne(query, data);
      console.log(result);
      res.send(result);
    });

    // delete to the data work here
    app.delete("/delete/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await tourist_spotCollection.deleteOne(query);
      console.log(result);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Tourism server is running");
});

app.listen(port, () => {
  console.log(`Tourism server is running on port: ${port}`);
});
