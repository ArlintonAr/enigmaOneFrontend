import { User } from './user.interface';

export interface AuthResponse {
  message: string;
  data:    User;
  success: boolean;
}

