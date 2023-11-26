


function getTextAfterParameter(text, parameterNum){
    var tokens = ["\n", " "]
    var tokenCount = 0
    var fromIndex = 0;

    for (let i = 0; i < text.length; i++) {
        if(tokens.includes(text[i])){
            tokenCount += 1
        }
        if(tokenCount > parameterNum){
            fromIndex = i + 1;
            found = true;
            break;
        }
    }

    return (text.slice(fromIndex, text.length))
}


console.log(getTextAfterParameter(`overwrite random_word_generator.py test" test"
`, 1))