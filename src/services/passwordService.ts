const PasswordService = {
    verifyToken: async (token: string) => {
      try {
        const res = await fetch("/api/verify-token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });
  
        if (!res.ok) {
          throw new Error("Invalid token or has expired");
        }
  
        return await res.json();
      } catch (error) {
        console.error("Error during token verification:", error);
        throw error;
      }
    },
  
    resetPassword: async (password: string, email: string) => {
      try {
        const res = await fetch("/api/reset-password", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password, email }),
        });
  
        if (!res.ok) {
          throw new Error("User with this email is not registered.");
        }
  
        return await res.json();
      } catch (error) {
        console.error("Error during password reset:", error);
        throw error;
      }
    },
    forgetPassword: async (email: string) => {
        try {
          const res = await fetch("/api/forget-password", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
          });
    
          if (!res.ok) {
            throw new Error("User with this mail is not registered.");
          }
    
          return await res.json();
        } catch (error) {
          console.error("Error during forget password request:", error);
          throw error;
        }
      },

  };
  
  export default PasswordService;
  