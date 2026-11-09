import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, PaymentProof, PlatformConfig, UserPreferences, AngolanProvince, AccountStatus } from '../types';
import { StorageService, DEFAULT_PLATFORM_CONFIG } from '../utils/storage';

interface RegisterData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  province: AngolanProvince;
  municipality: string;
}

interface AuthContextType {
  currentUser: User | null;
  users: User[];
  config: PlatformConfig;
  isLoading: boolean;
  login: (email: string, password?: string) => { success: boolean; message: string };
  register: (data: RegisterData) => { success: boolean; message: string };
  registerAndSubmitProof: (data: RegisterData, proof: PaymentProof) => { success: boolean; message: string };
  logout: () => void;
  recoverPassword: (email: string) => { success: boolean; message: string; tempToken?: string };
  submitPaymentProof: (proof: PaymentProof) => { success: boolean; message: string };
  approveUserPayment: (userId: string) => void;
  rejectUserPayment: (userId: string, reason: string) => void;
  toggleUserSuspension: (userId: string) => void;
  updateUserPreferences: (prefs: UserPreferences) => void;
  updatePlatformConfig: (newConfig: Partial<PlatformConfig>) => void;
  exportDatabase: () => string;
  importDatabase: (json: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [config, setConfig] = useState<PlatformConfig>(DEFAULT_PLATFORM_CONFIG);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Load initial data
    const loadedUsers = StorageService.getUsers();
    const loadedConfig = StorageService.getConfig();
    const activeUser = StorageService.getCurrentUser();

    setUsers(loadedUsers);
    setConfig(loadedConfig);

    if (activeUser) {
      // Refresh current user state from latest users array
      const matched = loadedUsers.find((u) => u.id === activeUser.id);
      setCurrentUser(matched || activeUser);
    } else {
      // Default initial visitor is not logged in
      setCurrentUser(null);
    }

    setIsLoading(false);
  }, []);

  const login = (email: string, password?: string): { success: boolean; message: string } => {
    const trimmedEmail = email.trim().toLowerCase();
    const matched = users.find((u) => u.email.toLowerCase() === trimmedEmail);

    if (!matched) {
      return { success: false, message: 'Utilizador não encontrado com este e-mail.' };
    }

    if (password && matched.password && matched.password !== password) {
      return { success: false, message: 'Palavra-passe incorrecta. Tente novamente ou use Recuperar.' };
    }

    setCurrentUser(matched);
    StorageService.setCurrentUser(matched);
    return { success: true, message: `Sessão iniciada como ${matched.fullName}.` };
  };

  const register = (data: RegisterData): { success: boolean; message: string } => {
    const trimmedEmail = data.email.trim().toLowerCase();
    const trimmedPhone = data.phone.trim().replace(/\s+/g, '');

    // Duplicate prevention
    const existingEmail = users.find((u) => u.email.toLowerCase() === trimmedEmail);
    if (existingEmail) {
      return { success: false, message: 'Já existe uma conta associada a este endereço de e-mail.' };
    }

    const existingPhone = users.find((u) => u.phone.replace(/\s+/g, '') === trimmedPhone);
    if (existingPhone) {
      return { success: false, message: 'Já existe uma conta registada com este número de telefone.' };
    }

    // Email basic RFC validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return { success: false, message: 'Por favor, insira um endereço de e-mail válido.' };
    }

    if (data.password.length < 5) {
      return { success: false, message: 'A palavra-passe deve conter pelo menos 5 caracteres.' };
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      fullName: data.fullName.trim(),
      email: trimmedEmail,
      phone: trimmedPhone,
      password: data.password,
      province: data.province,
      municipality: data.municipality.trim(),
      role: 'candidate',
      status: 'PENDENTE_PAGAMENTO',
      registeredAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      preferences: {
        provinces: [data.province],
        categories: [],
        emailAlerts: true,
        inAppAlerts: true,
      },
      paymentHistory: [],
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    StorageService.saveUsers(updatedUsers);

    setCurrentUser(newUser);
    StorageService.setCurrentUser(newUser);

    // Initial notification
    const notifications = StorageService.getNotifications();
    notifications.unshift({
      id: `notif-${Date.now()}`,
      userId: newUser.id,
      title: 'Bem-vindo ao EMPREGO+!',
      message: `A sua conta foi registada com sucesso. Para aceder às oportunidades, efectue a taxa de inscrição de ${config.subscriptionFeeKz.toLocaleString()} Kz e anexe o comprovativo.`,
      type: 'PAYMENT_PENDING',
      isRead: false,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    });
    StorageService.saveNotifications(notifications);

    return { success: true, message: 'Registo concluído com sucesso! Proceda ao pagamento da inscrição.' };
  };

  const registerAndSubmitProof = (
    data: RegisterData,
    proof: PaymentProof
  ): { success: boolean; message: string } => {
    const trimmedEmail = data.email.trim().toLowerCase();
    const trimmedPhone = data.phone.trim().replace(/\s+/g, '');

    // Duplicate prevention
    const existingEmail = users.find((u) => u.email.toLowerCase() === trimmedEmail);
    if (existingEmail) {
      return { success: false, message: 'Já existe uma conta associada a este endereço de e-mail.' };
    }

    const existingPhone = users.find((u) => u.phone.replace(/\s+/g, '') === trimmedPhone);
    if (existingPhone) {
      return { success: false, message: 'Já existe uma conta registada com este número de telefone.' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return { success: false, message: 'Por favor, insira um endereço de e-mail válido.' };
    }

    if (data.password.length < 5) {
      return { success: false, message: 'A palavra-passe deve conter pelo menos 5 caracteres.' };
    }

    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);

    const newUser: User = {
      id: `user-${Date.now()}`,
      fullName: data.fullName.trim(),
      email: trimmedEmail,
      phone: trimmedPhone,
      password: data.password,
      province: data.province,
      municipality: data.municipality.trim(),
      role: 'candidate',
      status: 'COMPROVATIVO_ENVIADO',
      registeredAt: now,
      paymentProof: proof,
      preferences: {
        provinces: [data.province],
        categories: [],
        emailAlerts: true,
        inAppAlerts: true,
      },
      paymentHistory: [proof],
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    StorageService.saveUsers(updatedUsers);

    setCurrentUser(newUser);
    StorageService.setCurrentUser(newUser);

    const notifications = StorageService.getNotifications();
    notifications.unshift({
      id: `notif-${Date.now()}`,
      userId: newUser.id,
      title: 'Comprovativo Submetido com Sucesso',
      message: `A sua conta foi registada e o comprovativo de ${proof.amountKz.toLocaleString()} Kz foi submetido. O fundador Constantino José da Costa está a conferir o depósito bancário.`,
      type: 'PAYMENT_PENDING',
      isRead: false,
      createdAt: now,
    });
    StorageService.saveNotifications(notifications);

    StorageService.addAuditLog(
      newUser.fullName,
      'SUBMISSÃO_COMPROVATIVO',
      `Novo utilizador registado com envio de comprovativo (${proof.method}) de ${proof.amountKz.toLocaleString()} Kz.`,
      newUser.id
    );

    return {
      success: true,
      message: 'Conta criada e comprovativo submetido com sucesso! O administrador irá conferir o extracto.',
    };
  };

  const logout = () => {
    setCurrentUser(null);
    StorageService.setCurrentUser(null);
  };

  const recoverPassword = (email: string): { success: boolean; message: string; tempToken?: string } => {
    const trimmed = email.trim().toLowerCase();
    const matched = users.find((u) => u.email.toLowerCase() === trimmed);
    if (!matched) {
      return { success: false, message: 'Nenhuma conta encontrada com este e-mail no sistema.' };
    }
    const tempCode = Math.floor(100000 + Math.random() * 900000).toString();
    return {
      success: true,
      message: `Instruções de recuperação enviadas para ${trimmed}. Código de verificação provisório: ${tempCode}`,
      tempToken: tempCode,
    };
  };

  const submitPaymentProof = (proof: PaymentProof): { success: boolean; message: string } => {
    if (!currentUser) {
      return { success: false, message: 'Precisa de ter sessão iniciada para submeter o comprovativo.' };
    }

    const updatedUser: User = {
      ...currentUser,
      status: 'COMPROVATIVO_ENVIADO',
      paymentProof: proof,
      paymentHistory: [...(currentUser.paymentHistory || []), proof],
    };

    const updatedUsers = users.map((u) => (u.id === currentUser.id ? updatedUser : u));
    setUsers(updatedUsers);
    StorageService.saveUsers(updatedUsers);

    setCurrentUser(updatedUser);
    StorageService.setCurrentUser(updatedUser);

    // Add candidate notification
    const notifs = StorageService.getNotifications();
    notifs.unshift({
      id: `notif-${Date.now()}`,
      userId: currentUser.id,
      title: 'Comprovativo Submetido com Sucesso',
      message: `O seu comprovativo (${proof.method === 'MULTICAIXA_EXPRESS' ? 'Multicaixa Express' : 'Transferência BAI'}) de ${proof.amountKz.toLocaleString()} Kz foi recebido e aguarda aprovação pelo administrador.`,
      type: 'PAYMENT_PENDING',
      isRead: false,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    });
    StorageService.saveNotifications(notifs);

    return {
      success: true,
      message: 'Comprovativo enviado com sucesso! A administração irá analisar e aprovar a sua conta.',
    };
  };

  const approveUserPayment = (userId: string) => {
    const adminName = currentUser?.fullName || 'Constantino José da Costa';
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);

    const updatedUsers = users.map((u) => {
      if (u.id === userId) {
        return {
          ...u,
          status: 'ATIVO' as const,
          approvedAt: now,
          approvedBy: adminName,
        };
      }
      return u;
    });

    setUsers(updatedUsers);
    StorageService.saveUsers(updatedUsers);

    const approvedUser = updatedUsers.find((u) => u.id === userId);
    if (approvedUser) {
      StorageService.addAuditLog(
        adminName,
        'APROVAÇÃO_PAGAMENTO',
        `Aprovado pagamento de 1.000 Kz e ativada conta de ${approvedUser.fullName} (${approvedUser.province}).`,
        userId
      );

      // Notification
      const notifs = StorageService.getNotifications();
      notifs.unshift({
        id: `notif-${Date.now()}`,
        userId,
        title: 'Inscrição Aprovada e Ativada!',
        message: `Parabéns ${approvedUser.fullName}! O seu comprovativo de pagamento foi aprovado por Constantino José da Costa. Agora tem acesso irrestrito a todas as oportunidades de emprego em Angola.`,
        type: 'PAYMENT_APPROVED',
        isRead: false,
        createdAt: now,
      });
      StorageService.saveNotifications(notifs);
    }

    if (currentUser?.id === userId) {
      const refreshed = updatedUsers.find((u) => u.id === userId) || null;
      setCurrentUser(refreshed);
      StorageService.setCurrentUser(refreshed);
    }
  };

  const rejectUserPayment = (userId: string, reason: string) => {
    const adminName = currentUser?.fullName || 'Constantino José da Costa';
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);

    const updatedUsers = users.map((u) => {
      if (u.id === userId) {
        return {
          ...u,
          status: 'REJEITADO' as const,
          rejectionReason: reason,
        };
      }
      return u;
    });

    setUsers(updatedUsers);
    StorageService.saveUsers(updatedUsers);

    const targetUser = updatedUsers.find((u) => u.id === userId);
    if (targetUser) {
      StorageService.addAuditLog(
        adminName,
        'REJEIÇÃO_PAGAMENTO',
        `Comprovativo de ${targetUser.fullName} rejeitado. Motivo: ${reason}`,
        userId
      );

      const notifs = StorageService.getNotifications();
      notifs.unshift({
        id: `notif-${Date.now()}`,
        userId,
        title: 'Comprovativo Não Aprovado',
        message: `O seu comprovativo de pagamento não pôde ser validado. Motivo: "${reason}". Por favor aceda à sua área para submeter um novo documento legível.`,
        type: 'PAYMENT_REJECTED',
        isRead: false,
        createdAt: now,
      });
      StorageService.saveNotifications(notifs);
    }

    if (currentUser?.id === userId) {
      const refreshed = updatedUsers.find((u) => u.id === userId) || null;
      setCurrentUser(refreshed);
      StorageService.setCurrentUser(refreshed);
    }
  };

  const toggleUserSuspension = (userId: string) => {
    const adminName = currentUser?.fullName || 'Constantino José da Costa';
    const target = users.find((u) => u.id === userId);
    if (!target) return;

    const newStatus: AccountStatus = target.status === 'SUSPENSO' ? 'ATIVO' : 'SUSPENSO';
    const updatedUsers: User[] = users.map((u) => (u.id === userId ? { ...u, status: newStatus } : u));

    setUsers(updatedUsers);
    StorageService.saveUsers(updatedUsers);

    StorageService.addAuditLog(
      adminName,
      newStatus === 'SUSPENSO' ? 'SUSPENSÃO_CONTA' : 'REATIVAÇÃO_CONTA',
      `Conta de ${target.fullName} (${target.email}) alterada para status: ${newStatus}.`,
      userId
    );

    if (currentUser?.id === userId) {
      const refreshed = updatedUsers.find((u) => u.id === userId) || null;
      setCurrentUser(refreshed);
      StorageService.setCurrentUser(refreshed);
    }
  };

  const updateUserPreferences = (prefs: UserPreferences) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, preferences: prefs };
    const updatedUsers = users.map((u) => (u.id === currentUser.id ? updatedUser : u));

    setUsers(updatedUsers);
    StorageService.saveUsers(updatedUsers);
    setCurrentUser(updatedUser);
    StorageService.setCurrentUser(updatedUser);
  };

  const updatePlatformConfig = (newConfig: Partial<PlatformConfig>) => {
    const merged = { ...config, ...newConfig };
    setConfig(merged);
    StorageService.saveConfig(merged);

    StorageService.addAuditLog(
      currentUser?.fullName || 'Constantino José da Costa',
      'ACTUALIZACAO_CONFIGURACAO',
      'Actualização das definições da plataforma (tarifas bancárias ou dados institucionais).'
    );
  };

  const exportDatabase = (): string => {
    return StorageService.exportFullBackup();
  };

  const importDatabase = (json: string): boolean => {
    const success = StorageService.importBackup(json);
    if (success) {
      setUsers(StorageService.getUsers());
      setConfig(StorageService.getConfig());
    }
    return success;
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        users,
        config,
        isLoading,
        login,
        register,
        registerAndSubmitProof,
        logout,
        recoverPassword,
        submitPaymentProof,
        approveUserPayment,
        rejectUserPayment,
        toggleUserSuspension,
        updateUserPreferences,
        updatePlatformConfig,
        exportDatabase,
        importDatabase,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
