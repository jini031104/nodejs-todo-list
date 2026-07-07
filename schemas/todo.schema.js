import mongoose from "mongoose";

const todoSchema = new mongoose.Schema({
    value: {
        type: String,
        required: true,
    },
    order: {
        type: Number,
        required: true,
    },
    doneAt: {
        type: Date,
        required: false,
    }
});

todoSchema.virtual('todoId').get(function () {
    return this._id.toHexString();
});
todoSchema.set('toJSON', {
    virtuals: true,
});

export default mongoose.model('TodoList', todoSchema);