// services/UserService.ts
export class UserService {
  private static readonly BASE_URL = 'http://88.222.245.148:8080';

  static async getUserProfile(token: string) {
    const res = await fetch(`${this.BASE_URL}/api/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error(`Failed to fetch user profile: ${res.status}`);
    return res.json();
  }

  static async getUserExperience(userId: string, token: string) {
    const res = await fetch(`${this.BASE_URL}/api/experiences/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error(`Failed to fetch experience: ${res.status}`);
    return res.json();
  }
}
