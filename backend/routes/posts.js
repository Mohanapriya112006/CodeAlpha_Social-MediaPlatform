const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// GET /api/posts/feed — get posts from people the user follows + own posts
router.get('/feed', protect, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    const feedUserIds = [...currentUser.following, currentUser._id];

    const posts = await Post.find({ user: { $in: feedUserIds } })
      .populate('user', 'name username profilePicture')
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching feed' });
  }
});

// GET /api/posts — get all posts (explore/public feed)
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('user', 'name username profilePicture')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts' });
  }
});

// GET /api/posts/:id — single post detail
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('user', 'name username profilePicture');
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (error) {
    res.status(404).json({ message: 'Post not found' });
  }
});

// POST /api/posts — create a new post
router.post('/', protect, async (req, res) => {
  try {
    const { content, image } = req.body;
    if (!content) {
      return res.status(400).json({ message: 'Post content is required' });
    }

    const post = await Post.create({
      user: req.user.id,
      content,
      image: image || null
    });

    const populatedPost = await post.populate('user', 'name username profilePicture');
    res.status(201).json(populatedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating post' });
  }
});

// DELETE /api/posts/:id — delete own post
router.delete('/:id', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (post.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You can only delete your own posts' });
    }

    await post.deleteOne();
    res.json({ message: 'Post deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting post' });
  }
});

// POST /api/posts/:id/like — like a post
router.post('/:id/like', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (post.likes.includes(req.user.id)) {
      return res.status(400).json({ message: 'Already liked' });
    }

    post.likes.push(req.user.id);
    await post.save();

    res.json({ likesCount: post.likes.length, likes: post.likes });
  } catch (error) {
    res.status(500).json({ message: 'Error liking post' });
  }
});

// POST /api/posts/:id/unlike — unlike a post
router.post('/:id/unlike', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    post.likes = post.likes.filter(id => id.toString() !== req.user.id);
    await post.save();

    res.json({ likesCount: post.likes.length, likes: post.likes });
  } catch (error) {
    res.status(500).json({ message: 'Error unliking post' });
  }
});

module.exports = router;
