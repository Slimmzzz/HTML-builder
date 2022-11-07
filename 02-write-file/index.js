const path = require('path');
const fs = require('fs');
const { stdout, stdin } = require('process');
const readline = require('readline');

let fileLocation = path.join(__dirname, 'destination.txt');
let output = fs.createWriteStream(fileLocation);
let rl = readline.createInterface({
    input: stdin,
})

stdout.write('Добрый день!\nНапиши здесь что-нибудь, оно отобразится в новосозданном файле.\nДля окончания записи данных - нажми "ctrl + c" или напиши "exit"\n');
rl.on('line', line => {
    if (line.toString() === 'exit') {
        console.log('Было приятно с тобой работать! Удачи!\n');
        process.exit();
    }
    output.write(line);
    process.on('SIGINT', () => process.exit());
    console.log('Напиши что-нибудь еще или воспользутесь командами для выхода, нажав "ctrl + c", либо написав exit');
    
})
process.on('exit' , () => stdout.write('Было приятно с тобой работать! Удачи!\n'));