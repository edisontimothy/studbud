import { createContext, useContext, useState, ReactNode } from 'react';

interface MusicContextType {
  isFloating: boolean;
  setIsFloating: (value: boolean) => void;
  isPlaying: boolean;
  setIsPlaying: (value: boolean) => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export function MusicProvider({ children }: { children: ReactNode }) {
  const [isFloating, setIsFloating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <MusicContext.Provider value={{ isFloating, setIsFloating, isPlaying, setIsPlaying }}>
      {children}
    </MusicContext.Provider>
  );
}

export function useMusicContext() {
  const context = useContext(MusicContext);
  if (context === undefined) {
    throw new Error('useMusicContext must be used within a MusicProvider');
  }
  return context;
}
