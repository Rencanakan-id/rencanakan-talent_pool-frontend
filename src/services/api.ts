export const sendPasswordResetEmail = async (email: string): Promise<{ success: boolean }> => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
  
      if (!response.ok) {
        // Parse error response
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send password reset email');
      }
  
      return await response.json();
    } catch (error) {
      console.error('Password reset API error:', error);
      throw error;
    }
  };