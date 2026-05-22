import CodeSnippet from "../models/CodeSnippet.js";

export const addSnippet = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { title, code, language } = req.body;
        
        const snippet = await CodeSnippet.create({ user: userId, title, code, language });
        const populatedSnippet = await CodeSnippet.findById(snippet._id).populate('user');
        
        res.json({ success: true, snippet: populatedSnippet });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export const getSnippets = async (req, res) => {
    try {
        const snippets = await CodeSnippet.find({}).populate('user').sort({createdAt: -1});
        res.json({ success: true, snippets });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export const deleteSnippet = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { id } = req.params;
        const snippet = await CodeSnippet.findById(id);
        
        if (!snippet) {
            return res.json({ success: false, message: 'Snippet not found' });
        }
        
        await CodeSnippet.findByIdAndDelete(id);
        res.json({ success: true, message: 'Snippet deleted' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}
