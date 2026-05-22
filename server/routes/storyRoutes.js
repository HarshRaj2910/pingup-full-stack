import express from 'express';
import { upload } from '../configs/multer.js';
import { protect } from '../middlewares/auth.js';
import { addUserStory, getStories, deleteStory, viewStory, commentOnStory } from '../controllers/storyController.js';


const storyRouter = express.Router()

storyRouter.post('/create', upload.single('media'), protect, addUserStory)
storyRouter.get('/get', protect, getStories)
storyRouter.post('/delete', protect, deleteStory)
storyRouter.post('/view', protect, viewStory)
storyRouter.post('/comment', protect, commentOnStory)

export default storyRouter