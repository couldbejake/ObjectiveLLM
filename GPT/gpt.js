const conversation = require("./conversation")
const OpenAI = require("openai")

require('dotenv').config()

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
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