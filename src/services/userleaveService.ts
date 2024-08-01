export const leaveService = {
    addLeaveRequest: async (newLeave: any) => {
      try {
        const res = await fetch("/api/leaves", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newLeave),
        });
  
        if (!res.ok) {
          throw Error("Failed to add leave request");
        }
  
        return await res.json();
      } catch (error) {
        console.error("Failed to save leave request", error);
        throw error;
      }
    },
  
    editLeaveRequest: async (updatedLeave: any) => {
      try {
        const res = await fetch(`/api/leaves/${updatedLeave._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedLeave),
        });
  
        if (!res.ok) {
          throw Error("Failed to update leave request");
        }
  
        return await res.json();
      } catch (error) {
        console.error("Failed to update leave request", error);
        throw error;
      }
    },
  
    deleteLeaveRequest: async (id: string) => {
      try {
        const res = await fetch(`/api/leaves/${id}`, { method: "DELETE" });
        console.log(res)
        if (!res.ok) {
          throw Error("Failed to delete leave request");
        }
        return await res.json();
      } catch (error) {
        console.error("Failed to delete leave request", error);
        throw error;
      }
    },
  
    getLeaves: async () => {
      try {
        const res = await fetch("/api/leaves/get", { cache: "no-store" });
  
        if (!res.ok) {
          throw Error("Failed to fetch leaves");
        }
  
        return await res.json();
      } catch (error) {
        console.error("Error loading leave details: ", error);
        throw error;
      }
    },
    getCalenderLeaves: async () => {
        try {
          const res = await fetch("/api/leaves/calendar", { cache: "no-store" });
    
          if (!res.ok) {
            throw Error("Failed to fetch leaves");
          }
    
          return await res.json();
        } catch (error) {
          console.error("Error loading leave details: ", error);
          throw error;
        }
      },
  };
  