if [[ $OSTYPE == darwin* ]]
then
  SED_EXTRA_ARGS='""';
fi

for f in /usr/share/nginx/html/*
do
    echo "Substituting Environment variables and other stuff in $f ...";
    sed -i $SED_EXTRA_ARGS "s?{{API_URL}}?${API_URL}?g" $f;
    sed -i $SED_EXTRA_ARGS "s?{{QBD_API_URL}}?${QBD_API_URL}?g" $f;
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
done

nginx -g "daemon off;"
