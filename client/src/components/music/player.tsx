import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause } from "lucide-react";

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const playerRef = useRef<HTMLIFrameElement>(null);

  const togglePlay = () => {
    if (playerRef.current) {
      setIsPlaying(!isPlaying);
      const message = isPlaying ? 'pauseVideo' : 'playVideo';
      playerRef.current.contentWindow?.postMessage(
        JSON.stringify({ event: 'command', func: message }), 
        '*'
      );
    }
  };

  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <div className="w-full aspect-video">
          <iframe
            ref={playerRef}
            width="100%"
            height="100%"
            src="https://www.youtube.com/embed/jfKfPfyJRdk?enablejsapi=1&playsinline=1&controls=1"
            title="Study Music"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={togglePlay}
          className="flex items-center gap-2"
        >
          {isPlaying ? (
            <>
              <Pause className="h-4 w-4" />
              <span>Pause</span>
            </>
          ) : (
            <>
              <Play className="h-4 w-4" />
              <span>Play</span>
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}