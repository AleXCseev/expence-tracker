export interface ExpenseDto {
  id: string;
  amount: string;
  description: string | null;
  date: string;
  categoryId: string;
}

export interface CategoryDto {
  id: string;
  name: string;
}

export interface UserDto {
  id: string;
  name: string;
  email: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  user: UserDto;
}
