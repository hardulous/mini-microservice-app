const express = require("express");
const { randomBytes } = require("crypto");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use([cors(), express.json(), express.urlencoded()]);

// database
const posts = {};

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/posts/create", async (req, res) => {
  const id = randomBytes(4).toString("hex");
  const { title } = req.body;

  posts[id] = {
    id,
    title,
  };

  // Publishing an event that a post has been created
  await axios.post("http://event-bus-srv:4005/events", {
    type: "PostCreated",
    data: posts[id],
  });

  res.status(201).send(posts[id]);
});

// handler to get event coming from event-bus, An indirect way of communication between microservices
app.post("/events",(req,res)=>{
  console.log('Received Event', req.body.type)
  res.send({})
})

app.listen(4000, () => {
console.log("v-100")
  console.log("Listening on 4000");
});
