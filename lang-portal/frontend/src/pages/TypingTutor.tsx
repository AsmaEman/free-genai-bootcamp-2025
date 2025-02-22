
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";

interface Word {
  text: string;
  translation: string;
  typed: string;
  isCorrect: boolean;
}

const arabicWords = [
  { text: "مرحبا", translation: "Hello" },
  { text: "شكرا", translation: "Thank you" },
  { text: "كيف حالك", translation: "How are you" },
  { text: "أهلا وسهلا", translation: "Welcome" },
  { text: "مع السلامة", translation: "Goodbye" }
].map(word => ({ ...word, typed: "", isCorrect: false }));

const TypingTutor = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [words, setWords] = useState<Word[]>(arabicWords);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isGameStarted && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isGameStarted]);

  const startGame = () => {
    setIsGameStarted(true);
    setStartTime(new Date());
    setWords(arabicWords);
    setCurrentIndex(0);
    setWpm(0);
    setAccuracy(0);
  };

  const calculateStats = () => {
    if (!startTime) return;
    
    const endTime = new Date();
    const timeElapsed = (endTime.getTime() - startTime.getTime()) / 60000; // in minutes
    const totalCharacters = words.reduce((acc, word) => acc + word.text.length, 0);
    const correctCharacters = words.reduce((acc, word) => 
      acc + (word.isCorrect ? word.text.length : 0), 0);
    
    const newWpm = Math.round((totalCharacters / 5) / timeElapsed);
    const newAccuracy = Math.round((correctCharacters / totalCharacters) * 100);
    
    setWpm(newWpm);
    setAccuracy(newAccuracy);
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const newWords = [...words];
    newWords[currentIndex].typed = input;
    
    if (input === newWords[currentIndex].text) {
      newWords[currentIndex].isCorrect = true;
      if (currentIndex < words.length - 1) {
        setCurrentIndex(currentIndex + 1);
        e.target.value = "";
      } else {
        calculateStats();
        setIsGameStarted(false);
      }
    }
    
    setWords(newWords);
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    navigate("/auth");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={20} minSize={15} maxSize={25} className="bg-card border-r">
          <Sidebar onSignOut={handleSignOut} />
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={80}>
          <div className="h-full">
            <Header />
            <main className="p-6">
              <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Arabic Typing Tutor</h2>
                  <div className="flex gap-4">
                    <div className="text-sm">
                      <span className="font-bold">WPM:</span> {wpm}
                    </div>
                    <div className="text-sm">
                      <span className="font-bold">Accuracy:</span> {accuracy}%
                    </div>
                  </div>
                </div>

                {!isGameStarted ? (
                  <div className="text-center py-12">
                    <h3 className="text-xl mb-4">Ready to improve your Arabic typing?</h3>
                    <Button onClick={startGame}>Start Typing</Button>
                  </div>
                ) : (
                  <div className="space-y-8">
                    <div className="bg-card rounded-lg p-8">
                      <div className="flex flex-wrap gap-4 mb-6">
                        {words.map((word, index) => (
                          <div
                            key={index}
                            className={`text-2xl font-arabic ${
                              index === currentIndex
                                ? "bg-primary/20 p-2 rounded"
                                : word.isCorrect
                                ? "text-green-500"
                                : ""
                            }`}
                          >
                            {word.text}
                          </div>
                        ))}
                      </div>
                      
                      <input
                        ref={inputRef}
                        type="text"
                        onChange={handleInput}
                        className="w-full p-4 text-2xl bg-background border rounded-md font-arabic text-right"
                        dir="rtl"
                        placeholder="Type here..."
                      />
                    </div>

                    <div className="bg-card rounded-lg p-4">
                      <h4 className="font-bold mb-2">Current Word:</h4>
                      <p className="text-lg mb-1">{words[currentIndex].text}</p>
                      <p className="text-sm text-muted-foreground">
                        Translation: {words[currentIndex].translation}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </main>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default TypingTutor;
