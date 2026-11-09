import React from 'react';
import { JobVacancy } from '../types';
import { useAuth } from '../context/AuthContext';
import {
  X,
  Building2,
  MapPin,
  Calendar,
  Clock,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  FileCheck,
  AlertCircle,
  Lock,
  Share2,
  Award,
  DollarSign
} from 'lucide-react';

interface JobDetailModalProps {
  job: JobVacancy | null;
  onClose: () => void;
  onRequireActivation: () => void;
}

export const JobDetailModal: React.FC<JobDetailModalProps> = ({
  job,
  onClose,
  onRequireActivation,
}) => {
  const { currentUser } = useAuth();
  const [copiedLink, setCopiedLink] = React.useState(false);

  if (!job) return null;

  const isMemberActive = currentUser?.status === 'ATIVO';

  const handleApply = () => {
    if (!isMemberActive) {
      onRequireActivation();
      return;
    }
    // Direct link to official corporate platform
    window.open(job.officialApplyUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCopyShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Vaga Verificada • EMPREGO+ Angola
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyShare}
              className="p-2 rounded-full text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
              title="Partilhar Oportunidade"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {copiedLink && (
          <div className="bg-emerald-50 text-emerald-800 text-xs px-4 py-2 font-semibold text-center border-b border-emerald-100">
            Link copiado para a área de transferência!
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Company branding & Title */}
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className="text-sm font-bold text-[#102B55] flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-[#FF8A00]" />
                {job.company}
              </span>
              <span className="inline-flex items-center text-xs text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full font-semibold border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                Fonte Oficial: {job.sourceName}
              </span>
              <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full font-medium">
                Sector {job.sector}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-[#102B55] leading-snug font-display">
              {job.title}
            </h2>

            {/* Quick Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-xs">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-slate-500 block text-[10px] font-bold uppercase">Localização</span>
                <span className="font-bold text-[#102B55] flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-[#FF8A00]" />
                  {job.province} ({job.municipality})
                </span>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-slate-500 block text-[10px] font-bold uppercase">Categoria</span>
                <span className="font-bold text-[#102B55] truncate block mt-0.5" title={job.category}>
                  {job.category}
                </span>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-slate-500 block text-[10px] font-bold uppercase">Contrato</span>
                <span className="font-bold text-[#102B55] block mt-0.5">
                  {job.contractType}
                </span>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-slate-500 block text-[10px] font-bold uppercase">Prazo Limite</span>
                <span className={`font-bold block mt-0.5 ${job.isExpired ? 'text-rose-600' : 'text-[#102B55]'}`}>
                  {job.deadline}
                </span>
              </div>
            </div>
          </div>

          {/* Remuneração se existir */}
          {job.salaryInfo && (
            <div className="bg-orange-50/60 border border-orange-200/60 rounded-xl p-3 flex items-center gap-2.5 text-xs text-[#102B55]">
              <DollarSign className="w-4 h-4 text-[#FF8A00] shrink-0" />
              <span>
                <strong>Remuneração / Condições:</strong> {job.salaryInfo}
              </span>
            </div>
          )}

          {/* Descrição do Cargo */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Descrição da Função & Objectivos
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
              {job.description}
            </p>
          </div>

          {/* Requisitos */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-[#FF8A00]" />
              Requisitos & Qualificações Obrigatórias
            </h3>
            <ul className="space-y-2">
              {job.requirements.map((req, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Experiência Exigida */}
          <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-3.5 text-xs">
            <span className="font-bold text-[#102B55] block mb-1">
              Experiência Profissional Mínima:
            </span>
            <span className="text-slate-700">{job.experienceLevel}</span>
          </div>

          {/* Documentos Exigidos */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
              <FileCheck className="w-4 h-4 text-[#102B55]" />
              Documentos Exigidos para Candidatura
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {job.documentsRequired.map((doc, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-700 font-medium"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF8A00]"></span>
                  <span>{doc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Candidate Access Status Box */}
          {!isMemberActive ? (
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FF8A00] text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#102B55]">
                    Link Oficial de Candidatura Bloqueado
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Pode consultar todos os requisitos livremente, mas o link oficial de candidatura à <strong>{job.company}</strong> é exclusivo para contas ativadas mediante a taxa de inscrição de 1.000 Kz aprovada pelo administrador.
                  </p>
                </div>
              </div>
              <button
                onClick={onRequireActivation}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#FF8A00] hover:bg-[#e67a00] text-white font-bold text-xs shadow-md transition-all shrink-0 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Ativar Minha Conta</span>
              </button>
            </div>
          ) : (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between gap-3 text-xs text-emerald-900">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <span className="font-bold block">Canal Oficial Desbloqueado • Conta Ativa</span>
                  <span className="text-[11px] text-emerald-700">O botão abaixo encaminha-o directamente para a plataforma oficial da {job.company}.</span>
                </div>
              </div>
              <span className="bg-emerald-600 text-white font-bold text-[10px] px-2.5 py-1 rounded-full uppercase shrink-0">
                Acesso Total
              </span>
            </div>
          )}

          {/* Institutional note on official platform link */}
          <div className="bg-slate-100 rounded-xl p-3 text-[11px] text-slate-600 leading-relaxed">
            <strong>Nota de Transparência EMPREGO+:</strong> Ao clicar em "CANDIDATAR-ME", será direccionado directamente para a página oficial ou portal de carreiras da entidade patronal (<strong>{job.company}</strong>). O EMPREGO+ não retém currículos nem cobra qualquer taxa de recrutamento ou intermediação.
          </div>
        </div>

        {/* Modal Sticky Footer Action */}
        <div className="sticky bottom-0 z-10 bg-white border-t border-slate-100 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            Publicado em: <strong>{job.publishedAt}</strong> • Prazo: <strong>{job.deadline}</strong>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="w-1/2 sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Fechar
            </button>

            <button
              onClick={handleApply}
              disabled={job.isExpired}
              className={`w-1/2 sm:w-auto px-6 py-2.5 rounded-xl text-xs font-black tracking-wide flex items-center justify-center gap-2 transition-all shadow-md ${
                job.isExpired
                  ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                  : isMemberActive
                  ? 'bg-[#FF8A00] hover:bg-[#e67a00] text-white shadow-orange-500/25'
                  : 'bg-[#102B55] hover:bg-[#FF8A00] text-white'
              }`}
            >
              {isMemberActive ? (
                <>
                  <span>CANDIDATAR-ME</span>
                  <ExternalLink className="w-4 h-4" />
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-[#FF8A00]" />
                  <span>CANDIDATAR-ME</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
