
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { Search } from "lucide-react";

type Vocabulary = Database['public']['Tables']['vocabulary']['Row'];

export const WordSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<Vocabulary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('vocabulary')
        .select('*, categories(*)')
        .or(`arabic_word.ilike.%${searchTerm}%,english_translation.ilike.%${searchTerm}%,transliteration.ilike.%${searchTerm}%`);

      if (error) throw error;
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

  return (
    <Card className="p-6">
      <form onSubmit={handleSearch} className="space-y-6">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for words in Arabic or English..."
              className="pl-10"
            />
          </div>
          <Button type="submit" disabled={isLoading}>
            Search
          </Button>
        </div>

        {results.length > 0 ? (
          <div className="space-y-4">
            {results.map((word) => (
              <div key={word.id} className="p-4 rounded-lg border bg-card">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-2xl font-bold mb-1 font-arabic">{word.arabic_word}</p>
                    <p className="text-lg text-muted-foreground">{word.english_translation}</p>
                    {word.transliteration && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Pronunciation: {word.transliteration}
                      </p>
                    )}
                  </div>
                </div>
                {word.example_sentence && (
                  <p className="mt-3 pt-3 border-t text-right font-arabic">
                    {word.example_sentence}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : searchTerm && !isLoading ? (
          <div className="text-center py-8 text-muted-foreground">
            No results found for "{searchTerm}"
          </div>
        ) : null}
      </form>
    </Card>
  );
};
