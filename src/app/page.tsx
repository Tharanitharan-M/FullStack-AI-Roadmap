"use client";

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"; // Import useToast
import { Checkbox } from "@/components/ui/checkbox";

// Authentication
import {signIn, signOut, getSession} from "@/lib/auth";

const roadmapData = {
  Programming: {
    title: "Core Programming (Python + TypeScript)",
    subtopics: {
      Python: [
        { title: "Introduction to Python", explanation: "Get familiar with Python's purpose and capabilities." },
        { title: "Python setup and first script", explanation: "Set up the Python environment and write a basic script." },
        { title: "Variables and Data Types", explanation: "Learn how to work with different types of data." },
        { title: "Control Flow (if, else, loops)", explanation: "Understand decision-making and repetition in Python." },
        { title: "Functions", explanation: "Learn how to write reusable code blocks." },
        { title: "OOP Concepts (classes, inheritance, encapsulation)", explanation: "Understand how to organize and structure code with objects." },
        { title: "File I/O", explanation: "Learn how to read from and write to files." },
        { title: "Error handling", explanation: "Learn how to manage and recover from errors." },
        { title: "Modules and Packages", explanation: "Learn how to organize code into reusable modules." },
        { title: "Pythonic idioms and best practices", explanation: "Learn how to write idiomatic and efficient Python code." },
      ],
      TypeScript: [
        { title: "Introduction to TypeScript", explanation: "Understand TypeScript's benefits and use cases." },
        { title: "Setting up TS in a project", explanation: "Set up TypeScript in a development environment." },
        { title: "Type Annotations and Inference", explanation: "Learn how to use type annotations." },
        { title: "Interfaces and Types", explanation: "Understand how to define custom types." },
        { title: "Enums", explanation: "Learn how to use enums." },
        { title: "Functions and Return Types", explanation: "Learn how to define function signatures." },
        { title: "Working with Classes", explanation: "Learn how to use classes in TypeScript." },
        { title: "Generics", explanation: "Understand how to write reusable code with generics." },
        { title: "Type Narrowing and Utility Types", explanation: "Understand how to refine types." },
        { title: "Integrating TypeScript with React or Node", explanation: "Learn how to integrate TypeScript into projects." },
      ],
    },
  },
  Frontend: {
    title: "Frontend Development",
    subtopics: {
      HTML: [
        { title: "HTML5 Structure", explanation: "Learn the basic structure of an HTML5 document." },
        { title: "Semantic HTML", explanation: "Understand semantic HTML elements and their uses." },
        { title: "Forms", explanation: "Learn how to create HTML forms." },
        { title: "Accessibility", explanation: "Learn how to make websites accessible." },
      ],
      CSS: [
        { title: "CSS3 Syntax", explanation: "Understand the syntax of CSS3." },
        { title: "Selectors", explanation: "Learn how to select HTML elements with CSS." },
        { title: "Box Model", explanation: "Understand the CSS box model." },
        { title: "Layout", explanation: "Learn different CSS layout techniques." },
        { title: "Responsive Design", explanation: "Learn how to make websites responsive." },
      ],
      JavaScript: [
        { title: "JavaScript Basics", explanation: "Learn the basics of JavaScript." },
        { title: "DOM Manipulation", explanation: "Learn how to manipulate the DOM with JavaScript." },
        { title: "Events", explanation: "Understand JavaScript events." },
        { title: "Fetch API", explanation: "Learn how to use the Fetch API." },
        { title: "ES6+ Features", explanation: "Learn about modern JavaScript features." },
      ],
      React: [
        { title: "React Basics", explanation: "Learn the basics of React." },
        { title: "JSX", explanation: "Understand JSX syntax." },
        { title: "Components", explanation: "Learn how to create React components." },
        { title: "State and Props", explanation: "Learn how to manage state and props." },
        { title: "Hooks", explanation: "Understand React hooks." },
        { title: "Router", explanation: "Learn how to use React Router." },
      ],
      NextJS: [
        { title: "Next.js Basics", explanation: "Learn the basics of Next.js." },
        { title: "SSR", explanation: "Understand Server-Side Rendering in Next.js." },
        { title: "File-based Routing", explanation: "Learn how Next.js uses file-based routing." },
        { title: "API Routes", explanation: "Learn how to create API routes in Next.js." },
      ],
      UI: [
        { title: "Tailwind CSS", explanation: "Learn how to use Tailwind CSS for styling." },
        { title: "Shadcn/ui", explanation: "Learn how to use Shacdn/ui UI library." },
        { title: "Component Architecture", explanation: "Understand component architecture." },
        { title: "UI State Management", explanation: "Learn how to manage UI state." },
      ],
    },
  },
  Backend: {
    title: "Backend Development",
    subtopics: {
      NodeExpress: [
        { title: "Node.js Basics", explanation: "Learn the basics of Node.js." },
        { title: "Express.js", explanation: "Understand Express.js for building APIs." },
        { title: "Routing", explanation: "Learn how to create routes in Express." },
        { title: "Middleware", explanation: "Understand middleware in Express." },
        { title: "APIs", explanation: "Learn how to create APIs in Express." },
      ],
      Flask: [
        { title: "Flask Basics", explanation: "Learn the basics of Flask." },
        { title: "Microframework", explanation: "Understand Flask as a microframework." },
      ],
      FastAPI: [
        { title: "FastAPI Basics", explanation: "Learn the basics of FastAPI." },
        { title: "Async APIs", explanation: "Understand Async APIs." },
        { title: "Pydantic", explanation: "Learn how to use Pydantic for data validation." },
      ],
      Django: [
        { title: "Django Basics", explanation: "Learn the basics of Django." },
        { title: "ORM", explanation: "Understand the Django ORM." },
        { title: "Built-in Admin", explanation: "Learn how to use the Django admin panel." },
        { title: "Auth", explanation: "Learn how to implement authentication in Django." },
      ],
      APIs: [
        { title: "REST API Design", explanation: "Learn how to design REST APIs." },
        { title: "Authentication", explanation: "Understand authentication methods like JWT and OAuth." },
        { title: "Error Handling", explanation: "Learn how to handle errors in APIs." },
        { title: "Pagination", explanation: "Learn how to implement pagination in APIs." },
        { title: "Rate Limiting", explanation: "Learn how to implement rate limiting in APIs." },
      ],
    },
  },
  Databases: {
    title: "Databases",
    subtopics: {
      PostgreSQL: [
        { title: "PostgreSQL Basics", explanation: "Learn the basics of PostgreSQL." },
        { title: "DDL", explanation: "Understand Data Definition Language." },
        { title: "DML", explanation: "Understand Data Manipulation Language." },
        { title: "Joins", explanation: "Learn how to use joins." },
        { title: "Indexes", explanation: "Understand indexes in databases." },
        { title: "ACID", explanation: "Learn about ACID properties." },
      ],
      MongoDB: [
        { title: "MongoDB Basics", explanation: "Learn the basics of MongoDB." },
        { title: "Documents", explanation: "Understand how to work with documents in MongoDB." },
        { title: "CRUD", explanation: "Learn how to perform CRUD operations in MongoDB." },
        { title: "Aggregation", explanation: "Learn how to use aggregation in MongoDB." },
      ],
      ORMs: [
        { title: "Prisma", explanation: "Learn how to use Prisma." },
        { title: "SQLAlchemy", explanation: "Learn how to use SQLAlchemy." },
        { title: "Django ORM", explanation: "Learn how to use Django ORM." },
      ],
    },
  },
  DevOps: {
    title: "DevOps & Cloud",
    subtopics: {
      GitGitHub: [
        { title: "Git Basics", explanation: "Learn the basics of Git." },
        { title: "GitHub", explanation: "Understand how to use GitHub." },
        { title: "Branches", explanation: "Learn how to use branches." },
        { title: "PRs", explanation: "Understand Pull Requests." },
        { title: "Merges", explanation: "Learn how to merge branches." },
      ],
      Docker: [
        { title: "Docker Basics", explanation: "Learn the basics of Docker." },
        { title: "Build", explanation: "Learn how to build Docker images." },
        { title: "Run", explanation: "Learn how to run Docker containers." },
        { title: "Compose", explanation: "Learn how to use Docker Compose." },
      ],
      CICD: [
        { title: "CI/CD Basics", explanation: "Learn the basics of CI/CD." },
        { title: "GitHub Actions", explanation: "Understand how to use GitHub Actions." },
        { title: "YAML Setup", explanation: "Learn how to set up CI/CD with YAML." },
      ],
      HostingDeployment: [
        { title: "Vercel", explanation: "Learn how to deploy frontends on Vercel." },
        { title: "RenderHeroku", explanation: "Learn how to deploy backends on Render and Heroku." },
        { title: "AWS", explanation: "Understand how to use AWS for hosting." },
      ],
    },
  },
  SaaS: {
    title: "SaaS Architecture & Security",
    subtopics: {
      Auth: [
        { title: "JWT", explanation: "Learn how to use JWT for authentication." },
        { title: "OAuth2", explanation: "Understand OAuth2 authentication." },
        { title: "RBAC", explanation: "Learn about Role-Based Access Control." },
      ],
      Stripe: [
        { title: "Stripe Basics", explanation: "Learn the basics of Stripe." },
        { title: "Subscriptions", explanation: "Understand how to implement subscriptions with Stripe." },
        { title: "Webhooks", explanation: "Learn how to use webhooks with Stripe." },
      ],
      OWASP: [
        { title: "OWASP Top 10", explanation: "Understand the OWASP Top 10 vulnerabilities." },
        { title: "Input Validation", explanation: "Learn how to validate user input." },
        { title: "Sanitation", explanation: "Learn how to sanitize user input." },
      ],
      Analytics: [
        { title: "PostHog", explanation: "Learn how to use PostHog for analytics." },
        { title: "Mixpanel", explanation: "Understand how to use Mixpanel for analytics." },
      ],
    },
  },
  GenAI: {
    title: "LLMs & GenAI",
    subtopics: {
      Transformers: [
        { title: "Tokens", explanation: "Understand what tokens are in the context of LLMs." },
        { title: "Embeddings", explanation: "Learn about embeddings in LLMs." },
        { title: "Attention", explanation: "Understand the attention mechanism." },
        { title: "Transformers", explanation: "Learn about transformer networks." },
      ],
      PromptEngineering: [
        { title: "Prompt Engineering Basics", explanation: "Learn the basics of prompt engineering." },
        { title: "Zero-shot", explanation: "Understand zero-shot learning." },
        { title: "Few-shot", explanation: "Understand few-shot learning." },
        { title: "Chain-of-thought", explanation: "Learn about chain-of-thought prompting." },
      ],
      Basics: [
        { title: "OpenAI API", explanation: "Learn how to use the OpenAI API." },
        { title: "Gemini", explanation: "Understand how to use the Gemini model." },
        { title: "Ollama", explanation: "Learn how to use Ollama." },
      ],
      Frameworks: [
        { title: "LangChain", explanation: "Learn how to use LangChain." },
        { title: "LlamaIndex", explanation: "Understand LlamaIndex." },
        { title: "Chains", explanation: "Learn about chains in LangChain." },
        { title: "Agents", explanation: "Understand agents in LangChain." },
        { title: "Memory", explanation: "Learn how to use memory in LangChain." },
      ],
      RAG: [
        { title: "RAG Basics", explanation: "Learn the basics of Retrieval-Augmented Generation." },
      ],
      HuggingFace: [
        { title: "Hugging Face Transformers", explanation: "Learn how to use Hugging Face Transformers." },
      ],
    },
  },
    SystemDesign: {
        title: "System Design & Software Architecture",
        subtopics: {
            ObjectOrientedDesign: [
                { title: "SOLID Principles (Single Responsibility, Open/Closed, etc.)", explanation: "Foundation for reusable, clean, and extensible architecture." },
                { title: "Coupling & Cohesion", explanation: "Understand how to manage dependencies and relationships between objects." },
                { title: "Composition vs Inheritance", explanation: "Learn the benefits of composition over inheritance for code reuse." },
                { title: "Interfaces & Abstractions", explanation: "Learn how to use interfaces to define contracts." },
                { title: "Dependency Inversion", explanation: "Understand how to decouple high-level modules from low-level modules." },
            ],
            CreationalDesignPatterns: [
                { title: "Singleton", explanation: "Learn how to use the Singleton pattern." },
                { title: "Factory Method", explanation: "Understand the Factory Method Pattern." },
                { title: "Abstract Factory", explanation: "Learn how to use Abstract Factory." },
                { title: "Builder Pattern", explanation: "Understand the Builder Pattern." },
                { title: "Prototype", explanation: "Learn how to use Prototype." },
            ],
            StructuralDesignPatterns: [
                { title: "Adapter", explanation: "Learn how to use the Adapter pattern." },
                { title: "Decorator", explanation: "Understand the Decorator Pattern." },
                { title: "Proxy", explanation: "Learn how to use Proxy." },
                { title: "Composite", explanation: "Learn how to use Composite." },
                { title: "Bridge", explanation: "Understand the Bridge Pattern." },
                { title: "Flyweight", explanation: "Learn how to use Flyweight." },
                { title: "Facade", explanation: "Learn the basics of Facade." },
            ],
            BehavioralDesignPatterns: [
                { title: "Strategy", explanation: "Learn how to use Strategy." },
                { title: "Template Method", explanation: "Understand the Template Method Pattern." },
                { title: "Command", explanation: "Learn how to use Command." },
                { title: "Observer", explanation: "Learn how to use Observer." },
                { title: "Mediator", explanation: "Learn how to use Mediator." },
                { title: "Memento", explanation: "Learn how to use Memento." },
                { title: "Chain of Responsibility", explanation: "Learn how to use Chain of Responsibility." },
                { title: "State Pattern", explanation: "Understand State Pattern." },
                { title: "Iterator", explanation: "Learn how to use Iterator." },
                { title: "Visitor", explanation: "Learn the basics of Visitor." },
            ],
            SystemDesignConcepts: [
                { title: "Load Balancing", explanation: "Learn how to implement Load Balancing." },
                { title: "Caching (Redis, CDN)", explanation: "Understand how to use Caching (Redis, CDN)." },
                { title: "Rate Limiting & Queues", explanation: "Learn how to implement Rate Limiting & Queues." },
                { title: "Scaling (Vertical vs Horizontal)", explanation: "Understand Scaling (Vertical vs Horizontal)." },
                { title: "Consistency & Availability (CAP Theorem)", explanation: "Learn about Consistency & Availability (CAP Theorem)." },
                { title: "Microservices vs Monolith", explanation: "Understand Microservices vs Monolith." },
                { title: "API Design & Versioning", explanation: "Learn API Design & Versioning." },
                { title: "Database Sharding & Replication", explanation: "Learn Database Sharding & Replication." },
                { title: "Designing for Failure", explanation: "Learn Designing for Failure." },
            ],
        },
    },
  Neetcode150: {
    title: "Neetcode 150",
    subtopics: {
      ArraysAndHashing: [
        { title: "Contains Duplicate", explanation: "Determine if any value appears at least twice in an array." },
        { title: "Valid Anagram", explanation: "Check if two strings are anagrams of each other." },
        { title: "Two Sum", explanation: "Find two numbers in an array that add up to a specific target." },
        { title: "Group Anagrams", explanation: "Group anagrams together in a list of strings." },
        { title: "Top K Frequent Elements", explanation: "Find the k most frequent elements in an array." },
        { title: "Product of Array Except Self", explanation: "Compute the product of all elements except the element at each index." },
        { title: "Longest Consecutive Sequence", explanation: "Find the longest consecutive sequence in an unsorted array." },
      ],
      TwoPointers: [
        { title: "Valid Palindrome", explanation: "Check if a string is a palindrome, ignoring non-alphanumeric characters." },
        { title: "Two Sum II - Input Array Is Sorted", explanation: "Find two numbers in a sorted array that add up to a specific target." },
        { title: "3Sum", explanation: "Find all unique triplets in an array which gives the sum of zero." },
        { title: "Container With Most Water", explanation: "Find the container that can hold the most water." },
      ],
      SlidingWindow: [
        { title: "Best Time to Buy and Sell Stock", explanation: "Find the maximum profit by buying and selling a stock once." },
        { title: "Longest Repeating Character Replacement", explanation: "Find the longest substring containing the same letter after replacement." },
        { title: "Permutation in String", explanation: "Check if s2 contains a permutation of s1." },
        { title: "Minimum Window Substring", explanation: "Find the minimum window in S which will contain all the characters in T." },
      ],
      Stack: [
        { title: "Valid Parentheses", explanation: "Determine if the input string is valid based on parentheses." },
        { title: "Min Stack", explanation: "Design a stack that supports push, pop, top, and retrieving the minimum element in constant time." },
        { title: "Evaluate Reverse Polish Notation", explanation: "Evaluate the value of an arithmetic expression in Reverse Polish Notation." },
        { title: "Generate Parentheses", explanation: "Generate all well-formed parentheses combinations for n pairs." },
        { title: "Daily Temperatures", explanation: "For each day, find the number of days until a warmer day." },
        { title: "Car Fleet", explanation: "Calculate the number of car fleets that will arrive at the destination." },
        { title: "Largest Rectangle in Histogram", explanation: "Find the largest rectangular area in a histogram." },
      ],
      BinarySearch: [
        { title: "Binary Search", explanation: "Implement binary search to find a target in a sorted array." },
        { title: "Koko Eating Bananas", explanation: "Find the minimum eating speed to finish all bananas within H hours." },
        { title: "Search a 2D Matrix", explanation: "Determine if a target value exists in a 2D matrix." },
        { title: "Find Minimum in Rotated Sorted Array", explanation: "Find the minimum element in a rotated sorted array." },
        { title: "Search in Rotated Sorted Array", explanation: "Search for a target in a rotated sorted array." },
        { title: "Time Based Key-Value Store", explanation: "Create a time-based key-value storage system." },
        { title: "Median of Two Sorted Arrays", explanation: "Find the median of two sorted arrays." },
      ],
      LinkedList: [
        { title: "Reverse Linked List", explanation: "Reverse a singly linked list." },
        { title: "Merge Two Sorted Lists", explanation: "Merge two sorted linked lists into one sorted list." },
        { title: "Reorder List", explanation: "Reorder a linked list to the specified pattern." },
        { title: "Remove Nth Node From End of List", explanation: "Remove the nth node from the end of a list." },
        { title: "Linked List Cycle", explanation: "Determine if a linked list has a cycle." },
        { title: "Merge K Sorted Lists", explanation: "Merge k sorted linked lists into one sorted list." },
        { title: "Reverse Nodes in k-Group", explanation: "Reverse nodes in a linked list in groups of k." },
      ],
      Trees: [
        { title: "Invert/Flip Binary Tree", explanation: "Invert a binary tree." },
        { title: "Maximum Depth of Binary Tree", explanation: "Find the maximum depth of a binary tree." },
        { title: "Same Tree", explanation: "Check if two binary trees are the same." },
        { title: "Subtree of Another Tree", explanation: "Determine if a binary tree is a subtree of another binary tree." },
        { title: "Lowest Common Ancestor of BST", explanation: "Find the lowest common ancestor of two nodes in a BST." },
        { title: "Binary Tree Right Side View", explanation: "Print nodes visible from the right side of a binary tree." },
        { title: "Count Good Nodes in Binary Tree", explanation: "Count the number of good nodes in a binary tree." },
        { title: "Validate Binary Search Tree", explanation: "Determine if a binary tree is a valid binary search tree." },
        { title: "Kth Smallest Element in a BST", explanation: "Find the kth smallest element in a binary search tree." },
        { title: "Construct Binary Tree from Preorder and Inorder Traversal", explanation: "Construct a binary tree from preorder and inorder traversals." },
        { title: "Binary Tree Maximum Path Sum", explanation: "Find the maximum path sum in a binary tree." },
        { title: "Serialize and Deserialize Binary Tree", explanation: "Serialize and deserialize a binary tree." },
      ],
      Tries: [
        { title: "Implement Trie (Prefix Tree)", explanation: "Implement a trie (prefix tree)." },
        { title: "Design Add and Search Words Data Structure", explanation: "Design a data structure that supports adding new words and searching existing words." },
        { title: "Word Search II", explanation: "Find all words in a board that can be formed from a list of words." },
      ],
      HeapPriorityQueue: [
        { title: "Kth Largest Element in a Stream", explanation: "Design a class to find the kth largest element in a stream." },
        { title: "Last Stone Weight", explanation: "Find the weight of the last stone after repeatedly smashing stones." },
        { title: "K Closest Points to Origin", explanation: "Find the k closest points to the origin." },
        { title: "Connect Ropes to Minimize the Cost", explanation: "Connect ropes with minimum cost." },
        { title: "Task Scheduler", explanation: "Determine the least number of intervals the CPU will take to finish all the given tasks." },
        { title: "Find Median from Data Stream", explanation: "Design a data structure that supports adding numbers and finding the median." },
      ],
      Backtracking: [
        { title: "Combination Sum", explanation: "Find all unique combinations of candidates that sum to T." },
        { title: "Permutations", explanation: "Find all possible permutations of an array." },
        { title: "Subsets", explanation: "Find all possible subsets of a set." },
        { title: "Word Search", explanation: "Determine if the word can be found in the board." },
        { title: "Palindrome Partitioning", explanation: "Find all possible palindrome partitioning of a string." },
      ],
      Graphs: [
        { title: "Number of Islands", explanation: "Count the number of islands in a 2D grid." },
        { title: "Clone Graph", explanation: "Clone an undirected graph." },
        { title: "Course Schedule", explanation: "Check if it is possible to finish all courses." },
        { title: "Pacific Atlantic Water Flow", explanation: "Determine which cells can flow to both Pacific and Atlantic oceans." },
        { title: "Longest Increasing Path in a Matrix", explanation: "Find the length of the longest increasing path in a matrix." },
        { title: "Graph Valid Tree", explanation: "Determine if the graph is a valid tree." },
        { title: "Max Area of Island", explanation: "Find the maximum area of an island in a 2D grid." },
      ],
      AdvancedGraphs: [
        { title: "Number of Connected Components in an Undirected Graph", explanation: "Count the number of connected components in an undirected graph." },
        { title: "Alien Dictionary", explanation: "Determine the order of characters in the alien dictionary." },
        { title: "Reconstruct Itinerary", explanation: "Reconstruct the itinerary in order." },
        { title: "Minimum Height Trees", explanation: "Find all minimum height trees." },
      ],
      DynamicProgramming: [
        { title: "Climbing Stairs", explanation: "Find the number of distinct ways to climb to the top." },
        { title: "Coin Change", explanation: "Find the fewest number of coins that you need to make up that amount." },
        { title: "Longest Increasing Subsequence", explanation: "Find the length of the longest increasing subsequence." },
        { title: "Longest Common Subsequence", explanation: "Find the length of the longest common subsequence." },
        { title: "Word Break Problem", explanation: "Determine if s can be segmented into a space-separated sequence of dictionary words." },
        { title: "Combination Sum IV", explanation: "Find the number of combinations that add up to the target." },
        { title: "House Robber", explanation: "Find the maximum amount of money you can rob tonight." },
        { title: "House Robber II", explanation: "Find the maximum amount of money you can rob tonight with a circular arrangement." },
        { title: "Decode Ways", explanation: "Find the number of ways to decode a message." },
        { title: "Unique Paths", explanation: "Count the number of unique paths from top-left to bottom-right." },
        { title: "Jump Game", explanation: "Determine if you are able to reach the last index." },
        { title: "Edit Distance", explanation: "Find the minimum number of operations required to convert word1 to word2." },
        { title: "Burst Balloons", explanation: "Find the maximum coins you can collect by bursting balloons." },
      ],
    },
  },
  MachineLearning: {
    title: "🧠 Machine Learning & Deep Learning Fundamentals",
    subtopics: {
      "Supervised and Unsupervised Learning": [
        {
          title: "Supervised Learning",
          explanation: "Learn how models are trained on labeled data (e.g., regression, classification)."
        },
        {
          title: "Unsupervised Learning",
          explanation: "Explore clustering and dimensionality reduction techniques using unlabeled data."
        }
      ],
      "Neural Networks and Deep Learning": [
        {
          title: "Neural Network Basics",
          explanation: "Understand the structure of neurons, weights, activations, and layers."
        },
        {
          title: "Forward and Backward Propagation",
          explanation: "Learn how data flows through a model and how gradients are used to update weights."
        },
        {
          title: "CNNs (Convolutional Neural Networks)",
          explanation: "Used in image-related tasks like classification and detection."
        },
        {
          title: "RNNs and LSTMs",
          explanation: "Ideal for time-series or sequence data like text or speech."
        },
        {
          title: "Transfer Learning",
          explanation: "Fine-tune pre-trained models for new tasks quickly."
        }
      ],
      "Model Evaluation and Validation": [
        {
          title: "Training vs Testing vs Validation",
          explanation: "Understand dataset splits and their role in model accuracy."
        },
        {
          title: "Overfitting and Underfitting",
          explanation: "Learn to diagnose and resolve model generalization issues."
        },
        {
          title: "Cross-Validation",
          explanation: "Improve model robustness using k-fold validation techniques."
        },
        {
          title: "Evaluation Metrics",
          explanation: "Use accuracy, precision, recall, F1 score, and confusion matrices to assess performance."
        }
      ],
      "ML Frameworks": [
        {
          title: "TensorFlow Basics",
          explanation: "Learn how to build and train models using TensorFlow."
        },
        {
          title: "PyTorch Basics",
          explanation: "Use dynamic graphs and tensor operations to create neural nets."
        },
        {
          title: "Keras API (in TensorFlow)",
          explanation: "Simplifies building and training models with high-level abstractions."
        },
        {
          title: "Model Deployment (basic)",
          explanation: "Explore options for serving trained models (Flask, FastAPI, TF Serving)."
        }
      ]
    }
  },
};

