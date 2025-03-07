import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/ui/section-header";
import KanbanBoard from "@/components/kanban/board";
import PomodoroTimer from "@/components/timer/pomodoro";
import StopwatchTimer from "@/components/timer/stopwatch";
import MusicPlayer from "@/components/music/player";
import ReadingList from "@/components/reading/list";
import DictionaryLookup from "@/components/dictionary/lookup";
import { Clock, Layout, Music, BookOpen, Book, ChevronDown, ChevronRight } from "lucide-react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";

function WelcomeSection() {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2">
        <h1 className="text-3xl font-bold text-primary">Welcome to StudBud</h1>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="h-8 w-8 p-0"
        >
          {isExpanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
      </div>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="mt-4 text-muted-foreground">
              StudBud is your all-in-one study companion designed to enhance your learning experience.
              Our comprehensive suite of tools includes:
            </p>
            <ul className="mt-2 list-disc list-inside space-y-2 text-muted-foreground">
              <li>A Kanban board for organizing and tracking your tasks</li>
              <li>Pomodoro and stopwatch timers to manage your study sessions</li>
              <li>Built-in study music player that stays with you across tabs</li>
              <li>Reading list manager to organize your study materials</li>
              <li>Quick dictionary lookup for expanding your vocabulary</li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Dashboard() {
  const features = [
    {
      title: "Task Management",
      description: "Organize your tasks with a Kanban board",
      icon: Layout,
      href: "/?tab=tasks"
    },
    {
      title: "Timer",
      description: "Track your study sessions with Pomodoro and Stopwatch",
      icon: Clock,
      href: "/?tab=timer"
    },
    {
      title: "Study Music",
      description: "Listen to focus-enhancing music while you study",
      icon: Music,
      href: "/?tab=music"
    },
    {
      title: "Reading List",
      description: "Save and organize your study materials",
      icon: BookOpen,
      href: "/?tab=reading"
    },
    {
      title: "Dictionary",
      description: "Look up word definitions quickly",
      icon: Book,
      href: "/?tab=dictionary"
    }
  ];

  return (
    <div className="space-y-8">
      <WelcomeSection />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {features.map((feature) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Card>
              <CardContent className="pt-6">
                <Link href={feature.href}>
                  <Button
                    variant="ghost"
                    className="w-full h-full text-left flex items-start gap-4 p-4"
                  >
                    <feature.icon className="h-6 w-6 shrink-0 text-primary" />
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-ellipsis overflow-hidden">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1 whitespace-normal">
                        {feature.description}
                      </p>
                    </div>
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const searchParams = new URLSearchParams(window.location.search);
  const defaultTab = searchParams.get('tab') || 'dashboard';

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container max-w-7xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-primary">StudBud</h1>
          <p className="text-muted-foreground mt-1">
            Your all-in-one study companion
          </p>
        </div>
      </header>

      <main className="container max-w-7xl mx-auto px-6 py-8">
        <Tabs defaultValue={defaultTab} className="space-y-8">
          <TabsList className="mb-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="timer">Timer</TabsTrigger>
            <TabsTrigger value="music">Music</TabsTrigger>
            <TabsTrigger value="reading">Reading List</TabsTrigger>
            <TabsTrigger value="dictionary">Dictionary</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <Dashboard />
          </TabsContent>

          <TabsContent value="tasks">
            <SectionHeader
              title="Task Management"
              description="Organize and track your tasks using a Kanban board. Create columns to represent different stages of your work, add tasks with details like due dates and priority levels, and easily drag and drop them between columns as you make progress."
            />
            <div className="mt-6">
              <KanbanBoard />
            </div>
          </TabsContent>

          <TabsContent value="timer" className="space-y-8">
            <div>
              <SectionHeader
                title="Pomodoro Timer"
                description="Stay focused with the Pomodoro Technique. Work for 25 minutes, then take a 5-minute break. After 4 cycles, take a longer 30-minute break. Customize the intervals to match your study style."
              />
              <div className="mt-6">
                <PomodoroTimer />
              </div>
            </div>
            <div>
              <SectionHeader
                title="Stopwatch"
                description="Track the time spent on your tasks with a simple stopwatch. Start, pause, and reset as needed to monitor your study sessions."
              />
              <div className="mt-6">
                <StopwatchTimer />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="music">
            <SectionHeader
              title="Study Music"
              description="Listen to focus-enhancing music while you study. Toggle the floating player to keep the music playing as you navigate between different sections of StudBud or other tabs."
            />
            <div className="mt-6">
              <MusicPlayer />
            </div>
          </TabsContent>

          <TabsContent value="reading">
            <SectionHeader
              title="Reading List"
              description="Save and organize your study materials, articles, and resources. Create groups to categorize related materials and open multiple links at once when you're ready to study."
            />
            <div className="mt-6">
              <ReadingList />
            </div>
          </TabsContent>

          <TabsContent value="dictionary">
            <SectionHeader
              title="Dictionary"
              description="Quick access to word definitions. Look up unfamiliar terms while studying to enhance your understanding and vocabulary."
            />
            <div className="mt-6">
              <DictionaryLookup />
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}