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

const roadmapData = {
  April: {
    title: "Core Programming (Python, JS/TS), Git, HTML/CSS, React basics",
    subtopics: [
      {
        title: "Core Programming (Python)",
        subtopics: [
          "Python: Syntax and Data Types",
          "  - Variables, data types, operators",
          "  - Strings, lists, dictionaries",
          "Python: Control Flow",
          "  - If/else statements",
          "  - For and while loops",
          "Python: Functions and Modules",
          "  - Defining functions, parameters",
          "  - Importing and using modules",
          "Python: OOP",
          "  - Classes and objects",
          "  - Inheritance and polymorphism",
        ],
      },
      {
        title: "Core Programming (JS/TS)",
        subtopics: [
          "TypeScript: Basics",
          "  - Types, interfaces, enums",
          "TypeScript: Functional Programming",
          "  - Pure functions",
          "  - Immutability",
        ],
      },
      {
        title: "Git",
        subtopics: [
          "Git: Version Control",
          "  - Basic commands: add, commit, push, pull",
          "Git: Branching",
          "  - Creating, merging, and resolving conflicts",
        ],
      },
      {
        title: "HTML/CSS",
        subtopics: [
          "HTML5: Structure and Semantics",
          "  - Semantic HTML elements",
          "CSS3: Styling and Layout",
          "  - Selectors, properties, values",
          "CSS3: Responsive Design",
          "  - Media queries",
          "  - Flexbox and Grid",
        ],
      },
      {
        title: "React basics",
        subtopics: [
          "React: JSX",
          "  - Writing React components",
          "React: Components",
          "  - Props and State",
          "React: Handling Events",
          "  - Event listeners and handlers",
        ],
      },
    ],
  },
  May: {
    title: "Full Stack Dev (Next.js, Flask, FastAPI, Node.js, MongoDB, PostgreSQL)",
    subtopics: [
      {
        title: "Next.js",
        subtopics: [
          "Next.js: SSR and SEO",
          "  - Server-Side Rendering basics",
          "  - SEO optimization techniques",
          "Next.js: File Routing",
          "  - Defining routes based on the file system",
          "Next.js: API Routes",
          "  - Creating backend endpoints using Next.js",
        ],
      },
      {
        title: "Flask (Python microframework)",
        subtopics: [
          "Flask: Routing and Views",
          "  - Handling web requests with Flask",
          "Flask: Templates and Jinja",
          "  - Generating dynamic HTML with Jinja templates",
        ],
      },
      {
        title: "FastAPI (async APIs)",
        subtopics: [
          "FastAPI: Pydantic Validation",
          "  - Ensuring data integrity with Pydantic models",
        ],
      },
      {
        title: "Node.js",
        subtopics: [
          "Node.js: Express Framework",
          "  - Building server-side applications with Express",
        ],
      },
      {
        title: "MongoDB",
        subtopics: [
          "MongoDB: Documents and CRUD",
          "  - Managing data in MongoDB",
        ],
      },
      {
        title: "PostgreSQL",
        subtopics: [
          "PostgreSQL: Relational DB Design",
          "  - Structuring data in PostgreSQL",
          "PostgreSQL: SQL Queries and Joins",
          "  - Retrieving data efficiently with SQL",
        ],
      },
    ],
  },
  June: {
    title: "DevOps (Docker, CI/CD), SaaS Auth, Cloud (Vercel, AWS), Project #1 Launch",
    subtopics: [
      {
        title: "DevOps",
        subtopics: [
          "Docker",
          "  - Docker: Containerizing Apps",
          "    - Packaging applications for portability",
          "  - Docker: Compose",
          "    - Managing multi-container applications",
          "CI/CD",
          "  - CI/CD: GitHub Actions",
          "    - Automating builds and deployments",
        ],
      },
      {
        title: "SaaS Auth",
        subtopics: [
          "SaaS Auth: JWT",
          "  - Securing APIs",
          "SaaS Auth: OAuth2",
          "  - Implementing third-party authentication",
        ],
      },
      {
        title: "Cloud",
        subtopics: [
          "Cloud: Vercel Deployment",
          "  - Hosting frontend applications",
          "Cloud: AWS EC2 Basics",
          "  - Virtual servers in the cloud",
          "Cloud: AWS Lambda",
          "  - Serverless functions",
          "Cloud: AWS S3",
          "  - Object storage",
        ],
      },
      {
        title: "Project #1 Launch",
        subtopics: [
          "Deploying full-stack application",
          "  - Making project live",
        ],
      },
    ],
  },
  July: {
    title: "LLMs, LangChain, Agents, RAG, MCP, Vector DBs, Project #2 (AI SaaS)",
    subtopics: [
      {
        title: "LLMs",
        subtopics: [
          "LLMs: Tokens and Embeddings",
          "  - Understanding language models",
          "LLMs: Transformers",
          "  - Core of modern LLMs",
        ],
      },
      {
        title: "LangChain",
        subtopics: [
          "LangChain: Chains and Agents",
          "  - Orchestrating LLMs",
        ],
      },
      {
        title: "RAG",
        subtopics: [
          "RAG: Retrieval",
          "  - Improving LLM performance",
        ],
      },
      {
        title: "MCP",
        subtopics: [
          "MCP: Model-Context-Persona",
          "  - Designing AI systems",
        ],
      },
      {
        title: "Vector DBs",
        subtopics: [
          "Vector DBs: FAISS",
          "  - Similarity search in vector databases",
          "Vector DBs: Pinecone",
          "  - Managed vector database",
          "Vector DBs: Chroma",
          "  - Open-source vector database",
        ],
      },
      {
        title: "Project #2 (AI SaaS)",
        subtopics: [
          "AI-powered SaaS application",
          "  - Developing innovative products",
        ],
      },
    ],
  },
  August: {
    title: "CS Fundamentals, DSA, System Design, Resume/Portfolio, Apply to",
    subtopics: [
      {
        title: "CS Fundamentals",
        subtopics: [
          "OS: Processes",
          "  - Understanding how processes work",
          "OS: Threads",
          "  - Understanding how threads work",
          "OS: Memory",
          "  - Understanding how memory management works",
          "Networking",
          "  - Networking: HTTP/HTTPS",
          "    - Understanding web communication",
          "  - Networking: DNS",
          "    - Resolving domain names",
          "  - Networking: TCP/IP",
          "    - Foundation of the Internet",
          "  - Networking: WebSockets",
          "    - Real-time communication",
          "DBMS",
          "  - DBMS: ACID",
          "    - Ensuring database consistency",
          "  - DBMS: Indexing",
          "    - Improving database query performance",
        ],
      },
      {
        title: "DSA",
        subtopics: [
          "Arrays",
          "  - Working with basic arrays",
          "Linked Lists",
          "  - Working with basic linked lists",
          "Hash Maps",
          "  - Efficient data retrieval",
        ],
      },
      {
        title: "System Design",
        subtopics: [
          "Caching",
          "  - Speeding up data access",
          "Load Balancing",
          "  - Distributing traffic",
          "Queues",
          "  - Managing asynchronous tasks",
        ],
      },
      {
        title: "Resume/Portfolio",
        subtopics: [
          "Resume/Portfolio",
        ],
      },
      {
        title: "Apply to",
        subtopics: [
          "Apply to positions",
        ],
      },
    ],
  },
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
    await signIn().then(() => {
      // After successful sign-in, retrieve and set the streak from localStorage
      const storedStreak = localStorage.getItem('streak');
      if (storedStreak) {
        setStreak(parseInt(storedStreak));
      }
    });
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

  const calculateSubtopicProgress = (pillar: string, subtopicGroupIndex: number) => {
    const subtopicGroup = roadmapData[pillar]?.subtopics[subtopicGroupIndex];
    if (!subtopicGroup) return 0;

    const completedCount = subtopicGroup.subtopics.filter(subtopic => completedSubtopics(pillar).has(subtopic)).length;
    return (completedCount / subtopicGroup.subtopics.length) * 100;
  };

  const toggleSubtopic = (pillar: string, subtopicGroupIndex: number, subtopic: string) => {
    setProgress(prevProgress => {
      const newProgress = { ...prevProgress };
      if (!newProgress[pillar]) {
        newProgress[pillar] = 0;
      }

      const subtopicGroup = roadmapData[pillar]?.subtopics[subtopicGroupIndex];
      if (!subtopicGroup) return prevProgress;

      const completed = !completedSubtopics(pillar).has(subtopic);
      const subtopicsCount = subtopicGroup.subtopics.length;
      const change = completed ? 1 : -1;
      const progressChange = change / subtopicsCount * 100;

      // Calculate the overall progress change based on the specific subtopic group
      let totalSubtopics = 0;
      let completedSubtopicsCount = 0;

      roadmapData[pillar]?.subtopics.forEach(group => {
        totalSubtopics += group.subtopics.length;
        completedSubtopicsCount += group.subtopics.filter(subtopic => completedSubtopics(pillar).has(subtopic)).length;
      });
        
      if (completed) {
        completedSubtopicsCount++;
      } else {
        completedSubtopicsCount--;
      }
        
      newProgress[pillar] = (completedSubtopicsCount / totalSubtopics) * 100;
      newProgress[pillar] = Math.max(0, Math.min(100, newProgress[pillar]));
        
      localStorage.setItem('progress', JSON.stringify(newProgress));
      return newProgress;
    });
  
    if (completedSubtopics(pillar).size === getTotalSubtopics(pillar) && !allPillarsCompleted()) {
      incrementStreak();
    }
  };

  const getTotalSubtopics = (pillar: string): number => {
    let totalSubtopics = 0;
    roadmapData[pillar]?.subtopics?.forEach(group => {
      totalSubtopics += group.subtopics.length;
    });
    return totalSubtopics;
  };
  
  const incrementStreak = () => {
    setStreak(prevStreak => {
      const newStreak = prevStreak + 1;
      localStorage.setItem('streak', newStreak.toString());
      return newStreak;
    });
  };
  
  const allPillarsCompleted = () => {
    return Object.keys(roadmapData).every(pillar => progress[pillar] === 100);
  };

  const completedSubtopics = (pillar: string): Set<string> => {
    const completed = new Set<string>();
    const subtopicGroups = roadmapData[pillar]?.subtopics || [];
    subtopicGroups.forEach(group => {
      group.subtopics.forEach((subtopic: string, index: number) => {
        const totalSubtopics = getTotalSubtopics(pillar);
        const completedCount = Math.round((progress[pillar] || 0) / 100 * totalSubtopics);
        let currentCount = 0;
          
        roadmapData[pillar]?.subtopics.forEach(group => {
          group.subtopics.forEach((subtopic: string) => {
            if (currentCount < completedCount) {
              completed.add(subtopic);
            }
            currentCount++;
          });
        });
      });
    });
    return completed;
  };

  return (
    
      <Toaster />
      
        
          
            
              <Badge variant="secondary">Daily Streak: {streak} days</Badge>
            
          
        

        
          
            
              
                
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.imageUrl || "https://picsum.photos/48/48"} alt={user?.name || "Avatar"} />
                      <AvatarFallback>{user?.name?.charAt(0) || '?'}</AvatarFallback>
                    </Avatar>
                  </Button>
                
                
                  
                    
                      <p className="text-sm font-semibold leading-none">{user?.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {user?.email}
                      </p>
                    
                  
                  <DropdownMenuSeparator />
                  
                    Sign out
                  
                
              
            
          ) : (
            
              Sign In
            
          )}
        
      
      
      
        {Object.entries(roadmapData).map(([pillar, data]) => (
          
            
              
                <h2 className="text-xl font-semibold">{pillar}</h2>
                <Progress value={progress[pillar] || 0} className="mt-2" />
                <p className="text-sm text-muted-foreground mt-1">
                  {progress[pillar] ? progress[pillar]?.toFixed(1) : 0}% Complete
                </p>
              
              
                
                  
                    {data.title}
                  
                  
                    {isLoading ? (
                      
                        Loading subtopics...
                      
                    ) : (
                      
                        {data.subtopics?.map((subtopicGroup, groupIndex) => (
                          
                            
                              {subtopicGroup.title}
                              
                                {subtopicGroup.subtopics?.map(subtopic => (
                                  
                                    
                                      
                                        <input
                                          type="checkbox"
                                          checked={completedSubtopics(pillar).has(subtopic)}
                                          onChange={() => toggleSubtopic(pillar, groupIndex, subtopic)}
                                          className="mr-2"
                                        />
                                        {subtopic}
                                      
                                    
                                  
                                ))}
                              
                            
                          
                        ))}
                      
                    )}
                  
                
              
            
          
        ))}
      
    
  );
}
