if [[ $OSTYPE == darwin* ]]
then
  SED_EXTRA_ARGS='""';
fi

for f in /usr/share/nginx/html/*
do
    echo "Substituting Environment variables and other stuff in $f ...";
    sed -i $SED_EXTRA_ARGS "s?{{API_URL}}?${API_URL}?g" $f;
    sed -i $SED_EXTRA_ARGS "s?{{QBD_API_URL}}?${QBD_API_URL}?g" $f;
    sed -i $SED_EXTRA_ARGS "s?{{SI_API_URL}}?${SI_API_URL}?g" $f;
    sed -i $SED_EXTRA_ARGS "s?{{SAGE300_API_URL}}?${SAGE300_API_URL}?g" $f;
    sed -i $SED_EXTRA_ARGS "s?{{BUSINESS_CENTRAL_API_URL}}?${BUSINESS_CENTRAL_API_URL}?g" $f;
    sed -i $SED_EXTRA_ARGS "s?{{QBO_API_URL}}?${QBO_API_URL}?g" $f;
    sed -i $SED_EXTRA_ARGS "s?{{FYLE_APP_URL}}?${FYLE_APP_URL}?g" $f;
    sed -i $SED_EXTRA_ARGS "s?{{CALLBACK_URI}}?${CALLBACK_URI}?g" $f;
    sed -i $SED_EXTRA_ARGS "s?{{FYLE_CLIENT_ID}}?${FYLE_CLIENT_ID}?g" $f;
    sed -i $SED_EXTRA_ARGS "s?{{PRODUCTION}}?${PRODUCTION}?g" $f;
    sed -i $SED_EXTRA_ARGS "s?{{SENTRY_DSN}}?${SENTRY_DSN}?g" $f;
    sed -i $SED_EXTRA_ARGS "s?{{SENTRY_ENV}}?${SENTRY_ENV}?g" $f;
    sed -i $SED_EXTRA_ARGS "s?{{CLARITY_PROJECT_ID}}?${CLARITY_PROJECT_ID}?g" $f;
    sed -i $SED_EXTRA_ARGS "s?{{SEGMENT_ID}}?${SEGMENT_ID}?g" $f;
    sed -i $SED_EXTRA_ARGS "s?{{QBO_CALLBACK_URL}}?${QBO_CALLBACK_URL}?g" $f;
    sed -i $SED_EXTRA_ARGS "s?{{NS_CALLBACK_URL}}?${NS_CALLBACK_URL}?g" $f;
    sed -i $SED_EXTRA_ARGS "s?{{SI_CALLBACK_URL}}?${SI_CALLBACK_URL}?g" $f;
    sed -i $SED_EXTRA_ARGS "s?{{XERO_CALLBACK_URL}}?${XERO_CALLBACK_URL}?g" $f;
    sed -i $SED_EXTRA_ARGS "s?{{QBO_CLIENT_ID}}?${QBO_CLIENT_ID}?g" $f;
    sed -i $SED_EXTRA_ARGS "s?{{NS_CLIENT_ID}}?${NS_CLIENT_ID}?g" $f;
    sed -i $SED_EXTRA_ARGS "s?{{SI_CLIENT_ID}}?${SI_CLIENT_ID}?g" $f;
    sed -i $SED_EXTRA_ARGS "s?{{XERO_CLIENT_ID}}?${XERO_CLIENT_ID}?g" $f;
    sed -i $SED_EXTRA_ARGS "s?{{TRAVELPERK_REDIRECT_URI}}?${TRAVELPERK_REDIRECT_URI}?g" $f;
    sed -i $SED_EXTRA_ARGS "s?{{QBO_OAUTH_REDIRECT_URI}}?${QBO_OAUTH_REDIRECT_URI}?g" $f;
    sed -i $SED_EXTRA_ARGS "s?{{QBO_AUTHORIZE_URI}}?${QBO_AUTHORIZE_URI}?g" $f;
    sed -i $SED_EXTRA_ARGS "s?{{QBO_OAUTH_CLIENT_ID}}?${QBO_OAUTH_CLIENT_ID}?g" $f;
    sed -i $SED_EXTRA_ARGS "s?{{TRAVELPERK_BASE_URL}}?${TRAVELPERK_BASE_URL}?g" $f;
    sed -i $SED_EXTRA_ARGS "s?{{TRAVELPERK_CLIENT_ID}}?${TRAVELPERK_CLIENT_ID}?g" $f;
    sed -i $SED_EXTRA_ARGS "s?{{REFINER_PROJECT_ID}}?${REFINER_PROJECT_ID}?g" $f;
    sed -i $SED_EXTRA_ARGS "s?{{REFINER_INTACCT_ONBOARDING_DONE_SURVEY_ID}}?${REFINER_INTACCT_ONBOARDING_DONE_SURVEY_ID}?g" $f;
    sed -i $SED_EXTRA_ARGS "s?{{REFINER_INTACCT_EXPORT_DONE_SURVEY_ID}}?${REFINER_INTACCT_EXPORT_DONE_SURVEY_ID}?g" $f;
    sed -i $SED_EXTRA_ARGS "s?{{BRAND_NAME}}?${BRAND_NAME}?g" $f;
    sed -i $SED_EXTRA_ARGS "s?{{WEBPAGE_TITLE}}?${WEBPAGE_TITLE}?g" $f;
    sed -i $SED_EXTRA_ARGS "s?{{BRAND_ID}}?${BRAND_ID}?g" $f;
    sed -i $SED_EXTRA_ARGS "s?{{SUPPORT_EMAIL}}?${SUPPORT_EMAIL}?g" $f;
done

nginx -g "daemon off;"
