const contactServiceData = () => {
    return {
        addContact: async (newContact:any) => {
            try {
                const res = await fetch('/api/contacts', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newContact),
                });
                if (!res.ok) {
                    throw new Error('Failed to add contact');
                }
                return await res.json();
            } catch (err) {
                console.error('Failed to save contact', err);
                throw err;
            }
        },
        editContact: async (updatedContact:any) => {
            try {
                const res = await fetch(`/api/contacts/${updatedContact._id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updatedContact),
                });
                if (!res.ok) {
                    throw new Error('Failed to update contact');
                }
                return await res.json();
            } catch (err) {
                console.error('Failed to update contact', err);
                throw err;
            }
        },
        deleteContact: async (id: string) => {
            try {
                const res = await fetch(`/api/contacts/${id}`, { method: 'DELETE' });
                console.log(res)
                if (!res.ok) {
                    
                    throw new Error('Failed to delete contact');
                }
                
            } catch (error) {
                console.error('Failed to delete contact', error);
                throw error;
            }
        },
        shareContact: async (contactId: string, receiverEmail: string) => {
            try {
              const response = await fetch('/api/contacts/share', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contactId, receiverEmail }),
              });
        
              const data = await response.json();
        
              if (response.ok) {
                return { success: true, data };
              } else {
                return { success: false, message: data.message || 'Failed to share contact' };
              }
            } catch (error) {
              console.error('Error sharing contact:', error);
              return { success: false, message: 'An error occurred while sharing the contact' };
            }
          },
    }
}

export const contactService = contactServiceData();
