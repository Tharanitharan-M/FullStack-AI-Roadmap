
"use client";

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Toaster } from "@/components/ui/toaster";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"

// Authentication
import { useUser, useSignIn, useSignOut } from "../lib/auth";

const LearningPillars = [
  "Core Programming",
  "Frontend Development",
  "Backend Development",
  "Databases",
  "DevOps & Cloud",
  "SaaS Architecture & Security",
  "LLMs & GenAI",
  "AI Agents & MCP",
  "CS Fundamentals",
  "DSA + System Design",
];

const SubtopicsData: { [key: string]: { subtopics: string[], explanations: { [key: string]: string } } } = {
  "Core Programming": {
    subtopics: [
      "Python syntax, control flow, data types",
      "Functions and OOP (classes, inheritance)",
      "File I/O and modules",
      "Error handling",
      "TypeScript basics (types, interfaces, enums)",
      "Functional programming (pure functions, immutability)"
    ],
    explanations: {
      "Python syntax, control flow, data types": "Understanding Python basics is fundamental for any further development.",
      "Functions and OOP (classes, inheritance)": "OOP allows you to create reusable and organized code.",
      "File I/O and modules": "Essential for handling data and external libraries.",
      "Error handling": "Ensures your program doesn't crash and provides useful feedback.",
      "TypeScript basics (types, interfaces, enums)": "Adds static typing to JavaScript, improving code quality.",
      "Functional programming (pure functions, immutability)": "A paradigm that promotes clean and testable code."
    }
  },
  "Frontend Development": {
    subtopics: [
      "HTML5, CSS3, responsive design",
      "JavaScript (DOM, events, fetch, ES6+)",
      "React (hooks, state, props, router)",
      "Next.js (SSR, file routing, API routes)",
      "Tailwind CSS",
      "Component architecture and UI state management"
    ],
    explanations: {
      "HTML5, CSS3, responsive design": "Essential for building the structure and style of web pages.",
      "JavaScript (DOM, events, fetch, ES6+)": "Enables interactivity and dynamic content updates.",
      "React (hooks, state, props, router)": "A popular library for building user interfaces.",
      "Next.js (SSR, file routing, API routes)": "A React framework that provides SSR and other features.",
      "Tailwind CSS": "A utility-first CSS framework for rapid UI development.",
      "Component architecture and UI state management": "Organizing and managing UI components for scalability."
    }
  },
  "Backend Development": {
    subtopics: [
      "Node.js + Express (routing, middleware, APIs)",
      "Flask (Python microframework)",
      "FastAPI (async APIs, validation with Pydantic)",
      "REST API design, authentication (JWT, OAuth)",
      "Error handling, pagination, rate limiting"
    ],
    explanations: {
      "Node.js + Express (routing, middleware, APIs)": "A runtime environment and framework for building server-side applications.",
      "Flask (Python microframework)": "A lightweight Python framework for building web applications.",
      "FastAPI (async APIs, validation with Pydantic)": "A modern, fast (high-performance), web framework for building APIs.",
      "REST API design, authentication (JWT, OAuth)": "Designing APIs that follow REST principles and securing them.",
      "Error handling, pagination, rate limiting": "Ensuring the API is robust and scalable."
    }
  },
  "Databases": {
    subtopics: [
      "PostgreSQL (DDL, DML, joins, indexes, ACID)",
      "MongoDB (documents, CRUD, aggregation)",
      "ORMs: Prisma (Node)",
      "SQLAlchemy (Flask/FastAPI)",
    ],
    explanations: {
      "PostgreSQL (DDL, DML, joins, indexes, ACID)": "A powerful open-source relational database system.",
      "MongoDB (documents, CRUD, aggregation)": "A NoSQL database that stores data in flexible, JSON-like documents.",
      "ORMs: Prisma (Node)": "A modern ORM that makes it easy to work with databases in Node.js.",
      "SQLAlchemy (Flask/FastAPI)": "A popular SQL toolkit and ORM for Python."
    }
  },
  "DevOps & Cloud": {
    subtopics: [
      "Git + GitHub (branches, PRs, merges)",
      "Docker (build, run, compose)",
      "CI/CD (GitHub Actions, basic YAML setup)",
      "Hosting/Deployment: Vercel (frontend)",
      "Render/Heroku (backend)",
      "AWS EC2, Lambda, S3"
    ],
    explanations: {
      "Git + GitHub (branches, PRs, merges)": "Version control system for tracking changes in source code.",
      "Docker (build, run, compose)": "A platform for developing, shipping, and running applications in containers.",
      "CI/CD (GitHub Actions, basic YAML setup)": "Automating the software release process.",
      "Hosting/Deployment: Vercel (frontend)": "A cloud platform for static sites and frontend applications.",
      "Render/Heroku (backend)": "Cloud platforms for deploying and scaling backend applications.",
      "AWS EC2, Lambda, S3": "Amazon Web Services for computing, serverless functions, and storage."
    }
  },
  "SaaS Architecture & Security": {
    subtopics: [
      "JWT & OAuth2 authentication",
      "Role-Based Access Control (RBAC)",
      "Stripe billing integration (subscriptions, webhooks)",
      "OWASP Top 10 (XSS, CSRF, SQLi, etc.)",
      "Input validation & sanitation",
      "Analytics (PostHog, Mixpanel)"
    ],
    explanations: {
      "JWT & OAuth2 authentication": "Standards for securing APIs and web applications.",
      "Role-Based Access Control (RBAC)": "Managing user permissions based on roles.",
      "Stripe billing integration (subscriptions, webhooks)": "Integrating a payment gateway for handling subscriptions.",
      "OWASP Top 10 (XSS, CSRF, SQLi, etc.)": "Awareness of common web security vulnerabilities.",
      "Input validation & sanitation": "Protecting against malicious input.",
      "Analytics (PostHog, Mixpanel)": "Tools for tracking user behavior and product usage."
    }
  },
  "LLMs & GenAI": {
    subtopics: [
      "Tokens, embeddings, attention, transformers",
      "Prompt engineering (zero-shot, few-shot, chain-of-thought)",
      "OpenAI API, Gemini basics",
      "LangChain and LlamaIndex (chains, agents, memory)",
      "Retrieval-Augmented Generation (RAG)",
      "Hugging Face Transformers"
    ],
    explanations: {
      "Tokens, embeddings, attention, transformers": "Key concepts in understanding large language models.",
      "Prompt engineering (zero-shot, few-shot, chain-of-thought)": "Crafting effective prompts to guide LLMs.",
      "OpenAI API, Gemini basics": "Using APIs to interact with LLMs.",
      "LangChain and LlamaIndex (chains, agents, memory)": "Frameworks for building LLM-powered applications.",
      "Retrieval-Augmented Generation (RAG)": "Combining retrieval mechanisms with LLMs for better results.",
      "Hugging Face Transformers": "A library for using pre-trained transformer models."
    }
  },
  "AI Agents & MCP": {
    subtopics: [
      "LangChain AgentExecutor and tool use",
      "Multi-agent orchestration with CrewAI / AutoGen",
      "Model-Context-Persona (MCP) architecture",
      "Vector databases: FAISS, Pinecone, Chroma",
      "Persistent memory, long-context handling"
    ],
    explanations: {
      "LangChain AgentExecutor and tool use": "Building agents that can use tools to perform tasks.",
      "Multi-agent orchestration with CrewAI / AutoGen": "Coordinating multiple agents to achieve a goal.",
      "Model-Context-Persona (MCP) architecture": "Designing AI systems with specific contexts and personas.",
      "Vector databases: FAISS, Pinecone, Chroma": "Storing and querying high-dimensional vectors.",
      "Persistent memory, long-context handling": "Enabling agents to remember and use information over time."
    }
  },
  "CS Fundamentals": {
    subtopics: [
      "Operating Systems: processes, threads, scheduling, memory",
      "Networking: HTTP/HTTPS, DNS, TCP/IP, WebSockets",
      "DBMS: ACID, indexing, normalization, replication",
      "Security: hashing, TLS, HTTPS, secrets management"
    ],
    explanations: {
      "Operating Systems: processes, threads, scheduling, memory": "Understanding how operating systems manage resources.",
      "Networking: HTTP/HTTPS, DNS, TCP/IP, WebSockets": "How computers communicate over networks.",
      "DBMS: ACID, indexing, normalization, replication": "Principles of database management.",
      "Security: hashing, TLS, HTTPS, secrets management": "Protecting data and systems from threats."
    }
  },
  "DSA + System Design": {
    subtopics: [
      "Arrays, linked lists, hash maps",
      "Trees (binary, BST, trie), graphs (BFS, DFS)",
      "Algorithms: sorting, recursion, DP, sliding window",
      "Leetcode practice (NeetCode 150 / Blind 75)",
      "System design patterns (cache, load balancer, queue)"
    ],
    explanations: {
      "Arrays, linked lists, hash maps": "Fundamental data structures.",
      "Trees (binary, BST, trie), graphs (BFS, DFS)": "Advanced data structures for specific problems.",
      "Algorithms: sorting, recursion, DP, sliding window": "Techniques for solving computational problems.",
      "Leetcode practice (NeetCode 150 / Blind 75)": "Practicing coding problems to improve skills.",
      "System design patterns (cache, load balancer, queue)": "Designing scalable and reliable systems."
    }
  }
};

