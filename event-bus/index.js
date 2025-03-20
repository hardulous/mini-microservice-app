const axios = require("axios");
const express = require("express");
const app = express();
const cors = require("cors");

app.use([cors(), express.json(), express.urlencoded()]);

// A post handler where request come from microservice to tell event bus about the event
app.post("/events", (req, res) => {
  const event = req.body;

  // Here whatever event is coming pass it down to all microservices
  axios.post("http://localhost:4000/events", event).catch((err) => {
    console.log(err.message);
  });
  axios.post("http://localhost:4001/events", event).catch((err) => {
    console.log(err.message);
  });
  axios.post("http://localhost:4002/events", event).catch((err) => {
    console.log(err.message);
  });
  axios.post("http://localhost:4003/events", event).catch((err) => {
    console.log(err.message);
  });

  res.send({ status: "Ok" });
});

app.listen(4005, () => console.log("Listening on 4005"));
