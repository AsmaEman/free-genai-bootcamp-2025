
import { useState, useRef } from "react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Check, X, Pencil, ChevronsRight, RotateCcw, Volume2, AlertCircle } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

// Alphabet data
const arabicAlphabet = [
  { letter: "ا", name: "Alif", transliteration: "a", example: "أَسَد (asad - lion)" },
  { letter: "ب", name: "Ba", transliteration: "b", example: "بَاب (bāb - door)" },
  { letter: "ت", name: "Ta", transliteration: "t", example: "تَمر (tamr - dates)" },
  { letter: "ث", name: "Tha", transliteration: "th", example: "ثَلاثَة (thalātha - three)" },
  { letter: "ج", name: "Jim", transliteration: "j", example: "جَمَل (jamal - camel)" },
  { letter: "ح", name: "Ha", transliteration: "ḥ", example: "حُبّ (ḥubb - love)" },
  { letter: "خ", name: "Kha", transliteration: "kh", example: "خُبز (khubz - bread)" },
  { letter: "د", name: "Dal", transliteration: "d", example: "دَرس (dars - lesson)" },
  { letter: "ذ", name: "Dhal", transliteration: "dh", example: "ذَهَب (dhahab - gold)" },
  { letter: "ر", name: "Ra", transliteration: "r", example: "رَجُل (rajul - man)" },
  { letter: "ز", name: "Zay", transliteration: "z", example: "زَيت (zayt - oil)" },
  { letter: "س", name: "Sin", transliteration: "s", example: "سَلام (salām - peace)" },
  { letter: "ش", name: "Shin", transliteration: "sh", example: "شَمس (shams - sun)" },
  { letter: "ص", name: "Sad", transliteration: "ṣ", example: "صَباح (ṣabāḥ - morning)" },
  { letter: "ض", name: "Dad", transliteration: "ḍ", example: "ضَوء (ḍaw' - light)" },
  { letter: "ط", name: "Ta", transliteration: "ṭ", example: "طَالِب (ṭālib - student)" },
  { letter: "ظ", name: "Zha", transliteration: "ẓ", example: "ظَلام (ẓalām - darkness)" },
  { letter: "ع", name: "Ain", transliteration: "'", example: "عَين ('ayn - eye)" },
  { letter: "غ", name: "Ghain", transliteration: "gh", example: "غَريب (gharīb - strange)" },
  { letter: "ف", name: "Fa", transliteration: "f", example: "فِيل (fīl - elephant)" },
  { letter: "ق", name: "Qaf", transliteration: "q", example: "قَلَم (qalam - pen)" },
  { letter: "ك", name: "Kaf", transliteration: "k", example: "كِتَاب (kitāb - book)" },
  { letter: "ل", name: "Lam", transliteration: "l", example: "لَيل (layl - night)" },
  { letter: "م", name: "Mim", transliteration: "m", example: "مَاء (mā' - water)" },
  { letter: "ن", name: "Nun", transliteration: "n", example: "نُور (nūr - light)" },
  { letter: "ه", name: "Ha", transliteration: "h", example: "هَدِيَّة (hadiyya - gift)" },
  { letter: "و", name: "Waw", transliteration: "w/u/ū", example: "وَرد (ward - rose)" },
  { letter: "ي", name: "Ya", transliteration: "y/i/ī", example: "يَد (yad - hand)" },
];

// Practice prompts
const writingPrompts = [
  { prompt: "صف يومك", translation: "Describe your day", difficulty: "Beginner" },
  { prompt: "ما هي هواياتك المفضلة؟", translation: "What are your favorite hobbies?", difficulty: "Beginner" },
  { prompt: "اكتب عن طعامك المفضل", translation: "Write about your favorite food", difficulty: "Beginner" },
  { prompt: "صف مدينتك", translation: "Describe your city", difficulty: "Intermediate" },
  { prompt: "ما هي أهدافك المستقبلية؟", translation: "What are your future goals?", difficulty: "Intermediate" },
  { prompt: "اكتب قصة قصيرة عن مغامرة", translation: "Write a short story about an adventure", difficulty: "Advanced" },
  { prompt: "ناقش قضية اجتماعية تهمك", translation: "Discuss a social issue that concerns you", difficulty: "Advanced" },
];

