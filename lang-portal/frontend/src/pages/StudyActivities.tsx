
import { useNavigate } from "react-router-dom";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Pencil, Volume2, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";

const StudyActivities = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    navigate("/auth");
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
          <div className="h-full">
            <Header />
            <main className="p-6">
              <h1 className="text-2xl font-bold mb-6 text-foreground">Study Activities</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Vocabulary Review */}
                <Card className="bg-card hover:bg-accent/50 transition-colors cursor-pointer" onClick={() => navigate("/vocabulary")}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-foreground">
                      <BookOpen className="h-5 w-5" />
                      Vocabulary Review
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Review vocabulary words using spaced repetition and flashcards.
                    </p>
                  </CardContent>
                </Card>

                {/* Writing Practice */}
                <Card className="bg-card hover:bg-accent/50 transition-colors cursor-pointer" onClick={() => navigate("/writing")}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-foreground">
                      <Pencil className="h-5 w-5" />
                      Writing Practice
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Practice writing Arabic letters and words with instant feedback.
                    </p>
                  </CardContent>
                </Card>

                {/* Pronunciation */}
                <Card className="bg-card hover:bg-accent/50 transition-colors cursor-pointer" onClick={() => navigate("/conversation")}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-foreground">
                      <Volume2 className="h-5 w-5" />
                      Pronunciation
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Practice pronunciation with audio examples and recording.
                    </p>
                  </CardContent>
                </Card>

                {/* Memory Games */}
                <Card className="bg-card hover:bg-accent/50 transition-colors cursor-pointer">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-foreground">
                      <Brain className="h-5 w-5" />
                      Memory Games
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Strengthen your memory with fun and engaging word games.
                    </p>
                    <Button variant="secondary" className="mt-4 w-full bg-secondary text-secondary-foreground">
                      Coming Soon
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </main>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default StudyActivities;
