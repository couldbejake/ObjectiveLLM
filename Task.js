const TaskStates = {
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

class Task {
    constructor(context){
        this.task_id = context.task_id
        this.title = context.title;
        this.description = context.description;
        if(!Object.keys(TaskStates).includes(context.state)){
            console.log("Provided invalid task state")
            process.exit()
        }
        this.state = context.state;
        this.subtasks = context.subtasks ? context.subtasks : []
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
    getSubTasks(state){
        return this.subtasks
    }
}

module.exports = {Task, TaskStates}