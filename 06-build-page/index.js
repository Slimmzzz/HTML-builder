const path = require('path');
const { mkdir, readdir, readFile, writeFile } = require('fs/promises');
const { copyFile, unlink } = require('fs');

let srcDir = path.resolve(__dirname);
let distDir = path.resolve(srcDir, 'project-dist');
let assetsSrcDir = path.resolve(srcDir, 'assets');
let assetsDistDir = path.resolve(distDir, 'assets');
let indexHTMLPath = path.resolve(srcDir, 'template.html');
let componentsPath = path.resolve(srcDir, 'components');
let styleSourceDir = path.resolve(srcDir, 'styles');


async function copyDirectory(assetsSrcDir, assetsDistDir) {
    readdir(assetsSrcDir, {withFileTypes: true})
    .then(async fileList => {
        mkdir(assetsDistDir, {recursive: true});
        let distDirFileCheck = await readdir(assetsDistDir, err => console.log(err));
        let fileName;
        let distNamesArray = [];
        for (let i = 0; i < fileList.length; i++) {
            // console.log(fileList);
            fileName = fileList[i].name;
            let filesDir = path.resolve(assetsSrcDir, fileName);
            let copyPath = path.resolve(assetsDistDir, fileName);
            distNamesArray.push(fileName);
            if (fileList[i].isDirectory()) {
                let _filesDir = path.resolve(assetsSrcDir, fileList[i].name);
                let _copyPath = path.resolve(assetsDistDir, fileList[i].name);
                copyDirectory(_filesDir, _copyPath);
            } else {
                copyFile(filesDir, copyPath, err => {
                    if (err) console.log(err);
                });
            }
        }
        for (let i = 0; i < distDirFileCheck.length; i++) {
            if (distNamesArray.includes(distDirFileCheck[i])) {
            } else {
                let todelete = path.resolve(assetsDistDir, distDirFileCheck[i]);
                unlink(todelete, err => {
                    if (err) console.log(err);
                    });
            }
        }
    })
};

(async () => {
    //create dist-directory
    await mkdir(distDir, { recursive: true });

    //processing HTML
    let content = '';
    let templateContent = await readFile(indexHTMLPath, {encoding: 'utf-8'});
    templateContent = templateContent.toString();

    //regular expression
    const regEx = /\{\{\s?([a-zA-Z0-9]+)\s?\}\}/g;
    
    const templateMatches = templateContent.match(regEx);

    for (const template of templateMatches) {
        let templateFileName = template.replace(/[^a-zA-Z0-9]/g, '') + '.html';
        let componentsContent = await readFile(path.join(componentsPath, templateFileName));
        componentsContent = componentsContent.toString();
        templateContent = templateContent.replace(template, componentsContent);
    }
    await writeFile(path.join(distDir, 'index.html'), templateContent);
    //HTML DONE

    //Work with bundling styles
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
    
        let destinationPath = path.join(distDir, 'style.css');
    
        await writeFile(destinationPath, bundleContent, 'utf-8');
    });
    //Work with bundling styles END

    //copy assets START
    await copyDirectory(assetsSrcDir, assetsDistDir);
    //copy assets END
})();
