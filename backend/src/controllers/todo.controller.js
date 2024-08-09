import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Todo } from "../models/todo.model.js";

const addTodo = asyncHandler(async (req, res) => {
  const { task, completed } = req.body;

  if ([task, completed].some((field) => field === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const todo = new Todo({ task, completed });
  const newTodo = await todo.save();

  return res.status(201).json(
    new ApiResponse(200, newTodo, "Task added successfully")
  );
});

const todoList = asyncHandler(async (req, res) => {
  const todos = await Todo.find();

  return res.status(200).json(
    new ApiResponse(200, todos, "All tasks listed successfully")
  );
});

const getTodo = asyncHandler(async (req, res) => {
  const todo = await Todo.findById(req.params.id);

  if (!todo) {
    return res.status(404).json(new ApiResponse(404, null, "Task not found"));
  }

  return res.status(200).json(
    new ApiResponse(200, todo, "Task found successfully")
  );
});

const updateTodo = asyncHandler(async (req, res) => {
  const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  if (!todo) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, "Task not found"));
  }

  return res.status(200).json(
    new ApiResponse(200, todo, "Task updated successfully")
  );
});

const deleteTodo = asyncHandler(async (req, res) => {
  const todo = await Todo.findOneAndDelete({ _id: req.params.id });
  if (!todo) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, "Task not found"));
  }

  return res.status(200).json(
    new ApiResponse(200, todo, "Task deleted successfully")
  );
});

export { addTodo, todoList, getTodo as todo, updateTodo, deleteTodo };
