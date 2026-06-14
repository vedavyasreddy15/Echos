import React, { useState } from 'react';

export default function TrackCapsules({ onBack }) {
  const [email, setEmail] = useState('');
  const [capsules, setCapsules] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!email) return;
    
    setLoading(true);
    setError('');
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/capsules/track?email=${encodeURIComponent(email)}`);
      if (!response.ok) throw new Error('Failed to fetch tracking data');
      
      const data = await response.json();
      setCapsules(data);
      setHasSearched(true);
    } catch (err) {
      setError('Could not connect to server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: '1000px', margin: '0 auto', animation: 'fadeIn 0.5s ease-out' }}>
      <button onClick={onBack} className="btn-smooth" style={{ background: 'transparent', border: '2px solid #c1121f', color: '#c1121f', padding: '0.6rem 1.5rem', marginBottom: '3rem', fontSize: '1rem', fontWeight: 'bold' }}>
        ← Back to Home
      </button>

      <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem', color: 'var(--color-primary)' }}>Know Your Messages</h1>
      <p style={{ fontSize: '1.2rem', color: '#555', marginBottom: '2.5rem', lineHeight: '1.5' }}>
        Enter the email address you used for the Official Receipt to view the delivery status of all your time capsules.
      </p>

      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem', marginBottom: '4rem', background: '#fff', padding: '0.5rem', borderRadius: '50px', boxShadow: '0 8px 20px rgba(0,0,0,0.06)' }}>
        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          placeholder="Enter the sender email..." 
          className="form-control" 
          style={{ flex: 1, padding: '1rem 1.5rem', fontSize: '1.1rem', border: 'none', borderRadius: '50px', background: 'transparent', outline: 'none' }} 
          required 
        />
        <button type="submit" className="btn-smooth" disabled={loading} style={{ padding: '0 2.5rem', borderRadius: '50px', minWidth: '160px', fontWeight: 'bold' }}>
          {loading ? 'Searching...' : 'Track Legacy'}
        </button>
      </form>

      {error && <p style={{ color: '#c1121f', marginBottom: '2rem' }}>{error}</p>}

      {hasSearched && (
        <div style={{ background: '#fffcf7', padding: '3rem', borderRadius: '16px', border: '1px solid #f1e0c6', boxShadow: '0 10px 30px rgba(0,0,0,0.04)' }}>
          <h2 style={{ fontSize: '2.2rem', marginBottom: '2rem', color: '#c1121f', textAlign: 'center' }}>Your Sealed Legacies</h2>
          
          {capsules.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
              <p style={{ color: '#666', fontSize: '1.2rem', marginBottom: '1rem' }}>We couldn't find any capsules sent by this email address.</p>
              <p style={{ color: '#999', fontSize: '0.9rem' }}>If you created a capsule before we added the email requirement, it might not appear here.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '2rem' }}>
              {capsules.map(c => (
                <div key={c._id} style={{ background: '#fff', padding: '2rem', borderRadius: '12px', borderLeft: `6px solid ${c.status === 'delivered' ? '#4caf50' : '#c1121f'}`, boxShadow: '0 4px 15px rgba(0,0,0,0.03)', transition: 'transform 0.2s', cursor: 'default' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', borderBottom: '1px solid #eee', paddingBottom: '1.5rem' }}>
                    <div>
                      <span style={{ fontFamily: 'monospace', background: '#fdf5e6', padding: '4px 8px', borderRadius: '4px', color: '#c1121f', fontWeight: 'bold', fontSize: '0.9rem' }}>Receipt: {c.receiptNumber || 'LEGACY'}</span>
                      <h3 style={{ marginTop: '0.8rem', color: '#333', fontSize: '1.5rem' }}>To: {c.recipientType === 'self' ? 'Your Future Self' : (c.recipientDetails?.fullName || 'Someone Special')}</h3>
                    </div>
                    <span style={{ 
                      background: c.status === 'delivered' ? '#d4edda' : '#fff3cd', 
                      color: c.status === 'delivered' ? '#155724' : '#856404',
                      padding: '6px 14px', borderRadius: '20px', fontSize: '0.9rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px'
                    }}>
                      {c.status}
                    </span>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1.5rem', color: '#666', fontSize: '0.95rem' }}>
                    <div>
                      <strong style={{ color: '#999', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Created</strong><br/>
                      <span style={{ fontSize: '1.1rem', color: '#444' }}>{new Date(c.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div>
                      <strong style={{ color: '#999', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Scheduled For</strong><br/>
                      <span style={{ fontSize: '1.1rem', color: '#444' }}>{new Date(c.deliveryDate).toLocaleDateString('en-US', { timeZone: 'UTC' })} {c.deliveryType === 'virtual' && c.deliveryTime ? `at ${c.deliveryTime}` : ''}</span>
                    </div>
                    <div>
                      <strong style={{ color: '#999', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Type</strong><br/>
                      <span style={{ fontSize: '1.1rem', color: '#444' }}>{c.deliveryType.charAt(0).toUpperCase() + c.deliveryType.slice(1)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
