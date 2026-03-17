import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import AddArticlePage from './pages/AddArticlePage';
import ManageArticlesPage from './pages/ManageArticlesPage';
import './styles/index.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LoginPage />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/add-article"
            element={
              <ProtectedRoute>
                <Layout>
                  <AddArticlePage key="add-article" defaultType="article" />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/add-news"
            element={
              <ProtectedRoute>
                <Layout>
                  <AddArticlePage key="add-news" defaultType="news" />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/add-research"
            element={
              <ProtectedRoute>
                <Layout>
                  <AddArticlePage key="add-research" defaultType="research" />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/manage-articles"
            element={
              <ProtectedRoute>
                <Layout>
                  <ManageArticlesPage defaultType="" />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/manage-news"
            element={
              <ProtectedRoute>
                <Layout>
                  <ManageArticlesPage defaultType="news" />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/manage-research"
            element={
              <ProtectedRoute>
                <Layout>
                  <ManageArticlesPage defaultType="research" />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Redirect unknown routes to dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
