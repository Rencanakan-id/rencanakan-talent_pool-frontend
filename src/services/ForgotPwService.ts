import { env } from "@/config/env";

export const sendPasswordResetEmail = async (email: string): Promise<{ success: boolean }> => {
    try {
      const response = await fetch(`${env.API_BASE_URL}/email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
  
      if (!response.ok) {
        // Parse error response
        const errorData = await response.json();
        throw new Error(errorData.message?? 'Failed to send password reset email');
      }
  
      return await response.json();
    } catch (error) {
      console.error('Password reset API error:', error);
      throw error;
    }
  };

export const resetPassword = async (
  token: string,
  newPassword: string
): Promise<{ success: boolean }> => {
  try {
    const response = await fetch(`${env.API_BASE_URL}/auth/password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, newPassword }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message ?? 'Failed to reset password');
    }

    return await response.json();
  } catch (error) {
    console.error('Reset password API error:', error);
    throw error;
  }
};
