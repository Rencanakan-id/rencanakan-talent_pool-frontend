// services/UserService.ts
export class UserService {
    private static readonly BASE_URL = process.env.REACT_APP_API_URLL?? "http://localhost:8080";
  
    static async getUserProfile(token: string) {
      const res = await fetch(`${this.BASE_URL}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (!res.ok) throw new Error(`Failed to fetch user profile: ${res.status}`);
      return res.json();
    }
  
    static async getUserExperience(userId: string, token: string) {
      const res = await fetch(`${this.BASE_URL}/api/experiences/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (!res.ok) throw new Error(`Failed to fetch experience: ${res.status}`);
      return res.json();
    }
  }
  