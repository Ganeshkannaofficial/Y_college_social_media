import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/posts');
      setPosts(res.data);
    } catch (err) {
      console.error('Failed to fetch posts:', err);
    }
  };

  const handlePost = async () => {
    if (!content.trim()) return;

    try {
      await axios.post(
        'http://localhost:5000/api/posts',
        { content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setContent('');
      fetchPosts(); // refresh posts after new post added
    } catch (err) {
      console.error('Failed to post:', err);
      alert('Failed to post');
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 20 }}>
      <h2>Feed</h2>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your post here..."
        rows={3}
        style={{ width: '100%', padding: 8, resize: 'vertical' }}
      />
      <button onClick={handlePost} style={{ margin: '10px 0' }}>
        Post
      </button>

      <div>
        {posts.length === 0 ? (
          <p>No posts yet.</p>
        ) : (
          posts.map((post) => (
            <div
              key={post.id}
              style={{ borderBottom: '1px solid #ccc', padding: '8px 0' }}
            >
              <strong>{post.name}</strong>{' '}
              <em>{new Date(post.created_at).toLocaleString()}</em>
              <p>{post.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Feed;
