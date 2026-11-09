import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import {
  Briefcase,
  User,
  ShieldCheck,
  Bell,
  LogOut,
  LogIn,
  UserPlus,
  Menu,
  X,
  CreditCard,
  MapPin,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Info
} from 'lucide-react';

import { PWAInstallButton } from './PWAInstallButton';

interface NavbarProps {
  currentTab: 'vagas' | 'provincias' | 'como-funciona' | 'pagamento' | 'sobre' | 'admin';
  setCurrentTab: (tab: 'vagas' | 'provincias' | 'como-funciona' | 'pagamento' | 'sobre' | 'admin') => void;
  onOpenAuth: (initialMode?: 'login' | 'register') => void;
  onOpenNotifications: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  onOpenAuth,
  onOpenNotifications,
}) => {
  const { currentUser, logout, config } = useAuth();
  const { unreadCount } = useNotifications();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const getStatusBadge = () => {
    if (!currentUser) return null;
    switch (currentUser.status) {
      case 'ATIVO':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Conta Ativa
          </span>
        );
      case 'COMPROVATIVO_ENVIADO':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
            Aprovação Pendente
          </span>
        );
      case 'PENDENTE_PAGAMENTO':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-50 text-orange-700 border border-orange-200">
            <CreditCard className="w-3.5 h-3.5 text-orange-600" />
            Aguardar Pagamento
          </span>
        );
      case 'SUSPENSO':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            Conta Suspensa
          </span>
        );
      case 'REJEITADO':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
            <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
            Recibo Rejeitado
          </span>
        );
      default:
        return null;
    }
  };

  const navItems = [
    { id: 'vagas', label: 'Vagas & Oportunidades', icon: Briefcase },
    { id: 'provincias', label: 'As 21 Províncias', icon: MapPin },
    { id: 'como-funciona', label: 'Como Funciona', icon: Info },
    { id: 'pagamento', label: 'Ativar Conta', icon: CreditCard },
    { id: 'sobre', label: 'Sobre Nós', icon: ShieldCheck },
  ] as const;

  return (
    <header className="sticky top-0 z-40 bg-[#102B55] text-white shadow-md border-b border-[#183C73]">
      {/* Top micro banner */}
      <div className="bg-[#0B1E3D] px-4 py-1.5 text-xs text-slate-300 flex justify-between items-center border-b border-[#142d54]">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span className="font-medium text-slate-200">EMPREGO+</span>
          <span className="hidden sm:inline text-slate-400">| Plataforma Nacional de Emprego em Angola</span>
          <span className="hidden md:inline px-2 py-0.2 rounded bg-slate-800 text-[#FF8A00] font-semibold text-[10px]">21 PROVÍNCIAS</span>
        </div>
        <div className="flex items-center gap-4 text-slate-300 text-[11px]">
          <span className="hidden sm:inline">Fundador: <strong className="text-white font-semibold">{config.founderName}</strong></span>
          <span>Apoio: <strong className="text-[#FF8A00]">{config.supportPhone}</strong></span>
        </div>
      </div>

      {/* Main navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            onClick={() => {
              setCurrentTab('vagas');
              setMobileMenuOpen(false);
            }}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#FF8A00] flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform">
              <span className="text-white font-black text-xl tracking-tighter">E+</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-tight text-white">EMPREGO</span>
                <span className="text-xl font-black text-[#FF8A00]">+</span>
              </div>
              <p className="text-[10px] text-slate-300 font-medium tracking-wide uppercase">Angola Oportunidades</p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              const isActivateTab = item.id === 'pagamento';
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-white/10 text-white font-semibold shadow-inner'
                      : isActivateTab
                      ? 'text-[#FF8A00] hover:text-white hover:bg-[#FF8A00]/20 font-bold'
                      : 'text-slate-200 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#FF8A00]' : isActivateTab ? 'text-[#FF8A00]' : 'text-slate-400'}`} />
                  {item.label}
                  {isActivateTab && (
                    <span className="text-[10px] bg-[#FF8A00] text-white px-1.5 py-0.5 rounded-md font-extrabold uppercase shadow-sm">
                      1.000 Kz
                    </span>
                  )}
                </button>
              );
            })}

            {/* Admin Panel button if role is admin */}
            {currentUser?.role === 'admin' && (
              <button
                onClick={() => setCurrentTab('admin')}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold transition-all ${
                  currentTab === 'admin'
                    ? 'bg-[#FF8A00] text-white shadow-lg shadow-orange-500/30'
                    : 'bg-[#FF8A00]/20 text-[#FF8A00] hover:bg-[#FF8A00] hover:text-white border border-[#FF8A00]/40'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                Painel Admin
              </button>
            )}
          </nav>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            <PWAInstallButton />
            {/* Notification Bell */}
            {currentUser && (
              <button
                onClick={onOpenNotifications}
                className="relative p-2 rounded-lg text-slate-200 hover:text-white hover:bg-white/10 transition-colors"
                title="Notificações"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#FF8A00] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                    {unreadCount}
                  </span>
                )}
              </button>
            )}

            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2.5 p-1.5 pl-3 pr-2.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/10 transition-all text-left"
                >
                  <div className="flex flex-col text-right">
                    <span className="text-xs font-semibold text-white max-w-[130px] truncate">
                      {currentUser.fullName}
                    </span>
                    <span className="text-[10px] text-slate-300">
                      {currentUser.province} • {currentUser.role === 'admin' ? 'Administrador' : 'Candidato'}
                    </span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-[#FF8A00] text-white font-bold text-xs flex items-center justify-center shadow-sm">
                    {currentUser.fullName.charAt(0)}
                  </div>
                </button>

                {/* Dropdown menu */}
                {userMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-64 bg-white text-slate-800 rounded-xl shadow-2xl py-2 border border-slate-100 z-50 animate-in fade-in zoom-in-95 duration-100"
                    onMouseLeave={() => setUserMenuOpen(false)}
                  >
                    <div className="px-4 py-2.5 border-b border-slate-100">
                      <p className="text-xs text-slate-500 font-medium">Sessão iniciada como</p>
                      <p className="text-sm font-bold text-[#102B55] truncate">{currentUser.fullName}</p>
                      <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
                      <div className="mt-2">{getStatusBadge()}</div>
                    </div>

                    <div className="py-1">
                      {currentUser.role === 'admin' && (
                        <button
                          onClick={() => {
                            setCurrentTab('admin');
                            setUserMenuOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-[#102B55] hover:bg-slate-50 font-semibold flex items-center gap-2"
                        >
                          <ShieldCheck className="w-4 h-4 text-[#FF8A00]" />
                          Painel de Controlo Admin
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setCurrentTab('pagamento');
                          setUserMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <CreditCard className="w-4 h-4 text-slate-400" />
                        Estado da Minha Inscrição
                      </button>
                      <button
                        onClick={() => {
                          onOpenNotifications();
                          setUserMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <Bell className="w-4 h-4 text-slate-400" />
                        Histórico de Notificações
                      </button>
                    </div>

                    <div className="border-t border-slate-100 pt-1">
                      <button
                        onClick={() => {
                          logout();
                          setUserMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-medium"
                      >
                        <LogOut className="w-4 h-4 text-rose-500" />
                        Terminar Sessão
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenAuth('login')}
                  className="px-3.5 py-2 text-sm font-medium text-slate-200 hover:text-white rounded-lg hover:bg-white/10 transition-colors flex items-center gap-1.5"
                >
                  <LogIn className="w-4 h-4" />
                  Entrar
                </button>
                <button
                  onClick={() => onOpenAuth('register')}
                  className="px-4 py-2 text-sm font-bold text-white bg-[#FF8A00] hover:bg-[#e67a00] rounded-lg shadow-md shadow-orange-500/20 transition-all flex items-center gap-1.5"
                >
                  <UserPlus className="w-4 h-4" />
                  Criar Conta
                </button>
              </div>
            )}
          </div>

          {/* Mobile hamburger button */}
          <div className="flex md:hidden items-center gap-2">
            {currentUser && (
              <button
                onClick={onOpenNotifications}
                className="relative p-2 rounded-lg text-slate-200 hover:text-white"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute 0 top-0 right-0 bg-[#FF8A00] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-200 hover:text-white hover:bg-white/10"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0B1E3D] border-t border-[#183C73] px-4 pt-3 pb-5 space-y-3">
          {currentUser && (
            <div className="bg-[#102B55] p-3 rounded-xl border border-white/10 mb-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-white">{currentUser.fullName}</p>
                  <p className="text-xs text-slate-300">{currentUser.email}</p>
                </div>
                {getStatusBadge()}
              </div>
            </div>
          )}

          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              const isActivateTab = item.id === 'pagamento';
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#FF8A00] text-white font-bold'
                      : isActivateTab
                      ? 'text-[#FF8A00] font-bold bg-[#FF8A00]/10 hover:bg-[#FF8A00]/20'
                      : 'text-slate-200 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {isActivateTab && (
                    <span className="text-[10px] bg-[#FF8A00] text-white px-2 py-0.5 rounded-md font-bold">
                      1.000 Kz
                    </span>
                  )}
                </button>
              );
            })}

            {currentUser?.role === 'admin' && (
              <button
                onClick={() => {
                  setCurrentTab('admin');
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-bold bg-[#FF8A00] text-white mt-2"
              >
                <ShieldCheck className="w-4 h-4" />
                Painel Administrativo
              </button>
            )}
          </div>

          <div className="pt-3 border-t border-white/10 space-y-2">
            {currentUser ? (
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold bg-rose-600/20 text-rose-300 border border-rose-500/30"
              >
                <LogOut className="w-4 h-4" />
                Terminar Sessão
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    onOpenAuth('login');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 rounded-lg text-sm font-semibold text-center bg-white/10 text-white"
                >
                  Entrar
                </button>
                <button
                  onClick={() => {
                    onOpenAuth('register');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 rounded-lg text-sm font-bold text-center bg-[#FF8A00] text-white shadow-md"
                >
                  Criar Conta
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
