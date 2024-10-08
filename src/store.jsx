import { configureStore } from "@reduxjs/toolkit";
import todoReducer from './todoSlice';
import filterReducer from './filterSlice'

const loggerMiddleware = (storeAPI) => (next) => (action) => {
    console.log('Dispatching action:', action.type);
    console.log('Payload:', action.payload);
    const result = next(action); // Call the next middleware or reducer
    console.log('New state:', storeAPI.getState());
    return result;
  };

export const store = configureStore({
    reducer: {
        todos: todoReducer,
        filter: filterReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(loggerMiddleware),
})