import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import CommentsTable from './components/CommentsTable';
import PostsTable from './components/PostsTable';
import AlbumsTable from './components/AlbumsTable';
import TodosTable from './components/TodosTable';
import UsersTable from './components/UsersTable';
import './App.css';

const App = () => {
  return (
    <div className="App">
      <Sidebar />
      <div className="content">
        <Routes>
          <Route path="/comments" element={<CommentsTable />} />
          <Route path="/posts" element={<PostsTable />} />
          <Route path="/albums" element={<AlbumsTable />} />
          <Route path="/todos" element={<TodosTable />} />
          <Route path="/users" element={<UsersTable />} />
          <Route path="/" element={<CommentsTable />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;