function Home() {
  const [progress, setProgress] = useState<{ [key: string]: boolean }>({});
  const [streak, setStreak] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Authentication
  const [session, setSession] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(false); // Add loading state for authentication

  const handleSignIn = async () => {
    setAuthLoading(true); // Set loading to true
    try {
      await signIn();
      const userSession = await getSession(); // Fetch updated session
      setSession(userSession); // Update session state
    } catch (error) {
      console.error("Sign-in failed:", error);
    } finally {
      setAuthLoading(false); // Reset loading state
    }
  };

  const handleSignOut = async () => {
    setAuthLoading(true); // Set loading to true
    try {
      await signOut();
      setSession(null); // Clear session state
    } catch (error) {
      console.error("Sign-out failed:", error);
    } finally {
      setAuthLoading(false); // Reset loading state
    }
  };

  useEffect(() => {
    const fetchSession = async () => {
      const userSession = await getSession();
      setSession(userSession);
    };

    fetchSession();
  }, []);

  useEffect(() => {
    if (session?.email) {
      const storedProgress = localStorage.getItem(`progress-${session.email}`);
      if (storedProgress) {
        setProgress(JSON.parse(storedProgress));
      }

      const storedStreak = localStorage.getItem(`streak-${session.email}`);
      if (storedStreak) {
        setStreak(parseInt(storedStreak));
      }

      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, [session]);


  useEffect(() => {
    if (session?.email && !isLoading) {
      localStorage.setItem(`progress-${session.email}`, JSON.stringify(progress));
    }
  }, [progress, isLoading, session]);

  useEffect(() => {
    if (session?.email) {
      localStorage.setItem(`streak-${session.email}`, streak.toString());
    }
  }, [streak, session]);

  const toggleSubtopic = (topic: string, subtopic: string, unit: string) => {
    setProgress(prevProgress => {
      const newProgress = {
        ...prevProgress,
        [`${subtopic}-${unit}`]: !prevProgress[`${subtopic}-${unit}`],
      };
      return newProgress;
    });
  };

  const calculateTopicProgress = (topic: string): number => {
    let totalUnits = 0;
    let completedUnits = 0;

    Object.values(roadmapData[topic].subtopics).forEach(subtopicUnits => {
      totalUnits += subtopicUnits.length;
      completedUnits += subtopicUnits.filter(unit => progress[`${Object.keys(roadmapData[topic].subtopics).find(key => roadmapData[topic].subtopics[key] === subtopicUnits)}-${unit.title}`]).length;
    });

    return totalUnits > 0 ? (completedUnits / totalUnits) * 100 : 0;
  };

  const calculateOverallProgress = (): number => {
    let totalUnits = 0;
    let completedUnits = 0;

    Object.values(roadmapData).forEach(topic => {
      Object.values(topic.subtopics).forEach(subtopicUnits => {
        totalUnits += subtopicUnits.length;
        completedUnits += subtopicUnits.filter(unit => progress[`${Object.keys(topic.subtopics).find(key => topic.subtopics[key] === subtopicUnits)}-${unit.title}`]).length;
      });
    });

    return totalUnits > 0 ? (completedUnits / totalUnits) * 100 : 0;
  };

  const incrementStreak = () => {
    if (session?.email) {
      const today = new Date().toLocaleDateString();
      const lastLogin = localStorage.getItem(`lastLogin-${session.email}`);

      if (lastLogin) {
        const lastLoginDate = new Date(lastLogin);
        const diffInDays = Math.floor(
          (new Date(today).getTime() - lastLoginDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (diffInDays === 1) {
          // Increment streak if the user logs in the next day
          setStreak((prevStreak) => prevStreak + 1);
        } else if (diffInDays > 1) {
          // Reset streak if the user skips a day
          setStreak(0);
        }
      } else {
        // First login or no previous login recorded
        setStreak(1);
      }

      localStorage.setItem(`lastLogin-${session.email}`, today);
    }
  };

  const overallProgress = calculateOverallProgress();

  return (
    <>
      <Toaster />
      <div
        className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-100 to-pink-50 text-gray-800"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Motivational Banner */}
          <div className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-400 text-white rounded-lg p-6 shadow-lg mb-8">
            <h1 className="text-4xl font-bold text-center">
              Welcome to Your FullStackAI Journey!
            </h1>
            <p className="text-center mt-2 text-lg">
              Learn, grow, and achieve your goals one step at a time. 🌟
            </p>
          </div>

          {/* Progress and Streak Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="hover:shadow-xl transition-shadow">
              <CardHeader className="text-center">
                <CardTitle>Overall Progress</CardTitle>
                <CardDescription>Track your journey</CardDescription>
              </CardHeader>
              <CardContent>
                <Progress
                  value={overallProgress}
                  className="transition-all duration-500 ease-in-out"
                />
                <p className="text-center mt-2 text-lg font-semibold">
                  {overallProgress.toFixed(1)}% Complete 🎯
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow">
              <CardHeader className="text-center">
                <CardTitle>Daily Streak</CardTitle>
                <CardDescription>Keep the momentum going</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center">
                  <Badge
                    variant="accent"
                    className="text-2xl px-6 py-3 rounded-full flex items-center gap-2 bg-yellow-400/90 text-orange-900 shadow-lg animate-pulse"
                    style={{ fontWeight: 700, fontSize: "1.5rem" }}
                  >
                    <span role="img" aria-label="fire" className="text-3xl">
                      🔥
                    </span>
                    {streak} day{streak === 1 ? "" : "s"}
                  </Badge>
                  <span className="mt-2 text-sm text-orange-700 font-semibold">
                    {streak > 0
                      ? "You're on fire! Keep your streak alive! 🚀"
                      : "Start your streak today!"}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow">
              <CardHeader className="text-center">
                <CardTitle>Authentication</CardTitle>
                <CardDescription>Manage your profile</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center space-y-4">
                  {session ? (
                    <>
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={session?.picture} alt={session?.name} />
                        <AvatarFallback>{session?.name?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="text-center">
                        <p className="text-lg font-medium">{session?.name}</p>
                        <p className="text-sm text-gray-500">{session?.email}</p>
                      </div>
                      <Button
                        onClick={handleSignOut}
                        disabled={authLoading} // Disable button while loading
                        className={`${
                          session ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"
                        } text-white px-4 py-2 rounded-md shadow-md`}
                      >
                        {authLoading ? "Loading..." : "Sign Out"}
                      </Button>
                    </>
                  ) : (
                    <>
                      <p className="text-center text-gray-600">
                        Sign in to save your progress and manage your profile.
                      </p>
                      <Button
                        onClick={handleSignIn}
                        disabled={authLoading} // Disable button while loading
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md shadow-md"
                      >
                        {authLoading ? "Loading..." : "Sign In with Google"}
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Learning Pillars */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Object.entries(roadmapData).map(([topic, data]) => (
              <Card
                key={topic}
                className="hover:shadow-lg transition-shadow border border-gray-200 rounded-lg"
              >
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div className="text-xl font-semibold">{data.title}</div>
                    <Badge
                      variant="outline"
                      className="bg-purple-100 text-purple-800"
                    >
                      {calculateTopicProgress(topic).toFixed(1)}% Complete
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <Accordion
                    type="single"
                    collapsible
                    className="w-full"
                  >
                    <AccordionItem value={topic}>
                      <AccordionTrigger className="text-lg font-medium">
                        Subtopics 📚
                      </AccordionTrigger>
                      <AccordionContent>
                        {isLoading ? (
                          <div className="flex items-center justify-center">
                            Loading subtopics...
                          </div>
                        ) : (
                          <div>
                            {Object.entries(data.subtopics).map(
                              ([subtopic, units]) => (
                                <div
                                  key={subtopic}
                                  className="mb-4 border-b pb-4"
                                >
                                  <h3 className="text-lg font-semibold text-blue-600">
                                    {subtopic}
                                  </h3>
                                  <ul className="list-none pl-4">
                                    {units.map((unit) => (
                                      <li
                                        key={unit.title}
                                        className="flex items-center space-x-2"
                                      >
                                        <Checkbox
                                          id={`${subtopic}-${unit.title}`}
                                          checked={
                                            progress[
                                              `${subtopic}-${unit.title}`
                                            ] || false
                                          }
                                          onCheckedChange={() => {
                                            toggleSubtopic(
                                              topic,
                                              subtopic,
                                              unit.title
                                            );
                                            incrementStreak(); // Increment streak on checkbox change
                                          }}
                                          className="mr-2"
                                        />
                                        <label
                                          htmlFor={`${subtopic}-${unit.title}`}
                                          className="text-sm"
                                        >
                                          {unit.title} (
                                          <span className="text-gray-500">
                                            {unit.explanation}
                                          </span>
                                          )
                                        </label>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )
                            )}
                          </div>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
