export class IdsAndEamils {
    public userid: string;
    public email: string;
    public role: string;
    constructor(obj ?: { userid: string, email: string, role: string }) {
        this.email = obj ? obj.email : '';
        this.userid = obj ? obj.userid : '';
        this.role = obj ? obj.role : '';
    }
}
export class TenantUserModel {
    public firstname: string;
    public lastname: string;
    public userid: string;
    public email: string;
    public role: string;
    public domainname: string;
    public idsAndEmails: IdsAndEamils[];
    public id: string;
    constructor(user?: any) {
        this.firstname = user ? user.firstname : '';
        this.lastname = user ? user.lastname : '';
        this.userid = user ? user.userid : '';
        this.email = user ? user.email : '';
        this.role = user ? user.role : '';
        this.domainname = user ? user.domainname : '';
        this.idsAndEmails = user ? user.idsAndEmails ? user.idsAndEmails : [] : [];
        this.id = user ? user.id : '';
    }
}


export class TenantDetailModel {
    public name: string;
    public domainname: string;
    public description: string;

    constructor(details?: any) {
        this.name = details ? details.name : '';
        this.domainname = details ? details.settings.domainname : '';
        this.description = details ? details.description : '';
    }
}
