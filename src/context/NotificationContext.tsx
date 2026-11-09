import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppNotification } from '../types';
import { StorageService } from '../utils/storage';
import { useAuth } from './AuthContext';

interface EmailLogItem {
  id: string;
  recipientEmail: string;
  recipientName: string;
  subject: string;
  bodySnippet: string;
  sentAt: string;
  type: string;
}

interface NotificationContextType {
  notifications: AppNotification[];
  userNotifications: AppNotification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotification: (id: string) => void;
  sendCustomNotification: (userId: string, title: string, message: string, type?: AppNotification['type']) => void;
  emailLogs: EmailLogItem[];
  sendSimulatedEmail: (recipientEmail: string, recipientName: string, subject: string, bodySnippet: string, type: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [emailLogs, setEmailLogs] = useState<EmailLogItem[]>([
    {
      id: 'email-init-1',
      recipientEmail: 'constantinocosta2002@gmail.com',
      recipientName: 'Constantino José da Costa',
      subject: 'EMPREGO+ — Relatório Diário de Ativações e Novas Vagas',
      bodySnippet: 'Resumo das 21 províncias de Angola: 2 candidaturas pendentes e 15 fontes oficiais sincronizadas.',
      sentAt: '2026-11-08 09:00',
      type: 'DIGEST_ADMIN',
    },
    {
      id: 'email-init-2',
      recipientEmail: 'esperanca.carvalho@exemplo.ao',
      recipientName: 'Esperança Beatriz de Carvalho',
      subject: 'A sua conta EMPREGO+ foi aprovada com sucesso!',
      bodySnippet: 'O seu pagamento de 1.000 Kz foi validado. Descubra as novas vagas na Huíla e Luanda.',
      sentAt: '2026-11-05 11:31',
      type: 'CONTA_APROVADA',
    },
  ]);

  useEffect(() => {
    setNotifications(StorageService.getNotifications());
  }, []);

  const userNotifications = currentUser
    ? notifications.filter((n) => n.userId === currentUser.id || n.userId === 'ALL')
    : [];

  const unreadCount = userNotifications.filter((n) => !n.isRead).length;

  const markAsRead = (id: string) => {
    const updated = notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n));
    setNotifications(updated);
    StorageService.saveNotifications(updated);
  };

  const markAllAsRead = () => {
    if (!currentUser) return;
    const updated = notifications.map((n) =>
      n.userId === currentUser.id || n.userId === 'ALL' ? { ...n, isRead: true } : n
    );
    setNotifications(updated);
    StorageService.saveNotifications(updated);
  };

  const clearNotification = (id: string) => {
    const updated = notifications.filter((n) => n.id !== id);
    setNotifications(updated);
    StorageService.saveNotifications(updated);
  };

  const sendCustomNotification = (
    userId: string,
    title: string,
    message: string,
    type: AppNotification['type'] = 'SYSTEM'
  ) => {
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      userId,
      title,
      message,
      type,
      isRead: false,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    const updated = [newNotif, ...notifications];
    setNotifications(updated);
    StorageService.saveNotifications(updated);
  };

  const sendSimulatedEmail = (
    recipientEmail: string,
    recipientName: string,
    subject: string,
    bodySnippet: string,
    type: string
  ) => {
    const newLog: EmailLogItem = {
      id: `email-${Date.now()}`,
      recipientEmail,
      recipientName,
      subject,
      bodySnippet,
      sentAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      type,
    };
    setEmailLogs((prev) => [newLog, ...prev]);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        userNotifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        clearNotification,
        sendCustomNotification,
        emailLogs,
        sendSimulatedEmail,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
