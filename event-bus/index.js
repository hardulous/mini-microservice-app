const axios = require("axios");
const express = require("express");
const app = express();
const cors = require("cors");

app.use([cors(), express.json(), express.urlencoded()]);

// Now whenever event-bus gets an event it will store it inside an array 
const events = [];

// A post handler where request come from microservice to tell event bus about the event
app.post("/events", (req, res) => {
  const event = req.body;

  // Storing the new emitted event inside the array 
  events.push(event)
  console.log(event)
  // Here whatever event is coming pass it down to all microservices
  axios.post("http://posts-clusterip-srv:4000/events", event).catch((err) => {
    console.log(err)
    console.log(err.message);
  });
  axios.post("http://comments-srv:4001/events", event).catch((err) => {
    console.log(err.message);
  });
  axios.post("http://query-srv:4002/events", event).catch((err) => {
    console.log(err.message);
  });
  axios.post("http://moderation-srv:4003/events", event).catch((err) => {
    console.log(err.message);
  });

  res.send({ status: "Ok" });
});

// Endpoint that allow to retrieve all the events stored inside event-bus array above. So whenever /query service started it will reach out this endpoint to get all the events emitted before its inception 
app.get("/events", (req,res)=>{
  res.send(events)
})

app.listen(4005, () => console.log("Listening on 4005 wew", events));
