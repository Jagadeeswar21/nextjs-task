const contactServiceData = () => {
    return {
        addContact: async (newContact: any) => {
            try {
                await fetch('/api/contacts', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newContact),
                });
            } catch (err) {
                console.error('Failed to save contact', err);
            }
        },
        editContact: async (newContact:any) => {
            try {
                await fetch(`/api/contacts/${newContact._id}`, {
                    method: 'PUT',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newContact),
                  });
            } catch (err) {
                console.error('Failed to save contact', err);
            }
        }
    }
}

export const contactService = contactServiceData()