export interface User {
  id: Number;
  _id: Number;
  firstname: String;
  lastname: String;
  email: String;
  username: String;
  password: String;
  roles: String[];
  active: Boolean;
  refreshToken: String;
}
