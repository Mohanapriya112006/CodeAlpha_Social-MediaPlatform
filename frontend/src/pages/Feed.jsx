import { useState, useEffect } from 'react';
import api from '../api';
import PostCard from '../components/PostCard';

function Feed() {
  const [posts, setPosts] = useState([]);
  const [newPostText, setNewPostText] = useState('');
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState('');

  const fetchFeed = async () => {
    try {
      setLoading(true);
      const res = await api.get('/posts/feed');
      setPosts(res.data);
      setError('');
    } catch (err) {
      setError('Could not load feed. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPostText.trim()) return;
    setPosting(true);
    try {
      await api.post('/posts', { content: newPostText });
      setNewPostText('');
      fetchFeed();
    } catch (err) {
      console.error('Error creating post:', err);
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="container">
      <h1>Your Feed</h1>

      <form onSubmit={handleCreatePost} className="create-post-form">
        <textarea
          placeholder="What's on your mind?"
          value={newPostText}
          onChange={(e) => setNewPostText(e.target.value)}
          maxLength={500}
        />
        <button type="submit" disabled={posting || !newPostText.trim()}>
          {posting ? 'Posting...' : 'Post'}
        </button>
      </form>

      {loading && <p>Loading feed...</p>}
      {error && <p className="error">{error}</p>}

      <div className="feed-list">
        {posts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>

      {!loading && posts.length === 0 && !error && (
        <p>No posts yet. Follow people or create your first post!</p>
      )}
    </div>
  );
}

export default Feed;
