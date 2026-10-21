import { useEffect, useState } from "react";
import axios from 'axios';
import { MdModeEditOutline } from "react-icons/md";
import { MdOutlineDone } from "react-icons/md";
import { FaTrash } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import { HiSparkles } from "react-icons/hi2";

function App() {
  const [newTodo, setNewtodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [editingTodo, setEditingTodo] = useState(null);
  const [editedText, setEditedText] = useState("");
  const [loading, setLoading] = useState(true);

  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    try {
      const response = await axios.post('/api/todos', {
        text: newTodo.trim()
      });
      setTodos([...todos, response.data]);
      setNewtodo('');
    } catch (err) {
      console.log("something went wrong", err);
    }
  };

  const fetchTodos = async () => {
    try {
      const response = await axios.get("/api/todos");
      setTodos(response.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const startEditing = (todo) => {
    setEditingTodo(todo._id);
    setEditedText(todo.text);
  };

  const saveEdit = async (id) => {
    try {
      const response = await axios.patch(`/api/todos/${id}`, {
        text: editedText
      });
      setTodos(todos.map((todo) => (todo._id === id ? response.data : todo)));
      setEditingTodo(null);
    } catch (err) {
      console.log("error", err);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`/api/todos/${id}`);
      setTodos(todos.filter((todo) => todo._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  const toggleTodo = async (id) => {
    try {
      const todo = todos.find((t) => t._id === id);
      const response = await axios.patch(`/api/todos/${id}`, {
        completed: !todo.completed
      });
      setTodos(todos.map((t) => (t._id === id ? response.data : t)));
    } catch (err) {
      console.log(err);
    }
  };

  const completedCount = todos.filter((t) => t.completed).length;

  return (
    <div className='min-h-screen w-full bg-linear-to-br from-yellow-50 via-amber-100 to-yellow-300 flex items-center justify-center p-3 sm:p-6 md:p-8 transition-colors duration-500'>
      <div className="bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-xl p-4 sm:p-7 md:p-8 border border-yellow-200 card-glow transition-all duration-300">
        
        {/* Header */}
        <div className="text-center mb-5 sm:mb-7">
          <div className="inline-flex items-center justify-center gap-2 mb-1.5 sm:mb-2">
            <span className="p-1.5 sm:p-2 bg-amber-100 text-amber-600 rounded-xl animate-bounce">
              <HiSparkles className="w-5 h-5 sm:w-6 sm:h-6" />
            </span>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-800 tracking-tight">
              Task Manager
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 font-medium">
            {todos.length === 0
              ? "Stay productive. Add your first goal!"
              : `${completedCount} of ${todos.length} completed`}
          </p>
          {todos.length > 0 && (
            <div className="w-full bg-gray-100 h-2 sm:h-2.5 rounded-full mt-3 overflow-hidden">
              <div
                className="bg-linear-to-r from-amber-400 to-yellow-500 h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${(completedCount / todos.length) * 100}%` }}
              />
            </div>
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={addTodo} className="flex flex-col sm:flex-row gap-2 p-1.5 sm:p-2 bg-gray-50 border-2 border-amber-300 focus-within:border-amber-500 focus-within:ring-4 focus-within:ring-amber-200 rounded-2xl transition-all duration-300 shadow-sm">
          <input
            className="flex-1 outline-none px-3 sm:px-4 py-2 sm:py-2.5 text-gray-700 bg-transparent placeholder-gray-400 text-sm sm:text-base min-w-0"
            type="text"
            value={newTodo}
            onChange={(e) => setNewtodo(e.target.value)}
            placeholder="SET A GOAL!"
            required
          />
          <button
            type="submit"
            className="bg-yellow-400 text-gray-900 font-semibold hover:bg-amber-500 hover:text-white px-5 py-2.5 rounded-xl cursor-pointer transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md shadow-amber-300/40 text-sm sm:text-base w-full sm:w-auto"
          >
            Add Task
          </button>
        </form>

        {/* Todo List */}
        <div className="mt-5 sm:mt-6">
          {loading ? (
            <div className="flex justify-center items-center py-10 text-amber-600">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
            </div>
          ) : todos.length === 0 ? (
            <div className="text-center py-8 sm:py-10 text-gray-400">
              <p className="text-xs sm:text-sm">No tasks yet. Enjoy your day or add one above! ☀️</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2.5 sm:gap-3">
              {todos.map((todo) => (
                <div
                  key={todo._id}
                  className="animate-todo-item"
                >
                  {editingTodo === todo._id ? (
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-2.5 sm:p-3 bg-amber-50/70 border border-amber-300 rounded-xl transition-all duration-200">
                      <input
                        className="flex-1 rounded-lg border border-amber-300 p-2 text-sm sm:text-base text-gray-800 outline-none focus:ring-2 focus:ring-amber-400 bg-white min-w-0"
                        type="text"
                        value={editedText}
                        onChange={(e) => setEditedText(e.target.value)}
                        autoFocus
                      />
                      <div className="flex justify-end gap-1.5 shrink-0">
                        <button
                          onClick={() => saveEdit(todo._id)}
                          aria-label="Save"
                          className="flex-1 sm:flex-initial flex items-center justify-center p-2 px-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-all duration-150 transform hover:scale-105 active:scale-95 cursor-pointer shadow-sm text-sm"
                        >
                          <MdOutlineDone size={18} />
                        </button>
                        <button
                          onClick={() => setEditingTodo(null)}
                          aria-label="Cancel"
                          className="flex-1 sm:flex-initial flex items-center justify-center p-2 px-3 bg-rose-400 text-white rounded-lg hover:bg-rose-500 transition-all duration-150 transform hover:scale-105 active:scale-95 cursor-pointer shadow-sm text-sm"
                        >
                          <IoClose size={18} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className={`group flex items-center justify-between p-2.5 sm:p-3.5 rounded-xl border transition-all duration-300 hover:shadow-md transform hover:-translate-y-0.5 gap-2 ${
                      todo.completed
                        ? "bg-gray-50/80 border-gray-200 opacity-75"
                        : "bg-white border-gray-100 hover:border-amber-200 hover:bg-amber-50/20"
                    }`}>
                      <div className="flex items-center gap-2.5 sm:gap-3 overflow-hidden flex-1 min-w-0">
                        <button
                          onClick={() => toggleTodo(todo._id)}
                          type="button"
                          className={`shrink-0 h-6 w-6 sm:h-7 sm:w-7 border-2 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer ${
                            todo.completed
                              ? "bg-emerald-500 border-emerald-500 text-white scale-105 shadow-sm shadow-emerald-200"
                              : "bg-white border-gray-300 hover:border-amber-500 hover:scale-110"
                          }`}
                        >
                          {todo.completed && <MdOutlineDone className="stroke-2 transition-transform duration-200" size={14} />}
                        </button>
                        <span className={`text-xs sm:text-sm md:text-base break-words min-w-0 transition-all duration-300 ${
                          todo.completed
                            ? "line-through text-gray-400"
                            : "text-gray-700 font-medium"
                        }`}>
                          {todo.text}
                        </span>
                      </div>

                      <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
                        <button
                          className="p-1.5 sm:p-2 text-blue-500 hover:text-blue-700 rounded-lg hover:bg-blue-50 transition-all duration-150 transform hover:scale-110 active:scale-90 cursor-pointer"
                          onClick={() => { startEditing(todo); }}
                          aria-label="Edit"
                        >
                          <MdModeEditOutline size={18} />
                        </button>
                        <button
                          className="p-1.5 sm:p-2 text-rose-500 hover:text-rose-700 rounded-lg hover:bg-rose-50 transition-all duration-150 transform hover:scale-110 active:scale-90 cursor-pointer"
                          onClick={() => deleteTodo(todo._id)}
                          aria-label="Delete"
                        >
                          <FaTrash size={15} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default App;
