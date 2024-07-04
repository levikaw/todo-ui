import { instance } from './api';

export class AuthService {
  static login(login: string, password: string) {
    return instance.post('/auth', { login, password });
  }
}
