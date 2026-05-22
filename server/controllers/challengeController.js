import Challenge from '../models/Challenge.js';
import User from '../models/User.js';

export const getDailyChallenges = async (req, res) => {
    try {
        const challenges = await Challenge.find().sort({createdAt: -1}).limit(10);
        res.json({ success: true, challenges });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

export const submitChallenge = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { challengeId, code, language } = req.body;

        const challenge = await Challenge.findById(challengeId);
        if (!challenge) {
            return res.json({ success: false, message: 'Challenge not found' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        if (user.completed_challenges.includes(challengeId)) {
            return res.json({ success: false, message: 'You have already completed this challenge and earned points.' });
        }

        const versions = {
            python: "3.10.0",
            java: "15.0.2",
            cpp: "10.2.0",
            c: "10.2.0"
        };

        // If language not in map, default to '*'
        const runtimeVersion = versions[language] || "*";

        let passed = true;
        let errorMessage = "";

        for (let i = 0; i < challenge.testCases.length; i++) {
            const tc = challenge.testCases[i];
            
            const payload = {
                language: language,
                version: runtimeVersion,
                files: [{ content: code }],
                stdin: tc.input,
                compile_timeout: 10000,
                run_timeout: 3000
            };

            const response = await fetch('https://emkc.org/api/v2/piston/execute', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (data.message) { // Piston API error (e.g. invalid version)
                return res.json({ success: false, message: `Execution Error: ${data.message}` });
            }

            const compileError = data.compile?.stderr;
            if (compileError) {
                return res.json({ success: false, message: `Compilation Error: ${compileError}` });
            }

            const output = data.run?.stdout?.trim() || "";
            const stderr = data.run?.stderr?.trim() || "";

            if (stderr) {
                return res.json({ success: false, message: `Runtime Error: ${stderr}` });
            }

            if (output !== tc.expectedOutput.trim()) {
                passed = false;
                errorMessage = `Testcase ${i + 1} failed.\nInput: ${tc.input}\nExpected: ${tc.expectedOutput}\nGot: ${output}`;
                break;
            }
        }

        if (!passed) {
            return res.json({ success: false, message: errorMessage });
        }

        // Add points and mark as completed
        user.points += challenge.points;
        user.completed_challenges.push(challengeId);
        await user.save();

        res.json({ success: true, message: `Challenge completed! You earned ${challenge.points} points.`, points: user.points });

    } catch (error) {
        console.error('Submit Challenge Error:', error);
        res.json({ success: false, message: error.message });
    }
};
