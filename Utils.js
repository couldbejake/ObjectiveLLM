function prettyJoin(list){
    var outputString = ""
    if(list.length >= 2){
        for (let i = 0; i < list.length; i++) {
            const el = list[i];
            if(i == 0){
                outputString += "'" + el + "'"
            } else if( i != list.length - 1) {
                outputString += ", " + "'" + el + "'"
            } else {
                outputString += " or " + "'" + el + "'"
            }
        }
    } else {
        outputString = "only '" + list[0] + "'"
    }
    return outputString
}

function isNumeric(value) {
    return /^\d+$/.test(value);
}

function alignMenu(menuOutput){
    return menuOutput.split('\n')
    .map(line => line.trimStart())
    .join('\n')
}

module.exports = {prettyJoin, isNumeric, alignMenu}


