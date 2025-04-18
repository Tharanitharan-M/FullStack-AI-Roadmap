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
    setStreak(prevStreak => prevStreak + 1);
  };

  const overallProgress = calculateOverallProgress();

  return (
    <>
      <Toaster />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-6 text-center">FullStackAI Roadmap</h1>

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
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={user?.imageUrl} alt={user?.name} />
                    <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{user?.name}</div>
                    <div className="text-sm text-muted-foreground">{user?.email}</div>
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
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleSignOut}>
                        Sign out
                      </DropdownMenuItem>
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
                        <div>
                          {Object.entries(data.subtopics).map(([subtopic, units]) => (
                            <div key={subtopic} className="mb-4">
                              <h3 className="font-semibold">{subtopic}</h3>
                              <ul className="list-none pl-4">
                                {units.map(unit => (
                                  <li key={unit.title} className="flex items-center mb-2">
                                    <input
                                      type="checkbox"
                                      id={`${subtopic}-${unit.title}`}
                                      checked={progress[`${subtopic}-${unit.title}`] || false}
                                      onChange={() => toggleSubtopic(topic, subtopic, unit.title)}
                                      className="mr-2"
                                    />
                                    <label htmlFor={`${subtopic}-${unit.title}`} className="mr-2">
                                      {unit.title}
                                    </label>
                                    <span className="text-sm text-muted-foreground">({unit.explanation})</span>
                                  </li>
                                ))}
                              </ul>
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
