import { env } from "@/config/env";

export const sendPasswordResetEmail = async (
  email: string
): Promise<{ message: string }> => {
  try {
    const response = await fetch(`${env.API_BASE_URL}/email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message ?? 'Failed to send password reset email');
    }

    const message = await response.text();
    return { message };
  } catch (error) {
    console.error('Password reset API error:', error);
    throw error;
  }
};

export const resetPassword = async (
  token: string,
  newPassword: string
): Promise<{ message: string }> => {
  try {
    const response = await fetch(`${env.API_BASE_URL}/auth/password`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, newPassword }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message ?? 'Failed to reset password');
    }

    const message = await response.text();
    return { message };
  } catch (error) {
    console.error('Reset password API error:', error);
    throw error;
  }
};
