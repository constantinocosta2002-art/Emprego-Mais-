import React from 'react';
import { useJobs } from '../context/JobContext';
import { ANGOLAN_PROVINCES } from '../data/angolaProvinces';
import { AngolanProvince } from '../types';
import { MapPin, Check, Globe } from 'lucide-react';

export const ProvinceMultiSelector: React.FC = () => {
  const { selectedProvinces, setSelectedProvinces, jobs } = useJobs();

  // Calculate job count per province
  const countsByProvince = React.useMemo(() => {
    const map: Record<string, number> = {};
    jobs.forEach((job) => {
      if (!job.isExpired) {
        map[job.province] = (map[job.province] || 0) + 1;
      }
    });
    return map;
  }, [jobs]);

  const isAllSelected = selectedProvinces.length === 0;

  const handleToggleProvince = (prov: AngolanProvince) => {
    if (selectedProvinces.includes(prov)) {
      const remaining = selectedProvinces.filter((p) => p !== prov);
      setSelectedProvinces(remaining);
    } else {
      setSelectedProvinces([...selectedProvinces, prov]);
    }
  };

  const handleSelectAll = () => {
    setSelectedProvinces([]);
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#FF8A00]" />
            <h2 className="text-base sm:text-lg font-bold text-[#102B55]">
              Filtrar por Províncias de Angola
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Selecione uma, várias ou consulte oportunidades em toda a República de Angola (21 províncias).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSelectAll}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              isAllSelected
                ? 'bg-[#102B55] text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            Toda Angola (21)
          </button>
          {!isAllSelected && (
            <span className="text-xs font-semibold text-[#FF8A00] bg-orange-50 px-2.5 py-1 rounded-md border border-orange-200">
              {selectedProvinces.length} selecionada(s)
            </span>
          )}
        </div>
      </div>

      {/* Chips grid for 21 provinces */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2">
        {ANGOLAN_PROVINCES.map((prov) => {
          const isSelected = selectedProvinces.includes(prov.name);
          const count = countsByProvince[prov.name] || 0;

          return (
            <button
              key={prov.name}
              onClick={() => handleToggleProvince(prov.name)}
              className={`flex items-center justify-between p-2 rounded-xl text-xs font-semibold transition-all border text-left ${
                isSelected
                  ? 'bg-[#102B55] text-white border-[#102B55] shadow-sm ring-2 ring-[#FF8A00]/40'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-100/80'
              }`}
            >
              <span className="truncate pr-1">{prov.name}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold shrink-0 ${
                  isSelected
                    ? 'bg-[#FF8A00] text-white'
                    : count > 0
                    ? 'bg-blue-100 text-[#102B55]'
                    : 'bg-slate-200 text-slate-500'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
