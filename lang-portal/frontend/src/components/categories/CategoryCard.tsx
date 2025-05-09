
import { Button } from "@/components/ui/button";
import { Book, Brain, PenTool, MessageSquare } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type Category = Database['public']['Tables']['categories']['Row'];

interface CategoryCardProps {
  category: Category;
  onClick: (categoryId: string) => void;
}

const categoryIcons = {
  'Word Groups': <Book className="h-6 w-6" />,
  'Learning Activities': <Brain className="h-6 w-6" />,
  'Writing Practice': <PenTool className="h-6 w-6" />,
  'Conversation': <MessageSquare className="h-6 w-6" />
};

export const CategoryCard = ({ category, onClick }: CategoryCardProps) => {
  // Hardcoded word count for demo purposes
  const wordCount = category.name === 'Greetings' ? 10 :
                   category.name === 'Family' ? 8 :
                   category.name === 'Food' ? 12 : 
                   category.name === 'Numbers' ? 6 : 15;

  return (
    <div
      className="group relative bg-card rounded-lg border hover:border-primary transition-all duration-300 overflow-hidden cursor-pointer"
      onClick={() => onClick(category.id)}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            {categoryIcons[category.name as keyof typeof categoryIcons] || <Book className="h-6 w-6" />}
          </div>
          <span className="text-sm text-muted-foreground">
            {wordCount} words
          </span>
        </div>
        <h4 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
          {category.name}
        </h4>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {category.description}
        </p>
        <div className="mt-4 pt-4 border-t">
          <Button
            variant="ghost"
            className="w-full justify-center hover:bg-primary hover:text-primary-foreground"
          >
            Start Learning
          </Button>
        </div>
      </div>
    </div>
  );
};
