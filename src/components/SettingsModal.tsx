import React, { useState } from 'react';
import { X, Save, Settings, Phone, Building } from 'lucide-react';
import { AppSettings } from '../types';
import { saveAppSettings } from '../utils/whatsapp';

interface SettingsModalProps {
  isOpen: boolean;
  settings: AppSettings;
  onClose: () => void;
  onSave: (newSettings: AppSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  settings,
  onClose,
  onSave,
}) => {
  if (!isOpen) return null;

  const [form, setForm] = useState<AppSettings>({ ...settings });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveAppSettings(form);
    onSave(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in print:hidden">
      <div 
        className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-slate-200 animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Settings className="w-6 h-6 text-emerald-400" />
            <div>
              <h2 className="font-bold text-lg leading-tight">Configurações do Cabeçalho</h2>
              <p className="text-xs text-slate-300">Personalize o título para impressão e WhatsApp</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-white transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1 flex items-center gap-1">
              <Building className="w-3.5 h-3.5 text-slate-500" />
              Nome da Empresa / Distribuidora
            </label>
            <input
              type="text"
              required
              value={form.companyName}
              onChange={(e) => setForm({ ...form, companyName: e.target.value })}
              placeholder="Ex: Hortifruti São José"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl text-sm font-medium focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1 flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-slate-500" />
              Telefone WhatsApp Receptor (com DDD)
            </label>
            <input
              type="text"
              required
              value={form.whatsappNumber}
              onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value.replace(/\D/g, '') })}
              placeholder="5511999998888"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl text-sm font-mono focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Subtítulo do Cabeçalho
            </label>
            <input
              type="text"
              value={form.headerSubtitle}
              onChange={(e) => setForm({ ...form, headerSubtitle: e.target.value })}
              placeholder="Ex: Montador de Ficha de Pedido e Separação"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl text-sm focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Instruções de Impressão (Rodapé do papel)
            </label>
            <textarea
              rows={2}
              value={form.printInstructions}
              onChange={(e) => setForm({ ...form, printInstructions: e.target.value })}
              placeholder="Ex: Marque com um X os produtos conforme colher na prateleira."
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl text-xs focus:outline-none"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-2xl font-bold text-slate-950 bg-emerald-500 hover:bg-emerald-400 shadow-md transition flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              <span>Salvar Configurações</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
