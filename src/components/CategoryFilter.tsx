import { cn } from '@/lib/utils';
import { EventCategory, categoryLabels } from '@/data/events';
import { Code2, Palette, Trophy, GraduationCap } from 'lucide-react';

interface CategoryFilterProps {
  selectedCategory: EventCategory | 'all';
  onCategoryChange: (category: EventCategory | 'all') => void;
}

const categories: { key: EventCategory | 'all'; icon: React.ElementType; color: string }[] = [
  { key: 'all', icon: Code2, color: 'bg-primary' },
  { key: 'technical', icon: Code2, color: 'bg-category-technical' },
  { key: 'cultural', icon: Palette, color: 'bg-category-cultural' },
  { key: 'sports', icon: Trophy, color: 'bg-category-sports' },
  { key: 'academic', icon: GraduationCap, color: 'bg-category-academic' },
];

const CategoryFilter = ({ selectedCategory, onCategoryChange }: CategoryFilterProps) => {
  return (
    <div className="py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center justify-center gap-3">
          {categories.map(({ key, icon: Icon, color }) => {
            const isActive = selectedCategory === key;
            return (
              <button
                key={key}
                onClick={() => onCategoryChange(key)}
                className={cn(
                  'group flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-button'
                    : 'bg-secondary text-secondary-foreground hover:bg-primary/10 hover:text-primary'
                )}
              >
                <span
                  className={cn(
                    'flex h-6 w-6 items-center justify-center rounded-full transition-colors',
                    isActive ? 'bg-primary-foreground/20' : color + '/20'
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                </span>
                {key === 'all' ? 'All Events' : categoryLabels[key]}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CategoryFilter;
