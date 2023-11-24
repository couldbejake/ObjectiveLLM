class conversation {
    constructor(gpt, initialPrompt){
        this.gpt = gpt;
        this.initialPrompt = initialPrompt
        if(initialPrompt){
            this.conversationHistory = [{ role: 'system', content: initialPrompt }]
        } else {
            this.conversationHistory = []
        }
        this.pruneKeepMessageCount = 25;
    }
    addUser(message, options = {}){
        this.conversationHistory.push({ role: 'user', content: message, dontPrune: options.dontPrune})
        return this;
    }
    addSystem(message, options = {}){
        this.conversationHistory.push({ role: 'system', content: message, dontPrune: options.dontPrune})
        return this;
    }
    pruneConversation(count){
        this.conversationHistory = this.conversationHistory.filter((item, index, array) => {
            return item.dontPrune === true || index >= array.length - ((count) ? count : this.pruneKeepMessageCount);
        });
    }
    async compute(){
        return new Promise((resolve, reject) => {
            var filteredConversationHistory = this.conversationHistory.map(message => ({  role: message.role, content: message.content }));
            this.gpt.compute(filteredConversationHistory).then((answer) => {
                this.conversationHistory.push({ role: 'system', content: answer })
                resolve(answer)
            }).catch((error) => {
                reject({
                    gpt_error: true,
                    error_code: error
                })
            })
        })
    }
    print(){
    }
}

module.exports = conversation


// add ability for GPT to view complete pruned conversation history
