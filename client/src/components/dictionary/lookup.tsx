import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DictionaryEntry {
  word: string;
  phonetic: string;
  meanings: Array<{
    partOfSpeech: string;
    definitions: Array<{
      definition: string;
      example?: string;
    }>;
  }>;
  phonetics: Array<{
    text: string;
    audio?: string;
  }>;
}

export default function DictionaryLookup() {
  const [word, setWord] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DictionaryEntry | null>(null);
  const { toast } = useToast();

  const lookupWord = async () => {
    if (!word.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word.trim())}`
      );
      
      if (!response.ok) {
        throw new Error("Word not found");
      }

      const data = await response.json();
      setResult(data[0]);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to look up word",
        variant: "destructive",
      });
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    lookupWord();
  };

  return (
    <Card>
      <CardContent className="pt-6 space-y-6">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={word}
            onChange={(e) => setWord(e.target.value)}
            placeholder="Enter a word to look up"
            className="flex-1"
          />
          <Button type="submit" disabled={loading}>
            <Search className="h-4 w-4 mr-2" />
            Look up
          </Button>
        </form>

        {result && (
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold">{result.word}</h2>
              {result.phonetic && (
                <p className="text-muted-foreground">{result.phonetic}</p>
              )}
            </div>

            {result.meanings.map((meaning, index) => (
              <div key={index} className="space-y-2">
                <h3 className="font-semibold text-primary">
                  {meaning.partOfSpeech}
                </h3>
                <ul className="list-disc list-inside space-y-2">
                  {meaning.definitions.map((def, defIndex) => (
                    <li key={defIndex} className="space-y-1">
                      <span>{def.definition}</span>
                      {def.example && (
                        <p className="italic text-muted-foreground ml-4">
                          Example: {def.example}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {result.phonetics.some(p => p.audio) && (
              <div className="space-y-2">
                <h3 className="font-semibold">Pronunciations</h3>
                <div className="flex flex-wrap gap-2">
                  {result.phonetics
                    .filter(p => p.audio)
                    .map((phonetic, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        onClick={() => new Audio(phonetic.audio).play()}
                      >
                        Listen {phonetic.text ? `(${phonetic.text})` : ''}
                      </Button>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
