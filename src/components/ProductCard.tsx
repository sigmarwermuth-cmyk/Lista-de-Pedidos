import React, { useState, useEffect } from 'react';
import { Plus, Minus, MessageSquare, Edit2, Barcode } from 'lucide-react';
import { Product, OrderListItem } from '../types';

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
  const [inputVal, setInputVal] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!isEditing) {
      setInputVal(currentQty > 0 ? String(currentQty) : '');
    }
  }, [currentQty, isEditing]);

  // Active unit preference (listItem unit > selectedUnit state > product default)
  const activeUnit = listItem?.unit || selectedUnit;

  // Available units for selection: kg & unid (and product default unit if different)
  const availableUnits: string[] = ['kg', 'unid'];
  if (product.unit && !availableUnits.includes(product.unit)) {
    availableUnits.push(product.unit);
  }

  const step = (activeUnit === product.unit || !product.unit) && product.step && product.step > 0 && product.step !== 0.5
    ? product.step 
    : 1;
  const minQty = (activeUnit === product.unit || !product.unit) && product.minQty && product.minQty > 0 && product.minQty !== 0.5
    ? product.minQty 
    : 1;

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
      className={`rounded-2xl border p-4 transition-all duration-200 hover:-translate-y-0.5 flex flex-col justify-between relative group ${
        currentQty > 0
          ? 'border-emerald-500 ring-2 ring-emerald-500/25 shadow-sm shadow-emerald-500/10 bg-gradient-to-b from-emerald-50/40 to-white'
          : 'bg-white border-slate-200/90 hover:border-slate-300 hover:shadow-md'
      }`}
    >
      <div>
        {/* Top Icon & Unit Selector Toggle (kg / un) + Edit Quick Button */}
        <div className="flex items-start justify-between gap-1.5 mb-2">
          <div className="flex items-center gap-2">
            <span 
              className="text-3xl p-2 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 shadow-2xs hover:scale-105 transition-transform"
            >
              {product.icon || '📦'}
            </span>
            {onEditProduct && (
              <button
                type="button"
                onClick={() => onEditProduct(product)}
                className="p-1.5 text-slate-400 hover:text-[#001b69] hover:bg-sky-50 rounded-lg transition active:scale-90"
                title="Editar este produto"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          
          <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/70 shadow-2xs">
            {availableUnits.map((u) => {
              const isActive = activeUnit === u;
              return (
                <button
                  key={u}
                  type="button"
                  onClick={() => handleUnitChange(u)}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-extrabold uppercase transition-all duration-150 active:scale-95 ${
                    isActive
                      ? 'bg-[#001b69] text-white shadow-xs'
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
        <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2 mb-1">
          {product.name}
        </h3>
        
        {/* Refined Barcode Badge */}
        {product.barcode && (
          <div className="inline-flex items-center gap-1.5 font-mono text-[10px] font-semibold text-slate-600 bg-slate-100/90 hover:bg-slate-100 border border-slate-200/80 px-2 py-0.5 rounded-md w-fit mb-1 shadow-2xs tracking-wider transition-colors">
            <Barcode className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span>{product.barcode}</span>
          </div>
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
              className="text-[11px] font-medium text-emerald-700 hover:text-emerald-800 hover:underline flex items-center gap-1 transition-colors"
            >
              <MessageSquare className="w-3 h-3 text-emerald-600" />
              <span>{listItem?.note ? `Obs: "${listItem.note}"` : '+ Adicionar observação'}</span>
            </button>

            {showNoteInput && (
              <div className="overflow-hidden animate-fade-in">
                <input
                  type="text"
                  value={listItem?.note || ''}
                  onChange={(e) => onUpdateNote(product, e.target.value)}
                  placeholder="Ex: Bananas maduras..."
                  className="mt-1 w-full text-xs px-2.5 py-1 bg-white border border-emerald-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 shadow-2xs transition-all"
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Quantity / Add Controls */}
      <div className="mt-4 pt-3 border-t border-slate-100">
        {currentQty > 0 ? (
          <div className="flex items-center justify-between bg-emerald-50/90 rounded-xl p-1 border border-emerald-500/30 shadow-2xs">
            <button
              type="button"
              onClick={handleDecrease}
              className="w-8 h-8 rounded-lg bg-white text-emerald-800 hover:bg-emerald-100/80 hover:text-emerald-900 flex items-center justify-center font-bold shadow-xs transition-all duration-150 shrink-0 hover:scale-105 active:scale-85 active:ring-2 active:ring-emerald-400/50"
              title="Diminuir"
            >
              <Minus className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-1 mx-1 flex-1">
              <input
                type="number"
                step="any"
                min="0"
                value={isEditing ? inputVal : currentQty}
                onFocus={() => {
                  setIsEditing(true);
                  setInputVal(String(currentQty));
                }}
                onChange={(e) => {
                  setInputVal(e.target.value);
                  const parsed = parseFloat(e.target.value.replace(',', '.'));
                  if (!isNaN(parsed) && parsed >= 0) {
                    onUpdateQuantity(product, parsed, activeUnit, listItem?.note);
                  } else if (e.target.value === '') {
                    onUpdateQuantity(product, 0, activeUnit, listItem?.note);
                  }
                }}
                onBlur={() => {
                  setIsEditing(false);
                  const parsed = parseFloat(inputVal.replace(',', '.'));
                  if (isNaN(parsed) || parsed <= 0) {
                    onUpdateQuantity(product, 0, activeUnit, listItem?.note);
                  }
                }}
                className="w-16 sm:w-20 py-1 px-1 bg-white border border-emerald-400/80 rounded-lg text-center font-black text-xs text-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs transition-all"
                placeholder="0"
              />
              <span className="text-[11px] font-extrabold text-emerald-800 uppercase tracking-wide">
                {activeUnit === 'unid' ? 'un' : activeUnit}
              </span>
            </div>

            <button
              type="button"
              onClick={handleIncrease}
              className="w-8 h-8 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 flex items-center justify-center font-bold shadow-xs transition-all duration-150 shrink-0 hover:scale-105 active:scale-85 active:ring-2 active:ring-emerald-400/50"
              title="Aumentar"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={handleIncrease}
            className="w-full py-2 px-3 rounded-xl bg-[#001b69] hover:bg-[#00134f] text-white text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 shadow-xs hover:shadow-sm hover:scale-[1.01] active:scale-95"
          >
            <Plus className="w-4 h-4 text-[#f1b500]" />
            <span>Adicionar à Lista</span>
          </button>
        )}
      </div>
    </div>
  );
};
