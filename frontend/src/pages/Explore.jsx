import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import PostCard from '../components/PostCard';

function Explore() {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/posts').then((res) => setPosts(res.data)).finally(() => setLoading(false));
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search.trim()) {
      setUsers([]);
      return;
    }
    const res = await api.get('/users', { params: { search } });
    setUsers(res.data);
  };

  return (
    <div className="container">
      <h1>Explore</h1>

      <form onSubmit={handleSearch} className="filters">
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {users.length > 0 && (
        <div className="user-search-results">
          {users.map((u) => (
            <Link to={`/profile/${u.username}`} key={u._id} className="user-search-item">
              <img src={u.profilePicture} alt={u.name} />
              <div>
                <p className="post-author-name">{u.name}</p>
                <p className="post-username">@{u.username}</p>
              </div>
            </Link>
          ))}
        </div>
      )}

      <h2>All Posts</h2>
      {loading && <p>Loading posts...</p>}

      <div className="feed-list">
        {posts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>
    </div>
  );
}

export default Explore;
