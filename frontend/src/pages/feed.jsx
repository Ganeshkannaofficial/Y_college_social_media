import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { addComment, getComments } from '../services/api';

const Feed = () => {
  const [userName, setUserName] = useState('');
  const [user, setUser] = useState(null); // Store full user info
  const [posts, setPosts] = useState([]);
  const [commentInputs, setCommentInputs] = useState({});
  const [commentsMap, setCommentsMap] = useState({});
  const [showComments, setShowComments] = useState({});
  const [newPost, setNewPost] = useState(''); // New post content

  const token = sessionStorage.getItem('token');

  // Fetch logged-in user info (name, id, role)
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

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/posts');
      setPosts(res.data);
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
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '20px' }}>
      <header style={{ padding: '10px', borderBottom: '1px solid #ccc', marginBottom: '20px' }}>
        <strong>Welcome, {userName || 'User'}!</strong>
      </header>

      {/* New Post Form */}
      <form onSubmit={handleCreatePost} style={{ marginBottom: '30px' }}>
        <textarea
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="What's on your mind?"
          rows={3}
          style={{ width: '100%', padding: '8px', resize: 'vertical' }}
        />
        <button type="submit" style={{ marginTop: '8px', padding: '8px 16px' }}>
          Post
        </button>
      </form>

      <h2>Feed</h2>

      {posts.length === 0 ? (
        <p>No posts yet.</p>
      ) : (
        posts.map((post) => (
          <div
            key={post.id}
            style={{ borderBottom: '1px solid #ccc', padding: '15px 0' }}
          >
            <strong>{post.name}</strong>{' '}
            <em>{new Date(post.created_at).toLocaleString()}</em>
            <p>{post.content}</p>

            <button onClick={() => toggleComments(post.id)}>
              {showComments[post.id] ? 'Hide Comments' : 'View Comments'}
            </button>

            {showComments[post.id] && (
              <>
                <div style={{ marginTop: '10px', marginLeft: '10px' }}>
                  <strong>Comments:</strong>
                  {(commentsMap[post.id] || []).map((comment) => (
                    <div key={comment.id} style={{ fontSize: '0.9em' }}>
                      <em>{comment.name}</em>: {comment.content}
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', marginTop: '10px' }}>
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
                    style={{ flex: 1, padding: '6px' }}
                  />
                  <button
                    onClick={() => handlePostComment(post.id)}
                    style={{ marginLeft: '5px' }}
                  >
                    Comment
                  </button>
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