import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Volume2, Tag, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Database } from "@/integrations/supabase/types";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type Vocabulary = Database['public']['Tables']['vocabulary']['Row'];
type Category = Database['public']['Tables']['categories']['Row'];

const mockVocabularyData: Record<string, Vocabulary[]> = {
  '1f3c89b2-f17e-4c11-b1e1-156485e724b2': [
    {
      id: '101',
      arabic_word: 'مرحبا',
      english_translation: 'Hello',
      transliteration: 'Marhaba',
      category_id: '1f3c89b2-f17e-4c11-b1e1-156485e724b2',
      difficulty_level: 1,
      tags: ['greeting', 'basic'],
      created_at: new Date().toISOString(),
    },
    {
      id: '102',
      arabic_word: 'السلام عليكم',
      english_translation: 'Peace be upon you',
      transliteration: 'As-salaam-alaikum',
      category_id: '1f3c89b2-f17e-4c11-b1e1-156485e724b2',
      difficulty_level: 1,
      tags: ['greeting', 'formal'],
      created_at: new Date().toISOString(),
    },
    {
      id: '103',
      arabic_word: 'صباح الخير',
      english_translation: 'Good morning',
      transliteration: 'Sabah al-khair',
      category_id: '1f3c89b2-f17e-4c11-b1e1-156485e724b2',
      difficulty_level: 1,
      tags: ['greeting', 'morning'],
      created_at: new Date().toISOString(),
      example_sentence: 'صباح الخير، كيف حالك؟',
    },
    {
      id: '104',
      arabic_word: 'مساء الخير',
      english_translation: 'Good evening',
      transliteration: 'Masaa al-khair',
      category_id: '1f3c89b2-f17e-4c11-b1e1-156485e724b2',
      difficulty_level: 1,
      tags: ['greeting', 'evening'],
      created_at: new Date().toISOString(),
    },
  ],
  '2a7d8f4e-b3c9-4d5a-a6b7-894e2c3f1d5a': [
    {
      id: '201',
      arabic_word: 'أب',
      english_translation: 'Father',
      transliteration: 'Ab',
      category_id: '2a7d8f4e-b3c9-4d5a-a6b7-894e2c3f1d5a',
      difficulty_level: 1,
      tags: ['family', 'basic'],
      created_at: new Date().toISOString(),
    },
    {
      id: '202',
      arabic_word: 'أم',
      english_translation: 'Mother',
      transliteration: 'Um',
      category_id: '2a7d8f4e-b3c9-4d5a-a6b7-894e2c3f1d5a',
      difficulty_level: 1,
      tags: ['family', 'basic'],
      created_at: new Date().toISOString(),
    },
    {
      id: '203',
      arabic_word: 'أخ',
      english_translation: 'Brother',
      transliteration: 'Akh',
      category_id: '2a7d8f4e-b3c9-4d5a-a6b7-894e2c3f1d5a',
      difficulty_level: 1,
      tags: ['family', 'basic'],
      created_at: new Date().toISOString(),
      example_sentence: 'هذا أخي الكبير.',
    },
    {
      id: '204',
      arabic_word: 'أخت',
      english_translation: 'Sister',
      transliteration: 'Ukht',
      category_id: '2a7d8f4e-b3c9-4d5a-a6b7-894e2c3f1d5a',
      difficulty_level: 1,
      tags: ['family', 'basic'],
      created_at: new Date().toISOString(),
    },
  ],
};

const mockCategories: Record<string, Category> = {
  '1f3c89b2-f17e-4c11-b1e1-156485e724b2': {
    id: '1f3c89b2-f17e-4c11-b1e1-156485e724b2',
    name: 'Greetings',
    description: 'Common Arabic greetings and expressions',
    created_at: new Date().toISOString(),
    icon: null
  },
  '2a7d8f4e-b3c9-4d5a-a6b7-894e2c3f1d5a': {
    id: '2a7d8f4e-b3c9-4d5a-a6b7-894e2c3f1d5a',
    name: 'Family',
    description: 'Family members and relationships',
    created_at: new Date().toISOString(),
    icon: null
  },
  '3b9e7a5c-d2f8-4e6b-b9c8-123a4b5c6d7e': {
    id: '3b9e7a5c-d2f8-4e6b-b9c8-123a4b5c6d7e',
    name: 'Food',
    description: 'Food, drinks, and dining vocabulary',
    created_at: new Date().toISOString(),
    icon: null
  },
};

