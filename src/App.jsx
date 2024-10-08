import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import {addTodo, removeTodo, toggleTodo} from './todoSlice'
import { setFilter } from './filterSlice';

const App = () => {
  const [text, setText] = useState('');
  const todos = useSelector(state => state.todos);
  const filter = useSelector(state => state.filter);

  const dispatch = useDispatch();

  const handleAddTodo = () => {
    if(text.trim()) {
      dispatch(addTodo(text))
      setText('')
    }
  }

  const handleRemoveTodo = (id) => {
    dispatch(removeTodo(id));
  }

  const handleFilterChange = (newFilter) => {
    dispatch(setFilter(newFilter));
  }

  const filteredTodos = todos.filter(todo => {
    if (filter == 'COMPLETED')
      return todo.completed;
    if (filter == 'ACTIVE')
      return !todo.completed;
    return true;
  })

  return (
    <div>
      <h1>Todo App</h1>

      <div>
        <input type="text" value={text} onChange={e => setText(e.target.value)} placeholder='Add a new task' />
        <button onClick={handleAddTodo}>Add</button>
      </div>
      <div>
        <button onClick={() => handleFilterChange('ALL')}>ALL</button>
        <button onClick={() => handleFilterChange('ACTIVE')}>ACTIVE</button>
        <button onClick={() => handleFilterChange('COMPLETED')}>COMPLETED</button>
      </div>
      <ul>
        { todos.map(todo => (
          <li key={todo.id} onClick={() => dispatch(toggleTodo(todo.id))}>
            {todo.text}
            <button onClick={() => handleRemoveTodo(todo.id)}>Remove</button>
          </li>
        ))
        }
      </ul>
    </div>
  )
}

export default App
