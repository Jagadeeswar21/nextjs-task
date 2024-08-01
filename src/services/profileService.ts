export const profileService = {
    fetchProfile: async () => {
      const response = await fetch('/api/profile');
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      return response.json();
    },
    
    updateProfile: async (id: string, formData: FormData) => {
      const response = await fetch(`/api/profile/${id}`, {
        method: 'PUT',
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error('Failed to update profile');
      }
  
      return response.json();
    },
  };