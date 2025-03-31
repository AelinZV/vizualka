import React from 'react';
import DataSet from './DataSet';
import './App.css';

const App = () => {
  const data = [
    { name: 'ksusha', admissionDateUN: '04-08-2005' },
    { name: 'bibki', admissionDateUN: '30-05-2012' },
    { name: 'Eredin', admissionDateUN: '13-12-1200' },
    { name: 'neverlend', admissionDateUN: '00-00-0000' },
    { name: 'ruslan', admissionDateUN: '07-03-2005' },
  ];

  const headers = [
    { key: 'name', label: 'Name' },
    { key: 'admissionDateUN', label: 'Date' },
  ];

  const renderHeader = (header) => header.label;

  const renderCell = (value) => value;

  return (
    <div className="app">
      <h1> </h1>
      <DataSet
        headers={headers}
        data={data}
        renderHeader={renderHeader}
        renderCell={renderCell}
      />
    </div>
  );
};

export default App;