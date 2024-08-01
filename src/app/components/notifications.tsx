'use client';
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { notificationService } from "@/services/notificationService";

type Notification = {
  _id: string;
  message: string;
  read: boolean;
};

const Notifications: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const fetchNotifications = async () => {
    if (session) {
      try {
        const data = await notificationService.getNotifications();
        setNotifications(data.notifications);

        const unreadIds = data.notifications
          .filter((notif: Notification) => !notif.read)
          .map((notif: Notification) => notif._id);

        if (unreadIds.length > 0) {
          await notificationService.markNotificationsAsRead(unreadIds);
          setNotifications((prevNotifications) =>
            prevNotifications.map((notif) =>
              unreadIds.includes(notif._id) ? { ...notif, read: true } : notif
            )
          );
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [session]);

  const dismissNotification = async (id: string) => {
    try {
      await notificationService.dismissNotification(id);
      setNotifications((prevNotifications) =>
        prevNotifications.filter((notification) => notification._id !== id)
      );
    } catch (error) {
      console.error('Error dismissing notification:', error);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg w-full relative">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
      >
        Close
      </button>
      <h2 className="text-xl mb-4">Notifications</h2>
      {notifications.length === 0 ? (
        <p>No notifications.</p>
      ) : (
        <ul>
          {notifications.map((notification) => (
            <li key={notification._id} className={`mb-2 p-2 border rounded flex justify-between items-center ${notification.read ? 'bg-gray-100' : 'bg-white'}`}>
              <span className={notification.read ? 'text-gray-500' : 'font-bold'}>
                {notification.message}
              </span>
              <button
                onClick={() => dismissNotification(notification._id)}
                className="ml-2 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Dismiss
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;
