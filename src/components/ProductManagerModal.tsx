import React, { useState } from 'react';
import { X, Plus, Search, Edit2, Trash2, RotateCcw, Package, Check, AlertCircle } from 'lucide-react';
import { Product, ProductCategory, UnitType } from '../types';

interface ProductManagerModalProps {
  isOpen: boolean;
  products: Product[];
  onClose: () => void;
  onAddProduct: (product: Omit<Product, 'id'>) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onResetProducts: () => void;
}

const CATEGORY_LABELS: Record<ProductCategory, string> = {
  todos: 'Todas as Categorias',
  frutas: 'Frutas',
  verduras: 'Verduras',
  legumes: 'Legumes',
  laticinios: 'Laticínios & Ovos',
  acougue: 'Açougue & Carnes',
  bebidas: 'Bebidas',
  mercearia: 'Mercearia',
  limpeza: 'Limpeza',
};

const UNIT_OPTIONS: UnitType[] = ['kg', 'g', 'unid', 'maço', 'dz', 'pct', 'L', 'caixa'];

const COMMON_EMOJIS = ['🍎', '🍌', '🍊', '🍓', '🍇', '🍉', '🍍', '🥭', '🥑', '🥦', '🥬', '🌽', '🥒', '🍅', '🥕', '🥔', '🧅', '🧄', '🥚', '🥛', '🧀', '🥩', '🍗', '🌭', '🌾', '🫘', '☕', '🍞', '🥤', '💧', '🧼', '📦'];

