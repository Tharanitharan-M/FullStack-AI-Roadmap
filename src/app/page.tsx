
"use client";

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { generateSubtopics } from "@/ai/flows/generate-subtopics";
import { generateExplanation } from "@/ai/flows/generate-explanation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Toaster } from "@/components/ui/toaster";

const LearningPillars = [
  "Frontend Development",
  "Backend Development",
  "AI Agents",
  "Cloud Computing",
  "Databases",
];

export default function Home() {
  const [subtopics, setSubtopics] = useState<{ [key: string]: string[] }>({});
  const [explanations, setExplanations] = useState<{ [key: string]: { [key: string]: string } }>({});
  const [progress, setProgress] = useState<{ [key: string]: number }>({});
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    // Load initial progress from local storage
    const storedProgress = localStorage.getItem('progress');
    if (storedProgress) {
      setProgress(JSON.parse(storedProgress));
    }

    // Load initial streak from local storage
    const storedStreak = localStorage.getItem('streak');
    if (storedStreak) {
      setStreak(parseInt(storedStreak));
    }

    const generateAllSubtopics = async () => {
      let allSubtopics: { [key: string]: string[] } = {};
      for (const pillar of LearningPillars) {
        const subtopicsData = await generateSubtopics({ learningPillar: pillar });
        allSubtopics[pillar] = subtopicsData.subtopics;
      }
      setSubtopics(allSubtopics);
    };

    generateAllSubtopics();
  }, []);

  useEffect(() => {
    const generateAllExplanations = async () => {
      let allExplanations: { [key: string]: { [key: string]: string } } = {};
      for (const pillar of LearningPillars) {
        allExplanations[pillar] = {};
        if (subtopics[pillar]) {
          for (const subtopic of subtopics[pillar]) {
            const explanationData = await generateExplanation({ subtopic: subtopic });
            allExplanations[pillar][subtopic] = explanationData.explanation;
          }
        }
      }
      setExplanations(allExplanations);
    };

    if (Object.keys(subtopics).length > 0) {
      generateAllExplanations();
    }
  }, [subtopics]);

  const toggleSubtopic = (pillar: string, subtopic: string) => {
    setProgress(prevProgress => {
      const newProgress = { ...prevProgress };
      if (!newProgress[pillar]) {
        newProgress[pillar] = 0;
      }
      const completed = !(completedSubtopics(pillar).has(subtopic));
      const subtopicsCount = subtopics[pillar]?.length || 0;
      const change = completed ? 1 : -1;
      newProgress[pillar] += change / subtopicsCount * 100;
      newProgress[pillar] = Math.max(0, Math.min(100, newProgress[pillar]));
  
      // Save to local storage
      localStorage.setItem('progress', JSON.stringify(newProgress));
      return newProgress;
    });
  
    // Increment streak if all subtopics are completed
    if (completedSubtopics(pillar).size === subtopics[pillar]?.length && !allPillarsCompleted()) {
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
    if (subtopics[pillar]) {
      const subtopicsCount = subtopics[pillar]?.length || 0;
      const subtopicProgress = progress[pillar] || 0;
      const completedCount = Math.round(subtopicProgress / 100 * subtopicsCount);
      for (let i = 0; i < completedCount; i++) {
        completed.add(subtopics[pillar][i]);
      }
    }
    return completed;
  };

  return (
    <div className="container mx-auto py-10">
        <Toaster />
      <h1 className="text-3xl font-bold mb-6 text-center">FullStackAI Roadmap</h1>
      <div className="flex justify-between items-center mb-4">
        <div>
          <Badge variant="secondary">Daily Streak: {streak} days</Badge>
        </div>
        <div>
            <Input type="text" placeholder="Search subtopics..." className="max-w-sm" />
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
              <Accordion type="single" collapsible>
                <AccordionItem value={pillar}>
                  <AccordionTrigger>Subtopics</AccordionTrigger>
                  <AccordionContent>
                    {subtopics[pillar]?.map(subtopic => (
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
                          onClick={() => alert(explanations[pillar]?.[subtopic] || 'Explanation not available.')}
                        >
                          Why?
                        </Button>
                      </div>
                    ))}
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
