import React, { useState } from 'react';
import './DataSet.css';

const DataSet = ({
  headers = [],
  data = [],
  renderHeader = (header) => header.label || header.key,
  renderCell = (value) => value,
  onDelete,
  onUpdate,
}) => {
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [editingRow, setEditingRow] = useState(null);
  const [editValues, setEditValues] = useState({});

  const computedHeaders = headers.length > 0
    ? headers
    : data.length > 0
      ? Object.keys(data[0]).map((key) => ({ key, label: key }))
      : [];

  const handleRowSelection = (rowId, event) => {
    const isCtrlPressed = event.ctrlKey || event.metaKey;
    setSelectedRows(prev => {
      const newSet = new Set(prev);
      if (isCtrlPressed) {
        newSet.has(rowId) ? newSet.delete(rowId) : newSet.add(rowId);
      } else {
        newSet.clear();
        newSet.add(rowId);
      }
      return newSet;
    });
  };

  const handleEditStart = (row) => {
    setEditingRow(row.id);
    setEditValues(row);
  };

  const handleEditChange = (key, value) => {
    setEditValues(prev => ({ ...prev, [key]: value }));
  };

  const handleEditSave = () => {
    onUpdate(editValues);
    setEditingRow(null);
  };

  const handleRowDelete = (rowId) => {
    const singleRowSet = new Set([rowId]);
    onDelete(singleRowSet);
  };

  return (
    <div className="dataset-container">
      {selectedRows.size > 0 && (
        <button 
          onClick={() => onDelete(selectedRows)}
          className="delete-button"
        >
          Delete Selected ({selectedRows.size})
        </button>
      )}
      <table className="dataset-table">
        <thead>
          <tr>
            <th className="selection-column"></th>
            {computedHeaders.map((header, index) => (
              <th key={index} className={`column-${header.key}`}>
                {renderHeader(header)}
              </th>
            ))}
            <th className="column-actions">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr
              key={row.id}
              className={selectedRows.has(row.id) ? 'selected' : ''}
            >
              <td
                className="selection-column"
                onClick={(event) => handleRowSelection(row.id, event)}
              />
              {computedHeaders.map((header) => (
                <td key={header.key} className={`column-${header.key}`}>
                  {editingRow === row.id ? (
                    <input
                      value={editValues[header.key] || ''}
                      onChange={(e) => handleEditChange(header.key, e.target.value)}
                    />
                  ) : (
                    renderCell(row[header.key])
                  )}
                </td>
              ))}
              <td className="actions-cell column-actions">
                {editingRow === row.id ? (
                  <button onClick={handleEditSave}>Save</button>
                ) : (
                  <>
                    <button 
                      onClick={() => handleEditStart(row)}
                      className="edit-button"
                    >
                      Edit
                    </button>
                    {/* <button 
                      onClick={() => handleRowDelete(row.id)}
                      className="delete-row-button"
                    >
                      Delete
                    </button> */}
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataSet;