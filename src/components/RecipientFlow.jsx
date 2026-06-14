import React, { useState } from 'react';

export default function RecipientFlow({ onComplete, isSubmitting }) {
  const [step, setStep] = useState(1);
  const [recipientType, setRecipientType] = useState(null); // 'self' or 'special'
  const [deliveryType, setDeliveryType] = useState(null); // 'virtual' or 'physical'
  
  // Form fields
  const [formData, setFormData] = useState({
    senderName: '', senderEmail: '', email: '', fullName: '', street: '', city: '', state: '', country: '', zipCode: '', deliveryDate: '', deliveryTime: '12:00'
  });

  const handleRecipientSelect = (type) => {
    setRecipientType(type);
    setTimeout(() => setStep(2), 300);
  };

  const handleDeliverySelect = (type) => {
    setDeliveryType(type);
    setTimeout(() => setStep(3), 300);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFinalize = () => {
    if (!formData.deliveryDate) {
      alert("Please select a delivery date.");
      return;
    }

    const selectedDateTime = new Date(`${formData.deliveryDate}T${deliveryType === 'virtual' ? formData.deliveryTime : '12:00'}`);
    if (selectedDateTime <= new Date()) {
      alert("Please select a delivery date and time in the future. Time capsules cannot be sent to the past!");
      return;
    }

    let finalEmail = formData.email;
    if (recipientType === 'self' && deliveryType === 'virtual') {
      finalEmail = formData.senderEmail;
    }

    // Pass everything up to App.jsx for API submission
    onComplete({
      recipientType,
      deliveryType,
      ...formData,
      email: finalEmail
    });
  };

  const getTodayString = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  return (
    <div style={{ width: '100%', maxWidth: '800px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      {step === 1 && (
        <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--color-primary)' }}>Whom do you want to send this to?</h2>
          <div className="options-grid">
            <div 
              className={`option-card ${recipientType === 'self' ? 'selected' : ''}`}
              onClick={() => handleRecipientSelect('self')}
            >
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>My Future Self</h3>
              <p style={{ color: '#666' }}>A letter and memories to ground you in the future.</p>
            </div>
            <div 
              className={`option-card ${recipientType === 'special' ? 'selected' : ''}`}
              onClick={() => handleRecipientSelect('special')}
            >
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Someone Special</h3>
              <p style={{ color: '#666' }}>A surprise gift for a loved one, delivered at the perfect time.</p>
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--color-primary)' }}>
            How would you like to send this to {recipientType === 'self' ? 'your future self' : 'them'}?
          </h2>
          <div className="options-grid">
            <div 
              className={`option-card ${deliveryType === 'virtual' ? 'selected' : ''}`}
              onClick={() => handleDeliverySelect('virtual')}
            >
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Virtual Delivery</h3>
              <p style={{ color: '#666' }}>Email or text message containing a secure link.</p>
            </div>
            <div 
              className={`option-card ${deliveryType === 'physical' ? 'selected' : ''}`}
              onClick={() => handleDeliverySelect('physical')}
            >
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Physical Delivery</h3>
              <p style={{ color: '#666' }}>Printed letters, framed pictures, and a USB of audio/video delivered to their door.</p>
            </div>
          </div>
        </div>
      )}

      {step === 3 && (
        <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--color-primary)' }}>Delivery Details</h2>
          
          {/* SENDER INFO */}
          <div style={{ background: '#fdf5e6', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#333' }}>Your Details (For Official Receipt)</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>Your Name</label>
                <input type="text" name="senderName" value={formData.senderName} onChange={handleChange} className="form-control" placeholder="Jane Doe" required />
              </div>
              <div className="form-group">
                <label>Your Email</label>
                <input type="email" name="senderEmail" value={formData.senderEmail} onChange={handleChange} className="form-control" placeholder="jane@example.com" required />
              </div>
            </div>
          </div>
          
          {deliveryType === 'virtual' ? (
            <>
              {recipientType !== 'self' && (
                <div className="form-group">
                  <label>Recipient Email Address</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} className="form-control" placeholder="recipient@example.com" />
                </div>
              )}
            </>
          ) : (
            <>
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="form-control" placeholder="John Doe" />
              </div>
              <div className="form-group">
                <label>Street Address</label>
                <input type="text" name="street" value={formData.street} onChange={handleChange} className="form-control" placeholder="123 Nostalgia Lane" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>City</label>
                  <input type="text" name="city" value={formData.city} onChange={handleChange} className="form-control" placeholder="City" />
                </div>
                <div className="form-group">
                  <label>State / Province</label>
                  <input type="text" name="state" value={formData.state} onChange={handleChange} className="form-control" placeholder="State" />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Country</label>
                  <input type="text" name="country" value={formData.country} onChange={handleChange} className="form-control" placeholder="Country" />
                </div>
                <div className="form-group">
                  <label>Zip Code</label>
                  <input type="text" name="zipCode" value={formData.zipCode} onChange={handleChange} className="form-control" placeholder="Zip" />
                </div>
              </div>
            </>
          )}

          <div className="form-group" style={{ marginTop: '2rem' }}>
            <label>When should this be delivered?</label>
            <div style={{ display: 'flex', gap: '1rem', maxWidth: '400px' }}>
              <input type="date" name="deliveryDate" min={getTodayString()} value={formData.deliveryDate} onChange={handleChange} className="form-control" style={{ flex: 2 }} />
              {deliveryType === 'virtual' && (
                <input type="time" name="deliveryTime" value={formData.deliveryTime} onChange={handleChange} className="form-control" style={{ flex: 1 }} />
              )}
            </div>
          </div>

          <button 
            className="btn-smooth" 
            style={{ width: '100%', marginTop: '1.5rem' }}
            onClick={handleFinalize}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Uploading to Server...' : 'Finalize Time Capsule'}
          </button>
        </div>
      )}

    </div>
  );
}
