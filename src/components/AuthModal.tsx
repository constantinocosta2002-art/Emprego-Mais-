import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ANGOLAN_PROVINCES } from '../data/angolaProvinces';
import { AngolanProvince } from '../types';
import {
  X,
  LogIn,
  UserPlus,
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
  onRegistrationSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
  onRegistrationSuccess,
}) => {
  const { login, register, recoverPassword, config } = useAuth();

  const [mode, setMode] = useState<'login' | 'register' | 'recover'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [fullName, setFullName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [province, setProvince] = useState<AngolanProvince>('Luanda');
  const [municipality, setMunicipality] = useState('Luanda');

  // Recover form state
  const [recoverEmail, setRecoverEmail] = useState('');

  // Feedback message
  const [feedback, setFeedback] = useState<{ success: boolean; message: string } | null>(null);

  if (!isOpen) return null;

  const currentMunicipalities =
    ANGOLAN_PROVINCES.find((p) => p.name === province)?.municipalities || [];

  const handleProvinceChange = (prov: AngolanProvince) => {
    setProvince(prov);
    const matched = ANGOLAN_PROVINCES.find((p) => p.name === prov);
    if (matched && matched.municipalities.length > 0) {
      setMunicipality(matched.municipalities[0]);
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    const res = login(loginEmail, loginPassword);
    setFeedback(res);
    if (res.success) {
      setTimeout(() => {
        onClose();
      }, 700);
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    const res = register({
      fullName,
      email: registerEmail,
      phone,
      password: registerPassword,
      province,
      municipality,
    });
    setFeedback(res);
    if (res.success) {
      if (onRegistrationSuccess) {
        onRegistrationSuccess();
      }
      setTimeout(() => {
        onClose();
      }, 1000);
    }
  };

  const handleRecoverSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    const res = recoverPassword(recoverEmail);
    setFeedback(res);
  };


  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#102B55] text-white flex items-center justify-center font-black text-sm">
              E+
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-[#102B55] tracking-tight">
                {mode === 'login' && 'Iniciar Sessão'}
                {mode === 'register' && 'Criar Conta'}
                {mode === 'recover' && 'Recuperar Acesso'}
              </h2>
              <p className="text-[11px] text-slate-500">EMPREGO+ Angola</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback message */}
        {feedback && (
          <div
            className={`p-3 rounded-xl text-xs mb-4 flex items-start gap-2 ${
              feedback.success
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            {feedback.success ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            )}
            <span>{feedback.message}</span>
          </div>
        )}

        {/* Tab switchers */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-xl mb-5 text-xs font-bold">
          <button
            onClick={() => {
              setMode('login');
              setFeedback(null);
            }}
            className={`py-2 rounded-lg transition-all ${
              mode === 'login' ? 'bg-white text-[#102B55] shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Entrar
          </button>
          <button
            onClick={() => {
              setMode('register');
              setFeedback(null);
            }}
            className={`py-2 rounded-lg transition-all ${
              mode === 'register' ? 'bg-white text-[#102B55] shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Criar Conta
          </button>
        </div>

        {/* LOGIN FORM */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Endereço de E-mail</label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="seu.email@exemplo.ao"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#102B55]"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block font-bold text-slate-700">Palavra-passe</label>
                <button
                  type="button"
                  onClick={() => setMode('recover')}
                  className="text-[11px] text-[#FF8A00] font-semibold hover:underline"
                >
                  Esqueceu a palavra-passe?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#102B55] pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#102B55] hover:bg-[#FF8A00] text-white font-bold rounded-xl transition-all shadow-md mt-2 flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Entrar na Minha Conta</span>
            </button>
          </form>
        )}

        {/* REGISTER FORM */}
        {mode === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Nome Completo</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ex: Constantino José da Costa"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Endereço de E-mail</label>
                <input
                  type="email"
                  required
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  placeholder="joao@exemplo.ao"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
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
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Província de Residência</label>
                <select
                  value={province}
                  onChange={(e) => handleProvinceChange(e.target.value as AngolanProvince)}
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
                <select
                  value={municipality}
                  onChange={(e) => setMunicipality(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
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
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                placeholder="Mínimo de 5 caracteres"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div className="bg-orange-50/70 p-3 rounded-xl border border-orange-200 text-[11px] text-slate-700">
              Taxa de inscrição única de <strong>{config.subscriptionFeeKz.toLocaleString()} Kz</strong> via Multicaixa Express ({config.multicaixaExpressPhone}) ou BAI. A ativação requer envio de comprovativo e aprovação administrativa.
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#FF8A00] hover:bg-[#e67a00] text-white font-bold rounded-xl transition-all shadow-md mt-2 flex items-center justify-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>Criar Conta</span>
            </button>
          </form>
        )}

        {/* RECOVER FORM */}
        {mode === 'recover' && (
          <form onSubmit={handleRecoverSubmit} className="space-y-4 text-xs">
            <p className="text-slate-600 leading-relaxed">
              Insira o e-mail associado à sua conta EMPREGO+. Enviaremos instruções de redefinição de palavra-passe.
            </p>

            <div>
              <label className="block font-bold text-slate-700 mb-1">E-mail Registado</label>
              <input
                type="email"
                required
                value={recoverEmail}
                onChange={(e) => setRecoverEmail(e.target.value)}
                placeholder="seu.email@exemplo.ao"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#102B55] hover:bg-[#FF8A00] text-white font-bold rounded-xl transition-all"
            >
              Recuperar Palavra-passe
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-slate-500 hover:text-slate-800 font-semibold text-xs"
              >
                ← Voltar ao Início de Sessão
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
