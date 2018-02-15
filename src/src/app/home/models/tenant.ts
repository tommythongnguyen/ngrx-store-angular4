export interface TenantSettings {
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
    twofa?: {
        two_factor_link: string;
        twofa_type: string;
    };
    duo?: {
        duo_api_host: string;
        duo_integration_key: string;
        duo_secret_key: string;
        duo_akey: string;
    };
    cert?: {
        inter_certificate_pass: string;
        inter_certificate_file: string;
        inter_certificate_key: string;
        inter_certificate: string;
        private_key: string;
        tls_certificate: string;
    };
    client_cert?: {
        client_certificate_file: string;
        client_certificate: string;
    };
}
export interface Tenant {
    id: string;
    name: string;
    description: string;
    status: string;
    createdAt: string;
    settings?: TenantSettings;
}
