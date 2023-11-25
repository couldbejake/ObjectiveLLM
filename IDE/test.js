const fs = require('fs');
const path = require('path');

function getNestedFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            getNestedFiles(filePath, fileList);
        } else {
            fileList.push(filePath);
        }
    });
    return fileList;
}

console.log(getNestedFiles("C:\\Users\\jakenelson\\Documents\\GitHub\\contextgpt\\IDE\\test"))