import express from 'express';
import { upload } from '../configs/multer.js';
import { protect } from '../middlewares/auth.js';
import { addPost, getFeedPosts, likePost, deletePost, addComment, getDiscoverPosts } from '../controllers/postController.js';

const postRouter = express.Router()

postRouter.post('/add', upload.array('images', 4), protect, addPost)
postRouter.get('/feed', protect, getFeedPosts)
postRouter.get('/discover', protect, getDiscoverPosts)
postRouter.post('/like', protect, likePost)
postRouter.post('/delete', protect, deletePost)
postRouter.post('/comment', protect, addComment)

export default postRouter