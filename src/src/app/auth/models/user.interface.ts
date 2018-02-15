export interface User {
  ldapid: string;
  firstname: string;
  lastname: string;
  email: string;
  role: string;
  [propName: string]: any;
}
export interface Authenticate {
  username: string;
  password: string;
}
