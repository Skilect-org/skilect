export type InterviewPhase = "setup" | "session" | "results";
export type InterviewType = "technical" | "hr" | "mixed";

export interface MockQuestion {
  id: string;
  type: "technical" | "hr";
  isCoding: boolean;
  question: string;
  title?: string;
  difficulty?: "EASY" | "MEDIUM" | "HARD";
  description?: string[];
  examples?: { input: string; output: string }[];
  defaultCode?: string;
}

export interface SetupData {
  type: InterviewType | null;
  role: string;
  difficulty: string;
  jobDescription: string;
}

export const ROLES = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "AI Engineer",
  "Data Scientist",
  "DevOps Engineer",
  "Software Engineer",
];

export const MOCK_QUESTIONS: Record<InterviewType, MockQuestion[]> = {
  technical: [
    {
      id: "t1",
      type: "technical",
      isCoding: false,
      question: "Explain React Hooks and their benefits compared to class lifecycle methods.",
    },
    {
      id: "t2",
      type: "technical",
      isCoding: true,
      question: "Implement an LRU Cache.",
      title: "Lru Cache",
      difficulty: "MEDIUM",
      description: [
        "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.",
        "Implement the LRUCache class:",
        "• LRUCache(int capacity) Initialize the LRU cache with positive size capacity.",
        "• int get(int key) Return the value of the key if the key exists, otherwise return -1.",
        "• void put(int key, int value) Update the value of the key if the key exists. Otherwise, add the key-value pair to the cache. If the number of keys exceeds the capacity from this operation, evict the least recently used key.",
        "The functions get and put must each run in O(1) average time complexity."
      ],
      examples: [
        {
          input: '["LRUCache", "put", "put", "get", "put", "get", "put", "get", "get", "get"]\n[[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]]',
          output: '[null, null, null, 1, null, -1, null, -1, 3, 4]'
        }
      ],
      defaultCode: "class LRUCache:\n    def __init__(self, capacity: int):\n        self.capacity = capacity\n        self.cache = OrderedDict()\n\n    def get(self, key: int) -> int:\n        if key not in self.cache:\n            return -1\n        self.cache.move_to_end(key)\n        return self.cache[key]"
    },
    {
      id: "t3",
      type: "technical",
      isCoding: false,
      question: "Describe how you would optimize a slow-loading Next.js application.",
    },
  ],
  hr: [
    {
      id: "h1",
      type: "hr",
      isCoding: false,
      question: "Tell me about a time you had a conflict with a team member and how you resolved it.",
    },
    {
      id: "h2",
      type: "hr",
      isCoding: false,
      question: "Where do you see yourself in 5 years, and how does this role align with your goals?",
    },
    {
      id: "h3",
      type: "hr",
      isCoding: false,
      question: "Describe your greatest professional achievement so far.",
    },
  ],
  mixed: [
    {
      id: "m1",
      type: "hr",
      isCoding: false,
      question: "Tell me about yourself and your background in software engineering.",
    },
    {
      id: "m2",
      type: "technical",
      isCoding: false,
      question: "What is the difference between SQL and NoSQL databases? When would you use each?",
    },
    {
      id: "m3",
      type: "technical",
      isCoding: true,
      question: "Valid Palindrome.",
      title: "Valid Palindrome",
      difficulty: "EASY",
      description: [
        "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.",
        "Given a string s, return true if it is a palindrome, or false otherwise."
      ],
      examples: [
        {
          input: 's = "A man, a plan, a canal: Panama"',
          output: 'true'
        }
      ],
      defaultCode: "class Solution:\n    def isPalindrome(self, s: str) -> bool:\n        # Write your code here\n        pass"
    },
    {
      id: "m4",
      type: "hr",
      isCoding: false,
      question: "How do you handle tight deadlines and high-pressure situations?",
    },
  ],
};

export const MOCK_RESULTS = {
  overallScore: 75,
  categories: [
    { label: "Technical Knowledge", score: 82, color: "bg-blue-500" },
    { label: "Communication", score: 68, color: "bg-violet-500" },
    { label: "Problem Solving", score: 77, color: "bg-emerald-500" },
    { label: "Confidence", score: 73, color: "bg-amber-500" },
  ],
  communicationAnalysis: {
    fillerWords: ["um", "uh", "like", "actually"],
    pace: "Slightly Fast (160 wpm)",
    confidence: "Moderate",
    clarity: "High",
  },
  technicalAnalysis: {
    strongAreas: ["React", "JavaScript", "Problem Solving"],
    weakAreas: ["System Design", "SQL", "Optimization"],
  },
  feedback: "You demonstrated strong frontend knowledge but struggled with system design concepts and communication confidence. Practice structuring your answers using the STAR method for behavioral questions, and dive deeper into database architecture.",
  improvements: [
    "Practice System Design",
    "Improve SQL Knowledge",
    "Reduce Filler Words",
    "Improve Behavioral Answers",
  ],
  questionReviews: [
    {
      question: "Explain React Hooks and their benefits.",
      userAnswer: "Hooks let you use state without writing a class. They are easier to read and let you reuse stateful logic.",
      score: 85,
      strengths: ["Clear definition", "Mentioned reusability"],
      weaknesses: ["Could mention specific hooks like useEffect", "Missed explaining lifecycle differences"],
    },
    {
      question: "Tell me about a time you had a conflict with a team member.",
      userAnswer: "Um, there was a time we disagreed on a tech stack. I like, talked to them and we figured it out.",
      score: 55,
      strengths: ["Resolved the issue"],
      weaknesses: ["Used too many filler words", "Lacked detail (STAR method)"],
    },
    {
      question: "Implement Binary Search.",
      userAnswer: "function binarySearch(arr, target) { ... } // (Code implementation provided)",
      score: 90,
      strengths: ["Correct logic", "Handled edge cases"],
      weaknesses: ["Variable naming could be more descriptive"],
    },
  ],
};
