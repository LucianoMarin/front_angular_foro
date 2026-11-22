const fs = require('fs');
const path = require('path');

const apiUrl = (process.env.API_URL || '').replace(/\/$/, '');

if (!apiUrl) {
  console.log('API_URL is not set. The frontend will build with an empty API URL.');
} else if (!/^https:\/\//i.test(apiUrl)) {
  console.error('API_URL must be an HTTPS URL.');
  process.exit(1);
}

const file = path.join(__dirname, '..', 'src', 'environments', 'environment.prod.ts');
const content = `export const environment = {
  production: true,
  apiUrl: ${JSON.stringify(apiUrl)}
};
`;

fs.writeFileSync(file, content);
console.log(`Configured production API URL: ${apiUrl || '(same origin)'}`);
