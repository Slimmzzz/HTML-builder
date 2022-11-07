const path = require('path');
const { mkdir, readdir } = require('fs/promises');
const { copyFile, unlink } = require('fs');

let srcDir = path.join(__dirname, 'files');
let distDir = path.join(__dirname, 'files-copy');

(async function copyDirectory() {
    mkdir(distDir, {recursive: true});
    readdir(srcDir, {withFileTypes: true})
    .then(async fileList => {
        let distDirFileCheck = await readdir(distDir, err => console.log(err));
        let fileName;
        let someArray = [];
        for (let file of fileList) {
            fileName = file.name;
            let filesDir = path.join(srcDir, fileName);
            let copyPath = path.join(distDir, fileName);
            someArray.push(fileName);
            copyFile(filesDir, copyPath, err => {
                if (err) console.log(err);
            });
        }
        for (let i = 0; i < distDirFileCheck.length; i++) {
            if (someArray.includes(distDirFileCheck[i])) {
            } else {
                let todelete = path.resolve(distDir, distDirFileCheck[i]);
                unlink(todelete, err => {
                    if (err) console.log(err);
                    });
            }
        }
    })
})();
