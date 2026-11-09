import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  ShieldCheck,
  Award,
  Globe2,
  CheckCircle2,
  Lock,
  Building,
  Mail,
  Phone,
  FileText,
  MapPin,
  Cpu
} from 'lucide-react';

export const AboutView: React.FC = () => {
  const { config } = useAuth();

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-10">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100 text-[#102B55] text-xs font-bold mb-3">
          <ShieldCheck className="w-4 h-4 text-[#FF8A00]" />
          <span>Institucional & Governança da Plataforma</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-[#102B55] font-display">
          Sobre o EMPREGO+ Angola
        </h1>
        <p className="mt-3 text-base text-slate-600 leading-relaxed">
          A plataforma nacional concebida para unificar e auditar oportunidades de trabalho em Angola, com cobertura integral das suas 21 províncias.
        </p>
      </div>

      {/* Founder Spotlight Card */}
      <div className="bg-gradient-to-br from-[#102B55] to-[#0B1E3D] text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-[#183C73] relative overflow-hidden">
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-8 space-y-3">
            <span className="text-xs font-black uppercase tracking-wider text-[#FF8A00]">
              Proprietário & Fundador Oficial
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
              {config.founderName}
            </h2>
            <p className="text-sm text-slate-200 leading-relaxed font-normal">
              Fundada sob a visão de <strong>{config.founderName}</strong>, a iniciativa EMPREGO+ nasceu com a missão primordial de combater a desinformação no mercado de trabalho angolano, acabando com a proliferação de anúncios falsos e intermediários fraudulentos. A plataforma garante que cada vaga catalogada provém de fontes oficiais verificadas e encaminha o candidato directamente à entidade patronal.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-300">
              <span className="flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-[#FF8A00]" />
                {config.supportEmail}
              </span>
              <span className="flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-[#FF8A00]" />
                {config.supportPhone}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#FF8A00]" />
                Luanda, República de Angola
              </span>
            </div>
          </div>

          <div className="md:col-span-4 bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#FF8A00] text-white font-black text-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
              CJC
            </div>
            <p className="text-sm font-bold text-white">{config.founderName}</p>
            <p className="text-xs text-[#FF8A00] font-semibold">Direcção & Supervisão Geral</p>
            <p className="text-[11px] text-slate-300 mt-2">
              Responsável pela auditoria manual de todos os comprovativos de ativação e conformidade institucional.
            </p>
          </div>
        </div>
      </div>

      {/* Pillars & Principles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-[#FF8A00] mb-4">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-[#102B55] mb-2 font-display">Sem Vagas Falsas</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Não inventamos nem simulamos oportunidades. O nosso sistema agrega anúncios reais a partir de portais autorizados e plataformas corporativas oficiais das empresas estabelecidas em Angola.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-[#102B55] mb-4">
            <Globe2 className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-[#102B55] mb-2 font-display">21 Províncias de Angola</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Abrangência integral de Cabinda ao Cunene, incluindo as províncias reestruturadas na recente divisão político-administrativa (Moxico Leste, Cuando, Cubango e Icolo e Bengo).
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 mb-4">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-[#102B55] mb-2 font-display">Transparência & Taxa Justa</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Taxa de inscrição única de {config.subscriptionFeeKz.toLocaleString()} Kz para ativação definitiva, destinada à manutenção dos servidores e verificação contínua. Sem mensalidades abusivas nem comissões sobre salários.
          </p>
        </div>
      </div>

      {/* Terms & Conditions & Institutional Disclaimer */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-[#102B55] flex items-center gap-2 font-display">
          <FileText className="w-5 h-5 text-[#FF8A00]" />
          Termos & Condições de Utilização e Transparência
        </h3>

        <div className="text-xs text-slate-600 space-y-3 leading-relaxed">
          <p>
            <strong>1. Natureza do Serviço:</strong> O EMPREGO+ é uma plataforma agregadora e informativa dirigida por <strong>{config.founderName}</strong>. O serviço limita-se a compilar, organizar e filtrar anúncios de recrutamento oficiais divulgados por entidades públicas e privadas em Angola.
          </p>
          <p>
            <strong>2. Encaminhamento Oficial:</strong> O botão "CANDIDATAR-ME" redirecciona o candidato estritamente para o sítio web, formulário institucional ou portal de carreiras da entidade empregadora. O EMPREGO+ não interfere nas decisões de selecção, entrevistas ou contratação.
          </p>
          <p>
            <strong>3. Taxa de Inscrição:</strong> A inscrição no valor de {config.subscriptionFeeKz.toLocaleString()} Kz confere ativação da conta com acesso irrestrito às candidaturas directas, alertas locais e visualização de canais oficiais. A ativação depende exclusivamente da validação manual do comprovativo de pagamento bancário (Multicaixa Express ou BAI) por parte do administrador.
          </p>
          <p>
            <strong>4. Proteção de Dados:</strong> O EMPREGO+ respeita a privacidade dos utilizadores nos termos da legislação angolana, não comercializando números de telefone nem endereços de correio electrónico com terceiros.
          </p>
        </div>
      </div>
    </div>
  );
};
