export type AngolanProvince =
  | 'Luanda'
  | 'Benguela'
  | 'Huambo'
  | 'Huíla'
  | 'Cabinda'
  | 'Cuanza Norte'
  | 'Cuanza Sul'
  | 'Malanje'
  | 'Uíge'
  | 'Zaire'
  | 'Bié'
  | 'Moxico'
  | 'Moxico Leste'
  | 'Cuando'
  | 'Cubango'
  | 'Cunene'
  | 'Namibe'
  | 'Lunda Norte'
  | 'Lunda Sul'
  | 'Bengo'
  | 'Icolo e Bengo';

export type UserRole = 'admin' | 'candidate';

export type AccountStatus =
  | 'PENDENTE_PAGAMENTO'
  | 'COMPROVATIVO_ENVIADO'
  | 'ATIVO'
  | 'SUSPENSO'
  | 'REJEITADO';

export type PaymentMethod = 'MULTICAIXA_EXPRESS' | 'TRANSFERENCIA_BAI';

export interface PaymentProof {
  receiptUrl: string; // Base64 data URL or PDF data
  fileName: string;
  fileType: 'image' | 'pdf';
  fileSize?: string;
  submittedAt: string;
  method: PaymentMethod;
  referenceCode?: string;
  amountKz: number;
}

export interface UserPreferences {
  provinces: string[]; // empty means all of Angola
  categories: string[];
  emailAlerts: boolean;
  inAppAlerts: boolean;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  password?: string;
  province: AngolanProvince;
  municipality: string;
  role: UserRole;
  status: AccountStatus;
  rejectionReason?: string;
  registeredAt: string;
  approvedAt?: string;
  approvedBy?: string;
  paymentProof?: PaymentProof;
  paymentHistory?: PaymentProof[];
  preferences: UserPreferences;
}

export interface JobVacancy {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  description: string;
  requirements: string[];
  experienceLevel: string;
  documentsRequired: string[];
  province: AngolanProvince;
  municipality: string;
  deadline: string; // YYYY-MM-DD
  publishedAt: string;
  sourceName: string;
  officialApplyUrl: string;
  category: JobCategory;
  contractType: 'Tempo Inteiro' | 'Parcial' | 'Estágio Profissional' | 'Temporário' | 'Remoto';
  isExpired: boolean;
  isFeatured?: boolean;
  isAutoCollected?: boolean;
  collectedFromFeedId?: string;
  sector: 'Privado' | 'Público' | 'Misto';
  salaryInfo?: string;
}

export type JobCategory =
  | 'Petróleo & Gás'
  | 'Banca, Seguros & Finanças'
  | 'Telecomunicações & TI'
  | 'Saúde & Farmacêutica'
  | 'Educação & Formação'
  | 'Logística, Cargas & Transportes'
  | 'Construção Civil & Engenharia'
  | 'Comércio, Retalho & Supermercados'
  | 'Recursos Humanos & Administração'
  | 'Hotelaria, Restauração & Turismo'
  | 'Indústria & Produção Fabril'
  | 'Agricultura & Agro-negócio'
  | 'Segurança & Vigilância'
  | 'Outros Sectores';

export interface AutomatedSourceFeed {
  id: string;
  name: string;
  portalType: 'EMPRESA_OFICIAL' | 'PORTAL_PUBLICO' | 'PLATAFORMA_RECRUTAMENTO';
  url: string;
  status: 'ATIVO' | 'EM_MANUTENCAO' | 'SINCRONIZADO';
  lastSyncAt: string;
  jobsCount: number;
  description: string;
  checkFrequency: string;
}

export interface PlatformConfig {
  subscriptionFeeKz: number;
  multicaixaExpressPhone: string;
  baiIban: string;
  titularName: string;
  supportPhone: string;
  supportEmail: string;
  founderName: string;
  allowSelfRegistration: boolean;
  maintenanceMode: boolean;
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'JOB_ALERT' | 'PAYMENT_APPROVED' | 'PAYMENT_PENDING' | 'PAYMENT_REJECTED' | 'SYSTEM' | 'ACCOUNT_ALERT';
  isRead: boolean;
  createdAt: string;
  linkUrl?: string;
}

export interface AuditLog {
  id: string;
  adminName: string;
  action: string;
  details: string;
  timestamp: string;
  targetId?: string;
}
