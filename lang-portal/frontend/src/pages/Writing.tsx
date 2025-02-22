
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Writing = () => {
  const [text, setText] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    navigate("/auth");
  };

  const handleSubmit = async () => {
    toast({
      title: "Writing submitted",
      description: "Your writing has been saved for review.",
    });
    setText("");
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
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    dir="rtl"
                    placeholder="Start writing in Arabic..."
                    className="min-h-[200px] text-xl bg-background text-foreground"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                  />
                  <Button onClick={handleSubmit}>Submit Writing</Button>
                </CardContent>
              </Card>
            </main>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default Writing;
