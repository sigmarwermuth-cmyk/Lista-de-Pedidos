import React from 'react';
import { ProductCategory } from '../types';

interface CategoryNavProps {
  selectedCategory: ProductCategory;
  onSelectCategory: (cat: ProductCategory) => void;
  itemsCountMap: Record<ProductCategory, number>;
}

interface CategoryItem {
  id: ProductCategory;
  label: string;
  icon: string;
}

const CATEGORIES: CategoryItem[] = [
  { id: 'todos', label: 'Todos os Produtos', icon: '📦' },
  { id: 'frutas', label: 'Frutas', icon: '🍎' },
  { id: 'verduras', label: 'Verduras', icon: '🥬' },
  { id: 'legumes', label: 'Legumes', icon: '🥕' },
  { id: 'laticinios', label: 'Laticínios & Ovos', icon: '🧀' },
  { id: 'acougue', label: 'Açougue & Carnes', icon: '🥩' },
  { id: 'mercearia', label: 'Mercearia', icon: '🌾' },
  { id: 'bebidas', label: 'Bebidas', icon: '🥤' },
  { id: 'limpeza', label: 'Limpeza', icon: '🧼' },
];

export const CategoryNav: React.FC<CategoryNavProps> = ({
  selectedCategory,
  onSelectCategory,
  itemsCountMap,
}) => {
  return (
    <div className="sticky top-[100px] sm:top-[72px] z-20 print:hidden bg-white/85 backdrop-blur-md border-b border-slate-200/80 py-2.5 sm:py-3 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-0.5 scroll-smooth">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const count = itemsCountMap[cat.id] || 0;

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`relative whitespace-nowrap px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 shrink-0 active:scale-95 ${
                  isSelected
                    ? 'bg-[#001b69] text-white shadow-md border border-[#001b69]'
                    : 'bg-white/80 hover:bg-white text-slate-700 hover:text-slate-900 border border-slate-200/80 shadow-2xs'
                }`}
              >
                <span className="text-base relative z-10">{cat.icon}</span>
                <span className="relative z-10">{cat.label}</span>
                {count > 0 && cat.id !== 'todos' && (
                  <span
                    className={`relative z-10 px-1.5 py-0.5 text-[10px] font-extrabold rounded-full ${
                      isSelected
                        ? 'bg-[#f1b500] text-slate-950'
                        : 'bg-slate-200/80 text-slate-700'
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
