const conversation = require("./conversation")
const OpenAI = require("openai")
const openai = new OpenAI({
    apiKey: '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',
});


class GPT {
    constructor(){

    }
    newConversation(initialPrompt) {
        this.conversation = new conversation(this, initialPrompt)
        return this.conversation
    }
    compute(conversationHistory){
        return new Promise(async (resolve, reject) => {
            openai.chat.completions.create({
                messages: conversationHistory,
                model: 'gpt-4-1106-preview', //gpt-4-1106-preview
            }).then((chatCompletion) => {
                resolve(chatCompletion.choices[0].message.content)
            }).catch((error) => {
                reject(error.error.code)
            })
        })
    }  
}
module.exports = GPT