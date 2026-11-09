import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { JobProvider, useJobs } from './context/JobContext';
import { NotificationProvider } from './context/NotificationContext';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { ProvinceMultiSelector } from './components/ProvinceMultiSelector';
import { JobCard } from './components/JobCard';
import { JobDetailModal } from './components/JobDetailModal';
import { PaymentActivationView } from './components/PaymentActivationView';
import { AdminDashboardView } from './components/AdminDashboardView';
import { AboutView } from './components/AboutView';
import { HowItWorksView } from './components/HowItWorksView';
import { ProvincesDirectoryView } from './components/ProvincesDirectoryView';
import { AuthModal } from './components/AuthModal';
import { NotificationsModal } from './components/NotificationsModal';
import { Footer } from './components/Footer';
import { JobVacancy, AngolanProvince } from './types';
import {
  Briefcase,
  Building2,
  Sparkles,
  SlidersHorizontal,
  X,
  CreditCard,
  Lock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

type TabType = 'vagas' | 'provincias' | 'como-funciona' | 'pagamento' | 'sobre' | 'admin';

const MainAppContent: React.FC = () => {
  const { currentUser, config } = useAuth();
  const {
    filteredJobs,
    featuredJobs,
    selectedProvinces,
    setSelectedProvinces,
    selectedCategory,
    setSelectedCategory,
    selectedSector,
    setSelectedSector,
    searchQuery,
    setSearchQuery,
    resetFilters,
  } = useJobs();

  // Navigation tab
  const [currentTab, setCurrentTab] = useState<TabType>('vagas');

  // Modals
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [notifModalOpen, setNotifModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobVacancy | null>(null);
  const [activationGateOpen, setActivationGateOpen] = useState(false);

  const isMemberActive = currentUser?.status === 'ATIVO';

  const handleOpenAuth = (mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const handleRequireActivation = () => {
    setSelectedJob(null);
    setActivationGateOpen(false);
    setCurrentTab('pagamento');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProvinceFromDirectory = (prov: AngolanProvince) => {
    setSelectedProvinces([prov]);
    setCurrentTab('vagas');
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans selection:bg-[#FF8A00]/20 selection:text-[#102B55]">
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenAuth={handleOpenAuth}
        onOpenNotifications={() => setNotifModalOpen(true)}
      />

      {/* Main View Router */}
      <main className="flex-grow">
        {/* TAB 1: VAGAS & HOMEPAGE */}
        {currentTab === 'vagas' && (
          <div>
            {/* Hero Banner */}
            <HeroBanner
              onOpenAuth={handleOpenAuth}
              onExploreClick={() => {
                const el = document.getElementById('vagas-catalogo');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            <div id="vagas-catalogo" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
              {/* Province Multi-Selector */}
              <ProvinceMultiSelector />

              {/* Spotlight / Featured Jobs Banner */}
              {featuredJobs.length > 0 && !searchQuery && selectedProvinces.length === 0 && (
                <div className="mb-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-[#FF8A00]" />
                      <h2 className="text-lg font-bold text-[#102B55] font-display">
                        Empresas em Destaque & Grandes Recrutamentos
                      </h2>
                    </div>
                    <span className="text-xs text-slate-500 font-medium">Fontes Oficiais Verificadas</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {featuredJobs.slice(0, 3).map((job) => (
                      <JobCard
                        key={job.id}
                        job={job}
                        onSelect={(j) => setSelectedJob(j)}
                        onRequireActivation={handleRequireActivation}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Main Catalog Header & Filter Bar */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm mb-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-[#102B55] font-display">
                      Todas as Oportunidades ({filteredJobs.length} encontradas)
                    </h3>
                    <p className="text-xs text-slate-500">
                      {selectedProvinces.length > 0
                        ? `Filtrado por: ${selectedProvinces.join(', ')}`
                        : 'Mostrando resultados para todas as 21 províncias de Angola'}
                    </p>
                  </div>

                  {/* Filter controls */}
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Sector Filter */}
                    <select
                      value={selectedSector}
                      onChange={(e) => setSelectedSector(e.target.value)}
                      className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:ring-1 focus:ring-[#102B55]"
                    >
                      <option value="">Todos os Sectores</option>
                      <option value="Privado">Sector Privado</option>
                      <option value="Público">Sector Público</option>
                      <option value="Misto">Sector Misto</option>
                    </select>

                    {(selectedProvinces.length > 0 || selectedCategory || selectedSector || searchQuery) && (
                      <button
                        onClick={resetFilters}
                        className="px-3 py-1.5 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors flex items-center gap-1"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Limpar Filtros</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Jobs Grid */}
              {filteredJobs.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300 p-8">
                  <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <h3 className="text-base font-bold text-[#102B55]">Nenhuma oportunidade encontrada</h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-5">
                    Não encontramos anúncios que correspondam aos filtros selecionados. Experimente pesquisar por Toda Angola ou remover categorias específicas.
                  </p>
                  <button
                    onClick={resetFilters}
                    className="px-5 py-2.5 rounded-xl bg-[#102B55] text-white text-xs font-bold hover:bg-[#FF8A00] transition-colors"
                  >
                    Restaurar Todos os Anúncios
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredJobs.map((job) => (
                    <JobCard
                      key={job.id}
                      job={job}
                      onSelect={(j) => setSelectedJob(j)}
                      onRequireActivation={handleRequireActivation}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: AS 21 PROVÍNCIAS */}
        {currentTab === 'provincias' && (
          <ProvincesDirectoryView onSelectProvince={handleSelectProvinceFromDirectory} />
        )}

        {/* TAB 3: COMO FUNCIONA */}
        {currentTab === 'como-funciona' && (
          <HowItWorksView
            onOpenAuth={handleOpenAuth}
            onGoToPayment={() => setCurrentTab('pagamento')}
            onExploreJobs={() => setCurrentTab('vagas')}
          />
        )}

        {/* TAB 4: ATIVAÇÃO & PAGAMENTO */}
        {currentTab === 'pagamento' && (
          <PaymentActivationView
            onOpenAuth={handleOpenAuth}
            onExploreJobs={() => setCurrentTab('vagas')}
          />
        )}

        {/* TAB 5: SOBRE NÓS */}
        {currentTab === 'sobre' && <AboutView />}

        {/* TAB 6: PAINEL ADMINISTRATIVO */}
        {currentTab === 'admin' && (
          <div>
            {currentUser?.role === 'admin' ? (
              <AdminDashboardView />
            ) : (
              <div className="max-w-md mx-auto my-20 p-8 bg-white rounded-3xl border border-slate-200 text-center shadow-lg">
                <ShieldCheck className="w-12 h-12 text-[#FF8A00] mx-auto mb-3" />
                <h2 className="text-lg font-bold text-[#102B55]">Acesso Restrito ao Administrador</h2>
                <p className="text-xs text-slate-600 mt-2 mb-6">
                  Esta área é de acesso exclusivo para o proprietário e fundador <strong>{config.founderName}</strong> e administradores autorizados.
                </p>
                <button
                  onClick={() => handleOpenAuth('login')}
                  className="px-6 py-2.5 rounded-xl bg-[#102B55] hover:bg-[#FF8A00] text-white text-xs font-bold transition-all shadow-md"
                >
                  Iniciar Sessão como Administrador
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer onNavigate={(tab) => setCurrentTab(tab)} />

      {/* Job Details Modal */}
      <JobDetailModal
        job={selectedJob}
        onClose={() => setSelectedJob(null)}
        onRequireActivation={handleRequireActivation}
      />

      {/* Activation Gatekeeping Modal */}
      {activationGateOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 text-center shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-14 h-14 rounded-2xl bg-orange-100 text-[#FF8A00] flex items-center justify-center mx-auto mb-4 shadow-sm">
              <Lock className="w-7 h-7" />
            </div>

            <h3 className="text-lg font-black text-[#102B55] font-display">
              {currentUser?.status === 'COMPROVATIVO_ENVIADO'
                ? 'Comprovativo em Conferência pelo Administrador'
                : 'Candidatura Exclusiva para Contas Ativadas'}
            </h3>

            <p className="text-xs text-slate-600 mt-2 mb-6 leading-relaxed">
              {currentUser?.status === 'COMPROVATIVO_ENVIADO'
                ? `O seu comprovativo foi submetido com sucesso. O fundador ${config.founderName} está a conferir o extracto bancário. Assim que for aprovado, o botão CANDIDATAR-ME será desbloqueado automaticamente.`
                : `Pode pesquisar e consultar todas as oportunidades nas 21 províncias de Angola livremente. Para aceder aos links oficiais de candidatura directa, efectue o pagamento da taxa de ${config.subscriptionFeeKz.toLocaleString()} Kz (Multicaixa Express ${config.multicaixaExpressPhone} ou BAI) e anexe o seu comprovativo.`}
            </p>

            <div className="space-y-2">
              <button
                onClick={() => {
                  setActivationGateOpen(false);
                  setCurrentTab('pagamento');
                }}
                className="w-full py-3 rounded-xl bg-[#FF8A00] hover:bg-[#e67a00] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-orange-500/25 flex items-center justify-center gap-2 cursor-pointer"
              >
                <CreditCard className="w-4 h-4" />
                <span>
                  {currentUser?.status === 'COMPROVATIVO_ENVIADO'
                    ? 'Ver Estado do Comprovativo'
                    : `Ativar Conta por ${config.subscriptionFeeKz.toLocaleString()} Kz`}
                </span>
              </button>

              {!currentUser && (
                <button
                  onClick={() => {
                    setActivationGateOpen(false);
                    handleOpenAuth('register');
                  }}
                  className="w-full py-2.5 rounded-xl text-[#102B55] bg-blue-50 hover:bg-blue-100 text-xs font-bold transition-colors cursor-pointer"
                >
                  Criar Conta / Iniciar Sessão
                </button>
              )}

              <button
                onClick={() => setActivationGateOpen(false)}
                className="w-full py-2 text-slate-400 hover:text-slate-600 text-xs font-medium"
              >
                Continuar a navegar apenas
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authModalMode}
        onRegistrationSuccess={() => {
          setCurrentTab('pagamento');
        }}
      />

      {/* Notifications Modal */}
      <NotificationsModal
        isOpen={notifModalOpen}
        onClose={() => setNotifModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <JobProvider>
        <NotificationProvider>
          <MainAppContent />
        </NotificationProvider>
      </JobProvider>
    </AuthProvider>
  );
}
