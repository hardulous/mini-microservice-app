const express = require("express");
const cors = require("cors");
const axios = require('axios')
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


// Extract out the logic of handling emited event 
const handleEvent = (type, data)=>{
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
}


// Here listening for event coming from event-bus
app.post("/events", (req, res) => {
  const { type, data } = req.body;

  // To check event based on which we perform operation on database
  // if (type == "PostCreated") {
  //   const { id, title } = data;
  //   posts[id] = { id, title, comments: [] };
  // }

  // // Here when comment is created without moderation we need to show it to the user 
  // if (type == "CommentCreated") {
  //   const { id, content, postId, status } = data;
  //   const post = posts[postId];
  //   post.comments.push({ id, content, status });
  // }

  // // This event is comming from /comment service after all types of moderation that /comment service is doing has done and just update the comment 
  // if(type === "CommentUpdated"){
  //   const {id, content, postId, status} = data
  //   const post = posts[postId]
  //   const comment = post.comments.find((comment)=>{
  //     return comment.id === id
  //   })

  //   // Here this event is every generic rather than service specific so we will just update the whole comment because we don't know what field of comment is actually getting updated
  //   comment.status = status
  //   comment.content= content
  // }

  handleEvent(type,data)

  res.send({});
});

app.listen(4002, async () => {
  console.log("Listening at port 4002")

  // Here below after /query service is launched and re-launced again after error then it will 1st fetch all the events happened before it 
  try {
    const res = await axios.get("http://localhost:4005/events");
 
    for (let event of res.data) {
      console.log("Processing event:", event.type);
 
      handleEvent(event.type, event.data);
    }
  } catch (error) {
    console.log(error.message);
  }

});
