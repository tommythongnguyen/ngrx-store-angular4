import { createFeatureSelector, createSelector } from '@ngrx/store';

import * as homeReducer from '../../../home/store/reducers';
import * as serverCertReducer from './server-certificate.reducer';
import * as logoUploadReducer from './logo-upload.reducer';
import * as idpProviderReducer from './idp-provider.reducer';
import * as dnsGatewayProducer from './dns-gateway.reducer';


export interface TenantSettingState extends homeReducer.State {
    serverCert: serverCertReducer.State;
    logoUpload: logoUploadReducer.State;
    idpProvider: idpProviderReducer.State;
    dnsGateway: dnsGatewayProducer.State;
}

export interface State {
    tenantSetting: TenantSettingState;
}

export const reducers = {
    serverCert: serverCertReducer.reducer,
    logoUpload: logoUploadReducer.reducer,
    idpProvider: idpProviderReducer.reducer,
    dnsGateway: dnsGatewayProducer.reducer
};

export const getTenantSettingState = createFeatureSelector<TenantSettingState>('tenantSetting');

// ---- for Server Certificate -------------------------------------------
export const getServerCertState = createSelector(
    getTenantSettingState,
    (state: TenantSettingState) => state.serverCert
);

export const getServerCertSubmitted = createSelector(
    getServerCertState,
    serverCertReducer.getSubmitted
);

export const getServerCertPending = createSelector(
    getServerCertState,
    serverCertReducer.getPending
);

// ------ for Logo Upload -----------------------------------------------
export const getLogoUploadState = createSelector(
    getTenantSettingState,
    (state: TenantSettingState) => state.logoUpload
);

export const getLogoUploadSubmitted = createSelector(
    getLogoUploadState,
    logoUploadReducer.getSubmitted
);

export const getLogoUploadPending = createSelector(
    getLogoUploadState,
    logoUploadReducer.getPending
);

// ---- for Idp Provider -----------------------------------------------
export const getIdpProviderState = createSelector(
    getTenantSettingState,
    (state: TenantSettingState) => state.idpProvider
);

export const getIdpProviderSubmitted = createSelector(
    getIdpProviderState,
    idpProviderReducer.getSubmitted
);

export const getIdpProviderPending = createSelector(
    getIdpProviderState,
    idpProviderReducer.getPending
);

// ---- for Dns Gateway-----------------------------------------------
export const getDnsGatewayState = createSelector(
    getTenantSettingState,
    (state: TenantSettingState) => state.dnsGateway
);

export const getDnsGatewaySubmitted = createSelector(
    getDnsGatewayState,
    dnsGatewayProducer.getSubmitted
);

export const getDnsGatewayPending = createSelector(
    getDnsGatewayState,
    dnsGatewayProducer.getPending
);

// ---------- combine selectors ---------------------------------------
export const getDeployable = createSelector(
    getServerCertSubmitted,
    getIdpProviderSubmitted,
    getDnsGatewaySubmitted,
    (ServerCertSubmitted, dnsGatewaySubmitted, IdpProviderSubmitted) => {
        if (ServerCertSubmitted && dnsGatewaySubmitted && IdpProviderSubmitted) {
            return true;
        }
        return false;
    }
);




