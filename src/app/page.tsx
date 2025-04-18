"use client";

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"; // Import useToast

// Authentication
import { useUser, useSignIn, useSignOut } from "../lib/auth";

const roadmapData = {
  Programming: {
    title: "Core Programming (Python + TypeScript)",
    subtopics: [
      "Python syntax, control flow, data types",
      "Functions and OOP (classes, inheritance)",
      "File I/O and modules",
      "Error handling",
      "TypeScript basics (types, interfaces, enums)",
      "Functional programming (pure functions, immutability)",
    ],
  },
  Frontend: {
    title: "Frontend Development",
    subtopics: [
      "HTML5, CSS3, responsive design",
      "JavaScript (DOM, events, fetch, ES6+)",
      "React (hooks, state, props, router)",
      "Next.js (SSR, file routing, API routes)",
      "Tailwind CSS or Chakra UI",
      "Component architecture and UI state management",
    ],
  },
  Backend: {
    title: "Backend Development",
    subtopics: [
      "Node.js + Express (routing, middleware, APIs)",
      "Flask (Python microframework)",
      "FastAPI (async APIs, validation with Pydantic)",
      "Django (ORM, built-in admin, auth)",
      "REST API design, authentication (JWT, OAuth)",
      "Error handling, pagination, rate limiting",
    ],
  },
  Databases: {
    title: "Databases",
    subtopics: [
      "PostgreSQL (DDL, DML, joins, indexes, ACID)",
      "MongoDB (documents, CRUD, aggregation)",
      "ORMs: Prisma (Node), SQLAlchemy (Flask/FastAPI), Django ORM",
    ],
  },
  DevOps: {
    title: "DevOps & Cloud",
    subtopics: [
      "Git + GitHub (branches, PRs, merges)",
      "Docker (build, run, compose)",
      "CI/CD (GitHub Actions, basic YAML setup)",
      "Hosting/Deployment: Vercel (frontend), Render/Heroku (backend), AWS EC2, Lambda, S3",
    ],
  },
  SaaS: {
    title: "SaaS Architecture & Security",
    subtopics: [
      "JWT & OAuth2 authentication",
      "Role-Based Access Control (RBAC)",
      "Stripe billing integration (subscriptions, webhooks)",
      "OWASP Top 10 (XSS, CSRF, SQLi, etc.)",
      "Input validation & sanitation",
      "Analytics (PostHog, Mixpanel)",
    ],
  },
  GenAI: {
    title: "LLMs & GenAI",
    subtopics: [
      "Tokens, embeddings, attention, transformers",
      "Prompt engineering (zero-shot, few-shot, chain-of-thought)",
      "OpenAI API, Gemini, Ollama basics",
      "LangChain and LlamaIndex (chains, agents, memory)",
      "Retrieval-Augmented Generation (RAG)",
      "Hugging Face Transformers",
    ],
  },
  DSA: {
    title: "DSA + System Design",
    subtopics: [
      "Arrays, linked lists, hash maps",
      "Trees (binary, BST, trie), graphs (BFS, DFS)",
      "Algorithms: sorting, recursion, DP, sliding window",
      "Leetcode practice (NeetCode 150 / Blind 75)",
      "System design patterns (cache, load balancer, queue)",
    ],
  },
};

export default function Home() {
  const [progress, setProgress] = useState<{ [key: string]: boolean }>({});
  const [streak, setStreak] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Authentication
  const { user } = useUser();
  const { signIn } = useSignIn();
  const { signOut } = useSignOut();

  const handleSignIn = async () => {
    await signIn().then(() => {
      // After successful sign-in, retrieve and set the streak from localStorage
      const storedStreak = localStorage.getItem(`streak-${user?.id}`);
      if (storedStreak) {
        setStreak(parseInt(storedStreak));
      }
      const storedProgress = localStorage.getItem(`progress-${user?.id}`);
        if (storedProgress) {
          setProgress(JSON.parse(storedProgress));
        }
    });
  };
  const handleSignOut = async () => {
    await signOut();
    setProgress({}); // Reset progress on sign out
    setStreak(0); // Reset streak on sign out
  };

  useEffect(() => {
    if (user) {
        const storedProgress = localStorage.getItem(`progress-${user.id}`);
        if (storedProgress) {
          setProgress(JSON.parse(storedProgress));
        }

        const storedStreak = localStorage.getItem(`streak-${user.id}`);
        if (storedStreak) {
          setStreak(parseInt(storedStreak));
        }

        setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user && !isLoading) {
      localStorage.setItem(`progress-${user.id}`, JSON.stringify(progress));
    }
  }, [progress, isLoading, user]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(`streak-${user.id}`, streak.toString());
    }
  }, [streak, user]);

  const toggleSubtopic = (topic: string, subtopic: string) => {
    setProgress(prevProgress => {
      const newProgress = {
        ...prevProgress,
        [subtopic]: !prevProgress[subtopic],
      };
      return newProgress;
    });
  };

  const calculateTopicProgress = (topic: string): number => {
    const totalSubtopics = roadmapData[topic].subtopics.length;
    const completedSubtopics = roadmapData[topic].subtopics.filter(subtopic => progress[subtopic]).length;
    return totalSubtopics > 0 ? (completedSubtopics / totalSubtopics) * 100 : 0;
  };

  const calculateOverallProgress = (): number => {
    const totalSubtopics = Object.values(roadmapData).reduce((count, topic) => count + topic.subtopics.length, 0);
    const completedSubtopics = Object.keys(progress).filter(subtopic => progress[subtopic]).length;
    return totalSubtopics > 0 ? (completedSubtopics / totalSubtopics) * 100 : 0;
  };

  const incrementStreak = () => {
    setStreak(prevStreak => prevStreak + 1);
  };

  const overallProgress = calculateOverallProgress();

  return (
    <>
      <Toaster />
      <h1 className="text-3xl font-bold mb-6 text-center">FullStackAI Roadmap</h1>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Overall Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={overallProgress} />
              {overallProgress.toFixed(1)}% Complete
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Daily Streak</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant="secondary">Daily Streak: {streak} days</Badge>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Authentication</CardTitle>
            </CardHeader>
            <CardContent>
              {user ? (
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={user?.imageUrl} alt={user?.name} />
                      <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div>{user?.name}</div>
                      <div className="text-sm text-muted-foreground">{user?.email}</div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleSignOut}>
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Button onClick={handleSignIn}>Sign In</Button>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {Object.entries(roadmapData).map(([topic, data]) => (
            <Card key={topic}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>{data.title}</CardTitle>
                  <Badge variant="outline">
                    {calculateTopicProgress(topic).toFixed(1)}% Complete
                  </Badge>
                </div>
                <CardDescription>
                  {data.title}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value={topic}>
                    <AccordionTrigger>
                      Subtopics
                    </AccordionTrigger>
                    <AccordionContent>
                      {isLoading ? (
                        <div>Loading subtopics...</div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                          {data.subtopics?.map(subtopic => (
                            <div key={subtopic} className="flex items-center">
                              <input
                                type="checkbox"
                                checked={progress[subtopic] || false}
                                onChange={() => toggleSubtopic(topic, subtopic)}
                                className="mr-2"
                              />
                              {subtopic}
                            </div>
                          ))}
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
    </>
  );
}
