
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/NotFound";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import CategoryView from "@/pages/CategoryView";
import StudySession from "@/pages/StudySession";
import Profile from "@/pages/Profile";
import Vocabulary from "@/pages/Vocabulary";
import WordSearch from "@/pages/WordSearch";
import Writing from "@/pages/Writing";
import Conversation from "@/pages/Conversation";
import StudyActivities from "@/pages/StudyActivities";
import TypingTutor from "@/pages/TypingTutor";
import { AuthProvider } from "@/components/AuthProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Index />} />
    <Route path="/auth" element={<Auth />} />
    <Route path="/vocabulary" element={<Vocabulary />} />
    <Route path="/search" element={<WordSearch />} />
    <Route path="/writing" element={<Writing />} />
    <Route path="/conversation" element={<Conversation />} />
    <Route path="/study-activities" element={<StudyActivities />} />
    <Route path="/typing-tutor" element={<TypingTutor />} />
    <Route path="/category/:categoryId" element={<CategoryView />} />
    <Route path="/study" element={<StudySession />} />
    <Route path="/profile" element={<Profile />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="app-theme">
        <BrowserRouter>
          <AuthProvider>
            <div className="min-h-screen bg-background">
              <AppRoutes />
              <Toaster />
            </div>
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
