import { User, JobVacancy, AutomatedSourceFeed, PlatformConfig, AppNotification, AuditLog } from '../types';
import { INITIAL_JOB_VACANCIES } from '../data/initialJobs';
import { INITIAL_AUTOMATED_FEEDS } from '../data/automatedFeeds';

const STORAGE_KEYS = {
  USERS: 'emprego_plus_users_v1',
  CURRENT_USER: 'emprego_plus_current_user_v1',
  JOBS: 'emprego_plus_jobs_v1',
  FEEDS: 'emprego_plus_feeds_v1',
  CONFIG: 'emprego_plus_config_v1',
  NOTIFICATIONS: 'emprego_plus_notifications_v1',
  AUDIT_LOGS: 'emprego_plus_audit_logs_v1',
};

export const DEFAULT_PLATFORM_CONFIG: PlatformConfig = {
  subscriptionFeeKz: 1000,
  multicaixaExpressPhone: '928928188',
  baiIban: '004000002706581510135',
  titularName: 'Constantino José da Costa',
  supportPhone: '+244 928 928 188',
  supportEmail: 'constantinocosta2002@gmail.com',
  founderName: 'Constantino José da Costa',
  allowSelfRegistration: true,
  maintenanceMode: false,
};

// Initial Seed Users
export const INITIAL_USERS: User[] = [
  {
    id: 'user-admin-constantino',
    fullName: 'Constantino José da Costa',
    email: 'constantinocosta2002@gmail.com',
    phone: '928928188',
    password: 'admin',
    province: 'Luanda',
    municipality: 'Luanda',
    role: 'admin',
    status: 'ATIVO',
    registeredAt: '2026-11-01 08:00',
    approvedAt: '2026-11-01 08:00',
    approvedBy: 'Sistema / Proprietário',
    preferences: {
      provinces: [],
      categories: [],
      emailAlerts: true,
      inAppAlerts: true,
    },
  },
  {
    id: 'user-cand-001',
    fullName: 'Mateus Manuel Domingos',
    email: 'mateus.domingos@exemplo.ao',
    phone: '923456789',
    password: 'user123',
    province: 'Benguela',
    municipality: 'Lobito',
    role: 'candidate',
    status: 'COMPROVATIVO_ENVIADO',
    registeredAt: '2026-11-08 14:20',
    paymentProof: {
      receiptUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="600" viewBox="0 0 400 600"><rect width="400" height="600" fill="%23f8fafc"/><rect x="20" y="20" width="360" height="560" rx="12" fill="%23ffffff" stroke="%23cbd5e1" stroke-width="2"/><text x="200" y="70" font-family="Arial" font-size="20" font-weight="bold" fill="%23102B55" text-anchor="middle">MULTICAIXA EXPRESS</text><text x="200" y="100" font-family="Arial" font-size="13" fill="%2364748b" text-anchor="middle">Comprovativo de Pagamento</text><line x1="40" y1="120" x2="360" y2="120" stroke="%23e2e8f0" stroke-width="2"/><text x="50" y="160" font-family="Arial" font-size="12" fill="%2364748b">Beneficiário:</text><text x="50" y="185" font-family="Arial" font-size="14" font-weight="bold" fill="%23102B55">Constantino José da Costa</text><text x="50" y="225" font-family="Arial" font-size="12" fill="%2364748b">Telefone de Destino:</text><text x="50" y="250" font-family="Arial" font-size="14" font-weight="bold" fill="%23102B55">928 928 188</text><text x="50" y="290" font-family="Arial" font-size="12" fill="%2364748b">Montante Transferido:</text><text x="50" y="320" font-family="Arial" font-size="22" font-weight="bold" fill="%23FF8A00">1.000,00 Kz</text><text x="50" y="360" font-family="Arial" font-size="12" fill="%2364748b">Referência / Id Transacção:</text><text x="50" y="385" font-family="Arial" font-size="13" font-weight="bold" fill="%23334155">MCX-20261108-948210</text><text x="50" y="425" font-family="Arial" font-size="12" fill="%2364748b">Data e Hora:</text><text x="50" y="450" font-family="Arial" font-size="13" fill="%23334155">08/11/2026 14:15:32</text><text x="200" y="520" font-family="Arial" font-size="11" fill="%2316a34a" font-weight="bold" text-anchor="middle">OPERACAO CONCLUIDA COM SUCESSO</text></svg>',
      fileName: 'comprovativo_multicaixa_mateus.png',
      fileType: 'image',
      fileSize: '142 KB',
      submittedAt: '2026-11-08 14:22',
      method: 'MULTICAIXA_EXPRESS',
      referenceCode: 'MCX-20261108-948210',
      amountKz: 1000,
    },
    preferences: {
      provinces: ['Benguela', 'Huambo'],
      categories: ['Indústria & Produção Fabril', 'Logística, Cargas & Transportes'],
      emailAlerts: true,
      inAppAlerts: true,
    },
  },
  {
    id: 'user-cand-002',
    fullName: 'Esperança Beatriz de Carvalho',
    email: 'esperanca.carvalho@exemplo.ao',
    phone: '945112233',
    password: 'user123',
    province: 'Huíla',
    municipality: 'Lubango',
    role: 'candidate',
    status: 'ATIVO',
    registeredAt: '2026-11-05 10:15',
    approvedAt: '2026-11-05 11:30',
    approvedBy: 'Constantino José da Costa',
    paymentProof: {
      receiptUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="600" viewBox="0 0 400 600"><rect width="400" height="600" fill="%23f8fafc"/><rect x="20" y="20" width="360" height="560" rx="12" fill="%23ffffff" stroke="%23cbd5e1" stroke-width="2"/><text x="200" y="70" font-family="Arial" font-size="20" font-weight="bold" fill="%23102B55" text-anchor="middle">BANCO BAI</text><text x="200" y="100" font-family="Arial" font-size="13" fill="%2364748b" text-anchor="middle">Comprovativo de Transferência</text><line x1="40" y1="120" x2="360" y2="120" stroke="%23e2e8f0" stroke-width="2"/><text x="50" y="160" font-family="Arial" font-size="12" fill="%2364748b">Conta Destino / IBAN:</text><text x="50" y="185" font-family="Arial" font-size="12" font-weight="bold" fill="%23102B55">0040.0000.2706.5815.1013.5</text><text x="50" y="225" font-family="Arial" font-size="12" fill="%2364748b">Titular Beneficiário:</text><text x="50" y="250" font-family="Arial" font-size="14" font-weight="bold" fill="%23102B55">Constantino José da Costa</text><text x="50" y="290" font-family="Arial" font-size="12" fill="%2364748b">Valor Debitado:</text><text x="50" y="320" font-family="Arial" font-size="22" font-weight="bold" fill="%23FF8A00">1.000,00 Kz</text><text x="50" y="360" font-family="Arial" font-size="12" fill="%2364748b">Ref. Operação BAI:</text><text x="50" y="385" font-family="Arial" font-size="13" font-weight="bold" fill="%23334155">TRF-BAI-8302194</text><text x="50" y="425" font-family="Arial" font-size="12" fill="%2364748b">Data da Transferência:</text><text x="50" y="450" font-family="Arial" font-size="13" fill="%23334155">05/11/2026 10:12:44</text><text x="200" y="520" font-family="Arial" font-size="11" fill="%2316a34a" font-weight="bold" text-anchor="middle">TRANSAÇÃO PROCESSADA COM SUCESSO</text></svg>',
      fileName: 'recibo_transferencia_bai.pdf',
      fileType: 'pdf',
      fileSize: '89 KB',
      submittedAt: '2026-11-05 10:18',
      method: 'TRANSFERENCIA_BAI',
      referenceCode: 'TRF-BAI-8302194',
      amountKz: 1000,
    },
    preferences: {
      provinces: ['Huíla', 'Luanda'],
      categories: ['Banca, Seguros & Finanças', 'Comércio, Retalho & Supermercados'],
      emailAlerts: true,
      inAppAlerts: true,
    },
  },
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    userId: 'user-cand-002',
    title: 'Inscrição Aprovada!',
    message: 'O seu pagamento de 1.000 Kz foi validado por Constantino José da Costa. Agora tem acesso integral a todas as vagas em Angola.',
    type: 'PAYMENT_APPROVED',
    isRead: false,
    createdAt: '2026-11-05 11:30',
  },
  {
    id: 'notif-2',
    userId: 'user-cand-001',
    title: 'Comprovativo Recebido',
    message: 'O seu comprovativo de 1.000 Kz (Multicaixa Express) foi submetido com sucesso e aguarda verificação pela administração.',
    type: 'PAYMENT_PENDING',
    isRead: false,
    createdAt: '2026-11-08 14:22',
  },
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'audit-001',
    adminName: 'Constantino José da Costa',
    action: 'INICIALIZAÇÃO_PLATAFORMA',
    details: 'Configuração dos parâmetros bancários oficiais (Multicaixa 928928188 / BAI IBAN 004000002706581510135).',
    timestamp: '2026-11-01 08:00',
  },
  {
    id: 'audit-002',
    adminName: 'Constantino José da Costa',
    action: 'APROVAÇÃO_PAGAMENTO',
    details: 'Aprovado pagamento de 1.000 Kz e ativada conta da candidata Esperança Beatriz de Carvalho (Huíla).',
    timestamp: '2026-11-05 11:30',
    targetId: 'user-cand-002',
  },
];

