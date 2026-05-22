import express from 'express';
import { protect } from '../middlewares/auth.js';
import { getDailyChallenges, submitChallenge } from '../controllers/challengeController.js';

const challengeRouter = express.Router();

challengeRouter.get('/daily', protect, getDailyChallenges);
challengeRouter.post('/submit', protect, submitChallenge);

export default challengeRouter;
