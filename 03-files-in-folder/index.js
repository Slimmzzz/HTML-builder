const { readdir, stat } = require('fs/promises');
const path = require('path');
let currentDir = path.join(__dirname, 'secret-folder');

readdir(currentDir, {withFileTypes: true})
.then(async fileList => {
    for (let file of fileList) {
        if (file.isFile()) {
            let fileDir = path.join(currentDir, file.name);
            let stats = await stat(fileDir);
            let [ name, extension] = file.name.split('.')
            console.log(path.parse(file.name).name + ' - ' + extension + ' - ' + (stats.size / 1000) + 'kb');
        }
    }
})
.catch(err => {
    console.log(err);
});
