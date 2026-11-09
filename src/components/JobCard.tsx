import React from 'react';
import { JobVacancy } from '../types';
import { useAuth } from '../context/AuthContext';
import {
  MapPin,
  Building2,
  Calendar,
  Clock,
  ExternalLink,
  ShieldCheck,
  CheckCircle,
  FileText,
  Lock,
  ChevronRight,
  Briefcase
} from 'lucide-react';

interface JobCardProps {
  job: JobVacancy;
  onSelect: (job: JobVacancy) => void;
  onRequireActivation: () => void;
}

export const JobCard: React.FC<JobCardProps> = ({ job, onSelect, onRequireActivation }) => {
  const { currentUser } = useAuth();
  const isMemberActive = currentUser?.status === 'ATIVO';

  // Calculate days remaining to deadline
  const today = new Date();
  const deadlineDate = new Date(job.deadline);
  const diffTime = deadlineDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const handleApplyClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isMemberActive) {
      onRequireActivation();
      return;
    }
    // Open official apply link
    window.open(job.officialApplyUrl, '_blank', 'noopener,noreferrer');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .slice(0, 2)
      .map((w) => w[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div
      onClick={() => onSelect(job)}
      className={`group relative bg-white rounded-2xl p-5 border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
        job.isExpired
          ? 'border-slate-200 opacity-60 bg-slate-50/50'
          : 'border-slate-200/90 hover:border-[#102B55]/40 hover:shadow-xl hover:shadow-blue-900/5'
      }`}
    >
      <div>
        {/* Top meta tags */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            {/* Company Avatar / Logo */}
            <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-black text-[#102B55] text-sm shrink-0 group-hover:bg-[#102B55] group-hover:text-white transition-colors shadow-sm">
              {getInitials(job.company)}
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-bold text-[#102B55] hover:underline">
                  {job.company}
                </span>
                <span className="inline-flex items-center text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-semibold border border-emerald-200">
                  <ShieldCheck className="w-3 h-3 mr-0.5 text-emerald-600" />
                  Oficial
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                Fonte: {job.sourceName}
              </p>
            </div>
          </div>

          {/* Expiration or Featured Badge */}
          <div className="flex flex-col items-end gap-1">
            {job.isExpired ? (
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-200 text-slate-600">
                Prazo Expirado
              </span>
            ) : diffDays <= 5 ? (
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 animate-pulse">
                Termina em {diffDays} {diffDays === 1 ? 'dia' : 'dias'}
              </span>
            ) : (
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-[#102B55] border border-blue-100">
                {job.contractType}
              </span>
            )}
            {job.isFeatured && (
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#FF8A00] text-white">
                Destaque
              </span>
            )}
          </div>
        </div>

        {/* Job Title */}
        <h3 className="text-base font-bold text-[#102B55] group-hover:text-[#FF8A00] transition-colors line-clamp-2 leading-snug mb-2 font-display">
          {job.title}
        </h3>

        {/* Short Description */}
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
          {job.description}
        </p>

        {/* Location & Details pills */}
        <div className="flex flex-wrap items-center gap-2 mb-4 text-[11px] font-medium text-slate-600">
          <span className="inline-flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-lg">
            <MapPin className="w-3.5 h-3.5 text-[#FF8A00]" />
            <strong className="text-slate-800">{job.province}</strong> ({job.municipality})
          </span>
          <span className="inline-flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-lg">
            <Briefcase className="w-3.5 h-3.5 text-slate-500" />
            {job.category}
          </span>
          <span className="inline-flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-lg">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            {job.experienceLevel}
          </span>
        </div>
      </div>

      {/* Card Footer: Deadline & Action */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 mt-auto">
        <div className="text-[11px] text-slate-500 flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>Prazo: <strong>{job.deadline}</strong></span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onSelect(job)}
            className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-[#102B55] hover:bg-slate-100 rounded-lg transition-colors"
          >
            Ver Detalhes
          </button>

          <button
            onClick={handleApplyClick}
            disabled={job.isExpired}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
              job.isExpired
                ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                : isMemberActive
                ? 'bg-[#102B55] hover:bg-[#FF8A00] text-white shadow-sm'
                : 'bg-[#FF8A00] hover:bg-[#e67a00] text-white shadow-sm'
            }`}
          >
            {isMemberActive ? (
              <>
                <span>CANDIDATAR-ME</span>
                <ExternalLink className="w-3 h-3" />
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5" />
                <span>CANDIDATAR-ME</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
