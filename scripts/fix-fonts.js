const fs = require('fs');
const path = require('path');

const buildDir = path.join(__dirname, '..', 'build');

for (const file of fs.readdirSync(buildDir)) {
  if (!file.endsWith('.html')) continue;
  const filePath = path.join(buildDir, file);
  let html = fs.readFileSync(filePath, 'utf-8');

  // react-snap runs font-loader.js, turning media="print" into media="all"
  // Restore media="print" with id="font-css" for the external script approach
  html = html.replace(
    /<link rel="stylesheet" href="(https:\/\/fonts\.googleapis\.com\/[^"]+)"[^>]*media="all"[^>]*\/?>/g,
    '<link rel="stylesheet" href="$1" media="print" id="font-css" />'
  );

  fs.writeFileSync(filePath, html, 'utf-8');
}
