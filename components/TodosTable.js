import React, { useState, useEffect } from 'react';
import { useOptimistic } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import DataSet from './DataSet';
import './TableStyles.css';

const TodosTable = () => {
  const [todos, setTodos] = useState([]);
  const [optimisticTodos, setOptimisticTodos] = useOptimistic(todos);

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/todos')
      .then(response => response.json())
      .then(data => setTodos(data))
      .catch(error => console.error('Error fetching todos:', error));
  }, []);

  const headers = [
    { key: 'id', label: 'ID' },
    { key: 'userId', label: 'User ID' },
    { key: 'title', label: 'Title' },
    { key: 'completed', label: 'Completed' },
  ];

  const validationSchema = Yup.object({
    userId: Yup.number().required('Required').min(1, 'Must be at least 1'),
    title: Yup.string().required('Required'),
    completed: Yup.boolean().required('Required'),
  });

  const handleAddTodo = async (values, { resetForm }) => {
    const tempId = Date.now();
    const optimisticTodo = { ...values, id: tempId };

    setOptimisticTodos(prev => [...prev, optimisticTodo]);

    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!response.ok) throw new Error('Failed to add todo');

      const savedTodo = await response.json();
      setTodos(prev => [...prev.filter(t => t.id !== tempId), savedTodo]);
      resetForm();
    } catch (error) {
      console.error('Error:', error);
      setOptimisticTodos(prev => prev.filter(t => t.id !== tempId));
    }
  };

  const handleDelete = async (selectedIds) => {
    const idsToDelete = Array.from(selectedIds);

    setOptimisticTodos(prev => prev.filter(t => !selectedIds.has(t.id)));

    try {
      await Promise.all(
        idsToDelete.map(id =>
          fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
            method: 'DELETE',
          })
        )
      );
      setTodos(prev => prev.filter(t => !selectedIds.has(t.id)));
    } catch (error) {
      console.error('Error deleting:', error);
      setOptimisticTodos(todos);
    }
  };

  const handleUpdate = async (updatedRow) => {
    setOptimisticTodos(prev =>
      prev.map(t => t.id === updatedRow.id ? updatedRow : t)
    );

    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/todos/${updatedRow.id}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedRow),
        }
      );

      if (!response.ok) throw new Error('Failed to update');

      const savedTodo = await response.json();
      setTodos(prev =>
        prev.map(t => t.id === updatedRow.id ? savedTodo : t)
      );
    } catch (error) {
      console.error('Error updating:', error);
      setOptimisticTodos(todos);
    }
  };

  const renderHeader = (header) => header.label;
  const renderCell = (value) => (typeof value === 'boolean' ? value.toString() : value);

  return (
    <div className="table-container">
      <h1>Todos</h1>
      <Formik
        initialValues={{ userId: 1, title: '', completed: false }}
        validationSchema={validationSchema}
        onSubmit={handleAddTodo}
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
            <Field as="select" name="completed">
              <option value="false">False</option>
              <option value="true">True</option>
            </Field>
            <ErrorMessage name="completed" component="div" className="error" />
          </div>
          <button type="submit">Add Todo</button>
        </Form>
      </Formik>
      <DataSet
        headers={headers}
        data={optimisticTodos}
        renderHeader={renderHeader}
        renderCell={renderCell}
        onDelete={handleDelete}
        onUpdate={handleUpdate}
      />
    </div>
  );
};

export default TodosTable;