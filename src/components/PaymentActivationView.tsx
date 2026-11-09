import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { PaymentMethod, PaymentProof, AngolanProvince } from '../types';
import { processProofFile, ProcessedFileResult } from '../utils/fileProcessor';
import { ANGOLAN_PROVINCES } from '../data/angolaProvinces';
import {
  CreditCard,
  Copy,
  Check,
  Upload,
  FileCheck,
  AlertCircle,
  Clock,
  ShieldCheck,
  PhoneCall,
  FileText,
  Eye,
  CheckCircle2,
  RefreshCw,
  ArrowRight,
  LogIn,
  UserPlus,
  Lock,
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface PaymentActivationViewProps {
  onOpenAuth: (mode?: 'login' | 'register') => void;
  onExploreJobs: () => void;
}

export const PaymentActivationView: React.FC<PaymentActivationViewProps> = ({
  onExploreJobs,
}) => {
  const { currentUser, config, submitPaymentProof, registerAndSubmitProof, login } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Common payment state
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('MULTICAIXA_EXPRESS');
  const [referenceCode, setReferenceCode] = useState('');
  const [selectedFileResult, setSelectedFileResult] = useState<ProcessedFileResult | null>(null);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);

  // Non-logged-in user tab: 'register' (direct combined flow) or 'login'
  const [guestMode, setGuestMode] = useState<'register' | 'login'>('register');

  // Registration fields for guest direct activation
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [province, setProvince] = useState<AngolanProvince>('Luanda');
  const [municipality, setMunicipality] = useState('Luanda');

  // Inline login fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Status and feedback
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<{ success: boolean; message: string } | null>(null);
  const [viewProofModal, setViewProofModal] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showReplaceProofForm, setShowReplaceProofForm] = useState(false);

  const currentMunicipalities =
    ANGOLAN_PROVINCES.find((p) => p.name === province)?.municipalities || [];

  const handleProvinceChange = (prov: AngolanProvince) => {
    setProvince(prov);
    const matched = ANGOLAN_PROVINCES.find((p) => p.name === prov);
    if (matched && matched.municipalities.length > 0) {
      setMunicipality(matched.municipalities[0]);
    }
  };

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileError(null);
    setIsProcessingFile(true);

    try {
      const processed = await processProofFile(file);
      setSelectedFileResult(processed);
    } catch (err: any) {
      console.error('Erro no processamento do ficheiro:', err);
      setFileError(err.message || 'Falha ao processar ficheiro. Tente uma foto em formato JPG ou PNG.');
      setSelectedFileResult(null);
    } finally {
      setIsProcessingFile(false);
    }
  };

  // 1. Direct Combined Submit (New User Registration + Proof Submission)
  const handleDirectRegistrationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmissionStatus(null);

    if (!selectedFileResult || !selectedFileResult.dataUrl) {
      setSubmissionStatus({
        success: false,
        message: 'Por favor, anexe a foto ou PDF do comprovativo bancário antes de prosseguir.',
      });
      return;
    }

    if (!fullName.trim()) {
      setSubmissionStatus({ success: false, message: 'Por favor, insira o seu nome completo.' });
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setSubmissionStatus({ success: false, message: 'Por favor, insira um endereço de e-mail válido.' });
      return;
    }

    if (!phone.trim()) {
      setSubmissionStatus({ success: false, message: 'Por favor, insira o seu número de telefone.' });
      return;
    }

    if (password.length < 5) {
      setSubmissionStatus({ success: false, message: 'A palavra-passe deve conter pelo menos 5 caracteres.' });
      return;
    }

    setIsSubmitting(true);

    const proofData: PaymentProof = {
      receiptUrl: selectedFileResult.dataUrl,
      fileName: selectedFileResult.fileName,
      fileType: selectedFileResult.fileType,
      fileSize: selectedFileResult.fileSize,
      submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      method: paymentMethod,
      referenceCode: referenceCode.trim() || undefined,
      amountKz: config.subscriptionFeeKz,
    };

    try {
      const res = registerAndSubmitProof(
        {
          fullName,
          email,
          phone,
          password,
          province,
          municipality,
        },
        proofData
      );

      setIsSubmitting(false);
      setSubmissionStatus(res);

      if (res.success) {
        setSelectedFileResult(null);
        setReferenceCode('');
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    } catch (err: any) {
      console.error('Erro na submissão directa:', err);
      setIsSubmitting(false);
      setSubmissionStatus({
        success: false,
        message: 'Ocorreu um erro ao registar a conta. Por favor tente novamente.',
      });
    }
  };

  // 2. Submit proof for an already logged-in user
  const handleLoggedInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmissionStatus(null);

    if (!currentUser) return;

    if (!selectedFileResult || !selectedFileResult.dataUrl) {
      setSubmissionStatus({
        success: false,
        message: 'Por favor, anexe a foto ou PDF do comprovativo bancário antes de submeter.',
      });
      return;
    }

    setIsSubmitting(true);

    const proofData: PaymentProof = {
      receiptUrl: selectedFileResult.dataUrl,
      fileName: selectedFileResult.fileName,
      fileType: selectedFileResult.fileType,
      fileSize: selectedFileResult.fileSize,
      submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      method: paymentMethod,
      referenceCode: referenceCode.trim() || undefined,
      amountKz: config.subscriptionFeeKz,
    };

    try {
      const res = submitPaymentProof(proofData);
      setIsSubmitting(false);
      setSubmissionStatus(res);

      if (res.success) {
        setSelectedFileResult(null);
        setReferenceCode('');
        setShowReplaceProofForm(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    } catch (err: any) {
      console.error('Erro na submissão:', err);
      setIsSubmitting(false);
      setSubmissionStatus({
        success: false,
        message: 'Ocorreu um erro ao processar o comprovativo. Por favor certifique-se de que o ficheiro é uma imagem legível (JPG, PNG) ou documento PDF.',
      });
    }
  };

  // 3. Inline Login Submit
  const handleInlineLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmissionStatus(null);
    const res = login(loginEmail, loginPassword);
    setSubmissionStatus(res);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Title & Header */}
      <div className="text-center max-w-3xl mx-auto mb-8">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-orange-100 text-[#FF8A00] text-xs font-bold mb-3 shadow-xs">
          <CreditCard className="w-3.5 h-3.5" />
          <span>ATIVAÇÃO IMEDIATA DA CONTA • 1.000 KZ</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-[#102B55] font-display tracking-tight">
          Ativar Conta no EMPREGO+
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
          Sem complicações nem voltas: efectue o pagamento de <strong>{config.subscriptionFeeKz.toLocaleString()} Kz</strong> via Multicaixa Express ou BAI e anexe o comprovativo abaixo. O fundador <strong>{config.founderName}</strong> confere o extracto bancário e aprova o seu acesso directo às candidaturas em todas as 21 províncias de Angola.
        </p>
      </div>

      {/* User Current Status Notification Banner */}
      {currentUser && (
        <div className="mb-8">
          {currentUser.status === 'ATIVO' && (
            <div className="bg-emerald-50 border-2 border-emerald-300 rounded-3xl p-6 sm:p-7 flex flex-col sm:flex-row items-center justify-between gap-5 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-md">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-extrabold text-emerald-950">A sua Conta está Ativa e Aprovada!</h3>
                    <span className="bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                      Acesso Total
                    </span>
                  </div>
                  <p className="text-xs text-emerald-800 mt-1 leading-relaxed">
                    Aprovada por <strong>{currentUser.approvedBy || config.founderName}</strong>. O botão CANDIDATAR-ME está desbloqueado para si em todas as vagas disponíveis.
                  </p>
                </div>
              </div>
              <button
                onClick={onExploreJobs}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md shrink-0 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Explorar Vagas Agora</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {currentUser.status === 'COMPROVATIVO_ENVIADO' && !showReplaceProofForm && (
            <div className="bg-amber-50 border-2 border-amber-300 rounded-3xl p-6 sm:p-7 flex flex-col sm:flex-row items-center justify-between gap-5 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md mt-0.5">
                  <Clock className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-extrabold text-amber-950">Comprovativo em Conferência pelo Administrador</h3>
                    <span className="bg-amber-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                      Em Análise
                    </span>
                  </div>
                  <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                    Submetido em <strong>{currentUser.paymentProof?.submittedAt}</strong> ({currentUser.paymentProof?.fileName}). O fundador <strong>{config.founderName}</strong> está a conferir o depósito bancário. Receberá uma notificação na plataforma assim que for aprovado!
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                {currentUser.paymentProof?.receiptUrl && (
                  <button
                    onClick={() => setViewProofModal(currentUser.paymentProof?.receiptUrl || '')}
                    className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Ver Recibo</span>
                  </button>
                )}
                <button
                  onClick={() => setShowReplaceProofForm(true)}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-amber-300 bg-white hover:bg-amber-100/60 text-amber-900 text-xs font-semibold transition-colors cursor-pointer"
                >
                  Substituir Recibo
                </button>
              </div>
            </div>
          )}

          {currentUser.status === 'REJEITADO' && (
            <div className="bg-rose-50 border-2 border-rose-300 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-500 text-white flex items-center justify-center shrink-0">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-rose-950">Comprovativo Anterior Não Aprovado</h3>
                  <p className="text-xs text-rose-700 mt-0.5">
                    Motivo: <strong>"{currentUser.rejectionReason || 'Ficheiro ilegível ou montante não creditado'}"</strong>. Por favor anexe um novo comprovativo legível abaixo.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Grid: Left Coordinates / Right Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Bank Payment Details */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#102B55] flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-[#FF8A00]" />
              Coordenadas para Pagamento
            </h2>
            <span className="text-xs font-extrabold text-[#FF8A00] bg-orange-100 px-2 py-0.5 rounded-md">
              {config.subscriptionFeeKz.toLocaleString()} Kz
            </span>
          </div>

          {/* Multicaixa Express Card */}
          <div className="bg-gradient-to-br from-[#102B55] to-[#183C73] rounded-3xl p-5 text-white shadow-lg relative overflow-hidden border border-[#204a8c]">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#FF8A00]">
                Multicaixa Express (MCX)
              </span>
              <span className="bg-[#FF8A00] text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                Recomendado
              </span>
            </div>

            <p className="text-[11px] text-slate-300">Número de Telefone do Beneficiário:</p>
            <div className="flex items-center justify-between mt-1 mb-3 bg-white/10 p-3 rounded-2xl border border-white/15">
              <span className="text-xl font-black tracking-wider text-white font-mono">
                {config.multicaixaExpressPhone}
              </span>
              <button
                type="button"
                onClick={() => handleCopy(config.multicaixaExpressPhone, 'mcx')}
                className="px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                title="Copiar Número"
              >
                {copiedField === 'mcx' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-300" />
                    <span className="text-emerald-200">Copiado</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar</span>
                  </>
                )}
              </button>
            </div>

            <div className="text-xs text-slate-200 pt-1 border-t border-white/10 flex justify-between items-center">
              <div>
                <span className="text-slate-400 block text-[10px]">Titular:</span>
                <strong className="text-white font-semibold">{config.titularName}</strong>
              </div>
              <div className="text-right">
                <span className="text-slate-400 block text-[10px]">Valor:</span>
                <strong className="text-[#FF8A00] font-black">{config.subscriptionFeeKz.toLocaleString()} Kz</strong>
              </div>
            </div>
          </div>

          {/* BAI IBAN Card */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#102B55]">
                Banco BAI — Transferência
              </span>
              <span className="bg-slate-100 text-[#102B55] text-[10px] font-bold px-2 py-0.5 rounded-full">
                IBAN Oficial
              </span>
            </div>

            <p className="text-[11px] text-slate-500">Coordenadas Bancárias (IBAN):</p>
            <div className="flex items-center justify-between mt-1 mb-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
              <span className="text-xs font-mono font-bold text-[#102B55] truncate pr-2">
                {config.baiIban}
              </span>
              <button
                type="button"
                onClick={() => handleCopy(config.baiIban, 'iban')}
                className="px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shrink-0"
                title="Copiar IBAN"
              >
                {copiedField === 'iban' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Copiado</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar</span>
                  </>
                )}
              </button>
            </div>

            <div className="text-xs text-slate-700 pt-1 border-t border-slate-100 flex justify-between items-center">
              <div>
                <span className="text-slate-400 block text-[10px]">Titular:</span>
                <strong className="font-semibold text-[#102B55]">{config.titularName}</strong>
              </div>
              <div className="text-right">
                <span className="text-slate-400 block text-[10px]">Valor:</span>
                <strong className="text-[#102B55] font-black">{config.subscriptionFeeKz.toLocaleString()} Kz</strong>
              </div>
            </div>
          </div>

          {/* Security & Founder Card */}
          <div className="bg-blue-50/70 rounded-3xl p-5 border border-blue-200 text-xs text-slate-700 space-y-2">
            <p className="font-bold text-[#102B55] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#FF8A00]" />
              Garantia de Autenticidade & Segurança
            </p>
            <p className="text-[11px] leading-relaxed text-slate-600">
              Todas as ativações são conferidas diretamente nos extractos bancários pelo fundador <strong>{config.founderName}</strong>. Ninguém obtém acesso sem o pagamento de 1.000 Kz nem sem aprovação real.
            </p>
            <div className="flex items-center gap-2 pt-1 font-semibold text-[#102B55]">
              <PhoneCall className="w-3.5 h-3.5 text-[#FF8A00]" />
              <span>Linha de Apoio Direto: {config.supportPhone}</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: DIRECT ACTIVATION FORM */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl">
            {/* Feedback message banner */}
            {submissionStatus && (
              <div
                className={`p-4 rounded-2xl text-xs mb-6 flex items-start gap-2.5 animate-in fade-in ${
                  submissionStatus.success
                    ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                    : 'bg-rose-50 text-rose-900 border border-rose-200'
                }`}
              >
                {submissionStatus.success ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                )}
                <div className="flex-1 font-semibold leading-relaxed">
                  {submissionStatus.message}
                </div>
              </div>
            )}

            {/* CASE 1: VISITOR NOT LOGGED IN -> ALL-IN-ONE ACTIVATION */}
            {!currentUser ? (
              <div>
                {/* Mode Selector Tabs */}
                <div className="grid grid-cols-2 gap-1.5 p-1.5 bg-slate-100 rounded-2xl mb-6 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => {
                      setGuestMode('register');
                      setSubmissionStatus(null);
                    }}
                    className={`py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      guestMode === 'register'
                        ? 'bg-[#102B55] text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Criar Conta & Ativar</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setGuestMode('login');
                      setSubmissionStatus(null);
                    }}
                    className={`py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      guestMode === 'login'
                        ? 'bg-[#102B55] text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Já Tenho Conta (Entrar)</span>
                  </button>
                </div>

                {guestMode === 'register' ? (
                  /* COMBINED DIRECT REGISTRATION + PAYMENT PROOF FORM */
                  <form onSubmit={handleDirectRegistrationSubmit} className="space-y-5">
                    <div>
                      <h3 className="text-sm font-extrabold text-[#102B55] flex items-center gap-2 mb-1">
                        <span className="w-5 h-5 rounded-full bg-[#102B55] text-white text-[11px] font-black flex items-center justify-center">
                          1
                        </span>
                        Os Seus Dados Pessoais
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        Preencha os seus dados para abertura imediata do seu perfil de candidato.
                      </p>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Nome Completo</label>
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Ex: Constantino José da Costa"
                          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#102B55] focus:outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Endereço de E-mail</label>
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="seu.email@exemplo.ao"
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#102B55] focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Telefone (Angola)</label>
                          <input
                            type="tel"
                            required
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="923 000 000"
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#102B55] focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Província de Residência</label>
                          <select
                            value={province}
                            onChange={(e) => handleProvinceChange(e.target.value as AngolanProvince)}
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#102B55] focus:outline-none font-medium"
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
                          <select
                            value={municipality}
                            onChange={(e) => setMunicipality(e.target.value)}
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#102B55] focus:outline-none font-medium"
                          >
                            {currentMunicipalities.map((m) => (
                              <option key={m} value={m}>
                                {m}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Definir Palavra-passe</label>
                        <input
                          type="password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Mínimo 5 caracteres"
                          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#102B55] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100">
                      <h3 className="text-sm font-extrabold text-[#102B55] flex items-center gap-2 mb-1">
                        <span className="w-5 h-5 rounded-full bg-[#FF8A00] text-white text-[11px] font-black flex items-center justify-center">
                          2
                        </span>
                        Comprovativo do Pagamento ({config.subscriptionFeeKz.toLocaleString()} Kz)
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        Anexe a fotografia do talão Multicaixa ou PDF da transferência bancária.
                      </p>
                    </div>

                    {/* Method selector */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Canal Utilizado para Transferir
                      </label>
                      <div className="grid grid-cols-2 gap-3 text-xs font-bold">
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('MULTICAIXA_EXPRESS')}
                          className={`p-3 rounded-2xl border flex items-center justify-center gap-2 transition-all cursor-pointer ${
                            paymentMethod === 'MULTICAIXA_EXPRESS'
                              ? 'border-[#FF8A00] bg-orange-50/60 text-[#FF8A00] ring-2 ring-orange-400/30'
                              : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <CreditCard className="w-4 h-4" />
                          <span>Multicaixa Express</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setPaymentMethod('TRANSFERENCIA_BAI')}
                          className={`p-3 rounded-2xl border flex items-center justify-center gap-2 transition-all cursor-pointer ${
                            paymentMethod === 'TRANSFERENCIA_BAI'
                              ? 'border-[#102B55] bg-blue-50/60 text-[#102B55] ring-2 ring-blue-900/20'
                              : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <CreditCard className="w-4 h-4" />
                          <span>Transferência BAI</span>
                        </button>
                      </div>
                    </div>

                    {/* Reference code */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Código de Referência ou Id da Transacção (Opcional)
                      </label>
                      <input
                        type="text"
                        value={referenceCode}
                        onChange={(e) => setReferenceCode(e.target.value)}
                        placeholder="Ex: MCX-893012 ou TRF-BAI-490210"
                        className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#102B55] focus:outline-none"
                      />
                    </div>

                    {/* File Upload Zone */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Ficheiro do Comprovativo <span className="text-[#FF8A00]">*</span>
                      </label>

                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={handleFileChange}
                        className="hidden"
                        id="direct-proof-input"
                      />

                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-slate-300 hover:border-[#FF8A00] rounded-2xl p-6 text-center bg-slate-50 hover:bg-orange-50/20 transition-all cursor-pointer group"
                      >
                        {isProcessingFile ? (
                          <div className="py-2 flex flex-col items-center justify-center gap-2">
                            <RefreshCw className="w-8 h-8 text-[#FF8A00] animate-spin" />
                            <p className="text-xs font-bold text-[#102B55]">A processar e optimizar comprovativo...</p>
                          </div>
                        ) : (
                          <>
                            <div className="w-12 h-12 rounded-2xl bg-slate-100 group-hover:bg-orange-100 flex items-center justify-center mx-auto mb-2 text-slate-400 group-hover:text-[#FF8A00] transition-colors">
                              <Upload className="w-6 h-6" />
                            </div>
                            <p className="text-xs font-bold text-[#102B55]">
                              Toque aqui para anexar o seu comprovativo
                            </p>
                            <p className="text-[11px] text-slate-400 mt-1">
                              Foto do Talão, Imagem da Galeria ou PDF
                            </p>
                          </>
                        )}
                      </div>

                      {fileError && (
                        <p className="text-xs text-rose-600 mt-1.5 flex items-center gap-1 font-semibold">
                          <AlertCircle className="w-3.5 h-3.5" />
                          {fileError}
                        </p>
                      )}
                    </div>

                    {/* Preview box if file selected */}
                    {selectedFileResult && (
                      <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-xs animate-in fade-in">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shrink-0">
                            {selectedFileResult.fileType === 'pdf' ? (
                              <FileText className="w-5 h-5 text-red-600" />
                            ) : (
                              <FileCheck className="w-5 h-5 text-emerald-600" />
                            )}
                          </div>
                          <div>
                            <span className="font-bold text-slate-800 block truncate max-w-[180px] sm:max-w-xs">
                              {selectedFileResult.fileName}
                            </span>
                            <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                              <span className="bg-emerald-200/60 text-emerald-800 font-bold px-1.5 py-0.2 rounded">
                                {selectedFileResult.fileSize}
                              </span>
                              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                                <Check className="w-3 h-3" /> Pronto para envio
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setViewProofModal(selectedFileResult.dataUrl)}
                            className="px-2.5 py-1.5 text-xs text-[#102B55] font-bold hover:bg-emerald-100 rounded-lg flex items-center gap-1 cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5 text-[#FF8A00]" />
                            <span>Ver</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedFileResult(null);
                              if (fileInputRef.current) fileInputRef.current.value = '';
                            }}
                            className="text-slate-400 hover:text-rose-600 text-xs px-2 py-1 cursor-pointer"
                          >
                            Remover
                          </button>
                        </div>
                      </div>
                    )}

                    {/* DIRECT SUBMIT BUTTON */}
                    <button
                      type="submit"
                      disabled={isSubmitting || isProcessingFile}
                      className={`w-full py-4 rounded-2xl text-xs font-black uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer ${
                        !selectedFileResult
                          ? 'bg-[#102B55] hover:bg-[#FF8A00] text-white shadow-blue-900/20'
                          : 'bg-[#FF8A00] hover:bg-[#e67a00] text-white shadow-orange-500/30'
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>A Criar Conta e Submeter...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>CRIAR CONTA E SUBMETER COMPROVATIVO (1.000 KZ)</span>
                        </>
                      )}
                    </button>

                    <p className="text-[11px] text-center text-slate-500 leading-relaxed">
                      Ao clicar, a sua conta é criada de imediato e o comprovativo é entregue para validação ao fundador <strong>{config.founderName}</strong>.
                    </p>
                  </form>
                ) : (
                  /* INLINE LOGIN FORM FOR EXISTING USERS */
                  <form onSubmit={handleInlineLogin} className="space-y-4 text-xs">
                    <p className="text-slate-600 leading-relaxed">
                      Já registou a sua conta anteriormente? Inicie a sessão abaixo para associar o comprovativo.
                    </p>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">E-mail Registado</label>
                      <input
                        type="email"
                        required
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="seu.email@exemplo.ao"
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#102B55] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Palavra-passe</label>
                      <input
                        type="password"
                        required
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#102B55] focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 bg-[#102B55] hover:bg-[#FF8A00] text-white font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <LogIn className="w-4 h-4" />
                      <span>Entrar na Minha Conta</span>
                    </button>
                  </form>
                )}
              </div>
            ) : (
              /* CASE 2: LOGGED-IN CANDIDATE -> DIRECT PROOF UPLOADER */
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-5">
                  <div>
                    <h3 className="text-sm font-extrabold text-[#102B55]">
                      Submeter Comprovativo de {currentUser.fullName}
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Conta: <strong>{currentUser.email}</strong> • Província: <strong>{currentUser.province}</strong>
                    </p>
                  </div>
                  <span className="text-xs bg-orange-100 text-[#FF8A00] font-black px-2.5 py-1 rounded-full">
                    {config.subscriptionFeeKz.toLocaleString()} Kz
                  </span>
                </div>

                <form onSubmit={handleLoggedInSubmit} className="space-y-4">
                  {/* Method selector */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Método Utilizado para Pagamento
                    </label>
                    <div className="grid grid-cols-2 gap-3 text-xs font-bold">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('MULTICAIXA_EXPRESS')}
                        className={`p-3 rounded-2xl border flex items-center justify-center gap-2 transition-all cursor-pointer ${
                          paymentMethod === 'MULTICAIXA_EXPRESS'
                            ? 'border-[#FF8A00] bg-orange-50/60 text-[#FF8A00] ring-2 ring-orange-400/30'
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <CreditCard className="w-4 h-4" />
                        <span>Multicaixa Express</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('TRANSFERENCIA_BAI')}
                        className={`p-3 rounded-2xl border flex items-center justify-center gap-2 transition-all cursor-pointer ${
                          paymentMethod === 'TRANSFERENCIA_BAI'
                            ? 'border-[#102B55] bg-blue-50/60 text-[#102B55] ring-2 ring-blue-900/20'
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <CreditCard className="w-4 h-4" />
                        <span>Transferência BAI</span>
                      </button>
                    </div>
                  </div>

                  {/* Reference code */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Código de Referência / Id da Transacção (Opcional)
                    </label>
                    <input
                      type="text"
                      value={referenceCode}
                      onChange={(e) => setReferenceCode(e.target.value)}
                      placeholder="Ex: MCX-948210 ou TRF-BAI-8302194"
                      className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#102B55] focus:outline-none"
                    />
                  </div>

                  {/* File Upload Zone */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Ficheiro do Comprovativo (Foto do Recibo ou PDF)
                    </label>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={handleFileChange}
                      className="hidden"
                      id="logged-in-proof-input"
                    />

                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-slate-300 hover:border-[#FF8A00] rounded-2xl p-6 text-center bg-slate-50 hover:bg-orange-50/20 transition-all cursor-pointer group"
                    >
                      {isProcessingFile ? (
                        <div className="py-2 flex flex-col items-center justify-center gap-2">
                          <RefreshCw className="w-8 h-8 text-[#FF8A00] animate-spin" />
                          <p className="text-xs font-bold text-[#102B55]">A processar e comprimir ficheiro...</p>
                        </div>
                      ) : (
                        <>
                          <div className="w-12 h-12 rounded-2xl bg-slate-100 group-hover:bg-orange-100 flex items-center justify-center mx-auto mb-2 text-slate-400 group-hover:text-[#FF8A00] transition-colors">
                            <Upload className="w-6 h-6" />
                          </div>
                          <p className="text-xs font-bold text-[#102B55]">
                            Toque aqui para escolher o comprovativo
                          </p>
                          <p className="text-[11px] text-slate-400 mt-1">
                            Galeria, Câmara ou Ficheiros (JPG, PNG, PDF)
                          </p>
                        </>
                      )}
                    </div>

                    {fileError && (
                      <p className="text-xs text-rose-600 mt-1.5 flex items-center gap-1 font-semibold">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {fileError}
                      </p>
                    )}
                  </div>

                  {/* Selected file preview */}
                  {selectedFileResult && (
                    <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-xs animate-in fade-in">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shrink-0">
                          {selectedFileResult.fileType === 'pdf' ? (
                            <FileText className="w-5 h-5 text-red-600" />
                          ) : (
                            <FileCheck className="w-5 h-5 text-emerald-600" />
                          )}
                        </div>
                        <div>
                          <span className="font-bold text-slate-800 block truncate max-w-[200px] sm:max-w-xs">
                            {selectedFileResult.fileName}
                          </span>
                          <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                            <span className="bg-emerald-200/60 text-emerald-800 font-bold px-1.5 py-0.2 rounded">
                              {selectedFileResult.fileSize}
                            </span>
                            <span className="text-emerald-700 font-semibold flex items-center gap-1">
                              <Check className="w-3 h-3" /> Ficheiro pronto
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setViewProofModal(selectedFileResult.dataUrl)}
                          className="px-2.5 py-1.5 text-xs text-[#102B55] font-bold hover:bg-emerald-100 rounded-lg flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#FF8A00]" />
                          <span>Ver</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedFileResult(null);
                            if (fileInputRef.current) fileInputRef.current.value = '';
                          }}
                          className="text-slate-400 hover:text-rose-600 text-xs px-2 py-1 cursor-pointer"
                        >
                          Remover
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting || isProcessingFile || !selectedFileResult}
                    className={`w-full py-4 rounded-2xl text-xs font-black uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer ${
                      !selectedFileResult
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                        : 'bg-[#FF8A00] hover:bg-[#e67a00] text-white shadow-orange-500/25'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>A Submeter Comprovativo...</span>
                      </>
                    ) : (
                      <>
                        <FileCheck className="w-4 h-4" />
                        <span>SUBMETER COMPROVATIVO DE 1.000 KZ</span>
                      </>
                    )}
                  </button>

                  {currentUser.status === 'COMPROVATIVO_ENVIADO' && showReplaceProofForm && (
                    <div className="text-center pt-1">
                      <button
                        type="button"
                        onClick={() => setShowReplaceProofForm(false)}
                        className="text-xs text-slate-500 hover:text-slate-800 underline cursor-pointer"
                      >
                        Cancelar substituição e manter o comprovativo já enviado
                      </button>
                    </div>
                  )}
                </form>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Proof Modal Viewer */}
      {viewProofModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <h3 className="text-sm font-bold text-[#102B55]">Visualização do Comprovativo</h3>
              <button
                onClick={() => setViewProofModal(null)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="bg-slate-50 rounded-2xl p-3 flex items-center justify-center min-h-[300px]">
              {viewProofModal.startsWith('blob:') || viewProofModal.includes('application/pdf') ? (
                <div className="text-center p-6">
                  <FileText className="w-16 h-16 text-red-500 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-700">Documento PDF Carregado</p>
                  <p className="text-[11px] text-slate-400 mt-1">Formato oficial pronto para conferência</p>
                </div>
              ) : (
                <img
                  src={viewProofModal}
                  alt="Comprovativo"
                  className="max-h-[500px] w-auto object-contain rounded-xl shadow-sm"
                />
              )}
            </div>
            <div className="mt-4 text-center">
              <button
                onClick={() => setViewProofModal(null)}
                className="px-5 py-2.5 rounded-xl bg-[#102B55] text-white text-xs font-bold hover:bg-[#FF8A00] transition-colors cursor-pointer"
              >
                Fechar Visualização
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
