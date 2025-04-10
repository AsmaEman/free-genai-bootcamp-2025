
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Volume2, CheckCircle, XCircle, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import type { Database } from "@/integrations/supabase/types";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

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
  const [showHint, setShowHint] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionMode, setSessionMode] = useState<'arabic-to-english' | 'english-to-arabic'>('arabic-to-english');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [categories, setCategories] = useState<{id: string, name: string}[]>([]);
  const [sessionStarted, setSessionStarted] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    
    // Fetch categories
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('id, name')
          .order('name');
        
        if (error) throw error;
        setCategories(data || []);
      } catch (error: any) {
        toast({
          title: "Error fetching categories",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCategories();
  }, [user, navigate, toast]);

  const startSession = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('vocabulary')
        .select('*');
      
      // Apply category filter if selected
      if (selectedCategoryId) {
        query = query.eq('category_id', selectedCategoryId);
      }
      
      const { data, error } = await query
        .order('difficulty_level')
        .limit(20); // Limit to 20 words per session
      
      if (error) throw error;
      
      if (!data || data.length === 0) {
        toast({
          title: "No vocabulary available",
          description: "There are no words available for study in the selected category.",
          variant: "default",
        });
        return;
      }
      
      // Shuffle the words for randomized study
      const shuffledWords = [...data].sort(() => Math.random() - 0.5);
      setWords(shuffledWords);
      setSessionStarted(true);
      setSessionStats({
        correctAnswers: 0,
        incorrectAnswers: 0,
        startTime: new Date(),
      });
      setCurrentWordIndex(0);
      setShowTranslation(false);
      setShowHint(false);
    } catch (error: any) {
      toast({
        title: "Error starting session",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
    setShowHint(false);
    if (currentWordIndex < words.length - 1) {
      setCurrentWordIndex(prev => prev + 1);
    } else {
      endSession();
    }
  };

  const handlePlayAudio = (audioUrl: string | null) => {
    if (!audioUrl) {
      toast({
        title: "Audio unavailable",
        description: "This word doesn't have audio pronunciation available.",
        variant: "default",
      });
      return;
    }
    
    const audio = new Audio(audioUrl);
    audio.play().catch(error => {
      toast({
        title: "Audio playback failed",
        description: "Unable to play the pronunciation audio.",
        variant: "destructive",
      });
    });
  };

  const endSession = async () => {
    const duration = Math.floor(
      (new Date().getTime() - sessionStats.startTime.getTime()) / 1000
    );

    try {
      const totalWords = sessionStats.correctAnswers + sessionStats.incorrectAnswers;
      const accuracy = totalWords > 0 ? Math.round((sessionStats.correctAnswers / totalWords) * 100) : 0;
      
      const sessionData = {
        duration,
        wordsStudied: words.map(w => w.id),
        correctAnswers: sessionStats.correctAnswers,
        incorrectAnswers: sessionStats.incorrectAnswers,
        accuracy: accuracy,
        mode: sessionMode
      };

      const { error } = await supabase
        .from('study_sessions')
        .insert({
          user_id: user?.id,
          session_data: sessionData,
          status: 'completed',
          words_studied: totalWords,
          correct_answers: sessionStats.correctAnswers
        });

      if (error) throw error;

      toast({
        title: "Study session completed!",
        description: `Great job! You got ${sessionStats.correctAnswers} words right out of ${totalWords} (${accuracy}% accuracy).`,
      });

      // Reset session
      setSessionStarted(false);
      setWords([]);
    } catch (error: any) {
      toast({
        title: "Error saving session",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        Please log in to access study sessions.
      </div>
    );
  }

  const currentWord = words[currentWordIndex];
  const sessionProgress = words.length > 0 ? ((currentWordIndex + 1) / words.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/vocabulary')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">Study Session</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {!sessionStarted ? (
          <div className="max-w-2xl mx-auto">
            <Card className="p-8">
              <h2 className="text-xl font-bold mb-6">Configure Your Study Session</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-md font-medium mb-2">Study Direction</h3>
                  <div className="flex gap-2">
                    <Button 
                      variant={sessionMode === 'arabic-to-english' ? 'default' : 'outline'}
                      onClick={() => setSessionMode('arabic-to-english')}
                      className="flex-1"
                    >
                      Arabic → English
                    </Button>
                    <Button 
                      variant={sessionMode === 'english-to-arabic' ? 'default' : 'outline'}
                      onClick={() => setSessionMode('english-to-arabic')}
                      className="flex-1"
                    >
                      English → Arabic
                    </Button>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-md font-medium mb-2">Category</h3>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={selectedCategoryId === null ? 'default' : 'outline'}
                      onClick={() => setSelectedCategoryId(null)}
                    >
                      All Categories
                    </Button>
                    {categories.map(category => (
                      <Button
                        key={category.id}
                        variant={selectedCategoryId === category.id ? 'default' : 'outline'}
                        onClick={() => setSelectedCategoryId(category.id)}
                      >
                        {category.name}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <Button 
                  onClick={startSession} 
                  disabled={isLoading} 
                  className="w-full mt-6"
                  size="lg"
                >
                  {isLoading ? 'Loading...' : 'Start Study Session'}
                </Button>
              </div>
            </Card>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            {/* Progress */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-muted-foreground mb-2">
                <span>Word {currentWordIndex + 1} of {words.length}</span>
                <span>
                  Correct: {sessionStats.correctAnswers} | Incorrect: {sessionStats.incorrectAnswers}
                </span>
              </div>
              <Progress value={sessionProgress} className="h-2" />
            </div>

            {/* Word Card */}
            {currentWord && (
              <Card className="p-8 rounded-lg bg-card border text-center mb-8">
                <div className="flex justify-end mb-2">
                  {currentWord.difficulty_level && (
                    <Badge variant="outline">Level {currentWord.difficulty_level}</Badge>
                  )}
                </div>
                
                {sessionMode === 'arabic-to-english' ? (
                  <>
                    <p className="text-4xl font-bold mb-4 text-right font-arabic">{currentWord.arabic_word}</p>
                    
                    {currentWord.transliteration && !showTranslation && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="mb-2"
                        onClick={() => setShowHint(!showHint)}
                      >
                        {showHint ? <EyeOff className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
                        {showHint ? "Hide Pronunciation" : "Show Pronunciation"}
                      </Button>
                    )}
                    
                    {showHint && currentWord.transliteration && (
                      <p className="text-lg text-muted-foreground mb-4">{currentWord.transliteration}</p>
                    )}
                    
                    {currentWord.audio_url && (
                      <Button
                        variant="outline"
                        className="mb-4"
                        onClick={() => handlePlayAudio(currentWord.audio_url)}
                      >
                        <Volume2 className="mr-2 h-4 w-4" />
                        Play Pronunciation
                      </Button>
                    )}
                    
                    {showTranslation ? (
                      <div className="mt-4 p-4 bg-muted rounded-lg">
                        <p className="text-2xl">{currentWord.english_translation}</p>
                        {currentWord.example_sentence && (
                          <div className="mt-4 text-muted-foreground">
                            <p className="text-sm mb-1">Example:</p>
                            <p className="text-right font-arabic">{currentWord.example_sentence}</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <Button variant="ghost" onClick={() => setShowTranslation(true)} className="mt-2">
                        Show Translation
                      </Button>
                    )}
                  </>
                ) : (
                  // English to Arabic mode
                  <>
                    <p className="text-3xl font-bold mb-6">{currentWord.english_translation}</p>
                    
                    {showTranslation ? (
                      <div className="mt-4">
                        <p className="text-4xl font-arabic mb-2">{currentWord.arabic_word}</p>
                        {currentWord.transliteration && (
                          <p className="text-lg text-muted-foreground mb-4">{currentWord.transliteration}</p>
                        )}
                        {currentWord.example_sentence && (
                          <div className="mt-4 text-muted-foreground">
                            <p className="text-sm mb-1">Example:</p>
                            <p className="text-right font-arabic">{currentWord.example_sentence}</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <Button variant="ghost" onClick={() => setShowTranslation(true)}>
                        Show Answer
                      </Button>
                    )}
                    
                    {currentWord.audio_url && showTranslation && (
                      <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() => handlePlayAudio(currentWord.audio_url)}
                      >
                        <Volume2 className="mr-2 h-4 w-4" />
                        Play Pronunciation
                      </Button>
                    )}
                  </>
                )}
              </Card>
            )}

            {/* Actions */}
            <div className="flex gap-4 justify-center">
              <Button
                variant="outline"
                size="lg"
                className="w-32 flex items-center"
                onClick={handleDontKnowWord}
              >
                <XCircle className="mr-2 h-5 w-5 text-destructive" />
                Don't Know
              </Button>
              
              <Button
                size="lg"
                className="w-32 flex items-center"
                onClick={handleKnowWord}
              >
                <CheckCircle className="mr-2 h-5 w-5" />
                Know It
              </Button>
            </div>

            {/* Skip button */}
            <div className="flex justify-center mt-4">
              <Button variant="ghost" size="sm" onClick={nextWord}>
                Skip <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default StudySession;
