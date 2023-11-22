class conversation {
    constructor(gpt, initialPrompt){
        this.gpt = gpt;
        this.initialPrompt = initialPrompt
        this.conversationHistory = [{ role: 'system', content: initialPrompt }]
    }
    addUser(message){
        this.conversationHistory.push({ role: 'user', content: message })
        return this;
    }
    addSystem(message){
        this.conversationHistory.push({ role: 'system', content: message })
        return this;
    }
    async compute(){
        return new Promise((resolve, reject) => {
            this.gpt.compute(this.conversationHistory).then((answer) => {
                this.conversationHistory.push({ role: 'system', content: answer })
                resolve(answer)
            })
        })
    }
}

module.exports = conversation
