
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { Search, Volume2, Loader2, Filter, Tag } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

type Vocabulary = Database['public']['Tables']['vocabulary']['Row'] & {
  categories?: {
    id: string;
    name: string;
    description: string | null;
  } | null;
};

export const WordSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<Vocabulary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recentWords, setRecentWords] = useState<Vocabulary[]>([]);
  const [searchType, setSearchType] = useState<"all" | "arabic" | "english" | "tags">("all");
  const [difficultyFilter, setDifficultyFilter] = useState<number[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [categories, setCategories] = useState<{id: string, name: string}[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const { toast } = useToast();

  // Fetch categories and all available tags on mount
  useEffect(() => {
    const fetchCategoriesAndTags = async () => {
      try {
        // Fetch categories
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('categories')
          .select('id, name')
          .order('name');

        if (categoriesError) throw categoriesError;
        setCategories(categoriesData || []);

        // Fetch a sample of vocabulary to extract all unique tags
        const { data: vocabData, error: vocabError } = await supabase
          .from('vocabulary')
          .select('tags')
          .not('tags', 'is', null);

        if (vocabError) throw vocabError;
        
        // Extract and flatten all tags
        const tags = vocabData?.flatMap(item => item.tags || []) || [];
        const uniqueTags = [...new Set(tags)].sort();
        setAllTags(uniqueTags);
      } catch (error: any) {
        console.error("Error fetching categories and tags:", error);
      }
    };

    fetchCategoriesAndTags();
  }, []);

  // Fetch recent words on component mount
  useEffect(() => {
    const fetchRecentWords = async () => {
      try {
        const { data, error } = await supabase
          .from('vocabulary')
          .select('*, categories:category_id(*)')
          .order('created_at', { ascending: false })
          .limit(10);

        if (error) throw error;
        setRecentWords(data || []);
      } catch (error: any) {
        console.error("Error fetching recent words:", error);
        toast({
          title: "Failed to load recent words",
          description: "Please try refreshing the page.",
          variant: "destructive",
        });
      }
    };

    fetchRecentWords();
  }, [toast]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsLoading(true);
    try {
      // Build the search query based on search type
      let query = supabase
        .from('vocabulary')
        .select('*, categories:category_id(*)');
      
      // Apply search term filter if provided
      if (searchTerm.trim()) {
        const searchTermLower = searchTerm.toLowerCase().trim();
        
        if (searchType === "all") {
          query = query.or(`arabic_word.ilike.%${searchTermLower}%,english_translation.ilike.%${searchTermLower}%,transliteration.ilike.%${searchTermLower}%`);
        } else if (searchType === "arabic") {
          query = query.ilike('arabic_word', `%${searchTermLower}%`);
        } else if (searchType === "english") {
          query = query.ilike('english_translation', `%${searchTermLower}%`);
        } else if (searchType === "tags") {
          query = query.contains('tags', [searchTermLower]);
        }
      }
      
      // Apply category filter if selected
      if (categoryFilter) {
        query = query.eq('category_id', categoryFilter);
      }
      
      // Apply difficulty level filter if selected
      if (difficultyFilter.length > 0) {
        query = query.in('difficulty_level', difficultyFilter);
      }
      
      // Apply tag filters if selected
      if (selectedTags.length > 0) {
        // For each tag, we need the word to contain that tag
        selectedTags.forEach(tag => {
          query = query.contains('tags', [tag]);
        });
      }
      
      // Execute the query with ordering
      const { data, error } = await query.order('difficulty_level');

      if (error) throw error;
      
      if (data && data.length === 0) {
        toast({
          title: "No results found",
          description: `No words matching your criteria were found. Try different search terms or filters.`,
          variant: "default",
        });
      }
      
      setResults(data || []);
    } catch (error: any) {
      toast({
        title: "Search failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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

  const handleTagClick = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag) 
        : [...prev, tag]
    );
  };

  const handleDifficultyToggle = (level: number) => {
    setDifficultyFilter(prev => 
      prev.includes(level)
        ? prev.filter(l => l !== level)
        : [...prev, level]
    );
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSearchType("all");
    setDifficultyFilter([]);
    setCategoryFilter(null);
    setSelectedTags([]);
  };

  const areFiltersActive = () => {
    return difficultyFilter.length > 0 || categoryFilter !== null || selectedTags.length > 0;
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-card text-card-foreground">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex flex-col gap-2 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for words in Arabic or English..."
                className="pl-10"
              />
            </div>
            <Select
              value={searchType}
              onValueChange={(value) => setSearchType(value as "all" | "arabic" | "english" | "tags")}
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Search in..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Fields</SelectItem>
                <SelectItem value="arabic">Arabic</SelectItem>
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="tags">Tags</SelectItem>
              </SelectContent>
            </Select>

            {/* Filters Popover */}
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant={areFiltersActive() ? "default" : "outline"} 
                  className="w-full md:w-auto"
                >
                  <Filter className="mr-2 h-4 w-4" />
                  Filters {areFiltersActive() && `(${difficultyFilter.length + (categoryFilter ? 1 : 0) + selectedTags.length})`}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-4">
                <div className="space-y-4">
                  <h4 className="font-medium">Filter by Category</h4>
                  <Select
                    value={categoryFilter || ""}
                    onValueChange={(value) => setCategoryFilter(value || null)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div className="space-y-2">
                    <h4 className="font-medium">Difficulty Level</h4>
                    <div className="flex gap-2">
                      {[1, 2, 3].map((level) => (
                        <div key={level} className="flex items-center gap-1.5">
                          <Checkbox 
                            id={`difficulty-${level}`}
                            checked={difficultyFilter.includes(level)}
                            onCheckedChange={() => handleDifficultyToggle(level)}
                          />
                          <Label htmlFor={`difficulty-${level}`}>Level {level}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Tags</h4>
                    <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
                      {allTags.map((tag) => (
                        <Badge 
                          key={tag} 
                          variant={selectedTags.includes(tag) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => handleTagClick(tag)}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {areFiltersActive() && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="mt-2 w-full" 
                      onClick={handleClearFilters}
                    >
                      Clear Filters
                    </Button>
                  )}
                </div>
              </PopoverContent>
            </Popover>

            <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Searching...
                </>
              ) : (
                "Search"
              )}
            </Button>
          </div>

          {/* Active Filters Display */}
          {areFiltersActive() && (
            <div className="flex flex-wrap gap-1.5 pt-2">
              {difficultyFilter.map((level) => (
                <Badge key={`diff-${level}`} variant="secondary" className="flex items-center gap-1">
                  Level {level}
                  <button 
                    className="ml-1 rounded-full hover:bg-secondary/80" 
                    onClick={() => handleDifficultyToggle(level)}
                  >
                    ×
                  </button>
                </Badge>
              ))}
              
              {categoryFilter && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {categories.find(c => c.id === categoryFilter)?.name || 'Category'}
                  <button 
                    className="ml-1 rounded-full hover:bg-secondary/80" 
                    onClick={() => setCategoryFilter(null)}
                  >
                    ×
                  </button>
                </Badge>
              )}
              
              {selectedTags.map((tag) => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <button 
                    className="ml-1 rounded-full hover:bg-secondary/80" 
                    onClick={() => handleTagClick(tag)}
                  >
                    ×
                  </button>
                </Badge>
              ))}
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 px-2 text-xs" 
                onClick={handleClearFilters}
              >
                Clear All
              </Button>
            </div>
          )}
        </form>
      </Card>

      {results.length > 0 ? (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-foreground">Search Results ({results.length})</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.map((word) => (
              <WordCard key={word.id} word={word} onPlayAudio={handlePlayAudio} />
            ))}
          </div>
        </div>
      ) : searchTerm && !isLoading ? (
        <div className="text-center py-8 text-muted-foreground">
          No results found for "{searchTerm}"
        </div>
      ) : null}

      {!searchTerm && recentWords.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-foreground">Recently Added Words</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentWords.map((word) => (
              <WordCard key={word.id} word={word} onPlayAudio={handlePlayAudio} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Separate card component for displaying a vocabulary word
const WordCard = ({ word, onPlayAudio }: { word: Vocabulary, onPlayAudio: (url: string | null) => void }) => {
  return (
    <div className="p-4 rounded-lg border bg-card text-card-foreground hover:border-primary transition-colors">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <p className="text-2xl font-bold mb-1 font-arabic">{word.arabic_word}</p>
          <p className="text-lg text-foreground">{word.english_translation}</p>
          {word.transliteration && (
            <p className="text-sm text-muted-foreground mt-1">
              Pronunciation: {word.transliteration}
            </p>
          )}
          
          {word.difficulty_level && (
            <Badge variant="outline" className="mt-2">
              Level {word.difficulty_level}
            </Badge>
          )}
          
          {word.tags && word.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {word.tags.map((tag, index) => (
                <div key={index} className="flex items-center text-xs rounded-full bg-primary/10 text-primary px-2 py-1">
                  <Tag className="h-3 w-3 mr-1" /> {tag}
                </div>
              ))}
            </div>
          )}
        </div>
        {word.audio_url && (
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPlayAudio(word.audio_url)}
            className="ml-2"
            title="Play pronunciation"
          >
            <Volume2 className="h-4 w-4" />
          </Button>
        )}
      </div>
      {word.example_sentence && (
        <div className="mt-3 pt-3 border-t">
          <p className="text-sm text-muted-foreground mb-1">Example:</p>
          <p className="text-right font-arabic">{word.example_sentence}</p>
          {word.categories && word.categories.name && (
            <p className="text-xs text-muted-foreground mt-2">
              Category: {word.categories.name}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
