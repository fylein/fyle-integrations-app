const { writeFile } = require("fs");

const environment = {
  production: true,
  test_temp_1: 'test_key_secret',
  fyle_client_id: `${process.env.FYLE_CLIENT_ID ? process.env.FYLE_CLIENT_ID : '{{FYLE_CLIENT_ID}}'}`,
  callback_uri: `${process.env.CALLBACK_URI ? process.env.CALLBACK_URI : '{{CALLBACK_URI}}'}`,
  qbd_api_url: `${process.env.QBD_API_URL ? process.env.QBD_API_URL : '{{QBD_API_URL}}'}`,
  si_api_url: `${process.env.SI_API_URL ? process.env.SI_API_URL : '{{SI_API_URL}}'}`,
  sage300_api_url: `${process.env.SAGE300_API_URL ? process.env.SAGE300_API_URL : '{{SAGE300_API_URL}}'}`,
  qbd_direct_api_url: `${process.env.QBD_DIRECT_API_URL ? process.env.QBD_DIRECT_API_URL : '{{QBD_DIRECT_API_URL}}'}`,
  netsuite_api_url: `${process.env.NETSUITE_API_URL ? process.env.NETSUITE_API_URL : '{{NETSUITE_API_URL}}'}`,
  business_central_api_url: `${process.env.BUSINESS_CENTRAL_API_URL ? process.env.BUSINESS_CENTRAL_API_URL : '{{BUSINESS_CENTRAL_API_URL}}'}`,
  qbo_api_url: `${process.env.QBO_API_URL ? process.env.QBO_API_URL : '{{QBO_API_URL}}'}`,
  xero_api_url: `${process.env.XERO_API_URL ? process.env.XERO_API_URL : '{{XERO_API_URL}}'}`,
  cluster_domain_api_url: `${process.env.CLUSTER_DOMAIN_API_URL ? process.env.CLUSTER_DOMAIN_API_URL : '{{CLUSTER_DOMAIN_API_URL}}'}`,
  fyle_app_url: `${process.env.FYLE_APP_URL ? process.env.FYLE_APP_URL : '{{FYLE_APP_URL}}'}`,
  fyle_app_local: `${process.env.FYLE_APP_LOCAL ? process.env.FYLE_APP_LOCAL : '{{FYLE_APP_LOCAL}}'}`,
  sentry_dsn: `${process.env.SENTRY_DSN ? process.env.SENTRY_DSN : '{{SENTRY_DSN}}'}`,
  sentry_env: `${process.env.SENTRY_ENV ? process.env.SENTRY_ENV : '{{SENTRY_ENV}}'}`,
  qbo_client_id: `${process.env.QBO_CLIENT_ID ? process.env.QBO_CLIENT_ID : '{{QBO_CLIENT_ID}}'}`,
  ns_client_id: `${process.env.NS_CLIENT_ID ? process.env.NS_CLIENT_ID : '{{NS_CLIENT_ID}}'}`,
  si_client_id: `${process.env.SI_CLIENT_ID ? process.env.SI_CLIENT_ID : '{{SI_CLIENT_ID}}'}`,
  xero_client_id: `${process.env.XERO_CLIENT_ID ? process.env.XERO_CLIENT_ID : '{{XERO_CLIENT_ID}}'}`,
  travelperk_redirect_uri: `${process.env.TRAVELPERK_REDIRECT_URI ? process.env.TRAVELPERK_REDIRECT_URI : '{{TRAVELPERK_REDIRECT_URI}}'}`,
  travelperk_base_url: `${process.env.TRAVELPERK_BASE_URL ? process.env.TRAVELPERK_BASE_URL : '{{TRAVELPERK_BASE_URL}}'}`,
  travelperk_client_id: `${process.env.TRAVELPERK_CLIENT_ID ? process.env.TRAVELPERK_CLIENT_ID : '{{TRAVELPERK_CLIENT_ID}}'}`,
  business_central_oauth_redirect_uri: `${process.env.BUSINESS_CENTRAL_OAUTH_REDIRECT_URI ? process.env.BUSINESS_CENTRAL_OAUTH_REDIRECT_URI : '{{BUSINESS_CENTRAL_OAUTH_REDIRECT_URI}}'}`,
  business_central_oauth_client_id: `${process.env.BUSINESS_CENTRAL_OAUTH_CLIENT_ID ? process.env.BUSINESS_CENTRAL_OAUTH_CLIENT_ID : '{{BUSINESS_CENTRAL_OAUTH_CLIENT_ID}}'}`,
  qbo_app_url: `${process.env.QBO_APP_URL ? process.env.QBO_APP_URL : '{{QBO_APP_URL}}'}`,
  qbo_oauth_redirect_uri: `${process.env.QBO_OAUTH_REDIRECT_URI ? process.env.QBO_OAUTH_REDIRECT_URI : '{{QBO_OAUTH_REDIRECT_URI}}'}`,
  qbo_authorize_uri: `${process.env.QBO_AUTHORIZE_URI ? process.env.QBO_AUTHORIZE_URI : '{{QBO_AUTHORIZE_URI}}'}`,
  qbo_oauth_client_id: `${process.env.QBO_OAUTH_CLIENT_ID ? process.env.QBO_OAUTH_CLIENT_ID : '{{QBO_OAUTH_CLIENT_ID}}'}`,
  xero_oauth_client_id: `${process.env.XERO_OAUTH_CLIENT_ID ? process.env.XERO_OAUTH_CLIENT_ID : '{{XERO_OAUTH_CLIENT_ID}}'}`,
  xero_scope: `${process.env.XERO_SCOPE ? process.env.XERO_SCOPE : '{{XERO_SCOPE}}'}`,
  xero_authorize_uri: `${process.env.XERO_AUTHORIZE_URI ? process.env.XERO_AUTHORIZE_URI : '{{XERO_AUTHORIZE_URI}}'}`,
  xero_oauth_redirect_uri: `${process.env.XERO_OAUTH_REDIRECT_URI ? process.env.XERO_OAUTH_REDIRECT_URI : '{{XERO_OAUTH_REDIRECT_URI}}'}`,
  refiner_survey: {
    intacct: {
      onboarding_done_survery_id: `${process.env.REFINER_INTACCT_ONBOARDING_DONE_SURVEY_ID ? process.env.REFINER_INTACCT_ONBOARDING_DONE_SURVEY_ID : '{{REFINER_INTACCT_ONBOARDING_DONE_SURVEY_ID}}'}`,
      export_done_survery_id: `${process.env.REFINER_INTACCT_EXPORT_DONE_SURVEY_ID ? process.env.REFINER_INTACCT_EXPORT_DONE_SURVEY_ID : '{{REFINER_INTACCT_EXPORT_DONE_SURVEY_ID}}'}`,
    },
    qbd: {
      onboarding_done_survery_id: `${process.env.REFINER_QBD_ONBOARDING_DONE_SURVEY_ID ? process.env.REFINER_QBD_ONBOARDING_DONE_SURVEY_ID : '{{REFINER_QBD_ONBOARDING_DONE_SURVEY_ID}}'}`,
      export_done_survery_id: `${process.env.REFINER_QBD_EXPORT_DONE_SURVEY_ID ? process.env.REFINER_QBD_EXPORT_DONE_SURVEY_ID : '{{REFINER_QBD_EXPORT_DONE_SURVEY_ID}}'}`,
    }
  },
};

const targetPath = './src/environments/environment.ts';
const envContent = `export const environment = ${JSON.stringify(environment, null, 2)};
`;

writeFile(targetPath, envContent, 'utf8', (err) => {
  if (err) {
    return console.error(err);
  }
});
