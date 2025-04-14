import React, { useState, useEffect } from 'react';
import { useOptimistic } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import DataSet from './DataSet';
import './TableStyles.css';

const CommentsTable = () => {
  const [comments, setComments] = useState([]);
  const [optimisticComments, setOptimisticComments] = useOptimistic(comments);

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

  const validationSchema = Yup.object({
    postId: Yup.number().required('Required').min(1, 'Must be at least 1'),
    name: Yup.string().required('Required'),
    email: Yup.string().email('Invalid email').required('Required'),
    body: Yup.string().required('Required'),
  });

  const handleAddComment = async (values, { resetForm }) => {
    const tempId = Date.now();
    const optimisticComment = { ...values, id: tempId };

    setOptimisticComments(prev => [...prev, optimisticComment]);

    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!response.ok) throw new Error('Failed to add comment');

      const savedComment = await response.json();
      setComments(prev => [...prev.filter(c => c.id !== tempId), savedComment]);
      resetForm();
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
    <div className="table-container">
      <h1>Comments</h1>
      <Formik
        initialValues={{ postId: 1, name: '', email: '', body: '' }}
        validationSchema={validationSchema}
        onSubmit={handleAddComment}
      >
        <Form className="comment-form">
          <div>
            <Field type="number" name="postId" placeholder="Post ID" />
            <ErrorMessage name="postId" component="div" className="error" />
          </div>
          <div>
            <Field type="text" name="name" placeholder="Name" />
            <ErrorMessage name="name" component="div" className="error" />
          </div>
          <div>
            <Field type="email" name="email" placeholder="Email" />
            <ErrorMessage name="email" component="div" className="error" />
          </div>
          <div>
            <Field as="textarea" name="body" placeholder="Comment" />
            <ErrorMessage name="body" component="div" className="error" />
          </div>
          <button type="submit">Add Comment</button>
        </Form>
      </Formik>
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

export default CommentsTable;