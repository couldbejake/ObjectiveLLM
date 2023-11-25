const SubTaskStates = {
    "not-yet-attempted": {
        prettyName: "Not yet attempted",
        description: "The task has not been attempted."
    },
    "in-progress": {
        prettyName: "In Progress",
        description: "The task should be considered in progress."
    },
    "completed": {
        prettyName: "Completed",
        description: "The task has completed successfully."
    },
}

class SubTask {
    constructor(context){
        this.task_id = context.task_id;
        this.subtask_id = context.subtask_id;
        this.total_subtask_index = context.total_subtask_index
        this.title = context.title;
        this.description = context.description;
        if(!Object.keys(SubTaskStates).includes(context.state)){
            console.log("Provided invalid task state")
            process.exit()
        }
        this.state = context.state;
    }
    getTitlePretty(){
        return this.title;
    }
    getDescriptionPretty(){
        return this.description
    }
    getStatePretty(){
        return SubTaskStates[this.state].prettyName
    }
    setTitle(title){
        this.title = title;
    }
    setDescription(description){
        this.description = description
    }
    setState(state){
        if(!Object.keys(SubTaskStates).includes(state)){
            console.log("Provided invalid task state")
            process.exit()
        }
        this.state = state;
    }
}

module.exports = {SubTask, SubTaskStates}