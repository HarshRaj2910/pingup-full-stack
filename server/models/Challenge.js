import mongoose from 'mongoose';

const challengeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    language: { type: String, required: true }, // e.g., 'python', 'java', 'cpp', 'c'
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Easy' },
    functionSignature: { type: String, required: true }, // The initial code template shown to the user
    testCases: [{
        input: { type: String, required: true }, // STDIN
        expectedOutput: { type: String, required: true } // Expected STDOUT
    }],
    points: { type: Number, required: true, default: 10 }
},{timestamps: true});

const Challenge = mongoose.model('Challenge', challengeSchema);

export default Challenge;
