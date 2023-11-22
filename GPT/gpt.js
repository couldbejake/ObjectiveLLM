const conversation = require("./conversation")
const OpenAI = require("openai")
const openai = new OpenAI({
    apiKey: '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',
});


class GPT {
    constructor(){

    }
    newConversation(initialPrompt) {
        return new conversation(this, initialPrompt)
    }
    async compute(conversationHistory){
        const chatCompletion = await openai.chat.completions.create({
            messages: conversationHistory,
            model: 'gpt-3.5-turbo',
        });
        return chatCompletion.choices[0].message.content
    }  
}
module.exports = GPT