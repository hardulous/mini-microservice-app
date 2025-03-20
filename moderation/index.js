const express = require("express");
const { randomBytes } = require("crypto");
const axios = require("axios");
const app = express();

app.use([express.json(), express.urlencoded()]);

app.post("/events", async (req, res) => {
  const { type, data } = req.body;

  if (type === "CommentCreated") {
    const status = data.content.includes("orange") ? "rejected" : "approved";
    // Publishing an event that a comment has been moderated
    await axios.post("http://localhost:4005/events", {
      type: "CommentModerated",
      data: {
        id: data.id,
        postId: data.postId,
        status,
        content: data.content
      },
    });
  }
  res.send({})
});

app.listen(4003, () => {
  console.log("Listening on 4003");
});
