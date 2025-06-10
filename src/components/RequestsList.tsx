import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { LocalStorageService } from '../services/localStorageService';
import { ReimbursementRequest, RequestStatus, UserRole } from '../types';
import { formatCurrency, formatDateShort } from '../utils/formatters';

interface RequestsListProps {
  onNewRequest: () => void;
  onViewRequest: (request: ReimbursementRequest) => void;
}

const RequestsList: React.FC<RequestsListProps> = ({ onNewRequest, onViewRequest }) => {
  const { currentUser, signOut } = useAuth();
  const [requests, setRequests] = useState<ReimbursementRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<ReimbursementRequest[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<RequestStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;

    const loadRequests = () => {
      setIsLoading(true);
      
      try {
        const allRequests = currentUser.role === UserRole.OWNER 
          ? LocalStorageService.getAllRequests()
          : LocalStorageService.getRequestsForUser(currentUser.id);
        
        setRequests(allRequests);
      } catch (error) {
        console.error('Error loading requests:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadRequests();

    // Set up polling to refresh data every 5 seconds (simulates real-time updates)
    const interval = setInterval(loadRequests, 5000);
    return () => clearInterval(interval);
  }, [currentUser]);

  useEffect(() => {
    // Apply filter when requests or selectedFilter changes
    if (selectedFilter) {
      setFilteredRequests(requests.filter(req => req.status === selectedFilter));
    } else {
      setFilteredRequests(requests);
    }
  }, [requests, selectedFilter]);

  const handleFilterChange = (filter: RequestStatus | null) => {
    setSelectedFilter(filter);
  };

  const getNavigationTitle = () => {
    return currentUser?.role === UserRole.OWNER ? 'All Requests' : 'My Requests';
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner" />
        <p>Loading requests...</p>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="header">
        <h1 className="header-title">{getNavigationTitle()}</h1>
        <div className="header-actions">
          {currentUser?.role === UserRole.GUEST && (
            <button className="btn btn-add" onClick={onNewRequest} title="New Request">
              +
            </button>
          )}
          <button className="btn btn-danger" onClick={signOut}>
            Sign Out
          </button>
        </div>
      </header>

      <main className="main-content">
        {/* Filter chips for treasurer */}
        {currentUser?.role === UserRole.OWNER && (
          <div className="filter-chips">
            <button
              className={`filter-chip ${selectedFilter === null ? 'active' : ''}`}
              onClick={() => handleFilterChange(null)}
            >
              All ({requests.length})
            </button>
            <button
              className={`filter-chip ${selectedFilter === RequestStatus.PENDING ? 'active' : ''}`}
              onClick={() => handleFilterChange(RequestStatus.PENDING)}
            >
              Pending ({requests.filter(r => r.status === RequestStatus.PENDING).length})
            </button>
            <button
              className={`filter-chip ${selectedFilter === RequestStatus.APPROVED ? 'active' : ''}`}
              onClick={() => handleFilterChange(RequestStatus.APPROVED)}
            >
              Approved ({requests.filter(r => r.status === RequestStatus.APPROVED).length})
            </button>
          </div>
        )}

        {/* Requests list */}
        {filteredRequests.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📄</div>
            <h3>No requests found</h3>
            {currentUser?.role === UserRole.GUEST && (
              <p>Click the + button to create your first reimbursement request</p>
            )}
            {currentUser?.role === UserRole.OWNER && (
              <p>No requests match the current filter</p>
            )}
          </div>
        ) : (
          <div className="requests-list">
            {filteredRequests.map((request) => (
              <div
                key={request.id}
                className="request-card"
                onClick={() => onViewRequest(request)}
              >
                <div className="request-header">
                  <div className="request-info">
                    <h3>{request.description}</h3>
                    {currentUser?.role === UserRole.OWNER && (
                      <div className="request-meta">User ID: {request.userId}</div>
                    )}
                    <div className="request-meta">{formatDateShort(request.createdAt)}</div>
                    {request.category && (
                      <div className="request-meta">Category: {request.category}</div>
                    )}
                  </div>
                  <div>
                    <div className="request-amount">{formatCurrency(request.amount)}</div>
                    <span
                      className={`status-badge ${
                        request.status === RequestStatus.PENDING ? 'status-pending' : 'status-approved'
                      }`}
                    >
                      {request.status === RequestStatus.PENDING ? 'Pending' : 'Approved'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default RequestsList; 