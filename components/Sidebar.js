import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2>Navigation</h2>
      <ul>
        <li>
          <NavLink to="/comments" activeClassName="active">
            Comments
          </NavLink>
        </li>
        <li>
          <NavLink to="/posts" activeClassName="active">
            Posts
          </NavLink>
        </li>
        <li>
          <NavLink to="/albums" activeClassName="active">
            Albums
          </NavLink>
        </li>
        <li>
          <NavLink to="/todos" activeClassName="active">
            Todos
          </NavLink>
        </li>
        <li>
          <NavLink to="/users" activeClassName="active">
            Users
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;