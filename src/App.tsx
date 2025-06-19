import React, { useState } from 'react';
import { AuthProvider, useAuthContext } from './hooks/AuthContext';
import Login from './components/Login';
import RequestsList from './components/RequestsList';
import NewRequest from './components/NewRequest';
import RequestDetail from './components/RequestDetail';
import { ReimbursementRequest } from './types';
import './styles/App.css';

function AppContent() {
  const { isAuthenticated, isLoading } = useAuthContext();
  const [showNewRequest, setShowNewRequest] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<ReimbursementRequest | null>(null);

  const handleNewRequest = () => {
    setShowNewRequest(true);
  };

  const handleNewRequestClose = () => {
    setShowNewRequest(false);
  };

  const handleNewRequestSuccess = () => {
    setShowNewRequest(false);
    // The real-time listener will automatically update the list
  };

  const handleViewRequest = (request: ReimbursementRequest) => {
    setSelectedRequest(request);
  };

  const handleRequestDetailClose = () => {
    setSelectedRequest(null);
  };

  const handleRequestUpdated = (updatedRequest: ReimbursementRequest) => {
    // The real-time listener will automatically update the list
    setSelectedRequest(updatedRequest);
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner" />
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <div className="app">
      <RequestsList
        onNewRequest={handleNewRequest}
        onViewRequest={handleViewRequest}
      />

      {showNewRequest && (
        <NewRequest
          onClose={handleNewRequestClose}
          onSuccess={handleNewRequestSuccess}
        />
      )}

      {selectedRequest && (
        <RequestDetail
          request={selectedRequest}
          onClose={handleRequestDetailClose}
          onRequestUpdated={handleRequestUpdated}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
