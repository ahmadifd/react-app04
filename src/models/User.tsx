export interface User {
  id: number;
  _id: number;
  firstName: string;
  lastName: string;
  email: string;
  userName: string;
  password: string;
  roles: string[];
  active: boolean;
  refreshToken: string;
}
