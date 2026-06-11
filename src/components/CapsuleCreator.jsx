import React, { useState, useRef } from 'react';

export default function CapsuleCreator({ onNext }) {
  const [letter, setLetter] = useState('');
  const [files, setFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles([...files, ...droppedFiles]);
  };

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles([...files, ...selectedFiles]);
  };

  const handleContinue = () => {
    setIsProcessing(true);
    // Pass the collected data back up to App.jsx
    setTimeout(() => {
      setIsProcessing(false);
      onNext({ letter, files });
    }, 500);
  };

  return (
    <div style={{ width: '100%', maxWidth: '800px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--color-primary)' }}>What will you leave behind?</h2>
      
      <div className="form-group" style={{ marginBottom: '1rem' }}>
        <label style={{ fontSize: '1.1rem', color: '#666' }}>Write a letter...</label>
        <textarea 
          className="form-control" 
          rows="4" 
          placeholder="My dearest..."
          value={letter}
          onChange={(e) => setLetter(e.target.value)}
          style={{ resize: 'vertical' }}
        />
      </div>

      <div className="form-group" style={{ marginBottom: '1rem' }}>
        <label style={{ fontSize: '1.1rem', color: '#666' }}>Upload Documents & Media</label>
        <input 
          type="file" 
          multiple 
          ref={fileInputRef}
          onChange={handleFileSelect} 
          style={{ display: 'none' }} 
        />

        <div 
          className="upload-area"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleFileDrop}
          onClick={() => fileInputRef.current.click()}
          style={{ padding: '1.5rem' }}
        >
          <p style={{ color: '#888', fontStyle: 'italic', fontSize: '1rem' }}>
            Drag and drop files here, or <span style={{ color: 'var(--color-primary)', textDecoration: 'underline' }}>click to browse</span> your device.
          </p>
          {files.length > 0 && (
            <div style={{ marginTop: '1rem', color: 'var(--color-primary)', fontWeight: '500', fontSize: '1rem' }}>
              {files.length} file(s) attached:
              <ul style={{ listStyleType: 'none', padding: 0, marginTop: '0.2rem', color: '#555', fontSize: '0.85rem' }}>
                {files.slice(0, 3).map((f, i) => (
                  <li key={i}>{f.name}</li>
                ))}
                {files.length > 3 && <li>...and {files.length - 3} more</li>}
              </ul>
            </div>
          )}
        </div>
      </div>

      <button 
        className="btn-smooth" 
        style={{ width: '100%', maxWidth: '800px', marginTop: '0.5rem', fontSize: '1.2rem', padding: '14px 40px' }}
        onClick={handleContinue}
        disabled={isProcessing}
      >
        {isProcessing ? 'Processing...' : 'Seal & Continue'}
      </button>
    </div>
  );
}
