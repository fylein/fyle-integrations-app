const fs = require('fs');

let config;
const targetPath = './src/app/branding/config.json';

if (process.env.GH_UNIT_TEST_ENV) {  
  const configObject = {
    brandName: process.env.BRAND_NAME ? process.env.BRAND_NAME : '{{BRAND_NAME}}',
    webpageTitle: process.env.WEBPAGE_TITLE ? process.env.WEBPAGE_TITLE : '{{WEBPAGE_TITLE}}',
    brandId: process.env.BRAND_ID ? process.env.BRAND_ID : '{{BRAND_ID}}',
    supportEmail: process.env.SUPPORT_EMAIL ? process.env.SUPPORT_EMAIL : '{{SUPPORT_EMAIL}}',
    helpArticleDomain: process.env.HELP_ARTICLE_DOMAIN ? process.env.HELP_ARTICLE_DOMAIN : '{{HELP_ARTICLE_DOMAIN}}',
    envId: process.env.ENV_ID ? process.env.ENV_ID : '{{ENV_ID}}',
  };

  config = JSON.stringify(configObject);
} else {
  config = fs.readFileSync(`./src/app/branding/config-template.json`, 'utf8');
}

fs.writeFile(targetPath, config, 'utf8', (err) => {
  if (err) {
    return console.error(err);
  }
});
