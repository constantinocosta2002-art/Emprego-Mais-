import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  UserPlus,
  CreditCard,
  ShieldCheck,
  Search,
  ExternalLink,
  CheckCircle2,
  Bell,
  ArrowRight
} from 'lucide-react';

interface HowItWorksViewProps {
  onOpenAuth: (mode?: 'login' | 'register') => void;
  onGoToPayment: () => void;
  onExploreJobs: () => void;
}

export const HowItWorksView: React.FC<HowItWorksViewProps> = ({
  onOpenAuth,
  onGoToPayment,
  onExploreJobs,
}) => {
  const { config, currentUser } = useAuth();

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100 text-[#FF8A00] text-xs font-bold mb-3">
          <span>Guia Passo a Passo</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-[#102B55] font-display">
          Como Funciona o EMPREGO+ Angola
        </h1>
        <p className="mt-3 text-base text-slate-600 leading-relaxed">
          Entenda como conectamos candidatos às oportunidades oficiais de emprego em todas as 21 províncias de Angola com total segurança e rigor.
        </p>
      </div>

      {/* 4 Steps Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Step 1 */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#102B55] font-black text-lg flex items-center justify-center mb-4 border border-blue-100">
              01
            </div>
            <h3 className="text-base font-bold text-[#102B55] mb-2 font-display">
              Registo Seguro
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Crie a sua conta informando nome completo, e-mail, telefone angolano, a sua província de residência e município.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-[#FF8A00] font-semibold">
            Sem contas duplicadas
          </div>
        </div>

        {/* Step 2 */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#FF8A00] font-black text-lg flex items-center justify-center mb-4 border border-orange-100">
              02
            </div>
            <h3 className="text-base font-bold text-[#102B55] mb-2 font-display">
              Pagamento & Recibo
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Efectue a taxa de ativação de <strong>{config.subscriptionFeeKz.toLocaleString()} Kz</strong> via Multicaixa Express (928928188) ou Transferência BAI e envie o comprovativo.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-[#FF8A00] font-semibold">
            Aceita imagem ou PDF
          </div>
        </div>

        {/* Step 3 */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 font-black text-lg flex items-center justify-center mb-4 border border-emerald-100">
              03
            </div>
            <h3 className="text-base font-bold text-[#102B55] mb-2 font-display">
              Aprovação Manual
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              O administrador ({config.founderName}) confere o pagamento no extracto bancário e aprova a conta. Ninguém acede sem esta verificação real.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-emerald-600 font-semibold">
            Verificação real 100% segura
          </div>
        </div>

        {/* Step 4 */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 font-black text-lg flex items-center justify-center mb-4 border border-purple-100">
              04
            </div>
            <h3 className="text-base font-bold text-[#102B55] mb-2 font-display">
              Candidatura Directa
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Consulte todas as vagas das 21 províncias e clique em "CANDIDATAR-ME" para ir directamente ao portal oficial da empresa.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-purple-600 font-semibold">
            Links oficiais verificados
          </div>
        </div>
      </div>

      {/* Important Clarifications */}
      <div className="bg-gradient-to-r from-blue-50 to-slate-50 rounded-3xl p-6 sm:p-8 border border-blue-200/60">
        <h3 className="text-base font-bold text-[#102B55] mb-3 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#FF8A00]" />
          Perguntas Frequentes & Diretrizes de Transparência
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-700">
          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <h4 className="font-bold text-[#102B55] mb-1">
              O EMPREGO+ cobra alguma comissão se eu for contratado?
            </h4>
            <p className="text-slate-600 leading-relaxed">
              <strong>Não.</strong> A única cobrança é a taxa de inscrição de {config.subscriptionFeeKz.toLocaleString()} Kz para ativação do serviço de agregação. O processo selectivo e contratação pertencem exclusivamente à empresa anunciante.
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <h4 className="font-bold text-[#102B55] mb-1">
              Posso candidatar-me a vagas de outras províncias?
            </h4>
            <p className="text-slate-600 leading-relaxed">
              <strong>Sim.</strong> Independentemente de residir em Luanda, Benguela, Huambo ou no Moxico, pode visualizar e candidatar-se a qualquer vaga em qualquer uma das 21 províncias de Angola.
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <h4 className="font-bold text-[#102B55] mb-1">
              Como sei que o meu pagamento foi aprovado?
            </h4>
            <p className="text-slate-600 leading-relaxed">
              Receberá uma notificação interna no aplicativo e na sua caixa de entrada assim que o administrador conferir a transacção. O status da sua conta mudará para "Conta Ativa".
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <h4 className="font-bold text-[#102B55] mb-1">
              O que acontece com os anúncios quando o prazo termina?
            </h4>
            <p className="text-slate-600 leading-relaxed">
              O sistema automatizado do EMPREGO+ identifica diariamente as datas-limite e sinaliza as vagas como expiradas, garantindo que não perca tempo com anúncios desatualizados.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Box */}
      <div className="text-center py-6">
        {currentUser?.status === 'ATIVO' ? (
          <button
            onClick={onExploreJobs}
            className="px-8 py-3.5 bg-[#FF8A00] hover:bg-[#e67a00] text-white font-extrabold text-sm rounded-xl transition-all shadow-lg shadow-orange-500/25 inline-flex items-center gap-2"
          >
            <span>Ver Vagas Disponíveis</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={currentUser ? onGoToPayment : () => onOpenAuth('register')}
            className="px-8 py-3.5 bg-[#FF8A00] hover:bg-[#e67a00] text-white font-extrabold text-sm rounded-xl transition-all shadow-lg shadow-orange-500/25 inline-flex items-center gap-2"
          >
            <span>Iniciar Inscrição por 1.000 Kz</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
