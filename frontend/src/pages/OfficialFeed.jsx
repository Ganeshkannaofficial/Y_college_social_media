import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { addComment, getComments } from '../services/api';
import './OfficialFeed.css';


const OfficialFeed = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [commentInputs, setCommentInputs] = useState({});
  const [commentsMap, setCommentsMap] = useState({});
  const [showComments, setShowComments] = useState({});
  const token = sessionStorage.getItem('token');

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) return;
      try {
        const res = await axios.get('http://localhost:5000/api/user/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        console.error('Failed to fetch user info', err);
      }
    };
    fetchUser();
  }, [token]);

  const fetchPosts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/posts/official', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchPosts();
    }
  }, [token]);

  const fetchComments = async (postId) => {
    try {
      const res = await getComments(postId);
      setCommentsMap((prev) => ({
        ...prev,
        [postId]: res.data,
      }));
    } catch (err) {
      console.error('Error fetching comments:', err);
    }
  };

  const handlePostComment = async (postId) => {
    const content = commentInputs[postId];
    if (!content?.trim()) return;

    try {
      await addComment({ post_id: postId, content }, token);
      setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
      fetchComments(postId);
    } catch (err) {
      console.error(err);
      alert('Failed to post comment');
    }
  };

  const toggleComments = (postId) => {
    const current = showComments[postId] || false;
    setShowComments((prev) => ({
      ...prev,
      [postId]: !current,
    }));

    if (!current) {
      fetchComments(postId);
    }
  };

 return (
  <div className="official-feed-container">
    <h2>Official Feed (Faculty & Clubs)</h2>
    {posts.length === 0 ? (
      <p className="no-posts-message">No official posts yet.</p>
    ) : (
      posts.map((post) => (
        <div key={post.id} className="post">
          <strong>{post.name}</strong>{' '}
          <em>{new Date(post.created_at).toLocaleString()}</em>
          <p>{post.content}</p>

          <button
            className="toggle-comments-btn"
            onClick={() => toggleComments(post.id)}
          >
            {showComments[post.id] ? 'Hide Comments' : 'View Comments'}
          </button>

          {showComments[post.id] && (
            <>
              <div className="comments-section">
                <strong>Comments:</strong>
                {(commentsMap[post.id] || []).map((comment) => (
                  <div key={comment.id} className="comment">
                    <em>{comment.name}</em>: {comment.content}
                  </div>
                ))}
              </div>

              <div className="comment-input-container">
                <input
                  type="text"
                  placeholder="Write a comment..."
                  value={commentInputs[post.id] || ''}
                  onChange={(e) =>
                    setCommentInputs({
                      ...commentInputs,
                      [post.id]: e.target.value,
                    })
                  }
                />
                <button onClick={() => handlePostComment(post.id)}>Comment</button>
              </div>
            </>
          )}
        </div>
      ))
    )}
  </div>
);
};

export default OfficialFeed;
