const GPT = require('./GPT/gpt')

async function main() {
    var gpt = new GPT();
    var convo = gpt.newConversation("You are a joker bot, you will reply to every message with a joke");

    convo.addUser("Tell me about space");


    convo.compute().then((answer) => {
        console.log(answer)
    })

}

main();