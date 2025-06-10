import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { FirestoreService } from '../services/firestoreService';
import { ReimbursementRequest, RequestStatus } from '../types';

interface NewRequestProps {
  onClose: () => void;
  onSuccess: () => void;
}

const NewRequest: React.FC<NewRequestProps> = ({ onClose, onSuccess }) => {
  const { currentUser } = useAuth();
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }

      setSelectedFile(file);
      setError(null);

      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser || !selectedFile) return;

    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Generate request ID
      const requestId = FirestoreService.generateRequestId();

      // Upload image first
      const imageURL = await FirestoreService.uploadImage(selectedFile, requestId);

      // Create request object
      const request: ReimbursementRequest = {
        id: requestId,
        userId: currentUser.id,
        amount: amountValue,
        description,
        category: category || undefined,
        status: RequestStatus.PENDING,
        imageURL,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Save to Firestore
      await FirestoreService.saveRequest(request);

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit request');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = () => {
    return amount && 
           description && 
           selectedFile && 
           parseFloat(amount) > 0 && 
           !isSubmitting;
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>New Reimbursement Request</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          <div className="form-container" style={{ margin: 0, boxShadow: 'none' }}>
            <div className="form-header">
              <div className="form-icon">🧾</div>
              <h3>New Reimbursement Request</h3>
            </div>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Amount</label>
                <div className="amount-input-group">
                  <span className="currency-symbol">$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    className="form-input"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-input textarea"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What was this expense for?"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Category (Optional)</label>
                <input
                  type="text"
                  className="form-input"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Food, Transportation, Supplies, etc."
                />
              </div>

              <div className="form-group">
                <label className="form-label">Receipt Photo</label>
                <div className={`file-upload-area ${selectedFile ? 'has-file' : ''}`}>
                  {selectedFile && previewUrl ? (
                    <div>
                      <img
                        src={previewUrl}
                        alt="Receipt preview"
                        className="preview-image"
                      />
                      <button
                        type="button"
                        className="btn btn-text"
                        onClick={() => {
                          setSelectedFile(null);
                          setPreviewUrl(null);
                        }}
                      >
                        Change Photo
                      </button>
                    </div>
                  ) : (
                    <label htmlFor="file-input" style={{ cursor: 'pointer', display: 'block' }}>
                      <div className="upload-icon">📷</div>
                      <h4>Add Receipt Photo</h4>
                      <p>Click to upload or drag and drop</p>
                      <p style={{ fontSize: '12px', color: '#999' }}>PNG, JPG up to 5MB</p>
                    </label>
                  )}
                  <input
                    id="file-input"
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button
                  type="button"
                  className="btn"
                  onClick={onClose}
                  style={{ flex: 1, backgroundColor: '#6c757d', color: 'white' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={!isFormValid()}
                  style={{ flex: 1 }}
                >
                  {isSubmitting ? (
                    <>
                      <div className="spinner" style={{ width: '16px', height: '16px' }} />
                      Submitting...
                    </>
                  ) : (
                    'Submit Request'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewRequest; 