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
        try {
            const chatCompletion = await openai.chat.completions.create({
                messages: conversationHistory,
                model: 'gpt-4-1106-preview',
            });
            return chatCompletion.choices[0].message.content
        } catch (error) {
            console.log(error)
            console.log(JSON.stringify(conversationHistory, null, 4))
        }

    }  
}
module.exports = GPT