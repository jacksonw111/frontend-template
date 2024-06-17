import api from "@/utils/http";

export interface GetTokenResponse {
  access_token: string;
  refresh_token: string;
}

class AuthService {
  access_token_url = "/api/access-token";
  refresh_url = "/api/refresh-token";
  logout_url = "/api/logout";
  async get_access_token(
    email: string,
    password: string
  ): Promise<GetTokenResponse> {
    const { data } = await api.post(this.access_token_url, { email, password });
    return data;
  }

  async logout() {
    await api.delete(this.logout_url);
  }

  async get_refresh_token(
    refresh_token: string,
    access_token: string
  ): Promise<GetTokenResponse> {
    const { data } = await api.post(this.refresh_url, {
      refresh_token,
      access_token,
    });
    return data;
  }
}

export const auth_service = new AuthService();
