const fs = require('fs');
const path = require('path');

let fileLocation = path.join(__dirname, 'text.txt');
let stream = fs.createReadStream(fileLocation, 'utf-8');

let data = '';

stream.on('data', chunk => data += chunk);
stream.on('end', () => console.log(data));