import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Maximize2, Minimize2, Play, Pause } from "lucide-react";
import * as Portal from '@radix-ui/react-portal';
import { useMusicContext } from "@/lib/music-context";

export default function MusicPlayer() {
  const { isFloating, setIsFloating, isPlaying, setIsPlaying } = useMusicContext();
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

  const PlayerContent = () => (
    <div className={`space-y-4 ${isFloating ? 'p-4 bg-background border rounded-lg shadow-lg' : ''}`}>
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

      <div className="flex justify-between items-center">
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
    </div>
  );

  if (isFloating) {
    return (
      <Portal.Root>
        <div className="fixed bottom-4 right-4 z-[9999] w-80">
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