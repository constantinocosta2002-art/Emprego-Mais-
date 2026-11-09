import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useJobs } from '../context/JobContext';
import { useNotifications } from '../context/NotificationContext';
import { ANGOLAN_PROVINCES, ALL_PROVINCES, JOB_CATEGORIES } from '../data/angolaProvinces';
import { AngolanProvince, JobCategory, JobVacancy, PaymentProof, User } from '../types';
import { StorageService } from '../utils/storage';
import {
  ShieldCheck,
  Users,
  CreditCard,
  Briefcase,
  RefreshCw,
  Settings,
  Database,
  Search,
  Check,
  X,
  Eye,
  AlertTriangle,
  Download,
  Upload,
  Plus,
  Trash2,
  Edit,
  ExternalLink,
  MapPin,
  TrendingUp,
  DollarSign,
  FileText,
  Lock,
  Unlock,
  Building2,
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';

export const AdminDashboardView: React.FC = () => {
  const {
    currentUser,
    users,
    config,
    approveUserPayment,
    rejectUserPayment,
    toggleUserSuspension,
    updatePlatformConfig,
    exportDatabase,
    importDatabase,
  } = useAuth();

  const {
    jobs,
    feeds,
    syncFeeds,
    isSyncing,
    addJob,
    updateJob,
    deleteJob,
  } = useJobs();

  const { sendCustomNotification } = useNotifications();

  // Active Admin Tab
  const [activeTab, setActiveTab] = useState<
    'metricas' | 'pagamentos' | 'candidatos' | 'vagas' | 'fontes' | 'config' | 'auditoria'
  >('metricas');

  // Search & Filters in admin
  const [userSearch, setUserSearch] = useState('');
  const [userStatusFilter, setUserStatusFilter] = useState<string>('TODOS');
  const [jobSearch, setJobSearch] = useState('');

  // Selected proof for modal
  const [previewProof, setPreviewProof] = useState<{
    user: User;
    proof: PaymentProof;
  } | null>(null);

  // Reject modal state
  const [rejectModalUser, setRejectModalUser] = useState<User | null>(null);
  const [rejectionReason, setRejectionReason] = useState('Comprovativo ilegível ou montante não creditado.');

  // New Job Modal state
  const [showNewJobModal, setShowNewJobModal] = useState(false);
  const [newJobData, setNewJobData] = useState({
    title: '',
    company: '',
    description: '',
    requirements: '',
    experienceLevel: '2 a 4 anos de experiência',
    documentsRequired: 'Cópia do BI, Curriculum Vitae, Certificado de Habilitações',
    province: 'Luanda' as AngolanProvince,
    municipality: 'Luanda',
    deadline: '2026-12-31',
    sourceName: 'Publicação Oficial Direta',
    officialApplyUrl: 'https://',
    category: 'Petróleo & Gás' as JobCategory,
    contractType: 'Tempo Inteiro' as const,
    sector: 'Privado' as const,
    salaryInfo: 'A combinar',
    isFeatured: false,
  });

  // Config form state
  const [configForm, setConfigForm] = useState(config);
  const [configSaveSuccess, setConfigSaveSuccess] = useState(false);

  // Sync result feedback
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  // Calculated Metrics
  const totalUsers = users.length;
  const activeMembers = users.filter((u) => u.status === 'ATIVO').length;
  const pendingApprovals = users.filter((u) => u.status === 'COMPROVATIVO_ENVIADO').length;
  const pendingPaymentUsers = users.filter((u) => u.status === 'PENDENTE_PAGAMENTO').length;
  const totalRevenueKz = activeMembers * config.subscriptionFeeKz;

  const totalActiveJobs = jobs.filter((j) => !j.isExpired).length;
  const totalExpiredJobs = jobs.filter((j) => j.isExpired).length;

  // Jobs distribution by province
  const jobsByProvince = React.useMemo(() => {
    const map: Record<string, number> = {};
    ALL_PROVINCES.forEach((p) => (map[p] = 0));
    jobs.forEach((j) => {
      if (!j.isExpired) {
        map[j.province] = (map[j.province] || 0) + 1;
      }
    });
    return map;
  }, [jobs]);

  // Candidates with pending proofs
  const pendingProofUsers = users.filter((u) => u.status === 'COMPROVATIVO_ENVIADO' && u.paymentProof);

  // Filtered users
  const filteredUsers = users.filter((u) => {
    if (userStatusFilter !== 'TODOS' && u.status !== userStatusFilter) return false;
    if (userSearch.trim()) {
      const q = userSearch.toLowerCase();
      const matchName = u.fullName.toLowerCase().includes(q);
      const matchEmail = u.email.toLowerCase().includes(q);
      const matchPhone = u.phone.includes(q);
      const matchProv = u.province.toLowerCase().includes(q);
      return matchName || matchEmail || matchPhone || matchProv;
    }
    return true;
  });

  // Filtered jobs
  const filteredJobsAdmin = jobs.filter((j) => {
    if (!jobSearch.trim()) return true;
    const q = jobSearch.toLowerCase();
    return (
      j.title.toLowerCase().includes(q) ||
      j.company.toLowerCase().includes(q) ||
      j.province.toLowerCase().includes(q) ||
      j.category.toLowerCase().includes(q)
    );
  });

  const handleSyncAll = async () => {
    setSyncFeedback(null);
    const result = await syncFeeds();
    setSyncFeedback(result.message);
  };

  const handleConfigSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updatePlatformConfig(configForm);
    setConfigSaveSuccess(true);
    setTimeout(() => setConfigSaveSuccess(false), 3000);
  };

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    const reqList = newJobData.requirements
      .split('\n')
      .map((r) => r.trim())
      .filter((r) => r.length > 0);
    const docList = newJobData.documentsRequired
      .split(',')
      .map((d) => d.trim())
      .filter((d) => d.length > 0);

    const res = addJob({
      title: newJobData.title.trim(),
      company: newJobData.company.trim(),
      description: newJobData.description.trim(),
      requirements: reqList.length > 0 ? reqList : ['Qualificação compatível com a função'],
      experienceLevel: newJobData.experienceLevel,
      documentsRequired: docList.length > 0 ? docList : ['Bilhete de Identidade', 'Curriculum Vitae'],
      province: newJobData.province,
      municipality: newJobData.municipality.trim(),
      deadline: newJobData.deadline,
      sourceName: newJobData.sourceName,
      officialApplyUrl: newJobData.officialApplyUrl.trim(),
      category: newJobData.category,
      contractType: newJobData.contractType,
      sector: newJobData.sector,
      salaryInfo: newJobData.salaryInfo,
      isFeatured: newJobData.isFeatured,
    });

    if (res.success) {
      setShowNewJobModal(false);
      setNewJobData({
        title: '',
        company: '',
        description: '',
        requirements: '',
        experienceLevel: '2 a 4 anos de experiência',
        documentsRequired: 'Cópia do BI, Curriculum Vitae, Certificado de Habilitações',
        province: 'Luanda',
        municipality: 'Luanda',
        deadline: '2026-12-31',
        sourceName: 'Publicação Oficial Direta',
        officialApplyUrl: 'https://',
        category: 'Petróleo & Gás',
        contractType: 'Tempo Inteiro',
        sector: 'Privado',
        salaryInfo: 'A combinar',
        isFeatured: false,
      });
    }
  };

  const handleExportBackup = () => {
    const json = exportDatabase();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_emprego_plus_${new Date().toISOString().substring(0, 10)}.json`;
    a.click();
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const ok = importDatabase(reader.result as string);
      if (ok) {
        alert('Cópia de segurança restaurada com sucesso!');
      } else {
        alert('Erro ao restaurar a cópia de segurança. Ficheiro inválido.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Admin Top Header */}
      <div className="bg-[#102B55] text-white rounded-3xl p-6 sm:p-8 shadow-xl mb-8 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 text-[#FF8A00] border border-orange-500/30 text-xs font-bold mb-3">
              <ShieldCheck className="w-4 h-4" />
              <span>Acesso Exclusivo à Administração & Direção Geral</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-display text-white">
              Painel de Gestão Central — EMPREGO+
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Proprietário & Fundador Responsável: <strong className="text-white font-bold">{config.founderName}</strong>. Monitorização em tempo real de pagamentos, candidatos e recolha automática de vagas nas 21 províncias de Angola.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleSyncAll}
              disabled={isSyncing}
              className="px-4 py-2.5 rounded-xl bg-[#FF8A00] hover:bg-[#e67a00] text-white text-xs font-bold transition-all shadow-md flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'A Sincronizar Fontes...' : 'Sincronizar Vagas Agora'}</span>
            </button>

            <button
              onClick={handleExportBackup}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Backup Geral (JSON)</span>
            </button>
          </div>
        </div>
      </div>

      {syncFeedback && (
        <div className="mb-6 p-4 rounded-2xl bg-blue-50 border border-blue-200 text-xs text-[#102B55] flex items-center justify-between">
          <span>{syncFeedback}</span>
          <button onClick={() => setSyncFeedback(null)} className="text-slate-400 hover:text-slate-600 font-bold">
            ✕
          </button>
        </div>
      )}

      {/* Admin Tab Navigation */}
      <div className="flex overflow-x-auto gap-2 pb-2 mb-6 border-b border-slate-200 text-xs font-bold scrollbar-none">
        <button
          onClick={() => setActiveTab('metricas')}
          className={`px-4 py-2.5 rounded-xl transition-all shrink-0 flex items-center gap-2 ${
            activeTab === 'metricas'
              ? 'bg-[#102B55] text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <TrendingUp className="w-4 h-4 text-[#FF8A00]" />
          <span>Estatísticas & Métricas</span>
        </button>

        <button
          onClick={() => setActiveTab('pagamentos')}
          className={`px-4 py-2.5 rounded-xl transition-all shrink-0 flex items-center gap-2 relative ${
            activeTab === 'pagamentos'
              ? 'bg-[#102B55] text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <CreditCard className="w-4 h-4 text-[#FF8A00]" />
          <span>Validação de Pagamentos</span>
          {pendingApprovals > 0 && (
            <span className="bg-[#FF8A00] text-white text-[10px] font-black px-2 py-0.2 rounded-full animate-pulse">
              {pendingApprovals}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('candidatos')}
          className={`px-4 py-2.5 rounded-xl transition-all shrink-0 flex items-center gap-2 ${
            activeTab === 'candidatos'
              ? 'bg-[#102B55] text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Users className="w-4 h-4 text-[#FF8A00]" />
          <span>Candidatos ({totalUsers})</span>
        </button>

        <button
          onClick={() => setActiveTab('vagas')}
          className={`px-4 py-2.5 rounded-xl transition-all shrink-0 flex items-center gap-2 ${
            activeTab === 'vagas'
              ? 'bg-[#102B55] text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Briefcase className="w-4 h-4 text-[#FF8A00]" />
          <span>Gestão de Vagas ({jobs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('fontes')}
          className={`px-4 py-2.5 rounded-xl transition-all shrink-0 flex items-center gap-2 ${
            activeTab === 'fontes'
              ? 'bg-[#102B55] text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <RefreshCw className="w-4 h-4 text-[#FF8A00]" />
          <span>Recolha Automática ({feeds.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('config')}
          className={`px-4 py-2.5 rounded-xl transition-all shrink-0 flex items-center gap-2 ${
            activeTab === 'config'
              ? 'bg-[#102B55] text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Settings className="w-4 h-4 text-[#FF8A00]" />
          <span>Coordenadas Bancárias & Tarifas</span>
        </button>

        <button
          onClick={() => setActiveTab('auditoria')}
          className={`px-4 py-2.5 rounded-xl transition-all shrink-0 flex items-center gap-2 ${
            activeTab === 'auditoria'
              ? 'bg-[#102B55] text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Database className="w-4 h-4 text-[#FF8A00]" />
          <span>Auditoria & Backups</span>
        </button>
      </div>

      {/* TAB 1: METRICAS */}
      {activeTab === 'metricas' && (
        <div className="space-y-6">
          {/* Key Metric cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Receita Total Arrecadada
              </span>
              <p className="text-2xl font-black text-[#102B55] mt-1 font-display">
                {totalRevenueKz.toLocaleString()} Kz
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                Calculado com base em {activeMembers} contas ativas x {config.subscriptionFeeKz.toLocaleString()} Kz
              </p>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Contas Aprovadas & Ativas
              </span>
              <p className="text-2xl font-black text-emerald-600 mt-1 font-display">
                {activeMembers}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                Acesso total a candidaturas concedido
              </p>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Pagamentos a Aguardar Validação
              </span>
              <p className="text-2xl font-black text-[#FF8A00] mt-1 font-display">
                {pendingApprovals}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                Comprovativos submetidos para conferência
              </p>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Total de Vagas Activas
              </span>
              <p className="text-2xl font-black text-[#102B55] mt-1 font-display">
                {totalActiveJobs}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                {totalExpiredJobs} anúncios expirados catalogados
              </p>
            </div>
          </div>

          {/* Vagas por Província (21 Províncias de Angola) */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-[#102B55] flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#FF8A00]" />
                Distribuição Territorial de Oportunidades (21 Províncias de Angola)
              </h3>
              <span className="text-xs text-slate-500 font-medium">Divisão Político-Administrativa Oficial</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
              {ANGOLAN_PROVINCES.map((prov) => {
                const count = jobsByProvince[prov.name] || 0;
                return (
                  <div
                    key={prov.name}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center"
                  >
                    <p className="text-xs font-bold text-[#102B55] truncate" title={prov.name}>
                      {prov.name}
                    </p>
                    <p className="text-lg font-black text-[#FF8A00] mt-1">{count}</p>
                    <p className="text-[10px] text-slate-400">vagas activas</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PAGAMENTOS & COMPROVATIVOS */}
      {activeTab === 'pagamentos' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-[#102B55]">
                  Fila de Aprovação de Pagamentos ({pendingProofUsers.length} pendentes)
                </h3>
                <p className="text-xs text-slate-500">
                  Validação real e manual obrigatória. Apenas o administrador ({config.founderName}) pode aprovar os candidatos.
                </p>
              </div>
            </div>

            {pendingProofUsers.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <CheckCircle2Icon className="w-12 h-12 text-emerald-500 mx-auto mb-2 opacity-60" />
                <p className="text-sm font-bold text-slate-700">Tudo em dia!</p>
                <p className="text-xs text-slate-400 mt-1">Não existem comprovativos pendentes de validação no momento.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] border-b border-slate-200">
                    <tr>
                      <th className="p-3">Candidato</th>
                      <th className="p-3">Província</th>
                      <th className="p-3">Método & Montante</th>
                      <th className="p-3">Ref. / Data Envio</th>
                      <th className="p-3">Comprovativo</th>
                      <th className="p-3 text-right">Acções do Administrador</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {pendingProofUsers.map((u) => {
                      const proof = u.paymentProof!;
                      return (
                        <tr key={u.id} className="hover:bg-slate-50/80">
                          <td className="p-3">
                            <strong className="text-slate-800 block text-xs">{u.fullName}</strong>
                            <span className="text-[11px] text-slate-500">{u.email}</span>
                            <span className="block text-[11px] text-slate-400">{u.phone}</span>
                          </td>
                          <td className="p-3 font-semibold text-slate-700">
                            {u.province} ({u.municipality})
                          </td>
                          <td className="p-3">
                            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-[#102B55] mb-0.5">
                              {proof.method === 'MULTICAIXA_EXPRESS' ? 'Multicaixa Express' : 'Transferência BAI'}
                            </span>
                            <strong className="block text-slate-800">{proof.amountKz.toLocaleString()} Kz</strong>
                          </td>
                          <td className="p-3 text-slate-600">
                            <span className="font-mono text-[11px] block">{proof.referenceCode || 'Sem ref. manual'}</span>
                            <span className="text-[10px] text-slate-400">{proof.submittedAt}</span>
                          </td>
                          <td className="p-3">
                            <button
                              onClick={() => setPreviewProof({ user: u, proof })}
                              className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-[#102B55] font-bold text-[11px] flex items-center gap-1.5 transition-colors"
                            >
                              <Eye className="w-3.5 h-3.5 text-[#FF8A00]" />
                              <span>Ver Ficheiro ({proof.fileType.toUpperCase()})</span>
                            </button>
                          </td>
                          <td className="p-3 text-right space-x-2">
                            <button
                              onClick={() => setRejectModalUser(u)}
                              className="px-3 py-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold text-xs transition-colors"
                            >
                              Rejeitar
                            </button>
                            <button
                              onClick={() => approveUserPayment(u.id)}
                              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-colors"
                            >
                              Aprovar & Ativar
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: CANDIDATOS */}
      {activeTab === 'candidatos' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Pesquisar por nome, email ou província..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#102B55]"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={userStatusFilter}
                onChange={(e) => setUserStatusFilter(e.target.value)}
                className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
              >
                <option value="TODOS">Todos os Estados</option>
                <option value="ATIVO">Ativos</option>
                <option value="COMPROVATIVO_ENVIADO">Comprovativo Enviado</option>
                <option value="PENDENTE_PAGAMENTO">Pendente Pagamento</option>
                <option value="SUSPENSO">Suspensos</option>
                <option value="REJEITADO">Rejeitados</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] border-b border-slate-200">
                <tr>
                  <th className="p-3">Nome / Contacto</th>
                  <th className="p-3">Localidade</th>
                  <th className="p-3">Perfil</th>
                  <th className="p-3">Estado</th>
                  <th className="p-3">Data Registo</th>
                  <th className="p-3 text-right">Gestão</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/80">
                    <td className="p-3">
                      <strong className="text-slate-800 block text-xs">{u.fullName}</strong>
                      <span className="text-[11px] text-slate-500">{u.email}</span>
                      <span className="block text-[11px] text-slate-400">{u.phone}</span>
                    </td>
                    <td className="p-3">
                      <span className="font-semibold text-slate-700">{u.province}</span>
                      <span className="text-slate-400 block text-[11px]">{u.municipality}</span>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        u.role === 'admin' ? 'bg-[#FF8A00] text-white' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {u.role === 'admin' ? 'Administrador' : 'Candidato'}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        u.status === 'ATIVO'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : u.status === 'COMPROVATIVO_ENVIADO'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : u.status === 'SUSPENSO'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="p-3 text-slate-500 text-[11px]">{u.registeredAt}</td>
                    <td className="p-3 text-right">
                      {u.role !== 'admin' && (
                        <button
                          onClick={() => toggleUserSuspension(u.id)}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                            u.status === 'SUSPENSO'
                              ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                              : 'bg-slate-100 text-slate-700 hover:bg-rose-50 hover:text-rose-700'
                          }`}
                        >
                          {u.status === 'SUSPENSO' ? 'Reactivar' : 'Suspender'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: GESTÃO DE VAGAS */}
      {activeTab === 'vagas' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <input
                type="text"
                value={jobSearch}
                onChange={(e) => setJobSearch(e.target.value)}
                placeholder="Pesquisar vagas por cargo, empresa..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#102B55]"
              />
            </div>

            <button
              onClick={() => setShowNewJobModal(true)}
              className="px-4 py-2 bg-[#FF8A00] hover:bg-[#e67a00] text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Publicar Nova Vaga Manual</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] border-b border-slate-200">
                <tr>
                  <th className="p-3">Cargo & Empresa</th>
                  <th className="p-3">Província</th>
                  <th className="p-3">Categoria</th>
                  <th className="p-3">Prazo</th>
                  <th className="p-3">Fonte</th>
                  <th className="p-3">Estado</th>
                  <th className="p-3 text-right">Acções</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredJobsAdmin.map((job) => (
                  <tr key={job.id} className="hover:bg-slate-50/80">
                    <td className="p-3">
                      <strong className="text-slate-800 block text-xs">{job.title}</strong>
                      <span className="text-[11px] text-slate-500">{job.company}</span>
                    </td>
                    <td className="p-3 font-semibold text-slate-700">
                      {job.province} ({job.municipality})
                    </td>
                    <td className="p-3 text-slate-600">{job.category}</td>
                    <td className="p-3 font-medium text-slate-700">{job.deadline}</td>
                    <td className="p-3 text-[11px] text-slate-500">{job.sourceName}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          job.isExpired ? 'bg-slate-200 text-slate-600' : 'bg-emerald-50 text-emerald-700'
                        }`}
                      >
                        {job.isExpired ? 'Expirada' : 'Activa'}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => deleteJob(job.id)}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Eliminar Vaga"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: FONTES AUTOMÁTICAS */}
      {activeTab === 'fontes' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-[#102B55]">
                Sistema Automático de Pesquisa e Agregação de Oportunidades
              </h3>
              <p className="text-xs text-slate-500">
                Pesquisa automática em portais de emprego, páginas oficiais de empresas e APIs autorizadas em Angola.
              </p>
            </div>
            <button
              onClick={handleSyncAll}
              disabled={isSyncing}
              className="px-4 py-2 bg-[#102B55] hover:bg-[#0c2244] text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>Sincronizar Todas as Fontes</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {feeds.map((feed) => (
              <div key={feed.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-xs font-bold text-[#102B55]">{feed.name}</h4>
                    <a
                      href={feed.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-[#FF8A00] hover:underline flex items-center gap-1 mt-0.5"
                    >
                      <span>{feed.url}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {feed.status}
                  </span>
                </div>

                <p className="text-xs text-slate-600">{feed.description}</p>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Última Sincronização: <strong>{feed.lastSyncAt}</strong></span>
                  <span>Frequência: {feed.checkFrequency}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: CONFIGURAÇÕES BANCÁRIAS */}
      {activeTab === 'config' && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm max-w-2xl">
          <h3 className="text-sm font-bold text-[#102B55] mb-2 flex items-center gap-2">
            <Settings className="w-4 h-4 text-[#FF8A00]" />
            Configuração de Dados Bancários & Tarifas Oficiais
          </h3>
          <p className="text-xs text-slate-500 mb-6">
            Estas coordenadas são apresentadas a todos os candidatos aquando do registo para envio de comprovativos.
          </p>

          {configSaveSuccess && (
            <div className="p-3.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold mb-5 border border-emerald-200">
              Coordenadas bancárias e tarifas actualizadas com sucesso!
            </div>
          )}

          <form onSubmit={handleConfigSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Valor da Taxa de Inscrição Única (Kz)
              </label>
              <input
                type="number"
                value={configForm.subscriptionFeeKz}
                onChange={(e) => setConfigForm({ ...configForm, subscriptionFeeKz: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold text-[#102B55]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Número Multicaixa Express (MCX)
              </label>
              <input
                type="text"
                value={configForm.multicaixaExpressPhone}
                onChange={(e) => setConfigForm({ ...configForm, multicaixaExpressPhone: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                IBAN Oficial (Banco BAI)
              </label>
              <input
                type="text"
                value={configForm.baiIban}
                onChange={(e) => setConfigForm({ ...configForm, baiIban: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nome do Titular Beneficiário
              </label>
              <input
                type="text"
                value={configForm.titularName}
                onChange={(e) => setConfigForm({ ...configForm, titularName: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Contacto Telefónico de Apoio ao Candidato
              </label>
              <input
                type="text"
                value={configForm.supportPhone}
                onChange={(e) => setConfigForm({ ...configForm, supportPhone: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#102B55] hover:bg-[#FF8A00] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md mt-4"
            >
              Guardar Alterações Oficiais
            </button>
          </form>
        </div>
      )}

      {/* TAB 7: AUDITORIA & BACKUPS */}
      {activeTab === 'auditoria' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-[#102B55]">
                  Cópias de Segurança & Protecção de Dados
                </h3>
                <p className="text-xs text-slate-500">
                  Exportação integral de utilizadores, comprovativos, definições e auditoria para ficheiro persistente JSON.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleExportBackup}
                  className="px-4 py-2 bg-[#102B55] hover:bg-[#0c2244] text-white text-xs font-bold rounded-xl transition-all flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Descarregar Backup (.json)</span>
                </button>

                <label className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer transition-all flex items-center gap-2 border border-slate-200">
                  <Upload className="w-4 h-4" />
                  <span>Restaurar Backup</span>
                  <input type="file" accept=".json" onChange={handleImportBackup} className="hidden" />
                </label>
              </div>
            </div>
          </div>

          {/* Audit Logs list */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-[#102B55] mb-4 flex items-center gap-2">
              <Database className="w-4 h-4 text-[#FF8A00]" />
              Registo Cronológico de Ações Administrativas (Audit Log)
            </h3>
            <div className="space-y-2">
              {StorageService.getAuditLogs().map((log) => (
                <div key={log.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start justify-between gap-3 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#102B55]">{log.action}</span>
                      <span className="text-[10px] text-slate-400">por {log.adminName}</span>
                    </div>
                    <p className="text-slate-600 mt-0.5">{log.details}</p>
                  </div>
                  <span className="text-[10px] text-slate-400 whitespace-nowrap">{log.timestamp}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal: Preview Receipt Proof */}
      {previewProof && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-sm font-bold text-[#102B55]">Comprovativo de Pagamento</h3>
                <p className="text-xs text-slate-500">Candidato: {previewProof.user.fullName} ({previewProof.user.province})</p>
              </div>
              <button
                onClick={() => setPreviewProof(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 rounded-2xl p-3 flex items-center justify-center min-h-[350px] mb-4">
              {previewProof.proof.fileType === 'pdf' || previewProof.proof.receiptUrl.startsWith('data:application/pdf') ? (
                <div className="text-center p-6 space-y-3">
                  <FileText className="w-20 h-20 text-red-500 mx-auto mb-2" />
                  <p className="text-sm font-bold text-slate-800">{previewProof.proof.fileName}</p>
                  <p className="text-xs text-slate-500">Documento Oficial PDF • {previewProof.proof.fileSize || 'Ficheiro Digital'}</p>
                  {previewProof.proof.receiptUrl && (
                    <a
                      href={previewProof.proof.receiptUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      download={previewProof.proof.fileName}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#102B55] hover:bg-[#FF8A00] text-white text-xs font-bold rounded-xl transition-all shadow-sm"
                    >
                      <span>Abrir / Descarregar PDF</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              ) : (
                <img
                  src={previewProof.proof.receiptUrl}
                  alt="Comprovativo"
                  className="max-h-[500px] w-auto object-contain rounded-xl shadow-sm"
                />
              )}
            </div>

            <div className="bg-slate-100 rounded-xl p-3 text-xs space-y-1 mb-5">
              <p><strong>Método:</strong> {previewProof.proof.method}</p>
              <p><strong>Montante:</strong> {previewProof.proof.amountKz.toLocaleString()} Kz</p>
              <p><strong>Referência:</strong> {previewProof.proof.referenceCode || 'Não especificada'}</p>
              <p><strong>Submetido em:</strong> {previewProof.proof.submittedAt}</p>
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => {
                  setRejectModalUser(previewProof.user);
                  setPreviewProof(null);
                }}
                className="px-4 py-2 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold text-xs"
              >
                Rejeitar com Justificativa
              </button>
              <button
                onClick={() => {
                  approveUserPayment(previewProof.user.id);
                  setPreviewProof(null);
                }}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md"
              >
                Aprovar Pagamento e Ativar Conta
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Rejeitar Pagamento com motivo */}
      {rejectModalUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h3 className="text-sm font-bold text-[#102B55] mb-2">Rejeitar Comprovativo de Pagamento</h3>
            <p className="text-xs text-slate-500 mb-4">
              Indique o motivo da não aprovação para {rejectModalUser.fullName}. O candidato receberá uma notificação explicativa.
            </p>

            <div className="space-y-3">
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={3}
                className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#102B55]"
                placeholder="Ex: O comprovativo anexado está desfocado e não permite ler a referência..."
              />

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setRejectModalUser(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    rejectUserPayment(rejectModalUser.id, rejectionReason);
                    setRejectModalUser(null);
                  }}
                  className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-sm"
                >
                  Confirmar Rejeição
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Publicar Nova Vaga Manual */}
      {showNewJobModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-sm font-bold text-[#102B55]">Publicar Nova Vaga Manual</h3>
              <button onClick={() => setShowNewJobModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateJob} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Título do Cargo</label>
                  <input
                    type="text"
                    required
                    value={newJobData.title}
                    onChange={(e) => setNewJobData({ ...newJobData, title: e.target.value })}
                    placeholder="Ex: Engenheiro de Telecomunicações"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Empresa Empregadora</label>
                  <input
                    type="text"
                    required
                    value={newJobData.company}
                    onChange={(e) => setNewJobData({ ...newJobData, company: e.target.value })}
                    placeholder="Ex: Unitel, Sonangol, Carrinho..."
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Descrição do Cargo & Funções</label>
                <textarea
                  required
                  rows={3}
                  value={newJobData.description}
                  onChange={(e) => setNewJobData({ ...newJobData, description: e.target.value })}
                  placeholder="Descreva as responsabilidades operacionais..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Requisitos (um por linha)</label>
                <textarea
                  required
                  rows={3}
                  value={newJobData.requirements}
                  onChange={(e) => setNewJobData({ ...newJobData, requirements: e.target.value })}
                  placeholder="Licenciatura em...&#10;Mínimo 3 anos de experiência...&#10;Inglês avançado..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Província de Angola</label>
                  <select
                    value={newJobData.province}
                    onChange={(e) =>
                      setNewJobData({
                        ...newJobData,
                        province: e.target.value as AngolanProvince,
                        municipality:
                          ANGOLAN_PROVINCES.find((p) => p.name === e.target.value)?.municipalities[0] || '',
                      })
                    }
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    {ANGOLAN_PROVINCES.map((p) => (
                      <option key={p.name} value={p.name}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Município</label>
                  <input
                    type="text"
                    required
                    value={newJobData.municipality}
                    onChange={(e) => setNewJobData({ ...newJobData, municipality: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Sector Profissional</label>
                  <select
                    value={newJobData.category}
                    onChange={(e) => setNewJobData({ ...newJobData, category: e.target.value as JobCategory })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    {JOB_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Prazo Limite de Candidatura</label>
                  <input
                    type="date"
                    required
                    value={newJobData.deadline}
                    onChange={(e) => setNewJobData({ ...newJobData, deadline: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Sector</label>
                  <select
                    value={newJobData.sector}
                    onChange={(e) => setNewJobData({ ...newJobData, sector: e.target.value as any })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="Privado">Privado</option>
                    <option value="Público">Público</option>
                    <option value="Misto">Misto</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Link Oficial de Candidatura (URL da empresa)
                </label>
                <input
                  type="url"
                  required
                  value={newJobData.officialApplyUrl}
                  onChange={(e) => setNewJobData({ ...newJobData, officialApplyUrl: e.target.value })}
                  placeholder="https://empresa.co.ao/carreiras"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowNewJobModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#FF8A00] hover:bg-[#e67a00] text-white font-bold shadow-md"
                >
                  Publicar Vaga Oficial
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

function CheckCircle2Icon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
