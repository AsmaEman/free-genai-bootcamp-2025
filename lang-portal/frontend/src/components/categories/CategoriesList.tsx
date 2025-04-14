
import { CategoryCard } from "./CategoryCard";
import type { Database } from "@/integrations/supabase/types";
import { useState, useEffect } from "react";

type Category = Database['public']['Tables']['categories']['Row'];

interface CategoriesListProps {
  onCategoryClick: (categoryId: string) => void;
}

export const CategoriesList = ({ onCategoryClick }: CategoriesListProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      // Sample category data
      const sampleCategories: Category[] = [
        {
          id: '1f3c89b2-f17e-4c11-b1e1-156485e724b2',
          name: 'Greetings',
          description: 'Common Arabic greetings and expressions',
          created_at: new Date().toISOString(),
          icon: 'book'
        },
        {
          id: '2a7d8f4e-b3c9-4d5a-a6b7-894e2c3f1d5a',
          name: 'Family',
          description: 'Family members and relationships',
          created_at: new Date().toISOString(),
          icon: 'users'
        },
        {
          id: '3b9e7a5c-d2f8-4e6b-b9c8-123a4b5c6d7e',
          name: 'Food',
          description: 'Food, drinks, and dining vocabulary',
          created_at: new Date().toISOString(),
          icon: 'coffee'
        },
        {
          id: '4c8d6b3a-e5f4-4a7b-8c9d-0123456789ab',
          name: 'Numbers',
          description: 'Numbers, counting, and basic math terms',
          created_at: new Date().toISOString(),
          icon: 'hash'
        },
        {
          id: '5d9e8f7b-a6b5-4c3d-2e1f-abcdef123456',
          name: 'Colors',
          description: 'Colors and basic descriptions',
          created_at: new Date().toISOString(),
          icon: 'palette'
        },
        {
          id: '6e0f9c8d-7b6a-5e4d-3c2b-1a0fedcba987',
          name: 'Travel',
          description: 'Essential vocabulary for travelers',
          created_at: new Date().toISOString(),
          icon: 'map'
        }
      ];
      
      setCategories(sampleCategories);
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <div className="col-span-full text-center p-4 text-card-foreground">Loading categories...</div>;
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
