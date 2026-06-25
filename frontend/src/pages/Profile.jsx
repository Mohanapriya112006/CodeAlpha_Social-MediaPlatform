import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/PostCard';

function Profile() {
  const { username } = useParams();
  const { user: currentUser } = useAuth();

  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [bioEdit, setBioEdit] = useState('');
  const [editingBio, setEditingBio] = useState(false);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/users/${username}`);
      setProfile(res.data.user);
      setPosts(res.data.posts);
      setBioEdit(res.data.user.bio || '');
    } catch (err) {
      console.error('Error loading profile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username]);

  const handleFollowToggle = async () => {
    try {
      if (isFollowing) {
        await api.post(`/users/${profile.id}/unfollow`);
        setIsFollowing(false);
        setProfile({ ...profile, followersCount: profile.followersCount - 1 });
      } else {
        await api.post(`/users/${profile.id}/follow`);
        setIsFollowing(true);
        setProfile({ ...profile, followersCount: profile.followersCount + 1 });
      }
    } catch (err) {
      console.error('Error toggling follow:', err);
    }
  };

  const handleSaveBio = async () => {
    try {
      await api.put('/users/profile', { bio: bioEdit });
      setProfile({ ...profile, bio: bioEdit });
      setEditingBio(false);
    } catch (err) {
      console.error('Error updating bio:', err);
    }
  };

  if (loading) return <p className="container">Loading profile...</p>;
  if (!profile) return <p className="container">User not found.</p>;

  const isOwnProfile = currentUser && currentUser.username === username;

  return (
    <div className="container">
      <div className="profile-header">
        <img src={profile.profilePicture} alt={profile.name} className="profile-avatar" />
        <div className="profile-info">
          <h1>{profile.name}</h1>
          <p className="post-username">@{profile.username}</p>

          {editingBio ? (
            <div className="bio-edit">
              <textarea value={bioEdit} onChange={(e) => setBioEdit(e.target.value)} maxLength={200} />
              <button onClick={handleSaveBio}>Save</button>
            </div>
          ) : (
            <p className="profile-bio">{profile.bio || 'No bio yet.'}</p>
          )}

          <div className="profile-stats">
            <span><strong>{posts.length}</strong> posts</span>
            <span><strong>{profile.followersCount}</strong> followers</span>
            <span><strong>{profile.followingCount}</strong> following</span>
          </div>

          {isOwnProfile ? (
            !editingBio && <button onClick={() => setEditingBio(true)}>Edit Bio</button>
          ) : (
            <button onClick={handleFollowToggle}>
              {isFollowing ? 'Unfollow' : 'Follow'}
            </button>
          )}
        </div>
      </div>

      <h2>Posts</h2>
      <div className="feed-list">
        {posts.map((post) => (
          <PostCard key={post._id} post={{ ...post, user: profile }} />
        ))}
      </div>

      {posts.length === 0 && <p>No posts yet.</p>}
    </div>
  );
}

export default Profile;
