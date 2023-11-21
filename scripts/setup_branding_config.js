const fs = require('fs');

const config = fs.readFileSync(`./src/app/branding/config-template.json`, 'utf8');

const targetPath = './src/app/branding/config.json';
fs.writeFile(targetPath, config, 'utf8', (err) => {
  if (err) {
    return console.error(err);
  }
});
