import React, { useState, useEffect } from 'react';
import { useOptimistic } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import DataSet from './DataSet';
import './TableStyles.css';

const AlbumsTable = () => {
  const [albums, setAlbums] = useState([]);
  const [optimisticAlbums, setOptimisticAlbums] = useOptimistic(albums);

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/albums')
      .then(response => response.json())
      .then(data => setAlbums(data))
      .catch(error => console.error('Error fetching albums:', error));
  }, []);

  const headers = [
    { key: 'id', label: 'ID' },
    { key: 'userId', label: 'User ID' },
    { key: 'title', label: 'Title' },
  ];

  const validationSchema = Yup.object({
    userId: Yup.number().required('Required').min(1, 'Must be at least 1'),
    title: Yup.string().required('Required'),
  });

  const handleAddAlbum = async (values, { resetForm }) => {
    const tempId = Date.now();
    const optimisticAlbum = { ...values, id: tempId };

    setOptimisticAlbums(prev => [...prev, optimisticAlbum]);

    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/albums', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!response.ok) throw new Error('Failed to add album');

      const savedAlbum = await response.json();
      setAlbums(prev => [...prev.filter(a => a.id !== tempId), savedAlbum]);
      resetForm();
    } catch (error) {
      console.error('Error:', error);
      setOptimisticAlbums(prev => prev.filter(a => a.id !== tempId));
    }
  };

  const handleDelete = async (selectedIds) => {
    const idsToDelete = Array.from(selectedIds);

    setOptimisticAlbums(prev => prev.filter(a => !selectedIds.has(a.id)));

    try {
      await Promise.all(
        idsToDelete.map(id =>
          fetch(`https://jsonplaceholder.typicode.com/albums/${id}`, {
            method: 'DELETE',
          })
        )
      );
      setAlbums(prev => prev.filter(a => !selectedIds.has(a.id)));
    } catch (error) {
      console.error('Error deleting:', error);
      setOptimisticAlbums(albums);
    }
  };

  const handleUpdate = async (updatedRow) => {
    setOptimisticAlbums(prev =>
      prev.map(a => a.id === updatedRow.id ? updatedRow : a)
    );

    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/albums/${updatedRow.id}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedRow),
        }
      );

      if (!response.ok) throw new Error('Failed to update');

      const savedAlbum = await response.json();
      setAlbums(prev =>
        prev.map(a => a.id === updatedRow.id ? savedAlbum : a)
      );
    } catch (error) {
      console.error('Error updating:', error);
      setOptimisticAlbums(albums);
    }
  };

  const renderHeader = (header) => header.label;
  const renderCell = (value) => value;

  return (
    <div className="table-container">
      <h1>Albums</h1>
      <Formik
        initialValues={{ userId: 1, title: '' }}
        validationSchema={validationSchema}
        onSubmit={handleAddAlbum}
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
          <button type="submit">Add Album</button>
        </Form>
      </Formik>
      <DataSet
        headers={headers}
        data={optimisticAlbums}
        renderHeader={renderHeader}
        renderCell={renderCell}
        onDelete={handleDelete}
        onUpdate={handleUpdate}
      />
    </div>
  );
};

export default AlbumsTable;