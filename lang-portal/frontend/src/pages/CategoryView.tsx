
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Vocabulary = Database['public']['Tables']['vocabulary']['Row'];
type Category = Database['public']['Tables']['categories']['Row'];

const CategoryView = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [category, setCategory] = useState<Category | null>(null);
  const [vocabulary, setVocabulary] = useState<Vocabulary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryAndVocabulary = async () => {
      try {
        // Fetch category details
        const { data: categoryData, error: categoryError } = await supabase
          .from('categories')
          .select('*')
          .eq('id', categoryId)
          .single();

        if (categoryError) throw categoryError;
        setCategory(categoryData);

        // Fetch vocabulary for this category
        const { data: vocabularyData, error: vocabularyError } = await supabase
          .from('vocabulary')
          .select('*')
          .eq('category_id', categoryId)
          .order('difficulty_level');

        if (vocabularyError) throw vocabularyError;
        setVocabulary(vocabularyData);
      } catch (error: any) {
        toast({
          title: "Error fetching category data",
          description: error.message,
          variant: "destructive",
        });
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    if (categoryId) {
      fetchCategoryAndVocabulary();
    }
  }, [categoryId, navigate, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        Category not found
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
            <h1 className="text-2xl font-bold">{category.name}</h1>
          </div>
          <p className="text-muted-foreground mt-1">{category.description}</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {vocabulary.length === 0 ? (
            <div className="col-span-full text-center p-4">
              No vocabulary words found in this category
            </div>
          ) : (
            vocabulary.map((word) => (
              <div
                key={word.id}
                className="p-6 rounded-lg bg-card border hover:border-primary transition-colors"
              >
                <p className="text-2xl font-bold text-right mb-2">{word.arabic_word}</p>
                {word.transliteration && (
                  <p className="text-sm text-muted-foreground mb-1">
                    {word.transliteration}
                  </p>
                )}
                <p className="font-medium">{word.english_translation}</p>
                {word.example_sentence && (
                  <p className="text-sm text-muted-foreground mt-2 text-right">
                    {word.example_sentence}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default CategoryView;
