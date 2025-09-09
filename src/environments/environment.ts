const hostname = window.location.hostname;

let uatApiBaseUrl = '';
let prodApiBaseUrl = '';

if (hostname === 'localhost') {
  // Localhost dev URLs
  uatApiBaseUrl = 'http://localhost/uat_rebate_portal/api/rest/v1.0/';
  prodApiBaseUrl = 'http://localhost/rebate_portal/api/rest/v1.0/';
} else if (hostname.includes('crmapps-tst.husqvarnagroup.com')) {
  // UAT environment on Husqvarna servers
  uatApiBaseUrl = 'https://crmapps-tst.husqvarnagroup.com/uat_rebate_portal/api/rest/v1.0/';
  prodApiBaseUrl = 'https://crmapps-tst.husqvarnagroup.com/rebate_portal/api/rest/v1.0/';
} else if (hostname.includes('crmapps.husqvarnagroup.com')) {
  // UAT environment on Husqvarna servers
  uatApiBaseUrl = 'https://crmapps.husqvarnagroup.com/uat_rebate_portal/api/rest/v1.0/';
  prodApiBaseUrl = 'https://crmapps.husqvarnagroup.com/rebate_portal/api/rest/v1.0/';
} else {
  // Fallback (can default to prod if needed)
  uatApiBaseUrl = 'https://crmapps.husqvarnagroup.com/uat_rebate_portal/api/rest/v1.0/';
  prodApiBaseUrl = 'https://crmapps.husqvarnagroup.com/rebate_portal/api/rest/v1.0/';
}

export const environment = {
  production: false,
  enableUrlEncryption: true,
  assetUrl: 'assets/',
  name: "(UAT)",
  uatApiBaseUrl,
  prodApiBaseUrl
};