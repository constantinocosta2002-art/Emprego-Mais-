import React from 'react';
import { ANGOLAN_PROVINCES } from '../data/angolaProvinces';
import { useJobs } from '../context/JobContext';
import { AngolanProvince } from '../types';
import { MapPin, Briefcase, ArrowRight, Building, Compass } from 'lucide-react';

interface ProvincesDirectoryViewProps {
  onSelectProvince: (prov: AngolanProvince) => void;
}

export const ProvincesDirectoryView: React.FC<ProvincesDirectoryViewProps> = ({
  onSelectProvince,
}) => {
  const { jobs } = useJobs();

  // Active job count by province
  const jobsCountMap = React.useMemo(() => {
    const map: Record<string, number> = {};
    jobs.forEach((j) => {
      if (!j.isExpired) {
        map[j.province] = (map[j.province] || 0) + 1;
      }
    });
    return map;
  }, [jobs]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100 text-[#102B55] text-xs font-bold mb-3">
          <Compass className="w-4 h-4 text-[#FF8A00]" />
          <span>Diretório Territorial de Angola</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-[#102B55] font-display">
          As 21 Províncias da República de Angola
        </h1>
        <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
          Explore o mercado de trabalho angolano de norte a sul. Clique em qualquer província para consultar imediatamente as oportunidades de recrutamento disponíveis.
        </p>
      </div>

      {/* Provinces Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {ANGOLAN_PROVINCES.map((prov) => {
          const count = jobsCountMap[prov.name] || 0;
          return (
            <div
              key={prov.name}
              onClick={() => onSelectProvince(prov.name)}
              className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-[#102B55]/50 hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 text-[#102B55] font-black text-sm flex items-center justify-center group-hover:bg-[#FF8A00] group-hover:text-white transition-colors">
                      {prov.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-[#102B55] group-hover:text-[#FF8A00] transition-colors font-display">
                        {prov.name}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">
                        Capital: <strong>{prov.capital}</strong>
                      </p>
                    </div>
                  </div>

                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                      count > 0
                        ? 'bg-orange-50 text-[#FF8A00] border border-orange-200'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {count} {count === 1 ? 'vaga' : 'vagas'}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Pólo Económico & Sectores Chave:
                    </span>
                    <p className="text-slate-700 font-medium leading-relaxed mt-0.5">
                      {prov.economicHub}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Municípios Integrados ({prov.municipalities.length}):
                    </span>
                    <p className="text-slate-500 line-clamp-2 mt-0.5">
                      {prov.municipalities.join(', ')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between text-xs font-bold text-[#102B55] group-hover:text-[#FF8A00]">
                <span>Ver Vagas em {prov.name}</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
