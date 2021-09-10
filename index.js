const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient } = require("mongodb");
const ObjectID = require("mongodb").ObjectId;
require("dotenv").config();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ktoki.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const usersCollection = client.db("user").collection("users");

//   add informaation
app.post("/addUser", (req, res) => {
    const newUser = req.body;
    usersCollection.insertOne(newUser).then((result) => {
      res.send(result.insertCount > 0);
    });
  });
  app.get("/users", (req, res) => {
    usersCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });
  app.get("/users/:id", (req, res) => {
    const id = ObjectID(req.params.id);
    usersCollection.find({ _id: id }).toArray((err, result) => {
        res.send(result[0]);
        // console.log(res)
    });
});
  app.delete("/deleteUser/:id", (req, res) => {
    const id = ObjectID(req.params.id);
    usersCollection.deleteOne({ _id: id }).then((result) => {
      res.send(result.deletedCount > 0);
    });
  });
  app.get("/updateUser/:id", (req, res) => {
    const id = ObjectID(req.params.id);
    usersCollection.find({ _id: id }).toArray((err, documents) => {
      res.send(documents[0]);
    });
  });
  app.patch("/updateUserInfo/:id", (req, res) => {
    const id = ObjectID(req.params.id);
    usersCollection
      .updateOne(
        { _id: id },
        {
          $set: {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            userName: req.body.userName,
            email: req.body.email,
            password: req.body.password,
          },
        }
      )
      .then((result) => {
        res.send(result.modifiedCount > 0);
      });
  });
});

app.get("/", (req, res) => {
    res.send("hello from db it's working");
  });
  
  app.listen(PORT);