import React, { useState, useEffect } from 'react';
import { useOptimistic } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import DataSet from './DataSet';
import './TableStyles.css';

const PostsTable = () => {
  const [posts, setPosts] = useState([]);
  const [optimisticPosts, setOptimisticPosts] = useOptimistic(posts);

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/posts')
      .then(response => response.json())
      .then(data => setPosts(data))
      .catch(error => console.error('Error fetching posts:', error));
  }, []);

  const headers = [
    { key: 'id', label: 'ID' },
    { key: 'userId', label: 'User ID' },
    { key: 'title', label: 'Title' },
    { key: 'body', label: 'Body' },
  ];

  const validationSchema = Yup.object({
    userId: Yup.number().required('Required').min(1, 'Must be at least 1'),
    title: Yup.string().required('Required'),
    body: Yup.string().required('Required'),
  });

  const handleAddPost = async (values, { resetForm }) => {
    const tempId = Date.now();
    const optimisticPost = { ...values, id: tempId };

    setOptimisticPosts(prev => [...prev, optimisticPost]);

    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!response.ok) throw new Error('Failed to add post');

      const savedPost = await response.json();
      setPosts(prev => [...prev.filter(p => p.id !== tempId), savedPost]);
      resetForm();
    } catch (error) {
      console.error('Error:', error);
      setOptimisticPosts(prev => prev.filter(p => p.id !== tempId));
    }
  };

  const handleDelete = async (selectedIds) => {
    const idsToDelete = Array.from(selectedIds);

    setOptimisticPosts(prev => prev.filter(p => !selectedIds.has(p.id)));

    try {
      await Promise.all(
        idsToDelete.map(id =>
          fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
            method: 'DELETE',
          })
        )
      );
      setPosts(prev => prev.filter(p => !selectedIds.has(p.id)));
    } catch (error) {
      console.error('Error deleting:', error);
      setOptimisticPosts(posts);
    }
  };

  const handleUpdate = async (updatedRow) => {
    setOptimisticPosts(prev =>
      prev.map(p => p.id === updatedRow.id ? updatedRow : p)
    );

    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/posts/${updatedRow.id}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedRow),
        }
      );

      if (!response.ok) throw new Error('Failed to update');

      const savedPost = await response.json();
      setPosts(prev =>
        prev.map(p => p.id === updatedRow.id ? savedPost : p)
      );
    } catch (error) {
      console.error('Error updating:', error);
      setOptimisticPosts(posts);
    }
  };

  const renderHeader = (header) => header.label;
  const renderCell = (value) => value;

  return (
    <div className="table-container">
      <h1>Posts</h1>
      <Formik
        initialValues={{ userId: 1, title: '', body: '' }}
        validationSchema={validationSchema}
        onSubmit={handleAddPost}
      >
        <Form className="comment-form">
          <div>
            <Field type="number" name="userId" placeholder="User ID" />
            <ErrorMessage name="userId" component="div" className="error" />
          </div>
          <div>
            <Field type="text" name="title" placeholder="Title" />
            <ErrorMessage name="title" component="div" className="error" />
          </div>
          <div>
            <Field as="textarea" name="body" placeholder="Body" />
            <ErrorMessage name="body" component="div" className="error" />
          </div>
          <button type="submit">Add Post</button>
        </Form>
      </Formik>
      <DataSet
        headers={headers}
        data={optimisticPosts}
        renderHeader={renderHeader}
        renderCell={renderCell}
        onDelete={handleDelete}
        onUpdate={handleUpdate}
      />
    </div>
  );
};

export default PostsTable;