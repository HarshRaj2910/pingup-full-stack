import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Challenge from './models/Challenge.js';

dotenv.config();

const challenges = [
    {
        title: "Two Sum (Basic)",
        description: "Given two numbers separated by a space on STDIN, print their sum to STDOUT.\n\nExample Input:\n5 3\n\nExample Output:\n8",
        language: "python", // Default language to show in UI
        difficulty: "Easy",
        functionSignature: "# Read from STDIN and print to STDOUT\nimport sys\n\ndef solve():\n    # Your code here\n    pass\n\nif __name__ == '__main__':\n    solve()",
        testCases: [
            { input: "5 3\n", expectedOutput: "8" },
            { input: "-1 1\n", expectedOutput: "0" },
            { input: "100 200\n", expectedOutput: "300" }
        ],
        points: 10
    },
    {
        title: "Reverse String",
        description: "Read a string from STDIN and print the reversed string to STDOUT.\n\nExample Input:\nhello\n\nExample Output:\nolleh",
        language: "python",
        difficulty: "Easy",
        functionSignature: "# Read from STDIN and print to STDOUT\nimport sys\n\ndef solve():\n    s = sys.stdin.read().strip()\n    # Your code here\n\nif __name__ == '__main__':\n    solve()",
        testCases: [
            { input: "hello\n", expectedOutput: "olleh" },
            { input: "pingup\n", expectedOutput: "pugnip" },
            { input: "racecar\n", expectedOutput: "racecar" }
        ],
        points: 15
    },
    {
        title: "Palindrome Check",
        description: "Read a string from STDIN. If it's a palindrome, print 'true', otherwise print 'false'.\n\nExample Input:\nracecar\n\nExample Output:\ntrue",
        language: "java",
        difficulty: "Easy",
        functionSignature: "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        if(scanner.hasNext()) {\n            String s = scanner.next();\n            // Your code here\n        }\n    }\n}",
        testCases: [
            { input: "racecar\n", expectedOutput: "true" },
            { input: "hello\n", expectedOutput: "false" },
            { input: "madam\n", expectedOutput: "true" }
        ],
        points: 20
    },
    {
        title: "Fibonacci Sequence",
        description: "Read an integer N from STDIN. Print the Nth Fibonacci number. (N >= 0, F(0)=0, F(1)=1).\n\nExample Input:\n5\n\nExample Output:\n5",
        language: "cpp",
        difficulty: "Medium",
        functionSignature: "#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    if(cin >> n) {\n        // Your code here\n    }\n    return 0;\n}",
        testCases: [
            { input: "5\n", expectedOutput: "5" },
            { input: "0\n", expectedOutput: "0" },
            { input: "10\n", expectedOutput: "55" }
        ],
        points: 30
    },
    {
        title: "Factorial",
        description: "Read an integer N. Print N! (Factorial of N).\n\nExample Input:\n5\n\nExample Output:\n120",
        language: "c",
        difficulty: "Easy",
        functionSignature: "#include <stdio.h>\n\nint main() {\n    int n;\n    if(scanf(\"%d\", &n) == 1) {\n        // Your code here\n    }\n    return 0;\n}",
        testCases: [
            { input: "5\n", expectedOutput: "120" },
            { input: "0\n", expectedOutput: "1" },
            { input: "6\n", expectedOutput: "720" }
        ],
        points: 15
    },
    {
        title: "Find Maximum Element",
        description: "Read an integer N, followed by N integers. Print the maximum integer among them.\n\nExample Input:\n5\n1 4 2 8 5\n\nExample Output:\n8",
        language: "python",
        difficulty: "Medium",
        functionSignature: "import sys\n\ndef solve():\n    data = sys.stdin.read().split()\n    if not data: return\n    n = int(data[0])\n    nums = list(map(int, data[1:]))\n    # Your code here\n\nif __name__ == '__main__':\n    solve()",
        testCases: [
            { input: "5\n1 4 2 8 5\n", expectedOutput: "8" },
            { input: "3\n-1 -5 -2\n", expectedOutput: "-1" },
            { input: "1\n42\n", expectedOutput: "42" }
        ],
        points: 25
    },
    {
        title: "Count Vowels",
        description: "Read a string from STDIN and print the number of vowels (a, e, i, o, u) in it (case-insensitive).\n\nExample Input:\nhello world\n\nExample Output:\n3",
        language: "python",
        difficulty: "Easy",
        functionSignature: "import sys\n\ndef solve():\n    s = sys.stdin.read().strip()\n    # Your code here\n\nif __name__ == '__main__':\n    solve()",
        testCases: [
            { input: "hello world\n", expectedOutput: "3" },
            { input: "PINGUP\n", expectedOutput: "2" },
            { input: "bcdfghjklmnpqrstvwxyz\n", expectedOutput: "0" }
        ],
        points: 10
    },
    {
        title: "Prime Check",
        description: "Read an integer N. If it's a prime number, print 'true', else 'false'.\n\nExample Input:\n7\n\nExample Output:\ntrue",
        language: "java",
        difficulty: "Medium",
        functionSignature: "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        if(scanner.hasNextInt()) {\n            int n = scanner.nextInt();\n            // Your code here\n        }\n    }\n}",
        testCases: [
            { input: "7\n", expectedOutput: "true" },
            { input: "10\n", expectedOutput: "false" },
            { input: "1\n", expectedOutput: "false" }
        ],
        points: 30
    },
    {
        title: "Missing Number",
        description: "Read an integer N. Then read N-1 integers in the range 1 to N. Find the missing integer.\n\nExample Input:\n5\n1 2 4 5\n\nExample Output:\n3",
        language: "cpp",
        difficulty: "Hard",
        functionSignature: "#include <iostream>\nusing namespace std;\n\nint main() {\n    // Your code here\n    return 0;\n}",
        testCases: [
            { input: "5\n1 2 4 5\n", expectedOutput: "3" },
            { input: "3\n1 3\n", expectedOutput: "2" },
            { input: "2\n2\n", expectedOutput: "1" }
        ],
        points: 50
    },
    {
        title: "Anagram Check",
        description: "Read two strings separated by a space. Print 'true' if they are anagrams, otherwise 'false'.\n\nExample Input:\nlisten silent\n\nExample Output:\ntrue",
        language: "python",
        difficulty: "Medium",
        functionSignature: "import sys\n\ndef solve():\n    data = sys.stdin.read().split()\n    if len(data) >= 2:\n        s1, s2 = data[0], data[1]\n        # Your code here\n\nif __name__ == '__main__':\n    solve()",
        testCases: [
            { input: "listen silent\n", expectedOutput: "true" },
            { input: "hello world\n", expectedOutput: "false" },
            { input: "triangle integral\n", expectedOutput: "true" }
        ],
        points: 40
    }
];

const seedChallenges = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    await Challenge.deleteMany({});
    
    await Challenge.insertMany(challenges);
    console.log(`Inserted ${challenges.length} challenges.`);

    console.log('Challenges seeded successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding challenges:', error);
    process.exit(1);
  }
};

seedChallenges();
