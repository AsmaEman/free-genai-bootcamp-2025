
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormControl } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Volume2, Mic, MicOff, Send, RefreshCw, MessageSquare } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getRelevantResponse, getRandomResponse } from "@/components/ConversationAI";

interface Message {
  id: string;
  text: string;
  translation?: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  audio?: string | null;
}

interface ConversationTopic {
  id: string;
  name: string;
  description: string;
}

// Sample conversation topics
const conversationTopics: ConversationTopic[] = [
  { id: "greetings", name: "Greetings & Introductions", description: "Learn how to greet people and introduce yourself" },
  { id: "daily", name: "Daily Activities", description: "Talk about your daily routine and activities" },
  { id: "food", name: "Food & Dining", description: "Discuss favorite foods and ordering at restaurants" },
  { id: "travel", name: "Travel & Directions", description: "Ask for directions and discuss travel plans" },
  { id: "shopping", name: "Shopping", description: "Vocabulary and phrases for shopping experiences" },
  { id: "weather", name: "Weather", description: "Discuss weather conditions and forecasts" },
  { id: "family", name: "Family & Friends", description: "Talk about family members and relationships" },
  { id: "hobbies", name: "Hobbies & Interests", description: "Share your interests and leisure activities" },
];

const Conversation = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [currentTopic, setCurrentTopic] = useState<string>("greetings");
  const [showTranslation, setShowTranslation] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const form = useForm<{ message: string }>();
  
  // Auto-scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    navigate("/auth");
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const newUserMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInput("");
    setIsLoading(true);

    // Use the getRelevantResponse function to generate a response
    setTimeout(() => {
      // Generate a response based on the user input
      const aiResponse = getRelevantResponse(input, currentTopic);
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTopicChange = (topic: string) => {
    setCurrentTopic(topic);
    toast({
      title: "Topic Changed",
      description: `Conversation topic set to: ${conversationTopics.find(t => t.id === topic)?.name}`,
    });
    
    // Start a new conversation with the AI when topic changes
    startNewConversation();
  };

  const toggleRecording = () => {
    if (isRecording) {
      // Stop recording logic would go here
      setIsRecording(false);
      toast({
        title: "Recording Stopped",
        description: "Voice recording has been stopped.",
      });
    } else {
      // Start recording logic would go here
      setIsRecording(true);
      toast({
        title: "Recording Started",
        description: "Voice recording has started. Speak clearly into your microphone.",
      });
    }
  };

  const handlePlayAudio = (message: Message) => {
    if (!message.audio) {
      toast({
        title: "Audio unavailable",
        description: "This word doesn't have audio pronunciation available.",
        variant: "default",
      });
      return;
    }
    
    // Create an Audio object instance without 'new' keyword
    const audio = document.createElement('audio');
    audio.src = message.audio;
    audio.play().catch(error => {
      toast({
        title: "Audio playback failed",
        description: "Unable to play the pronunciation audio.",
        variant: "destructive",
      });
    });
  };

  const startNewConversation = () => {
    setMessages([]);
    
    // Get initial message from the AI
    setTimeout(() => {
      // Get a random response to start the conversation
      const initialResponse = getRandomResponse(currentTopic);
      setMessages([initialResponse]);
    }, 100);
    
    toast({
      title: "New Conversation Started",
      description: `Starting a new conversation about ${conversationTopics.find(t => t.id === currentTopic)?.name}`,
    });
  };

  // Initialize conversation with an AI message when the component mounts or topic changes
  useEffect(() => {
    if (messages.length === 0) {
      startNewConversation();
    }
  }, [currentTopic]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={20} minSize={15} maxSize={25} className="bg-card border-r">
          <Sidebar onSignOut={handleSignOut} />
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={80}>
          <div className="h-screen flex flex-col">
            <Header />
            <main className="flex-1 p-6 overflow-hidden">
              <Card className="h-full flex flex-col">
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <div>Arabic Conversation Practice</div>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={startNewConversation}
                        title="Start a new conversation"
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        New
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setShowTranslation(!showTranslation)}
                        title={showTranslation ? "Hide translations" : "Show translations"}
                      >
                        {showTranslation ? "Hide Translation" : "Show Translation"}
                      </Button>
                    </div>
                  </CardTitle>
                  <CardDescription>
                    Practice your Arabic conversation skills on different topics
                  </CardDescription>
                  <div className="mt-2">
                    <Select
                      value={currentTopic}
                      onValueChange={handleTopicChange}
                    >
                      <SelectTrigger className="w-full sm:w-[300px]">
                        <SelectValue placeholder="Select a conversation topic" />
                      </SelectTrigger>
                      <SelectContent>
                        {conversationTopics.map((topic) => (
                          <SelectItem key={topic.id} value={topic.id}>
                            <div className="flex flex-col">
                              <span>{topic.name}</span>
                              <span className="text-xs text-muted-foreground">{topic.description}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <ScrollArea className="flex-1 mb-4 pr-4">
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${
                            message.sender === 'user' ? 'justify-end' : 'justify-start'
                          }`}
                        >
                          <div
                            className={`inline-block rounded-lg px-4 py-2 max-w-[80%] ${
                              message.sender === 'user'
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted'
                            }`}
                          >
                            <div className={message.sender === 'assistant' ? 'font-arabic text-lg' : ''}>
                              {message.text}
                            </div>
                            
                            {message.sender === 'assistant' && showTranslation && message.translation && (
                              <div className="text-sm text-muted-foreground mt-1 border-t pt-1">
                                {message.translation}
                              </div>
                            )}
                            
                            {message.sender === 'assistant' && (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="mt-1 h-6 p-0" 
                                onClick={() => handlePlayAudio(message)}
                              >
                                <Volume2 className="h-3 w-3 mr-1" />
                                <span className="text-xs">Pronounce</span>
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                      {isLoading && (
                        <div className="flex justify-start">
                          <div className="inline-block rounded-lg px-4 py-2 bg-muted">
                            <div className="flex space-x-2">
                              <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce"></div>
                              <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                              <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                            </div>
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(() => handleSend())} className="flex gap-2 mt-auto pt-4 border-t">
                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input
                                placeholder="Type your message in English or Arabic..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                disabled={isLoading}
                                className="flex-1"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <Button variant="outline" type="button" onClick={toggleRecording} disabled={isLoading}>
                        {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                      </Button>
                      <Button type="submit" disabled={!input.trim() || isLoading}>
                        <Send className="h-4 w-4 mr-2" />
                        Send
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </main>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default Conversation;
