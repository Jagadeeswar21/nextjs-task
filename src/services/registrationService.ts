export const registrationService = {
    userExists: async (email: string) => {
      const response = await fetch("/api/userExists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to check if user exists");
      }
  
      return response.json();
    },
  
    registerUser: async (values: { name: string; email: string; password: string; role: string }) => {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
  
      if (!response.ok) {
        throw new Error("User registration failed");
      }
  
      return response.json();
    },
  };
  