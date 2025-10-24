// server/controllers/todoController.js
const Todo = require('../models/Todo');

exports.getTodos = async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ todos });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createTodo = async (req, res) => {
  try {
    const { todo } = req.body;
    if (!todo) return res.status(400).json({ message: 'Todo text required' });
    const newTodo = await Todo.create({ user: req.user._id, todo, isCompleted: false });
    res.status(201).json({ todo: newTodo });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateTodo = async (req, res) => {
  try {
    const { id } = req.params;

    const todo = await Todo.findOneAndUpdate(
      { _id: id, user: req.user._id },
      req.body,
      { new: true }
    );

    if (!todo) return res.status(404).json({ message: 'Not found or not allowed' });

    res.json({ todo });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await Todo.findById(id);
    if (!todo) return res.status(404).json({ message: 'Not found' });
    if (!todo.user.equals(req.user._id)) return res.status(403).json({ message: 'Not allowed' });
    await todo.deleteOne();;
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
