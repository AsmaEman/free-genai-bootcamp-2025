
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, BookOpen, ChartBar, LogOut, Search, PenTool, MessageSquare, Keyboard } from "lucide-react";

interface SidebarProps {
  onSignOut: () => Promise<void>;
}

export const Sidebar = ({ onSignOut }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="h-full flex flex-col">
      {/* Sidebar Header */}
      <div className="p-6 border-b">
        <h1 className="text-2xl font-bold text-primary">تعلم العربية</h1>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          <Button 
            variant={isActive('/') ? "default" : "ghost"}
            className="w-full justify-start gap-2"
            onClick={() => navigate('/')}
            style={{ backgroundColor: isActive('/') ? '#86efac' : undefined }}
          >
            <Home className="h-5 w-5" />
            <span>Dashboard</span>
          </Button>
          <Button 
            variant={isActive('/vocabulary') ? "default" : "ghost"}
            className="w-full justify-start gap-2"
            onClick={() => navigate('/vocabulary')}
            style={{ backgroundColor: isActive('/vocabulary') ? '#86efac' : undefined }}
          >
            <BookOpen className="h-5 w-5" />
            <span>Vocabulary</span>
          </Button>
          <Button 
            variant={isActive('/search') ? "default" : "ghost"}
            className="w-full justify-start gap-2"
            onClick={() => navigate('/search')}
            style={{ backgroundColor: isActive('/search') ? '#86efac' : undefined }}
          >
            <Search className="h-5 w-5" />
            <span>Word Search</span>
          </Button>
          <Button 
            variant={isActive('/writing') ? "default" : "ghost"}
            className="w-full justify-start gap-2"
            onClick={() => navigate('/writing')}
            style={{ backgroundColor: isActive('/writing') ? '#86efac' : undefined }}
          >
            <PenTool className="h-5 w-5" />
            <span>Writing</span>
          </Button>
          <Button 
            variant={isActive('/conversation') ? "default" : "ghost"}
            className="w-full justify-start gap-2"
            onClick={() => navigate('/conversation')}
            style={{ backgroundColor: isActive('/conversation') ? '#86efac' : undefined }}
          >
            <MessageSquare className="h-5 w-5" />
            <span>Conversation</span>
          </Button>
          <Button 
            variant={isActive('/typing-tutor') ? "default" : "ghost"}
            className="w-full justify-start gap-2"
            onClick={() => navigate('/typing-tutor')}
            style={{ backgroundColor: isActive('/typing-tutor') ? '#86efac' : undefined }}
          >
            <Keyboard className="h-5 w-5" />
            <span>Typing Tutor</span>
          </Button>
        </div>
      </nav>

      {/* User Section */}
      <div className="p-4 border-t">
        <Button variant="ghost" className="w-full justify-start gap-2" onClick={onSignOut}>
          <LogOut className="h-5 w-5" />
          <span>Sign Out</span>
        </Button>
      </div>
    </div>
  );
};
