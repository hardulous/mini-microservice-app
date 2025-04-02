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
    if(content?.status === 'approved') content = comment.content
    if(content?.status === 'pending') content = 'This comment is awaiting moderation'
    if(comment?.status === 'rejected') content = 'This comment has been rejected'
    return <li key={comment.id}>{content}</li>;
  });

  return <ul>{renderedComments}</ul>;
};

export default CommentList;
