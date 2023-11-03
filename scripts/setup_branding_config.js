const fs = require('fs');

const config = fs.readFileSync(`./src/app/branding/${process.env.BRANDING_FILE_NAME}.json`, 'utf8');

const targetPath = './src/app/branding/config.json';
fs.writeFile(targetPath, config, 'utf8', (err) => {
  if (err) {
    return console.error(err);
  }
});
