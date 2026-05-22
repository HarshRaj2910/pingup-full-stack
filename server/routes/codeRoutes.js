import express from 'express';
import { protect } from '../middlewares/auth.js';
import { addSnippet, getSnippets, deleteSnippet } from '../controllers/codeController.js';

const codeRouter = express.Router();

codeRouter.post('/add', protect, addSnippet);
codeRouter.get('/all', protect, getSnippets);
codeRouter.delete('/delete/:id', protect, deleteSnippet);

export default codeRouter;
