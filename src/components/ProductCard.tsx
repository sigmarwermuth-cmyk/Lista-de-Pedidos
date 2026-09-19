import React, { useState } from 'react';
import { Plus, Minus, MessageSquare, Edit2 } from 'lucide-react';
import { Product, OrderListItem } from '../types';
import { formatQuantityStr } from '../utils/whatsapp';

interface ProductCardProps {
  product: Product;
  listItem?: OrderListItem;
  onUpdateQuantity: (product: Product, quantity: number, unit?: string, note?: string) => void;
  onUpdateNote: (product: Product, note: string) => void;
  onEditProduct?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  listItem,
  onUpdateQuantity,
  onUpdateNote,
  onEditProduct,
}) => {
  const currentQty = typeof listItem?.quantity === 'number' ? listItem.quantity : 0;
  const [selectedUnit, setSelectedUnit] = useState<string>(product.unit || 'kg');
  const [showNoteInput, setShowNoteInput] = useState(false);

  // Active unit preference (listItem unit > selectedUnit state > product default)
  const activeUnit = listItem?.unit || selectedUnit;

  // Available units for selection: kg & unid (and product default unit if different)
  const availableUnits: string[] = ['kg', 'unid'];
  if (product.unit && !availableUnits.includes(product.unit)) {
    availableUnits.push(product.unit);
  }

  const isKg = activeUnit === 'kg';
  const step = isKg ? 0.5 : 1;
  const minQty = isKg ? 0.5 : 1;

  const handleUnitChange = (newUnit: string) => {
    setSelectedUnit(newUnit);
    if (currentQty > 0) {
      onUpdateQuantity(product, currentQty, newUnit, listItem?.note);
    }
  };

  const handleDecrease = () => {
    const newQty = Math.max(0, currentQty - step);
    const rounded = Math.round(newQty * 100) / 100;
    onUpdateQuantity(product, rounded < minQty ? 0 : rounded, activeUnit, listItem?.note);
  };

  const handleIncrease = () => {
    const newQty = currentQty === 0 ? minQty : currentQty + step;
    const rounded = Math.round(newQty * 100) / 100;
    onUpdateQuantity(product, rounded, activeUnit, listItem?.note);
  };

  return (
    <div 
      className={`bg-white rounded-2xl border p-4 shadow-xs transition-all flex flex-col justify-between relative group ${
        currentQty > 0
          ? 'border-emerald-500 ring-2 ring-emerald-500/10 bg-emerald-50/20'
          : 'border-slate-200 hover:border-slate-300'
      }`}
    >
      <div>
        {/* Top Icon & Unit Selector Toggle (kg / un) + Edit Quick Button */}
        <div className="flex items-start justify-between gap-1.5 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-3xl p-2 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
              {product.icon || '📦'}
            </span>
            {onEditProduct && (
              <button
                type="button"
                onClick={() => onEditProduct(product)}
                className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                title="Editar este produto"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-2xs">
            {availableUnits.map((u) => {
              const isActive = activeUnit === u;
              return (
                <button
                  key={u}
                  type="button"
                  onClick={() => handleUnitChange(u)}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-extrabold uppercase transition ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
                  }`}
                  title={`Alternar para ${u}`}
                >
                  {u === 'unid' ? 'un' : u}
                </button>
              );
            })}
          </div>
        </div>

        {/* Product Name */}
        <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2 mb-0.5">
          {product.name}
        </h3>
        
        {product.barcode && (
          <p className="font-mono text-[10px] font-semibold text-slate-500 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded w-fit mb-1">
            Cód: {product.barcode}
          </p>
        )}

        <p className="text-slate-400 text-[11px] capitalize">
          Categoria: {product.category}
        </p>

        {/* Optional note input if in list */}
        {currentQty > 0 && (
          <div className="mt-2.5">
            <button
              type="button"
              onClick={() => setShowNoteInput(!showNoteInput)}
              className="text-[11px] font-medium text-emerald-700 hover:underline flex items-center gap-1"
            >
              <MessageSquare className="w-3 h-3 text-emerald-600" />
              <span>{listItem?.note ? `Obs: "${listItem.note}"` : '+ Adicionar observação'}</span>
            </button>

            {showNoteInput && (
              <input
                type="text"
                value={listItem?.note || ''}
                onChange={(e) => onUpdateNote(product, e.target.value)}
                placeholder="Ex: Bananas maduras..."
                className="mt-1 w-full text-xs px-2.5 py-1 bg-white border border-emerald-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800"
              />
            )}
          </div>
        )}
      </div>

      {/* Quantity / Add Controls */}
      <div className="mt-4 pt-3 border-t border-slate-100">
        {currentQty > 0 ? (
          <div className="flex items-center justify-between bg-emerald-100/60 rounded-xl p-1 border border-emerald-200">
            <button
              onClick={handleDecrease}
              className="w-8 h-8 rounded-lg bg-white text-emerald-900 hover:bg-emerald-200 flex items-center justify-center font-bold shadow-xs active:scale-90 transition"
              title="Diminuir"
            >
              <Minus className="w-4 h-4" />
            </button>

            <span className="text-xs font-black text-emerald-950 px-2">
              {formatQuantityStr(currentQty, activeUnit)}
            </span>

            <button
              onClick={handleIncrease}
              className="w-8 h-8 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 flex items-center justify-center font-bold shadow-xs active:scale-90 transition"
              title="Aumentar"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={handleIncrease}
            className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs active:scale-98"
          >
            <Plus className="w-4 h-4 text-emerald-400" />
            <span>Adicionar à Lista</span>
          </button>
        )}
      </div>
    </div>
  );
};
