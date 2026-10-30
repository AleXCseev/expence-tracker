import { SafeUser } from '../users/contract';

export interface AuthResult {
  accessToken: string;
  user: SafeUser;
}
