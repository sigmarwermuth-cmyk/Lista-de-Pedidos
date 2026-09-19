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
    <div className="bg-white border-b border-slate-200 py-3 shadow-xs sticky top-[100px] sm:top-[72px] z-20 print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1 scroll-smooth">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const count = itemsCountMap[cat.id] || 0;

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`whitespace-nowrap px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 shrink-0 ${
                  isSelected
                    ? 'bg-[#001b69] text-white shadow-md scale-102 border border-[#001b69]'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/80'
                }`}
              >
                <span className="text-base">{cat.icon}</span>
                <span>{cat.label}</span>
                {count > 0 && cat.id !== 'todos' && (
                  <span
                    className={`px-1.5 py-0.5 text-[10px] font-extrabold rounded-full ${
                      isSelected
                        ? 'bg-[#f1b500] text-slate-950'
                        : 'bg-slate-200 text-slate-700'
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
