import mongoose from 'mongoose';

const codeSnippetSchema = new mongoose.Schema({
    user: {type: String, ref: 'User', required: true},
    title: {type: String, required: true},
    code: {type: String, required: true},
    language: {type: String, default: 'javascript'}
}, {timestamps: true, minimize: false});

export default mongoose.model('CodeSnippet', codeSnippetSchema);
