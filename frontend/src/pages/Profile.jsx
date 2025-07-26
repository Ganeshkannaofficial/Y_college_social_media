import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { addComment, getComments, reactToPost } from '../services/api'; // add reactToPost import
import './Profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [commentInputs, setCommentInputs] = useState({});
  const [commentsMap, setCommentsMap] = useState({});
  const [showComments, setShowComments] = useState({});
  const [userReactions, setUserReactions] = useState({});
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

  useEffect(() => {
    if (user) fetchUserPosts();
  }, [user]);

  const fetchUserPosts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/posts/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(res.data);

      // Map user reactions for quick access and styling
      const reactionMap = {};
      res.data.forEach(post => {
        reactionMap[post.id] = post.user_reaction || null;
      });
      setUserReactions(reactionMap);
    } catch (err) {
      console.error(err);
    }
  };

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

  // Reaction handler with toggle support
  const handleReact = async (postId, reactionType) => {
    if (!token) {
      alert('Please login to react.');
      return;
    }

    const currentReaction = userReactions[postId];

    try {
      if (currentReaction === reactionType) {
        // User clicked same reaction again → unreact (send null or special value)
        await reactToPost(postId, null, token);
        setUserReactions((prev) => ({ ...prev, [postId]: null }));
      } else {
        // New or different reaction
        await reactToPost(postId, reactionType, token);
        setUserReactions((prev) => ({ ...prev, [postId]: reactionType }));
      }
      fetchUserPosts(); // Refresh posts to update counts
    } catch (err) {
      console.error('Failed to react:', err.response?.data || err.message);
      alert('Failed to register reaction. Please try again.');
    }
  };

  return (
    <div className="profile-container">
      <h2>Your Posts</h2>
      <div className="profile-stats">Total Posts: {posts.length}</div>

      {posts.length === 0 ? (
        <p className="no-posts-message">You have not posted anything yet.</p>
      ) : (
        posts.map((post) => (
          <div key={post.id} className="post">
            <em>{new Date(post.created_at).toLocaleString()}</em>
            <p>{post.content}</p>

            {/* Reaction Buttons */}
            <div className="reaction-buttons">
              <button
                onClick={() => handleReact(post.id, 'like')}
                className={`reaction-btn ${userReactions[post.id] === 'like' ? 'selected like' : ''}`}
              >
                👍 {post.like_count || 0}
              </button>
              <button
                onClick={() => handleReact(post.id, 'heart')}
                className={`reaction-btn ${userReactions[post.id] === 'heart' ? 'selected heart' : ''}`}
              >
                ❤️ {post.heart_count || 0}
              </button>
              <button
                onClick={() => handleReact(post.id, 'dislike')}
                className={`reaction-btn ${userReactions[post.id] === 'dislike' ? 'selected dislike' : ''}`}
              >
                👎 {post.dislike_count || 0}
              </button>
            </div>

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

export default Profile;
