import express from 'express';
import { protect } from '../middlewares/auth.js';
import { addSnippet, getSnippets } from '../controllers/codeController.js';

const codeRouter = express.Router();

codeRouter.post('/add', protect, addSnippet);
codeRouter.get('/all', protect, getSnippets);

export default codeRouter;
