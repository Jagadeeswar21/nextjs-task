export const userService = {
    getUsers: async () => {
      try {
        const res = await fetch("/api/users", {
          cache: "no-store",
        });
  
        if (!res.ok) {
          throw new Error("Failed to fetch users");
        }
  
        return await res.json();
      } catch (error) {
        console.error("Error loading user details:", error);
        throw error;
      }
    },
  
    editUserStatus: async (id: string, status: string, isDeleted:any) => {
      try {
        const res = await fetch(`/api/users/${id}/edit`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status,isDeleted}),
        });
  
        if (!res.ok) {
          throw new Error('Failed to update user status');
        }
  
        return await res.json();
      } catch (error) {
        console.error('Error updating user status:', error);
        throw error;
      }
    },
  };