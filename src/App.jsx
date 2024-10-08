// src/App.js
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchTodos,
  addTodoAsync,
  updateTodoAsync,
  deleteTodoAsync,
  toggleTodo,
} from './todoSlice';
import { setFilter } from './filterSlice';

function App() {
  const dispatch = useDispatch();

  // Local state for new todo input
  const [newTodo, setNewTodo] = useState('');

  // Local state for editing todo
  const [editingTodoId, setEditingTodoId] = useState(null);
  const [editingTodoText, setEditingTodoText] = useState('');

  // Selectors to access Redux state
  const todos = useSelector((state) => state.todos.items);
  const todoStatus = useSelector((state) => state.todos.status);
  const error = useSelector((state) => state.todos.error);
  const filter = useSelector((state) => state.filter);

  // Fetch todos on component mount
  useEffect(() => {
    if (todoStatus === 'idle') {
      dispatch(fetchTodos());
    }
  }, [todoStatus, dispatch]);

  // Handler to add a new todo
  const handleAddTodo = () => {
    if (newTodo.trim()) {
      const todoToAdd = {
        title: newTodo,
        completed: false,
      };
      dispatch(addTodoAsync(todoToAdd));
      setNewTodo(''); // Clear input field
    }
  };

  // Handler to delete a todo
  const handleDeleteTodo = (id) => {
    dispatch(deleteTodoAsync(id));
  };

  // Handler to toggle completion status
  const handleToggleTodo = (id) => {
    dispatch(toggleTodo(id));
  };

  // Handlers for editing a todo
  const handleEditTodo = (id, currentText) => {
    setEditingTodoId(id);
    setEditingTodoText(currentText);
  };

  const handleUpdateTodo = () => {
    if (editingTodoText.trim()) {
      const updatedTodo = {
        id: editingTodoId,
        title: editingTodoText,
        completed: false, // You can fetch current status if needed
      };
      dispatch(updateTodoAsync(updatedTodo));
      setEditingTodoId(null);
      setEditingTodoText('');
    }
  };

  // Handler to set the filter
  const handleSetFilter = (filter) => {
    dispatch(setFilter(filter));
  };

  // Filter todos based on the current filter state
  const filteredTodos = todos.filter((todo) => {
    if (filter === 'Active') return !todo.completed;
    if (filter === 'Completed') return todo.completed;
    return true; // 'All'
  });

  return (
    <div style={styles.container}>
      <h1>Todo List with Redux Toolkit</h1>

      {/* Add Todo Section */}
      <div style={styles.addTodoContainer}>
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new task"
          style={styles.input}
        />
        <button onClick={handleAddTodo} style={styles.button}>
          Add
        </button>
      </div>

      {/* Filter Buttons */}
      <div style={styles.filterContainer}>
        <button
          onClick={() => handleSetFilter('All')}
          style={filter === 'All' ? styles.activeFilterButton : styles.filterButton}
        >
          All
        </button>
        <button
          onClick={() => handleSetFilter('Active')}
          style={filter === 'Active' ? styles.activeFilterButton : styles.filterButton}
        >
          Active
        </button>
        <button
          onClick={() => handleSetFilter('Completed')}
          style={filter === 'Completed' ? styles.activeFilterButton : styles.filterButton}
        >
          Completed
        </button>
      </div>

      {/* Todo List */}
      <div style={styles.todoListContainer}>
        {todoStatus === 'loading' && <p>Loading...</p>}
        {todoStatus === 'failed' && <p>Error: {error}</p>}
        {todoStatus === 'succeeded' && (
          <ul style={styles.todoList}>
            {filteredTodos.map((todo) => (
              <li key={todo.id} style={styles.todoItem}>
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => handleToggleTodo(todo.id)}
                />
                {editingTodoId === todo.id ? (
                  <>
                    <input
                      type="text"
                      value={editingTodoText}
                      onChange={(e) => setEditingTodoText(e.target.value)}
                      style={styles.editInput}
                    />
                    <button onClick={handleUpdateTodo} style={styles.button}>
                      Update
                    </button>
                    <button
                      onClick={() => setEditingTodoId(null)}
                      style={styles.button}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <span
                      style={{
                        ...styles.todoText,
                        textDecoration: todo.completed ? 'line-through' : 'none',
                      }}
                    >
                      {todo.text}
                    </span>
                    <button
                      onClick={() => handleEditTodo(todo.id, todo.text)}
                      style={styles.button}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteTodo(todo.id)}
                      style={styles.button}
                    >
                      Delete
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

// Simple styling object
const styles = {
  container: {
    padding: '20px',
    maxWidth: '600px',
    margin: '0 auto',
    fontFamily: 'Arial, sans-serif',
  },
  addTodoContainer: {
    display: 'flex',
    marginBottom: '20px',
  },
  input: {
    flex: '1',
    padding: '10px',
    fontSize: '16px',
  },
  button: {
    padding: '10px 15px',
    marginLeft: '10px',
    fontSize: '16px',
    cursor: 'pointer',
  },
  filterContainer: {
    marginBottom: '20px',
  },
  filterButton: {
    padding: '10px 15px',
    marginRight: '10px',
    cursor: 'pointer',
  },
  activeFilterButton: {
    padding: '10px 15px',
    marginRight: '10px',
    cursor: 'pointer',
    backgroundColor: '#007BFF',
    color: '#fff',
    border: 'none',
  },
  todoListContainer: {
    minHeight: '200px',
  },
  todoList: {
    listStyle: 'none',
    padding: '0',
  },
  todoItem: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '10px',
  },
  todoText: {
    flex: '1',
    marginLeft: '10px',
  },
  editInput: {
    flex: '1',
    padding: '5px',
    fontSize: '16px',
    marginRight: '10px',
  },
};

export default App;
