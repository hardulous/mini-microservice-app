import React, { useState, useEffect } from "react";
import axios from "axios";

const CommentList = ({ postId, comments }) => {
  // const [comments, setComments] = useState([]);

  const fetchData = async () => {
    const res = await axios.get(
      `http://localhost:4001/posts/${postId}/comments`
    );

    // setComments(res.data);
  };

  useEffect(() => {
    // fetchData();   // Now from /query services we are getting comments list of a post so no need to make api call fetch comments seprately
  }, []);

  const renderedComments = comments.map((comment) => {
    let content;
    if(comment.status === "approved") content = comment.content
    if(comment.status === "approved") content = comment.content
    return <li key={comment.id}>{comment.content}</li>;
  });

  return <ul>{renderedComments}</ul>;
};

export default CommentList;
