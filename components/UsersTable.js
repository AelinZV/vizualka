import React, { useState, useEffect } from 'react';
import { useOptimistic } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import DataSet from './DataSet';
import './TableStyles.css';

const UsersTable = () => {
  const [users, setUsers] = useState([]);
  const [optimisticUsers, setOptimisticUsers] = useOptimistic(users);

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(error => console.error('Error fetching users:', error));
  }, []);

  const headers = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'username', label: 'Username' },
    { key: 'email', label: 'Email' },
  ];

  const validationSchema = Yup.object({
    name: Yup.string().required('Required'),
    username: Yup.string().required('Required'),
    email: Yup.string().email('Invalid email').required('Required'),
  });

  const handleAddUser = async (values, { resetForm }) => {
    const tempId = Date.now();
    const optimisticUser = { ...values, id: tempId };

    setOptimisticUsers(prev => [...prev, optimisticUser]);

    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!response.ok) throw new Error('Failed to add user');

      const savedUser = await response.json();
      setUsers(prev => [...prev.filter(u => u.id !== tempId), savedUser]);
      resetForm();
    } catch (error) {
      console.error('Error:', error);
      setOptimisticUsers(prev => prev.filter(u => u.id !== tempId));
    }
  };

  const handleDelete = async (selectedIds) => {
    const idsToDelete = Array.from(selectedIds);

    setOptimisticUsers(prev => prev.filter(u => !selectedIds.has(u.id)));

    try {
      await Promise.all(
        idsToDelete.map(id =>
          fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
            method: 'DELETE',
          })
        )
      );
      setUsers(prev => prev.filter(u => !selectedIds.has(u.id)));
    } catch (error) {
      console.error('Error deleting:', error);
      setOptimisticUsers(users);
    }
  };

  const handleUpdate = async (updatedRow) => {
    setOptimisticUsers(prev =>
      prev.map(u => u.id === updatedRow.id ? updatedRow : u)
    );

    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/users/${updatedRow.id}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedRow),
        }
      );

      if (!response.ok) throw new Error('Failed to update');

      const savedUser = await response.json();
      setUsers(prev =>
        prev.map(u => u.id === updatedRow.id ? savedUser : u)
      );
    } catch (error) {
      console.error('Error updating:', error);
      setOptimisticUsers(users);
    }
  };

  const renderHeader = (header) => header.label;
  const renderCell = (value) => value;

  return (
    <div className="table-container">
      <h1>Users</h1>
      <Formik
        initialValues={{ name: '', username: '', email: '' }}
        validationSchema={validationSchema}
        onSubmit={handleAddUser}
      >
        <Form className="comment-form">
          <div>
            <Field type="text" name="name" placeholder="Name" />
            <ErrorMessage name="name" component="div" className="error" />
          </div>
          <div>
            <Field type="text" name="username" placeholder="Username" />
            <ErrorMessage name="username" component="div" className="error" />
          </div>
          <div>
            <Field type="email" name="email" placeholder="Email" />
            <ErrorMessage name="email" component="div" className="error" />
          </div>
          <button type="submit">Add User</button>
        </Form>
      </Formik>
      <DataSet
        headers={headers}
        data={optimisticUsers}
        renderHeader={renderHeader}
        renderCell={renderCell}
        onDelete={handleDelete}
        onUpdate={handleUpdate}
      />
    </div>
  );
};

export default UsersTable;