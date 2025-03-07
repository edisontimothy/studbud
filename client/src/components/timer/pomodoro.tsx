import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Pause, RotateCcw } from "lucide-react";

export default function PomodoroTimer() {
  const [workTime, setWorkTime] = useState(25);
  const [breakTime, setBreakTime] = useState(5);
  const [seconds, setSeconds] = useState(workTime * 60);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds(seconds => seconds - 1);
      }, 1000);
    } else if (seconds === 0) {
      if (isBreak) {
        setSeconds(workTime * 60);
        setIsBreak(false);
      } else {
        setSeconds(breakTime * 60);
        setIsBreak(true);
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, seconds, workTime, breakTime, isBreak]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setSeconds(workTime * 60);
    setIsBreak(false);
  };

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <div className="flex justify-center text-6xl font-mono">
          {formatTime(seconds)}
        </div>

        <div className="flex justify-center gap-2">
          <Button onClick={toggleTimer}>
            {isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {isActive ? 'Pause' : 'Start'}
          </Button>
          <Button variant="outline" onClick={resetTimer}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm">Work Time (minutes)</label>
            <Input
              type="number"
              value={workTime}
              onChange={e => setWorkTime(parseInt(e.target.value))}
              min="1"
              disabled={isActive}
            />
          </div>
          <div>
            <label className="text-sm">Break Time (minutes)</label>
            <Input
              type="number"
              value={breakTime}
              onChange={e => setBreakTime(parseInt(e.target.value))}
              min="1"
              disabled={isActive}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
