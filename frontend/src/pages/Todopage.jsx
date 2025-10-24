import { useEffect, useState } from 'react';
import API from '../api';
import { FaEdit } from 'react-icons/fa';
import { AiFillDelete } from 'react-icons/ai';
import { v4 as uuidv4 } from 'uuid';

const TodoPage = () => {
  const [todoText, setTodoText] = useState('');
  const [todos, setTodos] = useState([]);
  const [showFinished, setShowFinished] = useState(true);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const res = await API.get('/todos');
      setTodos(res.data.todos);
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Unified add / update logic
  const handleSave = async () => {
    if (todoText.trim().length <= 3) return;

    if (editingId) {
      // --- UPDATE FLOW ---
      try {
        const res = await API.put(`/todos/${editingId}`, { todo: todoText });
        setTodos(prev =>
          prev.map(t => (t._id === editingId ? res.data.todo : t))
        );
        setTodoText('');
        setEditingId(null);
      } catch (err) {
        console.error('Error updating todo:', err);
      }
    } else {
      // --- CREATE FLOW ---
      const newTodo = { id: uuidv4(), todo: todoText, isCompleted: false };
      setTodos(prev => [...prev, newTodo]);
      setTodoText('');
      try {
        const res = await API.post('/todos', { todo: newTodo.todo });
        setTodos(prev =>
          prev.map(t => (t.id === newTodo.id ? res.data.todo : t))
        );
      } catch (err) {
        console.error('Error creating todo:', err);
        setTodos(prev => prev.filter(t => t.id !== newTodo.id));
      }
    }
  };

  const handleEdit = (id) => {
    const t = todos.find(i => (i._id || i.id) === id);
    if (!t) return;
    setTodoText(t.todo);
    setEditingId(t._id || t.id);
  };

  const handleDelete = async (id) => {
    const toDelete = todos.find(t => t._id === id || t.id === id);
    setTodos(prev => prev.filter(t => (t._id || t.id) !== id));
    try {
      await API.delete(`/todos/${id}`);
    } catch (err) {
      console.error(err);
      setTodos(prev => [...prev, toDelete]);
    }
  };

  const toggleFinished = async (id) => {
    const t = todos.find(i => (i._id || i.id) === id);
    if (!t) return;
    const updated = { ...t, isCompleted: !t.isCompleted };
    setTodos(prev =>
      prev.map(item => ((item._id || item.id) === id ? updated : item))
    );
    try {
      await API.put(`/todos/${id}`, { isCompleted: updated.isCompleted });
    } catch (err) {
      console.error(err);
      setTodos(prev =>
        prev.map(item => ((item._id || item.id) === id ? t : item))
      );
    }
  };

  return (
    <div className="mx-3 md:container md:mx-auto my-5 rounded-xl p-5 bg-violet-100 min-h-[80vh] md:w-1/2">
      <h1 className="font-bold text-center text-xl">TodoTrack - Manage your todos at one place</h1>

      <div className="addTodo my-5 flex flex-col gap-4">
        <h2 className="text-lg font-bold">{editingId ? 'Edit Todo' : 'Add a Todo'}</h2>
        <input
          value={todoText}
          onChange={e => setTodoText(e.target.value)}
          type="text"
          className="w-full rounded-full px-5 py-1"
        />
        <button
          onClick={handleSave}
          disabled={todoText.length <= 3}
          className="bg-slate-700 hover:bg-slate-800 disabled:bg-slate-400 p-2 py-1 text-sm font-bold text-white rounded-md"
        >
          {editingId ? 'Update' : 'Save'}
        </button>
      </div>

      <div className="my-4">
        <label>
          <input
            className="mr-2"
            onChange={() => setShowFinished(!showFinished)}
            type="checkbox"
            checked={showFinished}
          />
          Show Finished
        </label>
      </div>

      <h2 className="text-lg font-bold">Your Todos</h2>
      <div className="todos">
        {todos.length === 0 && <div className="m-5">No Todos to display</div>}
        {todos.map(item => {
          const id = item._id || item.id;
          return (showFinished || !item.isCompleted) && (
            <div key={id} className="todo flex my-3 justify-between">
              <div className="flex gap-5 items-center">
                <input name={id} onChange={() => toggleFinished(id)} type="checkbox" checked={!!item.isCompleted} />
                <div className={item.isCompleted ? 'line-through' : ''}>{item.todo}</div>
              </div>
              <div className="buttons flex h-full">
                <button onClick={() => handleEdit(id)} className="bg-slate-700 hover:bg-slate-800 p-2 py-1 text-sm font-bold text-white rounded-md mx-1"><FaEdit /></button>
                <button onClick={() => handleDelete(id)} className="bg-slate-700 hover:bg-slate-800 p-2 py-1 text-sm font-bold text-white rounded-md mx-1"><AiFillDelete /></button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TodoPage;