export default function Home() {
  const [progress, setProgress] = useState<{ [key: string]: number }>({});
  const [streak, setStreak] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Authentication
  const { user } = useUser();
  const { signIn } = useSignIn();
  const { signOut } = useSignOut();
  const handleSignIn = async () => {
    await signIn();
  };
  const handleSignOut = async () => {
    await signOut();
  };

  useEffect(() => {
    const storedProgress = localStorage.getItem('progress');
    if (storedProgress) {
      setProgress(JSON.parse(storedProgress));
    }

    const storedStreak = localStorage.getItem('streak');
    if (storedStreak) {
      setStreak(parseInt(storedStreak));
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('progress', JSON.stringify(progress));
    }
  }, [progress, isLoading]);

  const toggleSubtopic = (pillar: string, subtopic: string) => {
    setProgress(prevProgress => {
      const newProgress = { ...prevProgress };
      if (!newProgress[pillar]) {
        newProgress[pillar] = 0;
      }
      const completed = !(completedSubtopics(pillar).has(subtopic));
      const subtopicsCount = SubtopicsData[pillar]?.subtopics?.length || 0;
      const change = completed ? 1 : -1;
      newProgress[pillar] += change / subtopicsCount * 100;
      newProgress[pillar] = Math.max(0, Math.min(100, newProgress[pillar]));
  
      localStorage.setItem('progress', JSON.stringify(newProgress));
      return newProgress;
    });
  
    if (completedSubtopics(pillar).size === SubtopicsData[pillar]?.subtopics?.length && !allPillarsCompleted()) {
      incrementStreak();
    }
  };
  
  const incrementStreak = () => {
    setStreak(prevStreak => {
      const newStreak = prevStreak + 1;
      localStorage.setItem('streak', newStreak.toString());
      return newStreak;
    });
  };
  
  const allPillarsCompleted = () => {
    return LearningPillars.every(pillar => progress[pillar] === 100);
  };

  const completedSubtopics = (pillar: string): Set<string> => {
    const completed = new Set<string>();
    const subtopics = SubtopicsData[pillar]?.subtopics || [];
    if (subtopics) {
      const subtopicsCount = subtopics?.length || 0;
      const subtopicProgress = progress[pillar] || 0;
      const completedCount = Math.round(subtopicProgress / 100 * subtopicsCount);
      for (let i = 0; i < completedCount; i++) {
        completed.add(subtopics[i]);
      }
    }
    return completed;
  };

  return (
    <div className="container mx-auto py-10 max-w-7xl">
      <Toaster />
      <h1 className="text-3xl font-bold mb-6 text-center">FullStackAI Roadmap</h1>

      <div className="flex justify-between items-center mb-4">
        <div>
          <Card>
            <CardContent>
              <Badge variant="secondary">Daily Streak: {streak} days</Badge>
            </CardContent>
          </Card>
        </div>

        <div className="flex items-center space-x-4">
          <Input type="text" placeholder="Search subtopics..." className="max-w-sm" />

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.imageUrl} alt={user.name} />
                    <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 mr-2">
                <DropdownMenuItem className="cursor-default">
                  <div className="grid gap-1 px-2 py-1.5">
                    <p className="text-sm font-semibold leading-none">{user.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={handleSignIn}>Sign In</Button>
          )}
        </div>
      </div>
      <Separator className="mb-4" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {LearningPillars.map(pillar => (
          <Card key={pillar}>
            <CardHeader>
              <h2 className="text-xl font-semibold">{pillar}</h2>
              <Progress value={progress[pillar] || 0} className="mt-2" />
              <p className="text-sm text-muted-foreground mt-1">
                {progress[pillar] ? progress[pillar]?.toFixed(1) : 0}% Complete
              </p>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value={pillar}>
                  <AccordionTrigger>Subtopics</AccordionTrigger>
                  <AccordionContent>
                    {isLoading ? (
                      <div>Loading subtopics...</div>
                    ) : (
                      SubtopicsData[pillar]?.subtopics?.map(subtopic => (
                        <div key={subtopic} className="flex items-center justify-between py-2">
                          <label className="flex items-center space-x-2">
                            <Input
                              type="checkbox"
                              checked={completedSubtopics(pillar).has(subtopic)}
                              onChange={() => toggleSubtopic(pillar, subtopic)}
                            />
                            <span>{subtopic}</span>
                          </label>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const explanation = SubtopicsData[pillar]?.explanations[subtopic] || 'Explanation not available.';
                              toast({
                                title: subtopic,
                                description: explanation,
                              });
                            }}
                          >
                            Why?
                          </Button>
                        </div>
                      ))
                    )}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
