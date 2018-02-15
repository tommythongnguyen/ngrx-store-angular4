export interface Profile {
    tenantid: string;
    id: string;
    role: string;
    status: string;
    approver: string;
    firstname: string;
    lastname: string;
    tenantLogo: string;
    [propName: string]: string;
  }

export class UserProfile {
  tenantid: string;
  id: string;
  role: string;
  status: string;
  approver: string;
  firstname: string;
  lastname: string;
  tenantLogo: string;

  constructor(profile?: Profile) {
    this.tenantid = profile ? profile.tenantid : '';
    this.id = profile ? profile.id : '';
    this.role = profile ? profile.role : '';
    this.status = profile ? profile.status : '';
    this.approver = profile ? profile.approver : '';
    this.firstname = profile ? profile.firstname : '';
    this.lastname = profile ? profile.lastname : '';
    this.tenantLogo = profile ? profile.tenantLogo : '';
  }
}
