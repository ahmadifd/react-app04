export interface User {
  id: string;
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  userName: string;
  password: string;
  roles: string[];
  active: boolean;
  refreshToken: string;
}
