export const notificationService = {
    getNotifications: async () => {
      try {
        const res = await fetch('/api/notifications', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        if (!res.ok) {
          throw new Error('Failed to fetch notifications');
        }
  
        return await res.json();
      } catch (error) {
        console.error('Error fetching notifications:', error);
        throw error;
      }
    },
  
    markNotificationsAsRead: async (ids: string[]) => {
      try {
        const res = await fetch('/api/notifications', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ids }),
        });
  
        if (!res.ok) {
          throw new Error('Failed to mark notifications as read');
        }
  
        return await res.json();
      } catch (error) {
        console.error('Error marking notifications as read:', error);
        throw error;
      }
    },
  
    dismissNotification: async (id: string) => {
      try {
        const res = await fetch(`/api/notifications/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        if (!res.ok) {
          throw new Error('Failed to dismiss notification');
        }
  
        return await res.json();
      } catch (error) {
        console.error('Error dismissing notification:', error);
        throw error;
      }
    },
  };