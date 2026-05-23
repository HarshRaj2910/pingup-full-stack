import fs from 'fs';
import path from 'path';

const filesToUpdate = [
    "controllers/challengeController.js",
    "controllers/codeController.js",
    "controllers/messageController.js",
    "controllers/postController.js",
    "controllers/storyController.js",
    "controllers/userController.js",
    "middlewares/adminAuth.js",
    "middlewares/auth.js"
];

for (const file of filesToUpdate) {
    const fullPath = path.join(process.cwd(), file);
    if (fs.existsSync(fullPath)) {
        let content = fs.readFileSync(fullPath, 'utf-8');
        content = content.replace(/await req\.auth\(\)/g, 'req.auth');
        content = content.replace(/req\.auth\(\)/g, 'req.auth');
        fs.writeFileSync(fullPath, content);
        console.log(`Updated ${file}`);
    } else {
        console.log(`File not found: ${file}`);
    }
}
