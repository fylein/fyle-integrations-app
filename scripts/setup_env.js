const { writeFile } = require("fs");

const environment = {
  production: true,
  fyle_client_id: `${process.env.FYLE_CLIENT_ID ? process.env.FYLE_CLIENT_ID : '{{FYLE_CLIENT_ID}}'}`,
  callback_uri: `${process.env.CALLBACK_URI ? process.env.CALLBACK_URI : '{{CALLBACK_URI}}'}`,
  qbd_api_url: `${process.env.QBD_API_URL ? process.env.QBD_API_URL : '{{QBD_API_URL}}'}`,
  api_url: `${process.env.API_URL ? process.env.API_URL : '{{API_URL}}'}`,
  fyle_app_url: `${process.env.FYLE_APP_URL ? process.env.FYLE_APP_URL : '{{FYLE_APP_URL}}'}`,
  sentry_dsn: `${process.env.SENTRY_DSN ? process.env.SENTRY_DSN : '{{SENTRY_DSN}}'}`,
  sentry_env: `${process.env.SENTRY_ENV ? process.env.SENTRY_ENV : '{{SENTRY_ENV}}'}`,
  qbo_callback_url: `${process.env.QBO_CALLBACK_URL ? process.env.QBO_CALLBACK_URL : '{{QBO_CALLBACK_URL}}'}`,
  ns_callback_url: `${process.env.NS_CALLBACK_URL ? process.env.NS_CALLBACK_URL : '{{NS_CALLBACK_URL}}'}`,
  si_callback_url: `${process.env.SI_CALLBACK_URL ? process.env.SI_CALLBACK_URL : '{{SI_CALLBACK_URL}}'}`,
  xero_callback_url: `${process.env.XERO_CALLBACK_URL ? process.env.XERO_CALLBACK_URL : '{{XERO_CALLBACK_URL}}'}`,
  qbo_client_id: `${process.env.QBO_CLIENT_ID ? process.env.QBO_CLIENT_ID : '{{QBO_CLIENT_ID}}'}`,
  ns_client_id: `${process.env.NS_CLIENT_ID ? process.env.NS_CLIENT_ID : '{{NS_CLIENT_ID}}'}`,
  si_client_id: `${process.env.SI_CLIENT_ID ? process.env.SI_CLIENT_ID : '{{SI_CLIENT_ID}}'}`,
  xero_client_id: `${process.env.XERO_CLIENT_ID ? process.env.XERO_CLIENT_ID : '{{XERO_CLIENT_ID}}'}`,
  travelperk_redirect_uri: `${process.env.TRAVELPERK_REDIRECT_URI ? process.env.TRAVELPERK_REDIRECT_URI : '{{TRAVELPERK_REDIRECT_URI}}'}`,
  travelperk_base_url: `${process.env.TRAVELPERK_BASE_URL ? process.env.TRAVELPERK_BASE_URL : '{{TRAVELPERK_BASE_URL}}'}`,
  travelperk_client_id: `${process.env.TRAVELPERK_CLIENT_ID ? process.env.TRAVELPERK_CLIENT_ID : '{{TRAVELPERK_CLIENT_ID}}'}`,
};

const targetPath = './src/environments/environment.json';
writeFile(targetPath, JSON.stringify(environment), 'utf8', (err) => {
  if (err) {
    return console.error(err);
  }
});
