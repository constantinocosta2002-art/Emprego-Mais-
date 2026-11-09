import React from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, MapPin, Mail, Phone, Heart, Award, ArrowUp } from 'lucide-react';
import { AngolanProvince } from '../types';

interface FooterProps {
  onNavigate: (tab: 'vagas' | 'provincias' | 'como-funciona' | 'pagamento' | 'sobre' | 'admin') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { config, currentUser } = useAuth();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#102B55] text-white border-t border-[#183C73] mt-16">
      {/* Top Pre-footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand & Founder Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FF8A00] flex items-center justify-center font-black text-xl text-white shadow-md">
                E+
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="text-xl font-black text-white">EMPREGO</span>
                  <span className="text-xl font-black text-[#FF8A00]">+</span>
                </div>
                <p className="text-[10px] uppercase tracking-wider text-slate-300 font-semibold">
                  Plataforma Nacional de Emprego em Angola
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed max-w-sm">
              Plataforma dedicada à agregação rigorosa de oportunidades reais nas 21 províncias de Angola. Fundada e administrada por <strong>{config.founderName}</strong>.
            </p>

            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs space-y-1 max-w-sm">
              <p className="text-slate-400 text-[10px] font-bold uppercase">Proprietário & Fundador:</p>
              <p className="font-bold text-white text-sm flex items-center gap-1.5">
                <Award className="w-4 h-4 text-[#FF8A00]" />
                {config.founderName}
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#FF8A00]">Navegação Rápida</h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <button onClick={() => onNavigate('vagas')} className="hover:text-white transition-colors">
                  Vagas & Oportunidades
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('provincias')} className="hover:text-white transition-colors">
                  As 21 Províncias de Angola
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('como-funciona')} className="hover:text-white transition-colors">
                  Como Funciona o Serviço
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('pagamento')} className="hover:text-white transition-colors">
                  Ativação & Pagamento (1.000 Kz)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('sobre')} className="hover:text-white transition-colors">
                  Sobre Nós & Fundador
                </button>
              </li>
              {currentUser?.role === 'admin' && (
                <li>
                  <button onClick={() => onNavigate('admin')} className="text-[#FF8A00] font-bold hover:underline">
                    Painel Administrativo
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Payment Info */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#FF8A00]">Canais de Inscrição</h4>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="bg-white/5 p-2.5 rounded-lg border border-white/10">
                <span className="text-[10px] text-slate-400 block">Multicaixa Express:</span>
                <strong className="text-white font-mono text-sm">{config.multicaixaExpressPhone}</strong>
              </div>
              <div className="bg-white/5 p-2.5 rounded-lg border border-white/10">
                <span className="text-[10px] text-slate-400 block">Banco BAI (IBAN):</span>
                <strong className="text-white font-mono text-[11px] block truncate">{config.baiIban}</strong>
              </div>
              <p className="text-[10px] text-slate-400">Titular: {config.titularName}</p>
            </div>
          </div>

          {/* Institutional Contacts */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#FF8A00]">Apoio & Contacto</h4>
            <div className="space-y-2 text-xs text-slate-300">
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#FF8A00]" />
                <span>{config.supportPhone}</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#FF8A00]" />
                <span>{config.supportEmail}</span>
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#FF8A00]" />
                <span>Luanda, Angola</span>
              </p>
            </div>

            <button
              onClick={scrollToTop}
              className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              <span>Voltar ao topo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Sub-bar */}
      <div className="bg-[#0B1E3D] border-t border-[#142d54] py-4 px-4 sm:px-6 lg:px-8 text-xs text-slate-400 text-center sm:flex sm:justify-between sm:items-center">
        <p>
          &copy; {new Date().getFullYear()} EMPREGO+ Angola. Todos os direitos reservados. Fundador e Titular: <strong className="text-white">{config.founderName}</strong>.
        </p>
        <p className="mt-2 sm:mt-0 text-[11px] text-slate-400">
          Reunindo oportunidades reais em Luanda, Benguela, Huambo e nas restantes 18 províncias.
        </p>
      </div>
    </footer>
  );
};
