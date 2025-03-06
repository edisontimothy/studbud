import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Maximize2, Minimize2 } from "lucide-react";
import * as Portal from '@radix-ui/react-portal';

export default function MusicPlayer() {
  const [isFloating, setIsFloating] = useState(false);

  const PlayerContent = () => (
    <div className={`space-y-4 ${isFloating ? 'p-4 bg-background border rounded-lg shadow-lg' : ''}`}>
      <div className="w-full aspect-video">
        <iframe
          width="100%"
          height="100%"
          src="https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=0"
          title="Study Music"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>

      <div className="flex justify-end">
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