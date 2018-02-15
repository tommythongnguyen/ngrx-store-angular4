export interface Twofa {
    two_factor_link: string;
    twofa_type: string;
}
export interface Duo {
    duo_api_host: string;
    duo_integration_key: string;
    duo_secret_key: string;
    duo_akey: string;
}
export interface Cert {
    inter_certificate_pass: string;
    inter_certificate_file: string;
    inter_certificate_key: string;
    inter_certificate: string;
    private_key: string;
    tls_certificate: string;
}
export interface ClientCert {
    client_certificate_file: string;
    client_certificate: string;
}
export interface TenantSettings {
    twofa?: Twofa;
    duo?: Duo;
    cert?: Cert;
    client_cert?: ClientCert;
    salt?: string;
    ldapenableflag?: boolean;
    approval_delete_requested?: boolean;
    domainname?: string;
    cluster_ip?: string;
    tenant_logo?: string;
    is_ca_certificate_available?: boolean;
    client_certificate_enable_flag?: boolean;
    tenant_fqdn?: string;
    sso_url?: string;
    whitelistedipranges?: string[];
    gateway_dns?: string;
    security_token_file?: string;
    security_token?: string;
}
export interface Tenant {
    id: string;
    name: string;
    description: string;
    status: string;
    createdAt: string;
    settings?: TenantSettings;
}

export interface MapControl {
    radioPermission: string;
    radioPort: string;
    mapTenant: any;
    fromDate: Date;
    toDate: Date;
}
export interface ActivityLog {
    tenant: Tenant;
    created_by: string;
    action_type: string;
    client_ip_address: string;
    created_by_role: string;
    description: string;
    category: string;
    type: string;
    [propName: string]: any;
}
export interface Notification {
    count: number;
    activityLogs: ActivityLog[];
}

export interface TenantUrlUserData {
    id: string;
    firstname: string;
    lastname: string;
    userid: string;
}

export interface TenantUrlDataConfiguration {
    cookie: string;
    userid: string;
    device: string;
    geo: string;
}

export interface TenantUrlDataMethod {
    all: string;
    get: string;
    post: string;
    put: string;
    delete: string;
    options: string;
}

export interface TenantUrlDataSettings {
    configuration: TenantUrlDataConfiguration;
    method: TenantUrlDataMethod;
    enableflag: string;
    urlip: string;
    gateway_dns: string;
    protocol: string;
    access_resource: string;
    is_ntml: string;
    customport: number;
    port: string;
}

export interface TenantUrlData {
    id: string;
    url: string;
    type: string;
    group: string[];
    effect_from: string;
    effect_to: string;
    approver: TenantUrlUserData;
    status: string;
    user: TenantUrlUserData;
    settings: TenantUrlDataSettings;
}



export interface GlobalUserCreatorName {
    firstname?: string;
    lastname?: string;
    [propName: string]: any;
}

export interface GlobalUser {
    id: string;
    userid: string;
    firstname: string;
    lastname: string;
    role: string;
    email: string;
    status: string;
    // creator: GlobalUserCreatorName;
}

export interface GlobalApproval {
    id: string;
    entity_name: string;
    entity_type: string;
    status: string;
    created_on: string;
    comments?: string;
    user: GlobalUserCreatorName;
    userData: GlobalUser[];
    [propName: string]: any;
}

export interface UserRole {
    name: string;
    [propName: string]: any;
}


export interface TenantUser {
    userid: string;
    firstname: string;
    lastname: string;
    role: string;
    [propName: string]: any;
}

export interface TenantApproval {
    id: string;
    entity_name: string;
    entity_type: string;
    status: string;
    created_on: string;
    comments?: string;
    user: GlobalUserCreatorName;
    tenant: Tenant;
    [propName: string]: any;
}

export interface TenantGroup {
    id: string;
    tenant: any;
    name: string;
    type: string;
    userscount: number;
    synctime: string;
    status: string;
    [propName: string]: any;
}

export interface TenantGroupEndUser {
    tenant: Tenant;
    ldapid: String;
    group: TenantGroup;
    firstname: String;
    lastname: String;
    email: String;
    invalid_attempts: Number;
    status: String;
    [propName: string]: any;
}

export interface AdSyncGroup {
    common_name: String;
    dn: String;
    grp_objectGUID: String;
    [propName: string]: any;
}

export interface UserSessionLogData {
    tenant: any;
    end_user: any;
    update_flag: any;
    session_time: any;
    last_loggedin: any;
    status: string;
    user: any;
    details: any;
    [propName: string]: any;
}

export interface State {
    allTenants: Tenant[];
    selectedTenants: any[];
    currentTenant: Tenant;
    ipReportData: undefined;
    ipReportsError: undefined;
    mapControls: MapControl;
    notification: Notification;
    ipDetails: undefined;
    selectedTenantUrlData: TenantUrlData;
    globalApprovalAllData: GlobalApproval[];
    globalActivityData: any[];
    tenantUserData: TenantUser[];
    tenantUrlData: TenantUrlData[];
    tenantApprovalAllData: TenantApproval[];
    tenantGroupAllData: TenantGroup[];
    tenantGroupEndUserAllData: TenantGroupEndUser[];
    currentGroup: TenantGroup;
    tenantAdSyncGroupAllData: AdSyncGroup[];
    userSessionLogData: UserSessionLogData[];
}


