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
  April: {
    title: "Core Programming (Python, JS/TS), Git, HTML/CSS, React basics",
    subtopics: [
      "Python syntax, control flow, data types",
      "Functions and OOP (classes, inheritance)",
      "File I/O and modules",
      "Error handling",
      "TypeScript basics (types, interfaces, enums)",
      "Functional programming (pure functions, immutability)",
      "Version Control: Basic commands: add, commit, push, pull",
      "Branching: Creating, merging, and resolving conflicts",
      "HTML5 Structure and Semantics: Semantic HTML elements",
      "CSS3 Styling and Layout: Selectors, properties, values",
      "Responsive Design: Media queries, Flexbox and Grid",
      "JSX: Writing React components",
      "Components: Props and State",
      "Handling Events: Event listeners and handlers",
    ],
  },
  May: {
    title: "Full Stack Dev (Next.js, Flask, FastAPI, Node.js, MongoDB, PostgreSQL)",
    subtopics: [
      "SSR and SEO: Server-Side Rendering basics, SEO optimization techniques",
      "File Routing: Defining routes based on the file system",
      "API Routes: Creating backend endpoints using Next.js",
      "Routing and Views: Handling web requests with Flask",
      "Templates and Jinja: Generating dynamic HTML with Jinja templates",
      "Pydantic Validation: Ensuring data integrity with Pydantic models",
      "Express Framework: Building server-side applications with Express",
      "Documents and CRUD: Managing data in MongoDB",
      "Relational DB Design: Structuring data in PostgreSQL",
      "SQL Queries and Joins: Retrieving data efficiently with SQL",
    ],
  },
  June: {
    title: "DevOps (Docker, CI/CD), SaaS Auth, Cloud (Vercel, AWS), Project #1 Launch",
    subtopics: [
      "Docker: Containerizing Apps: Packaging applications for portability",
      "Docker: Compose: Managing multi-container applications",
      "CI/CD: GitHub Actions: Automating builds and deployments",
      "JWT: Securing APIs",
      "OAuth2: Implementing third-party authentication",
      "Vercel Deployment: Hosting frontend applications",
      "AWS EC2 Basics: Virtual servers in the cloud",
      "AWS Lambda: Serverless functions",
      "AWS S3: Object storage",
      "Deploying full-stack application: Making project live",
    ],
  },
  July: {
    title: "LLMs, LangChain, Agents, RAG, MCP, Vector DBs, Project #2 (AI SaaS)",
    subtopics: [
      "Tokens and Embeddings: Understanding language models",
      "Transformers: Core of modern LLMs",
      "Chains and Agents: Orchestrating LLMs",
      "Retrieval: Improving LLM performance",
      "Model-Context-Persona: Designing AI systems",
      "FAISS: Similarity search in vector databases",
      "Pinecone: Managed vector database",
      "Chroma: Open-source vector database",
      "AI-powered SaaS application: Developing innovative products",
    ],
  },
  August: {
    title: "CS Fundamentals, DSA, System Design, Resume/Portfolio, Apply to",
    subtopics: [
      "OS: Processes: Understanding how processes work",
      "OS: Threads: Understanding how threads work",
      "OS: Memory: Understanding how memory management works",
      "Networking: HTTP/HTTPS: Understanding web communication",
      "Networking: DNS: Resolving domain names",
      "Networking: TCP/IP: Foundation of the Internet",
      "Networking: WebSockets: Real-time communication",
      "DBMS: ACID: Ensuring database consistency",
      "DBMS: Indexing: Improving database query performance",
      "Arrays: Working with basic arrays",
      "Linked Lists: Working with basic linked lists",
      "Hash Maps: Efficient data retrieval",
      "Caching: Speeding up data access",
      "Load Balancing: Distributing traffic",
      "Queues: Managing asynchronous tasks",
      "Resume/Portfolio",
      "Apply to positions",
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

  const toggleSubtopic = (month: string, subtopic: string) => {
    setProgress(prevProgress => {
      const newProgress = {
        ...prevProgress,
        [subtopic]: !prevProgress[subtopic],
      };
      return newProgress;
    });
  };

  const calculateOverallProgress = (): number => {
    const totalSubtopics = Object.values(roadmapData).reduce((count, month) => count + month.subtopics.length, 0);
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
            <CardHeader>Authentication</CardHeader>
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
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user?.imageUrl} alt={user?.name} />
                          <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                      <DropdownMenuItem onClick={handleSignOut}>
                        Sign out
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <Button onClick={handleSignIn}>Sign In</Button>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {Object.entries(roadmapData).map(([month, data]) => (
            <Card key={month}>
              <CardHeader>
                <CardTitle>{month}</CardTitle>
                <CardDescription>
                  {data.title}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value={month}>
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
                                onChange={() => toggleSubtopic(month, subtopic)}
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
