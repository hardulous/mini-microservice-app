const express = require("express");
const { randomBytes } = require("crypto");
const cors = require("cors");
const axios = require("axios");
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

  // Now when comment is created the default status is "pending" 
  comments.push({ id: commentId, content, status: "pending" });

  commentsByPostId[id] = comments;

  // Publishing an event that a comment has been created
  await axios.post("http://event-bus-srv:4005/events", {
    type: "CommentCreated",
    data: {
      id: commentId,
      content,
      postId: id,
      status: "pending",
    },
  });

  res.status(201).send(comments);
});

// handler to get event coming from event-bus, An indirect way of communication between microservices
app.post("/events", async (req, res) => {
  console.log("Received Event", req.body.type);
  const { type, data } = req.body;

  // This event is coming from /moderation service to tell that comment has been moderated 
  if (type === "CommentModerated") {
    const { postId, id, status, content } = data;
    const comments = commentsByPostId[postId];
    const comment = comments.find((comment) => {
      return comment.id === id;
    });
    comment.status = status;

    // After moderation the /comment service will emit an event for /query service to update the comment that is moderated
    await axios.post("http://event-bus-srv:4005/events", {
      type: "CommentUpdated",
      data: {
        id,
        postId,
        status,
        content,
      },
    });
  }
  res.send({});
});

app.listen(4001, () => {
  console.log("Listening on 4001");
});
