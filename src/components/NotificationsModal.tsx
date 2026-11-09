import React, { useState } from 'react';
import { useNotifications } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';
import {
  X,
  Bell,
  Mail,
  CheckCheck,
  Trash2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Briefcase,
  Settings
} from 'lucide-react';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({ isOpen, onClose }) => {
  const {
    userNotifications,
    markAsRead,
    markAllAsRead,
    clearNotification,
    emailLogs,
  } = useNotifications();
  const { currentUser, updateUserPreferences } = useAuth();

  const [activeTab, setActiveTab] = useState<'inbox' | 'emails' | 'preferencias'>('inbox');

  if (!isOpen) return null;

  const relevantEmails = currentUser
    ? emailLogs.filter((e) => e.recipientEmail.toLowerCase() === currentUser.email.toLowerCase() || currentUser.role === 'admin')
    : [];

  const handleToggleEmailAlerts = () => {
    if (!currentUser) return;
    updateUserPreferences({
      ...currentUser.preferences,
      emailAlerts: !currentUser.preferences.emailAlerts,
    });
  };

  const handleToggleInAppAlerts = () => {
    if (!currentUser) return;
    updateUserPreferences({
      ...currentUser.preferences,
      inAppAlerts: !currentUser.preferences.inAppAlerts,
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-orange-100 text-[#FF8A00] flex items-center justify-center font-bold">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#102B55]">Centro de Notificações & Alertas</h2>
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

        {/* Tab switchers */}
        <div className="flex items-center justify-between gap-2 my-4">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setActiveTab('inbox')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'inbox' ? 'bg-white text-[#102B55] shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Notificações ({userNotifications.length})
            </button>
            <button
              onClick={() => setActiveTab('emails')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                activeTab === 'emails' ? 'bg-white text-[#102B55] shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Mail className="w-3.5 h-3.5 text-[#FF8A00]" />
              <span>E-mails ({relevantEmails.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('preferencias')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'preferencias' ? 'bg-white text-[#102B55] shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Preferências
            </button>
          </div>

          {activeTab === 'inbox' && userNotifications.length > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-[11px] font-semibold text-[#FF8A00] hover:underline flex items-center gap-1"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Marcar todas lidas</span>
            </button>
          )}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
          {/* TAB: INBOX */}
          {activeTab === 'inbox' && (
            <>
              {userNotifications.length === 0 ? (
                <div className="text-center py-10 text-slate-400">
                  <Bell className="w-10 h-10 mx-auto mb-2 opacity-40 text-slate-300" />
                  <p className="font-semibold text-slate-600">Não tem notificações recentes</p>
                  <p className="text-[11px] mt-0.5">As novidades sobre vagas e pagamentos surgirão aqui.</p>
                </div>
              ) : (
                userNotifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => markAsRead(notif.id)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative ${
                      notif.isRead
                        ? 'bg-white border-slate-200 text-slate-700'
                        : 'bg-blue-50/60 border-blue-200 text-slate-900 shadow-sm'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {notif.type === 'PAYMENT_APPROVED' && (
                          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        )}
                        {notif.type === 'PAYMENT_PENDING' && (
                          <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                        )}
                        {notif.type === 'PAYMENT_REJECTED' && (
                          <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                        )}
                        {notif.type === 'JOB_ALERT' && (
                          <span className="w-2 h-2 rounded-full bg-[#FF8A00]"></span>
                        )}
                        <h4 className="font-bold text-xs text-[#102B55]">{notif.title}</h4>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-400">{notif.createdAt}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            clearNotification(notif.id);
                          }}
                          className="text-slate-400 hover:text-rose-500 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-slate-600 mt-1 leading-relaxed text-xs">
                      {notif.message}
                    </p>
                  </div>
                ))
              )}
            </>
          )}

          {/* TAB: EMAILS DISPATCHED */}
          {activeTab === 'emails' && (
            <div className="space-y-3">
              <div className="p-3 bg-slate-50 rounded-xl text-[11px] text-slate-600">
                O EMPREGO+ dispara notificações por correio electrónico para <strong>{currentUser?.email}</strong> quando surgem vagas correspondentes à sua província ou actualizações de pagamento.
              </div>

              {relevantEmails.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  <Mail className="w-10 h-10 mx-auto mb-2 opacity-40 text-slate-300" />
                  <p className="font-semibold text-slate-600">Nenhum e-mail enviado recentemente</p>
                </div>
              ) : (
                relevantEmails.map((email) => (
                  <div key={email.id} className="p-3.5 rounded-2xl border border-slate-200 bg-white">
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-bold text-[#102B55] text-xs">{email.subject}</span>
                      <span className="text-[10px] text-slate-400 shrink-0">{email.sentAt}</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">{email.bodySnippet}</p>
                    <div className="mt-2 text-[10px] text-slate-400 flex items-center justify-between">
                      <span>Destinatário: {email.recipientEmail}</span>
                      <span className="text-emerald-600 font-semibold">Entregue com Sucesso</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB: PREFERENCIAS */}
          {activeTab === 'preferencias' && currentUser && (
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="font-bold text-xs text-[#102B55]">Canais de Alerta</h4>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-800">Alertas por E-mail</p>
                    <p className="text-[11px] text-slate-500">Receba notificações de novas vagas por e-mail</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={currentUser.preferences.emailAlerts}
                    onChange={handleToggleEmailAlerts}
                    className="w-4 h-4 text-[#FF8A00] rounded focus:ring-0 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                  <div>
                    <p className="font-semibold text-slate-800">Alertas no Aplicativo</p>
                    <p className="text-[11px] text-slate-500">Notificações no sino de avisos do portal</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={currentUser.preferences.inAppAlerts}
                    onChange={handleToggleInAppAlerts}
                    className="w-4 h-4 text-[#FF8A00] rounded focus:ring-0 cursor-pointer"
                  />
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <h4 className="font-bold text-xs text-[#102B55] mb-1">Província Preferencial</h4>
                <p className="text-[11px] text-slate-500 mb-2">
                  Actualmente configurado para receber prioridade na província de <strong>{currentUser.province}</strong>.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
