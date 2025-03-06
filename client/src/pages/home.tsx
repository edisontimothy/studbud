import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import KanbanBoard from "@/components/kanban/board";
import PomodoroTimer from "@/components/timer/pomodoro";
import StopwatchTimer from "@/components/timer/stopwatch";
import MusicPlayer from "@/components/music/player";
import ReadingList from "@/components/reading/list";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-primary">StudBud</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="tasks" className="space-y-4">
          <TabsList>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="timer">Timer</TabsTrigger>
            <TabsTrigger value="music">Music</TabsTrigger>
            <TabsTrigger value="reading">Reading List</TabsTrigger>
          </TabsList>

          <TabsContent value="tasks">
            <KanbanBoard />
          </TabsContent>

          <TabsContent value="timer" className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold mb-4">Pomodoro Timer</h2>
              <PomodoroTimer />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-4">Stopwatch</h2>
              <StopwatchTimer />
            </div>
          </TabsContent>

          <TabsContent value="music">
            <MusicPlayer />
          </TabsContent>

          <TabsContent value="reading">
            <ReadingList />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