const CategoryView = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [category, setCategory] = useState<Category | null>(null);
  const [vocabulary, setVocabulary] = useState<Vocabulary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [difficultyFilter, setDifficultyFilter] = useState<number | null>(null);
  const [filterTags, setFilterTags] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);

  useEffect(() => {
    const fetchCategoryAndVocabulary = async () => {
      try {
        setTimeout(() => {
          if (!categoryId) {
            throw new Error("Category ID is missing");
          }

          const categoryData = mockCategories[categoryId];
          if (!categoryData) {
            throw new Error("Category not found");
          }
          setCategory(categoryData);

          const vocabularyData = mockVocabularyData[categoryId] || [];
          setVocabulary(vocabularyData);

          const allTags = vocabularyData.flatMap(word => word.tags || []);
          const uniqueTags = [...new Set(allTags)].sort();
          setAvailableTags(uniqueTags);
          
          setIsLoading(false);
        }, 800);
      } catch (error: any) {
        toast({
          title: "Error fetching category data",
          description: error.message,
          variant: "destructive",
        });
        navigate('/vocabulary');
      }
    };

    if (categoryId) {
      fetchCategoryAndVocabulary();
    }
  }, [categoryId, navigate, toast]);

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

  const toggleTagFilter = (tag: string) => {
    setFilterTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag) 
        : [...prev, tag]
    );
  };

  const filteredVocabulary = vocabulary.filter(word => {
    if (difficultyFilter !== null && word.difficulty_level !== difficultyFilter) {
      return false;
    }
    
    if (filterTags.length > 0) {
      return filterTags.every(tag => word.tags?.includes(tag));
    }
    
    return true;
  });

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
            <Button variant="ghost" size="icon" onClick={() => navigate('/vocabulary')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">{category.name}</h1>
          </div>
          <p className="text-muted-foreground mt-1">{category.description}</p>

          <div className="mt-4 flex flex-wrap gap-2">
            <div className="mr-2">
              <span className="text-sm font-medium mr-2">Difficulty:</span>
              {[null, 1, 2, 3].map((level) => (
                <Badge 
                  key={level === null ? 'all' : `level-${level}`}
                  variant={difficultyFilter === level ? "default" : "outline"}
                  className="mr-1 cursor-pointer"
                  onClick={() => setDifficultyFilter(level)}
                >
                  {level === null ? 'All' : `Level ${level}`}
                </Badge>
              ))}
            </div>

            {availableTags.length > 0 && (
              <div className="flex flex-wrap gap-1 items-center">
                <span className="text-sm font-medium mr-1">Tags:</span>
                {availableTags.map(tag => (
                  <Badge
                    key={tag}
                    variant={filterTags.includes(tag) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleTagFilter(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            Showing {filteredVocabulary.length} of {vocabulary.length} words
            {difficultyFilter !== null && ` (Difficulty Level: ${difficultyFilter})`}
            {filterTags.length > 0 && ` (Tags: ${filterTags.join(', ')})`}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredVocabulary.length === 0 ? (
            <div className="col-span-full text-center p-4">
              No vocabulary words found with the selected filters
            </div>
          ) : (
            filteredVocabulary.map((word) => (
              <div
                key={word.id}
                className="p-6 rounded-lg bg-card border hover:border-primary transition-colors"
              >
                <div className="flex justify-between">
                  <div>
                    {word.difficulty_level && (
                      <Badge variant="outline" className="mb-2">
                        Level {word.difficulty_level}
                      </Badge>
                    )}
                  </div>
                  {word.audio_url && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handlePlayAudio(word.audio_url)}
                    >
                      <Volume2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <p className="text-2xl font-bold text-right mb-2 font-arabic">{word.arabic_word}</p>
                
                {word.transliteration && (
                  <p className="text-sm text-muted-foreground mb-1">
                    {word.transliteration}
                  </p>
                )}
                
                <p className="font-medium">{word.english_translation}</p>
                
                {word.example_sentence && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="inline-flex items-center mt-2 text-xs text-muted-foreground cursor-help">
                          <Info className="h-3 w-3 mr-1" /> Example available
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-sm">
                        <p className="text-right font-arabic mb-1">{word.example_sentence}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}

                {word.tags && word.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {word.tags.map((tag, index) => (
                      <div 
                        key={index} 
                        className="inline-flex items-center text-xs px-2 py-1 rounded-full bg-primary/10 text-primary cursor-pointer"
                        onClick={() => toggleTagFilter(tag)}
                      >
                        <Tag className="h-3 w-3 mr-1" /> {tag}
                      </div>
                    ))}
                  </div>
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
