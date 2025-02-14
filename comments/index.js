const express = require("express");
const { randomBytes } = require("crypto");
const cors = require("cors");
const axios = require('axios')
const app = express();

app.use([cors(), express.json(), express.urlencoded()]);

// database
const commentsByPostId = {};

app.get("/posts/:id/comments", (req, res) => {
  res.send(commentsByPostId[req.params.id] || []);
});

app.post("/posts/:id/comments", async (req, res) => {
  const commentId = randomBytes(4).toString("hex");
  const { id } = req.params;
  const { content } = req.body;
  const comments = commentsByPostId[id] || [];
  comments.push({ id: commentId, content });
  commentsByPostId[id] = comments;

  // Publishing an event that a comment has been created
  await axios.post("http://localhost:4005/events", {
    type: "CommentCreated",
    data: {
      id:commentId, content,
      postId: id,
    },
  });

  res.status(201).send(comments);
});

// handler to get event coming from event-bus, An indirect way of communication between microservices
app.post("/events",(req,res)=>{
    console.log('Received Event', req.body.type)
    res.send({})
  })

app.listen(4001, () => {
  console.log("Listening on 4001");
});