// Form schema for alphabet practice
const alphabetFormSchema = z.object({
  writtenLetter: z.string().min(1, { message: "Please write the letter" }),
});

const Writing = () => {
  const [text, setText] = useState("");
  const [selectedTab, setSelectedTab] = useState("freewriting");
  const [selectedLetter, setSelectedLetter] = useState(arabicAlphabet[0]);
  const [letterResult, setLetterResult] = useState<null | { correct: boolean; message: string }>(null);
  const [selectedPrompt, setSelectedPrompt] = useState(writingPrompts[0]);
  const [evaluationResult, setEvaluationResult] = useState<null | { score: number; feedback: string[] }>(null);
  const [showEvaluationDialog, setShowEvaluationDialog] = useState(false);
  const [showLetterDialog, setShowLetterDialog] = useState(false);
  const [canvasCtx, setCanvasCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const alphabetForm = useForm<z.infer<typeof alphabetFormSchema>>({
    resolver: zodResolver(alphabetFormSchema),
    defaultValues: {
      writtenLetter: "",
    },
  });

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    navigate("/auth");
  };

  const handleFreeWritingSubmit = async () => {
    if (text.trim().length === 0) {
      toast({
        title: "Empty submission",
        description: "Please write something before submitting.",
        variant: "destructive",
      });
      return;
    }

    // Simulate an evaluation (in a real app, this would send to a backend API)
    const wordCount = text.trim().split(/\s+/).length;
    const minScore = 60;
    const maxScore = 95;
    const score = Math.min(maxScore, Math.max(minScore, Math.floor(wordCount * 3 + Math.random() * 20)));
    
    const feedback = [];
    
    if (wordCount < 5) {
      feedback.push("Try to write more to practice your Arabic writing skills.");
    } else {
      feedback.push("Good job on writing a substantial amount of text!");
    }
    
    if (score < 75) {
      feedback.push("Focus on improving your letter connections and word spacing.");
    } else if (score < 85) {
      feedback.push("Your writing is good. Work on consistent letter sizing.");
    } else {
      feedback.push("Excellent writing! Your Arabic script is well-formed.");
    }
    
    // Additional random feedback
    const additionalFeedback = [
      "Practice diacritical marks (tashkeel) for better pronunciation guidance.",
      "Remember to connect appropriate letters in Arabic script.",
      "Your handwriting is improving with practice!",
      "Work on maintaining consistent letter height.",
    ];
    
    feedback.push(additionalFeedback[Math.floor(Math.random() * additionalFeedback.length)]);
    
    setEvaluationResult({ score, feedback });
    setShowEvaluationDialog(true);
    
    toast({
      title: "Writing submitted",
      description: "Your writing has been evaluated.",
    });
  };

  const handlePromptSelect = (prompt: typeof writingPrompts[0]) => {
    setSelectedPrompt(prompt);
  };

  const handleLetterSelect = (letter: typeof arabicAlphabet[0]) => {
    setSelectedLetter(letter);
    resetCanvas();
    setLetterResult(null);
  };

  const initializeCanvas = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      // Set canvas to be square
      canvas.width = 300;
      canvas.height = 300;
      
      if (ctx) {
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 8;
        setCanvasCtx(ctx);
      }
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!canvasCtx) return;
    
    setIsDrawing(true);
    
    // Get position based on event type
    const position = getEventPosition(e);
    if (!position) return;
    
    canvasCtx.beginPath();
    canvasCtx.moveTo(position.x, position.y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasCtx) return;
    
    // Prevent scrolling when drawing
    e.preventDefault();
    
    // Get position based on event type
    const position = getEventPosition(e);
    if (!position) return;
    
    canvasCtx.lineTo(position.x, position.y);
    canvasCtx.stroke();
  };

  const stopDrawing = () => {
    if (!canvasCtx) return;
    
    setIsDrawing(false);
    canvasCtx.closePath();
  };

  const getEventPosition = (event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return null;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    if ('touches' in event) {
      // Touch event
      const touch = event.touches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
      };
    } else {
      // Mouse event
      return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
      };
    }
  };

  const resetCanvas = () => {
    if (canvasCtx && canvasRef.current) {
      canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  const evaluateDrawing = () => {
    // In a real app, this would send the canvas image to a backend API for OCR
    // For now, simulate with random result biased toward success
    const success = Math.random() > 0.3; // 70% chance of success
    
    if (success) {
      setLetterResult({
        correct: true,
        message: "Good job! Your letter looks correct."
      });
    } else {
      setLetterResult({
        correct: false,
        message: "Try again. Focus on the shape and proportions of the letter."
      });
    }
    setShowLetterDialog(true);
  };

  const playLetterSound = () => {
    // In a real app, this would play an audio file
    toast({
      title: "Audio played",
      description: `Sound for the letter ${selectedLetter.letter} (${selectedLetter.name})`,
    });
  };

  // Initialize canvas when component mounts or tab changes
  const handleTabChange = (value: string) => {
    setSelectedTab(value);
    if (value === "alphabet") {
      // Use setTimeout to ensure DOM is updated before initializing canvas
      setTimeout(() => {
        initializeCanvas();
      }, 100);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={20} minSize={15} maxSize={25} className="bg-card border-r">
          <Sidebar onSignOut={handleSignOut} />
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={80}>
          <div className="h-full bg-background">
            <Header />
            <main className="p-6">
              <Card className="bg-card">
                <CardHeader>
                  <CardTitle className="text-foreground">Arabic Writing Practice</CardTitle>
                  <CardDescription>
                    Improve your Arabic writing skills with various practice exercises
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs value={selectedTab} onValueChange={handleTabChange} className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="freewriting">Free Writing</TabsTrigger>
                      <TabsTrigger value="prompts">Writing Prompts</TabsTrigger>
                      <TabsTrigger value="alphabet">Alphabet Practice</TabsTrigger>
                    </TabsList>
                    
                    {/* Free Writing Tab */}
                    <TabsContent value="freewriting" className="mt-4 space-y-4">
                      <Textarea
                        dir="rtl"
                        placeholder="Start writing in Arabic..."
                        className="min-h-[200px] text-xl bg-background text-foreground"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                      />
                      <div className="flex justify-end">
                        <Button onClick={handleFreeWritingSubmit}>
                          <Check className="mr-2 h-4 w-4" /> 
                          Submit Writing
                        </Button>
                      </div>
                    </TabsContent>
                    
                    {/* Writing Prompts Tab */}
                    <TabsContent value="prompts" className="mt-4 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-1 space-y-4">
                          <div className="font-medium text-lg mb-2">Select a Prompt:</div>
                          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                            {writingPrompts.map((prompt, index) => (
                              <Card 
                                key={index} 
                                className={`cursor-pointer hover:bg-accent ${selectedPrompt === prompt ? 'border-primary' : ''}`}
                                onClick={() => handlePromptSelect(prompt)}
                              >
                                <CardContent className="p-3">
                                  <div className="font-medium text-right">{prompt.prompt}</div>
                                  <div className="text-sm text-muted-foreground mt-1">{prompt.translation}</div>
                                  <div className="text-xs mt-2 inline-block bg-secondary px-2 py-1 rounded-full">
                                    {prompt.difficulty}
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>
                        
                        <div className="md:col-span-2 space-y-4">
                          <Alert>
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>{selectedPrompt.prompt}</AlertTitle>
                            <AlertDescription>{selectedPrompt.translation}</AlertDescription>
                          </Alert>
                          
                          <Textarea
                            dir="rtl"
                            placeholder="Write your response to the prompt in Arabic..."
                            className="min-h-[250px] text-xl bg-background text-foreground"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                          />
                          
                          <div className="flex justify-end">
                            <Button onClick={handleFreeWritingSubmit}>
                              <Check className="mr-2 h-4 w-4" /> 
                              Submit Response
                            </Button>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                    
                    {/* Alphabet Practice Tab */}
                    <TabsContent value="alphabet" className="mt-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-1 space-y-4">
                          <div className="font-medium text-lg mb-2">Select a Letter:</div>
                          <div className="grid grid-cols-4 gap-2 max-h-[400px] overflow-y-auto pr-2">
                            {arabicAlphabet.map((letter, index) => (
                              <Button
                                key={index}
                                variant={selectedLetter === letter ? "default" : "outline"}
                                className="h-12 text-xl"
                                onClick={() => handleLetterSelect(letter)}
                              >
                                {letter.letter}
                              </Button>
                            ))}
                          </div>
                        </div>
                        
                        <div className="md:col-span-2 space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Card>
                              <CardHeader className="pb-2">
                                <CardTitle className="text-center text-4xl">
                                  {selectedLetter.letter}
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-2">
                                <div>
                                  <span className="font-medium">Name:</span> {selectedLetter.name}
                                </div>
                                <div>
                                  <span className="font-medium">Transliteration:</span> {selectedLetter.transliteration}
                                </div>
                                <div>
                                  <span className="font-medium">Example:</span> {selectedLetter.example}
                                </div>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="w-full mt-2"
                                  onClick={playLetterSound}
                                >
                                  <Volume2 className="h-4 w-4 mr-2" /> Hear Pronunciation
                                </Button>
                              </CardContent>
                            </Card>
                            
                            <Card>
                              <CardHeader className="pb-2">
                                <CardTitle className="text-sm">Practice Writing</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div 
                                  className="border border-input rounded-md overflow-hidden bg-white"
                                >
                                  <canvas
                                    ref={canvasRef}
                                    className="touch-none w-full"
                                    onMouseDown={startDrawing}
                                    onMouseMove={draw}
                                    onMouseUp={stopDrawing}
                                    onMouseLeave={stopDrawing}
                                    onTouchStart={startDrawing}
                                    onTouchMove={draw}
                                    onTouchEnd={stopDrawing}
                                  />
                                </div>
                                <div className="flex gap-2 mt-3">
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="flex-1"
                                    onClick={resetCanvas}
                                  >
                                    <RotateCcw className="h-4 w-4 mr-2" /> Clear
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    className="flex-1"
                                    onClick={evaluateDrawing}
                                  >
                                    <ChevronsRight className="h-4 w-4 mr-2" /> Check
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                          
                          {letterResult && (
                            <Alert variant={letterResult.correct ? "default" : "destructive"}>
                              {letterResult.correct ? (
                                <Check className="h-4 w-4" />
                              ) : (
                                <X className="h-4 w-4" />
                              )}
                              <AlertTitle>
                                {letterResult.correct ? "Correct!" : "Not Quite"}
                              </AlertTitle>
                              <AlertDescription>
                                {letterResult.message}
                              </AlertDescription>
                            </Alert>
                          )}
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </main>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
      
      {/* Evaluation Result Dialog */}
      <Dialog open={showEvaluationDialog} onOpenChange={setShowEvaluationDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Writing Evaluation</DialogTitle>
            <DialogDescription>
              Here's feedback on your Arabic writing
            </DialogDescription>
          </DialogHeader>
          
          {evaluationResult && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold">{evaluationResult.score}%</div>
                <div className="text-sm text-muted-foreground">Overall Score</div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Feedback:</h4>
                <ul className="space-y-1">
                  {evaluationResult.feedback.map((item, i) => (
                    <li key={i} className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <Button className="w-full" onClick={() => setShowEvaluationDialog(false)}>
                Close
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Letter Evaluation Dialog */}
      <Dialog open={showLetterDialog} onOpenChange={setShowLetterDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Letter Evaluation</DialogTitle>
            <DialogDescription>
              Feedback on your letter writing
            </DialogDescription>
          </DialogHeader>
          
          {letterResult && (
            <div className="space-y-4">
              <div className="flex items-center justify-center">
                <div className={`p-4 rounded-full ${letterResult.correct ? 'bg-green-100' : 'bg-red-100'}`}>
                  {letterResult.correct ? (
                    <Check className="h-8 w-8 text-green-500" />
                  ) : (
                    <X className="h-8 w-8 text-red-500" />
                  )}
                </div>
              </div>
              
              <div className="text-center space-y-2">
                <h3 className="text-xl font-medium">
                  {letterResult.correct ? "Well done!" : "Keep practicing"}
                </h3>
                <p>{letterResult.message}</p>
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => {
                    setShowLetterDialog(false);
                    resetCanvas();
                  }}
                >
                  Try Again
                </Button>
                <Button 
                  className="flex-1"
                  onClick={() => {
                    setShowLetterDialog(false);
                    // Move to next letter if current one is correct
                    if (letterResult.correct) {
                      const currentIndex = arabicAlphabet.findIndex(l => l === selectedLetter);
                      const nextIndex = (currentIndex + 1) % arabicAlphabet.length;
                      handleLetterSelect(arabicAlphabet[nextIndex]);
                    }
                  }}
                >
                  {letterResult.correct ? "Next Letter" : "Close"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Writing;
