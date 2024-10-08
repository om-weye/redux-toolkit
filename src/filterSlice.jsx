// src/filterSlice.js
import { createSlice } from '@reduxjs/toolkit';

export const filterSlice = createSlice({
  name: 'filter',
  initialState: 'All', // Possible values: 'All', 'Active', 'Completed'
  reducers: {
    setFilter: (state, action) => action.payload,
  },
});

// Export actions
export const { setFilter } = filterSlice.actions;

// Export reducer
export default filterSlice.reducer;
