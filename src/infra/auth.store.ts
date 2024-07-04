import axios from 'axios';
import { makeAutoObservable } from 'mobx';
import { AuthService } from './auth.service';

class AuthStore {
  isAuth = false;
  isAuthInProgress = false;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  async login(login: string, password: string): Promise<number> {
    this.isAuthInProgress = true;
    try {
      const resp = await AuthService.login(login, password);
      localStorage.setItem('token', resp.data.accessToken);
      this.isAuth = true;
    } catch (err) {
      return axios.isAxiosError(err) ? err.response?.status ?? 500 : 500;
    } finally {
      this.isAuthInProgress = false;
    }
    return 200;
  }
}

export const authStore = new AuthStore();
