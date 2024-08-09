import { Router } from "express";
import { addTodo, todo, todoList, updateTodo, deleteTodo } from "../controllers/todo.controller.js";

const TodoRouter = Router();

    TodoRouter.post('/', addTodo);
    TodoRouter.get('/',  todoList);
    TodoRouter.get('/:id',  todo);
    TodoRouter.put('/:id', updateTodo);
    TodoRouter.delete('/:id', deleteTodo);

export default TodoRouter;