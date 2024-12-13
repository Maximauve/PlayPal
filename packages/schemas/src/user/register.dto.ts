export interface RegisterDto {
  confirmPassword: string;
  email: string;
  password: string;
  username: string;
  image?: File | string;
}
