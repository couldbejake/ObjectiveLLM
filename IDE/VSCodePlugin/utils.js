const fs = require('fs');
const path = require('path');

function getNestedFilesAndDirs(dir, result = []) {
    const items = fs.readdirSync(dir);
    items.forEach(item => {
        const itemPath = path.join(dir, item);
        const itemStat = fs.statSync(itemPath);
        if(itemPath && !itemPath.includes("node_modules")){
            result.push({
                path: itemPath.replaceAll("\\", "/"),
                local_path: itemPath.replaceAll("\\", "/").replace(dir.replaceAll("\\", "/"), "").slice(1),
                type: itemStat.isDirectory() ? 'directory' : 'file'
            });
        }
        if (itemStat.isDirectory()) {
            getNestedFilesAndDirs(itemPath, result);
        }
    });
    return result;
}



module.exports = { getNestedFilesAndDirs }
