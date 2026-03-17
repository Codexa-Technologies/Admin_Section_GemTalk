import React from 'react';
import Sidebar from './Sidebar';
import TopBar from './Header';
import '../styles/layout.css';

const Layout = ({ children }) => (
  <div className="layout">
    <Sidebar />
    <div className="main-content">
      <TopBar />
      <div className="page-body">{children}</div>
    </div>
  </div>
);

export default Layout;
