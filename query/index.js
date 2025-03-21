const express = require("express");
const cors = require("cors");

const app = express();

app.use([cors(), express.urlencoded(), express.json()]);

// Database
const posts = {};

/*
   Structure ::

{
      "2332":{
        id: "332",
        title: "post title-1",
        comments:[
         {
          id: 1564, content: "comment-1!"
         }
        ]
      },
      "8765":{
        id: "7654",
        title: "post title-2",
        comments:[
         {
          id: 6534, content: "comment-2!"
         }
        ]
      }
}

*/

// Route handler to return post with comment array as well (an optimize data structure that contain combined data of both post and comment microservice)
app.get("/posts", (req, res) => {
  res.send(posts);
});

// Here listening for event coming from event-bus
app.post("/events", (req, res) => {
  const { type, data } = req.body;

  // To check event based on which we perform operation on database
  if (type == "PostCreated") {
    const { id, title } = data;
    posts[id] = { id, title, comments: [] };
  }

  // Here when comment is created without moderation we need to show it to the user 
  if (type == "CommentCreated") {
    const { id, content, postId, status } = data;
    const post = posts[postId];
    post.comments.push({ id, content, status });
  }

  // This event is comming from /comment service after all types of moderation that /comment service is doing has done and just update the comment 
  if(type === "CommentUpdated"){
    const {id, content, postId, status} = data
    const post = posts[postId]
    const comment = post.comments.find((comment)=>{
      return comment.id === id
    })

    // Here this event is every generic rather than service specific so we will just update the whole comment because we don't know what field of comment is actually getting updated
    comment.status = status
    comment.content= content
  }

  res.send({});
});

app.listen(4002, () => console.log("Listening at port 4002"));
