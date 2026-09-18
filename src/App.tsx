import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { CategoryNav } from './components/CategoryNav';
import { ProductCard } from './components/ProductCard';
import { CustomItemForm } from './components/CustomItemForm';
import { OrderListSidebar } from './components/OrderListSidebar';
import { PrintOrderModal } from './components/PrintOrderModal';
import { HistoryModal } from './components/HistoryModal';
import { SettingsModal } from './components/SettingsModal';
import { PWAInstallButton } from './components/PWAInstallButton';
import { OfflineIndicator } from './components/OfflineIndicator';

import { CATALOG_PRODUCTS } from './data/products';
import { 
  AppSettings, 
  CustomerDetails, 
  OrderListItem, 
  Product, 
  ProductCategory, 
  SavedOrderList 
} from './types';
import { 
  getStoredAppSettings, 
  getStoredOrderLists, 
  saveOrderListToHistory 
} from './utils/whatsapp';
import { Sparkles, Printer, FileText } from 'lucide-react';

export default function App() {
  // --- STATE ---
  const [appSettings, setAppSettings] = useState<AppSettings>(getStoredAppSettings());
  const [orderListItems, setOrderListItems] = useState<OrderListItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('todos');
  const [searchTerm, setSearchTerm] = useState('');

  const [customerDetails, setCustomerDetails] = useState<CustomerDetails>({
    name: '',
    phone: '',
    deliveryType: 'delivery',
    address: '',
    deliveryDate: '',
    generalNotes: '',
  });

  // Modals state
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [savedListsHistory, setSavedListsHistory] = useState<SavedOrderList[]>(getStoredOrderLists());

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // --- ITEM HANDLERS ---
  const handleUpdateProductQuantity = (product: Product, quantity: number, unit?: string, note?: string) => {
    const chosenUnit = unit || product.unit || 'kg';
    setOrderListItems((prev) => {
      const idx = prev.findIndex((item) => item.id === product.id);
      if (quantity <= 0) {
        if (idx > -1) {
          const next = [...prev];
          next.splice(idx, 1);
          return next;
        }
        return prev;
      }

      if (idx > -1) {
        const next = [...prev];
        next[idx] = { 
          ...next[idx], 
          quantity, 
          unit: chosenUnit, 
          note: note !== undefined ? note : next[idx].note 
        };
        return next;
      } else {
        return [
          ...prev,
          {
            id: product.id,
            name: product.name,
            category: product.category,
            quantity,
            unit: chosenUnit,
            note,
          },
        ];
      }
    });
  };

  const handleUpdateUnitById = (id: string, newUnit: string) => {
    setOrderListItems((prev) => {
      return prev.map((item) => {
        if (item.id === id) {
          return { ...item, unit: newUnit };
        }
        return item;
      });
    });
  };

  const handleUpdateNote = (product: Product, note: string) => {
    setOrderListItems((prev) => {
      return prev.map((item) => (item.id === product.id ? { ...item, note } : item));
    });
  };

  const handleAddCustomItem = (newItem: OrderListItem) => {
    setOrderListItems((prev) => [...prev, newItem]);
    showToast(`"${newItem.name}" adicionado à lista! 📝`);
  };

  const handleUpdateQuantityById = (id: string, delta: number) => {
    setOrderListItems((prev) => {
      return prev
        .map((item) => {
          if (item.id === id) {
            if (typeof item.quantity === 'number') {
              const newQty = Math.max(0, item.quantity + delta);
              return { ...item, quantity: Math.round(newQty * 100) / 100 };
            }
          }
          return item;
        })
        .filter((item) => typeof item.quantity !== 'number' || item.quantity > 0);
    });
  };

  const handleRemoveItemById = (id: string) => {
    setOrderListItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearList = () => {
    setOrderListItems([]);
  };

  const handleOpenPrintModal = () => {
    if (orderListItems.length === 0) return;

    // Save list to history
    const saved: SavedOrderList = {
      id: Math.floor(1000 + Math.random() * 9000).toString(),
      createdAt: new Date().toISOString(),
      customerDetails,
      items: orderListItems,
    };

    saveOrderListToHistory(saved);
    setSavedListsHistory((prev) => [saved, ...prev]);

    setIsPrintModalOpen(true);
  };

  const handleLoadSavedList = (savedList: SavedOrderList) => {
    setOrderListItems(savedList.items);
    setCustomerDetails(savedList.customerDetails);
    showToast('Lista carregada com sucesso na tela! 📋');
  };

  // --- FILTERED PRODUCTS ---
  const filteredProducts = useMemo(() => {
    return CATALOG_PRODUCTS.filter((prod) => {
      const matchesSearch =
        searchTerm === '' ||
        prod.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prod.category.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCat =
        selectedCategory === 'todos' || prod.category === selectedCategory;

      return matchesSearch && matchesCat;
    });
  }, [selectedCategory, searchTerm]);

  // Counts map
  const categoryCounts = useMemo(() => {
    const map: Record<ProductCategory, number> = {
      todos: CATALOG_PRODUCTS.length,
      frutas: 0,
      verduras: 0,
      legumes: 0,
      laticinios: 0,
      acougue: 0,
      bebidas: 0,
      mercearia: 0,
      limpeza: 0,
    };
    CATALOG_PRODUCTS.forEach((p) => {
      if (map[p.category] !== undefined) {
        map[p.category] += 1;
      }
    });
    return map;
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900 flex flex-col selection:bg-slate-900 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl text-xs sm:text-sm font-bold flex items-center gap-2 animate-bounce border border-slate-700 print:hidden">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <Header
        appSettings={appSettings}
        listCount={orderListItems.length}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onOpenPrint={handleOpenPrintModal}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onClearList={handleClearList}
      />

      {/* Category Nav */}
      <CategoryNav
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        itemsCountMap={categoryCounts}
      />

      {/* Main Layout Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full space-y-6">
        {/* PWA Mobile App Banner */}
        <PWAInstallButton variant="banner" />

        {/* Custom Item Adder Box */}
        <CustomItemForm onAddCustomItem={handleAddCustomItem} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Left / Main Column: Products Catalog Grid */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2.5 print:hidden">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 uppercase tracking-tight flex items-center gap-2">
                <span>Catálogo de Produtos</span>
                <span className="text-xs font-normal text-slate-500">
                  (Sem preços — selecione os produtos para compor a lista)
                </span>
              </h2>
              <span className="text-xs text-slate-500 font-semibold">
                {filteredProducts.length} itens
              </span>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 text-slate-500 space-y-2">
                <p className="font-bold">Nenhum produto encontrado na busca "{searchTerm}".</p>
                <p className="text-xs">Você pode usar o campo de item personalizado acima para inserir qualquer produto manualmente!</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {filteredProducts.map((product) => {
                  const listItem = orderListItems.find((i) => i.id === product.id);
                  return (
                    <ProductCard
                      key={product.id}
                      product={product}
                      listItem={listItem}
                      onUpdateQuantity={handleUpdateProductQuantity}
                      onUpdateNote={handleUpdateNote}
                    />
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column: Active Order List Sidebar */}
          <div className="lg:col-span-1 sticky top-[160px] sm:top-[132px]">
            <OrderListSidebar
              items={orderListItems}
              customerDetails={customerDetails}
              setCustomerDetails={setCustomerDetails}
              appSettings={appSettings}
              onUpdateQuantity={handleUpdateQuantityById}
              onUpdateUnit={handleUpdateUnitById}
              onRemoveItem={handleRemoveItemById}
              onClearList={handleClearList}
              onOpenPrintModal={handleOpenPrintModal}
            />
          </div>
        </div>
      </main>

      {/* Floating Bottom Button on Mobile when list has items */}
      {orderListItems.length > 0 && (
        <div className="fixed bottom-4 left-4 right-4 z-40 lg:hidden print:hidden">
          <button
            onClick={handleOpenPrintModal}
            className="w-full bg-slate-900 text-white font-black py-3.5 px-5 rounded-2xl shadow-2xl flex items-center justify-between border border-slate-700 active:scale-98"
          >
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 font-extrabold text-xs flex items-center justify-center">
                {orderListItems.length}
              </span>
              <span className="text-xs font-bold uppercase">Gerar Ficha / Imprimir Lista</span>
            </div>

            <div className="flex items-center gap-1.5 bg-emerald-500 text-slate-950 px-3 py-1.5 rounded-xl text-xs font-bold">
              <Printer className="w-4 h-4" />
              <span>Imprimir</span>
            </div>
          </button>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-6 text-center text-xs text-slate-500 print:hidden">
        <p className="font-semibold text-slate-700">
          {appSettings.companyName} — Sistema de Montagem de Pedidos para Impressão
        </p>
        <p className="text-slate-400 mt-1">
          Sem preços nem carrinho de compras. Crie listas, ordene e imprima fichas de separação para o depósito.
        </p>
      </footer>

      {/* Modals */}
      <PrintOrderModal
        isOpen={isPrintModalOpen}
        customerDetails={customerDetails}
        items={orderListItems}
        appSettings={appSettings}
        onClose={() => setIsPrintModalOpen(false)}
      />

      <HistoryModal
        isOpen={isHistoryOpen}
        lists={savedListsHistory}
        onClose={() => setIsHistoryOpen(false)}
        onLoadList={handleLoadSavedList}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        settings={appSettings}
        onClose={() => setIsSettingsOpen(false)}
        onSave={(newSettings) => {
          setAppSettings(newSettings);
          showToast('Configurações atualizadas!');
        }}
      />

      <OfflineIndicator />
    </div>
  );
}
