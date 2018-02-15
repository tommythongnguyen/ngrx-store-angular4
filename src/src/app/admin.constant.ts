const AdminConstant = {
  SUPER_USER: 'Super User',
  GLOBAL_ADMIN: 'Global Administrator',
  GLOBAL_APPROVER: 'Global Approver',
  TENANT_ADMIN: 'Tenant Admin',
  TENANT_APPROVER: 'Tenant Approver',
  BUSINESS_MANAGER: 'Business Manager',
  TENANT_VIEWER: 'Viewer',
  GLOBAL_TENANT: 'Global',
  GLOBAL_TENANT_ID: 'Global',
  RECORD_EXIST: 'Record Exist',
  RECORD_NOT_EXIST: 'Record Not Exist',
  STATUS: {
    APPROVED: 'Approved',
    ACTIVE: 'Active',
    PENDING_APPROVAL: 'Pending Approval',
    SUCCESS: 'Success',
    REJECTED: 'Rejected',
    ERROR: 'error',
    EXPIRED: 'Expired',
    DEACTIVATED: 'Deactivate',
    ACTIVE_SESSION: 'Active',
    DEACTIVE_SESSION: 'Pending Deactivate',
    VALID: 'Valid',
    CREATED: 'Created', // [POST / PUT / PATCH]
    UPDATE: 'Update',
    UPDATED: 'Updated',
    DISABLED: 'Disabled',
    ENABLED: 'enabled',
    DELETED: 'Deleted',
    PENDING_DEPLOYMENT: 'Pending Deployment',
    DEPLOY_TENANT: 'Deploy Tenant',
    APPROVED_DEPLOYED: 'Approved Deployed',
    APPROVED_DEPLOYING: 'Active',
    REJECTED_DEPLOYING: 'Rejected Deploying',
    DEACTIVATE: 'Deactivate',
    DEPROVISION: 'Deprovision',
    OK: 'Success',
    FAILED: 'Failed',
    DEPLOYMENT_COMPLETED: 'Deployment Completed',
    ROLLBACK_COMPLETED: 'Rollback Completed',
    ROLLBACK_FAILED: 'Rollback Failed',
    NEW: 'New',
    INACTIVE: 'InActive',
    YES: 'Yes',
    NO: 'No',

  },
  STATUSCODES: {
    OK: '200',
    CREATED: '201', // [POST / PUT / PATCH]
    NO_CONTENT: '204', // [DELETE]
    NOT_MODIFIED: '304',
    INVALID_REQUEST: '400', // [POST / PUT / PATCH]
    UNAUTHORIZED: '401',
    FORBIDDEN: '403',
    NOT_FOUND: '404',
    INTERNAL_SERVER_ERROR: '500',
    NOT_DELETE: '205'
  },
  ENTITY_TYPES: {
    TENANT: 'Tenant',
    TENANT_DEPROVISION: 'Tenant De Provision',
    URL_DEPROVISION: 'URL De Provision',
    URL: 'URL',
    UPDATE_URL: 'Update URL',
    USER: 'User',
    DEPLOY_TENANT: 'Deploy Tenant',
    ADMIN_USER: 'Admin User',
    CHANGE_PASSWORD: 'Change Password',
    DOMAIN : 'Domain'
  },
  GLOBAL_TENANT_DROPDOWN: {
    tenant_name: 'All Tenants',
    tenantid: 'Global',
    status: 'Active'
  },
  AUTHENTICATIONTYPES: {
    ENTERPRISE: 'Enterprise',
    GOOGLE: 'Google',
    DUO: 'Duo'
  },
  ERROR_MESSAGES: {
    ADMIN_DUPLICATE_USERID_ERROR_MESSAGE: 'Admin user id must be different from approver and manager.',
    ADMIN_DUPLICATE_EMAIL_ERROR_MESSAGE: 'Admin user email must be different from approver and manager.',
    APPROVER_DUPLICATE_USERID_ERROR_MESSAGE: 'Approver user id must be different from admin and manager.',
    APPROVER_DUPLICATE_EMAIL_ERROR_MESSAGE: 'Approver user email must be different from admin and manager.',
    MANAGER_DUPLICATE_USERID_ERROR_MESSAGE: 'Business manager user id must be different from admin and approver.',
    MANAGER_DUPLICATE_EMAIL_ERROR_MESSAGE: 'Business manager user email must be different from admin and approver.'
  }
};

export default AdminConstant;