export const StorageService = {
  getUsers(): User[] {
    const raw = localStorage.getItem(STORAGE_KEYS.USERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_USERS;
    }
  },

  saveUsers(users: User[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    } catch (e) {
      console.warn('LocalStorage saveUsers quota warning, attempting compact save', e);
      try {
        // If quota exceeded, clean up large historical previews and retry
        const compacted = users.map((u) => ({
          ...u,
          paymentHistory: u.paymentHistory ? u.paymentHistory.slice(-2) : [],
        }));
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(compacted));
      } catch (err2) {
        console.error('LocalStorage critical save error', err2);
      }
    }
  },

  getCurrentUser(): User | null {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  setCurrentUser(user: User | null) {
    if (!user) {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    } else {
      try {
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
      } catch (e) {
        console.warn('LocalStorage setCurrentUser quota reached, saving compact', e);
      }
    }
  },

  getJobs(): JobVacancy[] {
    const raw = localStorage.getItem(STORAGE_KEYS.JOBS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(INITIAL_JOB_VACANCIES));
      return INITIAL_JOB_VACANCIES;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_JOB_VACANCIES;
    }
  },

  saveJobs(jobs: JobVacancy[]) {
    localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(jobs));
  },

  getFeeds(): AutomatedSourceFeed[] {
    const raw = localStorage.getItem(STORAGE_KEYS.FEEDS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.FEEDS, JSON.stringify(INITIAL_AUTOMATED_FEEDS));
      return INITIAL_AUTOMATED_FEEDS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_AUTOMATED_FEEDS;
    }
  },

  saveFeeds(feeds: AutomatedSourceFeed[]) {
    localStorage.setItem(STORAGE_KEYS.FEEDS, JSON.stringify(feeds));
  },

  getConfig(): PlatformConfig {
    const raw = localStorage.getItem(STORAGE_KEYS.CONFIG);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(DEFAULT_PLATFORM_CONFIG));
      return DEFAULT_PLATFORM_CONFIG;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return DEFAULT_PLATFORM_CONFIG;
    }
  },

  saveConfig(config: PlatformConfig) {
    localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(config));
  },

  getNotifications(): AppNotification[] {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
      return INITIAL_NOTIFICATIONS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  },

  saveNotifications(notifs: AppNotification[]) {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifs));
  },

  getAuditLogs(): AuditLog[] {
    const raw = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(INITIAL_AUDIT_LOGS));
      return INITIAL_AUDIT_LOGS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_AUDIT_LOGS;
    }
  },

  addAuditLog(adminName: string, action: string, details: string, targetId?: string) {
    const logs = this.getAuditLogs();
    const newLog: AuditLog = {
      id: `audit-${Date.now()}`,
      adminName,
      action,
      details,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      targetId,
    };
    logs.unshift(newLog);
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(logs.slice(0, 100)));
  },

  exportFullBackup(): string {
    const backup = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      platform: 'EMPREGO+ ANGOLA',
      founder: 'Constantino José da Costa',
      config: this.getConfig(),
      users: this.getUsers(),
      jobs: this.getJobs(),
      feeds: this.getFeeds(),
      notifications: this.getNotifications(),
      auditLogs: this.getAuditLogs(),
    };
    return JSON.stringify(backup, null, 2);
  },

  importBackup(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);
      if (data.users && Array.isArray(data.users)) this.saveUsers(data.users);
      if (data.jobs && Array.isArray(data.jobs)) this.saveJobs(data.jobs);
      if (data.feeds && Array.isArray(data.feeds)) this.saveFeeds(data.feeds);
      if (data.config) this.saveConfig(data.config);
      if (data.notifications && Array.isArray(data.notifications)) this.saveNotifications(data.notifications);
      return true;
    } catch (e) {
      console.error('Failed to import backup', e);
      return false;
    }
  },
};
