import React from 'react';
import { useJobs } from '../context/JobContext';
import { useAuth } from '../context/AuthContext';
import { ANGOLAN_PROVINCES, JOB_CATEGORIES } from '../data/angolaProvinces';
import { Search, MapPin, Briefcase, Sparkles, Building2, Layers, CheckCircle2, Lock } from 'lucide-react';
import { AngolanProvince } from '../types';

interface HeroBannerProps {
  onOpenAuth: (mode?: 'login' | 'register') => void;
  onExploreClick: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onOpenAuth, onExploreClick }) => {
  const {
    searchQuery,
    setSearchQuery,
    selectedProvinces,
    setSelectedProvinces,
    selectedCategory,
    setSelectedCategory,
    jobs,
  } = useJobs();
  const { currentUser, config } = useAuth();

  const activeJobsCount = jobs.filter((j) => !j.isExpired).length;

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (!val || val === 'TODAS') {
      setSelectedProvinces([]);
    } else {
      setSelectedProvinces([val as AngolanProvince]);
    }
  };

  return (
    <div className="relative bg-[#102B55] text-white overflow-hidden border-b border-[#183C73]">
      {/* Background Decorative patterns */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#FF8A00_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"></div>
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#FF8A00]/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="text-center max-w-3xl mx-auto mb-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-white border border-white/15 text-xs font-semibold mb-4 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-[#FF8A00]" />
            <span>Plataforma Centralizada de Oportunidades em Angola</span>
            <span className="bg-[#FF8A00] text-white px-2 py-0.5 rounded-full text-[10px] font-bold">21 Províncias</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight font-display">
            Todas as Vagas Reais de Angola <br className="hidden sm:inline" />
            <span className="text-[#FF8A00]">Numa Única Aplicação</span>
          </h1>

          <p className="mt-4 text-base sm:text-lg text-slate-200 leading-relaxed font-normal">
            Reunimos anúncios de empresas petrolíferas, banca, telecomunicações, indústria e sector público. Encaminhamento directo e verificado para os sites oficiais de recrutamento.
          </p>

          {/* Key Value Badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 mt-6 text-xs sm:text-sm text-slate-300">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Sem vagas falsas</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Candidatura oficial directa</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Inscrição única de {config.subscriptionFeeKz.toLocaleString()} Kz</span>
            </div>
            <div className="flex items-center gap-1.5 bg-orange-500/20 text-[#FF8A00] px-2.5 py-0.5 rounded-full border border-orange-500/30 font-semibold">
              <Lock className="w-3.5 h-3.5" />
              <span>Candidaturas protegidas pós-pagamento</span>
            </div>
          </div>
        </div>

        {/* Search & Filter Box */}
        <div className="max-w-4xl mx-auto bg-white rounded-2xl p-4 sm:p-5 shadow-2xl border border-slate-200 text-slate-800">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            {/* Keyword Search */}
            <div className="md:col-span-5 relative">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                Cargo, Empresa ou Palavra-chave
              </label>
              <div className="relative flex items-center">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ex: Engenheiro, Sonangol, Contador, TI..."
                  className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#102B55] focus:border-transparent font-medium"
                />
              </div>
            </div>

            {/* Province Selector */}
            <div className="md:col-span-4 relative">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                Província de Angola
              </label>
              <div className="relative flex items-center">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                <select
                  value={selectedProvinces.length === 1 ? selectedProvinces[0] : 'TODAS'}
                  onChange={handleProvinceChange}
                  className="w-full pl-9 pr-8 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#102B55] focus:border-transparent font-medium appearance-none cursor-pointer truncate"
                >
                  <option value="TODAS">Toda Angola (21 Províncias)</option>
                  {ANGOLAN_PROVINCES.map((p) => (
                    <option key={p.name} value={p.name}>
                      {p.name}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 pointer-events-none text-slate-400 text-xs">▼</div>
              </div>
            </div>

            {/* Category Selector */}
            <div className="md:col-span-3 relative">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                Sector Profissional
              </label>
              <div className="relative flex items-center">
                <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full pl-9 pr-8 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#102B55] focus:border-transparent font-medium appearance-none cursor-pointer truncate"
                >
                  <option value="">Todas as Áreas</option>
                  {JOB_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 pointer-events-none text-slate-400 text-xs">▼</div>
              </div>
            </div>
          </div>

          {/* Quick filters & actions bar */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-600">
              <span className="font-semibold text-[#102B55]">{activeJobsCount} vagas activas</span>
              <span>disponíveis agora em território nacional</span>
            </div>

            <div className="flex items-center gap-2">
              {(!currentUser || currentUser.status !== 'ATIVO') && (
                <button
                  onClick={() => onOpenAuth('register')}
                  className="px-4 py-2 bg-[#FF8A00] hover:bg-[#e67a00] text-white font-bold rounded-lg transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  Criar Conta
                </button>
              )}
              <button
                onClick={onExploreClick}
                className="px-4 py-2 bg-[#102B55] hover:bg-[#0c2244] text-white font-semibold rounded-lg transition-colors flex items-center gap-1.5"
              >
                Ver Todas as Vagas
              </button>
            </div>
          </div>
        </div>

        {/* Statistical Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto mt-8">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3.5 border border-white/15 text-center">
            <p className="text-2xl sm:text-3xl font-black text-[#FF8A00]">21</p>
            <p className="text-xs text-slate-200 font-medium">Províncias Cobertas</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3.5 border border-white/15 text-center">
            <p className="text-2xl sm:text-3xl font-black text-white">{activeJobsCount}+</p>
            <p className="text-xs text-slate-200 font-medium">Oportunidades Reais</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3.5 border border-white/15 text-center">
            <p className="text-2xl sm:text-3xl font-black text-emerald-400">100%</p>
            <p className="text-xs text-slate-200 font-medium">Links Oficiais</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3.5 border border-white/15 text-center">
            <p className="text-2xl sm:text-3xl font-black text-[#FF8A00]">1.000 Kz</p>
            <p className="text-xs text-slate-200 font-medium">Inscrição Única</p>
          </div>
        </div>
      </div>
    </div>
  );
};
