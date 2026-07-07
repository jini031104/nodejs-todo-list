import Joi from 'joi';
import express from 'express';
import todoSchema from '../schemas/todo.schema.js';

const router = express.Router();

const createTodoSchema = Joi.object({
    value: Joi.string().min(1).max(50).required(),
});

router.post('/todos', async (req, res, next) => {
    try{
        const validation = await createTodoSchema.validateAsync(req.body);
        const {value} = validation;
        console.log(value);

        if(!value) {
            return res.status(400).json({errorMessage: '해야할 일 데이터가 존재하지 않습니다.'});
        }

        const todoMaxOrder = await todoSchema.findOne().sort('-order').exec();
        const order = todoMaxOrder ? todoMaxOrder.order + 1 : 1;
        const todo = new todoSchema({value, order});

        await todo.save();
        return res.status(201).json({todo});
    } catch(error) {
        next(error);
    }
});

router.get('/todos', async (req, res) => {
    const todos = await todoSchema.find().sort('-order').exec();

    return res.status(200).json({todos});
})

router.patch('/todos/:todoId', async (req, res) => {
    const {order, done, value} = req.body;
    const {todoId} = req.params;

    // 현재 나의 todo가 무엇인지 알아야 한다.
    const currentTodo = await todoSchema.findById(todoId).exec();
    if(!currentTodo){
        return res.status(404).json({errorMessage: '존재하지 않는 todo입니다.'});
    }

    // 오더가 있을 때에만 순서를 변경할 것이다.
    if(order){
        // 바꾸려는 오더가 존재하는가
        const targetTodo = await todoSchema.findOne({order}).exec();
        if(targetTodo){
            // 타겟투두를 내가 지금 가진 것으로 변경한다.
            targetTodo.order = currentTodo.order;
            await targetTodo.save();
        }
        // 내가 가진 것 또한 전달받은 것으로 변경한다.
        currentTodo.order = order;
    }

    if(done !== undefined){
        currentTodo.doneAt = done? new Date() : null;
    }
    if(value) {
        currentTodo.value = value;
    }
    
    await currentTodo.save();

    return res.status(200).json({});
});

router.delete('/todos/:todoId', async (req, res) => {
    const {todoId} = req.params;

    const todo = await todoSchema.findById(todoId).exec();
    if(!todo){
        return res.status(404).json({errorMessage: '존재하지 않는 todo 데이터입니다.'});
    }

    await todoSchema.deleteOne({_id: todoId}).exec();

    return res.status(200).json({});
});

export default router;