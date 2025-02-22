
import { CategoryCard } from "./CategoryCard";
import type { Database } from "@/integrations/supabase/types";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

type Category = Database['public']['Tables']['categories']['Row'];

interface CategoriesListProps {
  onCategoryClick: (categoryId: string) => void;
}

export const CategoriesList = ({ onCategoryClick }: CategoriesListProps) => {
  const { data: categories, isLoading, error } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return <div className="col-span-full text-center p-4 text-card-foreground">Loading categories...</div>;
  }

  if (error) {
    return <div className="col-span-full text-center p-4 text-destructive">Error loading categories</div>;
  }

  if (!categories || categories.length === 0) {
    return <div className="col-span-full text-center p-4 text-card-foreground">No categories found</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {categories.map((category) => (
        <CategoryCard
          key={category.id}
          category={category}
          onClick={onCategoryClick}
        />
      ))}
    </div>
  );
};
