const path = require('path');
const fs = require('fs');

const { readdir, writeFile, readFile } = fs.promises;

const styleSourceDir = path.resolve(__dirname, 'styles');
const distDir = path.resolve(__dirname, 'project-dist');

let stylesArr = [];

readdir(styleSourceDir).then(async (filesList) => {
    for (const fileName of filesList) {
        if (/\.css$/.test(fileName)) {
            let pathToStyleFile = path.resolve(styleSourceDir, fileName);
            let fileContent = await readFile(pathToStyleFile);
            stylesArr.push(fileContent);
        }
    }
    let bundleContent = stylesArr.join('');

    let destinationPath = path.join(distDir, 'bundle.css');

    await writeFile(destinationPath, bundleContent, 'utf-8');
})