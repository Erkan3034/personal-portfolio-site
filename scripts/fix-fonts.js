const fs = require('fs');
const path = require('path');

const buildDir = path.join(__dirname, '..', 'build');

for (const file of fs.readdirSync(buildDir)) {
  if (!file.endsWith('.html')) continue;
  const filePath = path.join(buildDir, file);
  let html = fs.readFileSync(filePath, 'utf-8');

  // react-snap fires the onload handler, turning media="print" into media="all"
  // This makes the font CSS render-blocking again
  // We need to restore media="print" with the onload handler
  // Handle both: 200.html (plain &, single quotes) and index.html (&amp;, &quot;)
  html = html.replace(
    /<link rel="stylesheet" href="(https:\/\/fonts\.googleapis\.com\/[^"]+)" media="all"(?: onload=(?:"[^"]*"|'[^']*'))?>/g,
    '<link rel="stylesheet" href="$1" media="print" onload="this.media=\'all\'" />'
  );

  fs.writeFileSync(filePath, html, 'utf-8');
}
