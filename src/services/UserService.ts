// services/UserService.ts
import { env } from "@/config/env";

export class UserService {
  // private static readonly BASE_URL = 'http://localhost:8081';

  static async getUserProfile(token: string) {
    const res = await fetch(`${env.API_BASE_URL}/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error(`Failed to fetch user profile: ${res.status}`);
    return res.json();
  }

  static async getUserExperience(userId: string, token: string) {
    const res = await fetch(`${env.API_BASE_URL}/experiences/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error(`Failed to fetch experience: ${res.status}`);
    return res.json();
  }
}
