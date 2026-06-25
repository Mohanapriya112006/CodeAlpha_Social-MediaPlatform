const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Post = require('../models/Post');
const { protect } = require('../middleware/auth');

// GET /api/users/:username — get a user's public profile
router.get('/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const posts = await Post.find({ user: user._id }).sort({ createdAt: -1 });

    res.json({
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        bio: user.bio,
        profilePicture: user.profilePicture,
        followersCount: user.followers.length,
        followingCount: user.following.length
      },
      posts
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching profile' });
  }
});

// PUT /api/users/profile — update own profile (bio, profile picture)
router.put('/profile', protect, async (req, res) => {
  try {
    const { bio, profilePicture } = req.body;
    const updates = {};
    if (bio !== undefined) updates.bio = bio;
    if (profilePicture !== undefined) updates.profilePicture = profilePicture;

    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile' });
  }
});

// POST /api/users/:id/follow — follow a user
router.post('/:id/follow', protect, async (req, res) => {
  try {
    if (req.params.id === req.user.id) {
      return res.status(400).json({ message: "You can't follow yourself" });
    }

    const targetUser = await User.findById(req.params.id);
    if (!targetUser) return res.status(404).json({ message: 'User not found' });

    const currentUser = await User.findById(req.user.id);

    if (targetUser.followers.includes(req.user.id)) {
      return res.status(400).json({ message: 'Already following this user' });
    }

    targetUser.followers.push(req.user.id);
    currentUser.following.push(req.params.id);

    await targetUser.save();
    await currentUser.save();

    res.json({ message: 'Followed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error following user' });
  }
});

// POST /api/users/:id/unfollow — unfollow a user
router.post('/:id/unfollow', protect, async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.id);
    if (!targetUser) return res.status(404).json({ message: 'User not found' });

    const currentUser = await User.findById(req.user.id);

    targetUser.followers = targetUser.followers.filter(id => id.toString() !== req.user.id);
    currentUser.following = currentUser.following.filter(id => id.toString() !== req.params.id);

    await targetUser.save();
    await currentUser.save();

    res.json({ message: 'Unfollowed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error unfollowing user' });
  }
});

// GET /api/users — search users by name/username (for follow suggestions)
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    let filter = {};
    if (search) {
      filter = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { username: { $regex: search, $options: 'i' } }
        ]
      };
    }
    const users = await User.find(filter).select('-password').limit(20);
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error searching users' });
  }
});

module.exports = router;
