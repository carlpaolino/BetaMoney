import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { LocalStorageService } from '../services/localStorageService';
import { ReimbursementRequest, RequestStatus, UserRole } from '../types';
import { formatCurrency, formatDateLong } from '../utils/formatters';

interface RequestDetailProps {
  request: ReimbursementRequest;
  onClose: () => void;
  onRequestUpdated: (updatedRequest: ReimbursementRequest) => void;
}

const RequestDetail: React.FC<RequestDetailProps> = ({ request, onClose, onRequestUpdated }) => {
  const { currentUser } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const [showFullScreenImage, setShowFullScreenImage] = useState(false);
  const [currentRequest, setCurrentRequest] = useState(request);

  const updateStatus = async (newStatus: RequestStatus) => {
    if (currentUser?.role !== UserRole.OWNER) return;

    setIsUpdating(true);

    try {
      LocalStorageService.updateRequestStatus(currentRequest.id, newStatus);
      const updatedRequest = { ...currentRequest, status: newStatus, updatedAt: new Date() };
      setCurrentRequest(updatedRequest);
      onRequestUpdated(updatedRequest);
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Request Details</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          <div className="detail-container" style={{ padding: 0 }}>
            {/* Header */}
            <div className="detail-header">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <h2 style={{ marginBottom: '8px', color: 'var(--text-primary)' }}>
                    {currentRequest.description}
                  </h2>
                  <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
                    {formatDateLong(currentRequest.createdAt)}
                  </p>
                </div>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--beta-navy)' }}>
                  {formatCurrency(currentRequest.amount)}
                </div>
              </div>
              <div>
                <span
                  className={`status-badge ${
                    currentRequest.status === RequestStatus.PENDING ? 'status-pending' : 'status-approved'
                  }`}
                >
                  {currentRequest.status === RequestStatus.PENDING ? 'Pending' : 'Approved'}
                </span>
              </div>
            </div>

            {/* Details Section */}
            <div className="detail-section">
              <h3 style={{ marginBottom: '16px' }}>Details</h3>
              <div className="detail-row">
                <span className="detail-label">Amount</span>
                <span className="detail-value">{formatCurrency(currentRequest.amount)}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Description</span>
                <span className="detail-value">{currentRequest.description}</span>
              </div>
              {currentRequest.category && (
                <div className="detail-row">
                  <span className="detail-label">Category</span>
                  <span className="detail-value">{currentRequest.category}</span>
                </div>
              )}
              <div className="detail-row">
                <span className="detail-label">Submitted</span>
                <span className="detail-value">{formatDateLong(currentRequest.createdAt)}</span>
              </div>
              {currentRequest.updatedAt.getTime() !== currentRequest.createdAt.getTime() && (
                <div className="detail-row">
                  <span className="detail-label">Last Updated</span>
                  <span className="detail-value">{formatDateLong(currentRequest.updatedAt)}</span>
                </div>
              )}
              {currentUser?.role === UserRole.OWNER && (
                <div className="detail-row">
                  <span className="detail-label">User ID</span>
                  <span className="detail-value">{currentRequest.userId}</span>
                </div>
              )}
            </div>

            {/* Receipt Image Section */}
            {currentRequest.imageURL && (
              <div className="detail-section">
                <h3 style={{ marginBottom: '16px' }}>Receipt</h3>
                <img
                  src={currentRequest.imageURL}
                  alt="Receipt"
                  className="receipt-image"
                  onClick={() => setShowFullScreenImage(true)}
                />
                <p style={{ fontSize: '14px', color: 'var(--text-light)', marginTop: '8px' }}>
                  Click to view full size
                </p>
              </div>
            )}

            {/* Status Control for Treasurer */}
            {currentUser?.role === UserRole.OWNER && (
              <div className="detail-section">
                <h3 style={{ marginBottom: '16px' }}>Status Control</h3>
                <div className="status-controls">
                  <button
                    className="btn btn-status btn-pending"
                    onClick={() => updateStatus(RequestStatus.PENDING)}
                    disabled={isUpdating || currentRequest.status === RequestStatus.PENDING}
                  >
                    {isUpdating && currentRequest.status !== RequestStatus.PENDING ? (
                      <>
                        <div className="spinner" style={{ width: '16px', height: '16px' }} />
                        Updating...
                      </>
                    ) : (
                      'Mark as Pending'
                    )}
                  </button>
                  <button
                    className="btn btn-status btn-approved"
                    onClick={() => updateStatus(RequestStatus.APPROVED)}
                    disabled={isUpdating || currentRequest.status === RequestStatus.APPROVED}
                  >
                    {isUpdating && currentRequest.status !== RequestStatus.APPROVED ? (
                      <>
                        <div className="spinner" style={{ width: '16px', height: '16px' }} />
                        Updating...
                      </>
                    ) : (
                      'Mark as Approved'
                    )}
                  </button>
                </div>
                <p style={{ fontSize: '14px', color: 'var(--text-light)', marginTop: '8px' }}>
                  Status changes are saved automatically to your browser's local storage.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Full-screen image modal */}
      {showFullScreenImage && currentRequest.imageURL && (
        <div className="modal-overlay" style={{ zIndex: 1001 }}>
          <div className="modal-content" style={{ maxWidth: '95vw', maxHeight: '95vh' }}>
            <div className="modal-header">
              <h3>Receipt Image</h3>
              <button className="modal-close" onClick={() => setShowFullScreenImage(false)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <img
                src={currentRequest.imageURL}
                alt="Receipt - Full Size"
                className="fullscreen-image"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestDetail; 