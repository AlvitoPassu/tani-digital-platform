import React, { useEffect, useState, createContext, useContext, ReactNode } from "react";
import { io } from "socket.io-client";
import { useToast } from "@/components/ui/use-toast";
import { BellRing, CheckCheck } from "lucide-react";

// 1. Definisikan bentuk data notifikasi
export interface INotification {
  id: string;
  title: string;
  body: string;
  createdAt: Date;
}

// 2. Buat Context untuk notifikasi
interface NotificationContextType {
  notifications: INotification[];
  unreadCount: number;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Hook kustom untuk menggunakan context notifikasi
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
};

const socket = io("http://localhost:4000");

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<INotification[]>([]);

  useEffect(() => {
    socket.emit("subscribe", "user-123"); // Ganti dengan userId dinamis nanti

    socket.on("notification", (data: { title: string; body: string }) => {
      const newNotification: INotification = {
        id: `notif-${Date.now()}`,
        title: data.title,
        body: data.body,
        createdAt: new Date(),
      };
      
      // Tambahkan notifikasi baru ke daftar
      setNotifications((prev) => [newNotification, ...prev]);

      // Tampilkan notifikasi sebagai Toast
      toast({
        title: (
          <div className="flex items-center">
            <BellRing className="mr-2 h-4 w-4" />
            <span>{newNotification.title}</span>
          </div>
        ),
        description: newNotification.body,
        action: (
          <div className="flex items-center text-xs text-green-600">
            <CheckCheck className="mr-1 h-3 w-3" />
            <span>Diterima</span>
          </div>
        ),
      });
    });

    return () => {
      socket.off("notification");
    };
  }, [toast]);

  const value = {
    notifications,
    unreadCount: notifications.length,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}; 