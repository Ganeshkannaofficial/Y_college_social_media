import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { addComment, getComments, reactToPost } from '../services/api';
import './Feed.css';

const Feed = () => {
  const [userName, setUserName] = useState('');
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [commentInputs, setCommentInputs] = useState({});
  const [commentsMap, setCommentsMap] = useState({});
  const [showComments, setShowComments] = useState({});
  const [newPost, setNewPost] = useState('');
  const [editingPostId, setEditingPostId] = useState(null);
  const [editedPostContent, setEditedPostContent] = useState('');
  const [userReactions, setUserReactions] = useState({});

  const token = sessionStorage.getItem('token');

  // Fetch logged-in user info
  useEffect(() => {
    const fetchUser = async () => {
      if (!token) return;
      try {
        const res = await axios.get('http://localhost:5000/api/user/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserName(res.data.name);
        setUser(res.data);
      } catch (err) {
        console.error('Failed to fetch user info', err);
      }
    };
    fetchUser();
  }, [token]);

  // Fetch all posts
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/posts', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(res.data);

      const reactionMap = {};
      res.data.forEach(post => {
        reactionMap[post.id] = post.user_reaction || null;
      });
      setUserReactions(reactionMap);
    } catch (err) {
      console.error('Failed to fetch posts:', err);
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
      console.error('Failed to post comment:', err);
      alert('Failed to post comment');
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;
    try {
      await axios.post(
        'http://localhost:5000/api/posts',
        { content: newPost },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewPost('');
      fetchPosts();
    } catch (err) {
      alert('Failed to create post');
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await axios.delete(`http://localhost:5000/api/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchPosts();
    } catch (err) {
      console.error('Delete post failed:', err);
    }
  };

  const handleEditPost = (post) => {
    setEditingPostId(post.id);
    setEditedPostContent(post.content);
  };

  const handleSavePostEdit = async (postId) => {
    try {
      await axios.put(
        `http://localhost:5000/api/posts/${postId}`,
        { content: editedPostContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditingPostId(null);
      setEditedPostContent('');
      fetchPosts();
    } catch (err) {
      console.error('Edit post failed:', err);
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    try {
      await axios.delete(`http://localhost:5000/api/posts/${postId}/comment/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchComments(postId);
    } catch (err) {
      console.error('Failed to delete comment:', err);
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

  const canEditOrDeletePost = (postUserId) =>
    user && (user.id === postUserId || user.role === 'faculty' || user.role === 'admin');

  const canEditPost = (postUserId) => user && user.id === postUserId;

  const canDeleteComment = (commentUserId) =>
    user && (user.id === commentUserId || user.role === 'faculty' || user.role === 'admin');

  const handleLogout = () => {
    sessionStorage.clear();
    window.location.href = '/';
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
      // User clicked the same emoji again → unreact
      await reactToPost(postId, null, token); // send null to backend to remove
      setUserReactions((prev) => ({ ...prev, [postId]: null }));
    } else {
      // New or different reaction
      await reactToPost(postId, reactionType, token);
      setUserReactions((prev) => ({ ...prev, [postId]: reactionType }));
    }

    fetchPosts(); // refresh counts
  } catch (err) {
    console.error('Failed to react:', err.response?.data || err.message);
    alert('Failed to register reaction. Please try again.');
  }
};


  return (
    <div className="feed-container">
      <header className="feed-header">
        <div className="feed-header-row">
          <strong>Welcome, {userName || 'User'}!</strong>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      {/* New Post */}
      <form onSubmit={handleCreatePost} className="post-form">
        <textarea
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="What's on your mind?"
          rows={3}
        />
        <button type="submit">Post</button>
      </form>

      <h2 className="feed-title">Feed</h2>

      {posts.length === 0 ? (
        <p>No posts yet.</p>
      ) : (
        posts.map((post) => (
          <div key={post.id} className="post-card">
            <div className="post-header">
              <strong>{post.name}</strong>{' '}
              <em>{new Date(post.created_at).toLocaleString()}</em>
            </div>

            {editingPostId === post.id ? (
              <>
                <textarea
                  value={editedPostContent}
                  onChange={(e) => setEditedPostContent(e.target.value)}
                />
                <div className="post-actions">
                  <button onClick={() => handleSavePostEdit(post.id)}>Save</button>
                  <button onClick={() => setEditingPostId(null)}>Cancel</button>
                </div>
              </>
            ) : (
              <p>{post.content}</p>
            )}

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


            <div className="post-actions">
              {canEditPost(post.user_id) && <button onClick={() => handleEditPost(post)}>Edit</button>}
              {canEditOrDeletePost(post.user_id) && (
                <button className="delete-btn" onClick={() => handleDeletePost(post.id)}>Delete</button>
              )}
              <button onClick={() => toggleComments(post.id)}>
                {showComments[post.id] ? 'Hide Comments' : 'View Comments'}
              </button>
            </div>

            {showComments[post.id] && (
              <>
                <div className="comment-section">
                  {(commentsMap[post.id] || []).map((comment) => (
                    <div key={comment.id} className="comment">
                      <em>{comment.name}</em>: {comment.content}
                      {canDeleteComment(comment.user_id) && (
                        <button
                          className="delete-comment-btn"
                          onClick={() => handleDeleteComment(post.id, comment.id)}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="comment-input">
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

export default Feed;
