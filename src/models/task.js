const mongoose = require('mongoose');

const taskSchemaObject = {
    description:{
        type: String,
        required: true,
        trim: true
    },completed: {
        type: Boolean,
        default: false
    },owner:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
};

const timeStamp = {
    timestamps: true
}

const taskSchema = new mongoose.Schema(taskSchemaObject,timeStamp);

const Task = mongoose.model('Task',taskSchema);

module.exports = Task;
