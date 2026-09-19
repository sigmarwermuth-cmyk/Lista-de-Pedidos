import React, { useState } from 'react';
import { PlusCircle, Sparkles } from 'lucide-react';
import { OrderListItem } from '../types';

interface CustomItemFormProps {
  onAddCustomItem: (item: OrderListItem) => void;
}

export const CustomItemForm: React.FC<CustomItemFormProps> = ({ onAddCustomItem }) => {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [unit, setUnit] = useState('unid');
  const [note, setNote] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newItem: OrderListItem = {
      id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      name: name.trim(),
      category: 'Outros',
      quantity: quantity.trim() || '1',
      unit: unit.trim(),
      note: note.trim() || undefined,
      isCustom: true,
    };

    onAddCustomItem(newItem);
    setName('');
    setQuantity('1');
    setNote('');
  };

  return (
    <div className="bg-gradient-to-r from-[#001b69] via-[#00247a] to-[#001b69] text-white rounded-3xl p-5 shadow-lg border border-[#002c8f]">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-5 h-5 text-[#f1b500]" />
        <h3 className="font-bold text-sm sm:text-base text-white">
          Não encontrou no catálogo? Adicione qualquer item personalizado
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="sm:col-span-2">
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nome do produto (ex: Carvão 5kg, Hortelã maço...)"
            className="w-full px-3.5 py-2.5 bg-[#001248]/90 border border-[#002888] focus:border-[#008d36] rounded-xl text-xs sm:text-sm text-white placeholder-sky-200/60 focus:outline-none"
          />
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Qtd (ex: 2)"
            className="w-20 px-3 py-2.5 bg-[#001248]/90 border border-[#002888] focus:border-[#008d36] rounded-xl text-xs sm:text-sm text-white text-center focus:outline-none font-bold"
          />

          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="flex-1 px-2 py-2.5 bg-[#001248]/90 border border-[#002888] focus:border-[#008d36] rounded-xl text-xs text-white focus:outline-none font-medium"
          >
            <option value="unid">unid</option>
            <option value="kg">kg</option>
            <option value="maço">maço</option>
            <option value="dz">dz</option>
            <option value="pct">pct</option>
            <option value="L">L</option>
            <option value="caixa">caixa</option>
          </select>
        </div>

        <div>
          <button
            type="submit"
            className="w-full h-full py-2.5 px-4 bg-[#008d36] hover:bg-[#00732d] text-white font-black text-xs sm:text-sm rounded-xl transition shadow-md flex items-center justify-center gap-1.5 active:scale-98"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Inserir na Lista</span>
          </button>
        </div>
      </form>
    </div>
  );
};
