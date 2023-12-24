export interface User {
  id: Number;
  _id: Number;
  firstName: String;
  lastName: String;
  email: String;
  userName: String;
  password: String;
  roles: String[];
  active: Boolean;
  refreshToken: String;
}
