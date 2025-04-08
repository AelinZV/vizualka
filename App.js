import React, { useState, useEffect } from 'react';
import { useOptimistic } from 'react';
import DataSet from './DataSet';
import './App.css';

const App = () => {
  const [comments, setComments] = useState([]);
  const [optimisticComments, setOptimisticComments] = useOptimistic(comments);
  const [newComment, setNewComment] = useState({ postId: 1, name: '', email: '', body: '' });

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/comments')
      .then(response => response.json())
      .then(data => setComments(data))
      .catch(error => console.error('Error fetching comments:', error));
  }, []);

  const headers = [
    { key: 'id', label: 'ID' },
    { key: 'postId', label: 'Post ID' },
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'body', label: 'Comment' },
  ];

  const handleAddComment = async (e) => {
    e.preventDefault();
    const tempId = Date.now();
    const optimisticComment = { ...newComment, id: tempId };

    setOptimisticComments(prev => [...prev, optimisticComment]);

    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newComment),
      });

      if (!response.ok) throw new Error('Failed to add comment');
      
      const savedComment = await response.json();
      setComments(prev => [...prev.filter(c => c.id !== tempId), savedComment]);
      setNewComment({ postId: 1, name: '', email: '', body: '' });
    } catch (error) {
      console.error('Error:', error);
      setOptimisticComments(prev => prev.filter(c => c.id !== tempId));
    }
  };

  const handleDelete = async (selectedIds) => {
    const idsToDelete = Array.from(selectedIds);

    setOptimisticComments(prev => prev.filter(c => !selectedIds.has(c.id)));

    try {
      await Promise.all(
        idsToDelete.map(id =>
          fetch(`https://jsonplaceholder.typicode.com/comments/${id}`, {
            method: 'DELETE',
          })
        )
      );
      setComments(prev => prev.filter(c => !selectedIds.has(c.id)));
    } catch (error) {
      console.error('Error deleting:', error);
      setOptimisticComments(comments);
    }
  };

  const handleUpdate = async (updatedRow) => {
    setOptimisticComments(prev =>
      prev.map(c => c.id === updatedRow.id ? updatedRow : c)
    );

    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/comments/${updatedRow.id}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedRow),
        }
      );

      if (!response.ok) throw new Error('Failed to update');
      
      const savedComment = await response.json();
      setComments(prev =>
        prev.map(c => c.id === updatedRow.id ? savedComment : c)
      );
    } catch (error) {
      console.error('Error updating:', error);
      setOptimisticComments(comments);
    }
  };

  const renderHeader = (header) => header.label;
  const renderCell = (value) => value;

  return (
    <div className="App">
      <h1>Comments</h1>
      
      <form onSubmit={handleAddComment} className="comment-form">
        <input
          value={newComment.name}
          onChange={e => setNewComment({ ...newComment, name: e.target.value })}
          placeholder="Name"
          required
        />
        <input
          value={newComment.email}
          onChange={e => setNewComment({ ...newComment, email: e.target.value })}
          placeholder="Email"
          required
        />
        <textarea
          value={newComment.body}
          onChange={e => setNewComment({ ...newComment, body: e.target.value })}
          placeholder="Comment"
          required
        />
        <button type="submit">Add Comment</button>
      </form>

      <DataSet
        headers={headers}
        data={optimisticComments}
        renderHeader={renderHeader}
        renderCell={renderCell}
        onDelete={handleDelete}
        onUpdate={handleUpdate}
      />
    </div>
  );
};

export default App;