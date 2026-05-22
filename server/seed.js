import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Post from './models/Post.js';

dotenv.config();

const dummyUsers = Array.from({ length: 50 }).map((_, i) => ({
  _id: `seed_user_${i}`,
  full_name: `Developer ${i + 1}`,
  username: `dev_${i + 1}`,
  email: `dev${i + 1}@example.com`,
  profile_picture: `https://i.pravatar.cc/150?img=${(i % 70) + 1}`,
  role: 'User'
}));

const topics = ['Python', 'Java', 'JavaScript', 'Ruby', 'AI', 'ML', 'DevOps', 'React', 'Node.js', 'Docker'];

const dummyPosts = dummyUsers.map((user, i) => {
    const topic = topics[i % topics.length];
    return {
        // user field will be populated after inserting users
        content: `Just exploring some cool new concepts in ${topic}! Does anyone else love working with this technology? #development #${topic.toLowerCase()}`,
        post_type: 'text',
        image_urls: [],
        likes_count: [],
        comments: []
    }
});

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clean existing seed data
    await User.deleteMany({ _id: { $regex: /^seed_user_/ } });
    
    // Insert Users
    const insertedUsers = await User.insertMany(dummyUsers);
    console.log(`Inserted ${insertedUsers.length} dummy users.`);

    // Prepare posts
    const postsToInsert = dummyPosts.map((post, i) => ({
        ...post,
        user: insertedUsers[i]._id
    }));

    // Insert Posts
    await Post.insertMany(postsToInsert);
    console.log(`Inserted ${postsToInsert.length} dummy posts.`);

    console.log('Database seeded successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
