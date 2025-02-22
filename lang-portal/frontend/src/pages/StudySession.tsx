
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import type { Database } from "@/integrations/supabase/types";

type Vocabulary = Database['public']['Tables']['vocabulary']['Row'];

const StudySession = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [words, setWords] = useState<Vocabulary[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [sessionStats, setSessionStats] = useState({
    correctAnswers: 0,
    incorrectAnswers: 0,
    startTime: new Date(),
  });
  const [showTranslation, setShowTranslation] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchWords = async () => {
      try {
        const { data, error } = await supabase
          .from('vocabulary')
          .select('*')
          .order('created_at');
        
        if (error) throw error;
        setWords(data);
      } catch (error: any) {
        toast({
          title: "Error fetching vocabulary",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchWords();
    }
  }, [user, toast]);

  const handleKnowWord = async () => {
    setSessionStats(prev => ({
      ...prev,
      correctAnswers: prev.correctAnswers + 1,
    }));
    nextWord();
  };

  const handleDontKnowWord = async () => {
    setSessionStats(prev => ({
      ...prev,
      incorrectAnswers: prev.incorrectAnswers + 1,
    }));
    nextWord();
  };

  const nextWord = () => {
    setShowTranslation(false);
    if (currentWordIndex < words.length - 1) {
      setCurrentWordIndex(prev => prev + 1);
    } else {
      endSession();
    }
  };

  const endSession = async () => {
    const duration = Math.floor(
      (new Date().getTime() - sessionStats.startTime.getTime()) / 1000
    );

    try {
      const sessionData = {
        duration,
        wordsStudied: words.map(w => w.id),
        correctAnswers: sessionStats.correctAnswers,
        incorrectAnswers: sessionStats.incorrectAnswers,
      };

      const { error } = await supabase
        .from('study_sessions')
        .insert({
          user_id: user?.id,
          session_data: sessionData,
          status: 'completed'
        });

      if (error) throw error;

      toast({
        title: "Study session completed!",
        description: `You got ${sessionStats.correctAnswers} words right out of ${sessionStats.correctAnswers + sessionStats.incorrectAnswers}!`,
      });

      navigate('/');
    } catch (error: any) {
      toast({
        title: "Error saving session",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (!user || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        Loading...
      </div>
    );
  }

  const currentWord = words[currentWordIndex];

  if (!currentWord) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        No words available
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">Study Session</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Progress */}
          <div className="mb-8">
            <p className="text-sm text-muted-foreground">
              Word {currentWordIndex + 1} of {words.length}
            </p>
          </div>

          {/* Word Card */}
          <div className="p-8 rounded-lg bg-card border text-center mb-8">
            <p className="text-4xl font-bold mb-4 text-right">{currentWord.arabic_word}</p>
            {currentWord.transliteration && (
              <p className="text-lg text-muted-foreground mb-4">{currentWord.transliteration}</p>
            )}
            {showTranslation ? (
              <p className="text-2xl">{currentWord.english_translation}</p>
            ) : (
              <Button variant="outline" onClick={() => setShowTranslation(true)}>
                Show Translation
              </Button>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-4 justify-center">
            <Button
              variant="outline"
              className="w-32"
              onClick={handleDontKnowWord}
            >
              Don't Know
            </Button>
            <Button
              className="w-32"
              onClick={handleKnowWord}
            >
              Know It
            </Button>
          </div>

          {/* Session Stats */}
          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>Correct: {sessionStats.correctAnswers}</p>
            <p>Incorrect: {sessionStats.incorrectAnswers}</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudySession;
