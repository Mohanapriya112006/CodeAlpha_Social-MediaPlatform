import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';

function PostCard({ post }) {
  const { user } = useAuth();
  const [likesCount, setLikesCount] = useState(post.likes.length);
  const [isLiked, setIsLiked] = useState(post.likes.includes(user?.id));
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);

  const handleLikeToggle = async () => {
    try {
      if (isLiked) {
        const res = await api.post(`/posts/${post._id}/unlike`);
        setLikesCount(res.data.likesCount);
        setIsLiked(false);
      } else {
        const res = await api.post(`/posts/${post._id}/like`);
        setLikesCount(res.data.likesCount);
        setIsLiked(true);
      }
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };

  const loadComments = async () => {
    setLoadingComments(true);
    try {
      const res = await api.get(`/comments/post/${post._id}`);
      setComments(res.data);
    } catch (err) {
      console.error('Error loading comments:', err);
    } finally {
      setLoadingComments(false);
    }
  };

  const toggleComments = () => {
    if (!showComments) loadComments();
    setShowComments(!showComments);
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      const res = await api.post(`/comments/post/${post._id}`, { text: commentText });
      setComments([...comments, res.data]);
      setCommentText('');
    } catch (err) {
      console.error('Error adding comment:', err);
    }
  };

  return (
    <div className="post-card">
      <div className="post-header">
        <img src={post.user.profilePicture} alt={post.user.name} className="post-avatar" />
        <div>
          <Link to={`/profile/${post.user.username}`} className="post-author-name">
            {post.user.name}
          </Link>
          <p className="post-username">@{post.user.username}</p>
        </div>
      </div>

      <p className="post-content">{post.content}</p>
      {post.image && <img src={post.image} alt="Post" className="post-image" />}

      <div className="post-actions">
        <button onClick={handleLikeToggle} className={`btn-like ${isLiked ? 'liked' : ''}`}>
          {isLiked ? '❤️' : '🤍'} {likesCount}
        </button>
        <button onClick={toggleComments} className="btn-comment">
          💬 {showComments ? 'Hide' : 'Comments'}
        </button>
      </div>

      {showComments && (
        <div className="comments-section">
          {loadingComments && <p className="loading-text">Loading comments...</p>}

          {comments.map((c) => (
            <div key={c._id} className="comment">
              <img src={c.user.profilePicture} alt={c.user.name} className="comment-avatar" />
              <div>
                <span className="comment-author">{c.user.name}</span>
                <span className="comment-text">{c.text}</span>
              </div>
            </div>
          ))}

          {comments.length === 0 && !loadingComments && (
            <p className="loading-text">No comments yet.</p>
          )}

          <form onSubmit={handleAddComment} className="comment-form">
            <input
              type="text"
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <button type="submit">Post</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default PostCard;
