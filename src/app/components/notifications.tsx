'use client'
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

type Notification = {
  _id: string;
  message: string;
  read: boolean;
};

const Notifications: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const markNotificationsAsRead = async (ids: string[]) => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids }),
      });

      if (!response.ok) {
        throw new Error('Failed to mark notifications as read');
      }
      setNotifications(prevNotifications => 
        prevNotifications.map(notif => 
          ids.includes(notif._id) ? { ...notif, read: true } : notif
        )
      );
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      if (session) {
        try {
          const response = await fetch('/api/notifications', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (!response.ok) {
            throw new Error('Failed to fetch notifications');
          }

          const data = await response.json();
          setNotifications(data.notifications);

          const unreadIds = data.notifications
            .filter((notif: Notification) => !notif.read)
            .map((notif: Notification) => notif._id);
          
          if (unreadIds.length > 0) {
            await markNotificationsAsRead(unreadIds);
          }
        } catch (error) {
          console.error('Error fetching notifications:', error);
        }
      }
    };

    fetchNotifications();
  }, [session]);

  const dismissNotification = async (id: string) => {
    try {
      const response = await fetch(`/api/notifications/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to dismiss notification');
      }

      setNotifications(notifications.filter(notification => notification._id !== id));
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