// Run with: npm run seed
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');

dotenv.config();

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    await User.deleteMany({});
    await Post.deleteMany({});
    await Comment.deleteMany({});
    console.log('Cleared existing data');

    const alice = await User.create({
      name: 'Alice Johnson',
      username: 'alice',
      email: 'alice@example.com',
      password: 'password123',
      bio: 'Coffee lover ☕ | Traveler 🌍',
      profilePicture: 'https://i.pravatar.cc/150?img=1'
    });

    const bob = await User.create({
      name: 'Bob Smith',
      username: 'bob',
      email: 'bob@example.com',
      password: 'password123',
      bio: 'Photographer 📸 | Foodie',
      profilePicture: 'https://i.pravatar.cc/150?img=2'
    });

    // Make alice and bob follow each other
    alice.following.push(bob._id);
    bob.followers.push(alice._id);
    bob.following.push(alice._id);
    alice.followers.push(bob._id);
    await alice.save();
    await bob.save();

    const post1 = await Post.create({
      user: alice._id,
      content: 'Just had the best coffee of my life! ☕✨',
      likes: [bob._id]
    });

    const post2 = await Post.create({
      user: bob._id,
      content: 'Sunset photography session was incredible today 📸🌅',
      likes: [alice._id]
    });

    await Comment.create({
      post: post1._id,
      user: bob._id,
      text: 'Looks amazing! Where was this?'
    });

    console.log('Inserted sample users, posts, and comments');
    console.log('Sample login: alice@example.com / password123');
    console.log('Sample login: bob@example.com / password123');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seed();