export const ProductManagerModal: React.FC<ProductManagerModalProps> = ({
  isOpen,
  products,
  onClose,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onResetProducts,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('todos');
  
  // Editing or Creating state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form Fields
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<ProductCategory>('frutas');
  const [formUnit, setFormUnit] = useState<UnitType>('kg');
  const [formStep, setFormStep] = useState<number>(1);
  const [formIcon, setFormIcon] = useState('📦');
  const [formError, setFormError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleOpenAddForm = () => {
    setEditingProduct(null);
    setFormName('');
    setFormCategory('frutas');
    setFormUnit('kg');
    setFormStep(1);
    setFormIcon('📦');
    setFormError(null);
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (product: Product) => {
    setEditingProduct(product);
    setFormName(product.name);
    setFormCategory(product.category);
    setFormUnit(product.unit);
    setFormStep(product.step || 1);
    setFormIcon(product.icon || '📦');
    setFormError(null);
    setIsFormOpen(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      setFormError('Por favor, informe o nome do produto.');
      return;
    }

    if (editingProduct) {
      onUpdateProduct({
        ...editingProduct,
        name: formName.trim(),
        category: formCategory,
        unit: formUnit,
        step: formStep > 0 ? formStep : 1,
        minQty: formStep > 0 ? formStep : 1,
        icon: formIcon.trim() || '📦',
      });
    } else {
      onAddProduct({
        name: formName.trim(),
        category: formCategory,
        unit: formUnit,
        step: formStep > 0 ? formStep : 1,
        minQty: formStep > 0 ? formStep : 1,
        icon: formIcon.trim() || '📦',
      });
    }

    setIsFormOpen(false);
  };

  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'todos' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/65 backdrop-blur-xs animate-fade-in overflow-y-auto print:hidden">
      <div 
        className="bg-white w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl flex flex-col my-auto max-h-[92vh] border border-gray-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-600/30 text-indigo-400 border border-indigo-500/20">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold text-lg sm:text-xl leading-tight">Cadastrar e Editar Produtos</h2>
              <p className="text-xs text-slate-300">
                Gerencie o catálogo de produtos exibidos no aplicativo ({products.length} cadastrados)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenAddForm}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Novo Produto</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-800 text-white transition ml-1"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-slate-50">
          {/* Top Filter & Actions Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
            {/* Search */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar produto cadastrado..."
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as ProductCategory)}
                className="w-full sm:w-auto px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {(Object.keys(CATEGORY_LABELS) as ProductCategory[]).map((cat) => (
                  <option key={cat} value={cat}>
                    {CATEGORY_LABELS[cat]}
                  </option>
                ))}
              </select>

              <button
                onClick={() => {
                  if (window.confirm('Tem certeza que deseja restaurar o catálogo de produtos padrão? Suas alterações salvas serão resetadas.')) {
                    onResetProducts();
                  }
                }}
                className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium text-xs rounded-xl transition flex items-center gap-1 shrink-0"
                title="Restaurar catálogo inicial"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Restaurar Padrão</span>
              </button>
            </div>
          </div>

          {/* Product List Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            {filteredProducts.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                <Package className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                <p className="font-semibold text-sm">Nenhum produto encontrado</p>
                <p className="text-xs text-slate-400 mt-1">
                  {searchTerm || selectedCategory !== 'todos'
                    ? 'Tente alterar os filtros de busca'
                    : 'Clique em "+ Novo Produto" para cadastrar'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[11px] border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Ícone</th>
                      <th className="py-2.5 px-3">Nome do Produto</th>
                      <th className="py-2.5 px-3">Categoria</th>
                      <th className="py-2.5 px-3 text-center">Unidade</th>
                      <th className="py-2.5 px-3 text-center">Passo/Mín.</th>
                      <th className="py-2.5 px-3 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-2 px-3 text-xl">{p.icon || '📦'}</td>
                        <td className="py-2 px-3 font-semibold text-slate-900">{p.name}</td>
                        <td className="py-2 px-3">
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium text-[11px] border border-slate-200">
                            {CATEGORY_LABELS[p.category] || p.category}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-center font-bold text-slate-800">{p.unit}</td>
                        <td className="py-2 px-3 text-center text-slate-600 font-medium">{p.step || 1}</td>
                        <td className="py-2 px-3 text-right space-x-1">
                          <button
                            onClick={() => handleOpenEditForm(p)}
                            className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                            title="Editar Produto"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Deseja remover "${p.name}" do catálogo?`)) {
                                onDeleteProduct(p.id);
                              }
                            }}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition"
                            title="Excluir Produto"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            {filteredProducts.length} de {products.length} produtos exibidos
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl transition"
          >
            Fechar
          </button>
        </div>
      </div>

      {/* INNER FORM MODAL (Add / Edit) */}
      {isFormOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-3 bg-black/75 backdrop-blur-xs animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-5 border border-slate-200 animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <h3 className="font-bold text-slate-900 text-base">
                {editingProduct ? 'Editar Produto' : 'Cadastrar Novo Produto'}
              </h3>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mb-3 p-2.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSaveForm} className="space-y-3.5">
              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nome do Produto *
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Ex: Manga Palmer, Abobrinha..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  autoFocus
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Categoria
                </label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value as ProductCategory)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {(Object.keys(CATEGORY_LABELS) as ProductCategory[])
                    .filter((c) => c !== 'todos')
                    .map((cat) => (
                      <option key={cat} value={cat}>
                        {CATEGORY_LABELS[cat]}
                      </option>
                    ))}
                </select>
              </div>

              {/* Grid: Unit and Step */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Unidade de Medida
                  </label>
                  <select
                    value={formUnit}
                    onChange={(e) => setFormUnit(e.target.value as UnitType)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {UNIT_OPTIONS.map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Passo de Qtd. (Ex: 0.5)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={formStep}
                    onChange={(e) => setFormStep(parseFloat(e.target.value) || 1)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Icon / Emoji Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Ícone / Emoji
                </label>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl p-2 bg-slate-100 rounded-xl border border-slate-200">
                    {formIcon || '📦'}
                  </span>
                  <input
                    type="text"
                    value={formIcon}
                    onChange={(e) => setFormIcon(e.target.value)}
                    placeholder="Digite um emoji..."
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Quick Emoji Picker */}
                <div className="flex flex-wrap gap-1.5 p-2 bg-slate-50 border border-slate-200 rounded-xl max-h-24 overflow-y-auto">
                  {COMMON_EMOJIS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setFormIcon(emoji)}
                      className={`w-7 h-7 text-sm rounded-lg hover:bg-slate-200 transition flex items-center justify-center ${
                        formIcon === emoji ? 'bg-indigo-100 ring-2 ring-indigo-500' : ''
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Form Actions */}
              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-bold transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Salvar Produto</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
