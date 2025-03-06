import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2, VolumeX, Maximize2, Minimize2 } from "lucide-react";
import * as Portal from '@radix-ui/react-portal';

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isFloating, setIsFloating] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
      setVolume(newVolume);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const PlayerContent = () => (
    <div className={`space-y-4 ${isFloating ? 'p-4 bg-background border rounded-lg shadow-lg' : ''}`}>
      <div className="w-full aspect-video">
        <iframe
          width="100%"
          height="100%"
          src="https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1&controls=1"
          title="Study Music"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={toggleMute}
            className="h-8 w-8"
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>

          <Slider
            value={[isMuted ? 0 : volume]}
            max={1}
            step={0.01}
            onValueChange={handleVolumeChange}
            className="w-[100px]"
          />
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsFloating(!isFloating)}
          className="flex items-center gap-2"
        >
          {isFloating ? (
            <>
              <Minimize2 className="h-4 w-4" />
              <span>Dock Player</span>
            </>
          ) : (
            <>
              <Maximize2 className="h-4 w-4" />
              <span>Float Player</span>
            </>
          )}
        </Button>
      </div>

      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
        className="hidden"
      >
        Your browser does not support the audio element.
      </audio>
    </div>
  );

  if (isFloating) {
    return (
      <Portal.Root>
        <div className="fixed bottom-4 right-4 z-50 w-80">
          <PlayerContent />
        </div>
      </Portal.Root>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <PlayerContent />
      </CardContent>
    </Card>
  );
}