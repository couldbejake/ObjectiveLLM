const TaskStates = {
    "not-attempted": {
        prettyName: "Not Attempted",
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

class Task {
    constructor(title, description, state){
        this.title = title;
        this.description = description;
        if(!Object.keys(TaskStates).includes(state)){
            console.log("Provided invalid task state")
            process.exit()
        }
        this.state = state;
    }
    getTitlePretty(){
        return this.title;
    }
    getDescriptionPretty(){
        return this.description
    }
    getStatePretty(){
        return TaskStates[this.state].prettyName
    }
    setTitle(title){
        this.title = title;
    }
    setDescription(description){
        this.description = description
    }
    setState(state){
        if(!Object.keys(TaskStates).includes(state)){
            console.log("Provided invalid task state")
            process.exit()
        }
        this.state = state;
    }
}

module.exports = {Task, TaskStates}