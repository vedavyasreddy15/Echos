import { useState, useEffect } from 'react';
import './index.css';
import Logo from './components/Logo';
import CapsuleCreator from './components/CapsuleCreator';
import RecipientFlow from './components/RecipientFlow';
import StickersBackground from './components/StickersBackground';
import SealAnimation from './components/SealAnimation';
import TrackCapsules from './components/TrackCapsules';

function App() {
  const [slide, setSlide] = useState('landing'); 
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [animationDone, setAnimationDone] = useState(false);
  
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

  // Effect to sync animation completion and upload success
  useEffect(() => {
    if (uploadSuccess && animationDone) {
      setIsAnimating(false);
      setSlide('done');
    }
  }, [uploadSuccess, animationDone]);

  const handleComplete = async (deliveryData) => {
    setIsSubmitting(true);
    setIsAnimating(true); // Trigger the cinematic sequence immediately
    setUploadSuccess(false);
    setAnimationDone(false);

    // Construct FormData payload for the backend API
    const formData = new FormData();
    formData.append('letter', capsuleData.letter);
    
    // Append all selected files
    if (capsuleData.files && capsuleData.files.length > 0) {
      capsuleData.files.forEach(f => {
        formData.append('files', f);
      });
    }

    // Append all delivery/recipient fields
    Object.keys(deliveryData).forEach(key => {
      if (deliveryData[key]) {
         formData.append(key, deliveryData[key]);
      }
    });

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/capsules`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setIsSubmitting(false);
        setUploadSuccess(true);
      } else {
        alert('Failed to save capsule. Please try again.');
        setIsSubmitting(false);
        setIsAnimating(false);
      }
    } catch (error) {
      console.error('API Error:', error);
      alert("Network error while saving capsule.");
      setIsSubmitting(false);
      setIsAnimating(false);
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
            <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', marginTop: '2rem' }}>
              <button className="btn-smooth" onClick={handleCreateClick} style={{ position: 'relative', zIndex: 10, minWidth: '240px', padding: '1rem 2rem' }}>
                Create Time Capsule
              </button>
              <button className="btn-smooth" onClick={() => setSlide('tracking')} style={{ position: 'relative', zIndex: 10, background: '#fdf5e6', color: '#c1121f', border: '2px solid #c1121f', minWidth: '240px', padding: '1rem 2rem' }}>
                Track My Capsules
              </button>
            </div>
          </div>
        )}

        {slide === 'tracking' && (
          <TrackCapsules onBack={() => setSlide('landing')} />
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
              Your time capsule has been safely sealed. We will deliver it exactly when the time comes.
            </p>
          </div>
        )}

        {/* Cinematic Sealing Animation */}
        {isAnimating && <SealAnimation onComplete={() => setAnimationDone(true)} />}

      </main>
    </div>
  );
}

export default App;
