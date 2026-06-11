import { useState } from 'react';
import './index.css';
import Logo from './components/Logo';
import CapsuleCreator from './components/CapsuleCreator';
import RecipientFlow from './components/RecipientFlow';
import StickersBackground from './components/StickersBackground';

function App() {
  const [slide, setSlide] = useState('landing'); 
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State to hold data from Step 1 (CapsuleCreator)
  const [capsuleData, setCapsuleData] = useState({
    letter: '',
    files: []
  });

  const handleCreateClick = () => {
    setSlide('uploading');
  };

  const handleUploadsDone = (data) => {
    // Save files and letter to state
    setCapsuleData(data);
    setSlide('recipient');
  };

  const handleComplete = async (deliveryData) => {
    setIsSubmitting(true);
    
    // Construct FormData payload for the backend API
    const formData = new FormData();
    formData.append('letter', capsuleData.letter);
    
    // Append all selected files
    capsuleData.files.forEach(f => {
      formData.append('files', f);
    });

    // Append all delivery/recipient fields
    Object.keys(deliveryData).forEach(key => {
      if (deliveryData[key]) {
         formData.append(key, deliveryData[key]);
      }
    });

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      
      // POST to the new Node.js / Express Backend
      const response = await fetch(`${apiUrl}/api/capsules`, {
        method: 'POST',
        body: formData, // fetch handles multipart boundaries automatically
      });

      if (!response.ok) {
        throw new Error('Failed to create capsule');
      }
      
      setSlide('done');
    } catch (error) {
      console.error('API Error:', error);
      alert("Failed to submit to backend. Is the server running on port 3001?");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="app-container">
      <StickersBackground />

      <main>
        {slide === 'landing' && (
          <div className="fullscreen-content slow-fade-in" style={{ width: '100%', maxWidth: '900px', margin: '0 auto' }}>
            <Logo />
            <h1 style={{ fontSize: '3.5rem', marginBottom: '0.5rem', color: 'var(--color-primary)' }}>Preserve Your Legacy</h1>
            <p style={{ fontSize: '1.2rem', marginBottom: '2rem', color: '#555', lineHeight: '1.5' }}>
              Store your most precious memories, letters, and files. 
              <br />
              Schedule them to be sent up to 100 years into the future.
            </p>
            <button className="btn-smooth" onClick={handleCreateClick} style={{ position: 'relative', zIndex: 10 }}>
              Create Time Capsule
            </button>
          </div>
        )}

        {slide === 'uploading' && (
          <div className="fullscreen-content slow-fade-in" style={{ width: '100%', maxWidth: '900px', margin: '0 auto' }}>
            <CapsuleCreator onNext={handleUploadsDone} />
          </div>
        )}

        {slide === 'recipient' && (
          <div className="fullscreen-content slow-fade-in" style={{ width: '100%', maxWidth: '900px', margin: '0 auto' }}>
            <RecipientFlow onComplete={handleComplete} isSubmitting={isSubmitting} />
          </div>
        )}

        {slide === 'done' && (
          <div className="fullscreen-content slow-fade-in" style={{ width: '100%', maxWidth: '900px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem', color: 'var(--color-primary)' }}>Your Legacy is Sealed</h1>
            <p style={{ fontSize: '1.2rem', color: '#555' }}>
              Your time capsule has been safely stored in MongoDB. We will deliver it exactly when the time comes.
            </p>
          </div>
        )}

      </main>
    </div>
  );
}

export default App;
