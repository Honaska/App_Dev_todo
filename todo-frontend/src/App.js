import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = 'http://localhost:8000/api/todos/'; // Change this for production

function App() {
    const [todos, setTodos] = useState([]);
    const [newTodoTitle, setNewTodoTitle] = useState('');
    const [newTodoDescription, setNewTodoDescription] = useState('');
    const [editingTodo, setEditingTodo] = useState(null);
    const [editText, setEditText] = useState('');
    const [editDescription, setEditDescription] = useState('');

    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = async () => {
        try {
            const response = await axios.get(API_URL);
            setTodos(response.data);
        } catch (error) {
            console.error('Error fetching todos:', error);
        }
    };

    const handleCreateTodo = async () => {
        if (newTodoTitle.trim()) {
            try {
                await axios.post(API_URL, { title: newTodoTitle, description: newTodoDescription });
                setNewTodoTitle('');
                setNewTodoDescription('');
                fetchTodos();
            } catch (error) {
                console.error('Error creating todo:', error);
            }
        }
    };

    const handleDeleteTodo = async (id) => {
        try {
            await axios.delete(`<span class="math-inline">\{API\_URL\}</span>{id}/`);
            fetchTodos();
        } catch (error) {
            console.error('Error deleting todo:', error);
        }
    };

    const handleEditTodo = (todo) => {
        setEditingTodo(todo);
        setEditText(todo.title);
        setEditDescription(todo.description || '');
    };

    const handleUpdateTodo = async () => {
        if (editingTodo && editText.trim()) {
            try {
                await axios.put(`<span class="math-inline">\{API\_URL\}</span>{editingTodo.id}/`, {
                    title: editText,
                    description: editDescription,
                    completed: editingTodo.completed, // Preserve the completed status
                });
                setEditingTodo(null);
                fetchTodos();
            } catch (error) {
                console.error('Error updating todo:', error);
            }
        }
    };

    const handleToggleComplete = async (todo) => {
        try {
            await axios.put(`<span class="math-inline">\{API\_URL\}</span>{todo.id}/`, {
                title: todo.title,
                description: todo.description,
                completed: !todo.completed,
            });
            fetchTodos();
        } catch (error) {
            console.error('Error updating todo status:', error);
        }
    };

    return (
        <div className="app">
            <h1>Todo List</h1>

            {/* Create Todo */}
            <div className="create-todo">
                <input
                    type="text"
                    placeholder="Title"
                    value={newTodoTitle}
                    onChange={(e) => setNewTodoTitle(e.target.value)}
                />
                <textarea
                    placeholder="Description (optional)"
                    value={newTodoDescription}
                    onChange={(e) => setNewTodoDescription(e.target.value)}
                />
                <button onClick={handleCreateTodo}>Add Todo</button>
            </div>

            {/* Todo List */}
            <ul className="todo-list">
                {todos.map(todo => (
                    <li key={todo.id} className={todo.completed ? 'completed' : ''}>
                        <div>
                            <input
                                type="checkbox"
                                checked={todo.completed}
                                onChange={() => handleToggleComplete(todo)}
                            />
                            {editingTodo && editingTodo.id === todo.id ? (
                                <>
                                    <input
                                        type="text"
                                        value={editText}
                                        onChange={(e) => setEditText(e.target.value)}
                                    />
                                    <textarea
                                        value={editDescription}
                                        onChange={(e) => setEditDescription(e.target.value)}
                                    />
                                    <button onClick={handleUpdateTodo}>Save</button>
                                    <button onClick={() => setEditingTodo(null)}>Cancel</button>
                                </>
                            ) : (
                                <>
                                    <h3>{todo.title}</h3>
                                    {todo.description && <p>{todo.description}</p>}
                                    <div className="actions">
                                        <button onClick={() => handleEditTodo(todo)}>Edit</button>
                                        <button onClick={() => handleDeleteTodo(todo.id)}>Delete</button>
                                    </div>
                                </>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;