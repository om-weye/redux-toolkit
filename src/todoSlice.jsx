// src/todoSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Define the API endpoint
const API_URL = 'https://jsonplaceholder.typicode.com/todos';

// Thunk to fetch todos
export const fetchTodos = createAsyncThunk('todos/fetchTodos', async () => {
  const response = await axios.get(`${API_URL}?_limit=10`); // Limiting to 10 for demo
  return response.data;
});

// Thunk to add a new todo
export const addTodoAsync = createAsyncThunk('todos/addTodoAsync', async (newTodo) => {
  const response = await axios.post(API_URL, newTodo);
  return response.data;
});

// Thunk to update an existing todo
export const updateTodoAsync = createAsyncThunk('todos/updateTodoAsync', async (updatedTodo) => {
  const response = await axios.put(`${API_URL}/${updatedTodo.id}`, updatedTodo);
  return response.data;
});

// Thunk to delete a todo
export const deleteTodoAsync = createAsyncThunk('todos/deleteTodoAsync', async (id) => {
  await axios.delete(`${API_URL}/${id}`);
  return id;
});

// Create the todo slice
export const todoSlice = createSlice({
  name: 'todos',
  initialState: {
    items: [],           // Array of todos
    status: 'idle',      // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,         // Error message
  },
  reducers: {
    // Synchronous action to toggle todo completion
    toggleTodo: (state, action) => {
      const todo = state.items.find((todo) => todo.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
      }
    },
  },
  extraReducers: (builder) => {
    // Handle fetchTodos
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Add fetched todos to the array
        state.items = action.payload.map((todo) => ({
          id: todo.id,
          text: todo.title,
          completed: todo.completed,
        }));
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });

    // Handle addTodoAsync
    builder
      .addCase(addTodoAsync.fulfilled, (state, action) => {
        state.items.push({
          id: action.payload.id,
          text: action.payload.title,
          completed: action.payload.completed,
        });
      });

    // Handle updateTodoAsync
    builder
      .addCase(updateTodoAsync.fulfilled, (state, action) => {
        const index = state.items.findIndex((todo) => todo.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = {
            id: action.payload.id,
            text: action.payload.title,
            completed: action.payload.completed,
          };
        }
      });

    // Handle deleteTodoAsync
    builder
      .addCase(deleteTodoAsync.fulfilled, (state, action) => {
        state.items = state.items.filter((todo) => todo.id !== action.payload);
      });
  },
});

// Export synchronous actions
export const { toggleTodo } = todoSlice.actions;

// Export the reducer
export default todoSlice.reducer;
