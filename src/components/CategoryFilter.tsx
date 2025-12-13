import { cn } from '@/lib/utils';
import { EventCategory, categoryLabels } from '@/data/events';
import { Code2, Palette, Trophy, GraduationCap } from 'lucide-react';

interface CategoryFilterProps {
  selectedCategory: EventCategory | 'all';
  onCategoryChange: (category: EventCategory | 'all') => void;
}

const categories: { key: EventCategory | 'all'; icon: React.ElementType; color: string }[] = [
  { key: 'all', icon: Code2, color: 'bg-orange-500' },
  { key: 'technical', icon: Code2, color: 'bg-orange-400' },
  { key: 'cultural', icon: Palette, color: 'bg-orange-300' },
  { key: 'sports', icon: Trophy, color: 'bg-orange-600' },
  { key: 'academic', icon: GraduationCap, color: 'bg-orange-200' },
];

const CategoryFilter = ({ selectedCategory, onCategoryChange }: CategoryFilterProps) => {
  return (
    <div className="py-6 font-playfair">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center justify-center gap-3">
          {categories.map(({ key, icon: Icon, color }) => {
            const isActive = selectedCategory === key;

            return (
              <button
                key={key}
                onClick={() => onCategoryChange(key)}
                className={cn(
                  'group flex items-center gap-2 rounded-full px-5 py-2.5 text-sm transition-all duration-300',
                  isActive
                    ? 'bg-orange-500 text-white shadow-lg'
                    : 'bg-orange-50 text-orange-700 hover:bg-orange-100'
                )}
              >
                <span
                  className={cn(
                    'flex h-6 w-6 items-center justify-center rounded-full transition-colors',
                    isActive ? 'bg-white/20' : `${color}/20`
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
